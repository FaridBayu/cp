const axios = require('axios');
const https = require('https');
const JisdorModel = require('../models/Jisdor.model');

// 1. Konfigurasi HTTPS Agent (Bypass SSL Legacy Server BI)
const agent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  minVersion: 'TLSv1',
  ciphers: 'DEFAULT:@SECLEVEL=0'
});

// 2. Header Penyamaran Browser (Anti-Blokir WAF)
const getBrowserHeaders = (length) => ({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': length,
    'Host': 'www.bi.go.id',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
});

// --- HELPER FUNCTIONS (Private) ---

// Delay agar tidak dianggap spam oleh server BI
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Parser XML Universal
const parseXmlResult = (rawXml, targetDate = null) => {
    // Cek jika terkena blokir HTML
    if (rawXml.trim().startsWith("<!DOCTYPE") || rawXml.includes("<html")) return null;

    // Pola tag yang mungkin muncul
    let tagNilai = '<beli_subkursasing>'; 
    if (!rawXml.includes(tagNilai)) tagNilai = '<nilai_kurs>';
    if (!rawXml.includes(tagNilai)) tagNilai = '<nil_subkursasing>';

    if (rawXml.includes(tagNilai)) {
        const startNilai = rawXml.indexOf(tagNilai) + tagNilai.length;
        const closingTag = tagNilai.replace('<', '</');
        const endNilai = rawXml.indexOf(closingTag, startNilai);
        const kursNumber = parseFloat(rawXml.substring(startNilai, endNilai));

        let tglText = targetDate;
        const tagTgl = '<tgl_subkursasing>';
        if (rawXml.includes(tagTgl)) {
            const startTgl = rawXml.indexOf(tagTgl) + tagTgl.length;
            const endTgl = rawXml.indexOf('T', startTgl); 
            tglText = rawXml.substring(startTgl, endTgl);
        }
        return { 
            tanggal_kurs: tglText || targetDate, 
            nilai_kurs: kursNumber, 
            sumber: 'Direct from BI (Live)' 
        };
    }
    return null;
};

// Fetcher 1: Harian (Endpoint: getSubKursJisdor1)
const fetchFromBI = async () => {
    const url = 'https://www.bi.go.id/biwebservice/wskursbi.asmx/getSubKursJisdor1';
    try {
        const response = await axios.post(url, {}, {
            httpsAgent: agent,
            headers: getBrowserHeaders(0),
            timeout: 30000
        });
        return parseXmlResult(response.data);
    } catch (error) {
        console.error("Error fetching BI (Daily):", error.message);
        throw error;
    }
};

// Fetcher 2: Tanggal Spesifik (Endpoint: getSubKursJisdor4)
const fetchFromBIByDate = async (targetDate) => {
    const url = 'https://www.bi.go.id/biwebservice/wskursbi.asmx/getSubKursJisdor4';
    const params = new URLSearchParams();
    params.append('startDate', targetDate);

    try {
        const response = await axios.post(url, params.toString(), {
            httpsAgent: agent,
            headers: getBrowserHeaders(params.toString().length),
            timeout: 30000
        });
        return parseXmlResult(response.data, targetDate);
    } catch (error) {
        console.error(`   ❌ Gagal fetch ${targetDate}: ${error.message}`);
        return null;
    }
};

// --- CLASS SERVICE UTAMA ---

class JisdorService {
    
    // [FIX TIMEZONE] Gunakan 'sv-SE' agar tanggal sesuai WIB (YYYY-MM-DD)
    static formatDate(dateObj) {
        if(!dateObj) return null;
        const d = new Date(dateObj);
        return d.toLocaleDateString('sv-SE'); 
    }

    static async syncToday() {
        let attempt = 0;
        let checkDate = new Date(); 

        console.log("🔄 [SYNC-DAILY] Mencari data terbaru...");

        while (attempt < 7) {
            const dateStr = this.formatDate(checkDate);
            
            const dbData = await JisdorModel.getByDate(dateStr);
            if (dbData) {
                console.log(`   ✅ Data ${dateStr} sudah ada di DB.`);
                return { ...dbData, tanggal_kurs: this.formatDate(dbData.tanggal_kurs) };
            }

            // Gunakan fetchFromBIByDate karena lebih stabil untuk tanggal spesifik
            const data = await fetchFromBIByDate(dateStr);

            if (data) {
                console.log(`   ✅ DATA BARU DITEMUKAN: ${dateStr}`);
                await JisdorModel.create(data);
                return data; 
            }
            
            // Mundur 1 hari
            checkDate.setDate(checkDate.getDate() - 1);
            attempt++;
            await delay(1000); // Jeda agar tidak dianggap spam
        }
        throw new Error("Gagal menemukan data JISDOR terbaru dalam 7 hari terakhir.");
    }

    // 2. SYNC 30 HARI (Backfill) - Untuk Inisialisasi Awal
    static async sync30day() {
        console.log("🔄 [SYNC-30DAY] Memulai Sync 30 Hari ke Belakang...");
        
        let successCount = 0;
        let skippedCount = 0;
        const today = new Date(); 

        // Loop 0 s.d. 29 (30 Hari)
        for (let i = 0; i < 30; i++) {
            const targetDate = new Date();
            targetDate.setDate(today.getDate() - i);
            const dateStr = this.formatDate(targetDate);

            try {
                // Cek DB
                const dbData = await JisdorModel.getByDate(dateStr);
                
                if (dbData) {
                    skippedCount++;
                } else {
                    console.log(`   👉 Fetching BI: ${dateStr}...`);
                    const dataBI = await fetchFromBIByDate(dateStr);

                    if (dataBI) {
                        await JisdorModel.create(dataBI);
                        successCount++;
                        console.log(`      ✅ Disimpan.`);
                    } else {
                        console.log(`      ⚠️ Kosong/Libur.`);
                    }
                    await delay(1000); 
                }
            } catch (error) {
                console.error(`   ❌ Skip ${dateStr} (Error)`);
            }
        }

        return {
            synced: successCount,
            skipped: skippedCount,
            total_checked: 30
        };
    }
    // --- READ METHODS ---

    static async getCurrentRate() {
        const data = await JisdorModel.getLatest();
        return data ? { ...data, tanggal_kurs: this.formatDate(data.tanggal_kurs) } : null;
    }
    // Pagination +1 (Untuk Frontend Percent Calculation)
    static async getHistoryRates(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const fetchLimit = parseInt(limit) + 1;
        
        const rates = await JisdorModel.getHistory(fetchLimit, offset);
        const totalItems = await JisdorModel.countAll();
        const totalPages = Math.ceil(totalItems / limit);

        const cleanRates = rates.map(item => ({
            id_kurs: item.id_kurs,
            nilai_kurs: item.nilai_kurs,
            tanggal_kurs: this.formatDate(item.tanggal_kurs)
        }));

        return { 
            rates: cleanRates,
            pagination: { currentPage: parseInt(page), totalPages, totalItems, perPage: parseInt(limit) }
        };
    }

    // Smart Search (Untuk Detail Tanggal)
    static async getRateByDate(targetDateString) {
        let checkDate = new Date(targetDateString);
        let attempt = 0;
        const MAX_RETRIES = 7;

        console.log(`🔍 [SMART SEARCH] Target: ${targetDateString}`);

        while (attempt < MAX_RETRIES) {
            const currentStr = this.formatDate(checkDate);
            
            // 1. Cek DB
            const dbData = await JisdorModel.getByDate(currentStr);
            if (dbData) {
                return {
                    id_kurs: dbData.id_kurs,
                    nilai_kurs: dbData.nilai_kurs,
                    tanggal_kurs: this.formatDate(dbData.tanggal_kurs),
                    keterangan: currentStr === targetDateString ? 'Tepat' : `Data mundur ke tanggal ${currentStr}`,
                    sumber: 'Database Cache'
                };
            }

            // 2. Cek BI
            console.log(`   👉 Cek Live BI: ${currentStr}...`);
            const liveData = await fetchFromBIByDate(currentStr);

            if (liveData) {
                await JisdorModel.create(liveData);
                return { 
                    ...liveData, 
                    keterangan: currentStr === targetDateString ? 'Tepat' : `Data mundur ke tanggal ${currentStr}`
                };
            }

            // 3. Mundur
            checkDate.setDate(checkDate.getDate() - 1);
            attempt++;
            await delay(1000);
        }

        return null;
    }
}

module.exports = JisdorService;
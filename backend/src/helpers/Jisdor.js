// backend/src/helpers/Jisdor.js

/**
 * Fungsi untuk mengambil Kurs JISDOR (USD ke IDR)
 * Karena ini project tim, nanti bisa diganti dengan endpoint yang dibuat Farid.
 */
exports.getJisdorRate = async () => {
    try {
        // CONTOH: Kita pakai API publik dulu sebagai pengganti JISDOR sementara
        // agar fitur Teguh bisa jalan sekarang. 
        // Nanti ganti URL ini dengan API JISDOR asli milik Farid.
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        // Ambil rate IDR
        const rate = data.rates.IDR; 
        
        console.log(`[JISDOR] Kurs USD ke IDR saat ini: Rp ${rate}`);
        return rate;
    } catch (error) {
        console.error("Gagal mengambil data JISDOR, menggunakan default rate.");
        return 16000; // Fallback jika API error
    }
};
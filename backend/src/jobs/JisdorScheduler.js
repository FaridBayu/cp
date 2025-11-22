const cron = require('node-cron');
const JisdorService = require('../services/Jisdor.service');

const startJisdorScheduler = async () => {
    console.log('⏰ Jisdor Scheduler System: ON');

    // 1. BOOT SYNC 

    console.log('[BOOT-SYNC] 🚀 Server menyala, memverifikasi data 30 hari terakhir...');
    
    try {
        const result = await JisdorService.sync30day();
        console.log(`[BOOT-SYNC] ✅ Selesai! Ditambahkan: ${result.synced}, Sudah Ada: ${result.skipped}`);
    } catch (error) {
        console.log(`[BOOT-SYNC] ℹ️ Info: ${error.message}`);
    }

    // 2. CRON JOB (Jadwal Rutin Harian)

    cron.schedule('0 9-17 * * 1-5', async () => {
        console.log('[AUTO-SYNC] ⏳ Mengecek update data harian ke BI...');
        try {
            const result = await JisdorService.syncToday();
            
            const today = new Date().toLocaleDateString('sv-SE');
            
            if (result.tanggal_kurs === today) {
                console.log(`[AUTO-SYNC] ✅ Data HARI INI (${result.tanggal_kurs}) masuk: Rp ${result.nilai_kurs}`);
            } else {
                console.log(`[AUTO-SYNC] ℹ️ Data aman (Tanggal: ${result.tanggal_kurs}). BI belum update data baru.`);
            }

        } catch (error) {
            console.error('[AUTO-SYNC] ❌ Gagal Sync:', error.message);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Jakarta"
    });
};

module.exports = startJisdorScheduler;
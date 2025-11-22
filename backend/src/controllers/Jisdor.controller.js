const JisdorService = require('../services/Jisdor.service');

class JisdorController {
    
    // GET /kurs-jisdor/current
    static async getCurrent(req, res) {
        try {
            const data = await JisdorService.getCurrentRate();
            
            if (!data) {
                return res.status(404).json({
                    success: false,
                    error: "Data kurs belum tersedia. Silakan lakukan sync terlebih dahulu."
                });
            }

            res.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // GET /kurs-jisdor/history
    static async getHistory(req, res) {
        try {
            // Default: Page 1, Limit 10
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            
            const result = await JisdorService.getHistoryRates(page, limit);

            res.status(200).json({ 
                success: true, 
                data: result 
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // GET /kurs-jisdor/date/:date
    static async getByDate(req, res) {
        try {
            const { date } = req.params;

            // Validasi format YYYY-MM-DD
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return res.status(400).json({
                    success: false,
                    error: "Format tanggal salah. Gunakan format YYYY-MM-DD (contoh: 2025-11-20)"
                });
            }

            // Panggil Service (Smart Search)
            const data = await JisdorService.getRateByDate(date);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    error: `Data kurs untuk tanggal ${date} tidak ditemukan.`
                });
            }

            res.status(200).json({
                success: true,
                data: data
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // POST /kurs-jisdor/sync 
    static async sync(req, res) {
        try {
            const result = await JisdorService.syncToday();
            
            res.status(200).json({
                success: true,
                data: {
                    records_synced: 1,
                    latest_rate: result
                },
                message: "Data terbaru berhasil diperbarui."
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: "Gagal sinkronisasi harian.",
                details: error.message
            });
        }
    }

    // POST /kurs-jisdor/sync/30day 
    static async sync30day(req, res) {
        try {
            const result = await JisdorService.sync30day();
            res.status(200).json({
                success: true,
                message: `Sync 30 Hari Selesai. Ditambahkan: ${result.synced}, Dilewati: ${result.skipped}.`,
                data: result
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = JisdorController;
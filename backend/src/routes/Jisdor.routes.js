const express = require('express');
const router = express.Router();
const JisdorController = require('../controllers/Jisdor.controller');

// 1. Ambil Data Terkini (Untuk Kartu Atas Dashboard)
router.get('/current', JisdorController.getCurrent);

// 2. Ambil Riwayat (Untuk Tabel dengan Pagination)
router.get('/history', JisdorController.getHistory);

// 3. Cek Tanggal Spesifik (Fitur Smart Search / Live Check)
router.get('/date/:date', JisdorController.getByDate);

// 4. Sync Harian (Cepat - Untuk Tombol "Perbarui Data")
router.post('/sync', JisdorController.sync);

// 5. Sync 30 Hari (Berat - Untuk Inisialisasi Data Awal)
router.post('/sync/30day', JisdorController.sync30day);

module.exports = router;
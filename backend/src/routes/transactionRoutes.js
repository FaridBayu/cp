const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// ==========================================
// Base URL: /api/riwayat (Nanti diatur di app.js)
// ==========================================

// GET /api/riwayat/ -> Ambil semua data (dengan filter search/currency)
router.get('/', transactionController.getAllTransactions);

// POST /api/riwayat/ -> Tambah Header Transaksi Baru
router.post('/', transactionController.createTransaction);

// GET /api/riwayat/:id/items -> Lihat detail item belanja dari ID Transaksi tertentu
router.get('/:id/items', transactionController.getTransactionDetails);

// POST /api/riwayat/:id/items -> Tambah item belanja baru ke ID Transaksi tertentu
router.post('/:id/items', transactionController.addItemToTransaction);

// PUT /api/riwayat/:id -> Edit Header
router.put('/:id', transactionController.updateTransaction);

// DELETE /api/riwayat/:id -> Hapus Transaksi
router.delete('/:id', transactionController.deleteTransaction);

// PUT /api/riwayat/:id/items/:itemId -> Edit Item
router.put('/:id/items/:itemId', transactionController.updateTransactionItem);

// DELETE /api/riwayat/:id/items/:itemId -> Hapus Item
router.delete('/:id/items/:itemId', transactionController.deleteTransactionItem);

module.exports = router;
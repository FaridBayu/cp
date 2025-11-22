const Transaction = require('../models/Transaction');
const TransactionDetail = require('../models/TransactionDetail');
const Jisdor = require('../helpers/Jisdor');

// 1. Menampilkan semua data riwayat (Untuk Tabel Utama)
exports.getAllTransactions = async (req, res) => {
    try {
        const { search, currency } = req.query;
        // Panggil Model Transaction
        const data = await Transaction.getAll(search, currency);
        
        res.json({
            status: 'success',
            message: 'Data riwayat berhasil diambil',
            data: data
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 2. Membuat Transaksi Baru (Header saja - Modal Pertama)
exports.createTransaction = async (req, res) => {
    try {
        // Data dikirim dari body (JSON)
        const transactionId = await Transaction.create(req.body);
        
        res.status(201).json({
            status: 'success',
            message: 'Transaksi baru berhasil dibuat',
            data: { id: transactionId, ...req.body }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 3. Melihat Detail Item per Transaksi (Modal "View Detail")
exports.getTransactionDetails = async (req, res) => {
    try {
        const { id } = req.params; // ID header transaksi
        const items = await TransactionDetail.getByTransactionId(id);
        
        res.json({
            status: 'success',
            data: items
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 4. Menambah Item ke Transaksi (Modal "Tambah Item")
exports.addItemToTransaction = async (req, res) => {
    try {
        const { id } = req.params; // ID header transaksi
        
        // Gabungkan ID header dengan data item dari body
        const itemData = {
            transaction_id: id,
            ...req.body 
        };

        const itemId = await TransactionDetail.create(itemData);

        // TODO (Optional nanti): Update 'total_amount' di tabel Transaction Header
        // agar total harga di halaman utama sinkron.

        res.status(201).json({
            status: 'success',
            message: 'Item berhasil ditambahkan',
            data: { id: itemId }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 5. Update Transaksi Header
exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendor_name, transaction_date, currency_code } = req.body;

        // 1. Ambil data lama dari database untuk cek mata uang sebelumnya
        const oldData = await Transaction.getById(id); // Pastikan Anda punya method getById di Model
        // Jika getById belum ada, kita bisa query manual sebentar di sini:
        // const [rows] = await require('../database/MySQL.database').query('SELECT * FROM transactions WHERE id=?', [id]); const oldData = rows[0];

        if (!oldData) {
            return res.status(404).json({ status: 'error', message: 'Transaksi tidak ditemukan' });
        }

        // 2. Cek apakah mata uang berubah?
        if (oldData.currency_code !== currency_code) {
            // START KONVERSI JISDOR
            const rate = await Jisdor.getJisdorRate();
            
            // Panggil Model untuk konversi angka-angka di DB
            await Transaction.convertCurrency(id, oldData.currency_code, currency_code, rate);
        }

        // 3. Update data teks lainnya (Vendor & Tanggal)
        // Kita panggil update biasa untuk data sisanya
        await Transaction.update(id, { vendor_name, transaction_date, currency_code });

        res.json({ 
            status: 'success', 
            message: 'Transaksi berhasil diperbarui dan mata uang dikonversi (jika berubah)' 
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 6. Hapus Transaksi
exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        await Transaction.delete(id);
        res.json({ status: 'success', message: 'Transaksi berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Update Item
exports.updateTransactionItem = async (req, res) => {
    try {
        const { itemId } = req.params; // Kita pakai ID item
        await TransactionDetail.update(itemId, req.body);
        res.json({ status: 'success', message: 'Item berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Hapus Item
exports.deleteTransactionItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        await TransactionDetail.delete(itemId);
        res.json({ status: 'success', message: 'Item berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
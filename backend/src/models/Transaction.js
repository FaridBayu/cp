// Mengimpor koneksi database (pool) dari file yang sudah Anda buat
const dbPool = require('../database/MySQL.Database');

// Kelas Model untuk Header Transaksi
class Transaction {
    
    /**
     * Mengambil semua Header Transaksi dari database.
     * Mendukung pagination, pencarian, dan filtering (sesuai kebutuhan desain).
     * @returns {Promise<Array>} Array of transaction headers.
     */
    static async getAll(searchQuery = '', currency = 'Semua Mata Uang') {
        let sql = `
            SELECT id, transaction_id, vendor_name, transaction_date, total_amount, currency_code
            FROM transactions
            WHERE 1=1
        `;
        const params = [];

        // 1. Filtering Mata Uang
        if (currency !== 'Semua Mata Uang') {
            sql += ` AND currency_code = ?`;
            params.push(currency);
        }

        // 2. Pencarian (berdasarkan Vendor atau ID Transaksi)
        if (searchQuery) {
            sql += ` AND (vendor_name LIKE ? OR transaction_id LIKE ?)`;
            params.push(`%${searchQuery}%`, `%${searchQuery}%`);
        }
        
        // Tambahkan pengurutan
        sql += ` ORDER BY transaction_date DESC`;

        try {
            // Menjalankan query ke database
            const [rows] = await dbPool.query(sql, params);
            return rows;
        } catch (error) {
            console.error("Error saat mengambil semua transaksi:", error);
            throw new Error("Gagal mengambil data riwayat transaksi.");
        }
    }

    /**
     * Menyimpan Header Transaksi baru.
     * @param {Object} data - Data dari Modal "Tambah Transaksi Baru".
     * @returns {Promise<number>} ID dari transaksi yang baru dibuat.
     */
    static async create(data) {
        const { vendor_name, transaction_date, currency_code, total_amount } = data;
        
        // Catatan: transaction_id akan kita generate di Service/Controller untuk memastikan unik.
        // Untuk saat ini kita asumsikan ID tersebut sudah disiapkan di 'data' sebelum dipanggil.
        const transaction_id = `TRX-${Date.now().toString().slice(-4)}`; // Contoh sederhana

        const sql = `
            INSERT INTO transactions (transaction_id, vendor_name, transaction_date, currency_code, total_amount)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [transaction_id, vendor_name, transaction_date, currency_code, total_amount || 0];

        try {
            // Hasil dari INSERT query mengandung informasi 'insertId'
            const [result] = await dbPool.query(sql, params);
            return result.insertId;
        } catch (error) {
            console.error("Error saat membuat transaksi baru:", error);
            throw new Error("Gagal menyimpan header transaksi baru.");
        }
    }
    
    static async update(id, data) {
        const { vendor_name, transaction_date, currency_code } = data;
        const sql = `
            UPDATE transactions 
            SET vendor_name = ?, transaction_date = ?, currency_code = ?
            WHERE id = ?
        `;
        try {
            const [result] = await dbPool.query(sql, [vendor_name, transaction_date, currency_code, id]);
            return result.affectedRows;
        } catch (error) {
            throw new Error("Gagal mengupdate transaksi.");
        }
    }

    static async delete(id) {
        // Karena ada ON DELETE CASCADE di database, menghapus header otomatis menghapus detail itemnya.
        const sql = `DELETE FROM transactions WHERE id = ?`;
        try {
            const [result] = await dbPool.query(sql, [id]);
            return result.affectedRows;
        } catch (error) {
            throw new Error("Gagal menghapus transaksi.");
        }
    }

    static async convertCurrency(id, oldCurrency, newCurrency, rate) {
        // Tentukan faktor pengali
        let multiplier = 1;

        if (oldCurrency === 'USD' && newCurrency === 'IDR') {
            multiplier = rate; // Dikali (Contoh: 10 USD * 16.000 = 160.000 IDR)
        } else if (oldCurrency === 'IDR' && newCurrency === 'USD') {
            multiplier = 1 / rate; // Dibagi (Contoh: 160.000 IDR / 16.000 = 10 USD)
        } else {
            return; // Tidak ada perubahan
        }

        // 1. Update Semua Item Detail (Unit Price & Subtotal)
        const sqlUpdateItems = `
            UPDATE transaction_details 
            SET unit_price = unit_price * ?, 
                subtotal = subtotal * ?
            WHERE transaction_id = ?
        `;

        // 2. Update Header (Total Amount & Currency Code)
        const sqlUpdateHeader = `
            UPDATE transactions 
            SET total_amount = total_amount * ?, 
                currency_code = ?
            WHERE id = ?
        `;

        try {
            // Jalankan update items
            await dbPool.query(sqlUpdateItems, [multiplier, multiplier, id]);
            
            // Jalankan update header
            await dbPool.query(sqlUpdateHeader, [multiplier, newCurrency, id]);
            
            return true;
        } catch (error) {
            console.error("Gagal konversi mata uang:", error);
            throw new Error("Gagal mengonversi mata uang transaksi.");
        }
    }

    static async getById(id) {
        const sql = `SELECT * FROM transactions WHERE id = ?`;
        const [rows] = await dbPool.query(sql, [id]);
        return rows[0];
    }
    // TODO: Tambahkan static async getById(id)
    // TODO: Tambahkan static async update(id, data)
    // TODO: Tambahkan static async delete(id)
}

module.exports = Transaction;
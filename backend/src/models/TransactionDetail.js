const dbPool = require('../database/MySQL.Database');
class TransactionDetail {

    static async create(data) {
        const { transaction_id, item_name, unit_price, quantity } = data;
        const subtotal = unit_price * quantity;

        const sqlInsert = `
            INSERT INTO transaction_details (transaction_id, item_name, unit_price, quantity, subtotal)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        try {
            const [result] = await dbPool.query(sqlInsert, [transaction_id, item_name, unit_price, quantity, subtotal]);
            
            // Hitung ulang total header
            await this.recalculateHeaderTotal(transaction_id);

            return result.insertId;
        } catch (error) {
            throw new Error("Gagal menyimpan item transaksi.");
        }
    }

    static async getByTransactionId(transactionHeaderId) {
        const sql = `
            SELECT id, item_name, unit_price, quantity, subtotal
            FROM transaction_details
            WHERE transaction_id = ?
            ORDER BY id ASC
        `;

        try {
            const [rows] = await dbPool.query(sql, [transactionHeaderId]);
            return rows;
        } catch (error) {
            throw new Error("Gagal mengambil data detail item.");
        }
    }

    static async update(id, data) {
        const { item_name, unit_price, quantity } = data;
        const subtotal = unit_price * quantity;

        // 1. Ambil transaction_id dulu sebelum update
        const [oldData] = await dbPool.query('SELECT transaction_id FROM transaction_details WHERE id = ?', [id]);
        if (oldData.length === 0) return 0;
        const transactionId = oldData[0].transaction_id;

        const sql = `
            UPDATE transaction_details
            SET item_name = ?, unit_price = ?, quantity = ?, subtotal = ?
            WHERE id = ?
        `;

        try {
            const [result] = await dbPool.query(sql, [item_name, unit_price, quantity, subtotal, id]);
            
            // 2. Hitung ulang total header
            await this.recalculateHeaderTotal(transactionId);
            
            return result.affectedRows;
        } catch (error) {
            throw new Error("Gagal mengupdate item transaksi.");
        }
    }

    static async delete(id) {
        // 1. Ambil transaction_id DULU sebelum dihapus (PENTING!)
        const [oldData] = await dbPool.query('SELECT transaction_id FROM transaction_details WHERE id = ?', [id]);
        
        // Jika data tidak ditemukan (mungkin sudah terhapus), hentikan
        if (oldData.length === 0) return 0;
        
        const transactionId = oldData[0].transaction_id;

        // 2. Hapus Item
        const sql = `DELETE FROM transaction_details WHERE id = ?`;

        try {
            const [result] = await dbPool.query(sql, [id]);

            // 3. Hitung ulang total header SETELAH penghapusan
            await this.recalculateHeaderTotal(transactionId);

            return result.affectedRows;
        } catch (error) {
            console.error("Error delete detail:", error); // Debugging
            throw new Error("Gagal menghapus item transaksi.");
        }
    }

    /**
     * FUNGSI FIX: MENGHITUNG ULANG TOTAL
     * Menggunakan COALESCE agar jika kosong hasilnya 0, bukan NULL.
     */
    static async recalculateHeaderTotal(transactionId) {
        try {
            // Langkah 1: Ambil Total (Paksa jadi 0 jika NULL menggunakan COALESCE)
            const sqlGetTotal = `
                SELECT COALESCE(SUM(subtotal), 0) as total 
                FROM transaction_details 
                WHERE transaction_id = ?
            `;
            
            const [rows] = await dbPool.query(sqlGetTotal, [transactionId]);
            
            // Pastikan kita dapat angka, konversi ke Number untuk jaga-jaga
            const newTotal = Number(rows[0].total);

            console.log(`[DEBUG] Recalculating TRX ID ${transactionId}. New Total: ${newTotal}`);

            // Langkah 2: Update Header
            const sqlUpdateHeader = `
                UPDATE transactions 
                SET total_amount = ? 
                WHERE id = ?
            `;
            
            await dbPool.query(sqlUpdateHeader, [newTotal, transactionId]);
            
        } catch (error) {
            console.error("Gagal menghitung ulang total:", error);
        }
    }
}

module.exports = TransactionDetail;
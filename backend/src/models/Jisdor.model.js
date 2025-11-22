const db = require('../database/MySQL.database');

class JisdorModel {

    static async create(data) {
        const query = `INSERT INTO kurs_jisdor (tanggal_kurs, nilai_kurs) VALUES (?, ?) ON DUPLICATE KEY UPDATE nilai_kurs = VALUES(nilai_kurs)`;
        const [result] = await db.execute(query, [data.tanggal_kurs, data.nilai_kurs]);
        return result;
    }

    static async getLatest() {
        const [rows] = await db.execute(`SELECT * FROM kurs_jisdor ORDER BY tanggal_kurs DESC LIMIT 1`);
        return rows[0];
    }

    static async getByDate(date) {
        const [rows] = await db.execute(`SELECT * FROM kurs_jisdor WHERE tanggal_kurs = ?`, [date]);
        return rows[0];
    }

    // Tambahkan offset untuk pagination
    static async getHistory(limit, offset) {
        const query = `SELECT * FROM kurs_jisdor ORDER BY tanggal_kurs DESC LIMIT ? OFFSET ?`;
        const [rows] = await db.execute(query, [parseInt(limit), parseInt(offset)]);
        return rows;
    }

    // Hitung total data untuk tahu ada berapa halaman
    static async countAll() {
        const [rows] = await db.execute(`SELECT COUNT(*) as total FROM kurs_jisdor`);
        return rows[0].total;
    }
}

module.exports = JisdorModel;
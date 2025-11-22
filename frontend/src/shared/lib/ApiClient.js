// src/services/api/ApiClient.js

export const API_BASE_URL = (typeof window !== 'undefined' && window.UNICOST_API_BASE_URL) || 'http://localhost:3100/api';

// PERBAIKAN: Tambahkan 'export' di sini
export class ApiClient {
    constructor() {
        this.useMock = true;
    }

    async getDashboardStats() {
        if (this.useMock) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        data: {
                            totalProducts: 248,
                            avgEstimation: 1200000,
                            totalTransactions: 1542,
                            recentActivities: [
                                { id: 1, action: "Produk PRD-045 diperbarui", user: "Admin", time: "5 menit lalu" },
                                { id: 2, action: "Kurs JISDOR diperbarui", user: "System", time: "1 jam lalu" }
                            ]
                        }
                    });
                }, 500);
            });
        }
    }

    // --- JISDOR METHODS (Static) ---
    static async getJisdorHistory(limit = 10) {
        try {
            const response = await fetch(`${API_BASE_URL}/kurs-jisdor/history?limit=${limit}`);
            if (!response.ok) throw new Error(`HTTP Error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("ApiClient Error (History):", error);
            return { success: false, error: error.message };
        }
    }

    static async getJisdorCurrent() {
        try {
            const response = await fetch(`${API_BASE_URL}/kurs-jisdor/current`);
            if (!response.ok) {
                if (response.status === 404) return { success: false, error: "Data kosong" };
                throw new Error(`HTTP Error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("ApiClient Error (Current):", error);
            return { success: false, error: error.message };
        }
    }

    static async syncJisdor() {
        try {
            const response = await fetch(`${API_BASE_URL}/kurs-jisdor/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Gagal sinkronisasi');
            return result;
        } catch (error) {
            console.error("ApiClient Error (Sync):", error);
            return { success: false, error: error.message };
        }
    }
    static async getJisdorHistory(page = 1, limit = 10) {
        try {
            // Kirim parameter page dan limit
            const response = await fetch(`${API_BASE_URL}/kurs-jisdor/history?page=${page}&limit=${limit}`);

            if (!response.ok) {
                throw new Error(`HTTP Error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("ApiClient Error (History):", error);
            return { success: false, error: error.message };
        }
    }
}


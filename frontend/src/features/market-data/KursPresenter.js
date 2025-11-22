import { ApiClient } from '../../shared/lib/ApiClient.js';
import { renderKurs } from './KursView.js';

export function KursPresenter(container) {
    const view = renderKurs(container);

    // State Lokal
    let currentPage = 1;
    const limit = 10;
    let totalPages = 1;

    // Helper Formatting
    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);
    const formatDateIndo = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

    // --- FUNGSI 1: LOAD SUMMARY CARD (Dipanggil sekali saja di awal / saat Sync) ---
    const loadSummaryData = async () => {
        try {
            const currentRes = await ApiClient.getJisdorCurrent();
            
            if (currentRes.success && currentRes.data) {
                const data = currentRes.data;
                view.updateSummary({
                    rate: formatRupiah(data.nilai_kurs),
                    date: formatDateIndo(data.tanggal_kurs),
                    lastUpdate: new Date().toLocaleString('id-ID') 
                });
            }
        } catch (error) {
            console.error("Gagal load summary:", error);
        }
    };

    // --- FUNGSI 2: LOAD TABLE ONLY (Dipanggil saat Pagination) ---
    const loadTableData = async (page) => {
        view.showLoading(true);
        try {
            const targetPage = page || currentPage;
            const historyRes = await ApiClient.getJisdorHistory(targetPage, limit);

            if (historyRes.success && historyRes.data.rates.length > 0) {
                const { rates, pagination } = historyRes.data;
                currentPage = pagination.currentPage;
                totalPages = pagination.totalPages;

                // Logika Persen
                const allRows = rates.map((rate, index) => {
                    let percentChange = 0;
                    let direction = 'neutral';
                    if (index < rates.length - 1) {
                        const current = parseFloat(rate.nilai_kurs);
                        const prev = parseFloat(rates[index + 1].nilai_kurs);
                        const diff = current - prev;
                        if (prev !== 0) percentChange = ((diff / prev) * 100).toFixed(2);
                        if (diff > 0) direction = 'up';
                        if (diff < 0) direction = 'down';
                    }
                    return {
                        code: 'USD', currency: 'US Dollar',
                        value: formatRupiah(rate.nilai_kurs),
                        change: percentChange, direction: direction,
                        date: formatDateIndo(rate.tanggal_kurs)
                    };
                });

                // Potong data ke-11
                const displayData = allRows.slice(0, limit);

                view.renderTable(displayData);
                view.updatePagination(currentPage, totalPages);

            } else {
                view.renderEmpty();
            }
        } catch (error) {
            console.error(error);
            view.showError("Gagal memuat data tabel.");
        } finally {
            view.showLoading(false);
        }
    };

    // --- FUNGSI 3: SYNC (Panggil Keduanya) ---
    const handleSync = async () => {
        view.setSyncLoading(true);
        const result = await ApiClient.syncJisdor();
        
        if (result.success) {
            alert('Data berhasil diperbarui!');
            // Refresh Summary DAN Tabel
            await loadSummaryData(); 
            await loadTableData(1);  
        } else {
            alert('Gagal: ' + result.error);
        }
        view.setSyncLoading(false);
    };

    // Bind Events
    view.bindEvents({
        onSync: handleSync,
        onPrev: () => {
            if (currentPage > 1) loadTableData(currentPage - 1); 
        },
        onNext: () => {
            if (currentPage < totalPages) loadTableData(currentPage + 1); 
        }
    });

    loadSummaryData();
    loadTableData(currentPage);
}
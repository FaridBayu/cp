import '../../styles/pages/kurs.css';

export function renderKurs(container) {
    container.innerHTML = `
        <div class="jisdor-container">
            <div class="jisdor-header">
                <div class="page-title">
                    <h2>Data Kurs JISDOR</h2>
                    <p>Jakarta Interbank Spot Dollar Rate dari Bank Indonesia</p>
                </div>
                <button id="btnSync" class="btn-purple">
                    <img src="/Kurs/icon/reset.png" class="icon-custom" id="syncIcon" alt="Sync">
                    <span id="btnText">Perbarui Data</span>
                </button>
            </div>

            <div class="summary-grid">
                <div class="summary-card">
                    <div class="card-label">Kurs USD/IDR</div>
                    <div class="card-value" id="summaryRate">-</div>
                    <div class="card-sub">Per 1 USD (<span id="summaryDate">-</span>)</div>
                </div>
                <div class="summary-card">
                    <div class="card-label">Terakhir Diperbarui</div>
                    <div class="card-value" id="lastUpdateInfo" style="font-size: 24px; margin-top: 8px;">-</div>
                    <div class="card-sub">Waktu Lokal</div>
                </div>
            </div>

            <div class="table-wrapper">
                <div class="table-header">
                    <h3>Tabel Kurs JISDOR Terkini</h3>
                    <span>Data kurs resmi dari Bank Indonesia untuk transaksi spot</span>
                </div>
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Kode</th>
                            <th>Mata Uang</th>
                            <th>Nilai Tukar (IDR)</th>
                            <th>Perubahan (%)</th>
                            <th>Tanggal</th> 
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <tr><td colspan="5" style="text-align:center; padding: 40px; color:#999;">Memuat data...</td></tr>
                    </tbody>
                </table>
                <div class="pagination-container">
                    <span id="pageInfo" style="font-size: 13px; color: #666;">Halaman 1</span>
                    <div>
                        <button id="btnPrev" class="btn-nav">Previous</button>
                        <button id="btnNext" class="btn-nav">Next</button>
                    </div>
                </div>
            </div>

            <div class="info-footer">
                <h4 style="margin:0; font-size:14px; color:#333;">Informasi API</h4>
                <ul class="info-list">
                    <li><strong>Sumber Data:</strong> Bank Indonesia SOAP Web Service</li>
                    <li><strong>Endpoint:</strong> https://www.bi.go.id/biwebservice/wskursbi.asmx</li>
                    <li><strong>Update:</strong> Data diperbarui otomatis setiap hari kerja (Senin-Jumat) pukul 09:00 - 17:00 WIB.</li>
                </ul>
            </div>
        </div>
    `;

    // Ambil Elemen DOM
    const btnSync = container.querySelector('#btnSync');
    const btnPrev = container.querySelector('#btnPrev');
    const btnNext = container.querySelector('#btnNext');
    const tableBody = container.querySelector('#tableBody');
    const summaryRate = container.querySelector('#summaryRate');
    const summaryDate = container.querySelector('#summaryDate');
    const lastUpdateInfo = container.querySelector('#lastUpdateInfo');
    const pageInfo = container.querySelector('#pageInfo');
    const syncIcon = container.querySelector('#syncIcon');
    const btnText = container.querySelector('#btnText');

    // Return Interface Control
    return {
        bindEvents: (handlers) => {
            if (btnSync) btnSync.addEventListener('click', handlers.onSync);
            if (btnPrev) btnPrev.addEventListener('click', handlers.onPrev);
            if (btnNext) btnNext.addEventListener('click', handlers.onNext);
        },

        updateSummary: (data) => {
            if (summaryRate) summaryRate.innerText = data.rate;
            if (summaryDate) summaryDate.innerText = data.date;
            if (lastUpdateInfo) lastUpdateInfo.innerText = data.lastUpdate;
        },

        renderTable: (rows) => {
            if (!tableBody) return;
            tableBody.innerHTML = '';
            rows.forEach(row => {
                let badgeHtml = '<span class="badge-trend trend-flat">-</span>';
                if (row.direction === 'up') {
                    badgeHtml = `<span class="badge-trend trend-up"><i class="fas fa-arrow-up"></i> +${Math.abs(row.change)}%</span>`;
                } else if (row.direction === 'down') {
                    badgeHtml = `<span class="badge-trend trend-down"><i class="fas fa-arrow-down"></i> -${Math.abs(row.change)}%</span>`;
                }

                const tr = `
                    <tr>
                        <td style="font-weight:600; color:#333;">${row.code}</td>
                        <td>${row.currency}</td>
                        <td style="font-weight:700;">${row.value}</td>
                        <td>${badgeHtml}</td>
                        <td style="color:#666;">${row.date}</td>
                    </tr>`;
                tableBody.innerHTML += tr;
            });
        },

        updatePagination: (currentPage, totalPages) => {
            if (pageInfo) pageInfo.innerText = `Halaman ${currentPage} dari ${totalPages}`;
            if (btnPrev) btnPrev.disabled = currentPage <= 1;
            if (btnNext) btnNext.disabled = currentPage >= totalPages;
        },

        showLoading: (isLoading) => {
            if (isLoading && tableBody) {
                tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color:#999;">Mengambil data...</td></tr>`;
            }
        },

        setSyncLoading: (isLoading) => {
            if (!btnSync) return;
            btnSync.disabled = isLoading;
            if(isLoading) {
                syncIcon.classList.add('icon-spin');
                btnText.innerText = 'Sinkronisasi...';
            } else {
                syncIcon.classList.remove('icon-spin');
                btnText.innerText = 'Perbarui Data';
            }
        },

        renderEmpty: () => {
            if (tableBody) tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px;">Belum ada data.</td></tr>`;
        },

        showError: (msg) => alert(msg)
    };
}
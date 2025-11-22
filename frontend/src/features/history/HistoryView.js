// Kita tidak perlu import 'history.css' lagi.
// Style akan mengambil dari global.css dan components.css yang sudah ada di index.html

export class HistoryView {
  constructor(container) {
    this.appElement = container || document.querySelector('#app');
  }

  getTemplate() {
    // Kita gunakan <style> di sini untuk layout spesifik halaman ini 
    // tetapi TETAP MENGGUNAKAN VARIABEL dari global.css (var(--color-primary), dll)
    return `
      <style>
        /* --- Layout Khusus History --- */
        .history-container {
            padding: 30px;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .page-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--color-dark);
        }

        /* Filter Section */
        .filter-section {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
        }

        .search-input {
            flex: 2;
            padding: 10px 16px;
            border: 1px solid #E0E0E0;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
        }

        .currency-select {
            flex: 1;
            padding: 10px 16px;
            border: 1px solid #E0E0E0;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            background-color: var(--color-white);
        }

        /* Table Styling (Mengikuti Warna Global) */
        .custom-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .custom-table th {
            text-align: left;
            padding: 16px;
            background-color: var(--color-light-gray);
            color: var(--color-gray);
            font-weight: 600;
            font-size: 14px;
        }

        .custom-table td {
            padding: 16px;
            border-bottom: 1px solid #F0F0F0;
            color: var(--color-dark);
            font-size: 14px;
        }

        .custom-table tr:hover {
            background-color: #FAFAFA;
        }

        /* Badges & Actions */
        .badge-currency {
            background-color: var(--color-neutral);
            color: var(--color-primary);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }

        .action-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-primary);
            font-weight: 600;
            font-size: 13px;
        }
        
        .action-btn:hover {
            text-decoration: underline;
        }

        /* --- MODAL STYLING (Custom agar sesuai tema) --- */
        .custom-modal {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(2px);
        }

        .custom-modal-content {
            background: var(--color-white);
            padding: 32px;
            border-radius: 12px;
            width: 500px;
            max-width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            animation: slideUp 0.3s ease;
        }
        
        .modal-lg { width: 800px; }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        
        .modal-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--color-primary);
        }

        .form-group { margin-bottom: 16px; }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: var(--color-gray);
        }
        .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #E0E0E0;
            border-radius: 8px;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 24px;
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
      </style>

      <div class="history-container">
        <div class="page-header">
          <h2 class="page-title">Manajemen Riwayat Pengadaan</h2>
          
          <button id="btnAddTransaction" class="button" style="background: var(--color-primary); color: white;">
            <i class='bx bx-plus'></i> Tambah Data Riwayat
          </button>
        </div>

        <div class="filter-section">
            <input type="text" id="searchInput" class="search-input" placeholder="Cari riwayat berdasarkan vendor atau ID...">
            <select id="currencyFilter" class="currency-select">
                <option value="Semua Mata Uang">Semua Mata Uang</option>
                <option value="IDR">IDR</option>
                <option value="USD">USD</option>
            </select>
        </div>

        <div class="card">
            <div class="card-body">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>ID Transaksi</th>
                            <th>Vendor</th>
                            <th>Tanggal</th>
                            <th>Total Harga</th>
                            <th>Mata Uang</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="historyTableBody">
                        <tr><td colspan="6" style="text-align:center; padding: 30px;">Memuat data...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div id="modalAddTransaction" class="custom-modal">
          <div class="custom-modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Tambah Transaksi Baru</h5>
              <span class="close-modal" style="cursor:pointer; font-size: 24px;">&times;</span>
            </div>
            <form id="formAddTransaction">
                <div class="form-group">
                    <label>Vendor</label>
                    <input type="text" name="vendor_name" required placeholder="Masukkan nama vendor">
                </div>
                <div class="form-group">
                    <label>Tanggal</label>
                    <input type="date" name="transaction_date" required>
                </div>
                <div class="form-group">
                    <label>Mata Uang</label>
                    <select name="currency_code">
                        <option value="IDR">IDR</option>
                        <option value="USD">USD</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="button close-modal" style="background: var(--color-light-gray); color: var(--color-dark);">Batal</button>
                    <button type="submit" class="button" style="background: var(--color-primary); color: white;">Simpan Transaksi</button>
                </div>
            </form>
          </div>
        </div>

        <div id="modalDetailItem" class="custom-modal">
          <div class="custom-modal-content modal-lg">
            <div class="modal-header">
              <h5 class="modal-title">Detail Item - <span id="detailTitleId"></span></h5>
              <span class="close-detail-modal" style="cursor:pointer; font-size: 24px;">&times;</span>
            </div>
            
            <div style="background: var(--color-light-gray); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <form id="formAddItem" style="display: flex; gap: 10px; align-items: flex-end;">
                    <input type="hidden" id="detailTransactionId">
                    <div style="flex: 2;">
                        <label style="font-size:12px; color:var(--color-gray);">Nama Komponen</label>
                        <input type="text" name="item_name" style="width:100%; padding: 8px; border-radius:6px; border:1px solid #ddd;" required>
                    </div>
                    <div style="flex: 1;">
                        <label style="font-size:12px; color:var(--color-gray);">Harga</label>
                        <input type="number" name="unit_price" style="width:100%; padding: 8px; border-radius:6px; border:1px solid #ddd;" required>
                    </div>
                    <div style="flex: 1;">
                         <label style="font-size:12px; color:var(--color-gray);">Qty</label>
                        <input type="number" name="quantity" style="width:100%; padding: 8px; border-radius:6px; border:1px solid #ddd;" required>
                    </div>
                    
                    <div style="display: flex; gap: 5px;">
                        <button type="button" id="btnCancelEditItem" class="button" style="background: var(--color-error); color: white; padding: 10px; display: none;">
                            X
                        </button>
                        
                        <button type="submit" id="btnSubmitItem" class="button" style="background: var(--color-success); color: white; padding: 10px;">
                            + Tambah
                        </button>
                    </div>

                </form>
            </div>

            <table class="custom-table" style="border: 1px solid #eee;">
                <thead>
                    <tr>
                        <th>Nama Komponen</th>
                        <th>Harga Satuan</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody id="detailTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    this.appElement.innerHTML = this.getTemplate();
    this.bindModalEvents();
  }

  renderTable(data) {
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px;">Belum ada data riwayat.</td></tr>';
      return;
    }

    data.forEach(item => {
      let formattedTotal = new Intl.NumberFormat('id-ID', { 
          style: 'currency', 
          currency: item.currency_code,
          minimumFractionDigits: 2,
          currencyDisplay: 'narrowSymbol' 
      }).format(item.total_amount);
      formattedTotal = formattedTotal.replace(/\s/g, '');
      
      const row = `
        <tr>
            <td style="font-weight:600;">${item.transaction_id}</td>
            <td>${item.vendor_name}</td>
            <td>${new Date(item.transaction_date).toLocaleDateString()}</td>
            <td style="font-weight:bold; color: var(--color-dark);">${formattedTotal}</td>
            <td><span class="badge-currency">${item.currency_code}</span></td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="action-btn btn-view-detail" title="Lihat Item" data-id="${item.id}" data-trx="${item.transaction_id}">
                        <i class='bx bx-show'></i>
                    </button>
                    
                    <button class="action-btn btn-edit" title="Edit Info" 
                        data-id="${item.id}" 
                        data-vendor="${item.vendor_name}" 
                        data-date="${item.transaction_date}" 
                        data-currency="${item.currency_code}">
                        <i class='bx bx-edit'></i>
                    </button>

                    <button class="action-btn btn-delete" title="Hapus" data-id="${item.id}">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  }

  renderDetailTable(items) {
      const tbody = document.getElementById('detailTableBody');
      tbody.innerHTML = '';
      
      if (items.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada item belanja.</td></tr>';
          return;
      }

      items.forEach(item => {
          const subtotal = new Intl.NumberFormat('id-ID').format(item.subtotal);
          const price = new Intl.NumberFormat('id-ID').format(item.unit_price);
          
          tbody.innerHTML += `
            <tr>
                <td>${item.item_name}</td>
                <td>Rp ${price}</td>
                <td>${item.quantity}</td>
                <td style="font-weight:bold;">Rp ${subtotal}</td>
                <td style="width: 100px; text-align: center;">
                    <button class="action-btn btn-edit-item" 
                        data-id="${item.id}"
                        data-name="${item.item_name}"
                        data-price="${item.unit_price}"
                        data-qty="${item.quantity}">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="action-btn btn-delete-item" data-id="${item.id}">
                        <i class='bx bx-trash'></i>
                    </button>
                </td>
            </tr>
          `;
      });
  }

  bindModalEvents() {
    const openModal = (id) => {
        document.getElementById(id).style.display = 'flex'; // Menggunakan flex agar center
    };
    const closeModal = (id) => {
        document.getElementById(id).style.display = 'none';
    };

    document.getElementById('btnAddTransaction').addEventListener('click', () => openModal('modalAddTransaction'));

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => closeModal('modalAddTransaction'));
    });

    document.querySelectorAll('.close-detail-modal').forEach(btn => {
        btn.addEventListener('click', () => closeModal('modalDetailItem'));
    });
    
    // Close modal if clicked outside
    window.onclick = (event) => {
        if (event.target.classList.contains('custom-modal')) {
            event.target.style.display = "none";
        }
    }
  }

  showDetailModal(transactionId, trxCode) {
      document.getElementById('detailTitleId').innerText = trxCode;
      document.getElementById('detailTransactionId').value = transactionId;
      document.getElementById('modalDetailItem').style.display = 'flex';
  }
}
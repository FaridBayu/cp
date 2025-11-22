import { HistoryView } from './HistoryView.js';

class HistoryPresenterLogic {
  constructor(view) {
    this.view = view;
    // Pastikan port ini sesuai dengan backend kamu (3100)
    this.apiUrl = 'http://localhost:3100/api/riwayat'; 
  }

  init() {
    this.view.render();
    this.loadTransactions();
    this.bindEvents();
  }

  async loadTransactions() {
    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();
      
      if (result.status === 'success') {
        this.view.renderTable(result.data);
        this.bindTableEvents();
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }

  async loadTransactionItems(id) {
      try {
        const response = await fetch(`${this.apiUrl}/${id}/items`);
        const result = await response.json();
        
        if (result.status === 'success') {
            this.view.renderDetailTable(result.data);
            // PENTING: Bind event ke tombol edit/hapus item yang baru dirender
            this.bindDetailTableEvents(); 
        }
      } catch (error) {
          console.error("Error detail:", error);
      }
  }

  bindEvents() {
    // --- A. Event Form Tambah Header Transaksi ---
    const formAdd = document.getElementById('formAddTransaction');
    if(formAdd) {
        formAdd.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formAdd);
            const data = Object.fromEntries(formData.entries());
            
            const isEditMode = formAdd.dataset.mode === "edit";
            const editId = formAdd.dataset.editId;

            // Tentukan URL dan Method
            const url = isEditMode ? `${this.apiUrl}/${editId}` : this.apiUrl;
            const method = isEditMode ? 'PUT' : 'POST';

            if (!isEditMode) data.total_amount = 0; 

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert(isEditMode ? 'Transaksi berhasil diupdate!' : 'Transaksi berhasil dibuat!');
                    document.getElementById('modalAddTransaction').style.display = 'none';
                    formAdd.reset();
                    
                    // Reset mode form kembali ke "Tambah"
                    formAdd.dataset.mode = "";
                    document.querySelector('#modalAddTransaction .modal-title').innerText = "Tambah Transaksi Baru";
                    
                    this.loadTransactions();
                }
            } catch (error) {
                alert('Gagal menyimpan transaksi.');
            }
        });
        
        // Saat tombol "Tambah Data Riwayat" diklik, pastikan form bersih
        document.getElementById('btnAddTransaction').addEventListener('click', () => {
            formAdd.reset();
            formAdd.dataset.mode = ""; 
            document.querySelector('#modalAddTransaction .modal-title').innerText = "Tambah Transaksi Baru";
            document.getElementById('modalAddTransaction').style.display = 'flex';
        });
    }

    // --- B. Event Form Tambah/Edit Item Detail ---
    const formAddItem = document.getElementById('formAddItem');
    if(formAddItem) {
        // EVENT SUBMIT (Bisa Create atau Update Item)
        formAddItem.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formAddItem);
            const data = Object.fromEntries(formData.entries());
            const trxId = document.getElementById('detailTransactionId').value;
            
            const isEditMode = formAddItem.dataset.mode === "edit";
            const itemId = formAddItem.dataset.itemId;

            // Tentukan URL dan Method
            const url = isEditMode 
                ? `${this.apiUrl}/${trxId}/items/${itemId}`
                : `${this.apiUrl}/${trxId}/items`;
            
            const method = isEditMode ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    this.resetItemForm(); // Bersihkan form item
                    this.loadTransactionItems(trxId); // Reload tabel item
                    this.loadTransactions(); // Update total harga di tabel utama
                }
            } catch (error) {
                alert('Gagal menyimpan item.');
            }
        });

        // EVENT KLIK TOMBOL BATAL EDIT ITEM
        document.getElementById('btnCancelEditItem').addEventListener('click', () => {
            this.resetItemForm();
        });
    }
  }

  bindTableEvents() {
      // 1. Event Detail (Mata)
      document.querySelectorAll('.btn-view-detail').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const target = e.target.closest('.btn-view-detail');
              const id = target.dataset.id;
              const trxCode = target.dataset.trx;
              this.view.showDetailModal(id, trxCode);
              this.loadTransactionItems(id);
          });
      });

      // 2. Event Hapus Transaksi Header (Sampah)
      document.querySelectorAll('.btn-delete').forEach(btn => {
          btn.addEventListener('click', async (e) => {
              const target = e.target.closest('.btn-delete');
              const id = target.dataset.id;
              
              if (confirm('Apakah Anda yakin ingin menghapus transaksi ini? Data tidak bisa dikembalikan.')) {
                  await this.deleteTransaction(id);
              }
          });
      });

      // 3. Event Edit Transaksi Header (Pensil)
      document.querySelectorAll('.btn-edit').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const target = e.target.closest('.btn-edit');
              const id = target.dataset.id;
              const vendor = target.dataset.vendor;
              const date = target.dataset.date.split('T')[0]; 
              const currency = target.dataset.currency;

              this.openEditModal(id, vendor, date, currency);
          });
      });
  }

  // --- FUNGSI UNTUK ITEM (YANG DITAMBAHKAN) ---

  bindDetailTableEvents() {
      // 1. Hapus Item
      document.querySelectorAll('.btn-delete-item').forEach(btn => {
          btn.addEventListener('click', async (e) => {
              const target = e.target.closest('.btn-delete-item');
              const itemId = target.dataset.id;
              const trxId = document.getElementById('detailTransactionId').value;

              if(confirm("Hapus item ini?")) {
                  try {
                    await fetch(`${this.apiUrl}/${trxId}/items/${itemId}`, { method: 'DELETE' });
                    this.loadTransactionItems(trxId); 
                    this.loadTransactions(); 
                  } catch (error) {
                    console.error(error);
                  }
              }
          });
      });

      // 2. Edit Item (Isi form dengan data lama)
      document.querySelectorAll('.btn-edit-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const target = e.target.closest('.btn-edit-item');
              const form = document.getElementById('formAddItem');
              
              // Isi form
              form.item_name.value = target.dataset.name;
              form.unit_price.value = target.dataset.price;
              form.quantity.value = target.dataset.qty;

              // Ubah mode form jadi EDIT
              form.dataset.mode = "edit";
              form.dataset.itemId = target.dataset.id;

              // Ubah tampilan tombol submit
              const btnSubmit = document.getElementById('btnSubmitItem');
              btnSubmit.innerHTML = "Simpan";
              btnSubmit.style.background = "var(--color-primary)";
              
              // Munculkan tombol batal
              document.getElementById('btnCancelEditItem').style.display = "block";
          });
      });
  }

  resetItemForm() {
      const form = document.getElementById('formAddItem');
      if (!form) return;
      
      form.reset();
      form.dataset.mode = "";
      delete form.dataset.itemId;
      
      // Reset tampilan tombol
      const btnSubmit = document.getElementById('btnSubmitItem');
      btnSubmit.innerHTML = "+ Tambah";
      btnSubmit.style.background = "var(--color-success)";
      
      document.getElementById('btnCancelEditItem').style.display = "none";
  }

  // --- FUNGSI HELPER LAINNYA ---

  async deleteTransaction(id) {
      try {
          const response = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
          if (response.ok) {
              alert('Transaksi berhasil dihapus');
              this.loadTransactions(); 
          } else {
              alert('Gagal menghapus data');
          }
      } catch (error) {
          console.error(error);
      }
  }

  openEditModal(id, vendor, date, currency) {
      const form = document.getElementById('formAddTransaction');
      const modal = document.getElementById('modalAddTransaction');
      const modalTitle = modal.querySelector('.modal-title');
      
      form.vendor_name.value = vendor;
      form.transaction_date.value = date;
      form.currency_code.value = currency;
      
      modalTitle.innerText = "Edit Transaksi";
      form.dataset.mode = "edit"; 
      form.dataset.editId = id;

      modal.style.display = 'flex';
  }
}

// --- EXPORT FUNCTION UNTUK ROUTER ---
export const HistoryPresenter = (contentContainer) => {
    const view = new HistoryView(contentContainer);
    const presenter = new HistoryPresenterLogic(view);
    presenter.init();
};
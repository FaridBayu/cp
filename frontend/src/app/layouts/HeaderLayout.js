// src/app/layouts/HeaderLayout.js

export function renderHeader(container) {
  const headerHtml = `
    <div class="header-content">
      <img src="/logo/logo-full.svg" alt="UniCost Logo" class="logo-img" />
      
      <div class="header-right-items">
        <div class="header-actions">
          <div class="select-wrapper"> 
            <div 
              class="select-header"
              data-default="Tambah Data"
              data-prod="Tambah Produk"
              data-stock="Tambah Pengadaan"
            >
              <i class='bx bx-chevron-down arrow'></i>
            </div>

            <div class="options-list">
              
              <div title="reset">
                <input id="opt-default" name="nav-option" type="radio" checked />
                <label class="option-item" for="opt-default">
                  <i class='bx bx-reset'></i> Reset / Batal
                </label>
              </div>

              <div title="produk">
                <input id="opt-prod" name="nav-option" type="radio" />
                <label class="option-item" for="opt-prod">
                  <i class='bx bx-package'></i> Tambah Produk
                </label>
              </div>

              <div title="pengadaan">
                <input id="opt-stock" name="nav-option" type="radio" />
                <label class="option-item" for="opt-stock">
                  <i class='bx bx-cart-add'></i> Tambah Pengadaan
                </label>
              </div>

            </div>
          </div>
        </div>
        <div class="header-user-profile">
          <div class="notification-icon">
            <i class='bx bx-bell'></i>
            <span class="notification-badge"></span>
          </div>
          <div class="user-info">
            <img src="https://i.pravatar.cc/40" alt="User Avatar" class="user-avatar" />
            <div class="user-details">
              <!-- <span class="user-name">Guest User</span>
              <span class="user-role">Administrator</span> -->
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `;

  container.innerHTML = headerHtml;
}

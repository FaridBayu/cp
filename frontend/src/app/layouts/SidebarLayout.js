// src/app/layouts/SidebarLayout.js

import logo from '/logo/logo-full.svg';

const menuItems = {
  ""  : [
    { name: "Dashboard", icon: "bx-home", href: "#/dashboard" }
  ],
  "Manajemen Data": [
    { name: "Produk", icon: "bx-package", href: "#/products" },
    { name: "Riwayat", icon: "bx-history", href: "#/history" }
  ],
  "Fitur Sistem": [
    { name: "Kalkulator", icon: "bx-calculator", href: "#/calculator" },
    { name: "Data Kurs", icon: "bx-line-chart", href: "#/market-data" },
    { name: "Audit Log", icon: "bx-list-check", href: "#/audit" }
  ]
};

export function renderSidebar(container) {
  let menuHtml = '';
  for (const category in menuItems) {
    menuHtml += `
      <div class="nav-category">
        <h3 class="nav-category-title">${category}</h3>
        <ul class="nav-list">
    `;
    menuItems[category].forEach(item => {
      menuHtml += `
        <li class="nav-item">
          <a href="${item.href}">
            <i class='bx ${item.icon}'></i>
            <span>${item.name}</span>
          </a>
        </li>
      `;
    });
    menuHtml += '</ul></div>';
  }

  const sidebarHtml = `
    <nav class="sidebar-nav">
      ${menuHtml}
    </nav>
    <footer class="sidebar-footer">
      <p>© 2025 unicost</p>
    </footer>
  `;
  
  container.innerHTML = sidebarHtml;
}

export function updateSidebarActive(hash) {
    const currentHash = hash || '#/dashboard';
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === currentHash) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

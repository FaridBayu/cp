// src/features/dashboard/DashboardView.js

export function renderDashboard(container) {
  const dashboardHtml = `
    <div class="dashboard-header">
      <h1>Dashboard</h1>
    </div>
    <div class="dashboard-grid">
      
      <!-- Stat Cards -->
      <div class="card stat-card">
        <div class="card-header">
          <h3 class="card-title">Jumlah Produk Terdaftar</h3>
          <i class='bx bx-info-circle' title="Informasi lebih lanjut"></i>
        </div>
        <p class="stat-value">291.21</p>
        <p class="stat-trend increase">+12% dari bulan lalu</p>
      </div>

      <div class="card stat-card">
        <div class="card-header">
          <h3 class="card-title">Total Estimasi Selesai</h3>
          <i class='bx bx-info-circle' title="Informasi lebih lanjut"></i>
        </div>
        <p class="stat-value">1,402</p>
        <p class="stat-trend increase">+5% dari bulan lalu</p>
      </div>

      <div class="card stat-card">
        <div class="card-header">
          <h3 class="card-title">Harga Komponen Naik</h3>
          <i class='bx bx-info-circle' title="Informasi lebih lanjut"></i>
        </div>
        <p class="stat-value">34</p>
        <p class="stat-trend decrease">-2% dari bulan lalu</p>
      </div>

      <!-- Chart Section -->
      <div class="card chart-card">
        <div class="card-header">
          <h3 class="card-title">Tren Harga 30 Hari Terakhir</h3>
        </div>
        <div class="chart-placeholder">
          <p>Chart will be rendered here</p>
        </div>
      </div>

      <!-- Activity Log -->
      <div class="card activity-log-card">
        <div class="card-header">
          <h3 class="card-title">Log Aktivitas</h3>
        </div>
        <ul class="activity-list">
          <li class="activity-item">
            <p class="activity-title"><strong>Menambahkan produk baru:</strong> "Motherboard G552-22"</span></p>
            <p class="activity-meta">oleh <span class="user">Syahrul</span> - 5 menit lalu</p>
          </li>
          <li class="activity-item">
            <p class="activity-title"><strong>Memperbarui harga:</strong> "RAM DDR5 16GB"</span></p>
            <p class="activity-meta">oleh <span class="user">Admin</span> - 1 jam lalu</p>
          </li>
          <li class="activity-item">
            <p class="activity-title"><strong>Menyelesaikan estimasi:</strong> "PC Rakitan Gaming"</span></p>
            <p class="activity-meta">oleh <span class="user">Syahrul</span> - 3 jam lalu</p>
          </li>
        </ul>
      </div>

      <!-- Recent Estimates Table -->
      <div class="card full-width-card">
        <div class="card-header">
          <h3 class="card-title">Estimasi Harga Terbaru</h3>
        </div>
        <div class="table-placeholder">
          <p>Table will be rendered here</p>
        </div>
      </div>

    </div>
  `;
  container.innerHTML = dashboardHtml;
}

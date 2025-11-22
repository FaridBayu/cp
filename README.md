# UniCost

> Platform terintegrasi untuk menghitung **Harga Perkiraan Estimasi Pengadaan (HPEP)** secara akurat, transparan, dan efisien, menggantikan proses spreadsheet manual.

---

## 🚀 Live Demo

> **Status:** In Development (Capstone Project)

- **Frontend:** _Coming Soon_ <!-- https://unicost.netlify.app -->
- **Backend API:** _Coming Soon_ <!-- https://api-unicost.railway.app/api/health -->

---

## 🖼️ Screenshots

> _Screenshots will be added after UI implementation_

<!-- 
![Dashboard](./docs/screenshots/dashboard.png)
![Product Management](./docs/screenshots/products.png)
![Estimation Module](./docs/screenshots/estimation.png)
-->

---

## 📋 Problem & 
### 🔴 Problem
Perusahaan masih menggunakan **spreadsheet manual** untuk menghitung HPEP, yang:
- ❌ Rentan terhadap human error
- ❌ Tidak transparan dan sulit diaudit
- ❌ Tidak terstandarisasi antar tim
- ❌ Update kurs mata uang manual dan tidak real-time
- ❌ Sulit tracking riwayat perubahan harga

### ✅ Solution
**UniCost** menyediakan **single source of truth** berbasis web untuk:
- ✅ Mengelola data produk, komponen (BoM), dan riwayat pengadaan
- ✅ Integrasi otomatis dengan **JISDOR API** untuk kurs real-time
- ✅ Prediksi harga menggunakan **regression analysis**
- ✅ Audit trail lengkap untuk transparansi
- ✅ Export laporan ke **PDF/Excel**
- ✅ Perhitungan HPEP yang akurat dan dapat dipertanggungjawabkan

---

## 🛠️ Tech Stack

**Backend:** Node.js, Express, MySQL, Joi, Regression-js, ExcelJS, PDFKit  
**Frontend:** Vanilla JavaScript, MVP Pattern, Vite, CSS Variables  
**DevOps:** Railway, Netlify

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|-----------------|
| **Syahril** | Frontend Lead | Membangun fondasi frontend (Layout, CSS, API Service) untuk **memudahkan semua Feature Owner membangun UI.** |
| **Vivaldi** | Feature Owner | **End-to-End:** API dan UI untuk fitur CRUD Produk. |
| **Teguh** | Feature Owner | **End-to-End:** API dan UI untuk fitur Bill of Materials (BoM) & Audit Trail. |
| **Farid** | Feature Owner | **End-to-End:** API dan UI untuk fitur Kalkulasi Estimasi & integrasi JISDOR. |
| **Agung** | Feature Owner | **End-to-End:** API dan UI untuk fitur Ekspor Laporan (PDF/Excel) & Background Jobs. |

---

## 📚 Documentation

- **[Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Setup, architecture, and development workflow
- **[API Contract](./docs/API_CONTRACT.md)** - Complete API specification
- **[Design System](./frontend/DESIGN_SYSTEM.md)** - Frontend component library

---

## 🚀 Quick Start

```powershell
# Install dependencies
npm run install:all

# Setup environment
cp backend/samples/.env.sample backend/.env

# Run development servers
npm run dev
```

**Access:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3100/api/health

For detailed setup instructions, see **[Developer Guide](./docs/DEVELOPER_GUIDE.md)**

---

## 📈 Project Status

### ✅ Completed
- Setup monorepo structure
- Backend & Frontend skeletons
- Design system & components
- API Contract documentation

### 🚧 In Progress
- Database schema & migrations
- Product CRUD API
- Frontend UI implementation
- JISDOR integration
- Export features

---

# API Contract Template

> **Template ini untuk Backend Team** agar frontend bisa paham format request/response API

> ⚠️ **PENTING:** Template ini sudah disesuaikan dengan kebutuhan proyek AC-07 (Estimasi Harga). Pastikan semua field yang diperlukan untuk kalkulasi estimasi (seperti `harga_dasar`, `satuan`, `supplier`) HARUS disimpan di database!

---

## Base URL
```
Development: http://localhost:3100/api
Production: https://api-unicost.railway.app/api
```

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Your data here
  },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [] // Optional, untuk validation errors
}
```

---

## HTTP Status Codes
- `200` - OK (GET, PATCH, DELETE berhasil)
- `201` - Created (POST berhasil)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Template per Endpoint

### GET /products
**Description:** Get all products

**Request:**
- Method: `GET`
- URL: `/products`
- Query Params (optional):
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 20)
  - `category` - Filter by category
  - `search` - Search by name

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id_produk": 1,
        "nama_produk": "Product Name",
        "deskripsi": "Description",
        "kategori": "Electronics",
        "satuan": "pcs",
        "harga_dasar": 100000.00,
        "harga_saat_ini": 105000.00,
        "supplier": "PT Supplier Name",
        "tanggal_pembelian_terakhir": "2025-11-10T00:00:00.000Z",
        "tanggal_dibuat": "2025-11-14T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### GET /products/:id
**Description:** Get single product by ID

**Request:**
- Method: `GET`
- URL: `/products/:id`
- URL Params: `id` (required)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id_produk": 1,
    "nama_produk": "Product Name",
    "deskripsi": "Description",
    "kategori": "Electronics",
    "satuan": "pcs",
    "harga_dasar": 100000.00,
    "harga_saat_ini": 105000.00,
    "supplier": "PT Supplier Name",
    "tanggal_pembelian_terakhir": "2025-11-10T00:00:00.000Z",
    "tanggal_dibuat": "2025-11-14T10:00:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

### POST /products
**Description:** Create new product

**Request:**
- Method: `POST`
- URL: `/products`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "nama_produk": "Product Name",
  "deskripsi": "Product description",
  "kategori": "Electronics",
  "satuan": "pcs",
  "harga_dasar": 100000.00,
  "supplier": "PT Supplier Name"
}
```

**Required Fields:**
- `nama_produk` (string) - Product name
- `kategori` (string) - Product category
- `satuan` (string) - Unit of measurement (pcs, kg, meter, etc)
- `harga_dasar` (float) - Base price for estimation calculation

**Optional Fields:**
- `deskripsi` (string) - Product description
- `supplier` (string) - Supplier name

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "id_produk": 1,
    "nama_produk": "Product Name",
    "deskripsi": "Product description",
    "kategori": "Electronics",
    "satuan": "pcs",
    "harga_dasar": 100000.00,
    "harga_saat_ini": 100000.00,
    "supplier": "PT Supplier Name",
    "tanggal_pembelian_terakhir": null,
    "tanggal_dibuat": "2025-11-14T10:00:00.000Z"
  },
  "message": "Product created successfully"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "nama_produk",
      "message": "Product name is required"
    },
    {
      "field": "harga_dasar",
      "message": "Base price must be a positive number"
    }
  ]
}
```

---

### PATCH /products/:id
**Description:** Update product

**Request:**
- Method: `PATCH`
- URL: `/products/:id`
- URL Params: `id` (required)
- Headers: `Content-Type: application/json`
- Body (all fields optional):
```json
{
  "nama_produk": "Updated Name",
  "deskripsi": "Updated Description",
  "kategori": "Updated Category",
  "satuan": "kg",
  "harga_dasar": 120000.00,
  "supplier": "PT New Supplier"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id_produk": 1,
    "nama_produk": "Updated Name",
    "deskripsi": "Updated Description",
    "kategori": "Updated Category",
    "satuan": "kg",
    "harga_dasar": 120000.00,
    "harga_saat_ini": 120000.00,
    "supplier": "PT New Supplier",
    "tanggal_pembelian_terakhir": "2025-11-10T00:00:00.000Z",
    "tanggal_dibuat": "2025-11-14T10:00:00.000Z"
  },
  "message": "Product updated successfully"
}
```

---

### DELETE /products/:id
**Description:** Delete product

**Request:**
- Method: `DELETE`
- URL: `/products/:id`
- URL Params: `id` (required)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

## Checklist untuk Backend Team

Untuk setiap endpoint yang dibuat, dokumentasikan:

- [ ] HTTP Method (GET, POST, PATCH, DELETE)
- [ ] URL Path
- [ ] URL Parameters (jika ada)
- [ ] Query Parameters (jika ada)
- [ ] Request Headers (jika ada)
- [ ] Request Body format (jika POST/PATCH)
- [ ] Response Success format + status code
- [ ] Response Error format + status code
- [ ] Contoh data nyata

---

## Contoh Penggunaan di Frontend

```javascript
// GET all products
const response = await fetch('http://localhost:3100/api/products?page=1&limit=20');
const result = await response.json();

if (result.success) {
  console.log(result.data.products);
} else {
  console.error(result.error);
}
// POST new product
const response = await fetch('http://localhost:3100/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nama_produk: 'New Product',
    deskripsi: 'Product description',
    kategori: 'Electronics',
    satuan: 'pcs',
    harga_dasar: 100000.00,
    supplier: 'PT Supplier Name'
  })
});
const result = await response.json();

if (result.success) {
  console.log('Created:', result.data);
} else {
  console.error('Error:', result.error);
}
```

---

## Notes untuk Backend Team

1. **Konsisten dengan field names** - Gunakan nama field yang sama dengan ERD (snake_case)
2. **Selalu return `success: true/false`** - Biar frontend mudah cek status
3. **Gunakan HTTP status code yang benar** - 200/201/400/404/500
4. **Validation errors** - Kembalikan array `details` dengan field dan message
5. **Date format** - Gunakan ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
6. **Pagination** - Untuk list endpoints, selalu include pagination info
7. **Test semua endpoint** - Pastikan response sesuai dengan dokumentasi ini

---

## Endpoints yang Harus Didokumentasikan

Berdasarkan ERD yang sudah dibuat:

### Products (Vivaldi)
- [ ] GET /products
- [ ] GET /products/:id
- [ ] POST /products
- [ ] PATCH /products/:id
- [ ] DELETE /products/:id

### Components/BoM (Teguh)
- [ ] GET /komponen
- [ ] GET /komponen/:id
- [ ] POST /komponen
- [ ] PATCH /komponen/:id
- [ ] DELETE /komponen/:id
- [ ] GET /products/:id/bom
- [ ] POST /products/:id/bom

### Procurement History (Teguh)
- [ ] GET /riwayat-pengadaan
- [ ] GET /riwayat-pengadaan/:id
- [ ] POST /riwayat-pengadaan
- [ ] GET /products/:id/riwayat-pengadaan

### Estimation (Farid)
- [ ] GET /estimasi-harga
- [ ] GET /estimasi-harga/:id
- [ ] POST /estimasi-harga
- [ ] POST /estimasi-harga/predict

### JISDOR (Farid & Agung)
- [ ] GET /kurs-jisdor/current
- [ ] GET /kurs-jisdor/history
- [ ] POST /kurs-jisdor/sync

**Data Source:** Bank Indonesia SOAP Web Service  
**BI Web Service URL:** https://www.bi.go.id/biwebservice/wskursbi.asmx  
**Available Operations:**
- `getSubKursLokal3` - Get latest JISDOR rate
- `getSubKursLokal2` - Get JISDOR by date range
- `getSubKursLokal4` - Get JISDOR by specific date

**Backend Task:** 
1. Consume BI SOAP service
2. Transform XML response to JSON
3. Store in database (table: `kurs_jisdor`)
4. Expose REST API endpoints for frontend
5. Setup scheduled job to sync daily (cron job)

### Audit Trail (Teguh)
- [ ] GET /audit-trail
- [ ] GET /audit-trail/:entity_type/:entity_id

### Vendor (Team)
- [ ] GET /vendor
- [ ] GET /vendor/:id
- [ ] POST /vendor
- [ ] PATCH /vendor/:id
- [ ] DELETE /vendor/:id

---

## Example: JISDOR Endpoints

### GET /kurs-jisdor/current
**Description:** Get latest JISDOR rate (USD to IDR)

**Request:**
- Method: `GET`
- URL: `/kurs-jisdor/current`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id_kurs": 1,
    "tanggal_kurs": "2025-11-14",
    "nilai_kurs": 15750.50,
    "created_at": "2025-11-14T10:00:00.000Z"
  }
}
```

### GET /kurs-jisdor/history
**Description:** Get historical JISDOR rates

**Request:**
- Method: `GET`
- URL: `/kurs-jisdor/history`
- Query Params (optional):
  - `start_date` - Start date (YYYY-MM-DD)
  - `end_date` - End date (YYYY-MM-DD)
  - `limit` - Number of records (default: 30)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "rates": [
      {
        "id_kurs": 1,
        "tanggal_kurs": "2025-11-14",
        "nilai_kurs": 15750.50,
        "created_at": "2025-11-14T10:00:00.000Z"
      },
      {
        "id_kurs": 2,
        "tanggal_kurs": "2025-11-13",
        "nilai_kurs": 15745.00,
        "created_at": "2025-11-13T10:00:00.000Z"
      }
    ],
    "summary": {
      "average": 15747.75,
      "highest": 15750.50,
      "lowest": 15745.00,
      "count": 2
    }
  }
}
```

### POST /kurs-jisdor/sync
**Description:** Manually trigger sync with BI Web Service

**Request:**
- Method: `POST`
- URL: `/kurs-jisdor/sync`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "records_synced": 1,
    "latest_rate": {
      "tanggal_kurs": "2025-11-14",
      "nilai_kurs": 15750.50
    }
  },
  "message": "JISDOR data synchronized successfully"
}
```

**Response Error (500):**
```json
{
  "success": false,
  "error": "Failed to connect to BI Web Service"
}
```

---

**Instruksi untuk Backend Team:**

1. Copy template ini untuk setiap endpoint yang kalian buat
2. Isi semua bagian yang ada (request, response, status codes)
3. Test endpoint dengan Postman/Thunder Client
4. Pastikan response sesuai dengan format yang didokumentasikan

---

**Last Updated:** November 14, 2025  
**Maintainer:** Backend Team

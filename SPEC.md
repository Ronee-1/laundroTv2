# SPEC.md — laundroT Functional Requirements Specification

> **Versi:** 1.0  
> **Tanggal:** 2026-07-06  
> **Arsitektur:** Hub-and-Spoke (Monorepo npm workspace)

---

## Overview

laundroT adalah sistem manajemen laundry multi-cabang dengan arsitektur Hub-and-Spoke. Sistem ini mengelola operasi laundry dari 5 cabang aktif di wilayah Jabodetabek dengan fitur utama: logistics (kurir), inventaris, keuangan, dan audit.

**Komponen Utama:**
- **Hub (`/hub`)**: Backend service terpusat (Express + TypeScript)
- **Spokes (`/spokes/branch-app`)**: Frontend React untuk semua role pengguna
- **Packages (`/packages/shared-types`)**: Shared TypeScript types

**User Roles:**
| Role | Akses |
|------|-------|
| Owner | Dashboard makro seluruh cabang, peta interaktif, audit kas |
| Admin Operasional | Input pelanggan, alokasi kurir, stok bahan baku |
| Kurir | Tugas harian, navigasi, update status pesanan |

---

## 5.1 Modul Kurir

### FR-001: Daftar Tugas Pelanggan Terurut
| Atribut | Detail |
|---------|--------|
| **ID** | FR-KUR-001 |
| **Trigger** | Kurir membuka halaman utama menu Dashboard Kurir |
| **Aktor** | Sistem |
| **Deskripsi** | Sistem menampilkan daftar tugas penjemputan/pengantaran laundry sesuai dengan urutan baris penugasan yang telah di-plot secara manual oleh Admin Cabang |

**Implementasi:**
- `spokes/branch-app/src/components/DashboardKurir.tsx` — Tab "Tugas Pelanggan"
- `spokes/branch-app/src/components/TugasHarian.tsx` — Component tugas harian kurir
- Endpoint: `GET /api/couriers/:idKurir/tasks`

**Mock Data Sample:**
```typescript
interface CourierTask {
  id_order: string;
  alamat_penjemputan: string;
  alamat_pengantaran: string;
  koordinat_penjemputan: { latitude: number; longitude: number };
  koordinat_pengantaran: { latitude: number; longitude: number };
  status: string;
  berat_kg?: number;
  google_maps_url: string;
}
```

**UI Specification:**
- Kartu tugas dengan ID order, alamat lengkap, badge status
- Tab navigation: "Tugas Pelanggan" | "Operasional"
- Badge penanda jumlah tugas aktif

---

### FR-002: Navigasi Google Maps Eksternal
| Atribut | Detail |
|---------|--------|
| **ID** | FR-KUR-002 |
| **Trigger** | Kurir menekan ikon "Navigasi" pada kartu detail pesanan aktif pelanggan |
| **Aktor** | Sistem |
| **Deskripsi** | Sistem menyediakan tautan pintas navigasi eksternal menuju aplikasi Google Maps sesuai titik koordinat alamat tujuan |

**Implementasi:**
- Tombol "Google Maps" pada setiap kartu tugas
- Membuka `window.open(task.google_maps_url, '_blank')`
- URL diformat: `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`

**UI Specification:**
- Tombol dengan ikon pin lokasi (SVG path)
- Warna: `bg-deep-blue hover:bg-navy`
- Flex layout dengan icon di kiri dan teks "Google Maps"

---

### FR-003: Ubah Status Pesanan Berjenjang
| Atribut | Detail |
|---------|--------|
| **ID** | FR-KUR-003 |
| **Trigger** | Kurir mengetuk tombol konfirmasi status di aplikasi web seluler |
| **Aktor** | Kurir |
| **Deskripsi** | Mengubah status pesanan secara instan dari Pending → On Route → Arrived → Done |

**Implementasi:**
- `NEXT_STATUS` mapping constant
- `handleCustomerStatusChange()` function
- Endpoint: `PATCH /api/orders/:id_order/status`

**Status Flow:**
```
Pending → On Route → Arrived → Done
```

**UI Specification:**
- Tombol dinamis: "Ubah ke [next_status]"
- Disabled state jika tidak ada next status
- Loading indicator saat request

**Offline Queue Support:**
- Jika offline, aksi disimpan di IndexedDB queue
- Timestamps preserved untuk audit trail
- Sinkronisasi otomatis saat koneksi pulih

---

## 5.2 Modul Admin Cabinang/Operasional

### FR-004: Input Data Pelanggan Baru
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OPE-004 |
| **Trigger** | Admin membuka sub-menu "Input Data Pelanggan" pada dashboard cabang |
| **Aktor** | Admin Operasional |
| **Deskripsi** | Sistem menyediakan antarmuka form digital untuk menambahkan profil data nama, nomor WhatsApp, dan alamat lengkap pelanggan baru |

**Implementasi:**
- `spokes/branch-app/src/components/InputPelanggan.tsx`
- Endpoint: `POST /api/branches/:id_cabang/customer`

**Form Fields:**
| Field | Type | Validation |
|-------|------|------------|
| Nama Lengkap | text | Required, min 2 chars |
| Nomor WhatsApp | tel | Required, numeric format |
| Link Google Maps | text | Required, valid URL pattern |

**Google Maps URL Validation:**
```typescript
const isValidGoogleMapsUrl = (url: string): boolean => {
  return (
    url.includes('google.com/maps') ||
    url.includes('maps.google.com') ||
    url.includes('maps.app.goo.gl') ||
    url.includes('goo.gl/maps')
  );
};
```

---

### FR-005: Alokasi & Plotting Penugasan Kurir
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OPE-005 |
| **Trigger** | Admin mengakses modul kontrol Tugas Kurir |
| **Aktor** | Admin Operasional |
| **Deskripsi** | Sistem menyediakan fitur alokasi dan plotting penugasan orderan harian langsung ke kurir logistik lokal yang aktif |

**Implementasi:**
- `spokes/branch-app/src/components/DashboardAdmin.tsx` — Section "Courier Allocation"
- Tabel dengan kolom: Courier Name, Status, Current Task, Capacity, Action

**Courier Status Types:**
- `Pickup` — Sedang mengambil laundry
- `Delivery` — Sedang mengantar
- `Idle` — Tidak ada tugas aktif

**UI Specification:**
- Material Design 3 styling
- Avatar circular dengan initials
- Progress bar kapasitas
- Action menu dropdown

---

### FR-006: Mutasi Stok Bahan Baku (PCS)
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OPE-006 |
| **Trigger** | Admin mengakses menu mutasi stok pasca siklus laundry harian |
| **Aktor** | Admin |
| **Deskripsi** | Sistem menyediakan antarmuka pengisian mutasi sisa stok komoditas utama dalam bentuk kuantitas PCS (deterjen, pelembut, dan kemasan plastik) |

**Implementasi:**
- `spokes/branch-app/src/components/InventarisPemantau.tsx` — Stock monitoring
- `spokes/branch-app/src/components/RestockModal.tsx` — Restock request form
- `spokes/branch-app/src/components/DashboardAdmin.tsx` — Inventory Matrix

**Komoditas yang Dimonitor:**
| Komoditas | Satuan | Safety Threshold | Max Capacity |
|-----------|--------|------------------|--------------|
| Detergen Cair | PCS | 50 | 100 |
| Pelembut | PCS | 50 | 80 |
| Plastik Packing | PCS | 100 | 500 |

**Stock Status Levels:**
- `Aman` — Stok di atas safety threshold
- `Menipis` — Stok 50-100% dari threshold
- `Kritis` — Stok di bawah safety threshold

---

### FR-007: Indikator Stok Kritis (Peringatan Visual)
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OPE-007 |
| **Trigger** | Kuantitas stok bahan baku lokal turun di bawah ambang pengaman (safety stock threshold) |
| **Aktor** | Sistem |
| **Deskripsi** | Sistem menampilkan indikator peringatan visual warna merah berkedip bertuliskan "Stok Kritis" di tabel matriks performa cabang |

**Implementasi:**
- `spokes/branch-app/src/components/InventarisPemantau.tsx`
- `spokes/branch-app/src/components/DashboardAdmin.tsx`

**Visual Indicators:**
```tsx
// Red blinking alert banner
<div className="bg-red-50 border border-red-200 rounded-2xl p-4 animate-blink">
  <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
  <span className="text-sm font-bold text-red-600 uppercase tracking-wide">
    ⚠️ Stok Kritis / Menipis
  </span>
</div>

// Per-item warning
{isLow && (
  <span className="text-[10px] text-red-600 font-semibold animate-blink">
    ⚠️ {stock.status === 'Kritis' ? 'Stok Kritis' : 'Stok Menipis'}
  </span>
)}
```

**Threshold Triggers:**
- Detergen < 50 pcs → Kritis
- Pelembut < 50 pcs → Kritis
- Plastik < 100 pcs → Kritis

---

## 5.3 Modul Owner / Admin Pusat

### FR-008: Visualisasi Peta Sebaran Branch
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OWN-008 |
| **Trigger** | Admin Pusat atau pemilik mengakses halaman utama dashboard |
| **Aktor** | Owner/Admin pusat |
| **Deskripsi** | Sistem menyediakan visualisasi peta geografis (atau kisi matriks visual interaktif) yang menampilkan seluruh titik cabang aktif beserta status tingkat inventaris harian mereka |

**Implementasi:**
- `spokes/branch-app/src/components/JabodetabekMap.tsx` — Component peta interaktif
- `spokes/branch-app/src/components/DashboardEksekutif.tsx` — Network Distribution map

**Map Coordinates:**
```typescript
const MAP_COORDS: Record<string, { x: number; y: number }> = {
  'CBG-001': { x: 45, y: 70 }, // Depok
  'CBG-002': { x: 40, y: 45 }, // Jakarta Selatan
  'CBG-003': { x: 70, y: 50 }, // Bekasi Timur
  'CBG-004': { x: 20, y: 40 }, // Tangerang Kota
  'CBG-005': { x: 48, y: 90 }, // Bogor Raya
};
```

**Pin Colors:**
| Color | Meaning |
|-------|---------|
| Green (`#0056c6`) | Healthy — Aman |
| Yellow (`#d97706`) | Warning — Butuh Perhatian |
| Red (`#ba1a1a`) | Critical — Kritis |

---

### FR-009: Indikator Otomatis Merah pada Peta
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OWN-009 |
| **Trigger** | Salah satu komoditas utama (detergen, pelembut, dan plastik) di cabang tersebut menyentuh batas kritis (safety stock level) atau batas bulanan habis |
| **Aktor** | Sistem |
| **Deskripsi** | Sistem mengubah warna indikator titik cabang secara otomatis menjadi merah pada peta sebaran visual utama |

**Implementasi:**
- `getBranchStatus()` function di `DashboardEksekutif.tsx`
- Dynamic pin color berdasarkan inventory status

**Logic:**
```typescript
function getBranchStatus(b: BranchFinancial): string {
  const hasKritisStock = b.inventory.stocks.some((s) => s.status === 'Kritis');
  const hasMenipisStock = b.inventory.stocks.some((s) => s.status === 'Menipis');
  const isOverBudget = b.total_pengeluaran > b.pagu_anggaran;
  const isCloseBudget = b.utilization_percent >= 90;
  
  if (hasKritisStock || isOverBudget) return 'Kritis';
  if (hasMenipisStock || isCloseBudget) return 'Butuh Perhatian';
  return 'Aman';
}
```

**Pulse Animation untuk Critical:**
```tsx
{hasKritis && (
  <div className="absolute w-4 h-4 rounded-full animate-ping absolute opacity-75"
    style={{ backgroundColor: statusColor }}>
  </div>
)}
```

---

### FR-010: Dashboard Makro Keuangan Owner
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OWN-010 |
| **Trigger** | Owner sukses login dan masuk ke menu utama Dashboard |
| **Aktor** | Owner |
| **Deskripsi** | Sistem menampilkan data makro konsolidasi omzet, total pengeluaran agregat, dan total profit bersih gabungan seluruh cabang |

**Implementasi:**
- `spokes/branch-app/src/components/DashboardEksekutif.tsx`
- Endpoint: `GET /api/owner/dashboard`

**KPI Metrics:**
| Metric | Calculation |
|--------|-------------|
| Total Omzet | Σ(pemasukan seluruh cabang) |
| Total Pengeluaran | Σ(pengeluaran seluruh cabang) |
| Total Profit Bersih | Total Omzet - Total Pengeluaran |
| Profit Efficiency | (Total Saldo / Total Omzet) × 100% |

**UI Components:**
- Primary metric card dengan "Total Turnover"
- Profit Efficiency donut chart
- Branch Performance table

---

### FR-011: Cash Flow Charts
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OWN-011 |
| **Trigger** | Pemilik mengakses halaman utama "dashboard utama keuangan eksekutif" |
| **Aktor** | Owner |
| **Deskripsi** | Sistem menampilkan visualisasi grafik arus kas masuk/keluar (cash flow charts), akumulasi realization biaya bulanan, serta indikator sisa dana anggaran gabungan multi cabang |

**Implementasi:**
- `spokes/branch-app/src/components/DashboardEksekutif.tsx`
- Backend: `hub/src/services/cashbook.ts`

**Cashbook Service:**
```typescript
export function getJournalSummary(id_cabang?: string): {
  total_pemasukan: number;
  total_pengeluaran: number;
  saldo: number;
  total_entries: number;
}
```

**UI Components:**
- Budget utilization progress bars
- Per-branch pagu_anggaran breakdown
- Real-time remaining budget indicator

---

### FR-012: Over Budget Validation
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OWN-012 |
| **Trigger** | Admin cabang menginput pengeluaran di menu Pengeluaran yang nominalnya melampaui sisa batas bulanan cabang |
| **Aktor** | Sistem |
| **Deskripsi** | Sistem menolak proses penyimpanan data pengeluaran dan menampilkan pesan galat "Over Budget: Melebihi Batas Sisa" |

**Implementasi:**
- Frontend: `AuditRekonsiliasi.tsx`, `ExpenseModal.tsx`
- Backend: `hub/src/services/budget.ts` → `checkOverbudget()`

**Error Message:**
```
Over Budget: Melebihi Batas Sisa.
Nominal melebihi sisa batas anggaran operasional.
```

**Budget Service:**
```typescript
export function checkOverbudget(id_cabang: string, nominal: number): {
  overbudget: boolean;
  sisa_pagu: number;
  pagu_anggaran: number;
  terpakai: number;
  requested: number;
  projected_total: number;
}
```

**UI Error Display:**
```tsx
{overBudgetError && (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
    <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {overBudgetError}
    </div>
  </div>
)}
```

---

### FR-013: Audit Kas / Rekonsiliasi
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OWN-013 |
| **Trigger** | Pengguna membuka menu Audit Kas untuk fungsi penutupan buku kas operasional |
| **Aktor** | Owner / Admin |
| **Deskripsi** | Sistem menyediakan fitur pencatatan lembar kerja rekonsiliasi data pencatatan transaksi digital aplikasi dengan uang kas fisik laci kasir |

**Implementasi:**
- `spokes/branch-app/src/components/AuditRekonsiliasi.tsx`
- Endpoint: `POST /api/branches/:id_cabang/reconcile`

**Reconciliation Flow:**
1. Admin menghitung kas fisik di laci kasir
2. Admin input nominal kas fisik (blind input)
3. Sistem bandingkan dengan data digital
4. Jika selisih ≠ 0 → discrepancy alert
5. Owner approve/reject hasil audit

**Reconciliation Result:**
```typescript
interface ReconcileResult {
  id_rekonsiliasi: string;
  id_cabang: string;
  nama_cabang: string;
  kas_digital: number;
  kas_fisik: number;
  selisih: number;
  status: string; // 'Cocok' | 'Selisih'
  approval_status: string;
  message: string;
}
```

**UI Design:**
- Blind input design (Admin tidak melihat digital balance)
- Result panel dengan komparasi 3 kolom (Digital, Fisik, Selisih)
- History log dengan filter tanggal/cabang

---

### FR-014: AI Stock Recommendation Tooltip
| Atribut | Detail |
|---------|--------|
| **ID** | FR-OWN-014 |
| **Trigger** | Pengguna mengklik penanda titik cabang aktif di peta (AI Stock Recommendation) |
| **Aktor** | Sistem |
| **Deskripsi** | Sistem menampilkan teks "AI Recommendation: Direkomendasikan melakukan restock X komoditas sebanyak Y PCS" pada tooltips komponen Peta Sebaran Jabodetabek |

**Implementasi:**
- `spokes/branch-app/src/components/DashboardEksekutif.tsx` — Line 369-375
- Hover tooltip pada map markers

**Tooltip Content:**
```tsx
<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-3 rounded-xl text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg"
  style={{ backgroundColor: '#0b1c30', color: 'white' }}>
  <p className="font-bold border-b border-white/20 pb-1 mb-1">{b.nama_cabang}</p>
  <p className="text-xs mb-1">LaundroT AI Recommendation</p>
  <p className="text-xs opacity-90">"Stok Detergen dan Plastik Packing berada di bawah batas pengaman</p>
  <p className="text-xs">(Detergen: {detergenPercent} pcs, Plastik: {plastikPercent} pcs)..."</p>
</div>
```

**Recommendation Logic:**
```typescript
const detergenStock = b.inventory.stocks.find(s => s.item === 'Detergen');
const plastikStock = b.inventory.stocks.find(s => s.item === 'Plastik');

// Calculate recommended restock quantity
const detergenRecommendation = Math.max(0, 100 - detergenStock.stok_saat_ini);
const plastikRecommendation = Math.max(0, 500 - plastikStock.stok_saat_ini);
```

---

### FR-015: Pilihan Metode Pembayaran Tunai / Non-Tunai
| Atribut | Detail |
|---------|--------|
| **ID** | FR-SERVICE-02 |
| **Trigger** | Admin Outlet mengakses halaman Input Layanan Outlet |
| **Aktor** | Admin Outlet |
| **Deskripsi** | Sistem menyediakan pilihan metode pembayaran Tunai atau Non-Tunai pada saat input order layanan, dengan tampilan visual yang jelas untuk membedakan kedua metode |

**Implementasi:**
- `spokes/branch-app/src/components/OutletReception.tsx`
- `api/orders/index.ts` — accept `metode_pembayaran` field
- `prisma/schema.prisma` — add `metode_pembayaran` field to Order model

**Metode Pembayaran:**
| Metode | Icon | Warna Badge | Keterangan |
|--------|------|-------------|------------|
| Tunai | 💵 | Green (#22c55e) | Pembayaran langsung di outlet |
| Non-Tunai | 💳 | Purple (#a855f7) | Pembayaran via transfer/e-wallet |

**UI Specification:**
```tsx
// Payment method toggle buttons
<div className="grid grid-cols-2 gap-3">
  <button
    type="button"
    onClick={() => setPaymentMethod('Tunai')}
    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 ${
      paymentMethod === 'Tunai'
        ? 'border-deep-blue bg-blue-50 text-deep-blue'
        : 'border-slate-200 bg-white text-slate-600'
    }`}
  >
    <svg className="w-5 h-5">💵</svg>
    <span>Tunai</span>
  </button>

  <button
    type="button"
    onClick={() => setPaymentMethod('Non-Tunai')}
    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 ${
      paymentMethod === 'Non-Tunai'
        ? 'border-deep-blue bg-blue-50 text-deep-blue'
        : 'border-slate-200 bg-white text-slate-600'
    }`}
  >
    <svg className="w-5 h-5">💳</svg>
    <span>Non-Tunai</span>
  </button>
</div>
```

**Price Breakdown Display:**
```tsx
<div className="flex justify-between items-center">
  <span>Metode Bayar</span>
  <span className={`badge ${
    paymentMethod === 'Tunai'
      ? 'bg-green-100 text-green-700'
      : 'bg-purple-100 text-purple-700'
  }`}>
    {paymentMethod === 'Tunai' ? '💵 Tunai' : '💳 Non-Tunai'}
  </span>
</div>
```

**Database Schema Update:**
```prisma
model Order {
  // ... existing fields
  metode_pembayaran String? @default("Tunai")

  @@index([metode_pembayaran])
}
```

**API Request Body:**
```typescript
{
  id_pelanggan: string,
  customer_name: string,
  customer_whatsapp: string,
  id_layanan: string,
  service_name: string,
  qty: number,
  satuan: string,
  berat_kg: number,
  total_harga: number,
  status: "Diproses",
  metode_pembayaran: "Tunai" | "Non-Tunai"  // NEW
}
```

---

### FR-016: Dashboard Admin - Pendapatan & Metode Pembayaran
| Atribut | Detail |
|---------|--------|
| **ID** | FR-ADMIN-016 |
| **Trigger** | Admin Branch mengakses Dashboard Admin |
| **Aktor** | Admin Branch |
| **Deskripsi** | Dashboard Admin menampilkan ringkasan pendapatan harian dari layanan yang digunakan pelanggan, dengan breakdown Tunai dan Non-Tunai. Card "Kontrol Anggaran" digantikan dengan card "Pendapatan" |

**Implementasi:**
- `spokes/branch-app/src/components/DashboardAdmin.tsx`
- `api/branches/[id]/daily-summary.ts`

**Card "Pendapatan" Features:**
| Metric | Deskripsi |
|--------|-----------|
| Total Hari Ini | Total pendapatan dari semua order hari ini |
| 💵 Tunai | Pendapatan metode pembayaran Tunai |
| 💳 Non-Tunai | Pendapatan metode pembayaran Non-Tunai |
| Bulan Ini | Total pendapatan bulan berjalan |

**API Response:**
```typescript
{
  success: true,
  today_revenue: number,      // Total revenue hari ini
  month_revenue: number,      // Total revenue bulan ini
  today_orders: number,        // Jumlah order hari ini
  month_orders: number,        // Jumlah order bulan ini
  today_cash: number,          // Revenue Tunai hari ini
  today_non_cash: number,      // Revenue Non-Tunai hari ini
}
```

**UI Card Layout:**
```
┌────────────────────────────────────────┐
│ Pendapatan          [💰 Icon]          │
│ Ringkasan Pendapatan                     │
├────────────────────────────────────────┤
│ Total Hari Ini                          │
│ Rp 1.250.000                           │
│ 15 order                               │
├──────────────────┬─────────────────────┤
│ 💵 Tunai          │ 💳 Non-Tunai       │
│ Rp 850.000        │ Rp 400.000          │
├──────────────────┴─────────────────────┤
│ Bulan Ini            Rp 15.750.000      │
│                     125 order           │
└────────────────────────────────────────┘
```

---

## Appendix: Endpoint Summary

| Method | Endpoint | FR Coverage |
|--------|----------|-------------|
| GET | `/api/couriers/:idKurir/tasks` | FR-001 |
| PATCH | `/api/orders/:id_order/status` | FR-003 |
| POST | `/api/branches/:id_cabang/customer` | FR-004 |
| GET | `/api/owner/dashboard` | FR-008, FR-009, FR-010, FR-011 |
| POST | `/api/expenses/request` | FR-012 |
| POST | `/api/branches/:id_cabang/reconcile` | FR-013 |
| GET | `/api/branches/reconcile/all` | FR-013 |
| GET | `/api/branches/:id/daily-summary` | FR-016 |
| GET | `/api/logistics/active` | FR-KUR-001 |
| POST | `/api/logistics/:id/start-route` | FR-KUR-003 |
| POST | `/api/logistics/:id/handover` | FR-KUR-003 |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-06 | System | Initial FR alignment with codebase |
| 1.1 | 2026-07-15 | System | Added FR-015: Pilihan Metode Pembayaran Tunai / Non-Tunai |
| 1.2 | 2026-07-15 | System | Added FR-016: Dashboard Admin - Card Pendapatan dengan breakdown Tunai/Non-Tunai |

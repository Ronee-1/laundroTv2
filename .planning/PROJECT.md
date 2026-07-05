# Project Vision & Scope — Laundro Truck v2.0

## 1. Problem Statement

Pengelola Operasional Laundry tidak memiliki sistem terintegrasi yang mampu mengalokasikan rute kurir secara terisolasi di 5 cabang operasional secara efisien, sekaligus mengonsolidasikan seluruh arus transaksi pemasukan dan pengeluaran secara terpusat ke dalam 1 atau 2 outlet utama sebagai pusat kendali finansial[^15^][^16^]. Hal ini menyebabkan tingginya risiko kebocoran dana di cabang pembantu, salah alokasi logistik, dan hilangnya visibilitas finansial bagi pemilik bisnis[^17^].

## 2. Core Objectives & Success Metrics

### 2.1 Konsolidasi Finansial 100% Valid
Sentralisasi pencatatan dari 5 cabang ke 1-2 outlet utama mengeliminasi celah manipulasi uang di kasir cabang pembantu dengan indikator:
- Selisih kas hasil audit operasional bernilai **Rp0** di seluruh cabang[^25^]

### 2.2 Isolasi Logistik yang Efisien
Mencegah kurir antar-cabang saling berebut wilayah dan mengoptimalkan pengantaran lokal dengan indikator:
- Penurunan total biaya pengeluaran BBM kumulatif sebesar **20% dalam 3 bulan**[^25^][^26^]

### 2.3 Kontrol Anggaran Ketat (Anti-Overbudget)
Setiap pengeluaran kas di cabang pembantu wajib divalidasi oleh sistem berdasarkan sisa pagu dari Hub utama dengan:
- Deviasi pengeluaran bulanan maksimal **5%** dari pagu yang ditetapkan Pemilik[^26^]

## 3. Scope Boundaries

### 3.1 IN Scope (MVP v2.0 - Multibranch Framework)

| # | Fitur | Keterangan |
|---|-------|------------|
| 1 | **Arsitektur Hub-and-Spoke** | 5 Cabang Operasional Logistik dengan 1-2 Outlet Utama sebagai Pusat Keuangan[^28^] |
| 2 | **Static Georouting** | Alokasi pesanan manual dari WhatsApp Center Pusat ke cabang terdekat berbasis jarak geografis[^28^] |
| 3 | **Isolasi Data Branch** | Dashboard kurir dan admin cabang — Pengguna hanya bisa berinteraksi dengan data milik cabangnya sendiri[^28^] |
| 4 | **Modul Mutasi & Permintaan Darurat** | Pengajuan mutasi dan permintaan stok bahan baku/dana darurat dari cabang ke Outlet Utama melalui sistem[^28^] |
| 5 | **Order Quota & Queue** | Sistem batas kuota harian per cabang untuk mengendalikan beban penutupan slot pesanan kurir[^28^] |
| 6 | **Sistem Alert Visual** | Peringatan visual pada dashboard pusat untuk status kritis |
| 7 | **Cash Flow Dua Arah** | Modul Laporan Arus Kas pemasukan dan pengeluaran terpusat |

### 3.2 OUT of Scope (v2.0)

| # | Fitur | Alasan |
|---|-------|--------|
| 1 | Fleet Sharing / Peminjaman Kurir Dinamis | Interaksi armada antar-cabang tidak termasuk dalam MVP[^28^] |
| 2 | Inter-Branch Laundry Processing | Logistik internal pengiriman baju mentah/setengah matang antar-workshop cabang[^28^] |
| 3 | Open Banking API | Integrasi otomatisasi transfer perbankan atau rekonsiliasi bank otomatis[^28^] |
| 4 | Chatbot AI Otomatis | Sistem chatbot AI untuk pendaftaran mandiri pelanggan tanpa admin[^28^] |
| 5 | Payload Weight Validation | Kalkulasi batas berat beban maksimal kendaraan berbasis sensor otomatis[^28^] |

## 4. Hard Constraints

### 4.1 Teknologi Stack

| Layer | Teknologi | Spesifikasi |
|-------|-----------|-------------|
| Runtime | Node.js + TypeScript | Wajib compile-time type safety |
| Frontend | React PWA | Service Worker untuk fungsionalitas antrean luring/offline queue kurir[^61^] |
| Backend | Express | REST API dengan middleware terstruktur |
| Structure | Monorepo | npm workspaces untuk paket shared-types |

### 4.2 Keamanan Data (UU PDP No. 27 Tahun 2022)

Pengamanan data wajib mematuhi regulasi UU Perlindungan Data Pribadi (PDP) No. 27 Tahun 2022[^60^]:

| Data Category | Metode Pengamanan |
|---------------|-------------------|
| Koordinat Alamat Pelanggan | Enkripsi pada level database (AES-256 atau setara) |
| Rekaman Finansial | Enkripsi pada level database (AES-256 atau setara) |
| Semua data sensitif | Tidal Cryptographic Erasure untuk data yang tidak diperlukan |

### 4.3 Kualitas Kode

- **Zero Hardcoded Secrets**: Seluruh kode program modular bebas dari hardcoded API Keys, kredensial, dan koordinat cabang statis[^57^]
- **Environment Configuration**: Konfigurasi harus menggunakan environment variables atau secure config management

---

## 5. Referensi

[^15^]: Kebutuhan sistem terintegrasi multcabang
[^16^]: Konsolidasi arus transaksi ke outlet utama
[^17^]: Risiko kebocoran dana dan hilangnya visibilitas
[^25^]: Indikator sukses konsolidasi finansial
[^26^]: Indikator efisiensi logistik dan kontrol anggaran
[^28^]: Scope MVP v2.0
[^57^]: Quality code requirement - no hardcoded secrets
[^60^]: UU PDP No. 27 Tahun 2022 compliance
[^61^]: PWA offline queue requirement

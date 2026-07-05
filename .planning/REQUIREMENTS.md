# Traceable Requirements Table — Laundro Truck v2.0

## 1. Functional Requirements (FR-IDs)

### 1.1 Logistik (FR-LOG)

| ID | Deskripsi | Prioritas | Referensi |
|----|-----------|-----------|-----------|
| **FR-LOG-01** | Admin Pusat menentukan dan merekomendasikan cabang pemroses (dari 5 cabang) berdasarkan jarak terdekat dengan koordinat pelanggan ketika Admin Pusat menginput data alamat dari pesan WhatsApp masuk. | **Must Have** | [^32^] |
| **FR-LOG-02** | Admin Cabang men-generate rute harian (batching) yang hanya mengeksekusi daftar pesanan teralokasi di cabangnya sendiri ketika Admin Cabang menekan tombol "Generate Batch/Rute" di halaman logistik lokal. | **Must Have** | [^32^] |
| **FR-LOG-03** | Kurir Cabang menampilkan koordinat alamat tugas dan menyediakan pintasan navigasi luar ke aplikasi Google Maps ketika Kurir membuka halaman utama "Tugas Harian" pada aplikasi seluler miliknya. | **Must Have** | [^32^][^33^] |

### 1.2 Keuangan (FR-FIN)

| ID | Deskripsi | Prioritas | Referensi | Catatan Integrasi |
|----|-----------|-----------|-----------|-------------------|
| **FR-FIN-01** | Sistem mengirimkan jurnal transaksi keuangan secara otomatis ke buku kas Outlet Utama dengan tag penanda cabang asal ketika status pesanan di cabang berubah menjadi "Selesai/Lunas". | **Must Have** | — | — |
| **FR-FIN-02** | Admin Pusat menampilkan antarmuka untuk menyetujui (Approve) atau menolak (Reject) permohonan pengeluaran kas/stok darurat cabang ketika ada salah satu dari 5 cabang yang mengajukan form pengeluaran tambahan. | **Must Have** | — | **Integrasi:** FR-FIN-08/FR-012/FR-013 |
| **FR-FIN-03** | Sistem menolak pencatatan transaksi kas keluar di tingkat cabang dan menampilkan error "Overbudget" jika melampaui sisa pagu dari Hub ketika Admin Cabang menginput rincian biaya operasional yang melebihi batas alokasi bulanan. | **Must Have** | — | **Integrasi:** FR-FIN-08/FR-012/FR-013 |
| **FR-FIN-08** | Formulir input pengeluaran operasional harian yang mencakup: tanggal, nominal, kategori kustom (listrik/gaji/logistik), cabang asal, dan bukti nota (upload foto). | **Must Have** | — | Extends FR-FIN-02, FR-FIN-03 |
| **FR-FIN-09** | Audit & Rekonsiliasi Kas — formulir input kas fisik vs kas digital harian, sistem menghitung selisih (discrepancy) dan menyimpan log audit untuk deteksi kebocoran dana. Mendukung indikator sukses selisih kas Rp0. | **Must Have** | [^25^][^47^] | — |

### 1.3 Inventaris (FR-INV)

| ID | Deskripsi | Prioritas | Referensi | Catatan |
|----|-----------|-----------|-----------|---------|
| **FR-INV-01** | Modul Pengawasan Inventaris — pelacakan stok bahan baku harian (detergen, pelembut, plastik) per cabang dengan safety threshold otomatis; sistem memberi peringatan jika stok di bawah batas minimum. Permintaan stok bahan baku darurat dari cabang ke Outlet Utama. | **Must Have** | [^28^] | Extends FR-FIN-02 (permintaan stok darurat) |

### 1.4 Kepemilikan & Visualisasi (FR-OWN)

| ID | Deskripsi | Prioritas | Referensi | Catatan |
|----|-----------|-----------|-----------|---------|
| **FR-OWN-01** | Pemilik menampilkan grafik tren arus kas terpadu dan performa profitabilitas yang dipisah per masing-masing dari 5 cabang operasional ketika Pemilik membuka halaman "Dashboard Utama Keuangan Eksekutif". | **Must Have** | [^34^] | — |
| **FR-OWN-02** | Sistem menampilkan visualisasi data poin/titik KPI performa seluruh cabang agar Admin Pusat mudah mengidentifikasi cabang yang membutuhkan bantuan cepat. | **Must Have** | — | — |
| **FR-OWN-03** | Dasbor Peta Interaktif wilayah Jabodetabek dengan pin berwarna dinamis (Hijau = Aman, Kuning = Peringatan, Merah = Kritis) berdasarkan status budget dan stok inventaris. | **Must Have** | [^34^] | Visualisasi spasial penunjang FR-OWN-01 |

---

## 2. Non-Functional Requirements (NF-IDs)

### 2.1 Struktur Database (NF01)

| ID | Deskripsi | Referensi |
|----|-----------|-----------|
| **NF01** | Struktur database wajib menyertakan indeks `id_cabang` pada setiap tabel relasional transaksi keuangan dan logistik. Ini memastikan query per-cabang efisien dan mendukung isolasi data antar-cabang. | [^58^] |

### 2.2 Keamanan Data (NF02)

| ID | Deskripsi | Referensi |
|----|-----------|-----------|
| **NF02** | Pengamanan data koordinat alamat pelanggan dan rekaman finansial mematuhi regulasi UU Perlindungan Data Pribadi (PDP) No. 27 Tahun 2022 dengan enkripsi pada level database (AES-256 atau setara). | [^60^] |

### 2.3 Offline Resilience (NF03)

| ID | Deskripsi | Referensi |
|----|-----------|-----------|
| **NF03** | Aplikasi web mobile kurir lolos uji performa pada kondisi jaringan rendah (3G/Edge) dengan mempertahankan fungsionalitas antrean luring (offline queue) dan mempertahankan timestamp asli kejadian perkara. Service Worker wajib mengimplementasikan sync queue untuk data tugas harian. | [^51^][^52^][^61^] |

### 2.4 Kualitas Kode (NF04)

| ID | Deskripsi | Referensi |
|----|-----------|-----------|
| **NF04** | Seluruh kode program modular bebas dari hardcoded API Keys (khususnya koordinat cabang). Konfigurasi harus menggunakan environment variables atau secure config management. | [^57^] |

---

## 3. Matriks Prioritas

| Priority | Description | Requirements |
|----------|-------------|--------------|
| **Must Have** | Wajib implemented dalam MVP | FR-LOG-01, FR-LOG-02, FR-LOG-03, FR-FIN-01, FR-FIN-02, FR-FIN-03, FR-FIN-08, FR-FIN-09, FR-INV-01, FR-OWN-01, FR-OWN-02, FR-OWN-03, NF01, NF02, NF03, NF04 |

---

## 4. Referensi

[^25^]: Indikator sukses konsolidasi finansial - selisih kas Rp0
[^28^]: Scope MVP v2.0 - modul mutasi & permintaan darurat
[^32^]: FR-LOG-01, FR-LOG-02 requirements
[^33^]: FR-LOG-03 - navigasi Google Maps
[^34^]: FR-OWN-01, FR-OWN-03 - Dashboard Eksekutif
[^47^]: FR-FIN-09 - status "Discrepancy / Selisih Dana"
[^51^]: NF03 - offline queue requirement
[^52^]: NF03 - timestamp preservation
[^57^]: NF04 - no hardcoded secrets
[^58^]: NF01 - database index requirement
[^60^]: NF02 - UU PDP No. 27 Tahun 2022 compliance
[^61^]: NF03 - PWA Service Worker requirement

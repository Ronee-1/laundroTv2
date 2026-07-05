# Phased Delivery Roadmap — Laundro Truck v2.0

## Overview

| Fase | Durasi | Fokus Utama |
|------|--------|-------------|
| Fase 1 | Minggu 1-4 | Arsitektur Multi-Cabang & Georouting |
| Fase 2 | Minggu 5-8 | Sentralisasi Keuangan & Modul Persediaan |
| Fase 3 | Minggu 9-12 | Dashboard Audit & Manajemen Kuota |

---

## Fase 1 — Arsitektur Multi-Cabang & Georouting

**Periode**: Minggu 1-4

### Fokus Pengembangan
Arsitektur Multi-Cabang & Georouting — Membangun fondasi sistem denganisolasi data per-cabang dan alokasi pesanan berbasis jarak geografis.

### Goals
- [ ] Menginisialisasi repositori monorepo dengan npm workspaces
- [ ] Menyiapkan struktur database multi-cabang terisolasi dengan indeks `id_cabang`
- [ ] Mengimplementasikan fitur penentuan cabang terdekat dari data WhatsApp masuk
- [ ] Membangun dashboard terisolasi untuk kurir dan admin cabang
- [ ] Zero hardcoded secrets — konfigurasi via environment variables

### Acceptance Criterion
> **Admin Pusat sukses memisahkan alokasi pesanan dari WhatsApp ke 5 cabang pembantu tanpa ada data yang tumpang tindih.**[^32^]
> Kurir hanya dapat melihat tugas di cabangnya sendiri.

### Requirements Covered

| ID | Requirement | Category |
|----|-------------|----------|
| FR-LOG-01 | Admin Pusat merekomendasikan cabang pemroses berdasarkan jarak terdekat dengan koordinat pelanggan | Logistik |
| FR-LOG-02 | Admin Cabang men-generate rute harian (batching) pesanan di cabangnya sendiri | Logistik |
| FR-LOG-03 | Kurir melihat koordinat alamat tugas dan pintasan navigasi Google Maps | Logistik |
| NF01 | Indeks `id_cabang` pada setiap tabel relasional transaksi | Non-Functional |
| NF04 | Zero hardcoded API Keys dan koordinat cabang | Non-Functional |

### Referensi
[^32^]: FR-LOG requirements, [^33^]: FR-LOG-03 navigation, [^57^]: NF04 quality, [^58^]: NF01 database index

---

## Fase 2 — Sentralisasi Keuangan & Modul Persediaan

**Periode**: Minggu 5-8

### Fokus Pengembangan
Sentralisasi Keuangan & Modul Persediaan — Membangun mekanisme penjurnalan otomatis dan alur otorisasi pengajuan darurat.

### Goals
- [ ] Membangun mekanisme penjurnalan otomatis transaksi kas masuk dari cabang ke Buku Kas Outlet Utama
- [ ] Mengimplementasikan alur pengajuan dana/stok darurat dengan hirarki otorisasi
- [ ] Menyediakan formulir input pengeluaran operasional harian dengan validasi
- [ ] Membangun modul pengawasan inventaris dengan safety threshold

### Acceptance Criterion
> **Seluruh transaksi dari 5 cabang sukses masuk ke dalam database jurnal tunggal di Buku Kas Outlet Utama.**[^33^]
> Modul pengajuan anggaran darurat bekerja sesuai hirarki otorisasi.

### Requirements Covered

| ID | Requirement | Category |
|----|-------------|----------|
| FR-FIN-01 | Jurnal transaksi otomatis ke Outlet Utama dengan tag cabang asal | Keuangan |
| FR-FIN-02 | Antarmuka Approve/Reject permohonan pengeluaran darurat cabang | Keuangan |
| FR-FIN-08 | Formulir input pengeluaran operasional harian (tanggal, nominal, kategori, bukti nota) | Keuangan |
| FR-FIN-09 | Audit & Rekonsiliasi Kas — deteksi selisih dan discrepancy | Keuangan |
| FR-INV-01 | Modul pengawasan inventaris dengan safety threshold & permintaan stok darurat | Inventaris |
| NF02 | Enkripsi koordinat alamat dan rekaman finansial (UU PDP No. 27 Tahun 2022) | Non-Functional |

### Referensi
[^33^]: FR-FIN-01 acceptance, [^47^]: FR-FIN-09 discrepancy status, [^60^]: NF02 UU PDP

---

## Fase 3 — Dashboard Audit & Manajemen Kuota

**Periode**: Minggu 9-12

### Fokus Pengembangan
Dashboard Audit & Manajemen Kuota — Membangun visualisasi untuk pemilik bisnis dan mekanisme kontrol anggaran ketat.

### Goals
- [ ] Membangun visualisasi dashboard eksekutif untuk pemilik bisnis (Dashboard Utama Keuangan Eksekutif)
- [ ] Mengimplementasikan mekanisme penanganan kuota kurir penuh (Order Quota & Queue)
- [ ] Membangun penolakan otomatis overbudget dengan error message
- [ ] Mengimplementasikan antrean luring (offline queue) kurir dengan Service Worker
- [ ] Menyediakan dasbor peta interaktif Jabodetabek dengan pin dinamis

### Acceptance Criterion
> **Sistem sukses memblokir transaksi pengeluaran yang melebihi pagu (Overbudget Error) dan memvisualisasikan grafik komparasi performa 5 cabang untuk Pemilik Bisnis.**[^33^][^34^]

### Requirements Covered

| ID | Requirement | Category |
|----|-------------|----------|
| FR-FIN-03 | Sistem tolak transaksi Overbudget dan tampilkan error | Keuangan |
| FR-FIN-08 | Extends: Formulir pengeluaran terikat kontrol pagu anggaran bulanan | Keuangan |
| FR-FIN-09 | Extends: Audit & Rekonsiliasi Kas mendukung indikator selisih kas Rp0 | Keuangan |
| FR-OWN-01 | Grafik tren arus kas terpadu dan profitabilitas per cabang | Kepemilikan |
| FR-OWN-02 | Visualisasi KPI performa seluruh cabang | Kepemilikan |
| FR-OWN-03 | Dasbor Peta Interaktif Jabodetabek dengan pin dinamis (Hijau/Kuning/Merah) | Kepemilikan |
| NF03 | Offline queue kurir pada jaringan 3G/Edge dengan timestamp preservation | Non-Functional |

### Referensi
[^33^]: FR-FIN-03 acceptance, [^34^]: FR-OWN-01/03 dashboard, [^51^][^52^]: NF03 offline, [^61^]: NF03 PWA

---

## 4. Summary Matriks Requirements vs Fase

| Requirement | Fase 1 | Fase 2 | Fase 3 |
|-------------|:------:|:------:|:------:|
| FR-LOG-01 | ✅ | | |
| FR-LOG-02 | ✅ | | |
| FR-LOG-03 | ✅ | | |
| FR-FIN-01 | | ✅ | |
| FR-FIN-02 | | ✅ | |
| FR-FIN-03 | | | ✅ |
| FR-FIN-08 | | ✅ | ✅ |
| FR-FIN-09 | | ✅ | ✅ |
| FR-INV-01 | | ✅ | |
| FR-OWN-01 | | | ✅ |
| FR-OWN-02 | | | ✅ |
| FR-OWN-03 | | | ✅ |
| NF01 | ✅ | | |
| NF02 | | ✅ | |
| NF03 | | | ✅ |
| NF04 | ✅ | | |

---

## 5. Success Criteria Summary

| Fase | Success Metric |
|------|----------------|
| **Fase 1** | Admin Pusat dapat mengalokasikan pesanan ke 5 cabang tanpa tumpang tindih data. Kurir hanya melihat tugas cabangnya sendiri. |
| **Fase 2** | 100% transaksi masuk ke jurnal tunggal Outlet Utama. Pengajuan darurat melalui otorisasi berjenjang. |
| **Fase 3** | Overbudget transaction blocked. Selisih kas audit = Rp0. Dashboard eksekutif menampilkan 5 cabang. |

---

## 6. Referensi

[^32^]: FR-LOG-01, FR-LOG-02, FR-LOG-03 requirements
[^33^]: FR-LOG-03 navigation, acceptance criteria Fase 1 & 2
[^34^]: FR-OWN-01, FR-OWN-03 dashboard requirements
[^47^]: FR-FIN-09 discrepancy status
[^51^]: NF03 offline queue requirement
[^52^]: NF03 timestamp preservation
[^57^]: NF04 zero hardcoded secrets
[^58^]: NF01 database index
[^60^]: NF02 UU PDP No. 27 Tahun 2022
[^61^]: NF03 PWA Service Worker

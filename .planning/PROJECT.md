# Project Vision & Scope — Laundro Truck v2.0

## 1. Problem Statement
Pengelola Operasional Laundry tidak memiliki sistem terintegrasi yang mampu mengalokasikan rute kurir secara terisolasi di 5 cabang operasional secara efisien, sekaligus mengonsolidasikan seluruh arus transaksi pemasukan dan pengeluaran secara terpusat ke dalam 1 atau 2 outlet utama sebagai pusat kendali finansial. Hal ini menyebabkan tingginya risiko kebocoran dana di cabang pembantu, salah alokasi logistik, dan hilangnya visibilitas finansial bagi pemilik bisnis.

## 2. Core Objectives & Success Metrics
1. **Konsolidasi Finansial 100% Valid**: Mengeliminasi celah manipulasi uang dengan indikator sukses selisih kas hasil audit operasional bernilai Rp0 di seluruh cabang.
2. **Isolasi Logistik yang Efisien**: Penurunan total biaya pengeluaran BBM kumulatif sebesar 20% dalam 3 bulan.
3. **Kontrol Anggaran Ketat (Anti-Overbudget)**: Deviasi pengeluaran bulanan maksimal 5% dari pagu yang ditetapkan Pemilik.

## 3. Scope Boundaries
### IN Scope (MVP v2.0)
- Arsitektur Hub-and-Spoke (5 Cabang Operasional Logistik, 1-2 Outlet Utama/Hub Finansial).
- Alokasi pesanan manual dari WhatsApp Center Pusat menggunakan Static Georouting.
- Isolasi dashboard kurir dan admin cabang (hanya melihat data cabangnya sendiri).
- Modul pengajuan mutasi/stok/dana darurat dari cabang ke Hub.
- Sistem batas kuota harian (Order Quota & Queue) per cabang.
- Sistem Alert/Peringatan visual pada dashboard pusat.
- Modul Laporan Arus Kas (Cash Flow) dua arah.

### OUT of Scope
- Fitur berbagi armada (fleet sharing) atau kurir antar-cabang secara dinamika.
- Logistik pengiriman internal baju antar-workshop cabang.
- Otomatisasi transfer perbankan / Open Banking API.
- Chatbot AI otomatis untuk pendaftaran mandiri pelanggan.

## 4. Hard Constraints
- Runtime: Node.js + TypeScript
- Frontend: React (PWA dengan Service Worker untuk antrean luring kurir)
- Backend: Express
- Structure: Monorepo dengan npm workspaces
- Security: Kepatuhan UU Perlindungan Data Pribadi (PDP) No. 27 Tahun 2022 dengan enkripsi pada level database.

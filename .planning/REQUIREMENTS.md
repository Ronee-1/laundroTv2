# Traceable Requirements Table

## Functional Requirements (F-IDs)
- **F01**: Admin Pusat dapat menentukan dan merekomendasikan cabang pemroses berdasarkan jarak terdekat dengan koordinat pelanggan saat input alamat dari WhatsApp.
- **F02**: Admin Cabang dapat melakukan batching rute harian lokal yang hanya mengeksekusi daftar pesanan teralokasi di cabangnya sendiri.
- **F03**: Kurir Cabang dapat melihat koordinat alamat tugas harian di aplikasi seluler mereka lengkap dengan pintasan navigasi ke Google Maps.
- **F04**: Sistem secara otomatis mengirimkan jurnal transaksi keuangan ke Buku Kas Outlet Utama dengan tag cabang asal ketika status pesanan berubah menjadi "Selesai/Lunas".
- **F05**: Admin Pusat memiliki antarmuka untuk menyetujui (Approve) atau menolak (Reject) permohonan pengeluaran darurat dari cabang.
- **F06**: Sistem otomatis menolak input pengeluaran operasional cabang dan menampilkan error Overbudget jika melampaui sisa pagu bulanan dari Hub.
- **F07**: Pemilik dapat melihat grafik tren arus kas terpadu dan performa profitabilitas yang dipisah per masing-masing cabang di Dashboard Utama Eksekutif.

## Non-Functional Requirements (NF-IDs)
- **NF01**: Struktur database wajib menyertakan indeks id_cabang pada setiap tabel relasional transaksi keuangan dan logistik.
- **NF02**: Enkripsi koordinat alamat pelanggan dan rekaman finansial sesuai regulasi UU PDP No. 27 Tahun 2022.
- **NF03**: Aplikasi web mobile kurir wajib mendukung fungsionalitas antrean luring (offline queue) pada jaringan rendah (3G/Edge) dengan mempertahankan timestamp asli kejadian perkara.
- **NF04**: Seluruh kode program modular harus bersih dari hardcoded API Keys (terutama koordinat cabang).

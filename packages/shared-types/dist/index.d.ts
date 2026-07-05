export type OrderStatus = 'Pending' | 'Diproses' | 'Siap Diantar' | 'Dalam Pengiriman' | 'Selesai' | 'Lunas' | 'Dibatalkan' | 'On Route' | 'Arrived' | 'Done';
export type TransactionType = 'Pemasukan' | 'Pengeluaran';
export interface Branch {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian: number;
    kuota_terpakai: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface Courier {
    id_kurir: string;
    id_cabang: string;
    nama_kurir: string;
    nomor_telepon: string;
    is_available: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface Order {
    id_order: string;
    id_cabang: string;
    id_pelanggan: string;
    id_kurir?: string;
    alamat_penjemputan: string;
    alamat_pengantaran: string;
    koordinat_penjemputan: {
        latitude: number;
        longitude: number;
    };
    koordinat_pengantaran: {
        latitude: number;
        longitude: number;
    };
    status: OrderStatus;
    catatan?: string;
    berat_kg?: number;
    total_harga?: number;
    tanggal_order: Date;
    tanggal_selesai?: Date;
    created_at: Date;
    updated_at: Date;
    customer_name?: string;
    customer_whatsapp?: string;
    service_type?: string;
    wilayah?: string;
    google_maps_url?: string;
    source?: 'whatsapp' | 'manual';
}
export interface Transaction {
    id_transaksi: string;
    id_cabang: string;
    id_order?: string;
    nominal: number;
    tipe: TransactionType;
    deskripsi: string;
    tanggal_transaksi: Date;
    created_at: Date;
    updated_at: Date;
}
export interface CashBookEntry {
    id_jurnal: string;
    id_cabang: string;
    id_transaksi: string;
    nominal: number;
    tipe: TransactionType;
    deskripsi: string;
    tanggal_jurnal: Date;
    created_at: Date;
}
export interface StockCapacity {
    detergen: number;
    pelembut: number;
    plastik: number;
}
export type LogisticsStatus = 'In-Transit' | 'Driver-En-Route' | 'Awaiting-Verification' | 'Completed' | 'Completed-Discrepancy';
export interface LogisticsLog {
    id: string;
    branchId: string;
    sentItems: StockCapacity;
    receivedItems: StockCapacity | null;
    discrepancy: StockCapacity | null;
    status: LogisticsStatus;
    timestamp: Date;
}
//# sourceMappingURL=index.d.ts.map
import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Branch: "Branch";
    readonly CashBookEntry: "CashBookEntry";
    readonly Courier: "Courier";
    readonly Order: "Order";
    readonly Expense: "Expense";
    readonly MonthlyBudget: "MonthlyBudget";
    readonly InventoryItem: "InventoryItem";
    readonly ReconciliationLog: "ReconciliationLog";
    readonly RestockRequest: "RestockRequest";
    readonly LogisticsLog: "LogisticsLog";
    readonly ServiceTariff: "ServiceTariff";
    readonly ExpenseCategory: "ExpenseCategory";
    readonly CourierTaskSequence: "CourierTaskSequence";
    readonly InventoryAnomaly: "InventoryAnomaly";
    readonly Customer: "Customer";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id_user: "id_user";
    readonly nama: "nama";
    readonly email: "email";
    readonly password: "password";
    readonly role: "role";
    readonly id_cabang: "id_cabang";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const BranchScalarFieldEnum: {
    readonly id_cabang: "id_cabang";
    readonly nama_cabang: "nama_cabang";
    readonly alamat: "alamat";
    readonly latitude: "latitude";
    readonly longitude: "longitude";
    readonly kuota_harian: "kuota_harian";
    readonly kuota_terpakai: "kuota_terpakai";
    readonly is_active: "is_active";
    readonly omzet: "omzet";
    readonly wilayah: "wilayah";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type BranchScalarFieldEnum = (typeof BranchScalarFieldEnum)[keyof typeof BranchScalarFieldEnum];
export declare const CashBookEntryScalarFieldEnum: {
    readonly id_jurnal: "id_jurnal";
    readonly id_cabang: "id_cabang";
    readonly id_transaksi: "id_transaksi";
    readonly nominal: "nominal";
    readonly tipe: "tipe";
    readonly deskripsi: "deskripsi";
    readonly tanggal_jurnal: "tanggal_jurnal";
    readonly created_at: "created_at";
};
export type CashBookEntryScalarFieldEnum = (typeof CashBookEntryScalarFieldEnum)[keyof typeof CashBookEntryScalarFieldEnum];
export declare const CourierScalarFieldEnum: {
    readonly id_kurir: "id_kurir";
    readonly id_cabang: "id_cabang";
    readonly nama_kurir: "nama_kurir";
    readonly nomor_telepon: "nomor_telepon";
    readonly is_available: "is_available";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type CourierScalarFieldEnum = (typeof CourierScalarFieldEnum)[keyof typeof CourierScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id_order: "id_order";
    readonly id_cabang: "id_cabang";
    readonly id_pelanggan: "id_pelanggan";
    readonly id_kurir: "id_kurir";
    readonly alamat_penjemputan: "alamat_penjemputan";
    readonly alamat_pengantaran: "alamat_pengantaran";
    readonly latitude_penjemputan: "latitude_penjemputan";
    readonly longitude_penjemputan: "longitude_penjemputan";
    readonly latitude_pengantaran: "latitude_pengantaran";
    readonly longitude_pengantaran: "longitude_pengantaran";
    readonly status: "status";
    readonly catatan: "catatan";
    readonly berat_kg: "berat_kg";
    readonly total_harga: "total_harga";
    readonly tanggal_order: "tanggal_order";
    readonly tanggal_selesai: "tanggal_selesai";
    readonly customer_name: "customer_name";
    readonly customer_whatsapp: "customer_whatsapp";
    readonly service_type: "service_type";
    readonly service_name: "service_name";
    readonly qty: "qty";
    readonly satuan: "satuan";
    readonly wilayah: "wilayah";
    readonly google_maps_url: "google_maps_url";
    readonly source: "source";
    readonly assigned_by: "assigned_by";
    readonly assigned_at: "assigned_at";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const ExpenseScalarFieldEnum: {
    readonly id_expense: "id_expense";
    readonly id_cabang: "id_cabang";
    readonly tanggal: "tanggal";
    readonly nominal: "nominal";
    readonly deskripsi: "deskripsi";
    readonly kategori: "kategori";
    readonly bukti_nota_url: "bukti_nota_url";
    readonly status: "status";
    readonly tanggal_pengajuan: "tanggal_pengajuan";
    readonly tanggal_approval: "tanggal_approval";
    readonly catatan_approval: "catatan_approval";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type ExpenseScalarFieldEnum = (typeof ExpenseScalarFieldEnum)[keyof typeof ExpenseScalarFieldEnum];
export declare const MonthlyBudgetScalarFieldEnum: {
    readonly id: "id";
    readonly id_cabang: "id_cabang";
    readonly bulan: "bulan";
    readonly tahun: "tahun";
    readonly pagu_anggaran: "pagu_anggaran";
    readonly terpakai: "terpakai";
};
export type MonthlyBudgetScalarFieldEnum = (typeof MonthlyBudgetScalarFieldEnum)[keyof typeof MonthlyBudgetScalarFieldEnum];
export declare const InventoryItemScalarFieldEnum: {
    readonly id: "id";
    readonly id_cabang: "id_cabang";
    readonly item: "item";
    readonly satuan: "satuan";
    readonly stok_saat_ini: "stok_saat_ini";
    readonly safety_threshold: "safety_threshold";
    readonly max_capacity: "max_capacity";
};
export type InventoryItemScalarFieldEnum = (typeof InventoryItemScalarFieldEnum)[keyof typeof InventoryItemScalarFieldEnum];
export declare const ReconciliationLogScalarFieldEnum: {
    readonly id_rekonsiliasi: "id_rekonsiliasi";
    readonly id_cabang: "id_cabang";
    readonly tanggal: "tanggal";
    readonly kas_digital: "kas_digital";
    readonly kas_fisik: "kas_fisik";
    readonly selisih: "selisih";
    readonly status: "status";
    readonly approval_status: "approval_status";
    readonly catatan: "catatan";
    readonly catatan_owner: "catatan_owner";
    readonly created_at: "created_at";
};
export type ReconciliationLogScalarFieldEnum = (typeof ReconciliationLogScalarFieldEnum)[keyof typeof ReconciliationLogScalarFieldEnum];
export declare const RestockRequestScalarFieldEnum: {
    readonly id_request: "id_request";
    readonly id_cabang: "id_cabang";
    readonly nama_cabang: "nama_cabang";
    readonly created_by: "created_by";
    readonly requested_items: "requested_items";
    readonly status: "status";
    readonly catatan: "catatan";
    readonly reviewed_by: "reviewed_by";
    readonly reviewed_at: "reviewed_at";
    readonly created_at: "created_at";
};
export type RestockRequestScalarFieldEnum = (typeof RestockRequestScalarFieldEnum)[keyof typeof RestockRequestScalarFieldEnum];
export declare const LogisticsLogScalarFieldEnum: {
    readonly id: "id";
    readonly id_cabang: "id_cabang";
    readonly sent_items: "sent_items";
    readonly received_items: "received_items";
    readonly discrepancy: "discrepancy";
    readonly status: "status";
    readonly timestamp: "timestamp";
};
export type LogisticsLogScalarFieldEnum = (typeof LogisticsLogScalarFieldEnum)[keyof typeof LogisticsLogScalarFieldEnum];
export declare const ServiceTariffScalarFieldEnum: {
    readonly id_layanan: "id_layanan";
    readonly nama_layanan: "nama_layanan";
    readonly kategori: "kategori";
    readonly satuan: "satuan";
    readonly harga_per_satuan: "harga_per_satuan";
    readonly estimasi_hari: "estimasi_hari";
    readonly is_active: "is_active";
};
export type ServiceTariffScalarFieldEnum = (typeof ServiceTariffScalarFieldEnum)[keyof typeof ServiceTariffScalarFieldEnum];
export declare const ExpenseCategoryScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
};
export type ExpenseCategoryScalarFieldEnum = (typeof ExpenseCategoryScalarFieldEnum)[keyof typeof ExpenseCategoryScalarFieldEnum];
export declare const CourierTaskSequenceScalarFieldEnum: {
    readonly id: "id";
    readonly id_kurir: "id_kurir";
    readonly id_order: "id_order";
    readonly urutan: "urutan";
};
export type CourierTaskSequenceScalarFieldEnum = (typeof CourierTaskSequenceScalarFieldEnum)[keyof typeof CourierTaskSequenceScalarFieldEnum];
export declare const InventoryAnomalyScalarFieldEnum: {
    readonly id: "id";
    readonly id_cabang: "id_cabang";
    readonly nama_cabang: "nama_cabang";
    readonly item: "item";
    readonly stok_lama: "stok_lama";
    readonly stok_baru: "stok_baru";
    readonly alasan: "alasan";
    readonly timestamp: "timestamp";
};
export type InventoryAnomalyScalarFieldEnum = (typeof InventoryAnomalyScalarFieldEnum)[keyof typeof InventoryAnomalyScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id_pelanggan: "id_pelanggan";
    readonly id_cabang: "id_cabang";
    readonly nama: "nama";
    readonly whatsapp: "whatsapp";
    readonly alamat_maps: "alamat_maps";
    readonly google_maps_url: "google_maps_url";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map
export type ExpenseStatus = 'Pending' | 'Approve' | 'Reject';
export type ExpenseCategory = 'Gaji' | 'Sewa' | 'Listrik' | 'Logistik' | 'Dana Darurat' | 'Lainnya';
export interface Expense {
    id_expense: string;
    id_cabang: string;
    tanggal: Date;
    nominal: number;
    deskripsi: string;
    kategori: ExpenseCategory;
    bukti_nota_url: string;
    status: ExpenseStatus;
    tanggal_pengajuan: Date;
    tanggal_approval?: Date;
    catatan_approval?: string;
    created_at: Date;
    updated_at: Date;
}
export declare function createExpense(params: {
    id_cabang: string;
    tanggal: Date;
    nominal: number;
    deskripsi: string;
    kategori: ExpenseCategory;
    bukti_nota_url: string;
}): Expense;
export declare function getExpenseById(id_expense: string): Expense | undefined;
export declare function getExpensesByBranch(id_cabang: string): Expense[];
export declare function updateExpenseStatus(id_expense: string, status: ExpenseStatus, catatan?: string): Expense | null;
export declare function getAllExpenses(): Expense[];
export declare function getExpensesByBranchAndCategory(id_cabang: string): Record<ExpenseCategory, number>;
//# sourceMappingURL=expense.d.ts.map
export type ExpenseStatus = 'Pending' | 'Approve' | 'Reject';
export type ExpenseCategory = 'BBM' | 'Sewa & Utilitas' | 'Gaji' | 'Belanja Darurat' | 'Pemeliharaan' | 'Lain-lain';
export declare const DEFAULT_CATEGORIES: ExpenseCategory[];
export interface Expense {
    id_expense: string;
    id_cabang: string;
    tanggal: Date;
    nominal: number;
    deskripsi: string;
    kategori: string;
    bukti_nota_url: string;
    status: ExpenseStatus;
    tanggal_pengajuan: Date;
    tanggal_approval?: Date;
    catatan_approval?: string;
    created_at: Date;
    updated_at: Date;
}
/**
 * Get all expense categories (from DB + defaults)
 */
export declare function getCategoriesFromDB(): Promise<string[]>;
/**
 * Sync function for routes that don't need DB (e.g., simple GET)
 */
export declare function getCategories(): string[];
/**
 * Add custom category to database
 */
export declare function addCategoryToDB(name: string): Promise<boolean>;
/**
 * Legacy sync function for addCategory
 */
export declare function addCategory(name: string): boolean;
/**
 * Create new expense (Pending status)
 */
export declare function createExpense(params: {
    id_cabang: string;
    tanggal: Date;
    nominal: number;
    deskripsi: string;
    kategori: string;
    bukti_nota_url?: string;
}): Promise<Expense>;
/**
 * Get expense by ID
 */
export declare function getExpenseById(id_expense: string): Promise<Expense | null>;
/**
 * Get all expenses for a branch
 */
export declare function getExpensesByBranch(id_cabang: string): Promise<Expense[]>;
/**
 * Get approved expenses for a branch
 */
export declare function getApprovedExpensesByBranch(id_cabang: string): Promise<Expense[]>;
/**
 * Get total approved expenses for a branch
 */
export declare function getTotalApprovedExpenses(id_cabang: string): Promise<number>;
/**
 * Update expense status (approve/reject)
 */
export declare function updateExpenseStatus(id_expense: string, status: ExpenseStatus, catatan?: string): Promise<Expense | null>;
/**
 * Get all expenses (admin)
 */
export declare function getAllExpenses(): Promise<Expense[]>;
/**
 * Get expense breakdown by category for a branch
 */
export declare function getExpensesByBranchAndCategory(id_cabang: string): Promise<Record<string, number>>;
//# sourceMappingURL=expense.d.ts.map
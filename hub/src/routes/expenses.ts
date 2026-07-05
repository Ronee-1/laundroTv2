import { Router, type Request, type Response } from 'express';
import { checkOverbudget, deductBudget } from '../services/budget.js';
import {
  createExpense,
  getExpenseById,
  updateExpenseStatus,
  getCategories,
  addCategory,
} from '../services/expense.js';
import { getBranchById } from '../config/branches.js';
import { createJournalEntry } from '../services/cashbook.js';

const router = Router();

interface ExpenseRequestBody {
  id_cabang: string;
  tanggal: string;
  nominal: number;
  deskripsi: string;
  kategori: string;
  bukti_nota_url: string;
}

interface ExpenseSuccessResponse {
  success: true;
  id_expense: string;
  id_cabang: string;
  status: string;
  nominal: number;
  kategori: string;
  tanggal: string;
  sisa_pagu: number;
  message: string;
}

// FR-FIN-03: Overbudget Error Response
// Sistem menolak transaksi kas keluar dan mengembalikan error 'Overbudget' jika melampaui sisa pagu
interface OverbudgetErrorResponse {
  success: false;
  error: 'Overbudget'; // Error code eksak sesuai FR-FIN-03
  id_cabang: string;
  nominal: number;
  pagu_anggaran: number;
  terpakai: number;
  sisa_pagu: number;
  projected_total: number;
  message: string;
}

interface ValidationErrorResponse {
  success: false;
  error: string;
}

type ExpenseResponse = ExpenseSuccessResponse | OverbudgetErrorResponse | ValidationErrorResponse;

router.post(
  '/request',
  (req: Request<{}, ExpenseResponse, ExpenseRequestBody>, res: Response<ExpenseResponse>) => {
    const { id_cabang, tanggal, nominal, deskripsi, kategori, bukti_nota_url } = req.body;

    if (!id_cabang || !tanggal || !nominal || !deskripsi || !kategori) {
      res.status(400).json({
        success: false,
        error: 'Field wajib: id_cabang, tanggal, nominal, deskripsi, kategori.',
      });
      return;
    }

    const validCategories = getCategories();
    if (!validCategories.includes(kategori)) {
      res.status(400).json({
        success: false,
        error: `Kategori tidak valid. Kategori yang diizinkan: ${validCategories.join(', ')}`,
      });
      return;
    }

    const branch = getBranchById(id_cabang);
    if (!branch) {
      res.status(400).json({
        success: false,
        error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
      });
      return;
    }

    if (typeof nominal !== 'number' || nominal <= 0) {
      res.status(400).json({
        success: false,
        error: 'Nominal harus berupa angka positif.',
      });
      return;
    }

    const parsedDate = new Date(tanggal);
    if (isNaN(parsedDate.getTime())) {
      res.status(400).json({
        success: false,
        error: 'Format tanggal tidak valid. Gunakan format ISO 8601.',
      });
      return;
    }

    const budgetCheck = checkOverbudget(id_cabang, nominal);

    // FR-FIN-03: Check if expense exceeds remaining budget allocation
    if (budgetCheck.overbudget) {
      const formatIDR = (n: number) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(n);

      // Return exact 'Overbudget' error string per FR-FIN-03 requirement
      res.status(400).json({
        success: false,
        error: 'Overbudget', // Eksak sesuai FR-FIN-03: Sistem menolak pencatatan dan tampilkan error "Overbudget"
        id_cabang,
        nominal,
        pagu_anggaran: budgetCheck.pagu_anggaran,
        terpakai: budgetCheck.terpakai,
        sisa_pagu: budgetCheck.sisa_pagu,
        projected_total: budgetCheck.projected_total,
        message: `Pengeluaran ini (${formatIDR(nominal)}) melebihi sisa pagu anggaran bulanan ${branch.nama_cabang} sebesar ${formatIDR(budgetCheck.sisa_pagu)}. Deviasi maksimal 5% dari pagu yang ditetapkan.`,
      } as OverbudgetErrorResponse);
      return;
    }

    const expense = createExpense({
      id_cabang,
      tanggal: parsedDate,
      nominal,
      deskripsi,
      kategori,
      bukti_nota_url: bukti_nota_url ?? '',
    });

    res.status(201).json({
      success: true,
      id_expense: expense.id_expense,
      id_cabang: expense.id_cabang,
      status: expense.status,
      nominal: expense.nominal,
      kategori: expense.kategori,
      tanggal: expense.tanggal.toISOString(),
      sisa_pagu: budgetCheck.sisa_pagu,
      message: `Pengajuan pengeluaran Rp${nominal.toLocaleString('id-ID')} (${kategori}) dari ${branch.nama_cabang} berhasil dicatat. Menunggu persetujuan Admin Pusat.`,
    });
  },
);

interface ApproveParams {
  id_expense: string;
}

interface ApproveBody {
  status: 'Approve' | 'Reject';
  catatan?: string;
}

interface ApproveSuccessResponse {
  success: true;
  id_expense: string;
  id_cabang: string;
  status: string;
  nominal: number;
  sisa_pagu?: number;
  journal?: {
    id_jurnal: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
  };
  message: string;
}

interface ApproveErrorResponse {
  success: false;
  error: string;
}

type ApproveResponse = ApproveSuccessResponse | ApproveErrorResponse;

router.patch(
  '/:id_expense/approve',
  (req: Request<ApproveParams, ApproveResponse, ApproveBody>, res: Response<ApproveResponse>) => {
    const { id_expense } = req.params;
    const { status, catatan } = req.body;

    if (!status || (status !== 'Approve' && status !== 'Reject')) {
      res.status(400).json({
        success: false,
        error: 'Status harus "Approve" atau "Reject".',
      });
      return;
    }

    const expense = getExpenseById(id_expense);
    if (!expense) {
      res.status(404).json({
        success: false,
        error: `Pengajuan pengeluaran dengan ID "${id_expense}" tidak ditemukan.`,
      });
      return;
    }

    if (expense.status !== 'Pending') {
      res.status(400).json({
        success: false,
        error: `Pengajuan sudah diproses sebelumnya dengan status "${expense.status}".`,
      });
      return;
    }

    const branch = getBranchById(expense.id_cabang);

    if (status === 'Approve') {
      const deducted = deductBudget(expense.id_cabang, expense.nominal);

      if (!deducted) {
        res.status(400).json({
          success: false,
          error: `Gagal menyetujui: sisa pagu cabang ${branch?.nama_cabang ?? expense.id_cabang} tidak mencukupi saat ini.`,
        });
        return;
      }

      const journal = createJournalEntry({
        id_cabang: expense.id_cabang,
        id_transaksi: expense.id_expense,
        nominal: expense.nominal,
        tipe: 'Pengeluaran',
        deskripsi: `Pengeluaran ${expense.kategori}: ${expense.deskripsi} (${branch?.nama_cabang ?? expense.id_cabang})`,
      });

      const updated = updateExpenseStatus(id_expense, 'Approve', catatan);

      const budgetCheck = checkOverbudget(expense.id_cabang, 0);

      res.status(200).json({
        success: true,
        id_expense: updated!.id_expense,
        id_cabang: updated!.id_cabang,
        status: updated!.status,
        nominal: updated!.nominal,
        sisa_pagu: budgetCheck.sisa_pagu,
        journal: {
          id_jurnal: journal.id_jurnal,
          nominal: journal.nominal,
          tipe: journal.tipe,
          deskripsi: journal.deskripsi,
        },
        message: `Pengajuan pengeluaran Rp${expense.nominal.toLocaleString('id-ID')} (${expense.kategori}) dari ${branch?.nama_cabang ?? expense.id_cabang} disetujui. Pagu cabang telah dikurangi dan jurnal tercatat di Buku Kas Pusat.`,
      });
      return;
    }

    const updated = updateExpenseStatus(id_expense, 'Reject', catatan);

    res.status(200).json({
      success: true,
      id_expense: updated!.id_expense,
      id_cabang: updated!.id_cabang,
      status: updated!.status,
      nominal: updated!.nominal,
      message: `Pengajuan pengeluaran Rp${expense.nominal.toLocaleString('id-ID')} (${expense.kategori}) dari ${branch?.nama_cabang ?? expense.id_cabang} ditolak.`,
    });
  },
);

interface CategoriesResponse {
  success: true;
  categories: string[];
}

router.get('/categories', (_req: Request, res: Response<CategoriesResponse>) => {
  res.status(200).json({
    success: true,
    categories: getCategories(),
  });
});

interface AddCategoryBody {
  name: string;
}

interface AddCategoryResponse {
  success: boolean;
  message: string;
  categories?: string[];
}

router.post(
  '/categories',
  (req: Request<{}, AddCategoryResponse, AddCategoryBody>, res: Response<AddCategoryResponse>) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
      return;
    }

    const added = addCategory(name.trim());
    if (!added) {
      res.status(400).json({ success: false, message: 'Kategori sudah ada!' });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Kategori pengeluaran kustom berhasil ditambahkan.',
      categories: getCategories(),
    });
  },
);

export default router;

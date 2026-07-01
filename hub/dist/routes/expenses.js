"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const budget_js_1 = require("../services/budget.js");
const expense_js_1 = require("../services/expense.js");
const branches_js_1 = require("../config/branches.js");
const cashbook_js_1 = require("../services/cashbook.js");
const router = (0, express_1.Router)();
router.post('/request', (req, res) => {
    const { id_cabang, tanggal, nominal, deskripsi, kategori, bukti_nota_url } = req.body;
    if (!id_cabang || !tanggal || !nominal || !deskripsi || !kategori) {
        res.status(400).json({
            success: false,
            error: 'Field wajib: id_cabang, tanggal, nominal, deskripsi, kategori.',
        });
        return;
    }
    const validCategories = (0, expense_js_1.getCategories)();
    if (!validCategories.includes(kategori)) {
        res.status(400).json({
            success: false,
            error: `Kategori tidak valid. Kategori yang diizinkan: ${validCategories.join(', ')}`,
        });
        return;
    }
    const branch = (0, branches_js_1.getBranchById)(id_cabang);
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
    const budgetCheck = (0, budget_js_1.checkOverbudget)(id_cabang, nominal);
    if (budgetCheck.overbudget) {
        const formatIDR = (n) => new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(n);
        res.status(400).json({
            success: false,
            error: 'PROSES DITOLAK: Overbudget!',
            id_cabang,
            nominal,
            pagu_anggaran: budgetCheck.pagu_anggaran,
            terpakai: budgetCheck.terpakai,
            sisa_pagu: budgetCheck.sisa_pagu,
            projected_total: budgetCheck.projected_total,
            message: `PROSES DITOLAK: Overbudget! Pengeluaran ini (${formatIDR(nominal)}) melebihi sisa pagu anggaran bulanan ${branch.nama_cabang} yang tersisa sebesar ${formatIDR(budgetCheck.sisa_pagu)}.`,
        });
        return;
    }
    const expense = (0, expense_js_1.createExpense)({
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
});
router.patch('/:id_expense/approve', (req, res) => {
    const { id_expense } = req.params;
    const { status, catatan } = req.body;
    if (!status || (status !== 'Approve' && status !== 'Reject')) {
        res.status(400).json({
            success: false,
            error: 'Status harus "Approve" atau "Reject".',
        });
        return;
    }
    const expense = (0, expense_js_1.getExpenseById)(id_expense);
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
    const branch = (0, branches_js_1.getBranchById)(expense.id_cabang);
    if (status === 'Approve') {
        const deducted = (0, budget_js_1.deductBudget)(expense.id_cabang, expense.nominal);
        if (!deducted) {
            res.status(400).json({
                success: false,
                error: `Gagal menyetujui: sisa pagu cabang ${branch?.nama_cabang ?? expense.id_cabang} tidak mencukupi saat ini.`,
            });
            return;
        }
        const journal = (0, cashbook_js_1.createJournalEntry)({
            id_cabang: expense.id_cabang,
            id_transaksi: expense.id_expense,
            nominal: expense.nominal,
            tipe: 'Pengeluaran',
            deskripsi: `Pengeluaran ${expense.kategori}: ${expense.deskripsi} (${branch?.nama_cabang ?? expense.id_cabang})`,
        });
        const updated = (0, expense_js_1.updateExpenseStatus)(id_expense, 'Approve', catatan);
        const budgetCheck = (0, budget_js_1.checkOverbudget)(expense.id_cabang, 0);
        res.status(200).json({
            success: true,
            id_expense: updated.id_expense,
            id_cabang: updated.id_cabang,
            status: updated.status,
            nominal: updated.nominal,
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
    const updated = (0, expense_js_1.updateExpenseStatus)(id_expense, 'Reject', catatan);
    res.status(200).json({
        success: true,
        id_expense: updated.id_expense,
        id_cabang: updated.id_cabang,
        status: updated.status,
        nominal: updated.nominal,
        message: `Pengajuan pengeluaran Rp${expense.nominal.toLocaleString('id-ID')} (${expense.kategori}) dari ${branch?.nama_cabang ?? expense.id_cabang} ditolak.`,
    });
});
router.get('/categories', (_req, res) => {
    res.status(200).json({
        success: true,
        categories: (0, expense_js_1.getCategories)(),
    });
});
router.post('/categories', (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
        res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
        return;
    }
    const added = (0, expense_js_1.addCategory)(name.trim());
    if (!added) {
        res.status(400).json({ success: false, message: 'Kategori sudah ada!' });
        return;
    }
    res.status(201).json({
        success: true,
        message: 'Kategori pengeluaran kustom berhasil ditambahkan.',
        categories: (0, expense_js_1.getCategories)(),
    });
});
exports.default = router;
//# sourceMappingURL=expenses.js.map
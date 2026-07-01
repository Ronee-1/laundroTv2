"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branches_js_1 = require("../config/branches.js");
const reconciliation_js_1 = require("../services/reconciliation.js");
const expense_js_1 = require("../services/expense.js");
const inventory_js_1 = require("../services/inventory.js");
const router = (0, express_1.Router)();
router.post('/:id_cabang/reconcile', (req, res) => {
    const { id_cabang } = req.params;
    const { kas_fisik, catatan } = req.body;
    if (typeof kas_fisik !== 'number' || kas_fisik < 0) {
        res.status(400).json({
            success: false,
            error: 'kas_fisik harus berupa angka non-negatif.',
        });
        return;
    }
    const branch = (0, branches_js_1.getBranchById)(id_cabang);
    if (!branch) {
        res.status(404).json({
            success: false,
            error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
        });
        return;
    }
    const totalExpenses = (0, expense_js_1.getTotalApprovedExpenses)(id_cabang);
    const kas_digital = branch.omzet - totalExpenses;
    const log = (0, reconciliation_js_1.createReconciliation)({
        id_cabang,
        kas_digital,
        kas_fisik,
        catatan,
    });
    const formatIDR = (n) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(n);
    let statusMessage;
    if (log.status === 'Cocok') {
        statusMessage = `AUDIT BERHASIL: Saldo kas fisik COCOK (Selisih Rp0) dengan pencatatan digital untuk ${branch.nama_cabang}. Status: Reconciled & Buku Terkunci.`;
    }
    else {
        const discrepancyText = log.selisih > 0
            ? `Surplus Kelebihan Kas Fisik sebesar Rp${Math.abs(log.selisih).toLocaleString('id-ID')}`
            : `Defisit Kekurangan Kas Fisik sebesar Rp${Math.abs(log.selisih).toLocaleString('id-ID')}`;
        statusMessage = `LOG SELISIH DITERBITKAN: Ditemukan selisih (${discrepancyText}) dibanding sisa omzet buku digital (${formatIDR(kas_digital)}). Laporan dikirim ke sistem audit pusat.`;
    }
    res.status(201).json({
        success: true,
        id_rekonsiliasi: log.id_rekonsiliasi,
        id_cabang: log.id_cabang,
        nama_cabang: branch.nama_cabang,
        kas_digital: log.kas_digital,
        kas_fisik: log.kas_fisik,
        selisih: log.selisih,
        status: log.status,
        message: statusMessage,
    });
});
router.get('/:id_cabang/reconcile/history', (req, res) => {
    const { id_cabang } = req.params;
    const branch = (0, branches_js_1.getBranchById)(id_cabang);
    if (!branch) {
        res.status(404).json({
            success: false,
            error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
        });
        return;
    }
    const logs = (0, reconciliation_js_1.getReconciliationByBranch)(id_cabang);
    res.status(200).json({
        success: true,
        id_cabang,
        total_logs: logs.length,
        logs: logs.map((log) => ({
            id_rekonsiliasi: log.id_rekonsiliasi,
            tanggal: log.tanggal.toISOString(),
            kas_digital: log.kas_digital,
            kas_fisik: log.kas_fisik,
            selisih: log.selisih,
            status: log.status,
            catatan: log.catatan,
        })),
    });
});
router.post('/:id_cabang/restock', (req, res) => {
    const { id_cabang } = req.params;
    const { detergen, pelembut, plastik } = req.body;
    const branch = (0, branches_js_1.getBranchById)(id_cabang);
    if (!branch) {
        res.status(404).json({
            success: false,
            error: `Cabang dengan ID "${id_cabang}" tidak ditemukan.`,
        });
        return;
    }
    const updated = (0, inventory_js_1.restockInventory)(id_cabang, {
        detergen: detergen ? parseInt(String(detergen), 10) || 0 : 0,
        pelembut: pelembut ? parseInt(String(pelembut), 10) || 0 : 0,
        plastik: plastik ? parseInt(String(plastik), 10) || 0 : 0,
    });
    if (!updated) {
        res.status(404).json({
            success: false,
            error: 'Data inventaris cabang tidak ditemukan.',
        });
        return;
    }
    res.status(200).json({
        success: true,
        id_cabang,
        nama_cabang: branch.nama_cabang,
        stocks: updated.stocks.map((s) => ({
            item: s.item,
            stok_saat_ini: s.stok_saat_ini,
            safety_threshold: s.safety_threshold,
            status: s.status,
        })),
        message: `Stok gudang cabang ${branch.nama_cabang} berhasil diisi ulang!`,
    });
});
router.get('/:id_cabang/inventory', (req, res) => {
    const { id_cabang } = req.params;
    const inv = (0, inventory_js_1.getInventoryByBranch)(id_cabang);
    if (!inv) {
        res.status(404).json({
            success: false,
            error: `Inventaris cabang "${id_cabang}" tidak ditemukan.`,
        });
        return;
    }
    res.status(200).json({
        success: true,
        id_cabang,
        stocks: inv.stocks.map((s) => ({
            item: s.item,
            satuan: s.satuan,
            stok_saat_ini: s.stok_saat_ini,
            safety_threshold: s.safety_threshold,
            status: s.status,
        })),
    });
});
exports.default = router;
//# sourceMappingURL=branches.js.map
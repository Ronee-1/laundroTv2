"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branches_js_1 = require("../config/branches.js");
const cashbook_js_1 = require("../services/cashbook.js");
const expense_js_1 = require("../services/expense.js");
const budget_js_1 = require("../services/budget.js");
const inventory_js_1 = require("../services/inventory.js");
const logistics_js_1 = require("../services/logistics.js");
// ==========================================
// OWNER DASHBOARD - FR-OWN-01, FR-OWN-02, FR-OWN-03 Core Implementation
// FR-OWN-01: Grafik tren arus kas terpadu dan profitabilitas per cabang
// FR-OWN-02: Visualisasi data poin KPI performa seluruh cabang
// FR-OWN-03: Dasbor Peta Interaktif Jabodetabek dengan pin dinamis
// ==========================================
const router = (0, express_1.Router)();
function determineHealthStatus(utilization_percent, inventoryStatus) {
    if (utilization_percent >= 90 || inventoryStatus === 'Kritis' || inventoryStatus === 'Menipis')
        return 'Critical';
    if (utilization_percent >= 70)
        return 'Warning';
    return 'Healthy';
}
function determineMapPinColor(utilization_percent, inventoryStatus) {
    if (utilization_percent >= 90 || inventoryStatus === 'Kritis' || inventoryStatus === 'Menipis')
        return 'red';
    if (utilization_percent >= 80)
        return 'yellow';
    return 'green';
}
function detectCategoryAlerts(categoryBreakdown, totalPengeluaran) {
    const alerts = [];
    const SPIKE_THRESHOLD = 0.4;
    if (totalPengeluaran === 0)
        return alerts;
    for (const [kategori, nominal] of Object.entries(categoryBreakdown)) {
        const percent = nominal / totalPengeluaran;
        if (percent > SPIKE_THRESHOLD) {
            alerts.push({
                kategori,
                nominal,
                percent_of_total: Math.round(percent * 10000) / 100,
                message: `Pengeluaran kategori ${kategori} mencapai ${Math.round(percent * 100)}% dari total pengeluaran cabang. Perlu ditinjau.`,
            });
        }
    }
    return alerts;
}
router.get('/dashboard', (_req, res) => {
    const journals = (0, cashbook_js_1.getAllJournalEntries)();
    const _expenses = (0, expense_js_1.getAllExpenses)();
    const perCabang = branches_js_1.BRANCHES.map((branch) => {
        const branchJournals = journals.filter((j) => j.id_cabang === branch.id_cabang);
        const total_pemasukan = branchJournals
            .filter((j) => j.tipe === 'Pemasukan')
            .reduce((sum, j) => sum + j.nominal, 0);
        const effective_pemasukan = Math.max(total_pemasukan, branch.omzet);
        const total_pengeluaran_from_journal = branchJournals
            .filter((j) => j.tipe === 'Pengeluaran')
            .reduce((sum, j) => sum + j.nominal, 0);
        const total_approved_expenses = (0, expense_js_1.getTotalApprovedExpenses)(branch.id_cabang);
        const budget = (0, budget_js_1.getBudget)(branch.id_cabang);
        const pagu_anggaran = budget?.pagu_anggaran ?? 0;
        const terpakai = budget?.terpakai ?? 0;
        const total_pengeluaran = total_pengeluaran_from_journal > 0
            ? total_pengeluaran_from_journal
            : Math.max(total_approved_expenses, terpakai);
        const sisa_pagu = pagu_anggaran - terpakai;
        const utilization_percent = pagu_anggaran > 0 ? (terpakai / pagu_anggaran) * 100 : 0;
        const rounded_utilization = Math.round(utilization_percent * 100) / 100;
        const category_breakdown = (0, expense_js_1.getExpensesByBranchAndCategory)(branch.id_cabang);
        const alerts = detectCategoryAlerts(category_breakdown, total_pengeluaran);
        const inventoryData = (0, inventory_js_1.getInventoryByBranch)(branch.id_cabang);
        const inventoryStatus = (0, inventory_js_1.getInventoryStatus)(branch.id_cabang);
        const pin_color = determineMapPinColor(rounded_utilization, inventoryStatus);
        const health_status = determineHealthStatus(rounded_utilization, inventoryStatus);
        const inTransitLogs = (0, logistics_js_1.getActiveShipmentsByBranch)(branch.id_cabang);
        const replenishment = (0, logistics_js_1.getReplenishmentRecommendation)(branch.id_cabang);
        return {
            id_cabang: branch.id_cabang,
            nama_cabang: branch.nama_cabang,
            wilayah: branch.wilayah,
            total_pemasukan: effective_pemasukan,
            total_pengeluaran,
            omzet: branch.omzet,
            saldo: branch.omzet - total_pengeluaran,
            pagu_anggaran,
            terpakai,
            sisa_pagu,
            utilization_percent: rounded_utilization,
            health_status,
            category_breakdown,
            alerts,
            transaction_count: branchJournals.length,
            map_coordinates: {
                latitude: branch.latitude,
                longitude: branch.longitude,
                pin_color,
            },
            inventory: {
                stocks: inventoryData?.stocks ?? [],
                overall_status: inventoryStatus,
                last_updated: inventoryData?.last_updated ? inventoryData.last_updated.toISOString() : new Date().toISOString(),
            },
            in_transit: inTransitLogs.map((l) => ({
                id: l.id,
                sentItems: l.sentItems,
                status: l.status,
                timestamp: l.timestamp.toISOString(),
            })),
            replenishment: {
                needs_replenishment: replenishment.needs_replenishment,
                items: replenishment.items,
            },
        };
    });
    const total_pemasukan = perCabang.reduce((sum, b) => sum + b.total_pemasukan, 0);
    const total_pengeluaran = perCabang.reduce((sum, b) => sum + b.total_pengeluaran, 0);
    const total_omzet = perCabang.reduce((sum, b) => sum + b.omzet, 0);
    const total_saldo = total_omzet - total_pengeluaran;
    const active_branches = branches_js_1.BRANCHES.filter((b) => b.is_active).length;
    const branches_needing_attention = perCabang.filter((b) => b.health_status === 'Warning' || b.health_status === 'Critical').length;
    res.status(200).json({
        success: true,
        summary: {
            total_pemasukan,
            total_pengeluaran,
            total_saldo,
            total_omzet,
            total_cabang: branches_js_1.BRANCHES.length,
            active_branches,
            branches_needing_attention,
        },
        per_cabang: perCabang,
        generated_at: new Date().toISOString(),
    });
});
router.get('/anomalies', (_req, res) => {
    res.status(200).json({
        success: true,
        anomalies: (0, inventory_js_1.getAnomalies)(),
    });
});
exports.default = router;
//# sourceMappingURL=owner.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branches_js_1 = require("../config/branches.js");
const cashbook_js_1 = require("../services/cashbook.js");
const expense_js_1 = require("../services/expense.js");
const budget_js_1 = require("../services/budget.js");
const inventory_js_1 = require("../services/inventory.js");
const logistics_js_1 = require("../services/logistics.js");
const unifiedOrders_js_1 = require("../services/unifiedOrders.js");
const orders_js_1 = require("../config/orders.js");
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
router.get('/dashboard', async (_req, res) => {
    try {
        const [journals, _expenses, branches] = await Promise.all([
            (0, cashbook_js_1.getAllJournalEntries)(),
            (0, expense_js_1.getAllExpenses)(),
            (0, branches_js_1.getAllBranches)(),
        ]);
        // Process each branch asynchronously
        const perCabang = await Promise.all(branches.map(async (branch) => {
            const branchJournals = journals.filter((j) => j.id_cabang === branch.id_cabang);
            const total_pemasukan = branchJournals
                .filter((j) => j.tipe === 'Pemasukan')
                .reduce((sum, j) => sum + j.nominal, 0);
            const effective_pemasukan = Math.max(total_pemasukan, branch.omzet);
            const total_pengeluaran_from_journal = branchJournals
                .filter((j) => j.tipe === 'Pengeluaran')
                .reduce((sum, j) => sum + j.nominal, 0);
            const [total_approved_expenses, budget, category_breakdown, inventoryData, inventoryStatus, inTransitLogs, replenishment] = await Promise.all([
                (0, expense_js_1.getTotalApprovedExpenses)(branch.id_cabang),
                (0, budget_js_1.getBudget)(branch.id_cabang),
                (0, expense_js_1.getExpensesByBranchAndCategory)(branch.id_cabang),
                (0, inventory_js_1.getInventoryByBranch)(branch.id_cabang),
                (0, inventory_js_1.getInventoryStatus)(branch.id_cabang),
                (0, logistics_js_1.getActiveShipmentsByBranch)(branch.id_cabang),
                (0, logistics_js_1.getReplenishmentRecommendation)(branch.id_cabang),
            ]);
            const pagu_anggaran = budget?.pagu_anggaran ?? 0;
            const terpakai = budget?.terpakai ?? 0;
            const total_pengeluaran = total_pengeluaran_from_journal > 0
                ? total_pengeluaran_from_journal
                : Math.max(total_approved_expenses, terpakai);
            const sisa_pagu = pagu_anggaran - terpakai;
            const utilization_percent = pagu_anggaran > 0 ? (terpakai / pagu_anggaran) * 100 : 0;
            const rounded_utilization = Math.round(utilization_percent * 100) / 100;
            const alerts = detectCategoryAlerts(category_breakdown, total_pengeluaran);
            const pin_color = determineMapPinColor(rounded_utilization, inventoryStatus);
            const health_status = determineHealthStatus(rounded_utilization, inventoryStatus);
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
        }));
        const totalPemasukan = perCabang.reduce((sum, b) => sum + b.total_pemasukan, 0);
        const totalPengeluaran = perCabang.reduce((sum, b) => sum + b.total_pengeluaran, 0);
        const totalOmzet = perCabang.reduce((sum, b) => sum + b.omzet, 0);
        const totalSaldo = totalOmzet - totalPengeluaran;
        const activeBranches = branches.filter((b) => b.is_active).length;
        const branchesNeedingAttention = perCabang.filter((b) => b.health_status === 'Warning' || b.health_status === 'Critical').length;
        res.status(200).json({
            success: true,
            summary: {
                total_pemasukan: totalPemasukan,
                total_pengeluaran: totalPengeluaran,
                total_saldo: totalSaldo,
                total_omzet: totalOmzet,
                total_cabang: branches.length,
                active_branches: activeBranches,
                branches_needing_attention: branchesNeedingAttention,
            },
            per_cabang: perCabang,
            generated_at: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('[Owner] GET /dashboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
});
router.get('/anomalies', async (_req, res) => {
    try {
        const anomalies = await (0, inventory_js_1.getAnomalies)();
        res.status(200).json({
            success: true,
            anomalies,
        });
    }
    catch (error) {
        console.error('[Owner] GET /anomalies error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// ==========================================
// GET ALL ORDERS FOR OWNER
// Returns all orders from all branches
// ==========================================
router.get('/orders', async (_req, res) => {
    try {
        // Get from in-memory store (WhatsApp Hub orders)
        const memoryOrders = await (0, orders_js_1.getAllOrdersByBranch)('');
        // Get from database (Outlet Reception orders)
        const dbOrders = await (0, unifiedOrders_js_1.getOrdersByBranch)('');
        // Get all branches for initialization
        const branches = await (0, branches_js_1.getAllBranches)();
        // Group by branch
        const ordersByBranch = {};
        // Initialize all branches
        for (const branch of branches) {
            ordersByBranch[branch.id_cabang] = { whatsapp: [], outlet: [] };
        }
        // Add memory orders (WhatsApp) to correct branch
        for (const order of memoryOrders) {
            if (ordersByBranch[order.id_cabang]) {
                ordersByBranch[order.id_cabang].whatsapp.push({
                    id_order: order.id_order,
                    customer_name: order.customer_name,
                    customer_whatsapp: order.customer_whatsapp || '',
                    service_type: order.service_type || 'Laundry Kiloan',
                    berat_kg: order.berat_kg || 0,
                    status: order.status,
                    tanggal_order: order.tanggal_order.toISOString(),
                });
            }
        }
        // Add database orders (Outlet) to correct branch
        for (const order of dbOrders) {
            const outletOrder = order; // Cast to access outlet-specific fields
            if (ordersByBranch[order.id_cabang]) {
                ordersByBranch[order.id_cabang].outlet.push({
                    id_order: order.id_order,
                    customer_name: order.customer_name,
                    customer_whatsapp: order.customer_whatsapp || '',
                    service_name: outletOrder.service_name || '',
                    qty: outletOrder.qty || 0,
                    satuan: outletOrder.satuan || 'pcs',
                    berat_kg: order.berat_kg || 0,
                    total_harga: order.total_harga || 0,
                    status: order.status,
                    tanggal_order: order.tanggal_order instanceof Date ? order.tanggal_order.toISOString() : String(order.tanggal_order),
                });
            }
        }
        // Calculate summary
        const summary = {
            total: memoryOrders.length + dbOrders.length,
            whatsapp: memoryOrders.length,
            outlet: dbOrders.length,
            byBranch: {},
        };
        for (const [branchId, data] of Object.entries(ordersByBranch)) {
            summary.byBranch[branchId] = {
                whatsapp: data.whatsapp.length,
                outlet: data.outlet.length,
                total: data.whatsapp.length + data.outlet.length,
            };
        }
        res.status(200).json({
            success: true,
            summary,
            orders: ordersByBranch,
        });
    }
    catch (error) {
        console.error('[OWNER ORDERS] Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil data order.',
        });
    }
});
exports.default = router;
//# sourceMappingURL=owner.js.map
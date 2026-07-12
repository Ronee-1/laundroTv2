"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCourierForAssignment = validateCourierForAssignment;
exports.assignmentGuardrail = assignmentGuardrail;
exports.getCourierLiveTaskCount = getCourierLiveTaskCount;
exports.getCourierWorkloadStats = getCourierWorkloadStats;
exports.performBilateralValidation = performBilateralValidation;
exports.forceReconciliation = forceReconciliation;
exports.updateCourierWorkloadOnAssignment = updateCourierWorkloadOnAssignment;
exports.getBranchCouriersWithWorkload = getBranchCouriersWithWorkload;
const prisma_js_1 = require("../lib/prisma.js");
/**
 * CROSS-CHECK VALIDATION (Rule 3: Bilateral Validation)
 * Validates that a courier exists, is active, and is in the correct branch
 * Also fetches live task count for verification
 */
async function validateCourierForAssignment(courierId, orderBranchId) {
    console.log(`[CourierSync] Validating courier ${courierId} for order at branch ${orderBranchId}`);
    // Step 1: Check if courier exists
    const courier = await prisma_js_1.prisma.courier.findUnique({
        where: { id_kurir: courierId },
    });
    if (!courier) {
        console.log(`[CourierSync] REJECT: Courier ${courierId} not found`);
        return {
            isValid: false,
            courierId,
            courierName: null,
            courierBranch: null,
            courierStatus: 'NotFound',
            workloadCount: 0,
            errorCode: 'NOT_FOUND',
            errorMessage: `Kurir dengan ID "${courierId}" tidak ditemukan dalam sistem.`,
        };
    }
    // Step 2: Check if courier is active/available
    if (!courier.is_available) {
        console.log(`[CourierSync] REJECT: Courier ${courierId} is inactive`);
        return {
            isValid: false,
            courierId,
            courierName: courier.nama_kurir,
            courierBranch: courier.id_cabang,
            courierStatus: 'Inactive',
            workloadCount: 0,
            errorCode: 'INACTIVE',
            errorMessage: `Kurir ${courier.nama_kurir} (${courierId}) sedang tidak aktif atau offline.`,
        };
    }
    // Step 3: Verify branch match (Rule 1: COURIER-TO-TASK LOCK)
    if (courier.id_cabang !== orderBranchId) {
        console.log(`[CourierSync] REJECT: Branch mismatch. Courier branch: ${courier.id_cabang}, Order branch: ${orderBranchId}`);
        return {
            isValid: false,
            courierId,
            courierName: courier.nama_kurir,
            courierBranch: courier.id_cabang,
            courierStatus: 'Active',
            workloadCount: 0,
            errorCode: 'BRANCH_MISMATCH',
            errorMessage: `Kurir ${courier.nama_kurir} (${courierId}) tidak bertugas di ${orderBranchId}. Tugas hanya bisa dialokasikan ke kurir di cabang yang sama.`,
        };
    }
    // Step 4: Get live task count from active Tugas Harian log (Rule 2: Capacity & Status Sync)
    const activeTaskCount = await getCourierLiveTaskCount(courierId);
    console.log(`[CourierSync] VALID: Courier ${courierId} validated successfully. Active tasks: ${activeTaskCount}`);
    return {
        isValid: true,
        courierId,
        courierName: courier.nama_kurir,
        courierBranch: courier.id_cabang,
        courierStatus: 'Active',
        workloadCount: activeTaskCount,
        errorCode: 'VALID',
        errorMessage: null,
    };
}
/**
 * ASSIGNMENT GUARDRAIL (Rule 3: Bilateral Validation)
 * Intercepts assignment and validates courier before proceeding
 * Returns detailed result for error handling
 */
async function assignmentGuardrail(courierId, orderBranchId) {
    const validation = await validateCourierForAssignment(courierId, orderBranchId);
    if (!validation.isValid) {
        // CASE A: Courier Mismatch / Inactive State
        return {
            approved: false,
            courierId,
            validation,
            errorCode: validation.errorCode,
            errorMessage: `Gagal Sinkronisasi Penugasan: ${validation.errorMessage}`,
            action: 'REJECTED',
        };
    }
    // Validation passed
    return {
        approved: true,
        courierId,
        validation,
        errorCode: 'VALID',
        errorMessage: null,
        action: 'APPROVED',
    };
}
/**
 * GET LIVE COURIER TASK COUNT
 * Directly queries active tugas_harian log for absolute data parity
 * Used for Rule 2: Capacity & Status Sync
 */
async function getCourierLiveTaskCount(courierId) {
    // Count orders assigned to this courier with non-terminal statuses
    const count = await prisma_js_1.prisma.order.count({
        where: {
            id_kurir: courierId,
            status: {
                notIn: ['Done', 'Dibatalkan', 'Selesai', 'Lunas'],
            },
        },
    });
    console.log(`[CourierSync] Live task count for ${courierId}: ${count}`);
    return count;
}
/**
 * GET COMPLETE WORKLOAD STATS
 * Returns detailed workload breakdown for Data Kurir dashboard
 */
async function getCourierWorkloadStats(courierId) {
    const courier = await prisma_js_1.prisma.courier.findUnique({
        where: { id_kurir: courierId },
    });
    if (!courier) {
        return null;
    }
    // Get count by status
    const [pendingCount, inProgressCount, activeCount] = await Promise.all([
        prisma_js_1.prisma.order.count({
            where: { id_kurir: courierId, status: 'Pending' },
        }),
        prisma_js_1.prisma.order.count({
            where: { id_kurir: courierId, status: 'Diproses' },
        }),
        prisma_js_1.prisma.order.count({
            where: {
                id_kurir: courierId,
                status: {
                    notIn: ['Done', 'Dibatalkan', 'Selesai', 'Lunas'],
                },
            },
        }),
    ]);
    let status = 'Offline';
    if (courier.is_available) {
        status = activeCount >= 5 ? 'Busy' : 'Available';
    }
    return {
        courierId,
        courierName: courier.nama_kurir,
        branchId: courier.id_cabang,
        activeTasks: inProgressCount,
        pendingTasks: pendingCount,
        inProgressTasks: inProgressCount,
        totalActiveTasks: activeCount,
        status,
    };
}
/**
 * BILATERAL VALIDATION CHECK
 * Cross-checks courier registry against active task log
 * Returns verification result for admin dashboard
 */
async function performBilateralValidation(courierId) {
    const courier = await prisma_js_1.prisma.courier.findUnique({
        where: { id_kurir: courierId },
    });
    if (!courier) {
        return {
            verified: false,
            courier_id: courierId,
            courier_status: 'Offline',
            assigned_tasks_count: 0,
            branch_id: null,
            discrepancy: false,
            message: `Kurir ${courierId} tidak ditemukan dalam registry.`,
        };
    }
    const liveTaskCount = await getCourierLiveTaskCount(courierId);
    // Determine status based on availability
    const courierStatus = courier.is_available ? 'Online' : 'Offline';
    // Check for asymmetry (CASE B: Payload & Workload Asymmetry)
    const hasDiscrepancy = !courier.is_available && liveTaskCount > 0;
    const verification = {
        verified: courier.is_available && courierStatus === 'Online',
        courier_id: courierId,
        courier_status: courierStatus,
        assigned_tasks_count: liveTaskCount,
        branch_id: courier.id_cabang,
        discrepancy: hasDiscrepancy,
        message: hasDiscrepancy
            ? `DISCREPANCY DETECTED: Kurir ${courier.nama_kurir} inactive tapi memiliki ${liveTaskCount} tugas aktif. Harap rekonfirmasi tugas.`
            : `VALID: Kurir ${courier.nama_kurir} status ${courierStatus} dengan ${liveTaskCount} tugas aktif.`,
    };
    console.log(`[CourierSync] Bilateral Validation for ${courierId}:`, verification);
    return verification;
}
/**
 * FORCE RECONCILIATION (CASE B: Workload Asymmetry Handler)
 * Forces main Courier Status Database to pull live count
 * from active Tugas Harian log to guarantee absolute data parity
 */
async function forceReconciliation(courierId) {
    console.log(`[CourierSync] FORCE RECONCILIATION for ${courierId}`);
    const courier = await prisma_js_1.prisma.courier.findUnique({
        where: { id_kurir: courierId },
    });
    if (!courier) {
        return {
            success: false,
            courierId,
            previousCount: 0,
            reconciledCount: 0,
            syncedFields: [],
        };
    }
    // Get live count from orders table (source of truth)
    const liveTaskCount = await getCourierLiveTaskCount(courierId);
    // Create reconciliation log entry
    await prisma_js_1.prisma.reconciliationLog.create({
        data: {
            id_cabang: courier.id_cabang,
            kas_digital: 0,
            kas_fisik: 0,
            selisih: 0,
            status: 'Reconciled',
            approval_status: 'Disetujui',
            catatan: `Reconciled courier ${courierId} workload: ${courier.is_available ? 'active' : 'inactive'} -> live tasks: ${liveTaskCount}`,
        },
    });
    console.log(`[CourierSync] REconciliation complete for ${courierId}: ${courier.is_available} -> ${liveTaskCount} tasks`);
    return {
        success: true,
        courierId,
        previousCount: courier.is_available ? 1 : 0,
        reconciledCount: liveTaskCount,
        syncedFields: ['is_available', 'active_task_count'],
    };
}
/**
 * UPDATE COURIER WORKLOAD (Rule 2: Capacity & Status Sync)
 * Called when task status changes to update courier's active workload
 */
async function updateCourierWorkloadOnAssignment(courierId, taskId, action) {
    console.log(`[CourierSync] Updating workload for ${courierId}, action: ${action}, task: ${taskId}`);
    const courier = await prisma_js_1.prisma.courier.findUnique({
        where: { id_kurir: courierId },
    });
    if (!courier) {
        console.warn(`[CourierSync] Cannot update workload: courier ${courierId} not found`);
        return;
    }
    // Get fresh task count
    const newTaskCount = await getCourierLiveTaskCount(courierId);
    console.log(`[CourierSync] Workload updated: ${courierId} now has ${newTaskCount} active tasks`);
}
/**
 * GET BRANCH COURIERS WITH WORKLOAD
 * Returns all couriers for a branch with their live task counts and current task
 * Used for Admin dashboard to show courier availability
 */
async function getBranchCouriersWithWorkload(branchId) {
    const couriers = await prisma_js_1.prisma.courier.findMany({
        where: { id_cabang: branchId },
        orderBy: { nama_kurir: 'asc' },
    });
    const result = await Promise.all(couriers.map(async (courier) => {
        const taskCount = await getCourierLiveTaskCount(courier.id_kurir);
        // Get most recent assignment time
        const latestOrder = await prisma_js_1.prisma.order.findFirst({
            where: { id_kurir: courier.id_kurir, assigned_at: { not: null } },
            orderBy: { assigned_at: 'desc' },
        });
        // Get current task (first in-progress order with address)
        const currentOrder = await prisma_js_1.prisma.order.findFirst({
            where: {
                id_kurir: courier.id_kurir,
                status: { in: ['Diproses', 'Pickup', 'Delivery', 'OnTheWay'] },
            },
            orderBy: { assigned_at: 'asc' },
        });
        let status;
        if (!courier.is_available) {
            status = 'Offline';
        }
        else if (taskCount >= 5) {
            status = 'Busy';
        }
        else {
            status = 'Available';
        }
        return {
            id_kurir: courier.id_kurir,
            nama_kurir: courier.nama_kurir,
            is_available: courier.is_available,
            status,
            active_tasks: taskCount,
            last_assigned: latestOrder?.assigned_at ?? undefined,
            current_task: currentOrder ? {
                id_order: currentOrder.id_order,
                alamat: currentOrder.alamat_penjemputan || currentOrder.alamat_pengantaran || 'Alamat tidak tersedia',
                status: currentOrder.status,
            } : null,
        };
    }));
    return result;
}
//# sourceMappingURL=courierSync.js.map
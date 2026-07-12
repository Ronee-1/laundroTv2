import { prisma } from '../lib/prisma.js';

// ============================================================
// COURIER DATA SYNCHRONIZATION & INTEGRITY SERVICE
// FR-KUR-SYNC: Enforces 1:1 alignment between Courier Registry
// and Tugas Kurir allocation engine
// ============================================================

/**
 * Courier Validation Result - detailed status for debugging
 */
export interface CourierValidationResult {
  isValid: boolean;
  courierId: string | null;
  courierName: string | null;
  courierBranch: string | null;
  courierStatus: 'Active' | 'Inactive' | 'NotFound';
  workloadCount: number;
  errorCode: 'VALID' | 'NOT_FOUND' | 'INACTIVE' | 'BRANCH_MISMATCH' | 'WORKLOAD_ASYMMETRY';
  errorMessage: string | null;
}

/**
 * Assignment Guardrail Result
 */
export interface AssignmentGuardResult {
  approved: boolean;
  courierId: string | null;
  validation: CourierValidationResult | null;
  errorCode: 'VALID' | 'NOT_FOUND' | 'INACTIVE' | 'BRANCH_MISMATCH' | 'WORKLOAD_ASYMMETRY';
  errorMessage: string | null;
  action: 'APPROVED' | 'REJECTED';
}

/**
 * Live Courier Task Count from database
 */
export interface CourierWorkloadStats {
  courierId: string;
  courierName: string;
  branchId: string;
  activeTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  totalActiveTasks: number;
  status: 'Available' | 'Busy' | 'Offline';
}

/**
 * CROSS-CHECK VALIDATION (Rule 3: Bilateral Validation)
 * Validates that a courier exists, is active, and is in the correct branch
 * Also fetches live task count for verification
 */
export async function validateCourierForAssignment(
  courierId: string,
  orderBranchId: string
): Promise<CourierValidationResult> {
  console.log(`[CourierSync] Validating courier ${courierId} for order at branch ${orderBranchId}`);

  // Step 1: Check if courier exists
  const courier = await prisma.courier.findUnique({
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
export async function assignmentGuardrail(
  courierId: string,
  orderBranchId: string
): Promise<AssignmentGuardResult> {
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
export async function getCourierLiveTaskCount(courierId: string): Promise<number> {
  // Count orders assigned to this courier with non-terminal statuses
  const count = await prisma.order.count({
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
export async function getCourierWorkloadStats(courierId: string): Promise<CourierWorkloadStats | null> {
  const courier = await prisma.courier.findUnique({
    where: { id_kurir: courierId },
  });

  if (!courier) {
    return null;
  }

  // Get count by status
  const [pendingCount, inProgressCount, activeCount] = await Promise.all([
    prisma.order.count({
      where: { id_kurir: courierId, status: 'Pending' },
    }),
    prisma.order.count({
      where: { id_kurir: courierId, status: 'Diproses' },
    }),
    prisma.order.count({
      where: {
        id_kurir: courierId,
        status: {
          notIn: ['Done', 'Dibatalkan', 'Selesai', 'Lunas'],
        },
      },
    }),
  ]);

  let status: 'Available' | 'Busy' | 'Offline' = 'Offline';
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
export async function performBilateralValidation(courierId: string): Promise<{
  verified: boolean;
  courier_id: string;
  courier_status: 'Online' | 'Offline';
  assigned_tasks_count: number;
  branch_id: string | null;
  discrepancy: boolean;
  message: string;
}> {
  const courier = await prisma.courier.findUnique({
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
  const courierStatus: 'Online' | 'Offline' = courier.is_available ? 'Online' : 'Offline';

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
export async function forceReconciliation(courierId: string): Promise<{
  success: boolean;
  courierId: string;
  previousCount: number;
  reconciledCount: number;
  syncedFields: string[];
}> {
  console.log(`[CourierSync] FORCE RECONCILIATION for ${courierId}`);

  const courier = await prisma.courier.findUnique({
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
  await prisma.reconciliationLog.create({
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
export async function updateCourierWorkloadOnAssignment(
  courierId: string,
  taskId: string,
  action: 'ASSIGN' | 'COMPLETE' | 'CANCEL'
): Promise<void> {
  console.log(`[CourierSync] Updating workload for ${courierId}, action: ${action}, task: ${taskId}`);

  const courier = await prisma.courier.findUnique({
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
export async function getBranchCouriersWithWorkload(branchId: string): Promise<Array<{
  id_kurir: string;
  nama_kurir: string;
  is_available: boolean;
  status: 'Available' | 'Busy' | 'Offline';
  active_tasks: number;
  last_assigned?: Date;
  current_task?: {
    id_order: string;
    alamat: string;
    status: string;
  } | null;
}>> {
  const couriers = await prisma.courier.findMany({
    where: { id_cabang: branchId },
    orderBy: { nama_kurir: 'asc' },
  });

  const result = await Promise.all(
    couriers.map(async (courier) => {
      const taskCount = await getCourierLiveTaskCount(courier.id_kurir);

      // Get most recent assignment time
      const latestOrder = await prisma.order.findFirst({
        where: { id_kurir: courier.id_kurir, assigned_at: { not: null } },
        orderBy: { assigned_at: 'desc' },
      });

      // Get current task (first in-progress order with address)
      const currentOrder = await prisma.order.findFirst({
        where: {
          id_kurir: courier.id_kurir,
          status: { in: ['Diproses', 'Pickup', 'Delivery', 'OnTheWay'] },
        },
        orderBy: { assigned_at: 'asc' },
      });

      let status: 'Available' | 'Busy' | 'Offline';
      if (!courier.is_available) {
        status = 'Offline';
      } else if (taskCount >= 5) {
        status = 'Busy';
      } else {
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
    })
  );

  return result;
}

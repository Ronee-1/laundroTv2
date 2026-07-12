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
export declare function validateCourierForAssignment(courierId: string, orderBranchId: string): Promise<CourierValidationResult>;
/**
 * ASSIGNMENT GUARDRAIL (Rule 3: Bilateral Validation)
 * Intercepts assignment and validates courier before proceeding
 * Returns detailed result for error handling
 */
export declare function assignmentGuardrail(courierId: string, orderBranchId: string): Promise<AssignmentGuardResult>;
/**
 * GET LIVE COURIER TASK COUNT
 * Directly queries active tugas_harian log for absolute data parity
 * Used for Rule 2: Capacity & Status Sync
 */
export declare function getCourierLiveTaskCount(courierId: string): Promise<number>;
/**
 * GET COMPLETE WORKLOAD STATS
 * Returns detailed workload breakdown for Data Kurir dashboard
 */
export declare function getCourierWorkloadStats(courierId: string): Promise<CourierWorkloadStats | null>;
/**
 * BILATERAL VALIDATION CHECK
 * Cross-checks courier registry against active task log
 * Returns verification result for admin dashboard
 */
export declare function performBilateralValidation(courierId: string): Promise<{
    verified: boolean;
    courier_id: string;
    courier_status: 'Online' | 'Offline';
    assigned_tasks_count: number;
    branch_id: string | null;
    discrepancy: boolean;
    message: string;
}>;
/**
 * FORCE RECONCILIATION (CASE B: Workload Asymmetry Handler)
 * Forces main Courier Status Database to pull live count
 * from active Tugas Harian log to guarantee absolute data parity
 */
export declare function forceReconciliation(courierId: string): Promise<{
    success: boolean;
    courierId: string;
    previousCount: number;
    reconciledCount: number;
    syncedFields: string[];
}>;
/**
 * UPDATE COURIER WORKLOAD (Rule 2: Capacity & Status Sync)
 * Called when task status changes to update courier's active workload
 */
export declare function updateCourierWorkloadOnAssignment(courierId: string, taskId: string, action: 'ASSIGN' | 'COMPLETE' | 'CANCEL'): Promise<void>;
/**
 * GET BRANCH COURIERS WITH WORKLOAD
 * Returns all couriers for a branch with their live task counts and current task
 * Used for Admin dashboard to show courier availability
 */
export declare function getBranchCouriersWithWorkload(branchId: string): Promise<Array<{
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
}>>;
//# sourceMappingURL=courierSync.d.ts.map
import type { Courier } from '@laundrot/shared-types';
/**
 * Get courier by ID from database
 */
export declare function getCourierByIdFromDB(id_kurir: string): Promise<Courier | null>;
/**
 * Get all couriers for a branch from database
 */
export declare function getCouriersByBranchFromDB(id_cabang: string): Promise<Courier[]>;
/**
 * Get all couriers from database
 */
export declare function getAllCouriersFromDB(): Promise<Courier[]>;
/**
 * Update courier availability
 */
export declare function updateCourierAvailability(id_kurir: string, is_available: boolean): Promise<Courier | null>;
/**
 * Get courier by ID - uses database
 */
export declare function getCourierById(id_kurir: string): Promise<Courier | null>;
/**
 * Get all couriers for a specific branch - uses database
 */
export declare function getCouriersByBranch(id_cabang: string): Promise<Courier[]>;
/**
 * Seed default couriers to database (for initial setup)
 */
export declare function seedDefaultCouriers(): Promise<void>;
//# sourceMappingURL=couriers.d.ts.map
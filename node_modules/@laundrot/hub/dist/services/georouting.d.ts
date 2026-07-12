import type { Branch } from '@laundrot/shared-types';
interface Coordinates {
    latitude: number;
    longitude: number;
}
export declare function haversineDistance(a: Coordinates, b: Coordinates): number;
export interface GeoroutingResult {
    branch: Branch;
    distance_km: number;
}
export declare function findNearestBranch(customerCoords: Coordinates): Promise<GeoroutingResult | null>;
export {};
//# sourceMappingURL=georouting.d.ts.map
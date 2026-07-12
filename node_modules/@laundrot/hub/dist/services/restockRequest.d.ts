export type RestockRequestStatus = 'Pending' | 'Approved' | 'Rejected';
export interface RestockRequest {
    id_request: string;
    id_cabang: string;
    nama_cabang: string;
    created_by: string;
    requested_items: {
        detergen?: number;
        pelembut?: number;
        plastik?: number;
    };
    status: RestockRequestStatus;
    catatan?: string;
    reviewed_by?: string;
    reviewed_at?: Date;
    created_at: Date;
}
/**
 * Create new restock request
 */
export declare function createRestockRequest(params: {
    id_cabang: string;
    nama_cabang: string;
    created_by: string;
    requested_items: {
        detergen?: number;
        pelembut?: number;
        plastik?: number;
    };
    catatan?: string;
}): Promise<RestockRequest>;
/**
 * Get all pending requests
 */
export declare function getPendingRequests(): Promise<RestockRequest[]>;
/**
 * Get requests by branch
 */
export declare function getRequestsByBranch(id_cabang: string): Promise<RestockRequest[]>;
/**
 * Get all requests
 */
export declare function getAllRequests(): Promise<RestockRequest[]>;
/**
 * Get request by ID
 */
export declare function getRequestById(id_request: string): Promise<RestockRequest | null>;
/**
 * Approve restock request
 */
export declare function approveRequest(id_request: string, reviewed_by: string): Promise<RestockRequest | null>;
/**
 * Reject restock request
 */
export declare function rejectRequest(id_request: string, reviewed_by: string, catatan?: string): Promise<RestockRequest | null>;
//# sourceMappingURL=restockRequest.d.ts.map
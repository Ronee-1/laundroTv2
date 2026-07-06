export type RestockRequestStatus = 'Pending' | 'Approved' | 'Rejected';
export interface RestockRequest {
    id_request: string;
    id_cabang: string;
    nama_cabang: string;
    created_by: 'Admin' | 'Owner';
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
export declare function createRestockRequest(params: {
    id_cabang: string;
    nama_cabang: string;
    created_by: 'Admin' | 'Owner';
    requested_items: {
        detergen?: number;
        pelembut?: number;
        plastik?: number;
    };
    catatan?: string;
}): RestockRequest;
export declare function getPendingRequests(): RestockRequest[];
export declare function getRequestsByBranch(id_cabang: string): RestockRequest[];
export declare function getAllRequests(): RestockRequest[];
export declare function getRequestById(id_request: string): RestockRequest | undefined;
export declare function approveRequest(id_request: string, reviewed_by: string): RestockRequest | null;
export declare function rejectRequest(id_request: string, reviewed_by: string, catatan?: string): RestockRequest | null;
//# sourceMappingURL=restockRequest.d.ts.map
// ==========================================
// RESTOCK REQUEST SERVICE - FR-INV-01, REQUEST/APPROVAL FLOW
// Admin submits restock request (pending approval)
// Owner approves or rejects requests
// Owner can also do direct restock without approval
// ==========================================

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

const RESTOCK_REQUESTS: RestockRequest[] = [];

export function createRestockRequest(params: {
  id_cabang: string;
  nama_cabang: string;
  created_by: 'Admin' | 'Owner';
  requested_items: { detergen?: number; pelembut?: number; plastik?: number };
  catatan?: string;
}): RestockRequest {
  const request: RestockRequest = {
    id_request: `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    id_cabang: params.id_cabang,
    nama_cabang: params.nama_cabang,
    created_by: params.created_by,
    requested_items: params.requested_items,
    status: 'Pending',
    catatan: params.catatan,
    created_at: new Date(),
  };
  RESTOCK_REQUESTS.push(request);
  return request;
}

export function getPendingRequests(): RestockRequest[] {
  return RESTOCK_REQUESTS.filter((r) => r.status === 'Pending');
}

export function getRequestsByBranch(id_cabang: string): RestockRequest[] {
  return RESTOCK_REQUESTS.filter((r) => r.id_cabang === id_cabang);
}

export function getAllRequests(): RestockRequest[] {
  return [...RESTOCK_REQUESTS];
}

export function getRequestById(id_request: string): RestockRequest | undefined {
  return RESTOCK_REQUESTS.find((r) => r.id_request === id_request);
}

export function approveRequest(id_request: string, reviewed_by: string): RestockRequest | null {
  const request = RESTOCK_REQUESTS.find((r) => r.id_request === id_request);
  if (!request || request.status !== 'Pending') return null;
  request.status = 'Approved';
  request.reviewed_by = reviewed_by;
  request.reviewed_at = new Date();
  return request;
}

export function rejectRequest(id_request: string, reviewed_by: string, catatan?: string): RestockRequest | null {
  const request = RESTOCK_REQUESTS.find((r) => r.id_request === id_request);
  if (!request || request.status !== 'Pending') return null;
  request.status = 'Rejected';
  request.reviewed_by = reviewed_by;
  request.reviewed_at = new Date();
  if (catatan) request.catatan = catatan;
  return request;
}

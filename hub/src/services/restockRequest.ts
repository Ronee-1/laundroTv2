// ==========================================
// RESTOCK REQUEST SERVICE - FR-INV-01, REQUEST/APPROVAL FLOW
// Admin submits restock request (pending approval)
// Owner approves or rejects requests
// Owner can also do direct restock without approval
// ==========================================

import { prisma } from '../lib/prisma.js';

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

// ==========================================
// RESTOCK REQUEST CRUD OPERATIONS
// ==========================================

/**
 * Create new restock request
 */
export async function createRestockRequest(params: {
  id_cabang: string;
  nama_cabang: string;
  created_by: string;
  requested_items: { detergen?: number; pelembut?: number; plastik?: number };
  catatan?: string;
}): Promise<RestockRequest> {
  const id_request = `REQ-${Date.now().toString(36).toUpperCase()}`;

  const request = await prisma.restockRequest.create({
    data: {
      id_request,
      id_cabang: params.id_cabang,
      nama_cabang: params.nama_cabang,
      created_by: params.created_by,
      requested_items: params.requested_items as any,
      status: 'Pending',
      catatan: params.catatan,
    },
  });

  return {
    id_request: request.id_request,
    id_cabang: request.id_cabang,
    nama_cabang: request.nama_cabang,
    created_by: request.created_by,
    requested_items: request.requested_items as RestockRequest['requested_items'],
    status: request.status as RestockRequestStatus,
    catatan: request.catatan ?? undefined,
    reviewed_by: request.reviewed_by ?? undefined,
    reviewed_at: request.reviewed_at ?? undefined,
    created_at: request.created_at,
  };
}

/**
 * Get all pending requests
 */
export async function getPendingRequests(): Promise<RestockRequest[]> {
  const requests = await prisma.restockRequest.findMany({
    where: { status: 'Pending' },
    orderBy: { created_at: 'desc' },
  });

  return requests.map((r) => ({
    id_request: r.id_request,
    id_cabang: r.id_cabang,
    nama_cabang: r.nama_cabang,
    created_by: r.created_by,
    requested_items: r.requested_items as RestockRequest['requested_items'],
    status: r.status as RestockRequestStatus,
    catatan: r.catatan ?? undefined,
    reviewed_by: r.reviewed_by ?? undefined,
    reviewed_at: r.reviewed_at ?? undefined,
    created_at: r.created_at,
  }));
}

/**
 * Get requests by branch
 */
export async function getRequestsByBranch(id_cabang: string): Promise<RestockRequest[]> {
  const requests = await prisma.restockRequest.findMany({
    where: { id_cabang },
    orderBy: { created_at: 'desc' },
  });

  return requests.map((r) => ({
    id_request: r.id_request,
    id_cabang: r.id_cabang,
    nama_cabang: r.nama_cabang,
    created_by: r.created_by,
    requested_items: r.requested_items as RestockRequest['requested_items'],
    status: r.status as RestockRequestStatus,
    catatan: r.catatan ?? undefined,
    reviewed_by: r.reviewed_by ?? undefined,
    reviewed_at: r.reviewed_at ?? undefined,
    created_at: r.created_at,
  }));
}

/**
 * Get all requests
 */
export async function getAllRequests(): Promise<RestockRequest[]> {
  const requests = await prisma.restockRequest.findMany({
    orderBy: { created_at: 'desc' },
  });

  return requests.map((r) => ({
    id_request: r.id_request,
    id_cabang: r.id_cabang,
    nama_cabang: r.nama_cabang,
    created_by: r.created_by,
    requested_items: r.requested_items as RestockRequest['requested_items'],
    status: r.status as RestockRequestStatus,
    catatan: r.catatan ?? undefined,
    reviewed_by: r.reviewed_by ?? undefined,
    reviewed_at: r.reviewed_at ?? undefined,
    created_at: r.created_at,
  }));
}

/**
 * Get request by ID
 */
export async function getRequestById(id_request: string): Promise<RestockRequest | null> {
  const request = await prisma.restockRequest.findUnique({
    where: { id_request },
  });

  if (!request) return null;

  return {
    id_request: request.id_request,
    id_cabang: request.id_cabang,
    nama_cabang: request.nama_cabang,
    created_by: request.created_by,
    requested_items: request.requested_items as RestockRequest['requested_items'],
    status: request.status as RestockRequestStatus,
    catatan: request.catatan ?? undefined,
    reviewed_by: request.reviewed_by ?? undefined,
    reviewed_at: request.reviewed_at ?? undefined,
    created_at: request.created_at,
  };
}

/**
 * Approve restock request
 */
export async function approveRequest(id_request: string, reviewed_by: string): Promise<RestockRequest | null> {
  try {
    const request = await prisma.restockRequest.update({
      where: { id_request },
      data: {
        status: 'Approved',
        reviewed_by,
        reviewed_at: new Date(),
      },
    });

    return {
      id_request: request.id_request,
      id_cabang: request.id_cabang,
      nama_cabang: request.nama_cabang,
      created_by: request.created_by,
      requested_items: request.requested_items as RestockRequest['requested_items'],
      status: request.status as RestockRequestStatus,
      catatan: request.catatan ?? undefined,
      reviewed_by: request.reviewed_by ?? undefined,
      reviewed_at: request.reviewed_at ?? undefined,
      created_at: request.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * Reject restock request
 */
export async function rejectRequest(id_request: string, reviewed_by: string, catatan?: string): Promise<RestockRequest | null> {
  try {
    const request = await prisma.restockRequest.update({
      where: { id_request },
      data: {
        status: 'Rejected',
        reviewed_by,
        reviewed_at: new Date(),
        catatan: catatan ?? undefined,
      },
    });

    return {
      id_request: request.id_request,
      id_cabang: request.id_cabang,
      nama_cabang: request.nama_cabang,
      created_by: request.created_by,
      requested_items: request.requested_items as RestockRequest['requested_items'],
      status: request.status as RestockRequestStatus,
      catatan: request.catatan ?? undefined,
      reviewed_by: request.reviewed_by ?? undefined,
      reviewed_at: request.reviewed_at ?? undefined,
      created_at: request.created_at,
    };
  } catch {
    return null;
  }
}

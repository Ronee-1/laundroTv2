"use strict";
// ==========================================
// RESTOCK REQUEST SERVICE - FR-INV-01, REQUEST/APPROVAL FLOW
// Admin submits restock request (pending approval)
// Owner approves or rejects requests
// Owner can also do direct restock without approval
// ==========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestockRequest = createRestockRequest;
exports.getPendingRequests = getPendingRequests;
exports.getRequestsByBranch = getRequestsByBranch;
exports.getAllRequests = getAllRequests;
exports.getRequestById = getRequestById;
exports.approveRequest = approveRequest;
exports.rejectRequest = rejectRequest;
const prisma_js_1 = require("../lib/prisma.js");
// ==========================================
// RESTOCK REQUEST CRUD OPERATIONS
// ==========================================
/**
 * Create new restock request
 */
async function createRestockRequest(params) {
    const id_request = `REQ-${Date.now().toString(36).toUpperCase()}`;
    const request = await prisma_js_1.prisma.restockRequest.create({
        data: {
            id_request,
            id_cabang: params.id_cabang,
            nama_cabang: params.nama_cabang,
            created_by: params.created_by,
            requested_items: params.requested_items,
            status: 'Pending',
            catatan: params.catatan,
        },
    });
    return {
        id_request: request.id_request,
        id_cabang: request.id_cabang,
        nama_cabang: request.nama_cabang,
        created_by: request.created_by,
        requested_items: request.requested_items,
        status: request.status,
        catatan: request.catatan ?? undefined,
        reviewed_by: request.reviewed_by ?? undefined,
        reviewed_at: request.reviewed_at ?? undefined,
        created_at: request.created_at,
    };
}
/**
 * Get all pending requests
 */
async function getPendingRequests() {
    const requests = await prisma_js_1.prisma.restockRequest.findMany({
        where: { status: 'Pending' },
        orderBy: { created_at: 'desc' },
    });
    return requests.map((r) => ({
        id_request: r.id_request,
        id_cabang: r.id_cabang,
        nama_cabang: r.nama_cabang,
        created_by: r.created_by,
        requested_items: r.requested_items,
        status: r.status,
        catatan: r.catatan ?? undefined,
        reviewed_by: r.reviewed_by ?? undefined,
        reviewed_at: r.reviewed_at ?? undefined,
        created_at: r.created_at,
    }));
}
/**
 * Get requests by branch
 */
async function getRequestsByBranch(id_cabang) {
    const requests = await prisma_js_1.prisma.restockRequest.findMany({
        where: { id_cabang },
        orderBy: { created_at: 'desc' },
    });
    return requests.map((r) => ({
        id_request: r.id_request,
        id_cabang: r.id_cabang,
        nama_cabang: r.nama_cabang,
        created_by: r.created_by,
        requested_items: r.requested_items,
        status: r.status,
        catatan: r.catatan ?? undefined,
        reviewed_by: r.reviewed_by ?? undefined,
        reviewed_at: r.reviewed_at ?? undefined,
        created_at: r.created_at,
    }));
}
/**
 * Get all requests
 */
async function getAllRequests() {
    const requests = await prisma_js_1.prisma.restockRequest.findMany({
        orderBy: { created_at: 'desc' },
    });
    return requests.map((r) => ({
        id_request: r.id_request,
        id_cabang: r.id_cabang,
        nama_cabang: r.nama_cabang,
        created_by: r.created_by,
        requested_items: r.requested_items,
        status: r.status,
        catatan: r.catatan ?? undefined,
        reviewed_by: r.reviewed_by ?? undefined,
        reviewed_at: r.reviewed_at ?? undefined,
        created_at: r.created_at,
    }));
}
/**
 * Get request by ID
 */
async function getRequestById(id_request) {
    const request = await prisma_js_1.prisma.restockRequest.findUnique({
        where: { id_request },
    });
    if (!request)
        return null;
    return {
        id_request: request.id_request,
        id_cabang: request.id_cabang,
        nama_cabang: request.nama_cabang,
        created_by: request.created_by,
        requested_items: request.requested_items,
        status: request.status,
        catatan: request.catatan ?? undefined,
        reviewed_by: request.reviewed_by ?? undefined,
        reviewed_at: request.reviewed_at ?? undefined,
        created_at: request.created_at,
    };
}
/**
 * Approve restock request
 */
async function approveRequest(id_request, reviewed_by) {
    try {
        const request = await prisma_js_1.prisma.restockRequest.update({
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
            requested_items: request.requested_items,
            status: request.status,
            catatan: request.catatan ?? undefined,
            reviewed_by: request.reviewed_by ?? undefined,
            reviewed_at: request.reviewed_at ?? undefined,
            created_at: request.created_at,
        };
    }
    catch {
        return null;
    }
}
/**
 * Reject restock request
 */
async function rejectRequest(id_request, reviewed_by, catatan) {
    try {
        const request = await prisma_js_1.prisma.restockRequest.update({
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
            requested_items: request.requested_items,
            status: request.status,
            catatan: request.catatan ?? undefined,
            reviewed_by: request.reviewed_by ?? undefined,
            reviewed_at: request.reviewed_at ?? undefined,
            created_at: request.created_at,
        };
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=restockRequest.js.map
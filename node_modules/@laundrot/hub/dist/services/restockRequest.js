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
const RESTOCK_REQUESTS = [];
function createRestockRequest(params) {
    const request = {
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
function getPendingRequests() {
    return RESTOCK_REQUESTS.filter((r) => r.status === 'Pending');
}
function getRequestsByBranch(id_cabang) {
    return RESTOCK_REQUESTS.filter((r) => r.id_cabang === id_cabang);
}
function getAllRequests() {
    return [...RESTOCK_REQUESTS];
}
function getRequestById(id_request) {
    return RESTOCK_REQUESTS.find((r) => r.id_request === id_request);
}
function approveRequest(id_request, reviewed_by) {
    const request = RESTOCK_REQUESTS.find((r) => r.id_request === id_request);
    if (!request || request.status !== 'Pending')
        return null;
    request.status = 'Approved';
    request.reviewed_by = reviewed_by;
    request.reviewed_at = new Date();
    return request;
}
function rejectRequest(id_request, reviewed_by, catatan) {
    const request = RESTOCK_REQUESTS.find((r) => r.id_request === id_request);
    if (!request || request.status !== 'Pending')
        return null;
    request.status = 'Rejected';
    request.reviewed_by = reviewed_by;
    request.reviewed_at = new Date();
    if (catatan)
        request.catatan = catatan;
    return request;
}
//# sourceMappingURL=restockRequest.js.map
import { Router, type Request, type Response } from 'express';
import { getBranchById } from '../config/branches.js';
import { restockInventory } from '../services/inventory.js';
import { createRestockRequest, getPendingRequests, getAllRequests, approveRequest, rejectRequest, getRequestsByBranch } from '../services/restockRequest.js';

const router = Router();

// ==========================================
// RESTOCK REQUEST ROUTES
// Admin submits request (Pending), Owner approves/rejects
// ==========================================

// Submit restock request (Admin)
interface RestockRequestBody {
  detergen?: number;
  pelembut?: number;
  plastik?: number;
  catatan?: string;
}

interface RestockRequestResponse {
  success: true;
  request: {
    id_request: string;
    id_cabang: string;
    requested_items: { detergen?: number; pelembut?: number; plastik?: number };
    status: string;
    created_at: string;
  };
  message: string;
}

router.post(
  '/request',
  (req: Request<Record<string, never>, RestockRequestResponse, RestockRequestBody>,
  res: Response<RestockRequestResponse>
) => {
  const { id_cabang } = req.query as { id_cabang?: string };
  const { detergen, pelembut, plastik, catatan } = req.body;

  if (!id_cabang) {
    res.status(400).json({
      success: false as any,
      error: 'id_cabang wajib ada di query parameter',
    });
    return;
  }

  const branch = getBranchById(id_cabang);
  if (!branch) {
    res.status(404).json({
      success: false as any,
      error: `Cabang "${id_cabang}" tidak ditemukan.`,
    });
    return;
  }

  const requested_items = { detergen, pelembut, plastik };
  const hasItem = Object.values(requested_items).some((v) => v && v > 0);
  if (!hasItem) {
    res.status(400).json({
      success: false as any,
      error: 'Minimal satu item restok harus diisi nilainya.',
    });
    return;
  }

  const request = createRestockRequest({
    id_cabang,
    nama_cabang: branch.nama_cabang,
    created_by: 'Admin',
    requested_items,
    catatan,
  });

  res.status(201).json({
    success: true,
    request: {
      id_request: request.id_request,
      id_cabang: request.id_cabang,
      requested_items: request.requested_items,
      status: request.status,
      created_at: request.created_at.toISOString(),
    },
    message: `Pengajuan restok ke ${branch.nama_cabang} berhasil. Menunggu persetujuan Owner.`,
  });
});

// Get pending requests (Owner view)
router.get('/pending', (_req: Request, res: Response) => {
  const requests = getPendingRequests();
  res.json({
    success: true,
    total: requests.length,
    requests: requests.map((r) => ({
      id_request: r.id_request,
      id_cabang: r.id_cabang,
      nama_cabang: r.nama_cabang,
      requested_items: r.requested_items,
      created_at: r.created_at.toISOString(),
    })),
  });
});

// Get all requests (filtered by branch or all)
router.get('/', (req: Request, res: Response) => {
  const { id_cabang, status } = req.query as { id_cabang?: string; status?: string };
  let requests = id_cabang ? getRequestsByBranch(id_cabang) : getAllRequests();
  if (status) requests = requests.filter((r) => r.status === status);
  res.json({
    success: true,
    total: requests.length,
    requests: requests.map((r) => ({
      id_request: r.id_request,
      id_cabang: r.id_cabang,
      nama_cabang: r.nama_cabang,
      created_by: r.created_by,
      requested_items: r.requested_items,
      status: r.status,
      catatan: r.catatan,
      reviewed_by: r.reviewed_by,
      created_at: r.created_at.toISOString(),
      reviewed_at: r.reviewed_at?.toISOString(),
    })),
  });
});

// Approve request (Owner only)
router.patch('/:id_request/approve', (req: Request<{ id_request: string }, any, any>, res: Response) => {
  const { id_request } = req.params;
  const { reviewed_by } = req.body as { reviewed_by?: string };

  const request = approveRequest(id_request, reviewed_by ?? 'Owner');
  if (!request) {
    res.status(404).json({ success: false, error: 'Pengajuan tidak ditemukan atau sudah diproses.' });
    return;
  }

  // Apply restock to inventory
  restockInventory(request.id_cabang, {
    detergen: request.requested_items.detergen,
    pelembut: request.requested_items.pelembut,
    plastik: request.requested_items.plastik,
  });

  res.json({
    success: true,
    message: `Pengajuan restok ${request.id_request} DISETUJUI. Stok ${request.nama_cabang} bertambah.`,
  });
});

// Reject request (Owner only)
router.patch('/:id_request/reject', (req: Request<{ id_request: string }, any, any>, res: Response) => {
  const { id_request } = req.params;
  const { reviewed_by, catatan } = req.body as { reviewed_by?: string; catatan?: string };

  const request = rejectRequest(id_request, reviewed_by ?? 'Owner', catatan);
  if (!request) {
    res.status(404).json({ success: false, error: 'Pengajuan tidak ditemukan atau sudah diproses.' });
    return;
  }

  res.json({
    success: true,
    message: `Pengajuan restok ${id_request} DITOLAK.`,
  });
});

export default router;

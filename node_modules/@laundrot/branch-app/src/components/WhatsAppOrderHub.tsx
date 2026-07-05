import { useState, useEffect } from 'react';
import type { UserRole } from '../App.tsx';

interface OrderQueueItem {
  id_order: string;
  customer_name: string;
  service_type: string;
  wilayah: string;
  berat_kg: number;
  alamat_maps: string;
  whatsapp: string;
  koordinat: { latitude: number; longitude: number };
  timestamp: string;
  status: 'pending' | 'allocated';
  allocated_to?: string;
}

interface BranchOption {
  id: string;
  nama: string;
  koordinat: { latitude: number; longitude: number };
  jarak?: number;
}

interface Props {
  userRole: UserRole;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

// Mock branches with coordinates
const BRANCHES: BranchOption[] = [
  { id: 'CBG-001', nama: 'Depok (Pusat)', koordinat: { latitude: -6.4025, longitude: 106.7942 } },
  { id: 'CBG-002', nama: 'Jakarta Selatan', koordinat: { latitude: -6.2615, longitude: 106.8112 } },
  { id: 'CBG-003', nama: 'Bekasi Timur', koordinat: { latitude: -6.2309, longitude: 107.0028 } },
  { id: 'CBG-004', nama: 'Tangerang Kota', koordinat: { latitude: -6.1782, longitude: 106.6301 } },
  { id: 'CBG-005', nama: 'Bogor Raya', koordinat: { latitude: -6.5950, longitude: 106.8166 } },
];

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find nearest branch based on coordinates
function findNearestBranch(customerLat: number, customerLon: number): { branch: BranchOption; distance: number } | null {
  const first = BRANCHES[0];
  if (!first) return null;
  let nearest: BranchOption = first;
  let minDistance = calculateDistance(customerLat, customerLon, nearest.koordinat.latitude, nearest.koordinat.longitude);

  for (const branch of BRANCHES) {
    const distance = calculateDistance(customerLat, customerLon, branch.koordinat.latitude, branch.koordinat.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = branch;
    }
  }

  return { branch: nearest, distance: minDistance };
}

// Mock order queue data
const MOCK_ORDER_QUEUE: OrderQueueItem[] = [
  {
    id_order: 'ORD-2026-0705-001',
    customer_name: 'Farid Yusril',
    service_type: 'Laundry Kiloan',
    wilayah: 'Jakarta Selatan',
    berat_kg: 5,
    alamat_maps: 'https://maps.app.goo.gl/abc123',
    whatsapp: '081234567890',
    koordinat: { latitude: -6.2615, longitude: 106.8112 },
    timestamp: '2026-07-05T10:30:00Z',
    status: 'pending',
  },
  {
    id_order: 'ORD-2026-0705-002',
    customer_name: 'Sari Dewi',
    service_type: 'Laundry Kiloan',
    wilayah: 'Depok',
    berat_kg: 3,
    alamat_maps: 'https://maps.app.goo.gl/def456',
    whatsapp: '081234567891',
    koordinat: { latitude: -6.4025, longitude: 106.7942 },
    timestamp: '2026-07-05T10:45:00Z',
    status: 'pending',
  },
  {
    id_order: 'ORD-2026-0705-003',
    customer_name: 'Ahmad Rizki',
    service_type: 'Laundry Kiloan',
    wilayah: 'Bekasi Timur',
    berat_kg: 8,
    alamat_maps: 'https://maps.app.goo.gl/ghi789',
    whatsapp: '081234567892',
    koordinat: { latitude: -6.2309, longitude: 107.0028 },
    timestamp: '2026-07-05T11:00:00Z',
    status: 'pending',
  },
  {
    id_order: 'ORD-2026-0705-004',
    customer_name: 'Diana Putri',
    service_type: 'Laundry Kiloan',
    wilayah: 'Tangerang Kota',
    berat_kg: 4,
    alamat_maps: 'https://maps.app.goo.gl/jkl012',
    whatsapp: '081234567893',
    koordinat: { latitude: -6.1782, longitude: 106.6301 },
    timestamp: '2026-07-05T11:15:00Z',
    status: 'pending',
  },
];

// ==========================================
// WHATSAPP ORDER HUB - FR-LOG-01 Core Implementation
// Alokasi pesanan manual dari WhatsApp Center ke cabang terdekat
// Admin Pusat merekomendasikan cabang pemroses berdasarkan jarak geografis
// Static Georouting - Input alamat dari pesan WhatsApp masuk
//
// FLOW:
// 1. Admin Pusat input data pelanggan dari WhatsApp
// 2. Sistem auto-calculate nearest branch via Haversine
// 3. Admin allocate pesanan ke branch
// 4. API POST /api/orders/whatsapp-allocate -> Order dibuat di branch
// 5. Branch Admin lihat pesanan di dashboard via GET /api/orders/branch/:id_cabang/incoming
// ==========================================
export function WhatsAppOrderHub({ userRole: _userRole, triggerNotification }: Props) {
  const [orderQueue, setOrderQueue] = useState<OrderQueueItem[]>(MOCK_ORDER_QUEUE);
  const [selectedOrder, setSelectedOrder] = useState<OrderQueueItem | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [allocating, setAllocating] = useState(false);

  // Find nearest branch for selected order
  const nearestBranch = selectedOrder
    ? findNearestBranch(selectedOrder.koordinat.latitude, selectedOrder.koordinat.longitude)
    : null;

  // Set default branch when order is selected
  useEffect(() => {
    if (nearestBranch && !selectedBranch) {
      setSelectedBranch(nearestBranch.branch.id);
    }
  }, [nearestBranch, selectedBranch]);

  function handleSelectOrder(order: OrderQueueItem) {
    setSelectedOrder(order);
    setSelectedBranch('');
  }

  // FR-LOG-01: Handle allocation from WhatsApp Hub
  // Calls API to create order in the nearest branch
  async function handleAllocate() {
    if (!selectedOrder || !selectedBranch) {
      triggerNotification('Pilih cabang tujuan terlebih dahulu.', 'error');
      return;
    }

    setAllocating(true);
    try {
      // FR-LOG-01: Call API to allocate order to nearest branch
      // The order will be immediately visible in branch admin dashboard
      const res = await fetch('/api/orders/whatsapp-allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: selectedOrder.customer_name,
          customer_whatsapp: selectedOrder.whatsapp,
          service_type: selectedOrder.service_type,
          wilayah: selectedOrder.wilayah,
          berat_kg: selectedOrder.berat_kg,
          alamat_penjemputan: selectedOrder.alamat_maps,
          google_maps_url: selectedOrder.alamat_maps,
          koordinat: selectedOrder.koordinat,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        triggerNotification(json.error ?? 'Gagal mengalokasikan order.', 'error');
        return;
      }

      // FR-LOG-02: Order successfully allocated to branch
      // Branch admin can now see this in their incoming orders
      const branchName = BRANCHES.find(b => b.id === selectedBranch)?.nama ?? selectedBranch;

      triggerNotification(
        `✓ Order ${json.id_order} berhasil dikirim ke ${branchName}! Branch admin akan melihat pesanan ini di dashboard mereka.`,
        'success'
      );

      // Update local state to mark as allocated
      setOrderQueue(prev =>
        prev.map(o =>
          o.id_order === selectedOrder.id_order
            ? { ...o, status: 'allocated', allocated_to: selectedBranch }
            : o
        )
      );

      setSelectedOrder(null);
      setSelectedBranch('');
    } catch {
      triggerNotification('Tidak dapat terhubung ke server.', 'error');
    } finally {
      setAllocating(false);
    }
  }

  const pendingOrders = orderQueue.filter(o => o.status === 'pending');
  const allocatedOrders = orderQueue.filter(o => o.status === 'allocated');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy tracking-tight">WhatsApp Order Hub</h1>
        <p className="text-sm text-slate-500 mt-1">Antrean pesanan masuk dari WhatsApp Center — Alokasi Georouting</p>
      </div>

      {/* SPLIT PANEL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ============================================ */}
        {/* PANEL KIRI: Antrean Pesanan Masuk */}
        {/* ============================================ */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-base font-bold text-navy">Antrean Pesanan Masuk</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manual Georouting Required</p>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-slate-400">Tidak ada pesanan pending</p>
              </div>
            ) : (
              pendingOrders.map(order => (
                <button
                  key={order.id_order}
                  onClick={() => handleSelectOrder(order)}
                  className={`w-full p-4 text-left hover:bg-base-bg transition-all ${
                    selectedOrder?.id_order === order.id_order ? 'bg-teal-50 border-l-4 border-teal' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-navy">{order.customer_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.service_type} — {order.berat_kg} kg</p>
                      <p className="text-[10px] text-slate-400 mt-1">{order.wilayah}</p>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">Pending</span>
                  </div>
                </button>
              ))
            )}

            {/* Allocated Orders Section */}
            {allocatedOrders.length > 0 && (
              <>
                <div className="p-3 bg-slate-50 border-t border-slate-200">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Sudah Dialokasikan</p>
                </div>
                {allocatedOrders.map(order => (
                  <div
                    key={order.id_order}
                    className="p-4 text-left opacity-60"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-navy">{order.customer_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{order.service_type} — {order.berat_kg} kg</p>
                      </div>
                      <span className="text-[10px] bg-teal-50 text-teal px-2 py-0.5 rounded-full font-medium">
                        {BRANCHES.find(b => b.id === order.allocated_to)?.nama}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* PANEL KANAN: Detail Alokasi Georouting */}
        {/* ============================================ */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {selectedOrder ? (
            <>
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-navy">Penerimaan Pesanan Laundry</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pusat — WhatsApp Center</p>
              </div>

              <div className="p-5 space-y-5">
                {/* Order Details */}
                <div className="bg-base-bg rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">ID Order</p>
                      <p className="font-medium text-navy">{selectedOrder.id_order}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pelanggan</p>
                      <p className="font-medium text-navy">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">WhatsApp</p>
                      <p className="font-medium text-navy">{selectedOrder.whatsapp}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Berat</p>
                      <p className="font-medium text-navy">{selectedOrder.berat_kg} kg</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Alamat</p>
                    <a href={selectedOrder.alamat_maps} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-deep-blue hover:underline">
                      {selectedOrder.alamat_maps}
                    </a>
                  </div>
                </div>

                {/* AI Georouting Recommendation */}
                {nearestBranch && (
                  <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-deep-blue rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673c.55 0 .993.435 1.258 1.258l3.976-5.996m2.105-2.718a3.035 3.035 0 014.718 0l3.976 5.996m0 0a9.912 9.912 0 01-3.035 3.035m1.965-2.718l3.976-5.996m-3.967-2.718c.55 0 .993-.436 1.258-1.258m1.258-2.718A9.912 9.912 0 012.258 9.912" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-deep-blue">AI Recommend</h4>
                        <p className="text-xs text-navy mt-1 leading-relaxed">
                          "Koordinat [{selectedOrder.koordinat.longitude.toFixed(3)}, {selectedOrder.koordinat.latitude.toFixed(3)}] Paling Dekat Dengan <span className="font-semibold">{nearestBranch.branch.nama}</span> (Jarak: {nearestBranch.distance.toFixed(1)} km)"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Branch Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Pilih Branch Tujuan
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all"
                  >
                    <option value="">Pilih cabang...</option>
                    {BRANCHES.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Allocation Button - Premium Deep Blue */}
                <button
                  onClick={handleAllocate}
                  disabled={!selectedBranch || allocating}
                  className="w-full bg-deep-blue hover:bg-navy text-white font-medium text-sm py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {allocating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Mengalokasikan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Alokasikan Pesanan ke Cabang Terdekat (Submit Ke Sistem)
                    </>
                  )}
                </button>

                {/* Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-amber-700">
                      Setelah dialokasikan, Admin Branch terkait akan menerima data dan dapat melakukan penugasan manual untuk menyusun urutan kerja Kurir Logistik.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
              <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm text-slate-400 text-center">
                Pilih pesanan dari antrean untuk melihat detail dan melakukan alokasi georouting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

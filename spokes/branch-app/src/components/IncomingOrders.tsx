// ==========================================
// INCOMING ORDERS - FR-LOG-02 Core Implementation
// Branch Admin melihat pesanan yang dialokasikan dari WhatsApp Hub
// Pesanan masuk dari Admin Pusat akan muncul di sini
// Flow: WhatsApp Hub -> /api/orders/whatsapp-allocate -> Branch Dashboard
// ==========================================

import { useState, useEffect, useCallback } from 'react';

interface IncomingOrder {
  id_order: string;
  customer_name: string;
  customer_whatsapp: string;
  service_type: string;
  wilayah: string;
  berat_kg: number;
  alamat_penjemputan: string;
  google_maps_url: string;
  koordinat_penjemputan: { latitude: number; longitude: number };
  status: string;
  tanggal_order: string;
}

interface IncomingOrdersResponse {
  success: boolean;
  id_cabang: string;
  total_orders: number;
  orders: IncomingOrder[];
}

interface Props {
  selectedAdminBranch: string;
  triggerNotification: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function IncomingOrders({ selectedAdminBranch, triggerNotification }: Props) {
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IncomingOrder | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState<{orderId: string; courierName: string} | null>(null);
  const [couriers, setCouriers] = useState<Array<{ id_kurir: string; nama_kurir: string }>>([]);
  const [selectedCourier, setSelectedCourier] = useState<string>('');

  // FR-LOG-02: Fetch incoming orders for this branch
  const fetchIncomingOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/branch/${selectedAdminBranch}/incoming`);
      const json = (await res.json()) as IncomingOrdersResponse;

      if (!res.ok || !json.success) {
        setError('Gagal memuat pesanan masuk.');
        return;
      }

      setOrders(json.orders);
      setError(null);
    } catch {
      setError('Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  }, [selectedAdminBranch]);

  // Fetch couriers for this branch
  const fetchCouriers = useCallback(async () => {
    try {
      const res = await fetch(`/api/couriers/branch/${selectedAdminBranch}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setCouriers(json.couriers ?? []);
      }
    } catch {
      // Silent fail - couriers are optional
    }
  }, [selectedAdminBranch]);

  useEffect(() => {
    fetchIncomingOrders();
    fetchCouriers();
  }, [fetchIncomingOrders, fetchCouriers]);

  // Refresh every 30 seconds to check for new orders from WhatsApp Hub
  useEffect(() => {
    const interval = setInterval(fetchIncomingOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchIncomingOrders]);

  // FR-LOG-02: Assign order to courier and change status to "Diproses"
  async function handleAssignToCourier(order: IncomingOrder) {
    if (!selectedCourier) {
      triggerNotification('Pilih kurir terlebih dahulu.', 'warning');
      return;
    }

    setAssigning(true);
    try {
      // Sanitize the order ID to prevent issues with whitespace or special characters
      const sanitizedOrderId = order.id_order.trim();

      // Update order status to "Diproses" and assign courier
      const res = await fetch(`/api/orders/${encodeURIComponent(sanitizedOrderId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Diproses',
          id_kurir: selectedCourier.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        triggerNotification(json.message ?? json.error ?? 'Gagal memproses pesanan.', 'error');
        return;
      }

      const courierName = couriers.find(c => c.id_kurir === selectedCourier)?.nama_kurir ?? selectedCourier;

      // Tampilkan feedback sukses
      setAssignSuccess({ orderId: sanitizedOrderId, courierName });
      triggerNotification(
        `Pesanan ${sanitizedOrderId} berhasil ditugaskan ke ${courierName}. Kurir akan melihat tugas di aplikasi mobile.`,
        'success'
      );

      // Tunda penghapusan untuk memberikan feedback visual
      setTimeout(() => {
        setOrders(prev => prev.filter(o => o.id_order.trim() !== sanitizedOrderId));
        setSelectedOrder(null);
        setSelectedCourier('');
        setAssignSuccess(null);
      }, 1500);

    } catch (err) {
      console.error('[IncomingOrders] Assign error:', err);
      triggerNotification('Tidak dapat terhubung ke server.', 'error');
    } finally {
      setAssigning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 text-sm font-medium">{error}</p>
        <button
          onClick={fetchIncomingOrders}
          className="mt-3 bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-200 transition-all"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">Pesanan Masuk dari WhatsApp Hub</h1>
          <p className="text-sm text-slate-500 mt-1">
            {orders.length > 0
              ? `${orders.length} pesanan baru menunggu diproses`
              : 'Tidak ada pesanan masuk'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchIncomingOrders}
            className="bg-white border border-slate-200 text-navy px-4 py-2 rounded-2xl text-sm font-medium hover:border-deep-blue transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-2 h-2 bg-teal rounded-full animate-pulse"></div>
        <p className="text-sm text-teal font-medium">
          Auto-refresh setiap 30 detik — Pesanan dari Admin Pusat akan muncul otomatis
        </p>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-slate-400 text-sm">Tidak ada pesanan masuk dari WhatsApp Hub</p>
          <p className="text-slate-400 text-xs mt-1">Pesanan baru akan muncul di sini saat Admin Pusat mengalokasikan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Order Cards */}
          <div className="space-y-4">
            {orders.map((order) => {
              const isSuccess = assignSuccess?.orderId === order.id_order;
              return (
                <button
                  key={order.id_order}
                  onClick={() => !assignSuccess && setSelectedOrder(selectedOrder?.id_order === order.id_order ? null : order)}
                  disabled={!!assignSuccess}
                  className={`w-full bg-white border rounded-2xl p-5 text-left transition-all ${
                    isSuccess
                      ? 'border-teal-500 shadow-lg ring-2 ring-teal-500/30 bg-teal-50'
                      : selectedOrder?.id_order === order.id_order
                        ? 'border-deep-blue shadow-md ring-2 ring-deep-blue/20'
                        : 'border-slate-200 hover:border-deep-blue'
                  }`}
                >
                  {/* Success Animation Overlay */}
                  {isSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center bg-teal-500/10 rounded-2xl z-10">
                      <div className="bg-teal-500 text-white rounded-full w-16 h-16 flex items-center justify-center animate-bounce">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-400 font-mono">{order.id_order}</p>
                      <h3 className="text-base font-semibold text-navy mt-1">{order.customer_name}</h3>
                    </div>
                    {isSuccess ? (
                      <span className="bg-teal-100 text-teal-700 text-xs font-medium px-2 py-1 rounded-full border border-teal-200 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Diproses
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-600 text-xs font-medium px-2 py-1 rounded-full border border-amber-200">
                        Baru
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="font-mono text-xs">{order.customer_whatsapp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs truncate">{order.wilayah || order.alamat_penjemputan}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-base-bg text-slate-600 px-2 py-0.5 rounded-lg text-xs font-medium">
                        {order.service_type}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {order.berat_kg > 0 ? `${order.berat_kg} kg` : '-'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-3">
                    {formatDate(order.tanggal_order)}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selectedOrder && (
            <div className={`rounded-2xl p-6 h-fit sticky top-4 transition-all ${
              assignSuccess?.orderId === selectedOrder.id_order
                ? 'bg-teal-50 border-2 border-teal-500'
                : 'bg-white border border-deep-blue'
            }`}>
              {assignSuccess?.orderId === selectedOrder.id_order ? (
                /* Success State */
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-teal-700 mb-2">Berhasil!</h3>
                  <p className="text-sm text-teal-600 mb-1">
                    Pesanan <span className="font-mono font-semibold">{assignSuccess.orderId}</span>
                  </p>
                  <p className="text-sm text-teal-600">
                    ditugaskan ke <span className="font-semibold">{assignSuccess.courierName}</span>
                  </p>
                </div>
              ) : (
                /* Normal State */
                <>
                  <h3 className="text-base font-bold text-navy mb-4">Detail Pesanan</h3>

                  <div className="space-y-4">
                    <div className="bg-base-bg rounded-2xl p-4">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">ID Pesanan</p>
                      <p className="font-mono text-sm font-medium text-navy">{selectedOrder.id_order}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pelanggan</p>
                        <p className="text-sm font-medium text-navy">{selectedOrder.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">WhatsApp</p>
                        <p className="font-mono text-xs text-navy">{selectedOrder.customer_whatsapp}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Alamat Penjemputan</p>
                      <p className="text-sm text-navy">{selectedOrder.alamat_penjemputan}</p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Layanan</p>
                        <p className="text-sm font-medium text-navy">{selectedOrder.service_type}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Berat</p>
                        <p className="text-sm font-medium text-navy">{selectedOrder.berat_kg > 0 ? `${selectedOrder.berat_kg} kg` : '-'}</p>
                      </div>
                    </div>

                    {/* Google Maps Navigation */}
                    {selectedOrder.google_maps_url && (
                      <a
                        href={selectedOrder.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-deep-blue hover:bg-navy text-white rounded-2xl py-3 text-sm font-medium transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Buka Google Maps
                      </a>
                    )}

                    {/* Courier Assignment */}
                    {couriers.length > 0 && (
                      <div className="pt-4 border-t border-slate-200">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                          Tugaskan ke Kurir
                        </label>
                        <select
                          value={selectedCourier}
                          onChange={(e) => setSelectedCourier(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-deep-blue transition-all"
                        >
                          <option value="">Pilih kurir...</option>
                          {couriers.map((c) => (
                            <option key={c.id_kurir} value={c.id_kurir}>
                              {c.nama_kurir}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleAssignToCourier(selectedOrder)}
                          disabled={!selectedCourier || assigning}
                          className="w-full mt-3 bg-teal hover:bg-teal-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl py-3 text-sm font-medium transition-all flex items-center justify-center gap-2"
                        >
                          {assigning ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Memproses...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Konfirmasi & Tugaskan
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {couriers.length === 0 && (
                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-xs text-slate-400 text-center">
                          Belum ada kurir terdaftar di cabang ini
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

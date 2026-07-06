import { useState, useEffect } from 'react';

interface Courier {
  id_kurir: string;
  nama_kurir: string;
  initials: string;
  status: 'Pickup' | 'Delivery' | 'Idle';
  current_task?: string;
  capacity_percent: number;
  total_tugas?: number;
}

interface Order {
  id_order: string;
  customer_name?: string;
  alamat_penjemputan: string;
  berat_kg?: number;
  status: string;
  google_maps_url?: string;
}

interface Props {
  selectedAdminBranch: string;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

// ==========================================
// COURIER ASSIGNMENT - FR-005 Core Implementation
// Admin can assign orders to couriers and plot
// the daily task sequence manually
// ==========================================
export function CourierAssignment({ selectedAdminBranch, onSuccess, onError }: Props) {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [reordering, setReordering] = useState(false);

  // Mock couriers data for demo
  const MOCK_COURIERS: Courier[] = [
    { id_kurir: 'CR-9921', nama_kurir: 'Agus Maulana', initials: 'AM', status: 'Idle', current_task: undefined, capacity_percent: 0, total_tugas: 0 },
    { id_kurir: 'CR-9925', nama_kurir: 'Siti Putri', initials: 'SP', status: 'Idle', current_task: undefined, capacity_percent: 0, total_tugas: 0 },
    { id_kurir: 'CR-9928', nama_kurir: 'Rizky H.', initials: 'RH', status: 'Idle', current_task: undefined, capacity_percent: 0, total_tugas: 0 },
  ];

  // Mock unassigned orders
  const MOCK_ORDERS: Order[] = [
    { id_order: 'ORD-WA-001', customer_name: 'Budi Santoso', alamat_penjemputan: 'Jl. Kemang Selatan No. 5', berat_kg: 3.5, status: 'Pending' },
    { id_order: 'ORD-WA-002', customer_name: 'Ani Wijaya', alamat_penjemputan: 'Jl. Bangka Raya No. 12', berat_kg: 2.0, status: 'Pending' },
    { id_order: 'ORD-WA-003', customer_name: 'Dedi Kurniawan', alamat_penjemputan: 'Jl. Puri Indah Blok A No. 8', berat_kg: 5.0, status: 'Pending' },
    { id_order: 'ORD-WA-004', customer_name: 'Rina Susanti', alamat_penjemputan: 'Jl. Palmerah Barat No. 15', berat_kg: 4.0, status: 'Pending' },
    { id_order: 'ORD-WA-005', customer_name: 'Eko Prasetyo', alamat_penjemputan: 'Jl. Kebayoran Baru No. 20', berat_kg: 3.0, status: 'Pending' },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch couriers for branch
        const courierRes = await fetch(`/api/couriers/branch/${selectedAdminBranch}`);
        if (courierRes.ok) {
          const courierData = await courierRes.json();
          setCouriers(courierData.couriers.map((c: any) => ({
            id_kurir: c.id_kurir,
            nama_kurir: c.nama_kurir,
            initials: c.nama_kurir.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
            status: c.is_available ? 'Idle' : 'Pickup',
            current_task: undefined,
            capacity_percent: 0,
            total_tugas: 0,
          })));
        } else {
          // Use mock data if API fails
          setCouriers(MOCK_COURIERS);
        }

        // Fetch unassigned orders
        const orderRes = await fetch(`/api/orders/branch/${selectedAdminBranch}/incoming`);
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          setOrders(orderData.orders.map((o: any) => ({
            id_order: o.id_order,
            customer_name: o.customer_name,
            alamat_penjemputan: o.alamat_penjemputan,
            berat_kg: o.berat_kg,
            status: o.status,
            google_maps_url: o.google_maps_url,
          })));
        } else {
          // Use mock data if API fails
          setOrders(MOCK_ORDERS);
        }
      } catch {
        // Use mock data on error
        setCouriers(MOCK_COURIERS);
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedAdminBranch]);

  const handleSelectCourier = (id_kurir: string) => {
    setSelectedCourier(id_kurir);
    setSelectedOrders([]);
  };

  const toggleOrderSelection = (id_order: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id_order)
        ? prev.filter((id) => id !== id_order)
        : [...prev, id_order]
    );
  };

  const handleDragStart = (id_order: string) => {
    setDraggedOrder(id_order);
  };

  const handleDragOver = (e: React.DragEvent, targetOrderId: string) => {
    e.preventDefault();
    if (!draggedOrder || draggedOrder === targetOrderId) return;

    const newOrderList = [...selectedOrders];
    const draggedIndex = newOrderList.indexOf(draggedOrder);
    const targetIndex = newOrderList.indexOf(targetOrderId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      newOrderList.splice(draggedIndex, 1);
      newOrderList.splice(targetIndex, 0, draggedOrder);
      setSelectedOrders(newOrderList);
    }
  };

  const handleAssignAndPlot = async () => {
    if (!selectedCourier || selectedOrders.length === 0) return;

    setAssigning(true);
    try {
      // First, assign each selected order to the courier
      for (const id_order of selectedOrders) {
        const res = await fetch(`/api/orders/${id_order}/assign`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_kurir: selectedCourier,
            assigned_by: 'admin',
          }),
        });

        if (!res.ok) {
          const json = await res.json();
          onError(`Gagal assigning ${id_order}: ${json.error}`);
          return;
        }
      }

      // Then, plot the task sequence
      const reorderRes = await fetch('/api/orders/reorder-tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_kurir: selectedCourier,
          ordered_task_ids: selectedOrders,
        }),
      });

      if (!reorderRes.ok) {
        const json = await reorderRes.json();
        onError(`Gagal plot urutan: ${json.error}`);
        return;
      }

      const courier = couriers.find((c) => c.id_kurir === selectedCourier);
      onSuccess(`Berhasil mengalokasikan ${selectedOrders.length} pesanan ke ${courier?.nama_kurir} dengan urutan yang diplot.`);

      // Reset selection
      setSelectedCourier(null);
      setSelectedOrders([]);

      // Refresh data
      const orderRes = await fetch(`/api/orders/branch/${selectedAdminBranch}/incoming`);
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData.orders.map((o: any) => ({
          id_order: o.id_order,
          customer_name: o.customer_name,
          alamat_penjemputan: o.alamat_penjemputan,
          berat_kg: o.berat_kg,
          status: o.status,
        })));
      } else {
        setOrders([]);
      }
    } catch {
      onError('Tidak dapat terhubung ke server.');
    } finally {
      setAssigning(false);
    }
  };

  const handlePlotSequence = async () => {
    if (!selectedCourier || selectedOrders.length < 2) return;

    setReordering(true);
    try {
      const res = await fetch('/api/orders/reorder-tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_kurir: selectedCourier,
          ordered_task_ids: selectedOrders,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onSuccess(`Urutan tugas berhasil diplot ulang untuk ${json.nama_kurir}.`);
      } else {
        onError(json.error ?? 'Gagal plot urutan.');
      }
    } catch {
      onError('Tidak dapat terhubung ke server.');
    } finally {
      setReordering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-deep-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-navy">Alokasi & Plot Tugas Kurir</h2>
        <p className="text-sm text-slate-500 mt-1">
          Pilih kurir, pilih pesanan, lalu drag-drop untuk mengurutkan rute
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Courier Selection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-navy mb-4">Pilih Kurir</h3>
          <div className="space-y-3">
            {couriers.map((courier) => (
              <button
                key={courier.id_kurir}
                onClick={() => handleSelectCourier(courier.id_kurir)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  selectedCourier === courier.id_kurir
                    ? 'border-deep-blue bg-deep-blue/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  courier.status === 'Idle' ? 'bg-slate-400' : 'bg-deep-blue'
                }`}>
                  {courier.initials}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-navy">{courier.nama_kurir}</p>
                  <p className="text-xs text-slate-500">{courier.id_kurir} • {courier.total_tugas ?? 0} tugas</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  courier.status === 'Idle' ? 'bg-teal-50 text-teal border border-teal-200' :
                  courier.status === 'Pickup' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                  'bg-amber-50 text-amber-600 border border-amber-200'
                }`}>
                  {courier.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Order Selection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-navy mb-4">Pilih Pesanan</h3>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-slate-400">Tidak ada pesanan yang menunggu dialokasikan</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {orders.map((order) => (
                <button
                  key={order.id_order}
                  draggable
                  onDragStart={() => handleDragStart(order.id_order)}
                  onDragOver={(e) => handleDragOver(e, order.id_order)}
                  onClick={() => toggleOrderSelection(order.id_order)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                    selectedOrders.includes(order.id_order)
                      ? 'border-teal bg-teal/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-navy text-sm">{order.id_order}</p>
                    <p className="text-xs text-slate-500">{order.customer_name ?? 'Pelanggan'}</p>
                    <p className="text-xs text-slate-400 truncate">{order.alamat_penjemputan}</p>
                  </div>
                  <div className="text-right">
                    {order.berat_kg && (
                      <span className="text-xs font-medium text-slate-500">{order.berat_kg} kg</span>
                    )}
                    {selectedOrders.indexOf(order.id_order) !== -1 && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal text-white text-xs font-bold">
                        {selectedOrders.indexOf(order.id_order) + 1}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Sequence Preview */}
      {selectedCourier && selectedOrders.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-base font-semibold text-navy mb-4">
            Urutan Plot Tugas — {couriers.find((c) => c.id_kurir === selectedCourier)?.nama_kurir}
          </h3>
          <p className="text-xs text-slate-500 mb-4">Drag-drop untuk mengurutkan. Nomor menunjukkan urutan kunjungan.</p>
          <div className="flex flex-wrap gap-2">
            {selectedOrders.map((orderId, index) => {
              const order = orders.find((o) => o.id_order === orderId);
              return (
                <div
                  key={orderId}
                  draggable
                  onDragStart={() => handleDragStart(orderId)}
                  onDragOver={(e) => handleDragOver(e, orderId)}
                  className="flex items-center gap-2 bg-deep-blue/5 border border-deep-blue/20 rounded-xl px-4 py-2 cursor-grab active:cursor-grabbing"
                >
                  <span className="w-6 h-6 rounded-full bg-deep-blue text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-navy">{orderId}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{order?.alamat_penjemputan}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {selectedCourier && selectedOrders.length > 0 && (
          <button
            onClick={handlePlotSequence}
            disabled={reordering || selectedOrders.length < 2}
            className="px-6 py-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl font-medium text-sm hover:bg-amber-100 transition-all disabled:opacity-50"
          >
            {reordering ? 'Menyimpan Urutan...' : '💾 Simpan Urutan Saja'}
          </button>
        )}
        <button
          onClick={handleAssignAndPlot}
          disabled={!selectedCourier || selectedOrders.length === 0 || assigning}
          className="px-6 py-3 bg-deep-blue text-white rounded-2xl font-medium text-sm hover:bg-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {assigning ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Mengalokasikan...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Alokasikan & Plot Urutan
            </>
          )}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { calculateFinalTotal, estimateItemsCost, PACKING_FEE_FLAT_IDR, JASTIP_FEE_RATE } from '@/lib/pricing';
import { Loader2, Search, RefreshCw, X, Save, Calculator, ExternalLink } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OrderItem = {
  id: string;
  custom_name: string;
  custom_price_idr: number;
  quantity: number;
  custom_image_url: string | null;
  custom_note: string | null;
  product_id: string | null;
};

type Order = {
  id: string;
  order_code: string;
  customer_name: string;
  whatsapp_number: string;
  status: string;
  final_weight_kg: number | null;
  cargo_fee_idr: number | null;
  total_price_idr: number | null;
  tracking_number: string | null;
  created_at: string;
  destination_id: string;
  destinations: {
    name: string;
    cargo_rate_per_kg_idr: number;
  };
};

const STATUS_OPTIONS = ['Pending', 'Dibeli', 'Pack', 'Dikirim', 'Selesai'];

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  // Selected order details
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Edit states for the selected order
  const [editStatus, setEditStatus] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  /* ================================================================ */
  /*  Fetch list                                                       */
  /* ================================================================ */

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    
    let query = supabase
      .from('orders')
      .select('*, destinations(name, cargo_rate_per_kg_idr)')
      .order('created_at', { ascending: false });
      
    if (filterStatus !== 'All') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders((data as unknown) as Order[]);
    }
    setLoading(false);
  }, [filterStatus, supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ================================================================ */
  /*  Select order & fetch items                                       */
  /* ================================================================ */

  async function handleSelect(order: Order) {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditWeight(order.final_weight_kg ? order.final_weight_kg.toString() : '');
    setEditTracking(order.tracking_number || '');
    
    setItemsLoading(true);
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);
      
    if (error) {
      console.error('Error fetching items:', error);
      setOrderItems([]);
    } else {
      setOrderItems(data as OrderItem[]);
    }
    setItemsLoading(false);
  }

  /* ================================================================ */
  /*  Calculate Total                                                  */
  /* ================================================================ */

  async function handleCalculateTotal() {
    if (!selectedOrder) return;
    
    const weight = parseFloat(editWeight);
    if (isNaN(weight) || weight <= 0) {
      alert('Masukkan berat final (kg) yang valid sebelum menghitung total.');
      return;
    }

    const cargoRate = selectedOrder.destinations.cargo_rate_per_kg_idr;
    if (!cargoRate) {
      alert(`Tarif kargo untuk tujuan ${selectedOrder.destinations.name} belum diatur. Silakan atur di menu Pengaturan.`);
      return;
    }

    // 1. Sum items subtotal
    const itemsSubtotalIdr = orderItems.reduce(
      (sum, item) => sum + (item.custom_price_idr * item.quantity), 
      0
    );

    // 2. Calculate using shared pricing logic
    const { cargoFeeIdr, totalPriceIdr } = calculateFinalTotal(
      itemsSubtotalIdr,
      weight,
      cargoRate
    );

    // 3. Save to database
    setSaving(true);
    const { error } = await supabase
      .from('orders')
      .update({
        final_weight_kg: weight,
        cargo_fee_idr: cargoFeeIdr,
        total_price_idr: totalPriceIdr,
      })
      .eq('id', selectedOrder.id);

    if (error) {
      alert(`Gagal menyimpan total: ${error.message}`);
    } else {
      // Update local state
      setSelectedOrder({
        ...selectedOrder,
        final_weight_kg: weight,
        cargo_fee_idr: cargoFeeIdr,
        total_price_idr: totalPriceIdr,
      });
      // Refresh list in background
      fetchOrders();
      alert('Total berhasil dihitung dan disimpan!');
    }
    setSaving(false);
  }

  /* ================================================================ */
  /*  Save Status & Tracking                                           */
  /* ================================================================ */

  async function handleSaveBasicDetails() {
    if (!selectedOrder) return;
    setSaving(true);

    const { error } = await supabase
      .from('orders')
      .update({
        status: editStatus,
        tracking_number: editTracking.trim() || null,
      })
      .eq('id', selectedOrder.id);

    if (error) {
      alert(`Gagal menyimpan data: ${error.message}`);
    } else {
      setSelectedOrder({
        ...selectedOrder,
        status: editStatus,
        tracking_number: editTracking.trim() || null,
      });
      fetchOrders();
    }
    setSaving(false);
  }

  /* ================================================================ */
  /*  Helpers                                                          */
  /* ================================================================ */

  const fmtIdr = (n: number) => `Rp ${n.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
  
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /* ================================================================ */
  /*  Render List                                                      */
  /* ================================================================ */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: List */}
      <div className="lg:col-span-2 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              filterStatus === 'All' ? 'bg-primary text-white font-medium' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Semua
          </button>
          {STATUS_OPTIONS.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                filterStatus === status ? 'bg-primary text-white font-medium' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin h-6 w-6 text-gray-400" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tidak ada pesanan ditemukan.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map(order => (
                <div 
                  key={order.id}
                  onClick={() => handleSelect(order)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedOrder?.id === order.id ? 'bg-primary/5' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{order.order_code}</h3>
                      <p className="text-sm text-gray-600">{order.customer_name} • {order.destinations.name}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{formatDate(order.created_at)}</span>
                    {order.total_price_idr ? (
                      <span className="font-semibold text-primary">{fmtIdr(order.total_price_idr)}</span>
                    ) : (
                      <span>Belum dihitung</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Detail */}
      <div className="lg:col-span-1">
        {selectedOrder ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Detail Pesanan</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
              
              {/* Info Header */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Kode</p>
                <p className="font-mono text-lg font-bold">{selectedOrder.order_code}</p>
                <div className="mt-2 text-sm grid grid-cols-2 gap-y-2">
                  <div className="text-gray-500">Pemesan:</div>
                  <div className="font-medium text-right">{selectedOrder.customer_name}</div>
                  <div className="text-gray-500">WA:</div>
                  <div className="font-medium text-right">
                    <a href={`https://wa.me/${selectedOrder.whatsapp_number}`} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center justify-end gap-1">
                      {selectedOrder.whatsapp_number} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-gray-500">Tujuan:</div>
                  <div className="font-medium text-right">{selectedOrder.destinations.name}</div>
                </div>
              </div>

              <hr />

              {/* Items */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Daftar Barang</h4>
                {itemsLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="animate-spin h-5 w-5 text-gray-400" /></div>
                ) : (
                  <ul className="space-y-3">
                    {orderItems.map(item => (
                      <li key={item.id} className="flex gap-3 text-sm">
                        <div className="h-12 w-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                          {item.custom_image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.custom_image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.custom_name}</p>
                          <p className="text-gray-500">{fmtIdr(item.custom_price_idr)} × {item.quantity}</p>
                          {item.custom_note && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.custom_note}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <hr />

              {/* Status & Tracking Edit */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Update Status</h4>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status Pesanan</label>
                  <select 
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:border-primary"
                  >
                    {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nomor Resi (opsional)</label>
                  <input 
                    type="text"
                    value={editTracking}
                    onChange={e => setEditTracking(e.target.value)}
                    placeholder="Contoh: RESI12345"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:border-primary uppercase font-mono"
                  />
                </div>

                <button 
                  onClick={handleSaveBasicDetails}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-md text-sm transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                  Simpan Status & Resi
                </button>
              </div>

              <hr />

              {/* Calculation */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Hitung Total</h4>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Berat Final (kg)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={editWeight}
                      onChange={e => setEditWeight(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:border-primary"
                    />
                    <button 
                      onClick={handleCalculateTotal}
                      disabled={saving || !editWeight || itemsLoading}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-4 rounded-md text-sm transition-colors disabled:opacity-50"
                    >
                      <Calculator className="h-4 w-4" />
                      Hitung
                    </button>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                {selectedOrder.total_price_idr !== null && (
                  <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-xs space-y-1.5 mt-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Harga Barang (Total)</span>
                      <span>
                        {fmtIdr(
                          // Back-calculate subtotal for display
                          (selectedOrder.total_price_idr - selectedOrder.cargo_fee_idr! - PACKING_FEE_FLAT_IDR) / (1 + JASTIP_FEE_RATE)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Jasa Titip ({(JASTIP_FEE_RATE * 100).toFixed(0)}%)</span>
                      <span>
                        {fmtIdr(
                          ((selectedOrder.total_price_idr - selectedOrder.cargo_fee_idr! - PACKING_FEE_FLAT_IDR) / (1 + JASTIP_FEE_RATE)) * JASTIP_FEE_RATE
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Packing (Flat)</span>
                      <span>{fmtIdr(PACKING_FEE_FLAT_IDR)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Kargo ({selectedOrder.final_weight_kg}kg)</span>
                      <span>{fmtIdr(selectedOrder.cargo_fee_idr!)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-amber-200/50 mt-1.5">
                      <span>Grand Total</span>
                      <span className="text-primary">{fmtIdr(selectedOrder.total_price_idr)}</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center h-64 text-gray-400 text-sm">
            Pilih pesanan untuk melihat detail
          </div>
        )}
      </div>

    </div>
  );
}

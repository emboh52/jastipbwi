'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2, Search, PackageSearch } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OrderResult = {
  order_code: string;
  status: string;
  tracking_number: string | null;
  final_weight_kg: number | null;
  total_price_idr: number | null;
  created_at: string;
  updated_at: string;
};

/* ------------------------------------------------------------------ */
/*  Status stages                                                      */
/* ------------------------------------------------------------------ */

const STATUS_STAGES = [
  { key: 'Pending', label: 'Pending', icon: '📋' },
  { key: 'Dibeli', label: 'Dibeli', icon: '🛒' },
  { key: 'Pack', label: 'Di-vacuum / Pack', icon: '📦' },
  { key: 'Dikirim', label: 'Dikirim (Kargo)', icon: '🚢' },
  { key: 'Selesai', label: 'Selesai', icon: '✅' },
];

function getStageIndex(status: string): number {
  const idx = STATUS_STAGES.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

/* ------------------------------------------------------------------ */
/*  Date formatter                                                     */
/* ------------------------------------------------------------------ */

function formatDateId(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

/** Format as IDR. */
function fmtIdr(n: number): string {
  return `Rp ${n.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TrackingLookup() {
  const searchParams = useSearchParams();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rpcError, setRpcError] = useState('');
  const [searched, setSearched] = useState(false);

  /* ================================================================ */
  /*  Lookup function                                                  */
  /* ================================================================ */

  const doLookup = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setOrder(null);
    setNotFound(false);
    setRpcError('');
    setSearched(true);

    const { data, error } = await supabase.rpc('get_order_by_lookup', {
      p_lookup: trimmed,
    });

    if (error) {
      console.error('Tracking RPC error', error);
      setRpcError(
        'Terjadi kesalahan saat mencari pesanan. Silakan coba lagi dalam beberapa saat.'
      );
      setLoading(false);
      return;
    }

    // RPC returns a table (array), take first row
    const row = Array.isArray(data) ? data[0] : null;
    if (!row) {
      setNotFound(true);
    } else {
      setOrder(row as OrderResult);
    }

    setLoading(false);
  }, []);

  /* ================================================================ */
  /*  Auto-lookup from ?code= query param                              */
  /* ================================================================ */

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setInput(code);
      doLookup(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* ================================================================ */
  /*  Form submit                                                      */
  /* ================================================================ */

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    doLookup(input);
  }

  /* ================================================================ */
  /*  Current stage index                                              */
  /* ================================================================ */

  const currentStage = order ? getStageIndex(order.status) : -1;

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="space-y-6">
      {/* -------- Search form -------- */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Kode pesanan atau nomor WA"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-primary text-white font-semibold px-6 py-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            'Cari'
          )}
        </button>
      </form>

      {/* -------- Loading -------- */}
      {loading && (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin h-6 w-6 mr-2" />
          <span>Mencari pesanan…</span>
        </div>
      )}

      {/* -------- RPC Error -------- */}
      {rpcError && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          ⚠️ {rpcError}
        </div>
      )}

      {/* -------- Not found -------- */}
      {notFound && !loading && (
        <div className="text-center py-10 space-y-3">
          <PackageSearch className="h-12 w-12 mx-auto text-gray-300" />
          <p className="text-gray-600">
            Pesanan tidak ditemukan. Periksa kembali kode pesanan atau nomor
            WhatsApp Anda.
          </p>
        </div>
      )}

      {/* -------- Result -------- */}
      {order && !loading && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-primary text-lg">
                {order.order_code}
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                {order.status}
              </span>
            </div>
          </div>

          {/* Status tracker */}
          <div className="px-4 py-5">
            <div className="relative">
              {STATUS_STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentStage;
                const isCurrent = idx === currentStage;
                const isLast = idx === STATUS_STAGES.length - 1;

                return (
                  <div key={stage.key} className="flex items-start gap-3 relative">
                    {/* Vertical line */}
                    {!isLast && (
                      <div
                        className={`absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-6px)] ${
                          idx < currentStage ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    {/* Circle / icon */}
                    <div
                      className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isCurrent
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : isCompleted
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {stage.icon}
                    </div>

                    {/* Label */}
                    <div className={`pb-6 ${isCurrent ? 'pt-0.5' : 'pt-1'}`}>
                      <p
                        className={`text-sm ${
                          isCurrent
                            ? 'font-bold text-primary'
                            : isCompleted
                            ? 'font-medium text-gray-700'
                            : 'text-gray-400'
                        }`}
                      >
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Status saat ini
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="border-t border-gray-200 px-4 py-4 space-y-3">
            {/* Order code */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Kode Pesanan</span>
              <span className="font-mono font-semibold">{order.order_code}</span>
            </div>

            {/* Created date */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tanggal Dibuat</span>
              <span className="text-right">{formatDateId(order.created_at)}</span>
            </div>

            {/* Tracking number / resi */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Nomor Resi</span>
              {order.tracking_number ? (
                <span className="font-mono font-semibold text-primary">
                  {order.tracking_number}
                </span>
              ) : (
                <span className="text-gray-400 italic">
                  Belum tersedia
                </span>
              )}
            </div>

            {/* Weight */}
            {order.final_weight_kg !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Berat Final</span>
                <span>{order.final_weight_kg} kg</span>
              </div>
            )}

            {/* Total price */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Biaya</span>
              {order.total_price_idr !== null ? (
                <span className="font-bold text-primary">
                  {fmtIdr(order.total_price_idr)}
                </span>
              ) : (
                <span className="text-gray-400 italic">
                  Belum dihitung — menunggu proses admin
                </span>
              )}
            </div>

            {/* Last updated */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Terakhir Diperbarui</span>
              <span className="text-right text-xs">
                {formatDateId(order.updated_at)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* -------- Hint (only when no search has been done yet) -------- */}
      {!searched && !loading && (
        <div className="text-center py-10 space-y-2">
          <PackageSearch className="h-12 w-12 mx-auto text-gray-300" />
          <p className="text-sm text-gray-500">
            Masukkan kode pesanan (contoh: JST-20260831-ABC123) atau nomor
            WhatsApp untuk melacak pesanan Anda.
          </p>
        </div>
      )}
    </div>
  );
}

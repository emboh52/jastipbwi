'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client'; // Menggunakan singleton instance
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExchangeRate {
  id?: string;
  currency_code: string;
  rate_to_idr: number;
  updated_at: string;
}

export default function ExchangeRatesManager() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ambil data kurs dari Supabase
  const fetchRates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('currency_code', { ascending: true });

    if (error) {
      setStatus({ type: 'error', text: `Gagal memuat data kurs: ${error.message}` });
    } else if (data) {
      setRates(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Memanggil API Route /api/sync-rates untuk pembaruan kurs online real-time
  const handleSyncOnline = async () => {
    setSyncing(true);
    setStatus(null);
    try {
      const res = await fetch('/api/sync-rates');
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal menyinkronkan kurs');
      }

      setStatus({ type: 'success', text: 'Berhasil memperbarui kurs online dari internet!' });
      await fetchRates(); // Refresh tabel setelah sync selesai
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat sync';
      setStatus({ type: 'error', text: errorMsg });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Pengaturan Kurs Mata Uang</h2>
          <p className="text-sm text-gray-500">
            Nilai konversi mata uang negara target PMI terhadap Rupiah (IDR).
          </p>
        </div>
        <button
          onClick={handleSyncOnline}
          disabled={syncing}
          className="inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Menyinkronkan...' : 'Sync Kurs Online'}
        </button>
      </div>

      {status && (
        <div
          className={`p-4 rounded-lg mb-6 text-sm flex items-center gap-3 ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{status.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-sm text-gray-500">Memuat data kurs...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 border-collapse">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Kode Mata Uang</th>
                <th className="py-3 px-4">Nilai Konversi (1 Unit ke IDR)</th>
                <th className="py-3 px-4">Terakhir Diperbarui</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rates.map((rate) => (
                <tr key={rate.currency_code} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-bold text-gray-900">{rate.currency_code}</td>
                  <td className="py-3 px-4 font-medium text-emerald-800">
                    1 {rate.currency_code} = Rp{' '}
                    {Number(rate.rate_to_idr).toLocaleString('id-ID', {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400">
                    {rate.updated_at ? new Date(rate.updated_at).toLocaleString('id-ID') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
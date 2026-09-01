import type { Metadata } from 'next';
import { Suspense } from 'react';
import TrackingLookup from '@/components/tracking/TrackingLookup';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lacak Pesanan — JastipBwi',
  description:
    'Cek status pesanan titip belanja Banyuwangi ke luar negeri.',
};

function TrackingFallback() {
  return (
    <div className="flex items-center justify-center py-20 text-gray-500">
      <Loader2 className="animate-spin h-6 w-6 mr-2" />
      <span>Memuat halaman…</span>
    </div>
  );
}

export default function LacakPage() {
  return (
    <section className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-2">
        🔍 Lacak Pesanan
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Masukkan kode pesanan atau nomor WhatsApp untuk melihat status
        pesanan Anda.
      </p>
      <Suspense fallback={<TrackingFallback />}>
        <TrackingLookup />
      </Suspense>
    </section>
  );
}

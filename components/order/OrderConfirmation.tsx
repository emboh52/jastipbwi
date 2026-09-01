'use client';

import Link from 'next/link';

type OrderConfirmationProps = {
  orderCode: string;
  customerName: string;
};

export default function OrderConfirmation({
  orderCode,
  customerName,
}: OrderConfirmationProps) {
  return (
    <div className="rounded-lg bg-green-50 border border-green-200 px-6 py-8 text-center space-y-4">
      <div className="text-4xl">✅</div>

      <h2 className="text-xl font-bold text-green-800">
        Pesanan Berhasil Dikirim!
      </h2>

      <p className="text-sm text-gray-600">
        Terima kasih, <strong>{customerName}</strong>. Pesanan kamu sudah
        tercatat. Simpan kode ini untuk melacak pesanan:
      </p>

      <div className="inline-block bg-white border-2 border-green-300 rounded-lg px-6 py-3">
        <span className="text-2xl font-mono font-bold text-primary tracking-wider">
          {orderCode}
        </span>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          href={`/lacak?code=${encodeURIComponent(orderCode)}`}
          className="block w-full rounded-lg bg-primary text-white font-semibold py-3 text-center hover:opacity-90 transition-opacity"
        >
          🔍 Lacak Pesanan
        </Link>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="block w-full rounded-lg border border-gray-300 text-gray-700 font-medium py-3 text-center hover:bg-gray-50 transition-colors"
        >
          📝 Buat Pesanan Baru
        </button>
      </div>

      <p className="text-xs text-gray-400 pt-2">
        Jika WhatsApp tidak terbuka otomatis, silakan hubungi admin secara
        manual dan sebutkan kode pesanan di atas.
      </p>
    </div>
  );
}

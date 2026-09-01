import type { Metadata } from 'next';
import OrdersList from '@/components/admin/OrdersList';

export const metadata: Metadata = {
  title: 'Manajemen Pesanan — Admin JastipBwi',
};

export default function AdminOrdersPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📦 Daftar Pesanan</h1>
        <p className="text-sm text-gray-600">
          Kelola status pesanan, input resi, dan hitung total biaya.
        </p>
      </div>

      <OrdersList />
    </div>
  );
}

import type { Metadata } from 'next';
import SettingsTabs from '@/components/admin/SettingsTabs';

export const metadata: Metadata = {
  title: 'Pengaturan — Admin JastipBwi',
};

export default function AdminSettingsPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">⚙️ Pengaturan</h1>
        <p className="text-sm text-gray-600">
          Kelola kurs mata uang, tujuan pengiriman & tarif kargo, serta katalog produk.
        </p>
      </div>

      <SettingsTabs />
    </div>
  );
}

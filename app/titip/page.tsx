import type { Metadata } from 'next';
import OrderForm from '@/components/order/OrderForm';

export const metadata: Metadata = {
  title: 'Titip Belanja — JastipBwi',
  description:
    'Isi form titip belanja untuk dikirim dari Banyuwangi ke HK, TW, SG, MY.',
};

export default function TitipPage() {
  return (
    <section className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-2">
        📝 Form Titip Belanja
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Isi form di bawah, lalu klik <strong>Kirim Pesanan</strong>. Anda akan
        diarahkan ke WhatsApp untuk konfirmasi langsung.
      </p>
      <OrderForm />
    </section>
  );
}

'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';

/**
 * Sticky bottom bar shown on the catalog page when the cart has items.
 * Links to /titip where the user completes their order.
 */
export default function FloatingCartBar() {
  const { items } = useCartStore();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto">
        <Link
          href="/titip"
          className="flex items-center justify-between w-full rounded-xl bg-primary text-white px-5 py-4 shadow-lg hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-accent text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <span className="font-semibold">
              {totalItems} item di titipan
            </span>
          </div>
          <span className="text-sm font-medium">
            Lihat Titipan →
          </span>
        </Link>
      </div>
    </div>
  );
}

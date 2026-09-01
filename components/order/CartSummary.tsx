'use client';

import Link from 'next/link';
import { useCartStore, type CartItem } from '@/store/cart';
import { Plus, Minus, X } from 'lucide-react';

/** Format a number as IDR. */
const fmtIdr = (n: number) =>
  `Rp ${n.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;

/**
 * Cart summary shown at the top of the /titip order form.
 * Allows editing quantity or removing items before submitting.
 */
export default function CartSummary() {
  const { items, incrementItem, decrementItem, removeItem } = useCartStore();

  if (items.length === 0) return null;

  const subtotal = items.reduce((sum, i) => sum + i.priceIdr * i.quantity, 0);

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-primary">
          🛒 Produk dari Katalog
        </h3>
        <Link
          href="/katalog"
          className="text-xs text-primary underline"
        >
          + Tambah lagi
        </Link>
      </div>

      <ul className="space-y-2">
        {items.map((item: CartItem) => (
          <li
            key={item.productId}
            className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 shadow-sm"
          >
            {/* Thumbnail */}
            <div className="h-10 w-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">
                  📦
                </div>
              )}
            </div>

            {/* Name & price */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-gray-500">
                {fmtIdr(item.priceIdr)} × {item.quantity} ={' '}
                {fmtIdr(item.priceIdr * item.quantity)}
              </p>
            </div>

            {/* Quantity stepper */}
            <div className="flex items-center bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => decrementItem(item.productId)}
                className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                aria-label="Kurangi"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-sm font-bold tabular-nums px-2">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => incrementItem(item.productId)}
                className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                aria-label="Tambah"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="p-1 text-red-400 hover:text-red-600 transition-colors"
              aria-label="Hapus"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-sm font-semibold pt-1 border-t border-primary/10">
        <span>Subtotal katalog</span>
        <span>{fmtIdr(subtotal)}</span>
      </div>
    </div>
  );
}

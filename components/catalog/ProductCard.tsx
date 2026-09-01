'use client';

import { useCartStore } from '@/store/cart';
import useCurrencyStore from '@/store/currency';
import { Plus, Minus, Package } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  price_idr: number;
  image_url: string | null;
  description?: string | null;
};

type ProductCardProps = {
  product: Product;
  onSelect?: (product: Product) => void; // Opsional: untuk membuka modal detail jika diklik
};

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  // 1. Menggunakan formatPrice dari Zustand Currency Store
  const formatPrice = useCurrencyStore((state) => state.formatPrice);
  
  // 2. Akses state Keranjang/Titipan
  const { items, addItem, incrementItem, decrementItem } = useCartStore();

  const inCart = items.find((i) => i.productId === product.id);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group">
      
      {/* Visual / Gambar Produk */}
      <div
        onClick={() => onSelect?.(product)}
        className="aspect-square bg-[#EFE6D0]/40 relative overflow-hidden cursor-pointer flex items-center justify-center border-b border-gray-100"
      >
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <Package className="w-10 h-10 text-gray-400 opacity-60" />
        )}
      </div>

      {/* Informasi Produk */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div onClick={() => onSelect?.(product)} className="cursor-pointer">
          <h3 className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2 mb-1 group-hover:text-emerald-800 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Format Harga Konversi Otomatis */}
        <p className="text-emerald-800 font-bold text-sm mt-2">
          {formatPrice(product.price_idr)}
        </p>
      </div>

      {/* Kontrol Tambah ke Titipan / Stepper Quantity */}
      <div className="px-3 pb-3">
        {inCart ? (
          <div className="flex items-center justify-between bg-emerald-50 rounded-lg border border-emerald-200">
            <button
              type="button"
              onClick={() => decrementItem(product.id)}
              className="p-2 text-emerald-800 hover:bg-emerald-100 rounded-l-lg transition-colors"
              aria-label="Kurangi"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-bold text-emerald-950 text-sm tabular-nums px-2">
              {inCart.quantity}
            </span>
            <button
              type="button"
              onClick={() => incrementItem(product.id)}
              className="p-2 text-emerald-800 hover:bg-emerald-100 rounded-r-lg transition-colors"
              aria-label="Tambah"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                priceIdr: product.price_idr,
                imageUrl: product.image_url,
              })
            }
            className="w-full rounded-lg bg-emerald-800 text-white font-semibold py-2.5 text-sm hover:bg-emerald-900 transition-colors shadow-xs"
          >
            + Tambah ke Titipan
          </button>
        )}
      </div>
    </div>
  );
}
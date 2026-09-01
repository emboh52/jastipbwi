'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import useCurrencyStore from '@/store/currency';
import ProductCard from '@/components/catalog/ProductCard';
import FloatingCartBar from '@/components/catalog/FloatingCartBar';
import { Loader2, RefreshCw, PackageOpen } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  price_idr: number;
  image_url: string | null;
};

type ExchangeRate = {
  currency_code: string;
  rate_to_idr: number;
};

export default function CatalogGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rates, setRates] = useState<ExchangeRate[]>([]);

  const { currency } = useCurrencyStore();

  /* ---- fetch products ---- */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    const { data, error: err } = await supabase
      .from('products')
      .select('id, name, price_idr, image_url')
      .order('name');
    if (err || !data) {
      console.error('Failed to load products', err);
      setError(true);
    } else {
      setProducts(data);
    }
    setLoading(false);
  }, []);

  /* ---- fetch exchange rates ---- */
  const fetchRates = useCallback(async () => {
    const { data } = await supabase
      .from('exchange_rates')
      .select('currency_code, rate_to_idr');
    if (data) setRates(data);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- current rate for price conversion ---- */
  const currentRate = useMemo(() => {
    if (currency === 'IDR') return null;
    return rates.find((r) => r.currency_code === currency) ?? null;
  }, [currency, rates]);

  /* ---- loading state ---- */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin h-6 w-6 mr-2" />
        <span>Memuat produk…</span>
      </div>
    );
  }

  /* ---- error state ---- */
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-3">Gagal memuat katalog produk.</p>
        <button
          onClick={fetchProducts}
          className="inline-flex items-center gap-2 text-primary underline text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Coba lagi
        </button>
      </div>
    );
  }

  /* ---- empty state ---- */
  if (products.length === 0) {
    return (
      <div className="text-center py-20 space-y-3">
        <PackageOpen className="h-12 w-12 mx-auto text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-500">
          Belum ada produk tersedia
        </h2>
        <p className="text-sm text-gray-400">
          Admin belum menambahkan produk ke katalog. Kamu tetap bisa titip
          belanja lewat{' '}
          <a href="/titip" className="text-primary underline">
            form custom
          </a>
          .
        </p>
      </div>
    );
  }

  /* ---- product grid ---- */
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-24">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            rate={currentRate?.rate_to_idr ?? null}
          />
        ))}
      </div>

      {/* Floating cart bar — only visible when cart has items */}
      <FloatingCartBar />
    </>
  );
}

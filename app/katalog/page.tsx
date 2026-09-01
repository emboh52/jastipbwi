'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  MessageSquarePlus,
  Package,
  Truck,
  Search,
  Heart,
  ArrowRight,
  X,
  Plus,
  Check,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import useCurrencyStore from '@/store/currency';
import { useCartStore } from '@/store/cart';

type Product = {
  id: string;
  name: string;
  price_idr: number;
  image_url: string | null;
  description: string | null;
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);

  // Integrasi Multi-Mata Uang (Zustand Store)
  const currencyStore = useCurrencyStore();
  const formatPrice =
    currencyStore?.formatPrice ||
    ((price: number) => `Rp ${price.toLocaleString('id-ID')}`);

  // Cart store untuk langsung tambah dari modal
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price_idr, image_url, description')
        .order('created_at', { ascending: false })
        .limit(4);
      if (!error && data) {
        setFeaturedProducts(data);
      }
    }
    fetchFeatured();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      priceIdr: product.price_idr,
      imageUrl: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800 relative">
      {/* PRODUK FAVORIT */}
      {featuredProducts.length > 0 && (
        <section className="px-4 py-16 bg-[#FAF6EE] border-b border-gray-200/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-primary text-center mb-10">
              Produk Favorit
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-xl border border-gray-200 p-3 shadow-xs hover:shadow-md transition flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="w-full aspect-square bg-[#EFE6D0] rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400 opacity-60" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-primary line-clamp-2">
                      {product.name}
                    </p>
                  </div>
                  {/* Harga otomatis berubah sesuai kurs aktif */}
                  <p className="text-xs font-bold text-accent mt-2">
                    {formatPrice(product.price_idr)}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline text-sm"
              >
                Lihat semua produk <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-[#EFE6D0] via-[#FAF6EE] to-[#FDFBF7] px-4 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-3">
            Titip Belanja Banyuwangi ke Luar Negeri
          </h1>
          <p className="text-sm md:text-base text-gray-700 mb-6">
            Kirim oleh-oleh, kuliner, dan kebutuhan harian — mudah, cepat, terpercaya.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link
              href="/titip"
              className="w-full sm:w-auto bg-accent hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-opacity text-center shadow-sm"
            >
              Titip Barang Custom
            </Link>
          </div>
        </div>
      </section>

      {/* MODAL DETAIL PRODUK */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close Modal */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 shadow-sm transition"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>

            {/* Foto Produk */}
            <div className="w-full h-64 bg-[#EFE6D0] relative flex items-center justify-center overflow-hidden">
              {selectedProduct.image_url ? (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-16 h-16 text-gray-400 opacity-50" />
              )}
            </div>

            {/* Rincian Produk & Deskripsi */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-emerald-950 leading-snug">
                  {selectedProduct.name}
                </h3>
                <p className="text-lg font-bold text-emerald-800 mt-1">
                  {formatPrice(selectedProduct.price_idr)}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Deskripsi Produk
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedProduct.description || 'Belum ada deskripsi detail untuk produk ini.'}
                </p>
              </div>

              {/* Tombol Action Tambah ke Keranjang */}
              <div className="pt-2">
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition ${
                    added
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} /> Berhasil Ditambahkan!
                    </>
                  ) : (
                    <>
                      <Plus size={18} /> + Tambah ke Titipan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client'; // Menggunakan singleton client
import { Loader2, Plus, Trash2, Upload, Package } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_idr: number;
  image_url: string | null;
};

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form input state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch daftar produk dari database
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error.message);
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle preview foto produk
  function handleImageChange(file: File | null) {
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  // Handle tambah produk baru
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    setSaving(true);
    let imageUrl: string | null = null;

    try {
      // 1. Upload foto ke Supabase Storage (bucket: order-images)
      if (imageFile) {
        const ext = imageFile.name.split('.').pop() ?? 'jpg';
        const path = `catalog/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('order-images')
          .upload(path, imageFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(`Upload gagal: ${uploadError.message}`);

        const { data } = supabase.storage.from('order-images').getPublicUrl(path);
        imageUrl = data.publicUrl;
      }

      // 2. Insert data ke tabel products
      const { error } = await supabase.from('products').insert({
        id: crypto.randomUUID(),
        name: newName.trim(),
        description: newDesc.trim() || null,
        price_idr: parseFloat(newPrice),
        image_url: imageUrl,
      });

      if (error) throw new Error(error.message);

      // Reset form setelah sukses
      setNewName('');
      setNewDesc('');
      setNewPrice('');
      handleImageChange(null);
      await fetchProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  // Handle hapus produk
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus produk "${name}" dari katalog?`)) return;

    setSaving(true);
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert(`Gagal menghapus: ${error.message}`);
    } else {
      await fetchProducts();
    }
    setSaving(false);
  }

  const fmtIdr = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  if (loading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="animate-spin h-6 w-6 mx-auto text-emerald-800" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* DAFTAR PRODUK KATALOG */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Katalog Produk</h3>

        {products.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center h-32 text-gray-500 text-sm">
            Katalog masih kosong. Tambahkan produk di bawah.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-xl p-3 flex gap-3 bg-white shadow-sm hover:shadow-md transition">
                <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h4>
                  <p className="text-emerald-800 font-bold text-sm mt-0.5">{fmtIdr(p.price_idr)}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description || '-'}</p>
                  <div className="mt-auto pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={saving}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FORM TAMBAH PRODUK */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Tambah Produk Baru</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nama Produk</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Contoh: Kopi Osing Banjar 250g"
                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Harga (IDR)</label>
              <input
                type="number"
                required
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Contoh: 35000"
                className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Deskripsi Singkat (opsional)</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Contoh: Kopi bubuk asli robusta kemasan vacuum"
              className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Foto Produk</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 bg-white border border-gray-300 hover:border-emerald-700 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors shadow-sm">
                <Upload className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 text-xs font-medium">Pilih foto...</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                />
              </label>
              {imageFile && <span className="text-xs text-gray-500 truncate max-w-[200px]">{imageFile.name}</span>}
              {imagePreview && (
                <div className="h-10 w-10 border border-gray-200 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving || !newName.trim() || !newPrice}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
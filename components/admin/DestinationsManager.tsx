'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { Loader2, Plus, Trash2 } from 'lucide-react';

type Destination = {
  id: string;
  name: string;
  iso_country_code: string;
  cargo_rate_per_kg_idr: number;
};

export default function DestinationsManager() {
  const [dests, setDests] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New item state
  const [newName, setNewName] = useState('');
  const [newIso, setNewIso] = useState('');
  const [newRate, setNewRate] = useState('');

  const supabase = createClient();

  const fetchDests = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('destinations').select('*').order('name');
    if (data) setDests(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchDests();
  }, [fetchDests]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newIso.trim() || !newRate) return;
    
    setSaving(true);
    const { error } = await supabase.from('destinations').insert({
      id: crypto.randomUUID(),
      name: newName.trim(),
      iso_country_code: newIso.trim().toUpperCase(),
      cargo_rate_per_kg_idr: parseFloat(newRate),
    });

    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      setNewName('');
      setNewIso('');
      setNewRate('');
      fetchDests();
    }
    setSaving(false);
  }

  async function handleUpdateRate(id: string, newRateVal: string) {
    const num = parseFloat(newRateVal);
    if (isNaN(num) || num < 0) return;

    setSaving(true);
    const { error } = await supabase
      .from('destinations')
      .update({ cargo_rate_per_kg_idr: num })
      .eq('id', id);

    if (error) alert(`Error: ${error.message}`);
    else fetchDests();
    
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus tujuan ${name}? Pastikan tidak ada pesanan aktif ke tujuan ini.`)) return;
    
    setSaving(true);
    const { error } = await supabase.from('destinations').delete().eq('id', id);
    
    if (error) alert(`Gagal menghapus (mungkin masih digunakan pesanan): ${error.message}`);
    else fetchDests();
    
    setSaving(false);
  }

  if (loading) return <div className="py-8 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-400" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daftar Tujuan & Tarif Kargo</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tujuan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarif Kargo / Kg (Rp)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500 text-sm">Belum ada tujuan pengiriman.</td>
                </tr>
              ) : dests.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {d.name} <span className="text-gray-400 text-xs ml-1">({d.iso_country_code})</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input 
                      type="number" 
                      defaultValue={d.cargo_rate_per_kg_idr}
                      onBlur={(e) => {
                        if (parseFloat(e.target.value) !== d.cargo_rate_per_kg_idr) {
                          handleUpdateRate(d.id, e.target.value);
                        }
                      }}
                      className="border-b border-gray-300 focus:border-primary focus:outline-none w-32 text-sm px-1 py-0.5"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button onClick={() => handleDelete(d.id, d.name)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Tambah Tujuan Baru</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-[2] w-full">
            <label className="block text-xs text-gray-500 mb-1">Nama Negara/Area (Contoh: Taiwan)</label>
            <input 
              type="text" 
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:border-primary" 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-500 mb-1">Kode ISO (Contoh: TW)</label>
            <input 
              type="text" 
              required
              maxLength={2}
              value={newIso}
              onChange={e => setNewIso(e.target.value.toUpperCase())}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:border-primary" 
            />
          </div>
          <div className="flex-[2] w-full">
            <label className="block text-xs text-gray-500 mb-1">Tarif Kargo per Kg (Rp)</label>
            <input 
              type="number" 
              required
              min="0"
              value={newRate}
              onChange={e => setNewRate(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:border-primary" 
            />
          </div>
          <button 
            type="submit"
            disabled={saving || !newName || !newIso || !newRate}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
            Tambah
          </button>
        </form>
      </div>
    </div>
  );
}

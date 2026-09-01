import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // 1. Ambil data dari API Kurs Gratis
    const res = await fetch('https://open.er-api.com/v6/latest/IDR', {
      next: { revalidate: 3600 } // Cache API selama 1 jam
    });
    const data = await res.json();

    if (!data || !data.rates) {
      return NextResponse.json({ error: 'Gagal mengambil data dari API' }, { status: 500 });
    }

    const rates = data.rates;
    const targetCodes = ['HKD', 'TWD', 'SGD', 'MYR'];

    // 2. Format data kurs ke IDR (Contoh: 1 HKD = ... IDR)
    const upsertData = targetCodes.map((code) => ({
      currency_code: code,
      rate_to_idr: 1 / rates[code], // Konversi balik ke Rupiah
      updated_at: new Date().toISOString(),
    }));

    // Tambahkan IDR sebagai base
    upsertData.push({
      currency_code: 'IDR',
      rate_to_idr: 1,
      updated_at: new Date().toISOString(),
    });

    // 3. Simpan / Update ke tabel Supabase
    const { error } = await supabase
      .from('exchange_rates')
      .upsert(upsertData, { onConflict: 'currency_code' });

    if (error) throw error;

    return NextResponse.json({ message: 'Kurs berhasil diperbarui secara online!', data: upsertData });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
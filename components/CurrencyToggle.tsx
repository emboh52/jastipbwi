'use client';

import { useEffect } from 'react';
import useCurrencyStore from '@/store/currency';
import { supabase } from '@/lib/supabase/client';

export default function CurrencyToggle() {
  const currency = useCurrencyStore((state) => state.currency);
  const currencies = useCurrencyStore((state) => state.currencies);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const setCurrencies = useCurrencyStore((state) => state.setCurrencies);
  const setRates = useCurrencyStore((state) => state.setRates);

  useEffect(() => {
    async function fetchRates() {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('currency_code, rate_to_idr');

      if (!error && data) {
        // 1. Simpan data kurs ke Zustand
        setRates(data);

        // 2. Ambil daftar mata uang yang tersedia
        const codeList = Array.from(
          new Set(['IDR', ...data.map((item) => item.currency_code)])
        );
        
        // Panggil setCurrencies jika fungsi tersedia
        if (typeof setCurrencies === 'function') {
          setCurrencies(codeList);
        }
      }
    }

    fetchRates();
  }, [setCurrencies, setRates]);

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-800 cursor-pointer"
    >
      {(currencies && currencies.length > 0 ? currencies : ['IDR', 'HKD', 'TWD', 'SGD', 'MYR']).map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
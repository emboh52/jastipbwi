'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useCurrencyStore } from '@/store/currency';

export default function CurrencyInitializer() {
  const setRates = useCurrencyStore((state) => state.setRates);

  useEffect(() => {
    async function fetchRates() {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('currency_code, rate_to_idr');

      if (!error && data) {
        setRates(data);
      }
    }
    fetchRates();
  }, [setRates]);

  return null;
}
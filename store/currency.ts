import { create } from 'zustand';

export type ExchangeRate = {
  currency_code: string;
  rate_to_idr: number;
};

type CurrencyState = {
  currency: string;
  currencies: string[];
  rates: Record<string, number>;
  setCurrency: (c: string) => void;
  setCurrencies: (list: string[]) => void;
  setRates: (ratesData: ExchangeRate[]) => void;
  formatPrice: (priceInIdr: number) => string;
};

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: 'IDR',
  currencies: ['IDR', 'HKD', 'TWD', 'SGD', 'MYR'],
  rates: { IDR: 1 },

  setCurrency: (c) => set({ currency: c }),

  setCurrencies: (list) =>
    set((state) => ({
      currencies: list,
      currency: list.includes(state.currency) ? state.currency : list[0] ?? 'IDR',
    })),

  setRates: (ratesData) => {
    const ratesMap: Record<string, number> = { IDR: 1 };
    ratesData.forEach((item) => {
      ratesMap[item.currency_code] = Number(item.rate_to_idr);
    });
    set({ rates: ratesMap });
  },

  formatPrice: (priceInIdr: number) => {
    const { currency, rates } = get();
    const rate = rates[currency] || 1;
    const converted = priceInIdr / rate;

    switch (currency) {
      case 'HKD':
        return `HK$ ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'TWD':
        return `NT$ ${Math.round(converted).toLocaleString('id-ID')}`;
      case 'SGD':
        return `S$ ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'MYR':
        return `RM ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'IDR':
      default:
        return `Rp ${priceInIdr.toLocaleString('id-ID')}`;
    }
  },
}));

export default useCurrencyStore;
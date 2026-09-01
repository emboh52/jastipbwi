'use client';

import { useState } from 'react';
import ExchangeRatesManager from '@/components/admin/ExchangeRatesManager';
import DestinationsManager from '@/components/admin/DestinationsManager';
import ProductsManager from '@/components/admin/ProductsManager';
import { Coins, Truck, Package } from 'lucide-react';

const TABS = [
  { id: 'rates', label: 'Kurs Mata Uang', icon: Coins },
  { id: 'destinations', label: 'Tujuan & Tarif Kargo', icon: Truck },
  { id: 'products', label: 'Katalog Produk', icon: Package },
];

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="space-y-6">
      {/* Tab Navigasi */}
      <div className="border-b border-gray-200">
        <nav
          className="-mb-px flex space-x-2 md:space-x-4 overflow-x-auto scrollbar-none"
          role="tablist"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  inline-flex items-center gap-2.5 whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-all rounded-t-xl
                  ${
                    isActive
                      ? 'border-emerald-800 text-emerald-950 bg-emerald-50/60 font-semibold shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-800' : 'text-gray-400'
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Tab (Tanpa Double Border Wrapper) */}
      <div className="mt-4 transition-all duration-200">
        {activeTab === 'rates' && <ExchangeRatesManager />}
        {activeTab === 'destinations' && <DestinationsManager />}
        {activeTab === 'products' && <ProductsManager />}
      </div>
    </div>
  );
}
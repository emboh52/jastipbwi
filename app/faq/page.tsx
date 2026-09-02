'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

type FAQItem = {
  category: string;
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    category: 'Pemesanan',
    question: 'Bagaimana cara menitip belanjaan di JastipBwi?',
    answer:
      'Cukup pilih produk di katalog, masukkan ke keranjang, dan ikuti alur pemesanan. Kamu juga bisa menggunakan fitur Custom Order untuk belanjaan di luar katalog.',
  },
  {
    category: 'Pemesanan',
    question: 'Apakah bisa menitip barang di luar katalog (Custom Order)?',
    answer:
      'Bisa! Kami melayani pembelian dari UMKM lokal Banyuwangi, pasar tradisional, hingga marketplace Indonesia seperti Tokopedia & Shopee.',
  },
  {
    category: 'Pengiriman',
    question: 'Apakah makanan basah/sambal aman dan tidak basi?',
    answer:
      'Sangat aman. Makanan basah dan sambal dikemas menggunakan Vacuum Wrap kedap udara steril sehingga tahan 14–30 hari di perjalanan.',
  },
  {
    category: 'Pengiriman',
    question: 'Berapa lama estimasi pengiriman sampai?',
    answer:
      'Hong Kong (3-5 hari), Taiwan (4-6 hari), Singapura (2-4 hari), dan Malaysia (3-5 hari) terhitung sejak tanggal keberangkatan kargo.',
  },
  {
    category: 'Pembayaran',
    question: 'Mata uang apa saja yang bisa digunakan?',
    answer:
      'Website otomatis mendukung konversi mata uang HKD (Hong Kong), TWD (Taiwan), SGD (Singapura), MYR (Malaysia), dan IDR (Indonesia).',
  },
  {
    category: 'Pelacakan',
    question: 'Bagaimana cara melacak pesanan saya?',
    answer:
      'Gunakan menu "Lacak Pesanan" di bagian navigasi atas dan masukkan Kode Pesanan / Nomor Resi kamu untuk melihat update status secara live.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full text-emerald-800 mb-3">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Pertanyaan Sering Diajukan (FAQ)
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Punya pertanyaan seputar pengiriman, pembayaran, atau keamanan barang titipanmu? Temukan jawabannya di bawah ini.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-emerald-800' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-emerald-50/30">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
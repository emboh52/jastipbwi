import './globals.css';

import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CurrencyInitializer from '@/components/CurrencyInitializer';

const inter = Inter({ subsets: ['latin'] });

// Menggunakan domain Vercel / domain utama secara dinamis
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://jastipbwi.vercel.app';

export const viewport: Viewport = {
  themeColor: '#065f46', // Warna hijau tema JastipBwi untuk browser & PWA
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'JastipBwi — Titip Belanja Banyuwangi ke Luar Negeri',
    template: '%s | JastipBwi',
  },
  description:
    'Layanan jastip terpercaya untuk Pekerja Migran Indonesia (PMI). Kirim oleh-oleh khas Banyuwangi, makanan vacuum, dan kebutuhan harian ke Hong Kong, Taiwan, Singapura, & Malaysia.',
  keywords: [
    'Jastip Banyuwangi',
    'Jastip PMI',
    'Kargo Banyuwangi Hong Kong',
    'Oleh-oleh Banyuwangi',
    'Kirim Paket Luar Negeri',
    'Jastip Taiwan Singapore Malaysia',
    'Sambal Tempong Vacuum',
  ],
  authors: [{ name: 'JastipBwi' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'JastipBwi',
  },

  // OPEN GRAPH (Facebook, WhatsApp, Telegram, LinkedIn)
  openGraph: {
    title: 'JastipBwi — Titip Belanja Banyuwangi ke Luar Negeri',
    description:
      'Kirim oleh-oleh, kuliner vacuum, dan barang titipan dari Banyuwangi ke HK, TW, SG, & MY secara aman, transparan, dan cepat.',
    url: SITE_URL,
    siteName: 'JastipBwi',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // Otomatis mengarah ke file public/og-image.png
        width: 1200,
        height: 630,
        alt: 'JastipBwi — Titip Belanja Banyuwangi ke Luar Negeri',
      },
    ],
  },

  // TWITTER / X CARDS
  twitter: {
    card: 'summary_large_image',
    title: 'JastipBwi — Titip Belanja Banyuwangi ke Luar Negeri',
    description:
      'Kirim oleh-oleh dan kebutuhan harian dari Banyuwangi ke HK, TW, SG, & MY.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col antialiased`}
      >
        <CurrencyInitializer />
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
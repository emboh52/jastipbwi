import './globals.css';

import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CurrencyInitializer from '@/components/CurrencyInitializer';

const inter = Inter({ subsets: ['latin'] });

// Pengaturan Viewport & Theme Color PWA
export const viewport = {
  themeColor: '#ffffff', // Sesuaikan dengan warna tema aplikasi Anda
};

export const metadata: Metadata = {
  // Tambahkan baris ini untuk menghilangkan warning metadataBase
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: 'JastipBwi — Titip Belanja Banyuwangi ke Luar Negeri',
  description:
    'JastipBwi membantu Pekerja Migran Indonesia (PMI) mengirim oleh-oleh dan kebutuhan dari Banyuwangi ke HK, TW, SG, MY.',
  
  // Konfigurasi PWA untuk iOS/Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'JastipBwi',
  },

  openGraph: {
    title: 'JastipBwi — Titip Belanja Banyuwangi ke Luar Negeri',
    description:
      'Layanan jastip terpercaya untuk pekerja migran Indonesia di luar negeri.',
    url: 'https://jastipbwi.example.com',
    siteName: 'JastipBwi',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.className}>
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased">
        <CurrencyInitializer />
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
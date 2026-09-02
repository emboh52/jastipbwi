'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import CurrencyToggle from '@/components/CurrencyToggle';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/lacak', label: 'Lacak Pesanan' },
  { href: '/faq', label: 'FAQ' }, // <- Tambahkan link ke /faq di sini
];

const WHATSAPP_NUMBER = '6283834892713';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          JastipBwi
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:underline transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side (Desktop): WhatsApp button and currency toggle */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </a>
          <CurrencyToggle />
        </div>

        {/* Mobile menu toggle button */}
        <button
          className="md:hidden focus:outline-none p-1 rounded-md hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-primary border-t border-white/10 pb-6 pt-2 px-4 space-y-4">
          <ul className="space-y-3 font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 text-lg hover:underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Action buttons on Mobile */}
          <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
            <CurrencyToggle />
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              <MessageCircle size={20} />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center gap-2 text-sm">
        <span className="font-bold text-lg">JastipBwi</span>
        <a
          href="https://wa.me/6283834892713"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline transition-colors text-white/90"
        >
          Hubungi via WhatsApp
        </a>
        <span className="text-white/60 mt-2">
          © {year} JastipBwi. Semua hak dilindungi.
        </span>
      </div>
    </footer>
  );
}

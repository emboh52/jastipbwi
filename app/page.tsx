import { 
  Send, 
  PackageCheck, 
  Truck, 
  ShieldCheck, 
  Tag, 
  HeartHandshake 
} from "lucide-react";

// Data untuk Cara Kerja
const HOW_IT_WORKS = [
  {
    icon: Send,
    title: "1. Kirim Daftar / Link",
    desc: "Kirimkan link e-commerce, foto barang, atau daftar belanjaan yang Anda inginkan.",
  },
  {
    icon: PackageCheck,
    title: "2. Belanja & Packing Vacuum",
    desc: "Kami belikan barangnya di Banyuwangi lalu dikemas steril & kedap udara.",
  },
  {
    icon: Truck,
    title: "3. Kirim ke Tujuan",
    desc: "Barang siap dikirim langsung ke Hong Kong, Taiwan, Singapura, atau Malaysia.",
  },
];

// Data untuk Kenapa Pilih Kami
const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    title: "Aman & Terpercaya",
    desc: "Proses transparan dengan foto belanjaan dan nomor resi pengiriman real-time.",
  },
  {
    icon: Tag,
    title: "Biaya Jasa Murah",
    desc: "Komisi jastip bersaing tanpa biaya tersembunyi untuk PMI.",
  },
  {
    icon: HeartHandshake,
    title: "Khusus Produk Lokal",
    desc: "Mulai dari Kopi Banjar, Bagiak, Sambal Tempong vacuum, hingga belanjaan harian.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7]">
      {/* HERO SECTION */}
      <section className="text-center py-16 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
          JastipBwi
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Titip Belanja Banyuwangi ke Luar Negeri – mudah, cepat, terpercaya.
        </p>
      </section>

      {/* CARA KERJA */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-primary text-center mb-10">
          Cara Kerja
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EFE6D0] text-primary mb-3">
                  <Icon size={22} />
                </div>
                <h3 className="font-medium text-primary mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* KENAPA PILIH KAMI */}
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-primary text-center mb-10">
          Kenapa Pilih JastipBwi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PROPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EFE6D0] text-primary mb-3">
                  <Icon size={18} />
                </div>
                <h3 className="font-medium text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
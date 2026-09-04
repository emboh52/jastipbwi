'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Phone,
  Receipt,
} from 'lucide-react';

// Data 40 Agen & Toko Pengambilan Hong Kong / Macau
const listAgen = [
  { no: 1, wilayah: "CAUSEWAY BAY", nama: "Toko AAN EXPRESS", alamat: "Gedung Causeway Bay Centre L.06 No. 601", kontak: "+852 9587 2081 / +852 5138 0111 / +852 3009 3246" },
  { no: 2, wilayah: "PO LAM", nama: "Toko Java Mart", alamat: "Shop No.6 King Chung House, King Lam Estate (MTR Polam Exit B3)", kontak: "+852 9227 7618 (Cece Yusli)" },
  { no: 3, wilayah: "TSEUNG KWAN O", nama: "Toko Asia", alamat: "The Park Side No. 10 Shop No. B8 1/F Tung Chun St. TKO (MTR Exit A2 Lurus)", kontak: "+852 6636 1557" },
  { no: 4, wilayah: "HANG HAU", nama: "Toko New Blessing Berkat Baru", alamat: "Shop No. EF09A Food Lane G/F Tse Gateway Hau Tak Estate (MTR Hanghau Exit A1)", kontak: "+852 9388 5961" },
  { no: 5, wilayah: "WONG TAI SIN", nama: "Toko Cing Tak", alamat: "Shop 07 Y/F Kai Tak Garden Wong Tai Sin", kontak: "+852 6590 4144" },
  { no: 6, wilayah: "KOWLOON CITY", nama: "Toko Indo Lily", alamat: "Shop No. 10-11 G/F Tai Fung Building 72 Lion Rock Road Kowloon City", kontak: "+852 9863 8502 (Cece Lily)" },
  { no: 7, wilayah: "MA ON SHAN", nama: "Toko Surya", alamat: "Shop M-H005A Heng On Market Heng On Estate Ma On Shan NT (Heng On MTR Exit B)", kontak: "+852 6935 5798" },
  { no: 8, wilayah: "DIAMOND HILL", nama: "KT Mart", alamat: "Fung Tak Estate Market Shop S05 (MTR Diamond Hill Exit A1)", kontak: "+852 6898 2192" },
  { no: 9, wilayah: "WHAMPOA", nama: "Toko Wijaya", alamat: "108 Shopping Center Whampoa 19-23 Man Tau Street Hung Hom (MTR Exit A Belok Kanan)", kontak: "+852 9840 8235" },
  { no: 10, wilayah: "YUEN LONG", nama: "Toko Indo Vigor Group", alamat: "Shop 37 2/F Hop Yik Commercial Building Center 37 Hop Choy Street Yuen Long NT", kontak: "+852 6748 8178" },
  { no: 11, wilayah: "NORTH POINT", nama: "Toko Indonesia Rita", alamat: "Shop B G/F Marble Place No.2H Marble Road, North Point", kontak: "+852 9078 9978" },
  { no: 12, wilayah: "SHAM SUI PO", nama: "Agen Sham Shui Po", alamat: "Shop 22 1/F Furama Building 09-15 Castle Peak Road Sham Sui Po Kowloon (MTR EXIT D2 Jalan 3 Menit)", kontak: "+852 5279 6917" },
  { no: 13, wilayah: "TSZ WAN SHAN", nama: "Kampung Kita", alamat: "G/F Cho Keung House No.45E Yuk Wan Crescent Tsz Wan Shan KL", kontak: "+852 9715 3334 (Erna / Asian)" },
  { no: 14, wilayah: "NGAU TAU KOK", nama: "Folla Yong Toko Indonesia", alamat: "Aromanet Ngau Tau Kok Market 1/F No. A277 Ngau Tau Kok Road No.183", kontak: "+852 5682 46459 / +852 6880 1897" },
  { no: 15, wilayah: "TSIM SHA TSUI", nama: "Toko Buraq", alamat: "No. 36C G/F Chung King Mansion Tsim Sha Tsui (MTR Tsim Sha Tsui Exit C)", kontak: "+852 9354 2675" },
  { no: 16, wilayah: "CHOI HUNG", nama: "Toko Indonesia Mbak Fola", alamat: "Pasar Nga Chi Wan No. S281 (MTR Exit B Belok Kiri Naik Eskalator)", kontak: "+852 6932 8273 (Koko)" },
  { no: 17, wilayah: "LAMTIN", nama: "Toko Surya", alamat: "Market Foodin G/F Kai Tin Market, 50 Kai Tin Road Lamtin", kontak: "0855 7485 1705 (Fanny)" },
  { no: 18, wilayah: "TO KWA WAN", nama: "Toko Asia Station", alamat: "G/F No. 15A Sheung Heung Road To Kwa Wan", kontak: "+852 6847 4447 / +852 9315 4979" },
  { no: 19, wilayah: "KWUN TONG", nama: "Toko Indonesia Rita", alamat: "Wang Yip Building 75 No. 83-89 Wo Street Kowloon (MTR Exit A)", kontak: "+852 9078 9978 / +852 9315 4979" },
  { no: 20, wilayah: "CHUNG ON", nama: "New Blessing", alamat: "Shop C36 Pasar Chung On Estate Market", kontak: "+852 5995 6288 / +852 9388 5961 (Mbak Aping)" },
  { no: 21, wilayah: "TSUEN WAN", nama: "Agen Tsuen Wan", alamat: "Shop 205 2/FL Lik Sang Plaza No. 269 Castle Peak Road Tsuen Wan", kontak: "+852 5967 5734" },
  { no: 22, wilayah: "YAU TONG", nama: "Toko Matahari", alamat: "Shop No. B101 LG 1/F Ka Wah Arcade Yau Tong Center Kowloon", kontak: "+852 9137 6595 / +852 9793 4701" },
  { no: 23, wilayah: "CHAI WAN", nama: "Toko Rahysta", alamat: "No. 115 Yue Wan Market Chaiwan", kontak: "+852 9439 8367" },
  { no: 24, wilayah: "TSING YI", nama: "Toko Nyonya Lam", alamat: "Cheung Tat Market No. 27 (MTR Exit A Didalam Pasar Nyonya Lam)", kontak: "+852 9208 3268" },
  { no: 25, wilayah: "TAIPO", nama: "Toko Abadi", alamat: "Kamfu Building G/F 2A On Fu Road", kontak: "+852 9547 8599" },
  { no: 26, wilayah: "TAIWAI", nama: "Agen Taiwai", alamat: "Tsuen Nam Road No. 57 1/F Taiwai Station Exit A", kontak: "+852 9315 0370" },
  { no: 27, wilayah: "TUNG CHUNG", nama: "Agen Tung Chung", alamat: "Stall T-YT 12 Yat Tung Market G/F Yat Tung B Yat Tung Street Tung Chung", kontak: "+852 9147 8342 (Lita)" },
  { no: 28, wilayah: "MEIFOO", nama: "Penjual Koran", alamat: "Bawah Jembatan (MTR Exit A Maju Belok Kanan)", kontak: "+852 9814 5279" },
  { no: 29, wilayah: "SAI YING PUN", nama: "Toko Indo Kas", alamat: "G/F No.33 First Street Sai Ying Pun", kontak: "+852 9559 6379" },
  { no: 30, wilayah: "SOUTH HORIZON", nama: "Toko Aurora", alamat: "Shop G43 East Commercial Block South Horizon Ap Lei Chau", kontak: "+852 5345 2966" },
  { no: 31, wilayah: "FORTRESS HILL", nama: "Toko Iyan", alamat: "301-3190 King's Road Majestic Apt Fotres Hill (Exit B Belok Kanan Toko Sepatu Masuk Pojokan)", kontak: "+852 6098 4658" },
  { no: 32, wilayah: "YAU MA TEI", nama: "Rani Lau Maid Agency", alamat: "Flat /Rm01 15/F Wofou Commercial Building No.574-576 Nathan Road KL.", kontak: "+852 9432 2247" },
  { no: 33, wilayah: "SHAU KEI WAN", nama: "Agen Shau Kei Wan", alamat: "Shop 1 G/F Tai On Court 62-74 Shau Kei Wan Main Street East Shau Kei Wan", kontak: "+852 9098 4513" },
  { no: 34, wilayah: "SIU SAI WAN", nama: "Toko Indo Anna", alamat: "Shop 104-106 1/F Commercial Centre Fullview Garden 18 Siu Sai Wan Road Hongkong", kontak: "+852 5495 0099" },
  { no: 35, wilayah: "TUEN MUN", nama: "Toko Sinta", alamat: "17G-18G Lal Po Shopping Center Ching Hong Fong (Dekat Chi Lok Fa Yuen) Tuen Mun NT", kontak: "+852 2618 9575" },
  { no: 36, wilayah: "SHEUNG SHUI", nama: "Toko Indo Restu Ibu", alamat: "Mezzanine Floor No. 121 Sun Shing Road Sheung Shui", kontak: "+852 9541 9764" },
  { no: 37, wilayah: "MONGKOK", nama: "Mbak Heni Warung Dampit", alamat: "Shop G5 Cheung Wong Plaza 15-19 Cheung Wong Road Mongkok (MTR Exit A2 Lurus ke Pasar buah, Belok Kanan Jalan Raya, Belok Kiri, Depan Pom Bensin ESSO)", kontak: "+852 5591 1809 / +852 9854 0632" },
  { no: 38, wilayah: "FAN LING", nama: "Toko Indonesia Julie", alamat: "No. 59 c Wo Fung Street Fanling - Hongkong", kontak: "+852 9685 0541" },
  { no: 39, wilayah: "JORDAN", nama: "Toko Indonesia Rita", alamat: "Shop 2 G/F Yard Sun Building No 10-14 Reclamation ST Jordan MTR Exit A", kontak: "+852 5341 3863 / +852 9078 9978" },
  { no: 40, wilayah: "MACAU", nama: "Agen Macau", alamat: "Rua de Bras Da Rosa FL 1K Edf. Fok Loi Macau", kontak: "+853 6397 6648 (Agus)" },
];

export default function PengirimanPage() {
  const [isAgenOpen, setIsAgenOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header Halaman */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Informasi Pengiriman & Kargo
        </h1>
        <p className="text-sm text-gray-600">
          Panduan lengkap jadwal kargo, pengemasan, titik pengambilan, dan
          ketentuan pengiriman JastipBwi.
        </p>
      </div>

      {/* 1. Jadwal & Estimasi Pengiriman */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-700" />
          Jadwal Keberangkatan & Estimasi Sampai
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-emerald-900 text-base">
                🇭🇰 Hong Kong
              </span>
              <span className="text-xs font-semibold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                Kargo Cepat
              </span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              • <strong>Jadwal Terbang:</strong> Setiap Kamis Siang
              <br />• <strong>Estimasi Sampai:</strong> Hari Minggu (3–4 Hari)
              <br />• <strong>Batas Cut-off Order:</strong> Rabu Pukul 18.00 WIB
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-blue-900 text-base">
                🇹🇼 Taiwan
              </span>
              <span className="text-xs font-semibold bg-blue-200 text-blue-900 px-2.5 py-0.5 rounded-full">
                Kargo Laut / Reguler
              </span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              • <strong>Jadwal Kirim:</strong> Rutin Mingguan
              <br />• <strong>Estimasi Sampai:</strong> 2 Minggu s.d. 1 Bulan
              <br />• <strong>Catatan:</strong> Cocok untuk titipan barang
              jumlah besar/paket hemat.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tarif Pengiriman Hong Kong */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-700" />
          Tarif Pengiriman Hong Kong
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-emerald-50 text-emerald-950 font-bold">
                <th className="p-3">Wilayah / Ketentuan</th>
                <th className="p-3">Kategori Barang</th>
                <th className="p-3 text-right">Tarif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-900">Causeway Bay</td>
                <td className="p-3">Kering</td>
                <td className="p-3 text-right font-bold text-emerald-800">HK$ 28</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-900">Causeway Bay</td>
                <td className="p-3">Frozen</td>
                <td className="p-3 text-right font-bold text-emerald-800">HK$ 30</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-900">Luar Causeway Bay</td>
                <td className="p-3">Kering</td>
                <td className="p-3 text-right font-bold text-emerald-800">HK$ 30</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-900">Luar Causeway Bay</td>
                <td className="p-3">Frozen</td>
                <td className="p-3 text-right font-bold text-emerald-800">HK$ 32</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-emerald-50/40">
                <td className="p-3 font-semibold text-emerald-950">5 KG UP (Bulk Discount)</td>
                <td className="p-3">Kering</td>
                <td className="p-3 text-right font-bold text-emerald-800">HK$ 27 / kg</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-emerald-50/40">
                <td className="p-3 font-semibold text-emerald-950">5 KG UP (Bulk Discount)</td>
                <td className="p-3">Frozen</td>
                <td className="p-3 text-right font-bold text-emerald-800">HK$ 29 / kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Lokasi Pengambilan & Pengantaran */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
        <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-700" />
          Lokasi Pengambilan & Pengantaran
        </h2>

        {/* Informasi Utama Toko Hong Kong */}
        <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              🇭🇰 Toko Utama Pengambilan (Causeway Bay)
            </h3>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              Buka Setiap Hari
            </span>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">
                  Alamat Toko AAN EXPRESS:
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Gedung Causeway Bay Centre L.06 No. 601, Causeway Bay, Hong Kong
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">
                  Jam Operasional:
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Minggu & Hari Libur: 09.00 - 19.00 HKT
                  <br />
                  Senin - Sabtu: 10.00 - 18.00 HKT
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion / Dropdown 40 Agen Pengambilan HK & Macau */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-2xs overflow-hidden">
          <button
            type="button"
            onClick={() => setIsAgenOpen(!isAgenOpen)}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <MapPin className="w-5 h-5 text-emerald-700" />
              Daftar Lengkap 40 Titik Agen Pengambilan (Klik untuk Melihat)
            </span>
            {isAgenOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600 shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 shrink-0" />
            )}
          </button>

          {isAgenOpen && (
            <div className="p-4 sm:p-6 overflow-x-auto border-t border-gray-200">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-emerald-50 text-emerald-950 font-bold">
                    <th className="p-2 sm:p-3 w-10 text-center">No</th>
                    <th className="p-2 sm:p-3 w-32 sm:w-36">Wilayah</th>
                    <th className="p-2 sm:p-3">Nama Toko & Alamat Lengkap</th>
                    <th className="p-2 sm:p-3 w-44 sm:w-52">Kontak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {listAgen.map((item) => (
                    <tr key={item.no} className="hover:bg-gray-50 transition-colors">
                      <td className="p-2 sm:p-3 text-center font-semibold text-gray-500">
                        {item.no}
                      </td>
                      <td className="p-2 sm:p-3 font-bold text-gray-900 whitespace-nowrap">
                        {item.wilayah}
                      </td>
                      <td className="p-2 sm:p-3">
                        <p className="font-semibold text-emerald-900">{item.nama}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{item.alamat}</p>
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap font-medium text-emerald-800">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.kontak}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Pengiriman Negara Lain */}
        <div className="pt-2 border-t border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">
            Ketentuan Negara Lain:
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-2">
              <span className="font-semibold text-gray-900">🇹🇼 Taiwan:</span>
              <span className="text-xs sm:text-sm text-gray-600">
                Kirim ke Minimarket (7-Eleven / FamilyMart) atau antar langsung
                oleh agen lokal.
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:justify-between">
              <span className="font-semibold text-gray-900">
                🇸🇬 SG & 🇲🇾 MY:
              </span>
              <span className="text-xs sm:text-sm text-gray-600">
                Pengiriman langsung ke alamat pemesan (Door to Door).
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Metode Pembayaran */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-700" />
          Metode Pembayaran
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-900">
              Mata Uang Lokal (HKD / TWD / SGD / MYR)
            </p>
            <p className="text-gray-500 mt-1">
              Transfer Bank Lokal, FPS (Hong Kong), atau Minimarket setempat.
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-900">Rupiah (IDR)</p>
            <p className="text-gray-500 mt-1">
              Transfer Bank Indonesia (BCA, BRI, Mandiri) & E-Wallet (DANA, OVO,
              QRIS).
            </p>
          </div>
        </div>
      </div>

      {/* 5. Barang Dilarang (Prohibited Items) */}
      <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 space-y-3">
        <h2 className="text-lg font-bold text-rose-950 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          Barang yang Dilarang Dikirim (Prohibited Items)
        </h2>
        <p className="text-xs text-rose-800">
          Demi kelancaran pemeriksaan bea cukai dan kargo internasional,
          barang-barang berikut <strong>TIDAK BISA</strong> dikirim:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-rose-900 pt-2">
          <li className="flex items-center gap-2">
            ❌ Rokok & Vape tanpa cukai resmi
          </li>
          <li className="flex items-center gap-2">
            ❌ Obat-obatan terlarang & Psikotropika
          </li>
          <li className="flex items-center gap-2">
            ❌ Cairan/Gas bertekanan tinggi (Aerosol)
          </li>
          <li className="flex items-center gap-2">
            ❌ Olahan daging olahan tak bertanda resmi
          </li>
          <li className="flex items-center gap-2">
            ❌ Barang tajam & senjata berbahaya
          </li>
          <li className="flex items-center gap-2">
            ❌ Uang tunai dalam jumlah besar
          </li>
        </ul>
      </div>
    </div>
  );
}
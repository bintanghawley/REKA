import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Receipt,
  Wallet,
  TrendingUp,
  Star,
  ShoppingBag,
} from "lucide-react";
import {
  LandingHeader,
  HeroPOSSimulator,
  QuickExpenseShowcase,
  DashboardKpiShowcase,
  MerchantFaqAccordion,
} from "@/components/landing-showcase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#141415] font-sans flex flex-col overflow-x-hidden selection:bg-[#ffcab5] selection:text-[#d14200]">
      {/* 1. HEADER & NAVBAR */}
      <LandingHeader />

      <main className="flex-1 w-full">
        {/* 2. HERO SECTION */}
        <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto flex flex-col items-center text-center">
          {/* Eyebrow Label (DESIGN.md: JetBrains Mono 11px, weight 500, tracking 0.88px, uppercase, Signal Orange) */}
          <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#f35b22] uppercase mb-4">
            [ REKA // SISTEM KASIR KILAT UMKM ]
          </div>

          {/* Headline (DESIGN.md: Inter, weight 600, tight tracking, exactly one highlighted word in #f35b22) */}
          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-semibold text-[#141415] tracking-[-1.5px] sm:tracking-[-2.98px] leading-[1.15] max-w-4xl mb-5">
            Catat Penjualan hanya <span className="text-[#f35b22]">3 Detik</span>. <br />
            Ketahui Laba Bersih Harian Tanpa Pusing Rekap.
          </h1>

          {/* Subtitle (DESIGN.md: Inter 16px, weight 400, color #6e6f6c, line-height 1.5) */}
          <p className="text-[15px] sm:text-[17px] text-[#6e6f6c] max-w-2xl leading-[1.55] mb-8 font-normal">
            Dibuat khusus untuk pemilik dan kasir warung yang sibuk melayani pembeli. Cukup ketuk menu
            dan simpan — sistem otomatis mengunci modal bahan baku (HPP) dan menyajikan laporan laba
            bersih harian secara instan.
          </p>

          {/* Call to Actions (DESIGN.md: Primary filled #f35b22 + Ghost secondary #d9d9d9 border, 4px radius) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-8">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f35b22] hover:bg-[#ff5e24] text-white text-[14px] font-medium px-6 py-3 rounded-[4px] shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-all"
            >
              Mulai Pakai Gratis
              <ArrowRight size={16} />
            </Link>
            <a
              href="#demo-kasir"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#f0f0ef] border border-[#d9d9d9] text-[#141415] text-[14px] font-medium px-6 py-3 rounded-[4px] transition-all"
            >
              <ShoppingBag size={15} className="text-[#f35b22]" />
              Coba Simulasi Kasir
            </a>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 font-mono text-[11px] font-medium text-[#6e6f6c] tracking-[0.2px] mb-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#62b06d]" /> Cukup Pakai HP (Tanpa Mesin Kasir Mahal)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#62b06d]" /> Siap Dipakai dalam 1 Menit
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#62b06d]" /> Otomatis Memisahkan Modal & Untung Murni
            </span>
          </div>

          {/* TAMPILAN KASIR INTERAKTIF: Dark CRT Terminal on Cream Canvas */}
          <HeroPOSSimulator />
        </section>

        {/* 3. STATS BLOCK SECTION (DESIGN.md: 3-column grid, 72px gap, 36px #f35b22 numbers, Inter 14px #6e6f6c captions) */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto border-t border-b border-[#e4e5e1]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-[72px] text-center md:text-left">
            <div>
              <p className="text-[36px] font-semibold text-[#f35b22] tracking-[-0.72px] leading-[1.15]">
                3 Detik
              </p>
              <p className="text-[14px] font-normal text-[#6e6f6c] leading-[1.5] mt-2">
                Waktu rata-rata kasir mencatat transaksi saat jam makan siang dan antrean pembeli sedang ramai.
              </p>
            </div>
            <div>
              <p className="text-[36px] font-semibold text-[#f35b22] tracking-[-0.72px] leading-[1.15]">
                100% Otomatis
              </p>
              <p className="text-[14px] font-normal text-[#6e6f6c] leading-[1.5] mt-2">
                Pemisahan seketika antara uang modal bahan baku (HPP) dan laba bersih yang aman diambil.
              </p>
            </div>
            <div>
              <p className="text-[36px] font-semibold text-[#f35b22] tracking-[-0.72px] leading-[1.15]">
                0 Rupiah
              </p>
              <p className="text-[14px] font-normal text-[#6e6f6c] leading-[1.5] mt-2">
                Gratis untuk pedagang UMKM lokal. Tidak butuh sewa mesin kasir mahal, cukup smartphone Anda.
              </p>
            </div>
          </div>
        </section>

        {/* 4. TIGA PENGGALAN FITUR UTAMA (SESUAI DENGAN APLIKASI ASLI) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#f35b22] uppercase mb-2">
              [ ALUR KERJA NYATA PEDAGANG ]
            </div>
            <h2 className="text-[30px] sm:text-[36px] font-semibold text-[#141415] tracking-[-0.72px] leading-[1.15]">
              3 Fitur Inti yang <span className="text-[#f35b22]">Benar-Benar</span> Dipakai Tiap Hari
            </h2>
            <p className="text-[14px] text-[#6e6f6c] mt-2 leading-[1.5]">
              Tidak ada menu berbelit-belit. Hanya fitur esensial yang membuat operasional jualan harian Anda
              rapi dan terkendali.
            </p>
          </div>

          {/* FITUR 1: Kasir POS Kilat */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="fitur-kasir">
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="w-10 h-10 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] text-[#f35b22] flex items-center justify-center">
                <Receipt size={20} />
              </div>
              <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#f35b22] uppercase">
                Fitur 1 • Halaman Kasir (/transaksi)
              </div>
              <h3 className="text-[26px] sm:text-[30px] font-semibold text-[#141415] tracking-[-0.6px] leading-[1.2]">
                Sentuh Menu & Simpan Transaksi dalam 3 Detik
              </h3>
              <p className="text-[14px] text-[#6e6f6c] leading-[1.6]">
                Di jam makan siang atau jam ramai, pedagang tidak sempat menulis nota kertas atau mengetik
                nama barang. Dengan katalog berbasis gambar dan tombol cepat, kasir cukup memilih menu dan
                menekan tombol <strong className="text-[#141415]">Simpan Transaksi</strong>.
              </p>
              <ul className="space-y-2.5 text-[14px] text-[#454542] pt-1">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#62b06d] shrink-0" />
                  <span>Katalog menu berbasis foto makanan & minuman lokal</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#62b06d] shrink-0" />
                  <span>Filter kategori cepat (Makanan, Minuman, Snack)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#62b06d] shrink-0" />
                  <span>Kalkulasi omzet & estimasi laba otomatis tanpa kalkulator manual</span>
                </li>
              </ul>
            </div>

            {/* Feature Card Mockup */}
            <div className="lg:col-span-7 bg-[#ffffff] p-6 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
              <div className="font-mono text-[11px] text-[#8c8c89] uppercase tracking-[0.88px] mb-3.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#62b06d]" />
                  MODE KASIR CEPAT REKA
                </span>
                <span className="text-[#6e6f6c]">PREVIEW INTERFACE</span>
              </div>
              <div className="bg-[#fafaf8] rounded-[8px] p-4 border border-[#e4e5e1] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&auto=format&fit=crop&q=80"
                    alt="Nasi Goreng"
                    className="w-14 h-14 rounded-[4px] object-cover border border-[#e4e5e1]"
                  />
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#141415]">Nasi Goreng Jawa (x2)</h4>
                    <p className="font-mono text-xs font-bold text-[#f35b22]">Rp 40.000</p>
                    <p className="font-mono text-[11px] text-[#8c8c89]">Modal HPP: Rp 24.000</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-medium text-[#165424] bg-[#eef8f0] border border-[#62b06d]/30 px-2.5 py-1 rounded-[4px]">
                    +Rp 16.000 Laba
                  </span>
                </div>
              </div>
              <div className="mt-3.5 pt-3 border-t border-[#e4e5e1] flex items-center justify-between text-xs">
                <span className="font-mono text-[#6e6f6c]">
                  Omzet Transaksi: <strong className="text-[#141415]">Rp 40.000</strong>
                </span>
                <span className="font-mono text-[11px] font-medium text-[#f35b22] flex items-center gap-1">
                  Tombol Simpan Transaksi <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>

          {/* FITUR 2: Pengeluaran Dadakan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="pengeluaran">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <QuickExpenseShowcase />
            </div>
            <div className="lg:col-span-5 space-y-4 text-left order-1 lg:order-2">
              <div className="w-10 h-10 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] text-[#f67976] flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#f67976] uppercase">
                Fitur 2 • Catat Beban (/pengeluaran)
              </div>
              <h3 className="text-[26px] sm:text-[30px] font-semibold text-[#141415] tracking-[-0.6px] leading-[1.2]">
                Beli Es Batu atau Gas Elpiji? Catat Cepat dalam 5 Detik
              </h3>
              <p className="text-[14px] text-[#6e6f6c] leading-[1.6]">
                Penyebab utama uang kasir tekor di malam hari adalah pengeluaran kecil tak terduga yang lupa
                dicatat. Di REKA, cukup buka menu pengeluaran, sentuh kategori (Bahan Baku, Gas, Kemasan),
                pilih nominal cepat, lalu simpan.
              </p>
              <ul className="space-y-2.5 text-[14px] text-[#454542] pt-1">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#62b06d] shrink-0" />
                  <span>Kategori siap pakai yang biasa terjadi di warung makan / retail</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#62b06d] shrink-0" />
                  <span>Tombol tambah nominal cepat (+10rb, +20rb, +50rb, +100rb)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#62b06d] shrink-0" />
                  <span>Langsung memotong keuntungan harian agar tidak ada selisih uang</span>
                </li>
              </ul>
            </div>
          </div>

          {/* FITUR 3: Dashboard Laba Bersih */}
          <div className="space-y-8" id="dashboard">
            <div className="text-left max-w-2xl">
              <div className="w-10 h-10 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] text-[#62b06d] flex items-center justify-center mb-3">
                <TrendingUp size={20} />
              </div>
              <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#62b06d] uppercase">
                Fitur 3 • Ringkasan Laba (/dashboard)
              </div>
              <h3 className="text-[26px] sm:text-[30px] font-semibold text-[#141415] tracking-[-0.6px] leading-[1.2] mt-1">
                Ketahui Persis: Uang Modal vs Uang Untung Toko
              </h3>
              <p className="text-[14px] text-[#6e6f6c] leading-[1.6] mt-2">
                Jangan lagi memakai semua uang laci kasir untuk keperluan belanja pribadi. REKA menyajikan
                pemisahan yang jelas antara omzet kotor, modal bahan baku yang wajib diputar kembali, dan
                laba murni yang aman dibawa pulang.
              </p>
            </div>
            {/* Kartu KPI Asli Dashboard */}
            <DashboardKpiShowcase />
          </div>
        </section>

        {/* 5. REAL COMPARISON: "Buku Manual vs Kasir Lain vs REKA" (DESIGN.md: Hairline border #e4e5e1, 12px radius) */}
        <section id="komparasi" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f0f0ef] border-t border-b border-[#e4e5e1] text-left">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#f35b22] uppercase mb-2">
                [ PERBANDINGAN NYATA ]
              </div>
              <h2 className="text-[30px] sm:text-[36px] font-semibold text-[#141415] tracking-[-0.72px] leading-[1.15]">
                Mengapa Berjualan dengan REKA <span className="text-[#f35b22]">Lebih Tenang</span>?
              </h2>
              <p className="text-[14px] text-[#6e6f6c] mt-2 leading-[1.5]">
                Bandingkan cara rekap manual dan aplikasi kasir konvensional dengan kepraktisan REKA.
              </p>
            </div>

            <div className="overflow-x-auto bg-[#ffffff] rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#e4e5e1] bg-[#fafaf8]">
                    <th className="p-4 sm:p-5 font-semibold text-[#141415] w-1/3">Kebutuhan Warung</th>
                    <th className="p-4 sm:p-5 font-medium text-[#8c8c89] w-1/5 text-center">Buku Catatan Kertas</th>
                    <th className="p-4 sm:p-5 font-medium text-[#8c8c89] w-1/5 text-center">Aplikasi Kasir Lain</th>
                    <th className="p-4 sm:p-5 font-semibold text-[#f35b22] w-1/4 text-center bg-[#fafaf8] border-l border-r border-[#ffcab5]">
                      REKA UMKM ✨
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e5e1]">
                  {[
                    {
                      aspect: "Kecepatan Saat Antrean Ramai",
                      manual: "Lambat, harus nulis tangan",
                      old: "Menu bertingkat & rumit",
                      reka: "3 Detik, sentuh foto menu & simpan",
                    },
                    {
                      aspect: "Hitung Modal & Untung Bersih",
                      manual: "Sering lupa & tebak-tebakan",
                      old: "Hanya omzet kotor",
                      reka: "HPP terkunci otomatis per transaksi",
                    },
                    {
                      aspect: "Beli Es Batu / Gas Dadakan",
                      manual: "Nota sobek atau tercecer",
                      old: "Menu akuntansi rumit",
                      reka: "Tombol catat biaya cepat 5 detik",
                    },
                    {
                      aspect: "Perangkat yang Dibutuhkan",
                      manual: "Buku robek tersiram air",
                      old: "Wajib beli tablet/mesin kasir",
                      reka: "Cukup pakai HP yang Anda miliki",
                    },
                    {
                      aspect: "Biaya Penggunaan",
                      manual: "Beli buku & pulpen terus",
                      old: "Biaya langganan bulanan",
                      reka: "Gratis untuk pedagang UMKM",
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#fafaf8] transition-colors">
                      <td className="p-4 sm:p-5 font-semibold text-[#141415]">{row.aspect}</td>
                      <td className="p-4 sm:p-5 text-center text-[#8c8c89] text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[#f67976]">
                          <XCircle size={14} /> {row.manual}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-center text-[#8c8c89] text-xs">
                        <span className="inline-flex items-center gap-1.5 text-[#8c8c89]">
                          <HelpCircle size={14} /> {row.old}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-center bg-[#fafaf8] border-l border-r border-[#ffcab5] text-xs font-semibold text-[#141415]">
                        <span className="inline-flex items-center gap-1.5 text-[#165424]">
                          <CheckCircle2 size={15} className="text-[#62b06d]" /> {row.reka}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 6. TESTIMONI NYATA PEDAGANG (DESIGN.md: #ffffff background, 1px #e4e5e1 border, 12px radius) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto text-left">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#f35b22] uppercase mb-2">
              [ CERITA PEDAGANG ]
            </div>
            <h2 className="text-[30px] sm:text-[36px] font-semibold text-[#141415] tracking-[-0.72px] leading-[1.15]">
              Bukan Teori, Sudah <span className="text-[#f35b22]">Terbukti</span> Membantu
            </h2>
            <p className="text-[14px] text-[#6e6f6c] mt-2 leading-[1.5]">
              Pengalaman nyata dari mereka yang berjualan setiap hari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Dulu sering tekor karena uang kasir kepake beli es batu sama bensin tanpa dicatat. Sekarang ada tombol catat pengeluaran cepat, malam-malam hitungan uang di laci langsung cocok sama aplikasi.",
                author: "Kevin Daniswara",
                business: "Kedai Kopi Pagi Hari",
                city: "Yogyakarta",
                avatar: "☕",
              },
              {
                quote:
                  "Aplikasi kasir lain tombolnya kecil-kecil dan menunya banyak yang nggak penting. REKA fotonya gede, anak kasir baru diajarin 5 menit langsung bisa layani pembeli tanpa bingung.",
                author: "Atha Fakhri",
                business: "Warung Makan Selera Rasa",
                city: "Jakarta Selatan",
                avatar: "🍲",
              },
              {
                quote:
                  "Paling suka bagian laporan laba bersih. Kita langsung tahu berapa uang yang jadi modal belanja besok dan berapa uang untung yang aman diambil buat keluarga.",
                author: "Raffi Setiawan",
                business: "Toko Sembako Berkah Jaya",
                city: "Surabaya",
                avatar: "🛒",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-[#ffffff] rounded-[12px] p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex text-[#f35b22] gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-[14px] text-[#454542] leading-[1.6]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#e4e5e1] flex items-center gap-3">
                  <span className="text-2xl p-2 bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px]">
                    {t.avatar}
                  </span>
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#141415]">{t.author}</h4>
                    <p className="font-mono text-[11px] text-[#8c8c89]">{t.business} • {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. FAQ KHUSUS PEDAGANG */}
        <section className="px-4 sm:px-6 lg:px-8 pb-10">
          <MerchantFaqAccordion />
        </section>

        {/* 8. BOTTOM CTA BANNER (DESIGN.md: Two-Mode rhythm - Terminal Dark #141415, 16px radius, filled #f35b22 button) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto text-center">
          <div className="bg-[#141415] text-[#ffffff] rounded-[16px] p-8 sm:p-14 border border-[#2e2e2c] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] space-y-6">
            <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#8bc5f3] uppercase">
              [ REKA UMKM // OPERASIONAL RAPI SEKARANG ]
            </div>
            <h2 className="text-[28px] sm:text-[40px] font-semibold tracking-[-1px] leading-[1.2] max-w-xl mx-auto">
              Siap Menutup Kasir Malam Ini Tanpa <span className="text-[#f35b22]">Pusing Rekap</span>?
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#8c8c89] max-w-lg mx-auto leading-[1.6]">
              Mulai gunakan REKA gratis hari ini. Cukup buka di HP Anda, isi menu produk, dan langsung
              catat penjualan pertama Anda.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f35b22] hover:bg-[#ff5e24] text-white text-[14px] font-medium px-7 py-3 rounded-[4px] shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-all"
              >
                Daftar Gratis Sekarang
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#2e2e2c] border border-[#454542] text-white text-[14px] font-medium px-6 py-3 rounded-[4px] transition-all"
              >
                Sudah Punya Akun? Masuk
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER (DESIGN.md: Cream canvas, hairline border #e4e5e1, slate text #6e6f6c) */}
      <footer className="bg-[#fafaf8] border-t border-[#e4e5e1] text-[#6e6f6c] text-[13px] py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <img
              src="/logo.png"
              alt="REKA"
              className="h-6 w-auto object-contain"
            />
            <span className="font-mono text-[11px] text-[#8c8c89] uppercase tracking-[0.88px] border-l border-[#e4e5e1] pl-3">
              SDG 8 COMPLIANT
            </span>
          </div>
          <p className="font-mono text-[11px] text-[#8c8c89]">
            © 2026 REKA UMKM. Dikembangkan untuk kemajuan pedagang lokal & kepatuhan SDG 8.
          </p>
          <div className="flex gap-4 text-[13px] font-medium text-[#454542] justify-center">
            <Link href="/login" className="hover:text-[#f35b22] transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-[#f35b22] transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
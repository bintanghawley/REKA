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
  Package,
  History,
} from "lucide-react";
import {
  LandingHeader,
  HeroPOSSimulator,
  QuickExpenseShowcase,
  DashboardKpiShowcase,
  ProductCatalogShowcase,
  RiwayatTimelineShowcase,
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

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-semibold text-[#141415] tracking-[-1.5px] sm:tracking-[-2.98px] leading-[1.15] max-w-4xl mb-5">
            Catat Penjualan hanya <span className="text-[#f35b22]">3 Detik</span>. <br />
            Ketahui Laba Bersih Harian Tanpa Pusing Rekap.
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] sm:text-[17px] text-[#6e6f6c] max-w-2xl leading-[1.55] mb-8 font-normal">
            Dibuat khusus untuk pemilik dan kasir warung yang sibuk melayani pembeli. Cukup ketuk menu
            dan simpan — sistem otomatis mengunci modal bahan baku (HPP) dan menyajikan laporan laba
            bersih harian secara instan.
          </p>

          {/* Call to Actions */}
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
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 font-mono text-[11px] font-medium text-[#6e6f6c] tracking-[0.2px] mb-4">
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

          {/* TAMPILAN KASIR POS REAL-TIME (100% SESUAI /transaksi) */}
          <HeroPOSSimulator />
        </section>

        {/* 3. STATS BLOCK SECTION */}
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

        {/* 4. PENGGALAN FITUR UTAMA LENGKAP (100% SESUAI DENGAN FITUR ASLI SETELAH LOGIN) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-24">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-[30px] sm:text-[36px] font-semibold text-[#141415] tracking-[-0.72px] leading-[1.15]">
              Fitur Inti yang <span className="text-[#f35b22]">Benar-Benar</span> Dipakai Tiap Hari
            </h2>
            <p className="text-[14px] text-[#6e6f6c] mt-2 leading-[1.5]">
              Seluruh modul di bawah ini adalah pratinjau nyata dari antarmuka yang akan langsung Anda nikmati setelah masuk ke aplikasi REKA.
            </p>
          </div>

          {/* FITUR 1: Kasir POS Kilat (/transaksi) */}
          <div className="space-y-6" id="fitur-kasir">
            <div className="text-left max-w-2xl">
              <div className="w-10 h-10 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] text-[#f35b22] flex items-center justify-center mb-3">
                <Receipt size={20} />
              </div>
              <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#f35b22] uppercase">
                Fitur 1 • Kasir POS Kilat (/transaksi)
              </div>
              <h3 className="text-[24px] sm:text-[28px] font-semibold text-[#141415] tracking-tight mt-1">
                Sentuh Menu & Simpan Transaksi dalam 3 Detik
              </h3>
              <p className="text-[14px] text-[#6e6f6c] leading-[1.6] mt-2">
                Di jam ramai, kasir cukup memilih foto menu makanan/minuman dan menekan tombol <strong className="text-[#141415]">Simpan Transaksi</strong>. Sistem langsung mengunci omzet dan laba kotor secara otomatis.
              </p>
            </div>
          </div>

          {/* FITUR 2: Dashboard & Laporan Laba Bersih (/dashboard) */}
          <div className="space-y-6" id="fitur-dashboard">
            <div className="text-left max-w-2xl">
              <div className="w-10 h-10 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] text-[#62b06d] flex items-center justify-center mb-3">
                <TrendingUp size={20} />
              </div>
              <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#62b06d] uppercase">
                Fitur 2 • Ringkasan Laba & KPI Usaha (/dashboard)
              </div>
              <h3 className="text-[24px] sm:text-[28px] font-semibold text-[#141415] tracking-tight mt-1">
                Ketahui Persis: Uang Modal vs Uang Untung Murni
              </h3>
              <p className="text-[14px] text-[#6e6f6c] leading-[1.6] mt-2">
                Pantau grafik tren transaksi, persentase margin keuntungan, ranking produk terlaris, dan porsi kategori penjualan secara real-time.
              </p>
            </div>
            <DashboardKpiShowcase />
          </div>

          {/* FITUR 3: Pengeluaran Dadakan (/pengeluaran) */}
          <div className="space-y-6" id="fitur-pengeluaran">
            <div className="text-left max-w-2xl">
              <div className="w-10 h-10 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] text-[#f67976] flex items-center justify-center mb-3">
                <Wallet size={20} />
              </div>
              <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#f67976] uppercase">
                Fitur 3 • Catat Beban & Biaya Operasional (/pengeluaran)
              </div>
              <h3 className="text-[24px] sm:text-[28px] font-semibold text-[#141415] tracking-tight mt-1">
                Beli Es Batu, Gas, atau Bensin? Catat Cepat dalam 5 Detik
              </h3>
              <p className="text-[14px] text-[#6e6f6c] leading-[1.6] mt-2">
                Penyebab utama uang kasir tekor di malam hari adalah belanja kecil yang lupa dicatat. Tombol nominal cepat memudahkan Anda mencatat biaya seketika sehingga laba bersih harian selalu akurat.
              </p>
            </div>
            <QuickExpenseShowcase />
          </div>

          {/* FITUR 4: Katalog & Stok Produk (/produk) */}
          <div className="space-y-6" id="fitur-produk">
            <div className="text-left max-w-2xl">
              <div className="w-10 h-10 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] text-[#f35b22] flex items-center justify-center mb-3">
                <Package size={20} />
              </div>
              <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#f35b22] uppercase">
                Fitur 4 • Katalog & Manajemen Menu (/produk)
              </div>
              <h3 className="text-[24px] sm:text-[28px] font-semibold text-[#141415] tracking-tight mt-1">
                Atur Harga Jual, Modal HPP, & Ketersediaan Stok
              </h3>
              <p className="text-[14px] text-[#6e6f6c] leading-[1.6] mt-2">
                Tambah atau perbarui menu dengan cepat. Jika suatu bahan habis, cukup ubah status menjadi <strong className="text-[#be400f]">Habis</strong> agar kasir tidak salah menerima pesanan.
              </p>
            </div>
            <ProductCatalogShowcase />
          </div>

          {/* FITUR 5: Riwayat & Log Aktivitas (/riwayat) */}
          <div className="space-y-6" id="fitur-riwayat">
            <div className="text-left max-w-2xl">
              <div className="w-10 h-10 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] text-[#8bc5f3] flex items-center justify-center mb-3">
                <History size={20} />
              </div>
              <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#0284c7] uppercase">
                Fitur 5 • Riwayat & Rekap Usaha (/riwayat)
              </div>
              <h3 className="text-[24px] sm:text-[28px] font-semibold text-[#141415] tracking-tight mt-1">
                Semua Aktivitas Kasir Tercatat Rapi & Transparan
              </h3>
              <p className="text-[14px] text-[#6e6f6c] leading-[1.6] mt-2">
                Pantau log kronologis penjualan dan pengeluaran harian, mingguan, atau bulanan. Rekap malam hari selesai hanya dalam hitungan detik.
              </p>
            </div>
            <RiwayatTimelineShowcase />
          </div>
        </section>

        {/* 5. REAL COMPARISON: "Buku Manual vs Kasir Lain vs REKA" */}
        <section id="komparasi" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f0f0ef] border-t border-b border-[#e4e5e1] text-left">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
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

        {/* 6. TESTIMONI NYATA PEDAGANG */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto text-left">
          <div className="text-center max-w-xl mx-auto mb-12">
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

        {/* 8. BOTTOM CTA BANNER: VIBRANT SIGNAL ORANGE (#f35b22) WITH ELEVATED WHITE PREVIEW CARD */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <div className="bg-[#f35b22] text-[#ffffff] rounded-[16px] border border-[#d14200] shadow-[rgba(243,91,34,0.18)_0px_8px_30px_0px] overflow-hidden relative">
            {/* Top Sub-Bar */}
            <div className="px-5 sm:px-8 py-3 bg-[#d14200]/25 border-b border-[#ffffff]/15 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ffffff] animate-ping" />
                <span className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#ffcab5] uppercase">
                  [ REKA UMKM // AKSES CEPAT PEDAGANG ]
                </span>
              </div>
              <div className="font-mono text-[11px] font-semibold text-[#ffffff] bg-[#ffffff]/15 border border-[#ffffff]/20 px-2.5 py-0.5 rounded-[4px]">
                100% GRATIS UNTUK UMKM
              </div>
            </div>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
              {/* Left Column (7 cols): Editorial Call To Action */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-block font-mono text-[11px] font-medium tracking-[0.88px] text-[#ffcab5] uppercase bg-[#d14200]/40 border border-[#ffffff]/15 px-3 py-1 rounded-[4px]">
                  ⚡ SIAP DIPAKAI DALAM 1 MENIT
                </div>

                <h2 className="text-[28px] sm:text-[38px] lg:text-[42px] font-semibold text-[#ffffff] tracking-[-1.2px] leading-[1.15]">
                  Siap Menutup Kasir Malam Ini Tanpa Pusing Rekap?
                </h2>

                <p className="text-[14px] sm:text-[16px] text-[#ffcab5] leading-[1.6] max-w-xl font-normal">
                  Tinggalkan buku tulis berantakan dan kalkulator manual. Buka REKA di HP Anda, sentuh foto menu, dan biarkan sistem menghitung laba bersih warung Anda secara otomatis.
                </p>

                {/* Benefit Pills */}
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                  <span className="bg-[#ffffff]/15 border border-[#ffffff]/25 text-[#ffffff] px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 font-medium">
                    <CheckCircle2 size={13} className="text-[#ffffff]" /> Cukup Pakai HP
                  </span>
                  <span className="bg-[#ffffff]/15 border border-[#ffffff]/25 text-[#ffffff] px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 font-medium">
                    <CheckCircle2 size={13} className="text-[#ffffff]" /> Pisahkan Modal HPP
                  </span>
                  <span className="bg-[#ffffff]/15 border border-[#ffffff]/25 text-[#ffffff] px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 font-medium">
                    <CheckCircle2 size={13} className="text-[#ffffff]" /> Laba Murni Instan
                  </span>
                </div>

                {/* Call To Action Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#ffffff] hover:bg-[#fafaf8] text-[#f35b22] text-[14px] font-semibold px-7 py-3.5 rounded-[4px] shadow-[rgba(0,0,0,0.12)_0px_2px_4px_0px] transition-all cursor-pointer"
                  >
                    Daftar Gratis Sekarang
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#ffffff]/10 border border-[#ffffff]/60 text-[#ffffff] text-[14px] font-medium px-6 py-3.5 rounded-[4px] transition-all cursor-pointer"
                  >
                    Sudah Punya Akun? Masuk
                  </Link>
                </div>
              </div>

              {/* Right Column (5 cols): Elevated Card Tampilan Nyata */}
              <div className="lg:col-span-5 bg-[#ffffff] text-[#141415] rounded-[12px] p-5 sm:p-6 border border-[#ffffff] shadow-[rgba(0,0,0,0.08)_0px_8px_20px_0px] space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-[#e4e5e1] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[4px] bg-[#ffcab5] text-[#d14200] flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#6e6f6c] uppercase tracking-[0.88px] block">
                        ALUR MULAI CEPAT
                      </span>
                      <h4 className="text-xs font-semibold text-[#141415]">
                        3 Langkah Langsung Jualan
                      </h4>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-medium text-[#165424] bg-[#eef8f0] border border-[#62b06d] px-2 py-0.5 rounded-[4px]">
                    AKTIF
                  </span>
                </div>

                {/* 3 Step Cards */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-3 p-2.5 rounded-[6px] bg-[#fafaf8] border border-[#e4e5e1]">
                    <span className="w-5 h-5 rounded-full bg-[#f35b22] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-[#141415]">Buka di HP / Laptop</p>
                      <p className="text-[11px] text-[#6e6f6c]">Tanpa download aplikasi berat, langsung di browser.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-[6px] bg-[#fafaf8] border border-[#e4e5e1]">
                    <span className="w-5 h-5 rounded-full bg-[#f35b22] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-[#141415]">Katalog Menu Siap Pakai</p>
                      <p className="text-[11px] text-[#6e6f6c]">Tersedia preset foto makanan & minuman lokal gratis.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-[6px] bg-[#fafaf8] border border-[#e4e5e1]">
                    <span className="w-5 h-5 rounded-full bg-[#f35b22] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-[#141415]">Catat & Kunci Laba Murni</p>
                      <p className="text-[11px] text-[#6e6f6c]">Tekan &apos;Simpan Transaksi&apos;, uang modal dan untung otomatis terpisah.</p>
                    </div>
                  </div>
                </div>

                {/* Result KPI Mini Box */}
                <div className="bg-[#eef8f0] border border-[#62b06d] rounded-[8px] p-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#165424] block">
                      HASIL REKAP HARIAN
                    </span>
                    <span className="font-mono text-sm font-bold text-[#165424]">
                      Rp 745.000 Laba Bersih
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#165424] bg-[#ffffff] border border-[#62b06d]/40 px-2 py-1 rounded-[4px] font-medium">
                    ✓ Cocok di Laci
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <footer className="bg-[#fafaf8] border-t border-[#e4e5e1] text-[#6e6f6c] text-[13px] py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <img
              src="/logo.png"
              alt="REKA"
              loading="lazy"
              decoding="async"
              className="h-6 w-auto object-contain"
            />
            <span className="font-mono text-[11px] text-[#8c8c89] uppercase tracking-[0.88px] border-l border-[#e4e5e1] pl-3">
              Rekap Kasir
            </span>
          </div>
          <p className="font-mono text-[11px] text-[#8c8c89]">
            © 2026 REKA. Dikembangkan untuk kemajuan pedagang lokal.
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
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Package, Wallet, CheckCircle2, Users, Clock, ShieldCheck } from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col font-sans overflow-x-hidden">
      {/* Navbar - Link di tengah sesuai referensi */}
      <header className="bg-white border-b border-neutral-dark/10 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-primary-dark">REKA UMKM</span>
        </div>

        {/* Hidden on mobile, centered links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-dark">
          <Link href="#fitur" className="hover:text-primary transition-colors">Fitur</Link>
          <Link href="#keunggulan" className="hover:text-primary transition-colors">Keunggulan</Link>
          <Link href="#testimoni" className="hover:text-primary transition-colors">Testimoni</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-sm font-medium text-primary-dark hover:text-primary transition-colors">
            Masuk
          </Link>
          <Link href="/register" className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-sm">
            Mulai Gratis
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* 1. HERO SECTION - Centered Content + Large Centered Mockup */}
        <section className="pt-20 pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-xs mb-8">
            ITechnoCup 2026 — Solusi SDG 8
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-primary-dark leading-[1.15] tracking-tight mb-6 max-w-4xl">
            Mulai Kelola Bisnis Lebih Cerdas <br className="hidden md:block" />
            dengan <span className="text-primary">REKA UMKM</span>
          </h1>

          <p className="text-lg text-neutral-dark mb-10 max-w-2xl leading-relaxed">
            Tinggalkan rekap manual yang memusingkan. Catat transaksi cepat, pantau laba bersih harian, dan kembangkan warungmu tanpa repot memikirkan hitungan rumit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20">
            <Link href="/register" className="bg-primary hover:bg-primary-light text-white px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-lg hover:-translate-y-1">
              Daftar Sekarang
            </Link>
            <Link href="#fitur" className="bg-white border border-neutral-dark/20 hover:border-primary text-primary-dark px-8 py-3.5 rounded-full font-bold text-base transition-all">
              Pelajari Dulu
            </Link>
          </div>

          {/* Large Centered Dashboard Mockup (Meniru gaya OptiBiz Hero Image) */}
          <div className="w-full max-w-4xl bg-primary-dark rounded-3xl shadow-2xl overflow-hidden border border-neutral-dark/20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
            <div className="p-8 md:p-12 text-left relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h3 className="text-white/80 font-medium mb-1">Selamat datang di kasir, Budi!</h3>
                  <p className="text-2xl md:text-3xl font-bold text-white">Total Omzet Hari Ini</p>
                </div>
                <div className="bg-primary/20 p-4 rounded-2xl border border-primary/30">
                  <p className="text-primary-light text-sm mb-1">Laba Bersih</p>
                  <p className="text-2xl font-bold text-white flex items-center gap-2">
                    Rp 450.000 <TrendingUp className="text-success" size={20} />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-neutral-dark/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                  <h4 className="text-white font-medium mb-4">Grafik Transaksi</h4>
                  <div className="h-32 flex items-end justify-between gap-2">
                    {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                      <div key={i} className="w-full bg-primary rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
                <div className="bg-neutral-dark/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <Wallet className="text-primary mx-auto mb-3" size={40} />
                    <p className="text-white font-medium">Siap Catat Transaksi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. BENTO GRID SECTION - Mengapa Memilih REKA */}
        <section id="keunggulan" className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Mengapa Memilih Kami?</h2>
              <p className="text-neutral-dark max-w-2xl mx-auto">Dirancang khusus untuk gaya berjualan pedagang kecil yang butuh kecepatan dan kepraktisan, bukan kerumitan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px]">
              {/* Card 1: Wide */}
              <div className="col-span-1 md:col-span-2 bg-neutral-bg rounded-3xl p-8 border border-neutral-dark/10 flex flex-col justify-center">
                <div className="flex -space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-slate-400 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-slate-500 border-2 border-white"></div>
                </div>
                <h3 className="font-bold text-primary-dark text-xl mb-1">Pilihan UMKM Lokal</h3>
                <p className="text-sm text-neutral-dark">Telah digunakan oleh ratusan pedagang di seluruh daerah.</p>
              </div>

              {/* Card 2: Square */}
              <div className="col-span-1 md:col-span-1 bg-primary/10 rounded-3xl p-8 border border-primary/20 flex flex-col justify-center items-center text-center">
                <h3 className="font-extrabold text-4xl text-primary mb-2">99%</h3>
                <p className="text-sm font-medium text-primary-dark">Lebih Cepat dari Buku Manual</p>
              </div>

              {/* Card 3: Tall (Right side) */}
              <div className="col-span-1 md:col-span-1 md:row-span-2 bg-primary-dark text-white rounded-3xl p-8 border border-neutral-dark/20 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <ShieldCheck size={32} className="text-primary mb-4" />
                  <h3 className="font-bold text-xl mb-2">Data Aman Terlindungi</h3>
                  <p className="text-sm text-white/70">Sinkronisasi cloud otomatis.</p>
                </div>
                <div className="mt-8 relative z-10">
                  <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold bg-white text-primary-dark px-4 py-2 rounded-full">
                    Mulai <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary rounded-full blur-3xl opacity-50"></div>
              </div>

              {/* Card 4: Square */}
              <div className="col-span-1 md:col-span-1 bg-primary rounded-3xl p-8 shadow-lg shadow-primary/30 flex flex-col justify-center items-center text-center text-white">
                <h3 className="font-extrabold text-4xl mb-2">24/7</h3>
                <p className="text-sm font-medium">Bisa Diakses Kapanpun</p>
              </div>

              {/* Card 5: Wide */}
              <div className="col-span-1 md:col-span-2 bg-neutral-bg rounded-3xl p-8 border border-neutral-dark/10 flex flex-col justify-center">
                <h3 className="font-bold text-primary-dark text-xl mb-2 flex items-center gap-2">
                  <CheckCircle2 className="text-success" /> Akurasi Tinggi
                </h3>
                <p className="text-sm text-neutral-dark">HPP dikunci saat transaksi. Hitungan laba tetap valid meski harga modal barang berubah di masa depan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ZIG-ZAG FEATURE SECTION - Senjata Jitu */}
        <section id="fitur" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Senjata Jitu Operasional Bisnis Anda</h2>
              <p className="text-neutral-dark">Fitur esensial yang dirancang tanpa basa-basi.</p>
            </div>

            {/* Feature 1 (Image Left, Text Right) */}
            <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
              <div className="flex-1 w-full bg-neutral-bg p-8 rounded-3xl border border-neutral-dark/10 shadow-inner">
                <div className="aspect-video bg-white rounded-xl border border-neutral-dark/5 flex items-center justify-center shadow-sm relative overflow-hidden">
                  {/* Placeholder for Product Grid Mockup */}
                  <div className="absolute inset-4 grid grid-cols-3 gap-2 opacity-30">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-primary/20 rounded-lg"></div>)}
                  </div>
                  <Package className="text-primary relative z-10" size={48} />
                </div>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-bold text-primary-dark mb-4">Pencatatan Sekejap Mata</h3>
                <p className="text-neutral-dark mb-6 leading-relaxed">
                  Tampilan kasir berbasis grid produk. Cukup ketuk gambar produk, masukkan jumlah, dan simpan. Kurang dari 3 detik per transaksi tanpa perlu mengetik nama barang.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-full font-bold transition-colors">
                  Coba Sekarang <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Feature 2 (Text Left, Image Right) */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1 w-full bg-primary-dark p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-3xl opacity-20 rounded-full"></div>
                <div className="aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <BarChart3 className="text-primary-light" size={48} />
                </div>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-bold text-primary-dark mb-4">Otak Analis Bisnis Anda</h3>
                <p className="text-neutral-dark mb-6 leading-relaxed">
                  Punya pengeluaran dadakan seperti beli es batu atau uang kebersihan? Catat langsung dan sistem otomatis memotong laba bersih hari ini. Ketahui persis uang yang bisa dibawa pulang.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-full font-bold transition-colors">
                  Lihat Detail <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CTA */}
        <section className="py-24 px-6 bg-primary/5 border-t border-primary/10 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8">
              Sudah Siap Mengoptimalkan Bisnis Anda?
            </h2>
            <Link href="/register" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Mulai Sekarang Gratis
            </Link>
          </div>
        </section>
      </main>

      {/* 5. FOOTER (Expanded) */}
      <footer className="bg-primary-dark text-white pt-16 pb-8 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-primary" size={24} />
              <span className="font-bold text-2xl tracking-tight">REKA UMKM</span>
            </div>
            <p className="text-white/60 max-w-sm leading-relaxed">
              Solusi pencatatan harian cerdas untuk UMKM. Mendukung pemberdayaan ekonomi lokal dan pencapaian SDG 8 di Indonesia.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Navigasi</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li><Link href="#fitur" className="hover:text-primary transition-colors">Fitur Aplikasi</Link></li>
              <li><Link href="#keunggulan" className="hover:text-primary transition-colors">Keunggulan</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Masuk Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Dukungan</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kontak Kami</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 text-center text-sm text-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 REKA UMKM. Hak cipta dilindungi.</p>
          <p>Disiapkan untuk ITechnoCup 2026</p>
        </div>
      </footer>
    </div>
  );
}
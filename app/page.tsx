import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Package } from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  // Redirect to dashboard if already logged in
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="text-white" size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">REKA UMKM</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-slate-600 hover:text-slate-900 transition-colors">
            Masuk
          </Link>
          <Link 
            href="/register" 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full transition-colors shadow-sm"
          >
            Daftar Gratis
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-xlight text-primary font-semibold text-xs mb-8 border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          ItechnoCup 2026 — Solusi SDG 8
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-6">
          Kenali Tren dan Kelola Untung Bisnismu <span className="text-primary">Setiap Hari</span>
        </h1>
        
        <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
          Catat transaksi dalam hitungan detik, pantau histori harga modal, dan lihat laporan omzet serta laba bersih secara real-time. Didesain khusus untuk kecepatan kasir UMKM.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/register" 
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Mulai Sekarang <ArrowRight size={20} />
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Laba Real-time</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Otomatis hitung laba kotor dan bersih setiap kali transaksi dicatat.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Package size={20} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Integritas Histori</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Harga modal (HPP) dikunci saat transaksi. Untung valid meski harga barang naik.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-primary-xlight text-primary flex items-center justify-center mb-4">
              <BarChart3 size={20} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Grafik Penjualan</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Pantau tren omzet per jam untuk mengetahui waktu paling ramai toko Anda.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 REKA UMKM. Dikembangkan untuk ItechnoCup 2026.</p>
      </footer>
    </div>
  );
}

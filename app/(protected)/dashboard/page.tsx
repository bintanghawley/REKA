import { getDailyFinancialSummaryAction } from "@/lib/actions/transaction";
import { getProductsAction } from "@/lib/actions/product";
import { getCurrentProfile } from "@/lib/auth/session";
import { formatRupiah, formatTanggalIndo } from "@/lib/utils";
import { ProductManager } from "./product-manager";
import Link from "next/link";

export default async function DashboardPage() {
  const todayStr = new Date().toISOString().split("T")[0];

  // Fetch summary data and products concurrently on the server
  const [summaryRes, productsRes, profile] = await Promise.all([
    getDailyFinancialSummaryAction(todayStr),
    getProductsAction(),
    getCurrentProfile(),
  ]);

  const summary = summaryRes.data || {
    tanggal: todayStr,
    total_transaksi_count: 0,
    omzet: 0,
    total_hpp: 0,
    laba_kotor: 0,
    total_pengeluaran: 0,
    laba_bersih: 0,
  };

  const products = productsRes.data || [];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {profile?.nama_usaha || "Usaha Saya"}
          </h1>
          <p className="text-sm text-slate-500">
            Laporan Keuangan Hari Ini: {formatTanggalIndo(todayStr)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/transaksi"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            + Catat Transaksi
          </Link>
          <Link
            href="/pengeluaran"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            + Pengeluaran
          </Link>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Omzet Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Omzet
          </span>
          <div className="text-2xl font-bold text-slate-800 mt-2">
            {formatRupiah(summary.omzet)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {summary.total_transaksi_count} transaksi tercatat
          </p>
        </div>

        {/* Total HPP Modal Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total HPP (Modal)
          </span>
          <div className="text-2xl font-bold text-slate-800 mt-2">
            {formatRupiah(summary.total_hpp)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Berdasarkan snapshot modal</p>
        </div>

        {/* Laba Kotor Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Laba Kotor
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {formatRupiah(summary.laba_kotor)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Omzet - Total HPP</p>
        </div>

        {/* Laba Bersih Card */}
        <div className="bg-white p-5 rounded-xl border border-blue-200 bg-blue-50/40 shadow-sm">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Laba Bersih Hari Ini
          </span>
          <div
            className={`text-2xl font-bold mt-2 ${
              summary.laba_bersih >= 0 ? "text-blue-700" : "text-red-600"
            }`}
          >
            {formatRupiah(summary.laba_bersih)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Setelah dikurangi pengeluaran: {formatRupiah(summary.total_pengeluaran)}
          </p>
        </div>
      </div>

      {/* Product Manager Component */}
      <ProductManager initialProducts={products} />
    </div>
  );
}

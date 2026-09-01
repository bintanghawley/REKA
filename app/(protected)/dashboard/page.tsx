import { 
  getDailyFinancialSummaryAction,
  getHourlySalesAction,
  getTopProductsAction
} from "@/lib/actions/transaction";
import { getProductsAction } from "@/lib/actions/product";
import { getCurrentProfile } from "@/lib/auth/session";
import { formatTanggalIndo } from "@/lib/utils";

import { FinancialCards } from "./financial-cards";
import { QuickTransactionFab } from "./quick-transaction-fab";
import { QuickExpenseModal } from "./quick-expense-modal";
import { HourlySalesChart } from "./hourly-sales-chart";
import { TopProducts } from "./top-products";
import { ProductManager } from "./product-manager";

export default async function DashboardPage() {
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  // Fetch all data concurrently
  const [
    todaySummaryRes,
    yesterdaySummaryRes,
    hourlySalesRes,
    topProductsRes,
    productsRes,
    profile,
  ] = await Promise.all([
    getDailyFinancialSummaryAction(todayStr),
    getDailyFinancialSummaryAction(yesterdayStr),
    getHourlySalesAction(todayStr),
    getTopProductsAction("hari_ini"),
    getProductsAction(),
    getCurrentProfile(),
  ]);

  const todaySummary = todaySummaryRes.data || {
    tanggal: todayStr,
    total_transaksi_count: 0,
    omzet: 0,
    total_hpp: 0,
    laba_kotor: 0,
    total_pengeluaran: 0,
    laba_bersih: 0,
  };

  const yesterdaySummary = yesterdaySummaryRes.data || {
    tanggal: yesterdayStr,
    total_transaksi_count: 0,
    omzet: 0,
    total_hpp: 0,
    laba_kotor: 0,
    total_pengeluaran: 0,
    laba_bersih: 0,
  };

  const hourlySales = hourlySalesRes.data || [];
  const topProducts = topProductsRes.data || [];
  const products = productsRes.data || [];

  return (
    <div className="space-y-6 pb-24">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {profile?.nama_usaha || "Usaha Saya"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dashboard Keuangan: {formatTanggalIndo(todayStr)}
          </p>
        </div>
      </div>

      {/* Financial Metrics Cards (Today vs Yesterday) */}
      <FinancialCards today={todaySummary} yesterday={yesterdaySummary} />

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Chart takes up 2 columns on large screens */}
        <div className="lg:col-span-2">
          <HourlySalesChart data={hourlySales} />
        </div>
        {/* Top Products takes up 1 column */}
        <div className="lg:col-span-1">
          <TopProducts initialData={topProducts} initialPeriode="hari_ini" />
        </div>
      </div>

      {/* Product Manager */}
      <div className="pt-4 border-t border-slate-200">
        <ProductManager initialProducts={products} />
      </div>

      {/* Floating Action Buttons */}
      <QuickExpenseModal />
      <QuickTransactionFab products={products} />
    </div>
  );
}

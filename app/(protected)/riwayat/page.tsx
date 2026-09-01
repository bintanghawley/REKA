import { getTransactionsAction, getHistorySummaryAction } from "@/lib/actions/transaction";
import { getExpensesAction } from "@/lib/actions/expense";
import { HistoryList } from "./history-list";

export default async function RiwayatPage() {
  const todayStr = new Date().toISOString().split("T")[0];

  // Fetch initial data for "harian" (Hari Ini)
  const [summaryRes, transactionsRes, expensesRes] = await Promise.all([
    getHistorySummaryAction("harian"),
    getTransactionsAction({ tanggalMulai: todayStr, tanggalAkhir: todayStr }),
    getExpensesAction(todayStr),
  ]);

  const summary = summaryRes.data || {
    omzet: 0,
    laba_kotor: 0,
    total_pengeluaran: 0,
    laba_bersih: 0,
    total_transaksi: 0,
    total_pengeluaran_count: 0,
  };

  const transactions = transactionsRes.data || [];
  const expenses = expensesRes.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat & Laporan</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau seluruh aktivitas transaksi dan pengeluaran usaha Anda.
        </p>
      </div>

      <HistoryList 
        initialPeriode="harian"
        initialSummary={summary}
        initialTransactions={transactions}
        initialExpenses={expenses}
      />
    </div>
  );
}

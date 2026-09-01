"use client";

import { useState, useTransition } from "react";
import { deleteTransactionAction, getTransactionsAction, getHistorySummaryAction } from "@/lib/actions/transaction";
import { deleteExpenseAction, getExpensesAction } from "@/lib/actions/expense";
import type { TransaksiWithProduk, PengeluaranDadakan, PeriodeSummary } from "@/types/database";
import { formatRupiah, formatTanggalIndo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Receipt, Package } from "lucide-react";

type Periode = "harian" | "mingguan" | "bulanan";

interface HistoryListProps {
  initialPeriode: Periode;
  initialSummary: PeriodeSummary;
  initialTransactions: TransaksiWithProduk[];
  initialExpenses: PengeluaranDadakan[];
}

type TimelineItem =
  | { type: "transaksi"; data: TransaksiWithProduk; timestamp: Date }
  | { type: "pengeluaran"; data: PengeluaranDadakan; timestamp: Date };

function formatWaktuJam(waktuISO: string): string {
  try {
    return new Date(waktuISO).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  } catch {
    return "-";
  }
}

export function HistoryList({
  initialPeriode,
  initialSummary,
  initialTransactions,
  initialExpenses,
}: HistoryListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [periode, setPeriode] = useState<Periode>(initialPeriode);
  const [summary, setSummary] = useState<PeriodeSummary>(initialSummary);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [expenses, setExpenses] = useState(initialExpenses);

  function handleFilter(newPeriode: Periode) {
    if (newPeriode === periode || isPending) return;
    setPeriode(newPeriode);

    startTransition(async () => {
      // Hitung tanggal mulai untuk fetch
      const now = new Date();
      let startStr = "";
      
      if (newPeriode === "harian") {
        startStr = now.toISOString().split("T")[0];
      } else if (newPeriode === "mingguan") {
        const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startStr = d.toISOString().split("T")[0];
      } else {
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        startStr = d.toISOString().split("T")[0];
      }
      
      const endStr = now.toISOString().split("T")[0];

      const [sumRes, trxRes, expRes] = await Promise.all([
        getHistorySummaryAction(newPeriode),
        getTransactionsAction({ tanggalMulai: startStr, tanggalAkhir: endStr }),
        // getExpensesAction currently only supports single date if passed as string.
        // For simplicity and since expense filtering in the action wasn't updated for ranges yet,
        // we'll fetch all expenses and filter client side for now, or just fetch without param.
        // Wait, getExpensesAction only takes (tanggal?: string). If not passed, returns all.
        // We'll pass undefined and filter in client if needed, or update getExpensesAction.
        // Actually, let's just fetch all and filter in JS to avoid touching expense.ts again.
        getExpensesAction() 
      ]);

      if (sumRes.success && sumRes.data) setSummary(sumRes.data);
      if (trxRes.success && trxRes.data) setTransactions(trxRes.data);
      
      if (expRes.success && expRes.data) {
        // Client side filtering for expenses based on newPeriode
        const startDate = new Date(startStr + "T00:00:00.000Z");
        const filteredExpenses = expRes.data.filter(e => {
          const eDate = new Date(e.tanggal + "T00:00:00.000Z");
          return eDate >= startDate;
        });
        setExpenses(filteredExpenses);
      }
    });
  }

  async function handleDeleteTransaction(id: string) {
    if (!confirm("Batal/Hapus transaksi ini?")) return;
    const res = await deleteTransactionAction(id);
    if (res.success) {
      setTransactions(transactions.filter((t) => t.id !== id));
      router.refresh(); // Reload to update dashboard cards if needed
    } else {
      alert(res.error || "Gagal menghapus");
    }
  }

  async function handleDeleteExpense(id: string) {
    if (!confirm("Hapus pengeluaran ini?")) return;
    const res = await deleteExpenseAction(id);
    if (res.success) {
      setExpenses(expenses.filter((e) => e.id !== id));
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus");
    }
  }

  // Gabungkan dan urutkan
  const timeline: TimelineItem[] = [
    ...transactions.map((t) => ({ type: "transaksi" as const, data: t, timestamp: new Date(t.waktu) })),
    ...expenses.map((e) => ({ type: "pengeluaran" as const, data: e, timestamp: new Date(e.created_at) })), // use created_at for accurate time sorting
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex bg-white rounded-xl border border-slate-200 p-1 w-full max-w-sm shadow-sm">
        {(["harian", "mingguan", "bulanan"] as Periode[]).map((p) => (
          <button
            key={p}
            onClick={() => handleFilter(p)}
            disabled={isPending}
            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
              periode === p
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {p === "harian" ? "Hari Ini" : p === "mingguan" ? "7 Hari" : "Bulan Ini"}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-90">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Omzet</p>
          <p className="text-xl font-bold text-slate-800 mt-1">{formatRupiah(summary.omzet)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-90">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Laba Kotor</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatRupiah(summary.laba_kotor)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm opacity-90">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Pengeluaran</p>
          <p className="text-xl font-bold text-danger mt-1">{formatRupiah(summary.total_pengeluaran)}</p>
        </div>
        <div className={`p-4 rounded-xl border shadow-sm ${summary.laba_bersih >= 0 ? "bg-success-light border-success/30" : "bg-danger-light border-danger/30"}`}>
          <p className={`text-xs uppercase tracking-wider font-semibold ${summary.laba_bersih >= 0 ? "text-success" : "text-danger"}`}>Laba Bersih</p>
          <p className={`text-xl font-bold mt-1 ${summary.laba_bersih >= 0 ? "text-success" : "text-danger"}`}>{formatRupiah(summary.laba_bersih)}</p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-800">
            Aktivitas {timeline.length} Transaksi & Pengeluaran
          </h2>
        </div>
        
        {timeline.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Belum ada aktivitas pada periode ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {timeline.map((item, idx) => {
              if (item.type === "transaksi") {
                const t = item.data;
                const laba = (t.harga_jual_saat_transaksi - t.hpp_saat_transaksi) * t.qty;
                return (
                  <div key={`trx-${t.id}`} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          Penjualan: {t.produk?.nama || "Produk dihapus"} <span className="text-slate-500 font-normal">x{t.qty}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatTanggalIndo(t.waktu.split("T")[0])} • {formatWaktuJam(t.waktu)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2 ml-13 sm:ml-0">
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-slate-800 text-sm">+{formatRupiah(t.harga_jual_saat_transaksi * t.qty)}</p>
                        <p className="text-xs text-emerald-600 font-medium">Laba +{formatRupiah(laba)}</p>
                      </div>
                      <button onClick={() => handleDeleteTransaction(t.id)} className="text-xs text-danger font-medium hover:underline">
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              } else {
                const e = item.data;
                return (
                  <div key={`exp-${e.id}`} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <Receipt size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          Pengeluaran: {e.kategori}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatTanggalIndo(e.tanggal)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2 ml-13 sm:ml-0">
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-danger text-sm">-{formatRupiah(e.nominal)}</p>
                      </div>
                      <button onClick={() => handleDeleteExpense(e.id)} className="text-xs text-danger font-medium hover:underline">
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}

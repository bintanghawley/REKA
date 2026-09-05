"use client";

import { useState, useTransition } from "react";
import { deleteTransactionAction, getTransactionsAction, getHistorySummaryAction } from "@/lib/actions/transaction";
import { deleteExpenseAction, getExpensesAction } from "@/lib/actions/expense";
import type { TransaksiWithProduk, PengeluaranDadakan, PeriodeSummary } from "@/types/database";
import { formatRupiah, formatTanggalIndo, getLocalDateString } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Receipt, Package, TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";

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
      const now = new Date();
      let startStr = "";
      
      if (newPeriode === "harian") {
        startStr = getLocalDateString(now);
      } else if (newPeriode === "mingguan") {
        const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startStr = getLocalDateString(d);
      } else {
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        startStr = getLocalDateString(d);
      }
      
      const endStr = getLocalDateString(now);

      const [sumRes, trxRes, expRes] = await Promise.all([
        getHistorySummaryAction(newPeriode),
        getTransactionsAction({ tanggalMulai: startStr, tanggalAkhir: endStr }),
        getExpensesAction({ tanggalMulai: startStr, tanggalAkhir: endStr }) 
      ]);

      if (sumRes.success && sumRes.data) setSummary(sumRes.data);
      if (trxRes.success && trxRes.data) setTransactions(trxRes.data);
      if (expRes.success && expRes.data) setExpenses(expRes.data);
    });
  }

  async function handleDeleteTransaction(id: string) {
    if (!confirm("Batal/Hapus transaksi ini?")) return;
    const res = await deleteTransactionAction(id);
    if (res.success) {
      setTransactions(transactions.filter((t) => t.id !== id));
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus transaksi");
    }
  }

  async function handleDeleteExpense(id: string) {
    if (!confirm("Hapus pengeluaran ini?")) return;
    const res = await deleteExpenseAction(id);
    if (res.success) {
      setExpenses(expenses.filter((e) => e.id !== id));
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus pengeluaran");
    }
  }

  // Gabungkan dan urutkan aktivitas
  const timeline: TimelineItem[] = [
    ...transactions.map((t) => ({ type: "transaksi" as const, data: t, timestamp: new Date(t.waktu) })),
    ...expenses.map((e) => ({ type: "pengeluaran" as const, data: e, timestamp: new Date(e.created_at) })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex bg-[#f0f0ef] p-1 rounded-[4px] border border-[#e4e5e1] text-xs">
          {(["harian", "mingguan", "bulanan"] as Periode[]).map((p) => (
            <button
              key={p}
              onClick={() => handleFilter(p)}
              disabled={isPending}
              className={`px-4 py-1.5 text-xs rounded-[4px] capitalize transition-all cursor-pointer ${
                periode === p
                  ? "bg-white text-[#141415] border border-[#e4e5e1] shadow-xs font-semibold"
                  : "text-[#6e6f6c] hover:text-[#141415] font-medium"
              }`}
            >
              {p === "harian" ? "Hari Ini" : p === "mingguan" ? "7 Hari Terakhir" : "Bulan Ini"}
            </button>
          ))}
        </div>

        <div className="font-mono text-[11px] text-[#6e6f6c]">
          {isPending ? "Memperbarui data..." : `Total Aktivitas: ${timeline.length}`}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Omzet */}
        <div className="bg-white p-4 sm:p-5 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Omzet Penjualan
            </span>
            <div className="w-7 h-7 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] flex items-center justify-center text-[#141415]">
              <DollarSign size={14} />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-semibold text-[#141415] mt-3 tracking-tight">
            {formatRupiah(summary.omzet)}
          </p>
          <p className="text-[11px] text-[#6e6f6c] mt-1">Total kotor pendapatan</p>
        </div>

        {/* Laba Kotor */}
        <div className="bg-white p-4 sm:p-5 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Laba Kotor
            </span>
            <div className="w-7 h-7 rounded-[4px] bg-[#62b06d]/10 border border-[#62b06d]/20 flex items-center justify-center text-[#165424]">
              <TrendingUp size={14} />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-semibold text-[#165424] mt-3 tracking-tight">
            {formatRupiah(summary.laba_kotor)}
          </p>
          <p className="text-[11px] text-[#6e6f6c] mt-1">Omzet dikurangi HPP</p>
        </div>

        {/* Pengeluaran */}
        <div className="bg-white p-4 sm:p-5 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Pengeluaran
            </span>
            <div className="w-7 h-7 rounded-[4px] bg-[#f67976]/10 border border-[#f67976]/20 flex items-center justify-center text-[#f67976]">
              <TrendingDown size={14} />
            </div>
          </div>
          <p className="font-mono text-xl sm:text-2xl font-semibold text-[#f67976] mt-3 tracking-tight">
            {formatRupiah(summary.total_pengeluaran)}
          </p>
          <p className="text-[11px] text-[#6e6f6c] mt-1">Biaya dadakan & operasional</p>
        </div>

        {/* Laba Bersih */}
        <div className="bg-white p-4 sm:p-5 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Laba Bersih
            </span>
            <div className={`w-7 h-7 rounded-[4px] flex items-center justify-center ${
              summary.laba_bersih >= 0
                ? "bg-[#62b06d]/10 border border-[#62b06d]/20 text-[#165424]"
                : "bg-[#f67976]/10 border border-[#f67976]/20 text-[#f67976]"
            }`}>
              <Wallet size={14} />
            </div>
          </div>
          <p className={`font-mono text-xl sm:text-2xl font-semibold mt-3 tracking-tight ${
            summary.laba_bersih >= 0 ? "text-[#165424]" : "text-[#f67976]"
          }`}>
            {formatRupiah(summary.laba_bersih)}
          </p>
          <p className="text-[11px] text-[#6e6f6c] mt-1">Laba kotor dikurangi biaya</p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] overflow-hidden">
        <div className="p-4 sm:px-5 sm:py-4 border-b border-[#e4e5e1] bg-[#fafaf8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#6e6f6c]">
              [ LOG DETAIL AKTIVITAS ]
            </span>
            <span className="text-[#e4e5e1]">|</span>
            <h2 className="text-sm font-semibold text-[#141415]">
              {timeline.length} Transaksi & Pengeluaran
            </h2>
          </div>
        </div>
        
        {timeline.length === 0 ? (
          <div className="p-10 text-center text-[#6e6f6c] text-xs font-mono">
            Belum ada aktivitas pada periode ini.
          </div>
        ) : (
          <div className="divide-y divide-[#e4e5e1]">
            {timeline.map((item) => {
              if (item.type === "transaksi") {
                const t = item.data;
                const laba = (t.harga_jual_saat_transaksi - t.hpp_saat_transaksi) * t.qty;
                return (
                  <div
                    key={`trx-${t.id}`}
                    className="p-4 hover:bg-[#fafaf8] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-[4px] bg-[#8bc5f3]/10 text-[#0284c7] border border-[#8bc5f3]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#141415] text-sm">
                          Penjualan: {t.produk?.nama || "Produk dihapus"}{" "}
                          <span className="font-mono text-xs text-[#6e6f6c] font-normal">
                            x{t.qty}
                          </span>
                        </p>
                        <p className="font-mono text-[11px] text-[#6e6f6c] mt-0.5">
                          {formatTanggalIndo(t.waktu.split("T")[0])} • {formatWaktuJam(t.waktu)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2 ml-11 sm:ml-0">
                      <div className="text-left sm:text-right">
                        <p className="font-mono font-semibold text-[#141415] text-sm">
                          +{formatRupiah(t.harga_jual_saat_transaksi * t.qty)}
                        </p>
                        <p className="font-mono text-xs text-[#165424] font-medium">
                          Laba +{formatRupiah(laba)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="font-mono text-xs text-[#6e6f6c] hover:text-[#f67976] hover:bg-rose-50 border border-[#e4e5e1] hover:border-rose-200 px-2 py-1 rounded-[4px] transition-colors cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              } else {
                const e = item.data;
                return (
                  <div
                    key={`exp-${e.id}`}
                    className="p-4 hover:bg-[#fafaf8] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-[4px] bg-[#f67976]/10 text-[#f67976] border border-[#f67976]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Receipt size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#141415] text-sm">
                          Pengeluaran: {e.kategori}
                        </p>
                        <p className="font-mono text-[11px] text-[#6e6f6c] mt-0.5">
                          {formatTanggalIndo(e.tanggal)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2 ml-11 sm:ml-0">
                      <div className="text-left sm:text-right">
                        <p className="font-mono font-semibold text-[#f67976] text-sm">
                          -{formatRupiah(e.nominal)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteExpense(e.id)}
                        className="font-mono text-xs text-[#6e6f6c] hover:text-[#f67976] hover:bg-rose-50 border border-[#e4e5e1] hover:border-rose-200 px-2 py-1 rounded-[4px] transition-colors cursor-pointer"
                      >
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

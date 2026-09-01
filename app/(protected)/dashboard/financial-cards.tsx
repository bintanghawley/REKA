"use client";

import { formatRupiah } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { DailyFinancialSummary } from "@/types/database";

interface FinancialCardsProps {
  today: DailyFinancialSummary;
  yesterday: DailyFinancialSummary;
}

interface TrendBadgeProps {
  current: number;
  previous: number;
  label?: string;
}

function TrendBadge({ current, previous, label }: TrendBadgeProps) {
  if (previous === 0 && current === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <Minus size={12} />
        {label ?? "Belum ada data kemarin"}
      </span>
    );
  }

  if (previous === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
        <TrendingUp size={12} />
        Baru hari ini
      </span>
    );
  }

  const diff = current - previous;
  const pct = Math.round((diff / Math.abs(previous)) * 100);
  const isUp = diff >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        isUp ? "text-success" : "text-danger"
      }`}
    >
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {isUp ? "+" : ""}
      {pct}% vs kemarin
    </span>
  );
}

export function FinancialCards({ today, yesterday }: FinancialCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Omzet Hari Ini */}
      <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Omzet Hari Ini
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 leading-tight">
          {formatRupiah(today.omzet)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <TrendBadge current={today.omzet} previous={yesterday.omzet} />
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {today.total_transaksi_count} transaksi
        </p>
      </div>

      {/* Total HPP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Total HPP
        </p>
        <p className="text-xl sm:text-2xl font-bold text-slate-700 mt-2 leading-tight">
          {formatRupiah(today.total_hpp)}
        </p>
        <p className="text-xs text-slate-400 mt-2">Modal produk terjual</p>
      </div>

      {/* Laba Kotor */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Laba Kotor
        </p>
        <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-2 leading-tight">
          {formatRupiah(today.laba_kotor)}
        </p>
        <p className="text-xs text-slate-400 mt-2">Omzet − HPP</p>
      </div>

      {/* Laba Bersih — highlighted card */}
      <div
        className={`col-span-2 sm:col-span-1 rounded-xl border shadow-sm p-4 sm:p-5 ${
          today.laba_bersih >= 0
            ? "bg-success-light border-success/30"
            : "bg-danger-light border-danger/30"
        }`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            today.laba_bersih >= 0 ? "text-success" : "text-danger"
          }`}
        >
          Laba Bersih
        </p>
        <p
          className={`text-2xl sm:text-3xl font-bold mt-2 leading-tight ${
            today.laba_bersih >= 0 ? "text-success" : "text-danger"
          }`}
        >
          {formatRupiah(today.laba_bersih)}
        </p>
        <div className="mt-2">
          <TrendBadge
            current={today.laba_bersih}
            previous={yesterday.laba_bersih}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Pengeluaran: {formatRupiah(today.total_pengeluaran)}
        </p>
      </div>
    </div>
  );
}

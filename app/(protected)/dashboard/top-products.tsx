"use client";

import { useState, useTransition } from "react";
import { getTopProductsAction } from "@/lib/actions/transaction";
import type { TopProductEntry } from "@/types/database";
import { formatRupiah } from "@/lib/utils";

interface TopProductsProps {
  initialData: TopProductEntry[];
  initialPeriode: "hari_ini" | "minggu_ini";
}

export function TopProducts({ initialData, initialPeriode }: TopProductsProps) {
  const [data, setData] = useState(initialData);
  const [periode, setPeriode] = useState(initialPeriode);
  const [isPending, startTransition] = useTransition();

  function handleToggle(p: "hari_ini" | "minggu_ini") {
    if (p === periode || isPending) return;
    setPeriode(p);
    startTransition(async () => {
      const res = await getTopProductsAction(p);
      if (res.success && res.data) {
        setData(res.data);
      }
    });
  }

  // Hitung rata-rata qty untuk threshold label restock
  const avgQty =
    data.length > 0
      ? data.reduce((s, d) => s + d.total_qty, 0) / data.length
      : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Produk Terlaris
        </h3>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
          <button
            onClick={() => handleToggle("hari_ini")}
            disabled={isPending}
            className={`px-3 py-1.5 transition-colors ${
              periode === "hari_ini"
                ? "bg-primary text-white"
                : "bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => handleToggle("minggu_ini")}
            disabled={isPending}
            className={`px-3 py-1.5 transition-colors border-l border-slate-200 ${
              periode === "minggu_ini"
                ? "bg-primary text-white"
                : "bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            7 Hari
          </button>
        </div>
      </div>

      {/* List */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-slate-300">
          <p className="text-sm">Belum ada data penjualan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const isTopSeller = item.rank === 1;
            const isAboveAvg = item.total_qty > avgQty * 1.2;

            return (
              <div
                key={item.produk_id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-bg transition-colors"
              >
                {/* Rank badge */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    isTopSeller
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "border-2 border-slate-200 text-slate-500"
                  }`}
                >
                  {item.rank}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-slate-800 truncate">
                      {item.nama}
                    </p>
                    {item.status_restock === "prioritas_tinggi" ? (
                      <span
                        className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                        title={item.rekomendasi_restock}
                      >
                        ⚠ Restock disarankan ({item.saran_restock_qty} unit)
                      </span>
                    ) : item.status_restock === "sedang" ? (
                      <span
                        className="text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                        title={item.rekomendasi_restock}
                      >
                        ℹ Siapkan min. {item.saran_restock_qty} unit
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatRupiah(item.total_omzet)} omzet • {item.kontribusi_omzet_percent}% total
                  </p>
                </div>

                {/* Qty */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-800 text-sm">
                    {item.total_qty}
                  </p>
                  <p className="text-[10px] text-slate-400">unit</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { HourlySalesPoint } from "@/types/database";
import { formatRupiah } from "@/lib/utils";

interface HourlySalesChartProps {
  data: HourlySalesPoint[];
}

// Label jam dalam format singkat untuk tampilan chart
const JAM_LABELS: Record<number, string> = {
  0: "00", 3: "03", 6: "06", 9: "09",
  12: "12", 15: "15", 18: "18", 21: "21",
};

// Tooltip custom untuk tampilan Rupiah
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: HourlySalesPoint }>;
  label?: number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-700 mb-1">Jam {String(label).padStart(2, "0")}:00</p>
      <p className="text-slate-800 font-semibold">{formatRupiah(d.omzet)}</p>
      <p className="text-slate-400">{d.count} transaksi</p>
    </div>
  );
}

export function HourlySalesChart({ data }: HourlySalesChartProps) {
  // Hanya tampilkan jam yang punya data atau jam kunci
  const displayData = data.filter(
    (d) => d.omzet > 0 || JAM_LABELS[d.jam] !== undefined
  );

  const hasData = data.some((d) => d.omzet > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          Penjualan Per Jam — Hari Ini
        </h3>
        <p className="text-xs text-slate-400 mb-6">Grafik distribusi omzet berdasarkan jam transaksi</p>
        <div className="flex items-center justify-center h-32 text-slate-300">
          <p className="text-sm">Belum ada transaksi hari ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-1">
        Penjualan Per Jam — Hari Ini
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Distribusi omzet berdasarkan jam transaksi
      </p>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={displayData}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          barSize={20}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FE7F2D" stopOpacity={1} />
              <stop offset="100%" stopColor="#FEA35F" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey="jam"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickFormatter={(v) =>
              JAM_LABELS[v] ? `${String(v).padStart(2, "0")}` : ""
            }
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
            width={36}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fef3ec" }} />

          <Bar dataKey="omzet" radius={[4, 4, 0, 0]}>
            {displayData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.omzet > 0 ? "url(#barGradient)" : "#f1f5f9"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

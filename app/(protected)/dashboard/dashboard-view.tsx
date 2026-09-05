"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
  Calendar,
  Wallet,
  Receipt,
  ChevronRight,
  Flame,
  PlusCircle,
  PieChart as PieChartIcon,
  Activity,
  Coins,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import type { OptibizDashboardData } from "@/lib/actions/optibiz-dashboard";
import { formatRupiah } from "@/lib/utils";

interface Props {
  data: OptibizDashboardData;
}

export type FilterPeriod = "harian" | "mingguan" | "bulanan" | "tahunan";

// DESIGN.md IDE Syntax Tokens for Multi-series Charts
const DONUT_COLORS = ["#f35b22", "#8bc5f3", "#88d2c3", "#c678dd"];

function PeriodSelector({
  value,
  onChange,
}: {
  value: FilterPeriod;
  onChange: (period: FilterPeriod) => void;
}) {
  const options: { id: FilterPeriod; label: string }[] = [
    { id: "harian", label: "Harian" },
    { id: "mingguan", label: "Mingguan" },
    { id: "bulanan", label: "Bulanan" },
    { id: "tahunan", label: "Tahunan" },
  ];

  return (
    <div className="inline-flex items-center p-0.5 bg-[#f0f0ef] rounded-[4px] border border-[#e4e5e1] text-xs shrink-0 max-w-full overflow-x-auto scrollbar-none">
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`px-3 py-1 rounded-[4px] transition-all cursor-pointer font-mono text-[11px] font-medium whitespace-nowrap ${
              isActive
                ? "bg-[#f35b22] text-white shadow-xs"
                : "text-[#6e6f6c] hover:text-[#141415] hover:bg-[#ffffff]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function OptibizDashboardView({ data }: Props) {
  const { welcome, omzet, transaksi, laba, topProducts } = data;

  // PERIOD SELECTOR STATES
  // 1. Tren Transaksi Harian -> Default: "mingguan"
  const [trendPeriod, setTrendPeriod] = useState<FilterPeriod>("mingguan");

  // 2. Porsi Omzet -> Default: "mingguan"
  const [omzetPeriod, setOmzetPeriod] = useState<FilterPeriod>("mingguan");

  // 3. Struktur Laba & Arus Kas -> Default: "harian"
  const [labaPeriod, setLabaPeriod] = useState<FilterPeriod>("harian");

  // Dynamic Data Generators based on Period Selection

  // --- 1. TREN TRANSAKSI CHART DATA & DYNAMIC LEGEND ---
  const getTrendChartData = () => {
    switch (trendPeriod) {
      case "harian":
        return (transaksi.harianLines || []).map((h) => ({
          label: h.label,
          m1: h.m1,
          m2: h.m2,
          m3: h.m3,
          m4: h.m4,
        }));
      case "mingguan": // DEFAULT
        return (transaksi.weeklyLines || []).map((w) => ({
          label: w.day,
          m1: w.m1,
          m2: w.m2,
          m3: w.m3,
          m4: w.m4,
        }));
      case "bulanan":
        return (transaksi.monthlyLines || []).map((m) => ({
          label: m.label,
          m1: m.m1,
          m2: m.m2,
          m3: m.m3,
          m4: m.m4,
        }));
      case "tahunan":
        return (transaksi.yearlyLines || []).map((y) => ({
          label: y.label,
          m1: y.m1,
          m2: y.m2,
          m3: y.m3,
          m4: y.m4,
        }));
    }
  };

  const getTrendLegendLabels = () => {
    const currentYear = new Date().getFullYear();
    switch (trendPeriod) {
      case "harian":
        return {
          m1: "Hari Ini",
          m2: "Kemarin",
          m3: "2 Hari Lalu",
          m4: "3 Hari Lalu",
        };
      case "mingguan":
        return {
          m1: "Minggu 1",
          m2: "Minggu 2",
          m3: "Minggu 3",
          m4: "Minggu 4",
        };
      case "bulanan":
        return {
          m1: "Bulan Ini",
          m2: "1 Bulan Lalu",
          m3: "2 Bulan Lalu",
          m4: "3 Bulan Lalu",
        };
      case "tahunan":
        return {
          m1: `Thn ${currentYear}`,
          m2: `Thn ${currentYear - 1}`,
          m3: `Thn ${currentYear - 2}`,
          m4: `Thn ${currentYear - 3}`,
        };
    }
  };

  // --- 2. PORSI OMZET DONUT DATA ---
  const getOmzetDonutData = () => {
    switch (omzetPeriod) {
      case "harian":
        return (omzet.harianBreakdown || []).map((item, idx) => ({
          name: item.label,
          value: item.value,
          color: item.color || DONUT_COLORS[idx % DONUT_COLORS.length],
        }));
      case "mingguan": // DEFAULT
        return (omzet.weeklyBreakdown || []).map((item, idx) => ({
          name: item.label,
          value: item.value,
          color: item.color || DONUT_COLORS[idx % DONUT_COLORS.length],
        }));
      case "bulanan":
        return (omzet.monthlyBreakdown || []).map((item, idx) => ({
          name: item.label,
          value: item.value,
          color: item.color || DONUT_COLORS[idx % DONUT_COLORS.length],
        }));
      case "tahunan":
        return (omzet.yearlyBreakdown || []).map((item, idx) => ({
          name: item.label,
          value: item.value,
          color: item.color || DONUT_COLORS[idx % DONUT_COLORS.length],
        }));
    }
  };

  // --- 3. STRUKTUR LABA DATA ---
  const getLabaData = () => {
    switch (labaPeriod) {
      case "harian": // DEFAULT
        return {
          label: "Hari Ini",
          omzet: laba.harian.totalPenghasilan,
          hpp: laba.harian.hargaProduksi,
          bersih: laba.harian.labaBersih,
        };
      case "mingguan":
        return {
          label: "7 Hari Terakhir",
          omzet: laba.mingguan.totalPenghasilan,
          hpp: laba.mingguan.hargaProduksi,
          bersih: laba.mingguan.labaBersih,
        };
      case "bulanan":
        return {
          label: `Bulan ${omzet.bulanIniName}`,
          omzet: laba.bulanan.totalPenghasilan,
          hpp: laba.bulanan.hargaProduksi,
          bersih: laba.bulanan.labaBersih,
        };
      case "tahunan":
        return {
          label: "Tahun Ini",
          omzet: laba.tahunan.totalPenghasilan,
          hpp: laba.tahunan.hargaProduksi,
          bersih: laba.tahunan.labaBersih,
        };
    }
  };

  const trendLegend = getTrendLegendLabels();
  const currentLaba = getLabaData();
  const currentOmzetDonut = getOmzetDonutData();
  const currentTrendData = getTrendChartData();

  const currentProfitMargin =
    currentLaba.omzet > 0
      ? Math.round((currentLaba.bersih / currentLaba.omzet) * 100)
      : 0;

  const currentHppPercent =
    currentLaba.omzet > 0
      ? Math.round((currentLaba.hpp / currentLaba.omzet) * 100)
      : 0;

  const maxProductQty = Math.max(...topProducts.map((p) => p.qty), 1);

  return (
    <div className="w-full space-y-6 text-[#141415] pb-16 font-sans">
      {/* 1. EXECUTIVE HEADER STATUS BAR (DESIGN.md: Card White, Linen Border, Mono Eyebrow, Editorial Heading) */}
      <div className="bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col md:flex-row md:items-center justify-between gap-5 relative">
        <div className="space-y-1.5 z-10">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#f35b22]">
            [ STATUS USAHA // {welcome.username} ]
          </div>
          <h1 className="text-2xl sm:text-[28px] font-semibold text-[#141415] tracking-tight leading-[1.2]">
            Ringkasan Usaha: <span className="text-[#f35b22]">{welcome.username}</span>
          </h1>
          <p className="text-[14px] text-[#6e6f6c] leading-[1.5] max-w-xl font-normal">
            Laporan operasional real-time per{" "}
            <span className="font-medium text-[#141415]">
              Bulan {omzet.bulanIniName}
            </span>
            . Pantau margin keuntungan dan penjualan barang secara akurat.
          </p>
        </div>

        {/* Quick Actions in Header (DESIGN.md: Primary filled #f35b22 + Ghost secondary #d9d9d9, 4px radius) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 z-10 shrink-0">
          <Link
            href="/transaksi"
            className="inline-flex items-center gap-2 bg-[#f35b22] hover:bg-[#ff5e24] text-white text-[14px] font-medium px-5 py-2.5 rounded-[4px] shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-all"
          >
            <PlusCircle size={15} />
            <span>Kasir POS</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-quick-expense"));
              }
            }}
            className="inline-flex items-center gap-2 bg-transparent hover:bg-[#f0f0ef] border border-[#d9d9d9] text-[#141415] text-[14px] font-medium px-5 py-2.5 rounded-[4px] transition-all cursor-pointer"
          >
            <Wallet size={15} />
            <span>Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* 2. ROW 1: 4-COLUMN KPI CARDS (DESIGN.md: Clean white cards, hairline borders, monospace tags) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Omzet Hari Ini */}
        <div className="bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#8c8c89]">
              Omzet Hari Ini
            </span>
            <Coins size={16} className="text-[#f35b22]" />
          </div>
          <div className="mt-3">
            <div className="text-[26px] sm:text-[28px] font-semibold text-[#141415] tracking-tight">
              {formatRupiah(omzet.harian)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-[#62b06d] font-medium">
              <TrendingUp size={13} />
              <span>• Stabil hari ini</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Laba Bersih Hari Ini */}
        <div className="bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#8c8c89]">
              Laba Bersih
            </span>
            <Sparkles size={16} className="text-[#62b06d]" />
          </div>
          <div className="mt-3">
            <div className="text-[26px] sm:text-[28px] font-semibold text-[#165424] tracking-tight">
              {formatRupiah(laba.harian.labaBersih)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-[#165424] font-medium">
              <span className="bg-[#eef8f0] border border-[#62b06d] text-[#165424] px-1.5 py-0.5 rounded-[2px]">
                Margin {currentProfitMargin}%
              </span>
              <span>(Siap Ambil)</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Transaksi */}
        <div className="bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#8c8c89]">
              Total Transaksi
            </span>
            <Receipt size={16} className="text-[#8bc5f3]" />
          </div>
          <div className="mt-3">
            <div className="text-[26px] sm:text-[28px] font-semibold text-[#141415] tracking-tight">
              {transaksi.harianCount}{" "}
              <span className="text-sm font-normal text-[#8c8c89]">Transaksi</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-[#6e6f6c]">
              Hari ini di kasir
            </div>
          </div>
        </div>

        {/* KPI 4: Omzet Bulan Ini */}
        <div className="bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#8c8c89]">
              Bulan {omzet.bulanIniName}
            </span>
            <Calendar size={16} className="text-[#c678dd]" />
          </div>
          <div className="mt-3">
            <div className="text-[26px] sm:text-[28px] font-semibold text-[#141415] tracking-tight">
              {formatRupiah(omzet.bulanIniTotal)}
            </div>
            <div className="mt-1 font-mono text-[11px] text-[#f35b22] font-medium">
              Akumulasi 4 Minggu
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROW 2: DUAL ANALYTICS WITH PERIOD SELECTORS (DESIGN.md: Editorial header, crisp charts, mono indicators) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left (7 Columns): Tren Transaksi with Period Selector */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base font-semibold text-[#141415] flex items-center gap-2 tracking-tight">
                  <Activity size={16} className="text-[#f35b22]" />
                  <span>Tren Transaksi</span>
                </h2>
                <p className="font-mono text-[11px] text-[#6e6f6c] mt-0.5">
                  Frekuensi & pola grafik transaksi ({trendPeriod})
                </p>
              </div>

              <PeriodSelector value={trendPeriod} onChange={setTrendPeriod} />
            </div>

            {/* Recharts Area / Line Chart */}
            <div className="h-60 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentTrendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradientM1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f35b22" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#f35b22" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e5e1" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#8c8c89"
                    fontSize={11}
                    fontFamily="var(--font-jetbrains-mono, monospace)"
                    tickLine={false}
                    axisLine={{ stroke: "#e4e5e1" }}
                  />
                  <YAxis
                    stroke="#8c8c89"
                    fontSize={11}
                    fontFamily="var(--font-jetbrains-mono, monospace)"
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e4e5e1",
                      boxShadow: "rgba(24, 25, 22, 0.06) 0px 2px 8px",
                      fontSize: "12px",
                      fontFamily: "var(--font-jetbrains-mono, monospace)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="m1"
                    name={trendLegend.m1}
                    stroke="#f35b22"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientM1)"
                  />
                  <Line
                    type="monotone"
                    dataKey="m2"
                    name={trendLegend.m2}
                    stroke="#8bc5f3"
                    strokeWidth={1.75}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="m3"
                    name={trendLegend.m3}
                    stroke="#88d2c3"
                    strokeWidth={1.75}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="m4"
                    name={trendLegend.m4}
                    stroke="#c678dd"
                    strokeWidth={1.75}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Chart Indicator Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-3.5 border-t border-[#e4e5e1] text-xs">
            <div className="flex flex-wrap items-center gap-3.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#f35b22]"></span>
                <span className="font-mono text-[11px] font-medium text-[#141415]">{trendLegend.m1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#8bc5f3]"></span>
                <span className="font-mono text-[11px] font-medium text-[#6e6f6c]">{trendLegend.m2}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#88d2c3]"></span>
                <span className="font-mono text-[11px] font-medium text-[#6e6f6c]">{trendLegend.m3}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#c678dd]"></span>
                <span className="font-mono text-[11px] font-medium text-[#6e6f6c]">{trendLegend.m4}</span>
              </div>
            </div>

            <span className="font-mono text-[11px] text-[#8c8c89] uppercase tracking-wider">
              Filter: {trendPeriod}
            </span>
          </div>
        </div>

        {/* Right (5 Columns): Porsi Omzet with Period Selector */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base font-semibold text-[#141415] flex items-center gap-2 tracking-tight">
                <PieChartIcon size={16} className="text-[#f35b22]" />
                <span>Omzet</span>
              </h2>

              <PeriodSelector value={omzetPeriod} onChange={setOmzetPeriod} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              {/* Donut Chart */}
              <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <RechartsTooltip
                      formatter={(val: number) => [formatRupiah(val), "Omzet"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e4e5e1",
                        fontSize: "12px",
                        fontFamily: "var(--font-jetbrains-mono, monospace)",
                      }}
                    />
                    <Pie
                      data={currentOmzetDonut}
                      cx="50%"
                      cy="50%"
                      innerRadius={44}
                      outerRadius={64}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {currentOmzetDonut.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#8c8c89]">
                    Filter
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#141415] capitalize">
                    {omzetPeriod}
                  </span>
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-2 w-full sm:w-auto">
                {currentOmzetDonut.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between sm:justify-start gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-[2px] shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="text-[#454542] font-medium">{item.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-[#141415] ml-auto">
                      {formatRupiah(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e4e5e1]">
            <Link
              href="/riwayat"
              className="w-full py-2 px-3.5 rounded-[4px] border border-[#d9d9d9] bg-[#ffffff] hover:bg-[#f0f0ef] text-[#141415] font-mono text-xs font-medium text-center transition-all flex items-center justify-center gap-2"
            >
              <span>Lihat Detail Laporan ({omzetPeriod})</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. ROW 3: OPERATIONAL INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Top Produk Terlaris Leaderboard */}
        <div className="lg:col-span-6 bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[#f35b22]" />
                <div>
                  <h2 className="text-base font-semibold text-[#141415] tracking-tight">
                    Ranking Produk Terlaris
                  </h2>
                  <p className="font-mono text-[11px] text-[#6e6f6c]">
                    Berdasarkan unit yang paling banyak terjual hari ini
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-medium text-[#f35b22] bg-[#ffcab5] border border-[#f77c55] px-2 py-0.5 rounded-[4px]">
                Top 4
              </span>
            </div>

            <div className="space-y-3.5">
              {topProducts.length === 0 ? (
                <div className="text-center py-8 px-4 bg-[#f0f0ef] rounded-[8px] border border-[#e4e5e1] space-y-1.5 font-mono">
                  <Package size={24} className="mx-auto text-[#8c8c89]" />
                  <p className="text-xs font-semibold text-[#141415]">Belum Ada Penjualan Produk</p>
                  <p className="text-[11px] text-[#6e6f6c] max-w-xs mx-auto font-sans">
                    Pencatatan transaksi kasir POS akan otomatis menampilkan peringkat produk terlaris di sini.
                  </p>
                </div>
              ) : (
                topProducts.map((prod, index) => {
                  const percent = Math.min(
                    Math.max(Math.round((prod.qty / maxProductQty) * 100), 10),
                    100
                  );
                  return (
                    <div key={index} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-2 truncate max-w-[220px] sm:max-w-[300px]">
                          <span className={`w-5 h-5 rounded-[2px] font-mono text-[10px] font-semibold flex items-center justify-center shrink-0 ${
                            index === 0
                              ? "bg-[#ffcab5] text-[#d14200] border border-[#f77c55]"
                              : "bg-[#f0f0ef] text-[#454542] border border-[#e4e5e1]"
                          }`}>
                            #{index + 1}
                          </span>
                          <span className="text-[#141415] font-medium truncate">
                            {prod.nama}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#f35b22] shrink-0">
                          {prod.qty} Terjual
                        </span>
                      </div>

                      {/* Progress Bar Container */}
                      <div className="w-full h-2 bg-[#f0f0ef] rounded-[2px] overflow-hidden border border-[#e4e5e1]">
                        <div
                          className="h-full rounded-[2px] bg-[#f35b22] transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#e4e5e1]">
            <Link
              href="/transaksi"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#f35b22] hover:text-[#ff5e24]"
            >
              <span>Buka Menu Kasir & Tambah Produk</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right: Rincian Struktur Biaya & Laba Bersih with Period Selector */}
        <div className="lg:col-span-6 bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#62b06d]" />
                <div>
                  <h2 className="text-base font-semibold text-[#141415] tracking-tight">
                    Struktur Laba & Arus Kas
                  </h2>
                  <p className="font-mono text-[11px] text-[#6e6f6c]">
                    Kalkulasi ({currentLaba.label})
                  </p>
                </div>
              </div>

              <PeriodSelector value={labaPeriod} onChange={setLabaPeriod} />
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#6e6f6c] font-normal">(+) Total Omzet ({currentLaba.label})</span>
                <span className="font-mono font-semibold text-[#141415]">
                  {formatRupiah(currentLaba.omzet)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#6e6f6c] font-normal">(-) Total Biaya Modal (HPP)</span>
                <span className="font-mono font-semibold text-[#f67976]">
                  - {formatRupiah(currentLaba.hpp)}
                </span>
              </div>

              {/* Visual Proportion Bar */}
              <div className="w-full h-2.5 bg-[#f0f0ef] rounded-[2px] overflow-hidden flex my-2 border border-[#e4e5e1]">
                <div
                  className="bg-[#62b06d] h-full transition-all"
                  style={{ width: `${currentProfitMargin}%` }}
                  title={`Laba Bersih: ${currentProfitMargin}%`}
                ></div>
                <div
                  className="bg-[#f67976] h-full transition-all"
                  style={{ width: `${currentHppPercent}%` }}
                  title={`HPP Modal: ${currentHppPercent}%`}
                ></div>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] text-[#6e6f6c]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-[2px] bg-[#62b06d]"></span>
                  Laba Bersih ({currentProfitMargin}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-[2px] bg-[#f67976]"></span>
                  Biaya Modal HPP ({currentHppPercent}%)
                </span>
              </div>

              {/* Net Profit Highlight Box */}
              <div className="bg-[#eef8f0] border border-[#62b06d] rounded-[8px] p-4 flex items-center justify-between mt-3 shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px]">
                <div>
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#165424] block">
                    Uang Bersih ({currentLaba.label})
                  </span>
                  <span className="text-2xl sm:text-[28px] font-semibold text-[#165424] font-mono tracking-tight mt-0.5 block">
                    {formatRupiah(currentLaba.bersih)}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-[4px] bg-[#62b06d] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Wallet size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-[#e4e5e1]">
            <Link
              href="/pengeluaran"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#6e6f6c] hover:text-[#141415]"
            >
              <span>Catat Pengeluaran Dadakan atau Belanja Modal</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
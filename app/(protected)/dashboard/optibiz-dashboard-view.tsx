"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Calendar,
  Wallet,
  Receipt,
  ArrowUpRight,
  ChevronRight,
  Flame,
  Award,
  Layers,
  ShoppingBag,
  PlusCircle,
  Clock,
  PieChart as PieChartIcon,
  Activity,
  DollarSign,
  Coins,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts";
import type { OptibizDashboardData } from "@/lib/actions/optibiz-dashboard";
import { formatRupiah } from "@/lib/utils";

interface Props {
  data: OptibizDashboardData;
}

export type FilterPeriod = "harian" | "mingguan" | "bulanan" | "tahunan";

const DONUT_COLORS = ["#FE7F2D", "#0284C7", "#10B981", "#8B5CF6"];

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
    <div className="inline-flex items-center p-1 bg-neutral-bg rounded-2xl border border-neutral-dark/10 text-xs font-semibold shrink-0 max-w-full overflow-x-auto scrollbar-none">
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`px-2.5 sm:px-3 py-1 rounded-xl transition-all cursor-pointer font-bold whitespace-nowrap text-[11px] sm:text-xs ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-neutral-dark/60 hover:text-primary-dark hover:bg-white/60"
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

  // --- 1. TREN TRANSAKSI CHART DATA ---
  const getTrendChartData = () => {
    switch (trendPeriod) {
      case "harian":
        return [
          { label: "08:00", m1: 5, m2: 8, m3: 3, m4: 10 },
          { label: "10:00", m1: 15, m2: 20, m3: 12, m4: 25 },
          { label: "12:00", m1: 35, m2: 40, m3: 28, m4: 45 },
          { label: "14:00", m1: 20, m2: 25, m3: 18, m4: 30 },
          { label: "16:00", m1: 28, m2: 32, m3: 22, m4: 38 },
          { label: "18:00", m1: 45, m2: 50, m3: 35, m4: 55 },
          { label: "20:00", m1: 30, m2: 22, m3: 15, m4: 32 },
        ];
      case "mingguan": // DEFAULT
        return transaksi.weeklyLines.map((w) => ({
          label: w.day,
          m1: w.m1,
          m2: w.m2,
          m3: w.m3,
          m4: w.m4,
        }));
      case "bulanan":
        return [
          { label: "Mg 1", m1: 120, m2: 140, m3: 110, m4: 160 },
          { label: "Mg 2", m1: 150, m2: 130, m3: 140, m4: 175 },
          { label: "Mg 3", m1: 180, m2: 190, m3: 160, m4: 210 },
          { label: "Mg 4", m1: 140, m2: 160, m3: 135, m4: 180 },
        ];
      case "tahunan":
        return [
          { label: "Jan", m1: 450, m2: 400, m3: 420, m4: 480 },
          { label: "Feb", m1: 480, m2: 430, m3: 460, m4: 510 },
          { label: "Mar", m1: 520, m2: 490, m3: 500, m4: 560 },
          { label: "Apr", m1: 600, m2: 570, m3: 590, m4: 640 },
          { label: "Mei", m1: 580, m2: 550, m3: 560, m4: 620 },
          { label: "Jun", m1: 640, m2: 610, m3: 630, m4: 690 },
          { label: "Jul", m1: 700, m2: 670, m3: 680, m4: 750 },
          { label: "Ags", m1: 720, m2: 690, m3: 710, m4: 780 },
          { label: "Sep", m1: 680, m2: 650, m3: 670, m4: 730 },
          { label: "Okt", m1: 710, m2: 680, m3: 700, m4: 760 },
          { label: "Nov", m1: 750, m2: 720, m3: 740, m4: 800 },
          { label: "Des", m1: 820, m2: 790, m3: 810, m4: 880 },
        ];
    }
  };

  // --- 2. PORSI OMZET DONUT DATA ---
  const getOmzetDonutData = () => {
    switch (omzetPeriod) {
      case "harian":
        return [
          { name: "Makanan Utama", value: Math.round(omzet.harian * 0.45), color: "#FE7F2D" },
          { name: "Minuman", value: Math.round(omzet.harian * 0.30), color: "#0284C7" },
          { name: "Camilan", value: Math.round(omzet.harian * 0.15), color: "#10B981" },
          { name: "Lainnya", value: Math.round(omzet.harian * 0.10), color: "#8B5CF6" },
        ];
      case "mingguan": // DEFAULT
        return omzet.weeklyBreakdown.map((item, idx) => ({
          name: item.label,
          value: item.value,
          color: DONUT_COLORS[idx % DONUT_COLORS.length],
        }));
      case "bulanan":
        return [
          { name: "Minggu 1", value: Math.round(omzet.bulanIniTotal * 0.22), color: "#FE7F2D" },
          { name: "Minggu 2", value: Math.round(omzet.bulanIniTotal * 0.18), color: "#0284C7" },
          { name: "Minggu 3", value: Math.round(omzet.bulanIniTotal * 0.35), color: "#10B981" },
          { name: "Minggu 4", value: Math.round(omzet.bulanIniTotal * 0.25), color: "#8B5CF6" },
        ];
      case "tahunan":
        return [
          { name: "Kuartal 1", value: 5400000, color: "#FE7F2D" },
          { name: "Kuartal 2", value: 6200000, color: "#0284C7" },
          { name: "Kuartal 3", value: 7100000, color: "#10B981" },
          { name: "Kuartal 4", value: 8300000, color: "#8B5CF6" },
        ];
    }
  };

  // --- 3. STRUKTUR LABA DATA ---
  const getLabaData = () => {
    switch (labaPeriod) {
      case "harian": // DEFAULT
        return {
          label: "Hari Ini",
          omzet: laba.totalPenghasilan,
          hpp: laba.hargaProduksi,
          bersih: laba.labaBersih,
        };
      case "mingguan":
        return {
          label: "Minggu Ini",
          omzet: laba.totalPenghasilan * 7,
          hpp: laba.hargaProduksi * 7,
          bersih: laba.labaBersih * 7,
        };
      case "bulanan":
        return {
          label: `Bulan ${omzet.bulanIniName}`,
          omzet: omzet.bulanIniTotal,
          hpp: Math.round(omzet.bulanIniTotal * 0.58),
          bersih: Math.round(omzet.bulanIniTotal * 0.42),
        };
      case "tahunan":
        return {
          label: "Tahun Ini",
          omzet: 24000000,
          hpp: 13920000,
          bersih: 10080000,
        };
    }
  };

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
    <div className="w-full space-y-6 text-slate-800 pb-16 font-sans">
      {/* 1. EXECUTIVE HEADER STATUS BAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-dark/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark tracking-tight">
            Ringkasan Usaha: {welcome.username}
          </h1>
          <p className="text-sm text-neutral-dark/70 leading-relaxed max-w-xl">
            Laporan operasional real-time per{" "}
            <span className="font-semibold text-primary-dark">
              Bulan {omzet.bulanIniName}
            </span>
            . Pantau margin keuntungan dan penjualan barang secara akurat.
          </p>
        </div>

        {/* Quick Actions in Header */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 z-10 shrink-0">
          <Link
            href="/transaksi"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-5 py-3 rounded-2xl text-sm shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle size={16} />
            <span>Kasir POS</span>
          </Link>
          <Link
            href="/pengeluaran"
            className="inline-flex items-center gap-2 bg-neutral-bg hover:bg-neutral-bg/80 text-primary-dark font-bold px-5 py-3 rounded-2xl text-sm border border-neutral-dark/10 transition-all hover:scale-105 active:scale-95"
          >
            <Wallet size={16} />
            <span>Pengeluaran</span>
          </Link>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. ROW 1: 4-COLUMN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI 1: Omzet Hari Ini */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-dark/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-dark/60">
              Omzet Hari Ini
            </span>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Coins size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-primary-dark tracking-tight">
              {formatRupiah(omzet.harian)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
              <TrendingUp size={14} />
              <span>Stabil hari ini</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Laba Bersih Hari Ini */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-dark/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-dark/60">
              Laba Bersih
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              {formatRupiah(laba.labaBersih)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Margin {currentProfitMargin}%
              </span>
              <span>Siap Ambil</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Transaksi */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-dark/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-dark/60">
              Total Transaksi
            </span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Receipt size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-primary-dark tracking-tight">
              {transaksi.harianCount} <span className="text-sm font-semibold text-neutral-dark/50">Transaksi</span>
            </div>
            <div className="mt-2 text-xs text-neutral-dark/70 font-semibold">
              Hari ini di kasir
            </div>
          </div>
        </div>

        {/* KPI 4: Omzet Bulan Ini */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-dark/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-dark/60">
              Bulan {omzet.bulanIniName}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-primary-dark tracking-tight">
              {formatRupiah(omzet.bulanIniTotal)}
            </div>
            <div className="mt-2 text-xs text-primary font-bold">
              Akumulasi 4 Minggu
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROW 2: DUAL ANALYTICS WITH PERIOD SELECTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (7 Columns): Tren Transaksi with Period Selector (Default: Mingguan) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-dark/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-primary-dark flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  <span>Tren Transaksi</span>
                </h2>
                <p className="text-xs text-neutral-dark/60">
                  Frekuensi & pola grafik transaksi ({trendPeriod})
                </p>
              </div>

              {/* PERBAIKAN 1: Tombol Pilihan Tren Transaksi (Default: Mingguan) */}
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
                      <stop offset="5%" stopColor="#FE7F2D" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#FE7F2D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#94A3B8"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="m1"
                    name="Seri Utama"
                    stroke="#FE7F2D"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradientM1)"
                  />
                  <Line
                    type="monotone"
                    dataKey="m2"
                    name="Pembanding 1"
                    stroke="#0284C7"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="m3"
                    name="Pembanding 2"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="m4"
                    name="Pembanding 3"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Chart Indicator Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-neutral-dark/10 text-xs font-semibold">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FE7F2D]"></span>
                <span className="text-primary-dark">Seri 1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
                <span className="text-neutral-dark/70">Seri 2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span className="text-neutral-dark/70">Seri 3</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                <span className="text-neutral-dark/70">Seri 4</span>
              </div>
            </div>

            <span className="text-[11px] text-neutral-dark/60 font-medium capitalize">
              Tampilan Filter: {trendPeriod}
            </span>
          </div>
        </div>

        {/* Right (5 Columns): Porsi Omzet with Period Selector (Default: Mingguan) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-dark/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-primary-dark flex items-center gap-2">
                <PieChartIcon size={18} className="text-primary" />
                <span>Omzet</span>
              </h2>

              {/* PERBAIKAN 2: Tombol Pilihan Porsi Omzet (Default: Mingguan) */}
              <PeriodSelector value={omzetPeriod} onChange={setOmzetPeriod} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-3">
              {/* Donut Chart */}
              <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <RechartsTooltip
                      formatter={(val: number) => [formatRupiah(val), "Omzet"]}
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        fontSize: "12px",
                      }}
                    />
                    <Pie
                      data={currentOmzetDonut}
                      cx="50%"
                      cy="50%"
                      innerRadius={44}
                      outerRadius={64}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {currentOmzetDonut.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                  <span className="text-[9px] uppercase font-bold text-neutral-dark/50">
                    Filter
                  </span>
                  <span className="text-xs font-black text-primary-dark capitalize">
                    {omzetPeriod}
                  </span>
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-2.5 w-full sm:w-auto">
                {currentOmzetDonut.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between sm:justify-start gap-4 text-xs font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="text-neutral-dark font-semibold">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-primary-dark ml-auto">
                      {formatRupiah(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-dark/10">
            <Link
              href="/riwayat"
              className="w-full py-2.5 px-4 rounded-2xl bg-neutral-bg hover:bg-neutral-bg/80 text-primary-dark font-bold text-xs text-center transition-all flex items-center justify-center gap-2 border border-neutral-dark/10"
            >
              <span>Lihat Detail Laporan ({omzetPeriod})</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. ROW 3: OPERATIONAL INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Top Produk Terlaris Leaderboard */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-dark/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Flame size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-primary-dark">
                    Ranking Produk Terlaris
                  </h2>
                  <p className="text-xs text-neutral-dark/60">
                    Berdasarkan unit yang paling banyak terjual hari ini
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Top 4
              </span>
            </div>

            <div className="space-y-4">
              {topProducts.map((prod, index) => {
                const percent = Math.min(
                  Math.max(Math.round((prod.qty / maxProductQty) * 100), 10),
                  100
                );
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                      <div className="flex items-center gap-2 truncate max-w-[220px] sm:max-w-[300px]">
                        <span className={`w-5 h-5 rounded-md text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                          index === 0 ? "bg-amber-100 text-amber-800" :
                          index === 1 ? "bg-slate-200 text-slate-700" :
                          index === 2 ? "bg-orange-100 text-orange-800" :
                          "bg-neutral-bg text-neutral-dark/60"
                        }`}>
                          #{index + 1}
                        </span>
                        <span className="text-primary-dark font-bold truncate">
                          {prod.nama}
                        </span>
                      </div>
                      <span className="text-primary font-black shrink-0">
                        {prod.qty} Terjual
                      </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-2.5 bg-neutral-bg rounded-full overflow-hidden border border-neutral-dark/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary via-primary-light to-amber-400 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-dark/10">
            <Link
              href="/transaksi"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>Buka Menu Kasir & Tambah Produk</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right: Rincian Struktur Biaya & Laba Bersih with Period Selector (Default: Harian) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-dark/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-primary-dark">
                    Struktur Laba & Arus Kas
                  </h2>
                  <p className="text-xs text-neutral-dark/60">
                    Kalkulasi ({currentLaba.label})
                  </p>
                </div>
              </div>

              {/* PERBAIKAN 3: Tombol Pilihan Struktur Laba (Default: Harian) */}
              <PeriodSelector value={labaPeriod} onChange={setLabaPeriod} />
            </div>

            {/* Breakdown Items */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-neutral-dark/70 font-semibold">(+) Total Omzet ({currentLaba.label})</span>
                <span className="font-extrabold text-primary-dark">
                  {formatRupiah(currentLaba.omzet)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-neutral-dark/70 font-semibold">(-) Total Biaya Modal (HPP)</span>
                <span className="font-extrabold text-rose-600">
                  - {formatRupiah(currentLaba.hpp)}
                </span>
              </div>

              {/* Visual Proportion Bar */}
              <div className="w-full h-3 bg-neutral-bg rounded-full overflow-hidden flex my-2 border border-neutral-dark/10">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${currentProfitMargin}%` }}
                  title={`Laba Bersih: ${currentProfitMargin}%`}
                ></div>
                <div
                  className="bg-rose-400 h-full transition-all"
                  style={{ width: `${currentHppPercent}%` }}
                  title={`HPP Modal: ${currentHppPercent}%`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-dark/60 font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Laba Bersih ({currentProfitMargin}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Biaya Modal HPP ({currentHppPercent}%)
                </span>
              </div>

              {/* Net Profit Highlight Box */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between mt-3">
                <div>
                  <span className="text-xs font-bold text-emerald-800 block">
                    Uang Bersih ({currentLaba.label})
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight mt-0.5 block">
                    {formatRupiah(currentLaba.bersih)}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <Wallet size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-dark/10">
            <Link
              href="/pengeluaran"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>Catat Pengeluaran Dadakan atau Belanja Modal</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}





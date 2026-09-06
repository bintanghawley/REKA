"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Wallet,
  TrendingUp,
  TrendingDown,
  Package,
  Search,
  ChevronRight,
  Flame,
  PlusCircle,
  PieChart as PieChartIcon,
  Activity,
  Coins,
  Menu,
  X,
  Calendar,
  Sparkles,
  ShieldCheck,
  Edit,
  Filter,
  Layers,
  Image as ImageIcon,
  DollarSign,
  HelpCircle,
  Check,
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
import { formatRupiah } from "@/lib/utils";

// PRESET FOTO PRODUK ASLI REKA
const PRESET_PHOTOS = [
  {
    label: "Nasi Goreng Jawa",
    url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80",
    category: "Makanan",
    harga_jual: 20000,
    hpp: 12000,
  },
  {
    label: "Kentang Goreng",
    url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80",
    category: "Snack",
    harga_jual: 20000,
    hpp: 10000,
  },
  {
    label: "Bakso Bakar",
    url: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&auto=format&fit=crop&q=80",
    category: "Makanan",
    harga_jual: 20000,
    hpp: 11000,
  },
  {
    label: "Dimsum Ayam",
    url: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&auto=format&fit=crop&q=80",
    category: "Snack",
    harga_jual: 20000,
    hpp: 13000,
  },
  {
    label: "Es Teh Manis",
    url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80",
    category: "Minuman",
    harga_jual: 5000,
    hpp: 2000,
  },
  {
    label: "Kopi Hitam",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80",
    category: "Minuman",
    harga_jual: 10000,
    hpp: 4000,
  },
];

// DONUT CHART COLORS
const DONUT_COLORS = ["#f35b22", "#8bc5f3", "#88d2c3", "#c678dd"];

// --- 1. HEADER & NAVBAR ---
export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf8]/95 backdrop-blur-md border-b border-[#e4e5e1] h-16 shadow-[rgba(24,25,22,0.02)_0px_2px_1px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Brand Logo & Eyebrow */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="REKA"
              loading="lazy"
              decoding="async"
              className="h-7 w-auto object-contain"
            />
          </Link>
          <span className="hidden sm:inline-block font-mono text-[11px] font-medium tracking-[0.88px] text-[#6e6f6c] uppercase border-l border-[#e4e5e1] pl-3">
            SISTEM KASIR UMKM
          </span>
        </div>

        {/* Centered Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] sm:text-[14px] font-medium text-[#141415]">
          <a href="#fitur-kasir" className="hover:text-[#f35b22] transition-colors">
            Kasir POS
          </a>
          <a href="#fitur-dashboard" className="hover:text-[#f35b22] transition-colors">
            Laporan Laba
          </a>
          <a href="#fitur-pengeluaran" className="hover:text-[#f35b22] transition-colors">
            Pengeluaran
          </a>
          <a href="#fitur-produk" className="hover:text-[#f35b22] transition-colors">
            Katalog Produk
          </a>
          <a href="#fitur-riwayat" className="hover:text-[#f35b22] transition-colors">
            Riwayat
          </a>
          <a href="#faq" className="hover:text-[#f35b22] transition-colors">
            Bantuan
          </a>
        </nav>

        {/* Auth Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/login"
            className="text-[14px] font-medium text-[#141415] hover:bg-[#f0f0ef] px-4 py-2 rounded-[4px] border border-[#d9d9d9] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="bg-[#f35b22] hover:bg-[#ff5e24] text-white text-[14px] font-medium px-5 py-2 rounded-[4px] shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-all"
          >
            Mulai Pakai Gratis
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-[4px] text-[#141415] hover:bg-[#f0f0ef] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#ffffff] border-b border-[#e4e5e1] px-6 py-4 space-y-3 shadow-md animate-fade-in">
          <a
            href="#fitur-kasir"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Kasir POS (/transaksi)
          </a>
          <a
            href="#fitur-dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Laporan Laba (/dashboard)
          </a>
          <a
            href="#fitur-pengeluaran"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Pengeluaran (/pengeluaran)
          </a>
          <a
            href="#fitur-produk"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Katalog Produk (/produk)
          </a>
          <a
            href="#fitur-riwayat"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Riwayat Aktivitas (/riwayat)
          </a>
          <div className="pt-3 border-t border-[#e4e5e1] flex gap-2">
            <Link
              href="/login"
              className="flex-1 text-center py-2 text-[14px] font-medium text-[#141415] border border-[#d9d9d9] rounded-[4px]"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center bg-[#f35b22] text-white text-[14px] font-medium py-2 rounded-[4px]"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// --- 2. HERO INTERACTIVE POS SIMULATOR (100% SESUAI DENGAN /transaksi) ---
export function HeroPOSSimulator() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [index: number]: number }>({
    0: 2, // 2x Nasi Goreng Jawa
    4: 2, // 2x Es Teh Manis
  });
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const categories = ["Semua", "Makanan", "Minuman", "Snack"];

  const filtered = PRESET_PHOTOS.filter((item) => {
    const matchCat =
      selectedCategory === "Semua" || item.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      item.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (index: number) => {
    setCart((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }));
    setFeedback(null);
  };

  const updateQty = (index: number, newQty: number) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (newQty <= 0) {
        delete copy[index];
      } else {
        copy[index] = newQty;
      }
      return copy;
    });
    setFeedback(null);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
    setFeedback(null);
  };

  const clearCart = () => {
    setCart({});
    setFeedback(null);
  };

  // Kalkulasi Finansial
  const cartEntries = Object.entries(cart);
  const totalItemCount = cartEntries.reduce((acc, [, qty]) => acc + qty, 0);

  let totalOmzet = 0;
  let totalHpp = 0;

  cartEntries.forEach(([idxStr, qty]) => {
    const item = PRESET_PHOTOS[Number(idxStr)];
    if (item) {
      totalOmzet += item.harga_jual * qty;
      totalHpp += item.hpp * qty;
    }
  });

  const totalLabaKotor = totalOmzet - totalHpp;

  const handleSimpanTransaksi = () => {
    if (totalItemCount === 0) {
      setFeedback({ type: "error", message: "Keranjang transaksi masih kosong!" });
      return;
    }
    setFeedback({
      type: "success",
      message: `Berhasil menyimpan transaksi (${totalItemCount} item) ke database! Omzet dan laba kotor langsung tercatat di rekap harian warung.`,
    });
    setTimeout(() => {
      setFeedback(null);
      setCart({ 2: 1, 5: 1 }); // Reset to a sample state
    }, 4000);
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto mt-10 text-left relative" id="demo-kasir">
      {/* Toast Feedback Notification persis di aplikasi */}
      {feedback && (
        <div
          className={`mb-4 flex items-center gap-2.5 px-4 py-3 rounded-[4px] shadow-sm border text-xs font-mono transition-all ${
            feedback.type === "success"
              ? "bg-[#eef8f0] border-[#62b06d] text-[#165424]"
              : "bg-[#fdeaea] border-[#f67976] text-[#be400f]"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={16} className="text-[#62b06d] shrink-0" />
          ) : (
            <AlertTriangle size={16} className="text-[#f67976] shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 1. EXECUTIVE HEADER BANNER PERSIS /transaksi */}
      <div className="bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col md:flex-row md:items-center justify-between gap-5 relative mb-6">
        <div className="space-y-1.5 z-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#f35b22] font-semibold">
            [ SIMULASI KASIR POS REAL-TIME ]
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#141415] tracking-tight leading-[1.2]">
            Catat Setiap <span className="text-[#f35b22]">Transaksi</span>
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#6e6f6c] leading-[1.5] max-w-xl font-normal">
            Sistem Kasir POS harian. Klik atau pilih produk dari katalog menu untuk menambahkan ke keranjang dan catat omzet serta laba secara otomatis ke database.
          </p>
        </div>

        {/* Right side Search Input */}
        <div className="w-full md:w-auto z-10 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c89]"
            />
            <input
              type="text"
              placeholder="Cari Produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fafaf8] text-[#141415] placeholder-[#8c8c89] border border-[#e4e5e1] rounded-[4px] pl-9 pr-3.5 py-2 text-xs sm:text-sm font-normal focus:outline-none focus:border-[#f35b22] transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. POS MAIN WORKSPACE: LEFT CATALOG + RIGHT CART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT SECTION (7-8 COLUMNS): CATEGORY TABS & MENU CATALOG */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-[4px] font-mono text-xs transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? "bg-[#f35b22] text-white border-[#f35b22] font-medium shadow-xs"
                      : "bg-[#ffffff] text-[#6e6f6c] hover:bg-[#f0f0ef] hover:text-[#141415] border-[#e4e5e1]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
            <span className="font-mono text-[11px] text-[#8c8c89] ml-auto hidden sm:inline">
              Klik menu untuk catat
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {filtered.map((prod) => {
              const realIndex = PRESET_PHOTOS.findIndex(
                (p) => p.label === prod.label
              );
              const qtyInCart = cart[realIndex] || 0;

              return (
                <div
                  key={prod.label}
                  onClick={() => addToCart(realIndex)}
                  className={`bg-[#ffffff] rounded-[12px] p-3.5 border transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] ${
                    qtyInCart > 0
                      ? "border-[#f35b22] ring-1 ring-[#f35b22]/30 shadow-sm"
                      : "border-[#e4e5e1] hover:border-[#f35b22]/50 hover:shadow-sm"
                  }`}
                >
                  <div>
                    {/* Product Image */}
                    <div className="w-full h-28 rounded-[8px] overflow-hidden bg-[#f0f0ef] mb-2.5 relative border border-[#e4e5e1] flex items-center justify-center">
                      <img
                        src={prod.url}
                        alt={prod.label}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {qtyInCart > 0 && (
                        <div className="absolute bottom-2 right-2 bg-[#f35b22] text-white font-mono text-xs font-bold px-2 py-0.5 rounded-[2px] shadow-xs">
                          x{qtyInCart}
                        </div>
                      )}
                    </div>

                    {/* Title & Price */}
                    <h3 className="font-semibold text-[#141415] text-xs sm:text-sm tracking-tight line-clamp-1">
                      {prod.label}
                    </h3>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="font-mono text-xs sm:text-sm font-semibold text-[#f35b22]">
                        {formatRupiah(prod.harga_jual)}
                      </span>
                      <span className="font-mono text-[10px] text-[#454542] bg-[#f0f0ef] px-1.5 py-0.5 rounded-[2px] border border-[#e4e5e1]">
                        {prod.category}
                      </span>
                    </div>
                  </div>

                  {/* Quick Add Button & HPP Modal */}
                  <div className="mt-3 pt-2 border-t border-[#e4e5e1] flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] sm:text-[11px] text-[#8c8c89]">
                      HPP: {formatRupiah(prod.hpp)}
                    </span>
                    <button
                      type="button"
                      className={`px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-medium flex items-center gap-1 transition-all ${
                        qtyInCart > 0
                          ? "bg-[#f35b22] text-white"
                          : "bg-transparent hover:bg-[#f0f0ef] border border-[#d9d9d9] text-[#141415]"
                      }`}
                    >
                      <Plus size={12} />
                      <span>Pilih</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION (4-5 COLUMNS): ORDER CART / TRANSAKSI SUMMARY PANEL */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#ffffff] rounded-[12px] p-4 sm:p-5 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] space-y-4">
          {/* Cart Header */}
          <div className="flex items-center justify-between border-b border-[#e4e5e1] pb-3">
            <div className="flex items-center gap-2">
              <Receipt size={16} className="text-[#f35b22]" />
              <h3 className="text-sm sm:text-base font-semibold text-[#141415] tracking-tight">
                Transaksi Kasir
              </h3>
            </div>

            {cartEntries.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="font-mono text-xs text-[#f67976] hover:underline"
              >
                [Kosongkan]
              </button>
            )}
          </div>

          {/* Cart Items List */}
          {cartEntries.length === 0 ? (
            <div className="text-center py-8 px-4 bg-[#fafaf8] rounded-[8px] border border-[#e4e5e1] space-y-1.5 font-mono">
              <ShoppingBag size={24} className="mx-auto text-[#8c8c89]" />
              <p className="text-xs font-medium text-[#141415]">
                Keranjang Masih Kosong
              </p>
              <p className="text-[11px] text-[#6e6f6c] font-sans">
                Klik produk di katalog kiri untuk menambahkan item ke transaksi ini.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-none divide-y divide-[#e4e5e1]">
              {cartEntries.map(([idxStr, qty]) => {
                const realIndex = Number(idxStr);
                const prod = PRESET_PHOTOS[realIndex];
                if (!prod) return null;

                return (
                  <div
                    key={prod.label}
                    className="pt-2 first:pt-0 flex items-center justify-between gap-2 text-xs"
                  >
                    {/* Item Thumbnail & Info */}
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-9 h-9 rounded-[4px] overflow-hidden bg-[#f0f0ef] shrink-0 border border-[#e4e5e1]">
                        <img
                          src={prod.url}
                          alt={prod.label}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-[#141415] truncate">
                          {prod.label}
                        </p>
                        <p className="font-mono text-[11px] text-[#f35b22] font-semibold">
                          {formatRupiah(prod.harga_jual)}
                        </p>
                      </div>
                    </div>

                    {/* Qty Stepper Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex items-center bg-[#f0f0ef] rounded-[4px] border border-[#e4e5e1]">
                        <button
                          type="button"
                          onClick={() => updateQty(realIndex, qty - 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#6e6f6c] hover:text-[#141415] transition-all"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-5 text-center font-mono text-xs font-semibold text-[#141415]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(realIndex, qty + 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#6e6f6c] hover:text-[#141415] transition-all"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(realIndex)}
                        className="text-[#f67976] hover:text-[#be400f] p-1 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Financial Calculation Box */}
          <div className="bg-[#fafaf8] rounded-[8px] p-3.5 border border-[#e4e5e1] space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[#6e6f6c]">
              <span>Total Item ({totalItemCount})</span>
              <span className="font-semibold text-[#141415]">{cartEntries.length} Jenis</span>
            </div>
            <div className="flex items-center justify-between text-[#6e6f6c]">
              <span>Estimasi Laba Kotor:</span>
              <span className="font-semibold text-[#165424]">
                +{formatRupiah(totalLabaKotor)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#e4e5e1] flex items-center justify-between">
              <span className="font-sans font-semibold text-[#141415] text-sm">Total Omzet:</span>
              <span className="font-mono text-base font-semibold text-[#141415]">
                {formatRupiah(totalOmzet)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleSimpanTransaksi}
              disabled={totalItemCount === 0}
              className="w-full bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium py-2.5 px-4 rounded-[4px] text-xs sm:text-sm shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShoppingBag size={15} />
              <span>Simpan Transaksi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. DASHBOARD KPI & ANALYTICS SHOWCASE (100% SESUAI DENGAN /dashboard) ---
export function DashboardKpiShowcase() {
  const [trendPeriod, setTrendPeriod] = useState<"harian" | "mingguan" | "bulanan" | "tahunan">("mingguan");
  const [omzetPeriod, setOmzetPeriod] = useState<"harian" | "mingguan" | "bulanan" | "tahunan">("mingguan");
  const [labaPeriod, setLabaPeriod] = useState<"harian" | "mingguan" | "bulanan" | "tahunan">("harian");

  const weeklyTrendData = [
    { label: "Sen", m1: 18, m2: 12, m3: 15, m4: 10 },
    { label: "Sel", m1: 24, m2: 16, m3: 18, m4: 14 },
    { label: "Rab", m1: 22, m2: 19, m3: 14, m4: 16 },
    { label: "Kam", m1: 30, m2: 24, m3: 20, m4: 18 },
    { label: "Jum", m1: 38, m2: 29, m3: 27, m4: 22 },
    { label: "Sab", m1: 48, m2: 42, m3: 39, m4: 35 },
    { label: "Min", m1: 45, m2: 38, m3: 35, m4: 31 },
  ];

  const omzetDonutData = [
    { name: "Makanan", value: 850000, color: "#f35b22" },
    { name: "Minuman", value: 380000, color: "#8bc5f3" },
    { name: "Snack", value: 220000, color: "#88d2c3" },
  ];

  const topProducts = [
    { nama: "Nasi Goreng Jawa", qty: 26 },
    { nama: "Es Teh Manis", qty: 22 },
    { nama: "Kentang Goreng", qty: 15 },
    { nama: "Dimsum Ayam", qty: 12 },
  ];

  const maxProductQty = 26;

  return (
    <div className="w-full space-y-6 text-[#141415] text-left font-sans">
      {/* 1. EXECUTIVE HEADER STATUS BAR */}
      <div className="bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col md:flex-row md:items-center justify-between gap-5 relative">
        <div className="space-y-1.5 z-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#f35b22] font-semibold">
            [ RINGKASAN USAHA & LABA BERSIH ]
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#141415] tracking-tight leading-[1.2]">
            Kedai Berkah Nusantara
          </h3>
          <p className="text-[13px] sm:text-[14px] text-[#6e6f6c] leading-[1.5] max-w-xl font-normal">
            Laporan operasional real-time per{" "}
            <span className="font-medium text-[#141415]">Bulan Maret 2026</span>. Pantau margin keuntungan dan penjualan barang secara akurat.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <span className="font-mono text-[11px] font-medium text-[#165424] bg-[#eef8f0] border border-[#62b06d] px-3 py-1.5 rounded-[4px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#62b06d] animate-pulse"></span>
            KASIR ONLINE
          </span>
        </div>
      </div>

      {/* 2. 4-COLUMN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#8c8c89]">
              Omzet Hari Ini
            </span>
            <Coins size={16} className="text-[#f35b22]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-[26px] font-semibold text-[#141415] tracking-tight">
              Rp 1.450.000
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-[#62b06d] font-medium">
              <TrendingUp size={13} />
              <span>• 48 Transaksi dicatat</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#8c8c89]">
              Laba Bersih
            </span>
            <Sparkles size={16} className="text-[#62b06d]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-[26px] font-semibold text-[#165424] tracking-tight">
              Rp 745.000
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-[#165424] font-medium">
              <span className="bg-[#eef8f0] border border-[#62b06d] text-[#165424] px-1.5 py-0.5 rounded-[2px]">
                Margin 51%
              </span>
              <span>(Siap Ambil)</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#8c8c89]">
              Modal Bahan (HPP)
            </span>
            <Package size={16} className="text-[#6e6f6c]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-[26px] font-semibold text-[#141415] tracking-tight">
              Rp 620.000
            </div>
            <div className="mt-1 font-mono text-[11px] text-[#8c8c89]">
              Wajib diputar kembali
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#8c8c89]">
              Biaya Operasional
            </span>
            <Wallet size={16} className="text-[#f67976]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-[26px] font-semibold text-[#f67976] tracking-tight">
              Rp 85.000
            </div>
            <div className="mt-1 font-mono text-[11px] text-[#8c8c89]">
              3x pengeluaran dadakan
            </div>
          </div>
        </div>
      </div>

      {/* 3. DUAL ANALYTICS: TREN TRANSAKSI & PORSI OMZET */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Tren Transaksi Chart */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[#141415] flex items-center gap-2 tracking-tight">
                  <Activity size={16} className="text-[#f35b22]" />
                  <span>Tren Transaksi</span>
                </h3>
                <p className="font-mono text-[11px] text-[#6e6f6c] mt-0.5">
                  Frekuensi & pola grafik penjualan harian
                </p>
              </div>

              <div className="inline-flex items-center p-0.5 bg-[#f0f0ef] rounded-[4px] border border-[#e4e5e1] text-xs">
                {(["harian", "mingguan", "bulanan", "tahunan"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setTrendPeriod(opt)}
                    className={`px-2.5 py-1 rounded-[4px] font-mono text-[11px] font-medium capitalize transition-all ${
                      trendPeriod === opt
                        ? "bg-[#f35b22] text-white shadow-xs"
                        : "text-[#6e6f6c] hover:text-[#141415]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyTrendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradientTrendLanding" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f35b22" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#f35b22" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e5e1" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="#8c8c89"
                    fontSize={11}
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={{ stroke: "#e4e5e1" }}
                  />
                  <YAxis
                    stroke="#8c8c89"
                    fontSize={11}
                    fontFamily="monospace"
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
                      fontFamily: "monospace",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="m1"
                    name="Minggu 1"
                    stroke="#f35b22"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradientTrendLanding)"
                  />
                  <Line
                    type="monotone"
                    dataKey="m2"
                    name="Minggu 2"
                    stroke="#8bc5f3"
                    strokeWidth={1.75}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="m3"
                    name="Minggu 3"
                    stroke="#88d2c3"
                    strokeWidth={1.75}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="m4"
                    name="Minggu 4"
                    stroke="#c678dd"
                    strokeWidth={1.75}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-[#e4e5e1] text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#f35b22]"></span>
                <span className="font-mono text-[11px] font-medium text-[#141415]">Minggu Ini</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#8bc5f3]"></span>
                <span className="font-mono text-[11px] font-medium text-[#6e6f6c]">Minggu Lalu</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-[#8c8c89]">
              Filter: {trendPeriod}
            </span>
          </div>
        </div>

        {/* Porsi Omzet Donut */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-[#141415] flex items-center gap-2 tracking-tight">
                <PieChartIcon size={16} className="text-[#f35b22]" />
                <span>Porsi Omzet</span>
              </h3>

              <div className="inline-flex items-center p-0.5 bg-[#f0f0ef] rounded-[4px] border border-[#e4e5e1] text-xs">
                {(["harian", "mingguan", "bulanan"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setOmzetPeriod(opt)}
                    className={`px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-medium capitalize transition-all ${
                      omzetPeriod === opt
                        ? "bg-[#f35b22] text-white shadow-xs"
                        : "text-[#6e6f6c] hover:text-[#141415]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-2">
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <RechartsTooltip
                      formatter={(val: number) => [formatRupiah(val), "Omzet"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e4e5e1",
                        fontSize: "12px",
                        fontFamily: "monospace",
                      }}
                    />
                    <Pie
                      data={omzetDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {omzetDonutData.map((entry, index) => (
                        <Cell key={`cell-landing-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#8c8c89]">
                    Kategori
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#141415]">
                    3 Jenis
                  </span>
                </div>
              </div>

              <div className="space-y-2 w-full sm:w-auto">
                {omzetDonutData.map((item, idx) => (
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

          <div className="pt-3.5 border-t border-[#e4e5e1]">
            <span className="font-mono text-[11px] text-[#6e6f6c] block">
              Rumus: Omzet (1.450k) - HPP (620k) - Biaya (85k) = <strong className="text-[#165424]">Rp 745.000 Laba Bersih</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4. OPERATIONAL INTELLIGENCE: TOP PRODUCTS + STRUKTUR LABA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Top 4 Ranking Produk Terlaris */}
        <div className="lg:col-span-6 bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[#f35b22]" />
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#141415] tracking-tight">
                    Ranking Produk Terlaris
                  </h3>
                  <p className="font-mono text-[11px] text-[#6e6f6c]">
                    Berdasarkan unit yang paling banyak terjual hari ini
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-medium text-[#f35b22] bg-[#ffcab5] border border-[#f77c55] px-2 py-0.5 rounded-[4px]">
                Top 4
              </span>
            </div>

            <div className="space-y-3">
              {topProducts.map((prod, index) => {
                const percent = Math.round((prod.qty / maxProductQty) * 100);
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-2 truncate">
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

                    <div className="w-full h-2 bg-[#f0f0ef] rounded-[2px] overflow-hidden border border-[#e4e5e1]">
                      <div
                        className="h-full rounded-[2px] bg-[#f35b22] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Struktur Laba & Arus Kas */}
        <div className="lg:col-span-6 bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#62b06d]" />
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#141415] tracking-tight">
                    Struktur Laba & Arus Kas
                  </h3>
                  <p className="font-mono text-[11px] text-[#6e6f6c]">
                    Pemisahan modal bahan baku vs laba murni
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#6e6f6c] font-normal">(+) Total Omzet Penjualan</span>
                <span className="font-mono font-semibold text-[#141415]">
                  Rp 1.450.000
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#6e6f6c] font-normal">(-) Total Biaya Modal (HPP)</span>
                <span className="font-mono font-semibold text-[#f67976]">
                  - Rp 620.000
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#6e6f6c] font-normal">(-) Pengeluaran Dadakan</span>
                <span className="font-mono font-semibold text-[#f67976]">
                  - Rp 85.000
                </span>
              </div>

              {/* Proportion Bar */}
              <div className="w-full h-2.5 bg-[#f0f0ef] rounded-[2px] overflow-hidden flex my-2 border border-[#e4e5e1]">
                <div
                  className="bg-[#62b06d] h-full"
                  style={{ width: "51%" }}
                ></div>
                <div
                  className="bg-[#f67976] h-full"
                  style={{ width: "49%" }}
                ></div>
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] text-[#6e6f6c]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-[2px] bg-[#62b06d]"></span>
                  Laba Bersih (51%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-[2px] bg-[#f67976]"></span>
                  Modal & Beban (49%)
                </span>
              </div>

              {/* Highlight Net Profit Card */}
              <div className="bg-[#eef8f0] border border-[#62b06d] rounded-[8px] p-3.5 flex items-center justify-between mt-2.5">
                <div>
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#165424] block">
                    Uang Bersih (Aman Dibawa Pulang)
                  </span>
                  <span className="text-xl sm:text-2xl font-semibold text-[#165424] font-mono tracking-tight mt-0.5 block">
                    Rp 745.000
                  </span>
                </div>
                <div className="w-9 h-9 rounded-[4px] bg-[#62b06d] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Wallet size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 4. QUICK EXPENSE SHOWCASE (100% SESUAI DENGAN /pengeluaran) ---
export function QuickExpenseShowcase() {
  const [activeTab, setActiveTab] = useState<"catat" | "riwayat">("catat");
  const [kategori, setKategori] = useState("Bahan Baku");
  const [nominal, setNominal] = useState("35000");
  const [tanggal, setTanggal] = useState("2026-03-05");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [expenses, setExpenses] = useState([
    { id: "1", kategori: "Beli Es Batu Kristal", nominal: 15000, tanggal: "2026-03-05" },
    { id: "2", kategori: "Gas Elpiji 3kg", nominal: 22000, tanggal: "2026-03-05" },
    { id: "3", kategori: "Plastik Kresek & Sedotan", nominal: 18000, tanggal: "2026-03-05" },
    { id: "4", kategori: "Bensin Antar Pesanan", nominal: 30000, tanggal: "2026-03-04" },
  ]);

  const quickCategories = [
    { label: "Bahan Baku", emoji: "🛒" },
    { label: "Bensin / Transport", emoji: "⛽" },
    { label: "Listrik / Gas / Air", emoji: "💡" },
    { label: "Kemasan & Plastik", emoji: "📦" },
    { label: "Makan Karyawan", emoji: "🍽️" },
    { label: "Kebersihan", emoji: "🧹" },
  ];

  const quickAmounts = [10000, 20000, 50000, 100000];

  const handleAddAmount = (amt: number) => {
    const curr = Number(nominal) || 0;
    setNominal(String(curr + amt));
    setFeedback(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kategori.trim() || !nominal || Number(nominal) <= 0) {
      setFeedback({ type: "error", message: "Kategori dan nominal harus diisi valid!" });
      return;
    }

    const newExp = {
      id: String(Date.now()),
      kategori,
      nominal: Number(nominal),
      tanggal,
    };

    setExpenses([newExp, ...expenses]);
    setFeedback({
      type: "success",
      message: `Berhasil mencatat pengeluaran "${kategori}" (${formatRupiah(Number(nominal))})! Laba bersih hari ini diperbarui.`,
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const totalPengeluaran = expenses.reduce((sum, item) => sum + item.nominal, 0);

  return (
    <div className="w-full space-y-6 text-[#141415] text-left font-sans">
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Total Pengeluaran
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#f67976]/10 text-[#f67976] border border-[#f67976]/20 flex items-center justify-center font-bold">
              <TrendingDown size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl sm:text-[26px] font-semibold text-[#141415] tracking-tight">
              {formatRupiah(totalPengeluaran)}
            </div>
            <p className="text-xs text-[#6e6f6c] mt-0.5 font-normal">
              Akumulasi biaya operasional
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Total Transaksi
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#f35b22]/10 text-[#f35b22] border border-[#f35b22]/20 flex items-center justify-center font-bold">
              <Receipt size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl sm:text-[26px] font-semibold text-[#141415] tracking-tight">
              {expenses.length} <span className="text-xs font-normal text-[#6e6f6c]">Item</span>
            </div>
            <p className="text-xs text-[#6e6f6c] mt-0.5 font-normal">
              Jumlah beban tercatat
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
              Rata-rata per Beban
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#8bc5f3]/10 text-[#0284c7] border border-[#8bc5f3]/30 flex items-center justify-center font-bold">
              <Coins size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl sm:text-[26px] font-semibold text-[#141415] tracking-tight">
              {formatRupiah(expenses.length > 0 ? Math.round(totalPengeluaran / expenses.length) : 0)}
            </div>
            <p className="text-xs text-[#6e6f6c] mt-0.5 font-normal">
              Rata-rata pengeluaran kasir
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN CARD */}
      <div className="bg-white rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] overflow-hidden flex flex-col">
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-[#e4e5e1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafaf8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-white border border-[#e4e5e1] text-[#f35b22] flex items-center justify-center font-bold shrink-0">
              <Wallet size={18} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#6e6f6c]">
                [ MODUL OPERASIONAL ]
              </div>
              <h3 className="text-base font-semibold text-[#141415] tracking-tight">
                Kelola Pengeluaran Usaha
              </h3>
            </div>
          </div>

          <div className="p-1 bg-[#f0f0ef] rounded-[4px] border border-[#e4e5e1] text-xs flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("catat")}
              className={`px-3.5 py-1.5 rounded-[4px] transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                activeTab === "catat"
                  ? "bg-white text-[#141415] border border-[#e4e5e1] shadow-xs font-semibold"
                  : "text-[#6e6f6c] hover:text-[#141415] font-medium"
              }`}
            >
              <Plus size={13} />
              <span>+ Catat Baru</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("riwayat")}
              className={`px-3.5 py-1.5 rounded-[4px] transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                activeTab === "riwayat"
                  ? "bg-white text-[#141415] border border-[#e4e5e1] shadow-xs font-semibold"
                  : "text-[#6e6f6c] hover:text-[#141415] font-medium"
              }`}
            >
              <Receipt size={13} />
              <span>Daftar Riwayat ({expenses.length})</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-[4px] text-xs font-medium flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-[#eef8f0] border border-[#62b06d] text-[#165424]"
                  : "bg-[#fdeaea] border border-[#f67976] text-[#be400f]"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 size={15} className="text-[#62b06d]" />
              ) : (
                <AlertTriangle size={15} className="text-[#f67976]" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {activeTab === "catat" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-2">
                  Pilihan Kategori Cepat
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickCategories.map(({ label, emoji }) => {
                    const isSelected = kategori === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setKategori(label)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-[#ffcab5] border-[#f35b22] text-[#d14200] font-semibold"
                            : "bg-[#fafaf8] border-[#e4e5e1] text-[#454542] hover:bg-white font-medium"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
                  Kategori / Keterangan Pengeluaran <span className="text-[#f35b22]">*</span>
                </label>
                <input
                  type="text"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  required
                  placeholder="Contoh: Beli Gas 3kg, Es Batu, Plastik Kresek..."
                  className="w-full px-3.5 py-2 bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] text-sm text-[#141415] focus:outline-none focus:border-[#f35b22] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
                  Nominal (Rp) <span className="text-[#f35b22]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[#6e6f6c] font-medium text-xs">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    required
                    min="1"
                    placeholder="25000"
                    className="w-full pl-10 pr-3.5 py-2 bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] font-mono text-sm font-semibold text-[#141415] focus:outline-none focus:border-[#f35b22] focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAddAmount(amt)}
                      className="px-2.5 py-1 bg-[#f0f0ef] hover:bg-[#e4e5e1] text-[#141415] font-mono text-xs font-medium rounded-[4px] border border-[#e4e5e1] transition-all cursor-pointer"
                    >
                      +{amt / 1000}rb
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNominal("")}
                    className="px-2 py-1 text-[#8c8c89] hover:text-[#141415] text-xs font-medium cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium text-sm rounded-[4px] shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check size={16} />
                  <span>Simpan Pengeluaran ({formatRupiah(Number(nominal) || 0)})</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white p-3.5 rounded-[8px] border border-[#e4e5e1] hover:border-[#f35b22]/30 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#141415] truncate">
                      {exp.kategori}
                    </p>
                    <p className="font-mono text-[11px] text-[#6e6f6c] mt-0.5">
                      {exp.tanggal}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm font-semibold text-[#f67976]">
                      -{formatRupiah(exp.nominal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(exp.id)}
                      className="w-7 h-7 rounded-[4px] bg-[#fafaf8] hover:bg-rose-50 text-[#8c8c89] hover:text-rose-600 border border-[#e4e5e1] flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 5. PRODUCT CATALOG SHOWCASE (100% SESUAI DENGAN /produk) ---
export function ProductCatalogShowcase() {
  const [products, setProducts] = useState([
    {
      id: "1",
      nama: "Nasi Goreng Jawa",
      harga_jual: 20000,
      hpp: 12000,
      kategori: "Makanan",
      status: "Tersedia" as const,
      foto: PRESET_PHOTOS[0].url,
    },
    {
      id: "2",
      nama: "Kentang Goreng",
      harga_jual: 20000,
      hpp: 10000,
      kategori: "Snack",
      status: "Tersedia" as const,
      foto: PRESET_PHOTOS[1].url,
    },
    {
      id: "3",
      nama: "Bakso Bakar",
      harga_jual: 20000,
      hpp: 11000,
      kategori: "Makanan",
      status: "Habis" as const,
      foto: PRESET_PHOTOS[2].url,
    },
    {
      id: "4",
      nama: "Dimsum Ayam",
      harga_jual: 20000,
      hpp: 13000,
      kategori: "Snack",
      status: "Tersedia" as const,
      foto: PRESET_PHOTOS[3].url,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = p.status === "Habis" ? "Tersedia" : "Habis";
          setFeedback(`Status "${p.nama}" diubah menjadi ${next}`);
          setTimeout(() => setFeedback(null), 3000);
          return { ...p, status: next };
        }
        return p;
      })
    );
  };

  const filtered = products.filter((p) => {
    const matchCat =
      selectedCategory === "Semua" || p.kategori === selectedCategory;
    const matchSearch =
      !searchQuery || p.nama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full space-y-5 text-[#141415] text-left font-sans">
      {feedback && (
        <div className="p-3 bg-[#eef8f0] border border-[#62b06d] text-[#165424] text-xs font-mono rounded-[4px] flex items-center gap-2">
          <CheckCircle2 size={15} className="text-[#62b06d]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e5e1]">
          <div className="flex items-center gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-[#141415] tracking-tight">
              Daftar Produk & Katalog Usaha
            </h3>
            <span className="font-mono text-[11px] font-medium text-[#f35b22] bg-[#ffcab5] border border-[#f77c55] px-2.5 py-0.5 rounded-[4px]">
              {products.length} Menu Terdaftar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium px-3.5 py-1.5 rounded-[4px] text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Tambah Produk</span>
            </button>
          </div>
        </div>

        {/* Table layout persis /produk */}
        <div className="space-y-2.5">
          <div className="hidden sm:grid grid-cols-12 gap-4 bg-[#f0f0ef] text-[#6e6f6c] font-mono text-[11px] uppercase tracking-[0.88px] px-5 py-2.5 rounded-[4px] border border-[#e4e5e1]">
            <div className="col-span-2 text-center">Foto</div>
            <div className="col-span-5 text-left pl-1">Detail Produk</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-3 text-center">Aksi</div>
          </div>

          {filtered.map((prod) => {
            const isHabis = prod.status === "Habis";
            return (
              <div
                key={prod.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center bg-[#ffffff] hover:bg-[#fafaf8] border border-[#e4e5e1] rounded-[8px] p-3 transition-all group"
              >
                {/* Foto */}
                <div className="sm:col-span-2 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-[4px] overflow-hidden bg-[#f0f0ef] border border-[#e4e5e1] shrink-0">
                    <img
                      src={prod.foto}
                      alt={prod.nama}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Detail */}
                <div className="sm:col-span-5 space-y-1 text-left">
                  <h4 className="text-sm font-semibold text-[#141415] tracking-tight">
                    {prod.nama}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-xs text-[#f35b22]">
                      {formatRupiah(prod.harga_jual)}
                    </span>
                    <span className="font-mono text-[10px] text-[#454542] bg-[#f0f0ef] border border-[#e4e5e1] px-2 py-0.5 rounded-[4px]">
                      {prod.kategori}
                    </span>
                    <span className="font-mono text-[10px] text-[#8c8c89]">
                      HPP: {formatRupiah(prod.hpp)}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="sm:col-span-2 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => toggleStatus(prod.id)}
                    title="Klik untuk mengubah status stok"
                    className={`px-3 py-1 rounded-[4px] font-mono text-[11px] font-medium transition-all cursor-pointer border ${
                      isHabis
                        ? "bg-[#fdeaea] text-[#be400f] border-[#f67976]"
                        : "bg-[#eef8f0] text-[#165424] border-[#62b06d]"
                    }`}
                  >
                    {prod.status}
                  </button>
                </div>

                {/* Aksi */}
                <div className="sm:col-span-3 flex items-center justify-center gap-2 pt-2 sm:pt-0">
                  <span className="inline-flex items-center gap-1 bg-transparent text-[#141415] font-mono font-medium px-2.5 py-1 rounded-[4px] text-xs border border-[#d9d9d9]">
                    <Edit size={12} />
                    <span>Edit</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-transparent text-[#be400f] font-mono font-medium px-2.5 py-1 rounded-[4px] text-xs border border-[#f9aea9]">
                    <Trash2 size={12} />
                    <span>Hapus</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- 6. RIWAYAT & LOG AKTIVITAS SHOWCASE (100% SESUAI DENGAN /riwayat) ---
export function RiwayatTimelineShowcase() {
  const [periode, setPeriode] = useState<"harian" | "mingguan" | "bulanan">("harian");

  const timeline = [
    {
      type: "transaksi",
      nama: "Penjualan: Nasi Goreng Jawa (x2), Es Teh Manis (x2)",
      waktu: "12:45 WIB",
      omzet: 50000,
      laba: 22000,
    },
    {
      type: "pengeluaran",
      nama: "Pengeluaran: Beli Es Batu Kristal 2 Bal",
      waktu: "11:20 WIB",
      nominal: 15000,
    },
    {
      type: "transaksi",
      nama: "Penjualan: Kentang Goreng (x1), Dimsum Ayam (x1)",
      waktu: "10:15 WIB",
      omzet: 40000,
      laba: 17000,
    },
    {
      type: "pengeluaran",
      nama: "Pengeluaran: Gas Elpiji 3kg",
      waktu: "08:30 WIB",
      nominal: 22000,
    },
  ];

  return (
    <div className="w-full space-y-5 text-[#141415] text-left font-sans">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] block">
            Omzet Penjualan
          </span>
          <p className="font-mono text-lg sm:text-xl font-semibold text-[#141415] mt-2">
            Rp 1.450.000
          </p>
          <p className="text-[11px] text-[#6e6f6c] mt-0.5">Total kotor</p>
        </div>

        <div className="bg-white p-4 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] block">
            Laba Kotor
          </span>
          <p className="font-mono text-lg sm:text-xl font-semibold text-[#165424] mt-2">
            Rp 830.000
          </p>
          <p className="text-[11px] text-[#6e6f6c] mt-0.5">Omzet - HPP</p>
        </div>

        <div className="bg-white p-4 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] block">
            Pengeluaran
          </span>
          <p className="font-mono text-lg sm:text-xl font-semibold text-[#f67976] mt-2">
            Rp 85.000
          </p>
          <p className="text-[11px] text-[#6e6f6c] mt-0.5">Biaya operasional</p>
        </div>

        <div className="bg-white p-4 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset]">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] block">
            Laba Bersih
          </span>
          <p className="font-mono text-lg sm:text-xl font-semibold text-[#165424] mt-2">
            Rp 745.000
          </p>
          <p className="text-[11px] text-[#6e6f6c] mt-0.5">Uang murni usaha</p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] overflow-hidden">
        <div className="p-4 border-b border-[#e4e5e1] bg-[#fafaf8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#6e6f6c]">
              [ LOG DETAIL AKTIVITAS HARI INI ]
            </span>
          </div>
          <span className="font-mono text-xs text-[#6e6f6c]">4 Aktivitas</span>
        </div>

        <div className="divide-y divide-[#e4e5e1]">
          {timeline.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 hover:bg-[#fafaf8] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === "transaksi"
                    ? "bg-[#8bc5f3]/10 text-[#0284c7] border border-[#8bc5f3]/30"
                    : "bg-[#f67976]/10 text-[#f67976] border border-[#f67976]/30"
                }`}>
                  {item.type === "transaksi" ? <Package size={15} /> : <Receipt size={15} />}
                </div>
                <div>
                  <p className="font-semibold text-[#141415] text-xs sm:text-sm">
                    {item.nama}
                  </p>
                  <p className="font-mono text-[11px] text-[#6e6f6c] mt-0.5">
                    Hari ini • {item.waktu}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right ml-11 sm:ml-0">
                {item.type === "transaksi" ? (
                  <>
                    <p className="font-mono font-semibold text-[#141415] text-xs sm:text-sm">
                      +{formatRupiah(item.omzet!)}
                    </p>
                    <p className="font-mono text-[11px] text-[#165424] font-medium">
                      Laba +{formatRupiah(item.laba!)}
                    </p>
                  </>
                ) : (
                  <p className="font-mono font-semibold text-[#f67976] text-xs sm:text-sm">
                    -{formatRupiah(item.nominal!)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 7. FAQ ACCORDION KHUSUS PEDAGANG ---
export function MerchantFaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah saya harus beli tablet atau mesin kasir mahal?",
      a: "Tidak perlu sama sekali! REKA dirancang sangat ringan dan responsif di smartphone Android atau laptop yang sudah Anda miliki saat ini.",
    },
    {
      q: "Apakah aplikasi ini untuk pembeli scan QRIS?",
      a: "Bukan. REKA adalah alat pencatatan cepat internal untuk pemilik dan kasir warung. Pembeli bayar seperti biasa (bisa tunai atau scan QRIS cetak di meja Anda), lalu kasir cukup ketuk menu dan klik 'Simpan Transaksi' dalam 3 detik.",
    },
    {
      q: "Bagaimana cara REKA menghitung laba bersih?",
      a: "Setiap produk memiliki modal bahan baku (HPP). Ketika transaksi disimpan, HPP dikunci otomatis. Jika Anda mencatat biaya dadakan (beli es, gas, kresek), biaya tersebut langsung memotong keuntungan hari ini. Anda langsung tahu berapa laba murni yang aman dibawa pulang.",
    },
    {
      q: "Apakah data transaksi aman jika HP saya hilang atau ganti baru?",
      a: "Sangat aman. Semua data tersimpan rapi di cloud akun Anda. Cukup buka browser dan login di HP baru, seluruh katalog produk dan riwayat transaksi langsung muncul kembali.",
    },
    {
      q: "Berapa lama waktu belajar untuk kasir baru?",
      a: "Rata-rata kurang dari 5 menit. Karena antarmukanya bersih dan tombol kasirnya sangat jelas, karyawan langsung bisa pakai tanpa perlu membaca buku panduan tebal.",
    },
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto py-10 text-left" id="faq">
      <div className="text-center mb-8">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#f35b22]">
          [ PUSAT BANTUAN // FAQ ]
        </span>
        <h2 className="text-[26px] sm:text-[32px] font-semibold text-[#141415] tracking-tight mt-1">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p className="text-[14px] text-[#6e6f6c] mt-2">
          Semua yang perlu Anda ketahui tentang kemudahan operasional REKA.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div
              key={index}
              className="bg-[#ffffff] rounded-[8px] border border-[#e4e5e1] overflow-hidden transition-all shadow-[rgba(24,25,22,0.02)_0px_1px_1px_0px]"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-medium text-[#141415] text-[14px] sm:text-[15px] hover:text-[#f35b22] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="font-mono text-[#8c8c89] text-base shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-[13px] sm:text-[14px] text-[#6e6f6c] leading-[1.6] border-t border-[#e4e5e1] pt-3.5 bg-[#fafaf8]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

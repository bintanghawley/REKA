"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Wallet,
  TrendingUp,
  Package,
  Search,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Coins,
} from "lucide-react";
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

// --- 1. HEADER & NAVBAR (DESIGN.md: 64px height, hairline border #e4e5e1, 4px radius buttons) ---
export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf8]/90 backdrop-blur-md border-b border-[#e4e5e1] h-16 shadow-[rgba(24,25,22,0.02)_0px_2px_1px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Brand Logo & Eyebrow */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="REKA"
              className="h-7 w-auto object-contain"
            />
          </Link>
          <span className="hidden sm:inline-block font-mono text-[11px] font-medium tracking-[0.88px] text-[#6e6f6c] uppercase border-l border-[#e4e5e1] pl-3">
            UMKM // SDG 8
          </span>
        </div>

        {/* Centered Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#141415]">
          <a href="#demo-kasir" className="hover:text-[#f35b22] transition-colors">
            Kasir Kilat
          </a>
          <a href="#pengeluaran" className="hover:text-[#f35b22] transition-colors">
            Catat Pengeluaran
          </a>
          <a href="#dashboard" className="hover:text-[#f35b22] transition-colors">
            Laporan Laba
          </a>
          <a href="#komparasi" className="hover:text-[#f35b22] transition-colors">
            Mengapa REKA
          </a>
          <a href="#faq" className="hover:text-[#f35b22] transition-colors">
            Tanya Jawab
          </a>
        </nav>

        {/* Auth Actions: Pair primary CTA with ghost secondary (DESIGN.md rule) */}
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
        <div className="md:hidden bg-[#ffffff] border-b border-[#e4e5e1] px-6 py-4 space-y-3 shadow-md">
          <a
            href="#demo-kasir"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Kasir Kilat
          </a>
          <a
            href="#pengeluaran"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Catat Pengeluaran
          </a>
          <a
            href="#dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Laporan Laba
          </a>
          <a
            href="#komparasi"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Mengapa REKA
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-[14px] font-medium text-[#141415] hover:text-[#f35b22]"
          >
            Tanya Jawab
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

// --- 2. HERO INTERACTIVE POS SIMULATOR (DESIGN.md: Dark CRT Terminal on Cream Canvas, 12px radius) ---
export function HeroPOSSimulator() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [index: number]: number }>({
    0: 2, // 2x Nasi Goreng Jawa
    4: 2, // 2x Es Teh Manis
  });
  const [successToast, setSuccessToast] = useState(false);

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
    setSuccessToast(false);
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
    setSuccessToast(false);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
    setSuccessToast(false);
  };

  const clearCart = () => {
    setCart({});
    setSuccessToast(false);
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
    if (totalItemCount === 0) return;
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setCart({ 2: 1, 5: 1 });
    }, 3500);
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto mt-10 text-left" id="demo-kasir">
      {/* Toast Notifikasi Persis Sesuai Aplikasi */}
      {successToast && (
        <div className="mb-4 bg-[#eef8f0] border border-[#62b06d] text-[#165424] px-4 py-3 rounded-[4px] flex items-center gap-3 shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px]">
          <CheckCircle2 size={18} className="text-[#62b06d] shrink-0" />
          <div className="font-mono text-xs">
            <p className="font-bold">
              [BERHASIL] Transaksi ({totalItemCount} item) tersimpan ke database!
            </p>
            <p className="text-[#165424]/80">
              Omzet dan laba kotor langsung tercatat di rekap harian warung.
            </p>
          </div>
        </div>
      )}

      {/* Terminal Code Panel (DESIGN.md: Background #141415, border 1px #2e2e2c, radius 12px) */}
      <div className="bg-[#141415] text-[#ffffff] rounded-[12px] border border-[#2e2e2c] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] overflow-hidden">
        {/* Terminal Header Bar with JetBrains Mono Eyebrow */}
        <div className="px-5 py-3.5 border-b border-[#2e2e2c] bg-[#1a1a1c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f67976] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffcab5] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#62b06d] inline-block" />
            </div>
            <div className="font-mono text-[11px] font-medium tracking-[0.88px] text-[#8c8c89] uppercase pl-2 border-l border-[#2e2e2c]">
              REKA // POS-TERMINAL v2.4
            </div>
          </div>

          {/* Search Box in Terminal Style */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c8c89]"
            />
            <input
              type="text"
              placeholder="Cari Menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2e2e2c] text-[#ffffff] placeholder-[#8c8c89] border border-[#454542] rounded-[4px] pl-8 pr-3 py-1.5 font-mono text-xs focus:outline-none focus:border-[#f35b22]"
            />
          </div>
        </div>

        {/* Main Terminal Grid: Left Catalog, Right Order Ticket */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 bg-[#141415]">
          {/* SISI KIRI (7 Kolom): KATALOG PRODUK */}
          <div className="lg:col-span-7 space-y-3.5">
            {/* Category Filter Pills (DESIGN.md: 4px radius, JetBrains Mono font) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-[4px] font-mono text-xs font-medium transition-colors border ${
                      isActive
                        ? "bg-[#f35b22] text-white border-[#f35b22]"
                        : "bg-[#2e2e2c] text-[#8c8c89] hover:text-[#ffffff] border-[#454542]"
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

            {/* Grid Produk */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((prod) => {
                const realIndex = PRESET_PHOTOS.findIndex(
                  (p) => p.label === prod.label
                );
                const qtyInCart = cart[realIndex] || 0;

                return (
                  <div
                    key={prod.label}
                    onClick={() => addToCart(realIndex)}
                    className={`bg-[#1c1c1e] rounded-[8px] p-3 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      qtyInCart > 0
                        ? "border-[#f35b22] shadow-[inset_0_0_0_1px_#f35b22]"
                        : "border-[#2e2e2c] hover:border-[#454542]"
                    }`}
                  >
                    <div>
                      {/* Foto Menu */}
                      <div className="w-full h-24 rounded-[4px] overflow-hidden bg-[#2e2e2c] mb-2 relative border border-[#2e2e2c]">
                        <img
                          src={prod.url}
                          alt={prod.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {qtyInCart > 0 && (
                          <div className="absolute top-1.5 right-1.5 bg-[#f35b22] text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded-[2px]">
                            x{qtyInCart}
                          </div>
                        )}
                      </div>

                      {/* Info Text */}
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] text-[#8c8c89] uppercase tracking-[0.05em]">
                          {prod.category}
                        </span>
                        <h4 className="text-xs font-semibold text-[#ffffff] line-clamp-1">
                          {prod.label}
                        </h4>
                        <p className="font-mono text-xs font-bold text-[#8bc5f3]">
                          {formatRupiah(prod.harga_jual)}
                        </p>
                      </div>
                    </div>

                    {/* Footer Info HPP Modal */}
                    <div className="mt-2.5 pt-2 border-t border-[#2e2e2c] flex items-center justify-between font-mono text-[10px] text-[#8c8c89]">
                      <span>
                        HPP: <span className="text-[#abb2bf]">{formatRupiah(prod.hpp)}</span>
                      </span>
                      <span className="text-[#f35b22] group-hover:text-[#ff5e24] font-medium">
                        +Pilih
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SISI KANAN (5 Kolom): TIKET TRANSAKSI / BON */}
          <div className="lg:col-span-5 bg-[#1a1a1c] rounded-[8px] p-4 border border-[#2e2e2c] space-y-4 flex flex-col justify-between">
            <div>
              {/* Header Tiket */}
              <div className="flex items-center justify-between border-b border-[#2e2e2c] pb-2.5">
                <div className="flex items-center gap-2">
                  <Receipt size={15} className="text-[#f35b22]" />
                  <span className="font-mono text-xs font-semibold text-[#ffffff] uppercase tracking-wider">
                    Tiket Transaksi
                  </span>
                </div>

                {cartEntries.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="font-mono text-[11px] text-[#f67976] hover:underline"
                  >
                    [Kosongkan]
                  </button>
                )}
              </div>

              {/* List Item Tiket */}
              <div className="py-2 max-h-52 overflow-y-auto space-y-2 pr-1 divide-y divide-[#2e2e2c]">
                {cartEntries.length === 0 ? (
                  <div className="text-center py-8 font-mono text-xs text-[#8c8c89] space-y-1">
                    <p>Keranjang kosong.</p>
                    <p className="text-[11px] text-[#6e6f6c]">
                      Klik salah satu menu di sebelah kiri.
                    </p>
                  </div>
                ) : (
                  cartEntries.map(([idxStr, qty]) => {
                    const realIndex = Number(idxStr);
                    const prod = PRESET_PHOTOS[realIndex];
                    if (!prod) return null;

                    return (
                      <div
                        key={prod.label}
                        className="pt-2 first:pt-0 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="overflow-hidden">
                            <p className="font-medium text-[#ffffff] truncate">
                              {prod.label}
                            </p>
                            <p className="font-mono text-[11px] text-[#8bc5f3]">
                              {formatRupiah(prod.harga_jual)}
                            </p>
                          </div>
                        </div>

                        {/* Stepper Jumlah */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center bg-[#2e2e2c] rounded-[4px] border border-[#454542]">
                            <button
                              onClick={() => updateQty(realIndex, qty - 1)}
                              className="w-5 h-5 flex items-center justify-center text-[#8c8c89] hover:text-white"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-5 text-center font-mono text-xs font-bold text-white">
                              {qty}
                            </span>
                            <button
                              onClick={() => updateQty(realIndex, qty + 1)}
                              className="w-5 h-5 flex items-center justify-center text-[#8c8c89] hover:text-white"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(realIndex)}
                            className="text-[#8c8c89] hover:text-[#f67976] p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Kotak Ringkasan Finansial dalam Gaya Syntax IDE */}
            <div className="space-y-3 pt-2">
              <div className="bg-[#141415] rounded-[4px] p-3 border border-[#2e2e2c] space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[#8c8c89]">
                  <span>Total Item ({totalItemCount})</span>
                  <span className="text-[#ffffff]">{cartEntries.length} Jenis</span>
                </div>
                <div className="flex items-center justify-between text-[#8c8c89]">
                  <span>Estimasi Laba Kotor:</span>
                  <span className="text-[#88d2c3] font-bold">
                    +{formatRupiah(totalLabaKotor)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#2e2e2c] flex items-center justify-between">
                  <span className="font-semibold text-[#ffffff]">Total Omzet:</span>
                  <span className="text-sm font-bold text-[#8bc5f3]">
                    {formatRupiah(totalOmzet)}
                  </span>
                </div>
              </div>

              {/* Tombol Simpan Transaksi (DESIGN.md: Primary CTA #f35b22, 4px radius) */}
              <button
                onClick={handleSimpanTransaksi}
                disabled={totalItemCount === 0 || successToast}
                className={`w-full py-2.5 px-4 rounded-[4px] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  successToast
                    ? "bg-[#62b06d] text-white"
                    : totalItemCount > 0
                    ? "bg-[#f35b22] hover:bg-[#ff5e24] text-white shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px]"
                    : "bg-[#2e2e2c] text-[#6e6f6c] cursor-not-allowed"
                }`}
              >
                <ShoppingBag size={14} />
                <span>
                  {successToast ? "TRANSAKSI TERSIMPAN" : "SIMPAN TRANSAKSI"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. FITUR PENGELUARAN DADAKAN INTERAKTIF (DESIGN.md: Card White #ffffff, hairline border #e4e5e1, 12px radius) ---
export function QuickExpenseShowcase() {
  const [selectedCat, setSelectedCat] = useState("Bahan Baku");
  const [amount, setAmount] = useState(35000);
  const [savedStatus, setSavedStatus] = useState(false);

  const categories = [
    { label: "Bahan Baku", emoji: "🛒" },
    { label: "Bensin / Transport", emoji: "⛽" },
    { label: "Listrik / Gas / Air", emoji: "💡" },
    { label: "Kemasan & Plastik", emoji: "📦" },
    { label: "Makan Karyawan", emoji: "🍽️" },
    { label: "Kebersihan", emoji: "🧹" },
  ];

  const quickAmounts = [10000, 20000, 50000, 100000];

  const handleSimpanBeban = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="bg-[#ffffff] rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] p-6 text-left space-y-5">
      <div className="flex items-center justify-between border-b border-[#e4e5e1] pb-3.5">
        <div className="flex items-center gap-2.5">
          <Wallet size={16} className="text-[#f35b22]" />
          <div>
            <h4 className="text-[14px] font-semibold text-[#141415]">
              Catat Pengeluaran Operasional
            </h4>
            <p className="text-[12px] text-[#6e6f6c]">
              Beli es batu, gas elpiji, atau iuran warung seketika.
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#f67976] bg-[#fdeaea] px-2 py-0.5 rounded-[2px] border border-[#f9aea9]">
          Potong Laba Harian
        </span>
      </div>

      {savedStatus && (
        <div className="bg-[#eef8f0] border border-[#62b06d] text-[#165424] px-3.5 py-2 rounded-[4px] font-mono text-xs flex items-center gap-2">
          <CheckCircle2 size={14} className="text-[#62b06d]" />
          <span>
            [OK] Pengeluaran {selectedCat} {formatRupiah(amount)} tercatat. Laba bersih hari ini diperbarui.
          </span>
        </div>
      )}

      {/* Kategori Cepat */}
      <div className="space-y-1.5">
        <label className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
          Kategori:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((c) => {
            const isSel = selectedCat === c.label;
            return (
              <button
                key={c.label}
                onClick={() => setSelectedCat(c.label)}
                className={`p-2 rounded-[4px] border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  isSel
                    ? "bg-[#ffcab5] border-[#f35b22] text-[#d14200]"
                    : "bg-[#ffffff] border-[#e4e5e1] text-[#454542] hover:bg-[#f0f0ef]"
                }`}
              >
                <span>{c.emoji}</span>
                <span className="truncate">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nominal Input & Tombol Cepat */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
            Nominal:
          </label>
          <span className="font-mono text-sm font-bold text-[#f35b22]">
            {formatRupiah(amount)}
          </span>
        </div>
        <div className="flex gap-1.5">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount((prev) => prev + amt)}
              className="flex-1 py-1 rounded-[4px] border border-[#e4e5e1] bg-[#f0f0ef] hover:bg-[#e4e5e1] font-mono text-[11px] font-medium text-[#141415] transition-colors"
            >
              +{amt / 1000}k
            </button>
          ))}
          <button
            onClick={() => setAmount(0)}
            className="px-3 py-1 rounded-[4px] border border-[#e4e5e1] bg-[#ffffff] font-mono text-[11px] text-[#8c8c89] hover:text-[#141415]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Tombol Simpan Pengeluaran (DESIGN.md: Primary CTA #f35b22) */}
      <button
        onClick={handleSimpanBeban}
        className="w-full py-2.5 rounded-[4px] bg-[#141415] hover:bg-[#2e2e2c] text-white font-mono text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <Wallet size={14} />
        <span>SIMPAN PENGELUARAN ({formatRupiah(amount)})</span>
      </button>
    </div>
  );
}

// --- 4. DASHBOARD KPI SHOWCASE (DESIGN.md: Pebble band #f0f0ef background, white cards #ffffff, hairline border #e4e5e1) ---
export function DashboardKpiShowcase() {
  return (
    <div className="bg-[#f0f0ef] rounded-[16px] p-5 sm:p-7 border border-[#e4e5e1] space-y-4 text-left">
      {/* Header Status Bar */}
      <div className="bg-[#ffffff] rounded-[8px] p-4 border border-[#e4e5e1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
            [ LAPORAN STATUS TOKO ]
          </div>
          <h4 className="text-[15px] font-semibold text-[#141415] mt-0.5">
            Kedai Kopi & Toast Berkah
          </h4>
        </div>
        <span className="font-mono text-[11px] font-medium text-[#165424] bg-[#eef8f0] border border-[#62b06d] px-2.5 py-1 rounded-[4px] shrink-0">
          • KASIR ONLINE
        </span>
      </div>

      {/* 4 Kartu KPI Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Omzet */}
        <div className="bg-[#ffffff] rounded-[8px] p-4 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.88px] text-[#8c8c89]">
              Omzet Hari Ini
            </span>
            <Coins size={15} className="text-[#f35b22]" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-[#141415] tracking-tight">
              Rp 1.450.000
            </p>
            <p className="font-mono text-[11px] text-[#62b06d] mt-1">
              48 Transaksi dicatat
            </p>
          </div>
        </div>

        {/* KPI 2: Laba Bersih */}
        <div className="bg-[#ffffff] rounded-[8px] p-4 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.88px] text-[#8c8c89]">
              Laba Bersih
            </span>
            <TrendingUp size={15} className="text-[#62b06d]" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-[#62b06d] tracking-tight">
              Rp 745.000
            </p>
            <p className="font-mono text-[11px] text-[#6e6f6c] mt-1">
              Margin 51% (Aman diambil)
            </p>
          </div>
        </div>

        {/* KPI 3: Modal HPP */}
        <div className="bg-[#ffffff] rounded-[8px] p-4 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.88px] text-[#8c8c89]">
              Modal Bahan (HPP)
            </span>
            <Package size={15} className="text-[#6e6f6c]" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-[#141415] tracking-tight">
              Rp 620.000
            </p>
            <p className="font-mono text-[11px] text-[#8c8c89] mt-1">
              Wajib diputar kembali
            </p>
          </div>
        </div>

        {/* KPI 4: Pengeluaran Dadakan */}
        <div className="bg-[#ffffff] rounded-[8px] p-4 border border-[#e4e5e1] shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.88px] text-[#8c8c89]">
              Pengeluaran Warung
            </span>
            <Wallet size={15} className="text-[#f67976]" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-[#f67976] tracking-tight">
              Rp 85.000
            </p>
            <p className="font-mono text-[11px] text-[#8c8c89] mt-1">
              3x biaya operasional
            </p>
          </div>
        </div>
      </div>

      {/* Rumus Transparansi Finansial */}
      <div className="bg-[#ffffff] rounded-[8px] p-3.5 border border-[#e4e5e1] font-mono text-xs text-[#454542] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[#141415] font-semibold">Rumus:</span>
          <span>Omzet (1.450k) - HPP (620k) - Biaya (85k) =</span>
        </div>
        <span className="font-bold text-[#62b06d] bg-[#eef8f0] px-2.5 py-0.5 rounded-[4px] border border-[#62b06d]/30">
          Rp 745.000 Laba Bersih
        </span>
      </div>
    </div>
  );
}

// --- 5. FAQ ACCORDION KHUSUS PEDAGANG (DESIGN.md: 4px radius, #e4e5e1 border, 16px 20px padding) ---
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
        <h3 className="text-[30px] font-semibold text-[#141415] tracking-[-0.6px] mt-1.5">
          Pertanyaan yang Sering Diajukan
        </h3>
        <p className="text-[14px] text-[#6e6f6c] mt-1">
          Jawaban praktis seputar penggunaan REKA untuk operasional harian warung Anda.
        </p>
      </div>

      <div className="space-y-1">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[#ffffff] border border-[#e4e5e1] rounded-[4px] transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-[#141415] text-[15px]"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f35b22]" />
                  {faq.q}
                </span>
                <span className="text-[#8c8c89] shrink-0">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-[14px] text-[#454542] leading-[1.6] border-t border-[#e4e5e1]/60">
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

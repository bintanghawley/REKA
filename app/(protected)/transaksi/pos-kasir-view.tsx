"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  History,
  Layers,
  Sparkles,
  Package,
  Receipt,
} from "lucide-react";
import type { Produk } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import { createBatchTransactionsAction } from "@/lib/actions/transaction";
import { bulkCreateProductsAction } from "@/lib/actions/product";

interface Props {
  initialProducts: Produk[];
}

export interface CartItem {
  product: Produk;
  qty: number;
}

const PRESET_PHOTOS: { label: string; url: string }[] = [
  {
    label: "Nasi Goreng",
    url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80",
  },
  {
    label: "Kentang Goreng",
    url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80",
  },
  {
    label: "Bakso / Sate",
    url: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&auto=format&fit=crop&q=80",
  },
  {
    label: "Dimsum",
    url: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&auto=format&fit=crop&q=80",
  },
  {
    label: "Es Teh / Minuman",
    url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80",
  },
  {
    label: "Kopi",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80",
  },
];

const DEFAULT_DEMO_PRODUCTS = [
  {
    nama: "Nasi Goreng Jawa",
    harga_jual: 20000,
    hpp: 12000,
    kategori: "Makanan",
    status: "Tersedia" as const,
    foto: PRESET_PHOTOS[0].url,
  },
  {
    nama: "Kentang Goreng",
    harga_jual: 20000,
    hpp: 10000,
    kategori: "Snack",
    status: "Tersedia" as const,
    foto: PRESET_PHOTOS[1].url,
  },
  {
    nama: "Bakso Bakar",
    harga_jual: 20000,
    hpp: 11000,
    kategori: "Makanan",
    status: "Tersedia" as const,
    foto: PRESET_PHOTOS[2].url,
  },
  {
    nama: "Dimsum Ayam",
    harga_jual: 20000,
    hpp: 13000,
    kategori: "Snack",
    status: "Tersedia" as const,
    foto: PRESET_PHOTOS[3].url,
  },
  {
    nama: "Es Teh Manis",
    harga_jual: 5000,
    hpp: 2000,
    kategori: "Minuman",
    status: "Tersedia" as const,
    foto: PRESET_PHOTOS[4].url,
  },
  {
    nama: "Kopi Hitam",
    harga_jual: 10000,
    hpp: 4000,
    kategori: "Minuman",
    status: "Tersedia" as const,
    foto: PRESET_PHOTOS[5].url,
  },
];

export function PosKasirView({ initialProducts }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Produk[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isPending, startTransition] = useTransition();

  // Sync state when props update
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Toast Feedback State
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Add product to cart
  const addToCart = (product: Produk) => {
    if (product.status === "Habis") {
      showFeedback("error", `Produk "${product.nama}" sedang Habis.`);
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + 1,
        };
        return updated;
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  // Update item qty in cart
  const updateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Submit batch transaction to server/database
  const handleSaveTransaction = () => {
    if (cart.length === 0) {
      showFeedback("error", "Keranjang transaksi masih kosong!");
      return;
    }

    startTransition(async () => {
      const payloadItems = cart.map((item) => ({
        produk_id: item.product.id,
        qty: item.qty,
      }));

      const res = await createBatchTransactionsAction({
        items: payloadItems,
      });

      if (res.success && res.data) {
        const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
        showFeedback(
          "success",
          `Berhasil menyimpan transaksi (${totalItemsCount} item) ke database!`
        );
        clearCart();
        router.refresh();
      } else {
        showFeedback("error", res.error || "Gagal menyimpan transaksi.");
      }
    });
  };

  // Seed sample products if DB is empty
  const handleSeedDemoProducts = () => {
    startTransition(async () => {
      const res = await bulkCreateProductsAction({
        products: DEFAULT_DEMO_PRODUCTS,
      });
      if (res.success && res.data) {
        setProducts(res.data);
        showFeedback("success", "Berhasil membuat 6 produk contoh ke database!");
        router.refresh();
      } else {
        showFeedback("error", res.error || "Gagal menambahkan produk.");
      }
    });
  };

  // Categories list
  const categoryOptions = [
    "Semua",
    "Makanan",
    "Minuman",
    "Snack",
    "Cake",
    ...Array.from(
      new Set(
        products
          .map((p) => p.kategori)
          .filter(
            (k): k is string =>
              !!k && !["Makanan", "Minuman", "Snack", "Cake"].includes(k)
          )
      )
    ),
  ];

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      (p.kategori || "Makanan") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate totals
  const totalOmzet = cart.reduce(
    (sum, item) => sum + item.product.harga_jual * item.qty,
    0
  );
  const totalHpp = cart.reduce(
    (sum, item) => sum + item.product.hpp * item.qty,
    0
  );
  const totalLabaKotor = totalOmzet - totalHpp;
  const totalQuantityCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="w-full space-y-6 text-slate-800 pb-16 font-sans">
      {/* FEEDBACK TOAST NOTIFICATION */}
      {feedback && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-rose-50 border-rose-300 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-dark/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Receipt size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark tracking-tight">
              Catat Setiap Transaksi
            </h1>
          </div>
          <p className="text-sm text-neutral-dark/70 leading-relaxed max-w-xl">
            Sistem Kasir POS harian. Klik atau pilih produk dari katalog menu untuk menambahkan ke keranjang dan catat omzet serta laba secara otomatis ke database.
          </p>
        </div>

        {/* Right side Search Input */}
        <div className="w-full md:w-auto z-10 shrink-0">
          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-dark/40"
            />
            <input
              type="text"
              placeholder="Cari Produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-bg text-primary-dark placeholder-neutral-dark/40 border border-neutral-dark/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. POS MAIN WORKSPACE (LEFT: CATALOG, RIGHT: CART PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SECTION (7 or 8 COLUMNS): CATEGORY TABS & PRODUCT CATALOG GRID */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryOptions.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-neutral-dark/70 hover:bg-neutral-bg border-neutral-dark/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* PRODUCT MENU CATALOG GRID */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-neutral-dark/10 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Package size={32} />
              </div>
              <div>
                <p className="text-base font-bold text-primary-dark">
                  Tidak ada produk ditemukan
                </p>
                <p className="text-xs text-neutral-dark/60 mt-1 max-w-sm mx-auto">
                  {searchQuery || selectedCategory !== "Semua"
                    ? "Coba ubah kata kunci pencarian atau kategori."
                    : "Belum ada produk di database. Tambahkan produk atau isi contoh."}
                </p>
              </div>

              {products.length === 0 && (
                <button
                  type="button"
                  onClick={handleSeedDemoProducts}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-primary/20 transition-all cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Isi Otomatis 6 Produk Contoh</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => {
                const cartItem = cart.find((i) => i.product.id === prod.id);
                const itemQtyInCart = cartItem ? cartItem.qty : 0;
                const isHabis = prod.status === "Habis";

                const photoUrl =
                  prod.foto ||
                  PRESET_PHOTOS.find((p) =>
                    prod.nama.toLowerCase().includes(p.label.toLowerCase())
                  )?.url ||
                  PRESET_PHOTOS[0].url;

                return (
                  <div
                    key={prod.id}
                    onClick={() => addToCart(prod)}
                    className={`bg-white rounded-3xl p-4 border transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden shadow-sm ${
                      isHabis
                        ? "opacity-60 border-neutral-dark/10"
                        : itemQtyInCart > 0
                        ? "border-primary ring-2 ring-primary/20 shadow-md"
                        : "border-neutral-dark/10 hover:border-primary/40 hover:shadow-md"
                    }`}
                  >
                    <div>
                      {/* Product Image */}
                      <div className="w-full h-36 rounded-2xl overflow-hidden bg-neutral-bg mb-3 relative border border-neutral-dark/5">
                        <img
                          src={photoUrl}
                          alt={prod.nama}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Status Habis Badge */}
                        {isHabis && (
                          <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                            HABIS
                          </div>
                        )}

                        {/* Quantity in Cart Badge */}
                        {itemQtyInCart > 0 && (
                          <div className="absolute bottom-2.5 right-2.5 bg-primary text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                            x{itemQtyInCart}
                          </div>
                        )}
                      </div>

                      {/* Title & Price */}
                      <h3 className="font-extrabold text-primary-dark text-sm sm:text-base tracking-tight line-clamp-1">
                        {prod.nama}
                      </h3>
                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <span className="text-sm font-black text-primary">
                          {formatRupiah(prod.harga_jual)}
                        </span>
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                          {prod.kategori || "Makanan"}
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <div className="mt-4 pt-3 border-t border-neutral-dark/10 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-neutral-dark/60 font-medium">
                        HPP: {formatRupiah(prod.hpp)}
                      </span>
                      <button
                        type="button"
                        disabled={isHabis}
                        className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                          itemQtyInCart > 0
                            ? "bg-primary text-white"
                            : "bg-primary-xlight text-primary hover:bg-primary hover:text-white"
                        }`}
                      >
                        <Plus size={14} />
                        <span>Pilih</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SECTION (5 or 4 COLUMNS): ORDER CART / TRANSAKSI SUMMARY PANEL */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-neutral-dark/10 shadow-sm sticky top-6 space-y-5">
          {/* CART HEADER */}
          <div className="flex items-center justify-between border-b border-neutral-dark/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <ShoppingBag size={18} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-primary-dark">
                Transaksi 1
              </h2>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                Kosongkan
              </button>
            )}
          </div>

          {/* CART ITEMS LIST */}
          {cart.length === 0 ? (
            <div className="text-center py-10 px-4 bg-neutral-bg/60 rounded-2xl border border-neutral-dark/10 space-y-2">
              <ShoppingBag size={36} className="mx-auto text-neutral-dark/30" />
              <p className="text-xs font-bold text-neutral-dark/70">
                Keranjang Masih Kosong
              </p>
              <p className="text-[11px] text-neutral-dark/50">
                Klik produk di katalog kiri untuk menambahkan item ke transaksi ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-none divide-y divide-neutral-dark/5">
              {cart.map((item) => {
                const prod = item.product;
                const photoUrl =
                  prod.foto ||
                  PRESET_PHOTOS.find((p) =>
                    prod.nama.toLowerCase().includes(p.label.toLowerCase())
                  )?.url ||
                  PRESET_PHOTOS[0].url;

                return (
                  <div
                    key={prod.id}
                    className="pt-3 first:pt-0 flex items-center justify-between gap-3"
                  >
                    {/* Item Thumbnail & Info */}
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-bg shrink-0 border border-neutral-dark/10">
                        <img
                          src={photoUrl}
                          alt={prod.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-primary-dark truncate">
                          {prod.nama}
                        </p>
                        <p className="text-[11px] text-primary font-extrabold">
                          {formatRupiah(prod.harga_jual)}
                        </p>
                      </div>
                    </div>

                    {/* Qty Stepper Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-neutral-bg rounded-xl border border-neutral-dark/10 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQty(prod.id, item.qty - 1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-neutral-dark/10 text-neutral-dark flex items-center justify-center transition-all"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-extrabold text-primary-dark">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(prod.id, item.qty + 1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-neutral-dark/10 text-neutral-dark flex items-center justify-center transition-all"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(prod.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FINANCIAL CALCULATION BOX */}
          <div className="bg-neutral-bg rounded-2xl p-4 border border-neutral-dark/10 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-neutral-dark/70">
              <span>Total Item ({totalQuantityCount})</span>
              <span className="font-bold text-primary-dark">{cart.length} Jenis</span>
            </div>
            <div className="flex items-center justify-between text-neutral-dark/70">
              <span>Estimasi Laba Kotor:</span>
              <span className="font-extrabold text-emerald-600">
                +{formatRupiah(totalLabaKotor)}
              </span>
            </div>
            <div className="pt-2 border-t border-neutral-dark/10 flex items-center justify-between">
              <span className="font-bold text-primary-dark text-sm">Total Omzet:</span>
              <span className="text-xl font-black text-primary-dark">
                {formatRupiah(totalOmzet)}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-2 pt-1">
            {/* Primary Save Transaction Button */}
            <button
              type="button"
              onClick={handleSaveTransaction}
              disabled={isPending || cart.length === 0}
              className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShoppingBag size={16} />
              )}
              <span>Simpan Transaksi</span>
            </button>

            {/* Secondary Link to History */}
            <Link
              href="/riwayat"
              className="w-full bg-neutral-bg hover:bg-neutral-bg/80 text-primary-dark font-bold py-2.5 px-4 rounded-2xl text-xs text-center border border-neutral-dark/10 transition-all flex items-center justify-center gap-1.5"
            >
              <History size={14} />
              <span>Lihat Riwayat</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

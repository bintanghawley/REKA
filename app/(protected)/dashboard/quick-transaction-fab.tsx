"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Trash2,
  X,
  Search,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Package,
  Receipt,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import type { Produk } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import { createBatchTransactionsAction } from "@/lib/actions/transaction";
import { bulkCreateProductsAction } from "@/lib/actions/product";

interface QuickTransactionFabProps {
  products: Produk[];
  userId?: string;
}

export interface CartItem {
  product: Produk;
  qty: number;
}

const DEFAULT_DEMO_PRODUCTS = [
  {
    nama: "Nasi Goreng Jawa",
    harga_jual: 20000,
    hpp: 12000,
    kategori: "Makanan",
    status: "Tersedia" as const,
    foto: null,
  },
  {
    nama: "Kentang Goreng",
    harga_jual: 20000,
    hpp: 10000,
    kategori: "Makanan",
    status: "Tersedia" as const,
    foto: null,
  },
  {
    nama: "Bakso Bakar",
    harga_jual: 20000,
    hpp: 11000,
    kategori: "Makanan",
    status: "Tersedia" as const,
    foto: null,
  },
  {
    nama: "Dimsum Ayam",
    harga_jual: 20000,
    hpp: 13000,
    kategori: "Makanan",
    status: "Tersedia" as const,
    foto: null,
  },
  {
    nama: "Es Teh Manis",
    harga_jual: 5000,
    hpp: 2000,
    kategori: "Minuman",
    status: "Tersedia" as const,
    foto: null,
  },
  {
    nama: "Kopi Hitam",
    harga_jual: 10000,
    hpp: 4000,
    kategori: "Minuman",
    status: "Tersedia" as const,
    foto: null,
  },
];

export function QuickTransactionFab({ products: initialProducts, userId }: QuickTransactionFabProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Produk[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isPending, startTransition] = useTransition();

  // Storage key scoped per user ID
  const storageKey = userId ? `reka_custom_categories_${userId}` : "reka_custom_categories";

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
        setIsOpen(false);
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

  // Dynamic Categories list scoped to user ID
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          setCustomCategories(JSON.parse(saved));
        } else {
          setCustomCategories([]);
        }
      } catch {
        setCustomCategories([]);
      }
    }
  }, [storageKey]);

  const categoryOptions = [
    "Semua",
    ...Array.from(
      new Set([
        ...products
          .map((p) => p.kategori?.trim())
          .filter((k): k is string => Boolean(k)),
        ...customCategories,
      ])
    ),
  ];

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      (p.kategori || "") === selectedCategory;
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
    <>
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

      {/* FULL-FEATURED POS KASIR MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-neutral-dark/10 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] text-slate-800 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-dark/10 bg-white sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-primary-dark tracking-tight">
                    Catat Transaksi POS Kasir
                  </h3>
                  <p className="text-xs text-neutral-dark/60">
                    Pilih produk & atur keranjang transaksi real-time
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-neutral-bg hover:bg-neutral-dark/10 text-neutral-dark flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Grid (Catalog + Cart Panel) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT SECTION (7 Columns): CATALOG SEARCH, CATEGORY TABS, & PRODUCT GRID */}
              <div className="lg:col-span-7 space-y-4">
                {/* Search Bar & Category Filter */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <Search
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-dark/40"
                    />
                    <input
                      type="text"
                      placeholder="Cari Produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-bg text-primary-dark placeholder-neutral-dark/40 border border-neutral-dark/10 rounded-2xl pl-10 pr-4 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {categoryOptions.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                          isActive
                            ? "bg-primary text-white border-primary shadow-2xs"
                            : "bg-white text-neutral-dark/70 hover:bg-neutral-bg border-neutral-dark/10"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Product Catalog Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-neutral-bg/60 rounded-3xl p-8 border border-neutral-dark/10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-dark">
                        Tidak ada produk ditemukan
                      </p>
                      <p className="text-xs text-neutral-dark/60 mt-1 max-w-xs mx-auto">
                        {searchQuery || selectedCategory !== "Semua"
                          ? "Coba ubah pencarian atau filter."
                          : "Belum ada produk di database."}
                      </p>
                    </div>

                    {products.length === 0 && (
                      <button
                        type="button"
                        onClick={handleSeedDemoProducts}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-primary/20 transition-all cursor-pointer"
                      >
                        <Sparkles size={14} />
                        <span>Isi 6 Produk Contoh</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[50vh] lg:max-h-[58vh] overflow-y-auto pr-1">
                    {filteredProducts.map((prod) => {
                      const cartItem = cart.find((i) => i.product.id === prod.id);
                      const itemQtyInCart = cartItem ? cartItem.qty : 0;
                      const isHabis = prod.status === "Habis";

                      const photoUrl = prod.foto;

                      return (
                        <div
                          key={prod.id}
                          onClick={() => addToCart(prod)}
                          className={`bg-white rounded-2xl p-3 border transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden shadow-2xs ${
                            isHabis
                              ? "opacity-60 border-neutral-dark/10"
                              : itemQtyInCart > 0
                              ? "border-primary ring-2 ring-primary/20 shadow-sm"
                              : "border-neutral-dark/10 hover:border-primary/40 hover:shadow-xs"
                          }`}
                        >
                          <div>
                            {/* Product Image */}
                            <div className="w-full h-24 rounded-xl overflow-hidden bg-neutral-bg mb-2 relative border border-neutral-dark/5 flex items-center justify-center">
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt={prod.nama}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-dark/30">
                                  <ImageIcon size={24} />
                                </div>
                              )}

                              {/* Status Habis Badge */}
                              {isHabis && (
                                <div className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                                  HABIS
                                </div>
                              )}

                              {/* Quantity in Cart Badge */}
                              {itemQtyInCart > 0 && (
                                <div className="absolute bottom-1.5 right-1.5 bg-primary text-white text-xs font-black px-2 py-0.5 rounded-full shadow-md">
                                  x{itemQtyInCart}
                                </div>
                              )}
                            </div>

                            {/* Title & Price */}
                            <h4 className="font-extrabold text-primary-dark text-xs sm:text-sm tracking-tight line-clamp-1">
                              {prod.nama}
                            </h4>
                            <div className="flex items-center justify-between gap-1 mt-1">
                              <span className="text-xs font-black text-primary">
                                {formatRupiah(prod.harga_jual)}
                              </span>
                              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-md border border-sky-200">
                                {prod.kategori || "Umum"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT SECTION (5 Columns): CART & SUMMARY PANEL */}
              <div className="lg:col-span-5 bg-neutral-bg/60 rounded-3xl p-5 border border-neutral-dark/10 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  {/* Cart Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-dark/10">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={18} className="text-primary" />
                      <h4 className="font-extrabold text-primary-dark text-sm">
                        Keranjang Transaksi
                      </h4>
                      {totalQuantityCount > 0 && (
                        <span className="bg-primary text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                          {totalQuantityCount}
                        </span>
                      )}
                    </div>
                    {cart.length > 0 && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Cart Items List */}
                  {cart.length === 0 ? (
                    <div className="py-8 text-center text-neutral-dark/50 space-y-2">
                      <ShoppingBag size={32} className="mx-auto text-neutral-dark/30" />
                      <p className="text-xs font-bold">Keranjang masih kosong</p>
                      <p className="text-[11px]">Klik produk di sebelah kiri untuk menambah ke keranjang.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[35vh] lg:max-h-[40vh] overflow-y-auto pr-1">
                      {cart.map(({ product, qty }) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-2xl p-3 border border-neutral-dark/10 flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs text-primary-dark truncate">
                              {product.nama}
                            </h5>
                            <p className="text-[11px] text-primary font-extrabold mt-0.5">
                              {formatRupiah(product.harga_jual)}{" "}
                              <span className="text-neutral-dark/50 font-normal">
                                x {qty}
                              </span>
                            </p>
                          </div>

                          {/* Stepper & Delete */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => updateQty(product.id, qty - 1)}
                              className="w-7 h-7 rounded-xl bg-neutral-bg hover:bg-neutral-dark/10 text-neutral-dark flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-extrabold text-primary-dark w-5 text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(product.id, qty + 1)}
                              className="w-7 h-7 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs"
                            >
                              <Plus size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold text-xs cursor-pointer border border-rose-200 ml-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Calculation Summary & Submit Button */}
                <div className="pt-4 border-t border-neutral-dark/10 space-y-3">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-neutral-dark/70 font-semibold">
                      <span>Total Omzet Penjualan</span>
                      <span className="font-extrabold text-primary-dark text-sm">
                        {formatRupiah(totalOmzet)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-dark/60 text-[11px]">
                      <span>Biaya Modal (HPP)</span>
                      <span>{formatRupiah(totalHpp)}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-600 font-bold text-xs pt-1">
                      <span>Estimasi Laba Kotor</span>
                      <span>+{formatRupiah(totalLabaKotor)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveTransaction}
                    disabled={isPending || cart.length === 0}
                    className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-extrabold text-sm shadow-md shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Menyimpan Transaksi...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Simpan Transaksi ({totalQuantityCount} Item)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) on Dashboard */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer group"
        aria-label="Catat Transaksi Kasir POS"
        title="Catat Transaksi Kasir POS"
      >
        <Plus size={26} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </>
  );
}

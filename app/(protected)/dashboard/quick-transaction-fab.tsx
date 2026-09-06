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
];

export function QuickTransactionFab({ products: initialProducts, userId }: QuickTransactionFabProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"menu" | "cart">("menu");
  const [products, setProducts] = useState<Produk[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isPending, startTransition] = useTransition();

  const storageKey = userId ? `reka_custom_categories_${userId}` : "reka_custom_categories";

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

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

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleSeedDemoProducts = () => {
    startTransition(async () => {
      try {
        const res = await bulkCreateProductsAction({ products: DEFAULT_DEMO_PRODUCTS });
        if (res.success && res.data) {
          setProducts(res.data);
          showFeedback(
            "success",
            `Berhasil menambahkan ${res.data.length} produk contoh warung!`
          );
          router.refresh();
        } else {
          showFeedback("error", res.error || "Gagal menambahkan produk demo.");
        }
      } catch {
        showFeedback("error", "Terjadi kesalahan koneksi.");
      }
    });
  };

  const handleSaveTransaction = () => {
    if (cart.length === 0) {
      showFeedback("error", "Keranjang transaksi masih kosong.");
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        produk_id: item.product.id,
        qty: item.qty,
      })),
    };

    startTransition(async () => {
      try {
        const res = await createBatchTransactionsAction(payload);
        if (res.success) {
          showFeedback(
            "success",
            `Transaksi ${totalQuantityCount} item berhasil dicatat!`
          );
          setCart([]);
          setIsOpen(false);
          router.refresh();
        } else {
          showFeedback("error", res.error || "Gagal menyimpan transaksi.");
        }
      } catch {
        showFeedback("error", "Terjadi kesalahan jaringan.");
      }
    });
  };

  const [customCategories, setCustomCategories] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomCategories(parsed);
        }
      }
    } catch {
      // Ignore storage error
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

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      (p.kategori || "") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed top-5 right-5 z-[110] flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl border text-xs font-semibold transition-all animate-fadeIn ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-[#f67976]/10 border-[#f67976]/30 text-[#be400f]"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle size={16} className="text-[#be400f] shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Modal Dialog & Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center bg-black/45 backdrop-blur-[2px] p-0 sm:p-4 animate-in fade-in duration-150">
          {/* Backdrop Click Dismiss */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />

          {/* Modal Card (Bottom Sheet on Mobile, Centered on Desktop) */}
          <div className="bg-[#ffffff] rounded-t-2xl sm:rounded-xl border-t sm:border border-[#e4e5e1] shadow-2xl w-full sm:max-w-4xl max-h-[88vh] flex flex-col overflow-hidden text-[#141415] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-150 relative">
            
            {/* Mobile Drag Handle */}
            <div className="w-10 h-1 bg-[#d9d9d9] rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[#e4e5e1] flex items-center justify-between bg-[#ffffff] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#ffcab5] text-[#d14200] flex items-center justify-center shrink-0">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#141415] tracking-tight">
                    Kasir POS Kilat
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6e6f6c]">
                    Pilih menu & otomatis hitung laba
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-md bg-[#fafaf8] hover:bg-[#f0f0ef] border border-[#e4e5e1] text-[#6e6f6c] hover:text-[#141415] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X size={14} />
              </button>
            </div>

            {/* Mobile Segmented Switcher (Visible only on mobile lg:hidden) */}
            <div className="lg:hidden p-1 bg-[#f0f0ef] rounded-lg border border-[#e4e5e1] mx-4 mt-3 grid grid-cols-2 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setMobileTab("menu")}
                className={`py-1.5 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileTab === "menu"
                    ? "bg-[#ffffff] text-[#f35b22] font-semibold shadow-xs"
                    : "text-[#6e6f6c] hover:text-[#141415]"
                }`}
              >
                <Package size={13} />
                <span>Menu ({filteredProducts.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("cart")}
                className={`py-1.5 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mobileTab === "cart"
                    ? "bg-[#ffffff] text-[#f35b22] font-semibold shadow-xs"
                    : "text-[#6e6f6c] hover:text-[#141415]"
                }`}
              >
                <ShoppingBag size={13} />
                <span>Keranjang ({totalQuantityCount})</span>
              </button>
            </div>

            {/* Main Content Workspace */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* LEFT SECTION: CATALOG */}
              <div className={`lg:col-span-7 space-y-3 ${mobileTab === "cart" ? "hidden lg:block" : "block"}`}>
                {/* Search Bar */}
                <div className="relative w-full">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c89]"
                  />
                  <input
                    type="text"
                    placeholder="Cari Produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#fafaf8] text-[#141415] placeholder:text-[#8c8c89] border border-[#e4e5e1] rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#f35b22] focus:bg-[#ffffff] transition-all"
                  />
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categoryOptions.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                          isActive
                            ? "bg-[#ffffff] border-[#f35b22] text-[#f35b22] font-semibold shadow-xs ring-1 ring-[#f35b22]/20"
                            : "bg-[#fafaf8] border-[#e4e5e1] text-[#454542] hover:border-[#d9d9d9]"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Product Catalog Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-[#fafaf8] rounded-lg p-6 border border-[#e4e5e1] text-center space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-[#ffffff] border border-[#e4e5e1] text-[#8c8c89] flex items-center justify-center mx-auto">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#141415]">
                        Tidak Ada Produk
                      </p>
                      <p className="text-[11px] text-[#8c8c89]">
                        {searchQuery || selectedCategory !== "Semua"
                          ? "Coba ubah kata kunci pencarian."
                          : "Katalog produk belum terisi."}
                      </p>
                    </div>

                    {products.length === 0 && (
                      <button
                        type="button"
                        onClick={handleSeedDemoProducts}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f35b22] hover:bg-[#ff5e24] text-white text-xs font-medium rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isPending ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Mengisi Demo...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            <span>Isi Data Demo (5 Menu)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredProducts.map((prod) => {
                      const itemQtyInCart =
                        cart.find((item) => item.product.id === prod.id)?.qty || 0;
                      const photoUrl = prod.foto || null;
                      const isHabis = prod.status === "Habis";

                      return (
                        <div
                          key={prod.id}
                          onClick={() => !isHabis && addToCart(prod)}
                          className={`group bg-[#ffffff] rounded-lg p-2.5 border transition-all text-left relative flex flex-col justify-between ${
                            isHabis
                              ? "opacity-50 border-[#e4e5e1] cursor-not-allowed"
                              : itemQtyInCart > 0
                              ? "border-[#f35b22] ring-1 ring-[#f35b22]/30 shadow-xs cursor-pointer"
                              : "border-[#e4e5e1] hover:border-[#f35b22]/50 hover:shadow-xs cursor-pointer"
                          }`}
                        >
                          <div>
                            {/* Image */}
                            <div className="w-full h-16 sm:h-20 rounded-md overflow-hidden bg-[#fafaf8] mb-1.5 relative border border-[#e4e5e1] flex items-center justify-center">
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt={prod.nama}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#8c8c89]">
                                  <ImageIcon size={20} />
                                </div>
                              )}

                              {isHabis && (
                                <div className="absolute top-1 right-1 bg-[#be400f] text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                                  HABIS
                                </div>
                              )}

                              {itemQtyInCart > 0 && (
                                <div className="absolute bottom-1 right-1 bg-[#f35b22] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm">
                                  x{itemQtyInCart}
                                </div>
                              )}
                            </div>

                            <h4 className="font-semibold text-[#141415] text-[11px] sm:text-xs truncate">
                              {prod.nama}
                            </h4>
                            <div className="flex items-center justify-between gap-1 mt-0.5">
                              <span className="text-[11px] font-mono font-bold text-[#f35b22]">
                                {formatRupiah(prod.harga_jual)}
                              </span>
                              {prod.kategori && (
                                <span className="text-[9px] font-mono text-[#8c8c89] truncate">
                                  {prod.kategori}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT SECTION: CART & SUMMARY */}
              <div
                className={`lg:col-span-5 bg-[#fafaf8] rounded-lg p-3.5 border border-[#e4e5e1] flex flex-col justify-between space-y-3 ${
                  mobileTab === "menu" ? "hidden lg:flex" : "flex"
                }`}
              >
                <div className="space-y-3">
                  {/* Cart Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#e4e5e1]">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-[#f35b22]" />
                      <h4 className="font-semibold text-[#141415] text-xs">
                        Keranjang
                      </h4>
                      {totalQuantityCount > 0 && (
                        <span className="bg-[#ffcab5] text-[#d14200] font-mono text-[10px] font-bold px-1.5 py-0.2 rounded">
                          {totalQuantityCount}
                        </span>
                      )}
                    </div>
                    {cart.length > 0 && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-[11px] font-mono text-[#f67976] hover:text-[#be400f] hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Cart Items */}
                  {cart.length === 0 ? (
                    <div className="py-6 text-center text-[#8c8c89] space-y-1.5">
                      <ShoppingBag size={24} className="mx-auto text-[#b7b7b4]" />
                      <p className="text-xs font-semibold text-[#141415]">Keranjang Kosong</p>
                      <p className="text-[11px]">Ketuk menu untuk menambah pesanan.</p>
                      <button
                        type="button"
                        onClick={() => setMobileTab("menu")}
                        className="lg:hidden mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-[#f35b22] text-white text-[11px] font-medium rounded-md cursor-pointer"
                      >
                        <Package size={12} />
                        <span>Pilih Menu</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[28vh] lg:max-h-[32vh] overflow-y-auto pr-0.5">
                      {cart.map(({ product, qty }) => (
                        <div
                          key={product.id}
                          className="bg-[#ffffff] rounded-md p-2 border border-[#e4e5e1] flex items-center justify-between gap-2 shadow-xs"
                        >
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-xs text-[#141415] truncate">
                              {product.nama}
                            </h5>
                            <p className="text-[11px] font-mono font-bold text-[#f35b22]">
                              {formatRupiah(product.harga_jual)}{" "}
                              <span className="text-[#8c8c89] font-normal">
                                x {qty}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => updateQty(product.id, qty - 1)}
                              className="w-5 h-5 rounded bg-[#fafaf8] border border-[#e4e5e1] text-[#141415] hover:text-[#f35b22] flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-mono font-bold text-[#141415] w-4 text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(product.id, qty + 1)}
                              className="w-5 h-5 rounded bg-[#f35b22] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-[#ff5e24]"
                            >
                              <Plus size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="w-5 h-5 rounded bg-[#ffffff] border border-[#e4e5e1] text-[#8c8c89] hover:text-[#be400f] hover:bg-[#f67976]/10 flex items-center justify-center cursor-pointer ml-0.5"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Calculation & Submit Button */}
                <div className="pt-2.5 border-t border-[#e4e5e1] space-y-2.5">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-semibold text-[#141415]">
                      <span>Total Omzet</span>
                      <span className="font-mono text-sm font-bold text-[#f35b22]">
                        {formatRupiah(totalOmzet)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#6e6f6c] text-[11px] font-mono">
                      <span>Modal (HPP)</span>
                      <span>{formatRupiah(totalHpp)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#165424] font-mono text-[11px] font-bold">
                      <span>Est. Laba Kotor</span>
                      <span>+{formatRupiah(totalLabaKotor)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveTransaction}
                    disabled={isPending || cart.length === 0}
                    className="w-full py-2.5 bg-[#f35b22] hover:bg-[#ff5e24] active:scale-[0.99] text-white font-semibold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Simpan ({totalQuantityCount} Item)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Sticky Bar when in Menu tab */}
            {mobileTab === "menu" && totalQuantityCount > 0 && (
              <div className="lg:hidden p-3 bg-[#ffffff] border-t border-[#e4e5e1] shadow-md flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#8c8c89]">
                    {totalQuantityCount} Item di Keranjang
                  </div>
                  <div className="text-sm font-mono font-bold text-[#f35b22] truncate">
                    {formatRupiah(totalOmzet)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab("cart")}
                  className="px-3.5 py-2 bg-[#f35b22] hover:bg-[#ff5e24] active:scale-95 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>Lihat Keranjang</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-[84px] right-4 sm:right-6 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#f35b22] hover:bg-[#ff5e24] text-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer group shadow-[0_4px_16px_rgba(243,91,34,0.3),0_1px_3px_rgba(20,20,21,0.06)]"
        aria-label="Catat Transaksi Kasir POS"
        title="Catat Transaksi Kasir POS"
      >
        <Plus size={24} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />

        {/* Tooltip on Hover */}
        <span className="hidden sm:block absolute right-16 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none bg-[#141415] text-[#ffffff] text-[11px] font-mono font-medium py-1 px-2.5 rounded-[4px] shadow-md whitespace-nowrap">
          Kasir POS Kilat
        </span>
      </button>
    </>
  );
}

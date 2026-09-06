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
  Sparkles,
  Package,
  Receipt,
  Image as ImageIcon,
} from "lucide-react";
import type { Produk } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import { createBatchTransactionsAction } from "@/lib/actions/transaction";
import { bulkCreateProductsAction } from "@/lib/actions/product";
import { ConfirmModal } from "@/components/confirm-modal";

interface Props {
  initialProducts: Produk[];
  userId?: string;
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

export function PosKasirView({ initialProducts, userId }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Produk[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isPending, startTransition] = useTransition();

  // Storage key scoped per user ID
  const storageKey = userId ? `reka_custom_categories_${userId}` : "reka_custom_categories";

  // Persistent Custom Categories State (Private per authenticated user)
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
      (p.kategori?.trim() || "") === selectedCategory;
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
    <div className="w-full space-y-6 text-[#141415] pb-16 font-sans">
      {/* FEEDBACK TOAST NOTIFICATION (DESIGN.md: Crisp flat alert with hairline border & mono text) */}
      {feedback && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[4px] shadow-sm border text-xs font-mono transition-all ${
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

      {/* 1. EXECUTIVE HEADER BANNER (DESIGN.md: Card White, Linen Border, Mono Eyebrow, Editorial Heading) */}
      <div className="bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] flex flex-col md:flex-row md:items-center justify-between gap-5 relative">
        <div className="space-y-1.5 z-10">
          <h1 className="text-2xl sm:text-[28px] font-semibold text-[#141415] tracking-tight leading-[1.2]">
            Catat Setiap <span className="text-[#f35b22]">Transaksi</span>
          </h1>
          <p className="text-[14px] text-[#6e6f6c] leading-[1.5] max-w-xl font-normal">
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

      {/* 2. POS MAIN WORKSPACE (LEFT: CATALOG, RIGHT: CART PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT SECTION (7 or 8 COLUMNS): CATEGORY TABS & PRODUCT CATALOG GRID */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* CATEGORY TABS (DESIGN.md: 4px radius, crisp outline/fill) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categoryOptions.map((cat) => {
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
          </div>

          {/* PRODUCT MENU CATALOG GRID */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#ffffff] rounded-[12px] p-10 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] text-center space-y-3 font-mono">
              <Package size={28} className="mx-auto text-[#8c8c89]" />
              <div>
                <p className="text-sm font-semibold text-[#141415]">
                  Tidak ada produk ditemukan
                </p>
                <p className="text-xs text-[#6e6f6c] mt-1 max-w-sm mx-auto font-sans">
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
                  className="inline-flex items-center gap-1.5 bg-[#f35b22] hover:bg-[#ff5e24] text-white font-mono text-xs font-medium px-4 py-2 rounded-[4px] shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles size={14} />
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

                const photoUrl = prod.foto;

                return (
                  <div
                    key={prod.id}
                    onClick={() => addToCart(prod)}
                    className={`bg-[#ffffff] rounded-[12px] p-4 border transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden shadow-[rgba(24,25,22,0.06)_0px_1px_2px_0px] ${
                      isHabis
                        ? "opacity-60 border-[#e4e5e1]"
                        : itemQtyInCart > 0
                        ? "border-[#f35b22] ring-1 ring-[#f35b22]/30 shadow-sm"
                        : "border-[#e4e5e1] hover:border-[#f35b22]/50 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      {/* Product Image */}
                      <div className="w-full h-32 rounded-[8px] overflow-hidden bg-[#f0f0ef] mb-3 relative border border-[#e4e5e1] flex items-center justify-center">
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
                            <ImageIcon size={26} />
                          </div>
                        )}

                        {/* Status Habis Badge */}
                        {isHabis && (
                          <div className="absolute top-2 right-2 bg-[#be400f] text-white font-mono text-[10px] font-medium px-2 py-0.5 rounded-[2px] shadow-xs">
                            HABIS
                          </div>
                        )}

                        {/* Quantity in Cart Badge */}
                        {itemQtyInCart > 0 && (
                          <div className="absolute bottom-2 right-2 bg-[#f35b22] text-white font-mono text-xs font-bold px-2 py-0.5 rounded-[2px] shadow-xs">
                            x{itemQtyInCart}
                          </div>
                        )}
                      </div>

                      {/* Title & Price */}
                      <h3 className="font-semibold text-[#141415] text-sm tracking-tight line-clamp-1">
                        {prod.nama}
                      </h3>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="font-mono text-sm font-semibold text-[#f35b22]">
                          {formatRupiah(prod.harga_jual)}
                        </span>
                        {prod.kategori ? (
                          <span className="font-mono text-[10px] text-[#454542] bg-[#f0f0ef] px-1.5 py-0.5 rounded-[2px] border border-[#e4e5e1]">
                            {prod.kategori}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <div className="mt-3.5 pt-2.5 border-t border-[#e4e5e1] flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-[#8c8c89]">
                        HPP: {formatRupiah(prod.hpp)}
                      </span>
                      <button
                        type="button"
                        disabled={isHabis}
                        className={`px-2.5 py-1 rounded-[4px] font-mono text-xs font-medium flex items-center gap-1 transition-all ${
                          itemQtyInCart > 0
                            ? "bg-[#f35b22] text-white"
                            : "bg-transparent hover:bg-[#f0f0ef] border border-[#d9d9d9] text-[#141415]"
                        }`}
                      >
                        <Plus size={13} />
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
        <div className="lg:col-span-5 xl:col-span-4 bg-[#ffffff] rounded-[12px] p-5 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] sticky top-6 space-y-4">
          {/* CART HEADER */}
          <div className="flex items-center justify-between border-b border-[#e4e5e1] pb-3.5">
            <div className="flex items-center gap-2">
              <Receipt size={16} className="text-[#f35b22]" />
              <h2 className="text-base font-semibold text-[#141415] tracking-tight">
                Transaksi Kasir
              </h2>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearCartConfirm(true)}
                className="font-mono text-xs text-[#f67976] hover:underline cursor-pointer"
              >
                [Kosongkan]
              </button>
            )}
          </div>

          {/* CART ITEMS LIST */}
          {cart.length === 0 ? (
            <div className="text-center py-10 px-4 bg-[#fafaf8] rounded-[8px] border border-[#e4e5e1] space-y-1.5 font-mono">
              <ShoppingBag size={28} className="mx-auto text-[#8c8c89]" />
              <p className="text-xs font-medium text-[#141415]">
                Keranjang Masih Kosong
              </p>
              <p className="text-[11px] text-[#6e6f6c] font-sans">
                Klik produk di katalog kiri untuk menambahkan item ke transaksi ini.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-none divide-y divide-[#e4e5e1]">
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
                    className="pt-2.5 first:pt-0 flex items-center justify-between gap-2.5 text-xs"
                  >
                    {/* Item Thumbnail & Info */}
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-10 h-10 rounded-[4px] overflow-hidden bg-[#f0f0ef] shrink-0 border border-[#e4e5e1]">
                        <img
                          src={photoUrl}
                          alt={prod.nama}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-[#141415] truncate">
                          {prod.nama}
                        </p>
                        <p className="font-mono text-[11px] text-[#f35b22] font-semibold">
                          {formatRupiah(prod.harga_jual)}
                        </p>
                      </div>
                    </div>

                    {/* Qty Stepper Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center bg-[#f0f0ef] rounded-[4px] border border-[#e4e5e1]">
                        <button
                          type="button"
                          onClick={() => updateQty(prod.id, item.qty - 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#6e6f6c] hover:text-[#141415] transition-all"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-semibold text-[#141415]">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(prod.id, item.qty + 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#6e6f6c] hover:text-[#141415] transition-all"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(prod.id)}
                        className="text-[#f67976] hover:text-[#be400f] p-1 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FINANCIAL CALCULATION BOX */}
          <div className="bg-[#fafaf8] rounded-[8px] p-3.5 border border-[#e4e5e1] space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[#6e6f6c]">
              <span>Total Item ({totalQuantityCount})</span>
              <span className="font-semibold text-[#141415]">{cart.length} Jenis</span>
            </div>
            <div className="flex items-center justify-between text-[#6e6f6c]">
              <span>Estimasi Laba Kotor:</span>
              <span className="font-semibold text-[#165424]">
                +{formatRupiah(totalLabaKotor)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#e4e5e1] flex items-center justify-between">
              <span className="font-sans font-semibold text-[#141415] text-sm">Total Omzet:</span>
              <span className="font-mono text-lg font-semibold text-[#141415]">
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
              className="w-full bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium py-2.5 px-4 rounded-[4px] text-sm shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <ShoppingBag size={15} />
              )}
              <span>Simpan Transaksi</span>
            </button>

            {/* Secondary Link to History */}
            <Link
              href="/riwayat"
              className="w-full bg-transparent hover:bg-[#f0f0ef] text-[#141415] font-mono text-xs font-medium py-2 px-4 rounded-[4px] text-center border border-[#d9d9d9] transition-all flex items-center justify-center gap-1.5"
            >
              <History size={13} />
              <span>Lihat Riwayat</span>
            </Link>
          </div>
        </div>
      </div>
      {/* MODAL KONFIRMASI KOSONGKAN KERANJANG */}
      <ConfirmModal
        isOpen={showClearCartConfirm}
        onClose={() => setShowClearCartConfirm(false)}
        onConfirm={() => {
          clearCart();
          setShowClearCartConfirm(false);
          showFeedback("success", "Keranjang transaksi berhasil dikosongkan.");
        }}
        title="Kosongkan Keranjang?"
        description={
          <p>
            Apakah Anda yakin ingin membatalkan dan mengosongkan seluruh pesanan (
            <strong className="text-[#141415] font-semibold">
              {cart.reduce((sum, item) => sum + item.qty, 0)} item
            </strong>
            ) dari keranjang kasir?
          </p>
        }
        confirmLabel="Ya, Kosongkan"
        cancelLabel="Kembali"
        variant="danger"
      />
    </div>
  );
}

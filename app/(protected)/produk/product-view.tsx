"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Loader2,
  Package,
  Layers,
  Sparkles,
  AlertTriangle,
  Coins,
  Tag,
  RefreshCw,
} from "lucide-react";
import type { Produk } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  bulkCreateProductsAction,
} from "@/lib/actions/product";

interface Props {
  initialProducts: Produk[];
}

// Preset foto default untuk pilihan foto produk
const PRESET_PHOTOS: { label: string; url: string }[] = [
  {
    label: "Nasi Goreng",
    url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Kentang Goreng",
    url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Bakso / Sate",
    url: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Dimsum",
    url: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Es Teh / Minuman",
    url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&auto=format&fit=crop&q=80",
  },
  {
    label: "Kopi",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80",
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
    kategori: "Makanan",
    status: "Tersedia" as const,
    foto: PRESET_PHOTOS[1].url,
  },
  {
    nama: "Bakso Bakar",
    harga_jual: 20000,
    hpp: 11000,
    kategori: "Makanan",
    status: "Habis" as const,
    foto: PRESET_PHOTOS[2].url,
  },
  {
    nama: "Dimsum Ayam",
    harga_jual: 20000,
    hpp: 13000,
    kategori: "Makanan",
    status: "Tersedia" as const,
    foto: PRESET_PHOTOS[3].url,
  },
];

export function ProductView({ initialProducts }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Produk[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isPending, startTransition] = useTransition();

  // Sinkronisasi data server ke state lokal ketika props initialProducts diperbarui
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produk | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Produk | null>(null);

  // Alert / Toast state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form states
  const [formNama, setFormNama] = useState("");
  const [formHargaJual, setFormHargaJual] = useState<number | "">("");
  const [formHpp, setFormHpp] = useState<number | "">("");
  const [formKategori, setFormKategori] = useState("Makanan");
  const [formStatus, setFormStatus] = useState<"Tersedia" | "Habis">("Tersedia");
  const [formFoto, setFormFoto] = useState("");

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Open modal functions
  const handleOpenAdd = () => {
    setFormNama("");
    setFormHargaJual("");
    setFormHpp("");
    setFormKategori("Makanan");
    setFormStatus("Tersedia");
    setFormFoto(PRESET_PHOTOS[0].url);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Produk) => {
    setEditingProduct(p);
    setFormNama(p.nama);
    setFormHargaJual(p.harga_jual);
    setFormHpp(p.hpp);
    setFormKategori(p.kategori || "Makanan");
    setFormStatus((p.status as "Tersedia" | "Habis") || "Tersedia");
    setFormFoto(p.foto || "");
  };

  // Submit Create Product (Database Action + State Sync + Router Refresh)
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) {
      showFeedback("error", "Nama produk tidak boleh kosong");
      return;
    }
    if (formHargaJual === "" || formHargaJual < 0) {
      showFeedback("error", "Harga jual harus diisi dengan angka positif");
      return;
    }

    startTransition(async () => {
      const res = await createProductAction({
        nama: formNama.trim(),
        harga_jual: Number(formHargaJual),
        hpp: Number(formHpp || 0),
        kategori: formKategori,
        status: formStatus,
        foto: formFoto.trim() || null,
      });

      if (res.success && res.data) {
        setProducts((prev) => [res.data!, ...prev]);
        setIsAddModalOpen(false);
        showFeedback("success", `Produk "${res.data.nama}" berhasil tersimpan di database!`);
        router.refresh();
      } else {
        showFeedback("error", res.error || "Gagal menyimpan produk ke database.");
      }
    });
  };

  // Submit Edit Product
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!formNama.trim()) {
      showFeedback("error", "Nama produk tidak boleh kosong");
      return;
    }

    startTransition(async () => {
      const res = await updateProductAction({
        id: editingProduct.id,
        nama: formNama.trim(),
        harga_jual: Number(formHargaJual),
        hpp: Number(formHpp || 0),
        kategori: formKategori,
        status: formStatus,
        foto: formFoto.trim() || null,
      });

      if (res.success && res.data) {
        setProducts((prev) =>
          prev.map((item) => (item.id === res.data!.id ? res.data! : item))
        );
        setEditingProduct(null);
        showFeedback("success", `Produk "${res.data.nama}" berhasil diperbarui!`);
        router.refresh();
      } else {
        showFeedback("error", res.error || "Gagal memperbarui data di database.");
      }
    });
  };

  // Quick Status Toggle (Tersedia <-> Habis)
  const handleToggleStatus = (p: Produk) => {
    const nextStatus = p.status === "Habis" ? "Tersedia" : "Habis";
    startTransition(async () => {
      const res = await updateProductAction({
        id: p.id,
        status: nextStatus,
      });

      if (res.success && res.data) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, status: nextStatus } : item))
        );
        showFeedback(
          "success",
          `Status "${p.nama}" diubah menjadi ${nextStatus}`
        );
        router.refresh();
      } else {
        showFeedback("error", res.error || "Gagal mengubah status di database.");
      }
    });
  };

  // Submit Delete Product
  const handleDeleteProduct = () => {
    if (!deletingProduct) return;

    startTransition(async () => {
      const res = await deleteProductAction(deletingProduct.id);
      if (res.success) {
        setProducts((prev) => prev.filter((item) => item.id !== deletingProduct.id));
        showFeedback("success", `Produk "${deletingProduct.nama}" berhasil dihapus dari database.`);
        setDeletingProduct(null);
        router.refresh();
      } else {
        showFeedback("error", res.error || "Gagal menghapus produk.");
      }
    });
  };

  // Quick Seed Demo Data (Insert 4 default products into SQLite)
  const handleSeedDemoData = () => {
    startTransition(async () => {
      const res = await bulkCreateProductsAction({
        products: DEFAULT_DEMO_PRODUCTS,
      });
      if (res.success && res.data) {
        setProducts((prev) => [...res.data!, ...prev]);
        showFeedback("success", "Berhasil menyimpan 4 produk ke database!");
        router.refresh();
      } else {
        showFeedback("error", res.error || "Gagal menyimpan produk ke database.");
      }
    });
  };

  // List of unique categories
  const availableCategories = [
    "Semua",
    ...Array.from(new Set(products.map((p) => p.kategori || "Makanan"))),
  ];

  // Filter products by search query & category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      (p.kategori || "Makanan") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

      {/* 1. EXECUTIVE HEADER BANNER (Consistent REKA UMKM Light Style) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-dark/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Package size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-dark tracking-tight">
              Kelola Produk & Katalog Usaha
            </h1>
          </div>
          <p className="text-sm text-neutral-dark/70 leading-relaxed max-w-xl">
            Atur daftar menu, harga jual, modal HPP, dan ketersediaan stok produk Anda yang terhubung langsung dengan sistem kasir POS & database transaksi.
          </p>
        </div>

        {/* Right side controls: Search & Category Filter */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 z-10 shrink-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-dark/40"
            />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-bg text-primary-dark placeholder-neutral-dark/40 border border-neutral-dark/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-neutral-bg text-primary-dark border border-neutral-dark/10 rounded-2xl pl-10 pr-9 py-2.5 text-sm font-bold focus:outline-none focus:border-primary cursor-pointer"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "Semua" ? "Kategori: Semua" : cat}
                </option>
              ))}
            </select>
            <Layers
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-dark/40 pointer-events-none"
            />
            <Filter
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-dark/40 pointer-events-none"
            />
          </div>
        </div>

        {/* Decorative ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. MAIN CONTAINER CARD ("Daftar Produk") */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-dark/10 shadow-sm space-y-6">
        {/* Card Header & Primary Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-dark/10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-primary-dark tracking-tight">
              Daftar Produk
            </h2>
            <span className="text-xs bg-primary/10 text-primary-dark border border-primary/20 px-3 py-1 rounded-full font-bold">
              {filteredProducts.length} Produk Terdaftar
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {products.length === 0 && (
              <button
                type="button"
                onClick={handleSeedDemoData}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 bg-neutral-bg hover:bg-neutral-bg/80 text-primary-dark text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-neutral-dark/10 transition-all cursor-pointer"
              >
                <Sparkles size={15} className="text-primary" />
                <span>Isi Produk Contoh</span>
              </button>
            )}

            {/* Signature REKA Primary Orange "+ Tambah Produk" Button */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-extrabold px-5 py-2.5 rounded-2xl text-sm shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Tambah Produk</span>
            </button>
          </div>
        </div>

        {/* PRODUCTS TABLE / LIST */}
        <div className="space-y-3">
          {/* Table Header Bar */}
          <div className="hidden sm:grid grid-cols-12 gap-4 bg-neutral-bg text-neutral-dark/70 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl border border-neutral-dark/10">
            <div className="col-span-2 text-center">Foto</div>
            <div className="col-span-5 text-left pl-2">Detail Produk</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-3 text-center">Aksi</div>
          </div>

          {/* Product Items */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-neutral-bg/60 rounded-3xl border border-neutral-dark/10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Package size={32} />
              </div>
              <div>
                <p className="text-base font-bold text-primary-dark">
                  Belum ada produk di database
                </p>
                <p className="text-xs text-neutral-dark/60 mt-1 max-w-md mx-auto">
                  {searchQuery || selectedCategory !== "Semua"
                    ? "Tidak ditemukan produk yang cocok dengan kriteria pencarian/filter."
                    : "Klik tombol 'Tambah Produk' untuk mendaftarkan menu/produk pertama Anda."}
                </p>
              </div>

              {products.length === 0 && (
                <button
                  type="button"
                  onClick={handleSeedDemoData}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-primary/20 transition-all mt-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Isi Otomatis 4 Produk Contoh (Nasi Goreng, Kentang, Bakso, Dimsum)</span>
                </button>
              )}
            </div>
          ) : (
            filteredProducts.map((product) => {
              const photoUrl =
                product.foto ||
                PRESET_PHOTOS.find((p) =>
                  product.nama.toLowerCase().includes(p.label.toLowerCase())
                )?.url ||
                PRESET_PHOTOS[0].url;

              const isHabis = product.status === "Habis";

              return (
                <div
                  key={product.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white hover:bg-neutral-bg/60 border border-neutral-dark/10 rounded-2xl p-4 transition-all shadow-2xs group"
                >
                  {/* Foto Column */}
                  <div className="sm:col-span-2 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-bg border border-neutral-dark/10 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={product.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-dark/40">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detail Produk Column */}
                  <div className="sm:col-span-5 space-y-2 text-left">
                    <h3 className="text-base font-bold text-primary-dark tracking-tight">
                      {product.nama}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Price Pill */}
                      <span className="bg-primary/10 text-primary-dark font-bold px-3 py-1 rounded-xl text-xs border border-primary/20">
                        {formatRupiah(product.harga_jual)}
                      </span>

                      {/* Category Pill */}
                      <span className="bg-sky-50 text-sky-700 font-bold px-3 py-1 rounded-xl text-xs border border-sky-200">
                        {product.kategori || "Makanan"}
                      </span>

                      {/* HPP Modal Pill */}
                      {product.hpp > 0 && (
                        <span className="bg-neutral-bg text-neutral-dark/70 font-semibold px-2.5 py-1 rounded-xl text-[11px] border border-neutral-dark/10">
                          HPP: {formatRupiah(product.hpp)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Column */}
                  <div className="sm:col-span-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(product)}
                      disabled={isPending}
                      title="Klik untuk mengubah status ketersediaan"
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer hover:scale-105 active:scale-95 border ${
                        isHabis
                          ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      {product.status || "Tersedia"}
                    </button>
                  </div>

                  {/* Aksi Column */}
                  <div className="sm:col-span-3 flex items-center justify-center gap-2 pt-2 sm:pt-0">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(product)}
                      className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3.5 py-1.5 rounded-xl text-xs border border-amber-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(product)}
                      className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3.5 py-1.5 rounded-xl text-xs border border-rose-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. MODAL: TAMBAH / EDIT PRODUK */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-neutral-dark/10 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-slate-800 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-dark/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Package size={18} />
                </div>
                <h3 className="text-lg font-bold text-primary-dark">
                  {editingProduct ? "Edit Data Produk" : "Tambah Produk Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="w-8 h-8 rounded-full bg-neutral-bg hover:bg-neutral-dark/10 text-neutral-dark flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              className="space-y-4"
            >
              {/* Nama Produk */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-dark/70 mb-1.5">
                  Nama Produk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Nasi Goreng Jawa"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full bg-neutral-bg border border-neutral-dark/10 rounded-2xl px-4 py-2.5 text-sm text-primary-dark font-medium focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Harga Jual & HPP Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-dark/70 mb-1.5">
                    Harga Jual (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="20000"
                    value={formHargaJual}
                    onChange={(e) =>
                      setFormHargaJual(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full bg-neutral-bg border border-neutral-dark/10 rounded-2xl px-4 py-2.5 text-sm text-primary-dark font-medium focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-dark/70 mb-1.5">
                    HPP Modal (Rp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="12000"
                    value={formHpp}
                    onChange={(e) =>
                      setFormHpp(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full bg-neutral-bg border border-neutral-dark/10 rounded-2xl px-4 py-2.5 text-sm text-primary-dark font-medium focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Kategori & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-dark/70 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value)}
                    className="w-full bg-neutral-bg border border-neutral-dark/10 rounded-2xl px-4 py-2.5 text-sm text-primary-dark font-bold focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Cemilan">Cemilan</option>
                    <option value="Paket">Paket</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-dark/70 mb-1.5">
                    Status Produk
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as "Tersedia" | "Habis")
                    }
                    className="w-full bg-neutral-bg border border-neutral-dark/10 rounded-2xl px-4 py-2.5 text-sm text-primary-dark font-bold focus:outline-none focus:border-primary transition-all"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Habis">Habis</option>
                  </select>
                </div>
              </div>

              {/* Foto Preset / Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-dark/70 mb-1.5">
                  Foto Produk (Pilih Preset atau Tempel URL)
                </label>

                {/* Preset Thumbnails */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {PRESET_PHOTOS.map((preset) => {
                    const isSelected = formFoto === preset.url;
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormFoto(preset.url)}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary scale-105 shadow-sm"
                            : "border-neutral-dark/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="URL Foto khusus (opsional)"
                  value={formFoto}
                  onChange={(e) => setFormFoto(e.target.value)}
                  className="w-full bg-neutral-bg border border-neutral-dark/10 rounded-2xl px-4 py-2 text-xs text-primary-dark placeholder-neutral-dark/40 focus:outline-none focus:border-primary transition-all mt-1"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-dark/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-neutral-bg hover:bg-neutral-dark/10 text-neutral-dark font-bold text-xs border border-neutral-dark/10 transition-all cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-primary/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  <span>{editingProduct ? "Simpan Perubahan" : "Simpan Produk Ke DB"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: KONFIRMASI HAPUS */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-rose-200 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 text-slate-800">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center font-bold">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-bold text-primary-dark">Hapus Produk?</h3>
            </div>

            <p className="text-xs text-neutral-dark/80 leading-relaxed">
              Apakah Anda yakin ingin menghapus produk{" "}
              <strong className="text-primary-dark font-bold">"{deletingProduct.nama}"</strong> dari database?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-dark/10">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2.5 rounded-2xl bg-neutral-bg hover:bg-neutral-dark/10 text-neutral-dark font-bold text-xs border border-neutral-dark/10 transition-all cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 size={14} className="animate-spin" />}
                <span>Hapus Produk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

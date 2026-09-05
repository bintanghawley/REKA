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
  userId?: string;
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

  // Submit Create Product
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
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#f35b22]">
            [ KATALOG PRODUK // MASTER DATA ]
          </div>
          <h1 className="text-2xl sm:text-[28px] font-semibold text-[#141415] tracking-tight leading-[1.2]">
            Kelola Produk & <span className="text-[#f35b22]">Katalog Usaha</span>
          </h1>
          <p className="text-[14px] text-[#6e6f6c] leading-[1.5] max-w-xl font-normal">
            Atur daftar menu, harga jual, modal HPP, dan ketersediaan stok produk Anda yang terhubung langsung dengan sistem kasir POS & database transaksi.
          </p>
        </div>

        {/* Right side controls: Search & Category Filter */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2.5 z-10 shrink-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c89]"
            />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fafaf8] text-[#141415] placeholder-[#8c8c89] border border-[#e4e5e1] rounded-[4px] pl-9 pr-3.5 py-2 text-xs sm:text-sm font-normal focus:outline-none focus:border-[#f35b22] transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-[#fafaf8] text-[#141415] border border-[#e4e5e1] rounded-[4px] pl-8 pr-8 py-2 font-mono text-xs font-medium focus:outline-none focus:border-[#f35b22] cursor-pointer"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "Semua" ? "Kategori: Semua" : cat}
                </option>
              ))}
            </select>
            <Layers
              size={15}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8c8c89] pointer-events-none"
            />
            <Filter
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c8c89] pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTAINER CARD ("Daftar Produk") */}
      <div className="bg-[#ffffff] rounded-[12px] p-5 sm:p-6 border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] space-y-5">
        {/* Card Header & Primary Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e5e1]">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-[#141415] tracking-tight">
              Daftar Produk
            </h2>
            <span className="font-mono text-[11px] font-medium text-[#f35b22] bg-[#ffcab5] border border-[#f77c55] px-2.5 py-0.5 rounded-[4px]">
              {filteredProducts.length} Produk Terdaftar
            </span>
          </div>

          <div className="flex items-center gap-2">
            {products.length === 0 && (
              <button
                type="button"
                onClick={handleSeedDemoData}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 bg-transparent hover:bg-[#f0f0ef] text-[#141415] font-mono text-xs font-medium px-3.5 py-2 rounded-[4px] border border-[#d9d9d9] transition-all cursor-pointer"
              >
                <Sparkles size={14} className="text-[#f35b22]" />
                <span>Isi Produk Contoh</span>
              </button>
            )}

            {/* Signature Primary Orange "+ Tambah Produk" Button */}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium px-4 py-2 rounded-[4px] text-xs sm:text-sm shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-all cursor-pointer"
            >
              <Plus size={16} strokeWidth={2} />
              <span>Tambah Produk</span>
            </button>
          </div>
        </div>

        {/* PRODUCTS TABLE / LIST */}
        <div className="space-y-2.5">
          {/* Table Header Bar */}
          <div className="hidden sm:grid grid-cols-12 gap-4 bg-[#f0f0ef] text-[#6e6f6c] font-mono text-[11px] uppercase tracking-[0.88px] px-5 py-2.5 rounded-[4px] border border-[#e4e5e1]">
            <div className="col-span-2 text-center">Foto</div>
            <div className="col-span-5 text-left pl-1">Detail Produk</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-3 text-center">Aksi</div>
          </div>

          {/* Product Items */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-14 px-4 bg-[#fafaf8] rounded-[8px] border border-[#e4e5e1] space-y-3 font-mono">
              <Package size={28} className="mx-auto text-[#8c8c89]" />
              <div>
                <p className="text-sm font-semibold text-[#141415]">
                  Belum ada produk di database
                </p>
                <p className="text-xs text-[#6e6f6c] mt-1 max-w-md mx-auto font-sans">
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
                  className="inline-flex items-center gap-1.5 bg-[#f35b22] hover:bg-[#ff5e24] text-white font-mono text-xs font-medium px-4 py-2 rounded-[4px] shadow-xs transition-all mt-1 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Isi Otomatis 4 Produk Contoh</span>
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
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center bg-[#ffffff] hover:bg-[#fafaf8] border border-[#e4e5e1] rounded-[8px] p-3 sm:p-3.5 transition-all shadow-[rgba(24,25,22,0.02)_0px_1px_1px_0px] group"
                >
                  {/* Foto Column */}
                  <div className="sm:col-span-2 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-[4px] overflow-hidden bg-[#f0f0ef] border border-[#e4e5e1] shrink-0">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={product.nama}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8c8c89]">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detail Produk Column */}
                  <div className="sm:col-span-5 space-y-1.5 text-left">
                    <h3 className="text-sm font-semibold text-[#141415] tracking-tight">
                      {product.nama}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Price Tag */}
                      <span className="font-mono font-semibold text-xs text-[#f35b22]">
                        {formatRupiah(product.harga_jual)}
                      </span>

                      {/* Category Badge */}
                      <span className="font-mono text-[10px] text-[#454542] bg-[#f0f0ef] border border-[#e4e5e1] px-2 py-0.5 rounded-[4px]">
                        {product.kategori || "Makanan"}
                      </span>

                      {/* HPP Modal Badge */}
                      {product.hpp > 0 && (
                        <span className="font-mono text-[10px] text-[#8c8c89]">
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
                      className={`px-3 py-1 rounded-[4px] font-mono text-[11px] font-medium transition-all cursor-pointer border ${
                        isHabis
                          ? "bg-[#fdeaea] text-[#be400f] border-[#f67976] hover:bg-[#fbdcdc]"
                          : "bg-[#eef8f0] text-[#165424] border-[#62b06d] hover:bg-[#e2f3e5]"
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
                      className="inline-flex items-center gap-1.5 bg-transparent hover:bg-[#f0f0ef] text-[#141415] font-mono font-medium px-3 py-1 rounded-[4px] text-xs border border-[#d9d9d9] transition-all cursor-pointer"
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(product)}
                      className="inline-flex items-center gap-1.5 bg-transparent hover:bg-[#fdeaea] text-[#be400f] font-mono font-medium px-3 py-1 rounded-[4px] text-xs border border-[#f9aea9] transition-all cursor-pointer"
                    >
                      <Trash2 size={13} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141415]/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#ffffff] border border-[#e4e5e1] w-full max-w-lg rounded-[12px] p-6 shadow-2xl space-y-5 text-[#141415] relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e4e5e1] pb-3.5">
              <div className="space-y-0.5">
                <div className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#f35b22]">
                  [ {editingProduct ? "PERBARUI PRODUK" : "FORM PRODUK BARU"} ]
                </div>
                <h3 className="text-base font-semibold text-[#141415]">
                  {editingProduct ? "Edit Data Produk" : "Tambah Produk Baru"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="w-7 h-7 rounded-[4px] bg-[#f0f0ef] hover:bg-[#e4e5e1] text-[#141415] flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
              className="space-y-4"
            >
              {/* Nama Produk */}
              <div>
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
                  Nama Produk <span className="text-[#f67976]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Nasi Goreng Jawa"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] px-3.5 py-2 text-sm text-[#141415] focus:outline-none focus:border-[#f35b22] transition-all"
                />
              </div>

              {/* Harga Jual & HPP Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
                    Harga Jual (Rp) <span className="text-[#f67976]">*</span>
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
                    className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] px-3.5 py-2 font-mono text-sm text-[#141415] focus:outline-none focus:border-[#f35b22] transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
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
                    className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] px-3.5 py-2 font-mono text-sm text-[#141415] focus:outline-none focus:border-[#f35b22] transition-all"
                  />
                </div>
              </div>

              {/* Kategori & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value)}
                    className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] px-3.5 py-2 text-xs font-mono font-medium text-[#141415] focus:outline-none focus:border-[#f35b22] transition-all"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Cemilan">Cemilan</option>
                    <option value="Paket">Paket</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
                    Status Produk
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(e.target.value as "Tersedia" | "Habis")
                    }
                    className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] px-3.5 py-2 text-xs font-mono font-medium text-[#141415] focus:outline-none focus:border-[#f35b22] transition-all"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Habis">Habis</option>
                  </select>
                </div>
              </div>

              {/* Foto Preset / Image URL */}
              <div>
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
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
                        className={`relative w-11 h-11 rounded-[4px] overflow-hidden border shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#f35b22] ring-1 ring-[#f35b22]"
                            : "border-[#e4e5e1] opacity-70 hover:opacity-100"
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
                  className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] px-3.5 py-2 font-mono text-xs text-[#141415] placeholder-[#8c8c89] focus:outline-none focus:border-[#f35b22] transition-all mt-1"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e4e5e1]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-[4px] bg-transparent hover:bg-[#f0f0ef] text-[#141415] font-mono text-xs font-medium border border-[#d9d9d9] transition-all cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium px-4 py-2 rounded-[4px] text-xs shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPending && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingProduct ? "Simpan Perubahan" : "Simpan Produk Ke DB"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: KONFIRMASI HAPUS */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141415]/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#ffffff] border border-[#f9aea9] w-full max-w-md rounded-[12px] p-6 shadow-2xl space-y-4 text-[#141415]">
            <div className="flex items-center gap-2.5 text-[#be400f]">
              <div className="w-8 h-8 rounded-[4px] bg-[#fdeaea] border border-[#f9aea9] flex items-center justify-center font-bold">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-base font-semibold text-[#141415]">Hapus Produk?</h3>
            </div>

            <p className="text-xs text-[#6e6f6c] leading-relaxed">
              Apakah Anda yakin ingin menghapus produk{" "}
              <strong className="text-[#141415] font-semibold">&quot;{deletingProduct.nama}&quot;</strong> dari database?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e4e5e1]">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-[4px] bg-transparent hover:bg-[#f0f0ef] text-[#141415] font-mono text-xs font-medium border border-[#d9d9d9] transition-all cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 bg-[#be400f] hover:bg-[#d14200] text-white font-mono font-medium px-4 py-2 rounded-[4px] text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 size={13} className="animate-spin" />}
                <span>Hapus Produk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

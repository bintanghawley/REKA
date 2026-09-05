"use client";

import { useState, useEffect, useTransition, useRef } from "react";
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
  Upload,
  Camera,
  RefreshCw,
  Tag,
  Check,
} from "lucide-react";
import type { Produk } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  bulkCreateProductsAction,
  renameCategoryAction,
  deleteCategoryAction,
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

// Helper untuk kompresi foto klien (WebP/JPEG max 600x600 px) agar ringan & cepat disimpan ke DB
function compressImage(file: File, maxWidth = 600, maxHeight = 600, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl =
          canvas.toDataURL("image/webp", quality) ||
          canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Gagal membaca file gambar"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

export function ProductView({ initialProducts, userId }: Props) {
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
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Category State & LocalStorage Persistence (Scoped to User)
  const storageKey = `reka_custom_categories_${userId || "default"}`;
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCatInput, setNewCatInput] = useState("");
  const [editingCatOld, setEditingCatOld] = useState<string | null>(null);
  const [editingCatNew, setEditingCatNew] = useState("");
  const [isInlineAddCat, setIsInlineAddCat] = useState(false);
  const [inlineCatInput, setInlineCatInput] = useState("");

  // Load custom categories from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCustomCategories(
            parsed.filter((c): c is string => typeof c === "string" && Boolean(c.trim()))
          );
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const saveCustomCategories = (cats: string[]) => {
    setCustomCategories(cats);
    try {
      localStorage.setItem(storageKey, JSON.stringify(cats));
    } catch {
      // ignore
    }
  };

  // List of all unique categories (combination of customCategories + existing products)
  const allCategories = Array.from(
    new Set([
      ...customCategories,
      ...products
        .map((p) => p.kategori?.trim())
        .filter((k): k is string => Boolean(k)),
    ])
  );

  // Alert / Toast state
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form states
  const [formNama, setFormNama] = useState("");
  const [formHargaJual, setFormHargaJual] = useState<number | "">("");
  const [formHpp, setFormHpp] = useState<number | "">("");
  const [formKategori, setFormKategori] = useState("");
  const [formStatus, setFormStatus] = useState<"Tersedia" | "Habis">("Tersedia");
  const [formFoto, setFormFoto] = useState("");
  const [fotoTab, setFotoTab] = useState<"upload" | "preset" | "url">("upload");
  const [isCompressing, setIsCompressing] = useState(false);

  // Camera Live Stream States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Category CRUD Handlers
  const handleAddCategory = () => {
    const name = newCatInput.trim();
    if (!name) {
      showFeedback("error", "Nama kategori tidak boleh kosong.");
      return;
    }
    const exists = allCategories.some(
      (c) => c.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      showFeedback("error", `Kategori "${name}" sudah ada.`);
      return;
    }
    const updated = [...customCategories, name];
    saveCustomCategories(updated);
    setNewCatInput("");
    showFeedback("success", `Kategori "${name}" berhasil ditambahkan!`);
  };

  const handleInlineAddCategory = () => {
    const name = inlineCatInput.trim();
    if (!name) {
      showFeedback("error", "Nama kategori tidak boleh kosong.");
      return;
    }
    const exists = allCategories.find(
      (c) => c.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      setFormKategori(exists);
      setIsInlineAddCat(false);
      setInlineCatInput("");
      showFeedback("success", `Kategori "${exists}" dipilih.`);
      return;
    }
    const updated = [...customCategories, name];
    saveCustomCategories(updated);
    setFormKategori(name);
    setIsInlineAddCat(false);
    setInlineCatInput("");
    showFeedback("success", `Kategori "${name}" berhasil dibuat & dipilih!`);
  };

  const handleRenameCategory = (oldName: string) => {
    const newName = editingCatNew.trim();
    if (!newName) {
      showFeedback("error", "Nama baru kategori tidak boleh kosong.");
      return;
    }
    if (newName.toLowerCase() === oldName.toLowerCase()) {
      setEditingCatOld(null);
      return;
    }

    startTransition(async () => {
      const res = await renameCategoryAction(oldName, newName);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.kategori?.trim() === oldName ? { ...p, kategori: newName } : p
          )
        );
        const updated = customCategories.map((c) =>
          c.toLowerCase() === oldName.toLowerCase() ? newName : c
        );
        if (!updated.some((c) => c.toLowerCase() === newName.toLowerCase())) {
          updated.push(newName);
        }
        saveCustomCategories(Array.from(new Set(updated)));

        if (formKategori === oldName) setFormKategori(newName);
        if (selectedCategory === oldName) setSelectedCategory(newName);

        setEditingCatOld(null);
        setEditingCatNew("");
        showFeedback(
          "success",
          `Kategori "${oldName}" diubah menjadi "${newName}" (${res.data?.updatedCount || 0} produk terupdate).`
        );
        router.refresh();
      } else {
        showFeedback("error", res.error || "Gagal mengubah nama kategori.");
      }
    });
  };

  const handleDeleteCategory = (catToDelete: string) => {
    startTransition(async () => {
      const res = await deleteCategoryAction(catToDelete);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.kategori?.trim() === catToDelete ? { ...p, kategori: "" } : p
          )
        );
        const updated = customCategories.filter(
          (c) => c.toLowerCase() !== catToDelete.toLowerCase()
        );
        saveCustomCategories(updated);

        if (formKategori === catToDelete) setFormKategori("");
        if (selectedCategory === catToDelete) setSelectedCategory("Semua");

        showFeedback(
          "success",
          `Kategori "${catToDelete}" dihapus (${res.data?.updatedCount || 0} produk diperbarui).`
        );
        router.refresh();
      } else {
        showFeedback("error", res.error || "Gagal menghapus kategori.");
      }
    });
  };

  // Stop camera tracks helper
  const stopCameraStream = (streamToStop?: MediaStream | null) => {
    const stream = streamToStop || cameraStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStream(null);
  };

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Start Camera Stream
  const handleStartCamera = async (facing: "environment" | "user" = cameraFacing) => {
    setCameraError(null);
    setIsStartingCamera(true);
    setIsCameraOpen(true);

    // Stop existing stream if running
    stopCameraStream();

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Perangkat browser Anda tidak mendukung akses kamera langsung.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setCameraStream(stream);
      setCameraFacing(facing);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      let msg = "Gagal mengakses kamera.";
      if (errorObj?.name === "NotAllowedError" || errorObj?.name === "PermissionDeniedError") {
        msg = "Izin akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda.";
      } else if (errorObj?.name === "NotFoundError" || errorObj?.name === "DevicesNotFoundError") {
        msg = "Kamera tidak ditemukan pada perangkat Anda.";
      } else if (errorObj?.message) {
        msg = errorObj.message;
      }
      setCameraError(msg);
    } finally {
      setIsStartingCamera(false);
    }
  };

  // Switch between front and rear camera
  const handleSwitchCamera = () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    handleStartCamera(nextFacing);
  };

  // Close Camera
  const handleCloseCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCameraError(null);
  };

  // Capture Photo from Live Video Feed
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;

    // Determine max dimension (800px) and scale down
    let width = videoWidth;
    let height = videoHeight;
    const maxDim = 800;
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      showFeedback("error", "Gagal memproses jepretan foto.");
      return;
    }

    // Flip horizontally if using front/user camera for natural mirror look
    if (cameraFacing === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/webp", 0.85) || canvas.toDataURL("image/jpeg", 0.85);

    setFormFoto(dataUrl);
    setFotoTab("upload");
    handleCloseCamera();
    showFeedback("success", "Foto berhasil dijepret dari kamera!");
  };

  // Handler Upload Foto dari HP / Komputer / Galeri / Kamera
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showFeedback("error", "File harus berupa format gambar (JPG, PNG, WebP)");
      e.target.value = "";
      return;
    }

    // Validasi Ukuran Maksimal 3MB
    const maxSizeBytes = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSizeBytes) {
      showFeedback(
        "error",
        `Ukuran foto terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maksimal ukuran file adalah 3MB.`
      );
      e.target.value = "";
      return;
    }

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImage(file, 800, 800, 0.85);
      setFormFoto(compressedDataUrl);
      setFotoTab("upload");
      showFeedback("success", "Foto berhasil diproses & dikompres otomatis!");
    } catch {
      showFeedback("error", "Gagal memproses gambar. Silakan coba file lain.");
    } finally {
      setIsCompressing(false);
      // Reset file input value so user can re-upload same file if desired
      e.target.value = "";
    }
  };

  // Open modal functions
  const handleOpenAdd = () => {
    setFormNama("");
    setFormHargaJual("");
    setFormHpp("");
    setFormKategori(allCategories[0] || "");
    setIsInlineAddCat(false);
    setInlineCatInput("");
    setFormStatus("Tersedia");
    setFormFoto("");
    setFotoTab("upload");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Produk) => {
    setEditingProduct(p);
    setFormNama(p.nama);
    setFormHargaJual(p.harga_jual);
    setFormHpp(p.hpp);
    setFormKategori(p.kategori || "");
    setIsInlineAddCat(false);
    setInlineCatInput("");
    setFormStatus((p.status as "Tersedia" | "Habis") || "Tersedia");
    setFormFoto(p.foto || "");
    if (p.foto && p.foto.startsWith("data:image")) {
      setFotoTab("upload");
    } else if (p.foto && PRESET_PHOTOS.some((pr) => pr.url === p.foto)) {
      setFotoTab("preset");
    } else if (p.foto) {
      setFotoTab("url");
    } else {
      setFotoTab("upload");
    }
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
        kategori: formKategori.trim() || undefined,
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
        kategori: formKategori.trim() || undefined,
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

  // List of unique categories for top filter bar
  const availableCategories = ["Semua", ...allCategories];

  // Filter products by search query & category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nama
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      (p.kategori?.trim() || "") === selectedCategory;
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Kelola Kategori Button */}
            <button
              type="button"
              onClick={() => {
                setNewCatInput("");
                setEditingCatOld(null);
                setIsCategoryModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-transparent hover:bg-[#f0f0ef] text-[#141415] font-mono text-xs font-medium px-3.5 py-2 rounded-[4px] border border-[#d9d9d9] transition-all cursor-pointer"
            >
              <Tag size={14} className="text-[#f35b22]" />
              <span>Kelola Kategori ({allCategories.length})</span>
            </button>

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
                      {product.kategori ? (
                        <span className="font-mono text-[10px] text-[#454542] bg-[#f0f0ef] border border-[#e4e5e1] px-2 py-0.5 rounded-[4px]">
                          {product.kategori}
                        </span>
                      ) : null}

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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
                      Kategori Produk
                    </label>
                    {!isInlineAddCat ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsInlineAddCat(true);
                          setInlineCatInput("");
                        }}
                        className="font-mono text-[10px] text-[#f35b22] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={11} />
                        <span>Kategori Baru</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsInlineAddCat(false)}
                        className="font-mono text-[10px] text-[#6e6f6c] hover:underline cursor-pointer"
                      >
                        Batal
                      </button>
                    )}
                  </div>

                  {isInlineAddCat ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Nama kategori baru..."
                        value={inlineCatInput}
                        onChange={(e) => setInlineCatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleInlineAddCategory();
                          }
                        }}
                        className="flex-1 bg-[#fafaf8] border border-[#f35b22] rounded-[4px] px-2.5 py-1.5 font-mono text-xs text-[#141415] placeholder-[#8c8c89] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleInlineAddCategory}
                        className="px-2.5 py-1.5 bg-[#f35b22] hover:bg-[#ff5e24] text-white rounded-[4px] font-mono text-xs font-medium cursor-pointer transition-all flex items-center gap-1 shrink-0"
                      >
                        <Check size={12} />
                        <span>Simpan</span>
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formKategori}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsInlineAddCat(true);
                          setInlineCatInput("");
                        } else {
                          setFormKategori(e.target.value);
                        }
                      }}
                      className="w-full bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] px-3 py-2 font-mono text-xs text-[#141415] focus:outline-none focus:border-[#f35b22] transition-all cursor-pointer"
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__NEW__" className="text-[#f35b22] font-semibold">
                        + Tambah Kategori Baru...
                      </option>
                    </select>
                  )}
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

              {/* Foto Produk Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
                    Foto Produk
                  </label>
                  {formFoto && (
                    <button
                      type="button"
                      onClick={() => setFormFoto("")}
                      className="font-mono text-[11px] text-[#f67976] hover:underline cursor-pointer"
                    >
                      [Hapus Foto]
                    </button>
                  )}
                </div>

                {/* Tab Switcher: Upload vs Preset vs URL */}
                <div className="flex items-center gap-1 p-1 bg-[#f0f0ef] rounded-[4px] border border-[#e4e5e1] text-xs">
                  <button
                    type="button"
                    onClick={() => setFotoTab("upload")}
                    className={`flex-1 py-1.5 px-2 rounded-[4px] font-mono text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      fotoTab === "upload"
                        ? "bg-white text-[#141415] font-semibold shadow-xs border border-[#e4e5e1]"
                        : "text-[#6e6f6c] hover:text-[#141415]"
                    }`}
                  >
                    <Upload size={12} />
                    <span>Upload / Galeri</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFotoTab("preset")}
                    className={`flex-1 py-1.5 px-2 rounded-[4px] font-mono text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      fotoTab === "preset"
                        ? "bg-white text-[#141415] font-semibold shadow-xs border border-[#e4e5e1]"
                        : "text-[#6e6f6c] hover:text-[#141415]"
                    }`}
                  >
                    <Sparkles size={12} />
                    <span>Preset Pilihan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFotoTab("url")}
                    className={`flex-1 py-1.5 px-2 rounded-[4px] font-mono text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      fotoTab === "url"
                        ? "bg-white text-[#141415] font-semibold shadow-xs border border-[#e4e5e1]"
                        : "text-[#6e6f6c] hover:text-[#141415]"
                    }`}
                  >
                    <ImageIcon size={12} />
                    <span>Tempel URL</span>
                  </button>
                </div>

                {/* TAB 1: UPLOAD FOTO DARI PERANGKAT (2 TOMBOL TERPISAH: GALERI & KAMERA) */}
                {fotoTab === "upload" && (
                  <div className="space-y-2.5 p-3.5 rounded-[8px] bg-[#fafaf8] border border-[#e4e5e1]">
                    <div className="flex items-center gap-3.5">
                      {formFoto ? (
                        <div className="relative w-20 h-20 rounded-[6px] overflow-hidden border border-[#e4e5e1] bg-[#f0f0ef] shrink-0 group">
                          <img
                            src={formFoto}
                            alt="Preview Produk"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-[6px] border border-dashed border-[#d9d9d9] bg-[#ffffff] flex flex-col items-center justify-center text-[#8c8c89] shrink-0">
                          <ImageIcon size={22} className="text-[#8c8c89]" />
                          <span className="font-mono text-[9px] mt-1 text-[#8c8c89]">Foto Menu</span>
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Tombol 1: Pilih dari Galeri / File Komputer */}
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#ffffff] hover:bg-[#fafaf8] border border-[#d9d9d9] text-[#141415] rounded-[4px] text-xs font-mono font-medium cursor-pointer transition-all shadow-xs">
                            {isCompressing ? (
                              <Loader2 size={13} className="animate-spin text-[#f35b22]" />
                            ) : (
                              <Upload size={13} className="text-[#f35b22]" />
                            )}
                            <span>Pilih dari Galeri</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isCompressing}
                              onChange={handleFileUpload}
                            />
                          </label>

                          {/* Tombol 2: Ambil Foto Langsung dari Kamera Live (Webcam / HP Camera Stream) */}
                          <button
                            type="button"
                            onClick={() => handleStartCamera("environment")}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#ffffff] hover:bg-[#fafaf8] border border-[#d9d9d9] text-[#141415] rounded-[4px] text-xs font-mono font-medium cursor-pointer transition-all shadow-xs"
                          >
                            <Camera size={13} className="text-[#0284c7]" />
                            <span>Ambil Foto (Kamera)</span>
                          </button>
                        </div>

                        <p className="font-mono text-[10px] text-[#6e6f6c] leading-tight">
                          Maksimal 3MB per foto • Otomatis dikompres ringan untuk kecepatan kasir POS.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PRESET FOTO */}
                {fotoTab === "preset" && (
                  <div className="space-y-2 p-3 rounded-[8px] bg-[#fafaf8] border border-[#e4e5e1]">
                    <p className="font-mono text-[10px] text-[#6e6f6c] mb-1.5">
                      Pilih dari koleksi foto makanan & minuman:
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                      {PRESET_PHOTOS.map((preset) => {
                        const isSelected = formFoto === preset.url;
                        return (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => setFormFoto(preset.url)}
                            title={preset.label}
                            className={`relative aspect-square rounded-[4px] overflow-hidden border transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#f35b22] ring-2 ring-[#f35b22]"
                                : "border-[#e4e5e1] opacity-75 hover:opacity-100"
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
                  </div>
                )}

                {/* TAB 3: TEMPEL URL */}
                {fotoTab === "url" && (
                  <div className="space-y-2 p-3 rounded-[8px] bg-[#fafaf8] border border-[#e4e5e1]">
                    <label className="block font-mono text-[10px] text-[#6e6f6c]">
                      Tempel URL Gambar Eksternal:
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/foto-produk.jpg"
                      value={formFoto}
                      onChange={(e) => setFormFoto(e.target.value)}
                      className="w-full bg-[#ffffff] border border-[#e4e5e1] rounded-[4px] px-3.5 py-2 font-mono text-xs text-[#141415] placeholder-[#8c8c89] focus:outline-none focus:border-[#f35b22] transition-all"
                    />
                  </div>
                )}
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

      {/* 5. MODAL: LIVE CAMERA VIEWFINDER */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#141415]/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1c1c1e] text-[#f5f5f7] border border-[#2c2c2f] w-full max-w-md rounded-[12px] p-5 shadow-2xl space-y-4 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2c2c2f] pb-3">
              <div className="space-y-0.5">
                <div className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#f35b22]">
                  [ AMBIL FOTO PRODUK ]
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Kamera {cameraFacing === "environment" ? "Belakang" : "Depan"}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseCamera}
                className="w-7 h-7 rounded-[4px] bg-[#2c2c2f] hover:bg-[#3a3a3c] text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Viewfinder Screen */}
            <div className="relative aspect-square w-full bg-black rounded-[8px] overflow-hidden border border-[#2c2c2f] flex items-center justify-center">
              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  cameraFacing === "user" ? "-scale-x-100" : ""
                }`}
              />

              {/* Viewfinder Target Framing Grid */}
              <div className="absolute inset-4 border border-white/20 rounded-[6px] pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-3 h-3 border-t-2 border-l-2 border-[#f35b22]" />
                  <div className="w-3 h-3 border-t-2 border-r-2 border-[#f35b22]" />
                </div>
                <div className="flex justify-between">
                  <div className="w-3 h-3 border-b-2 border-l-2 border-[#f35b22]" />
                  <div className="w-3 h-3 border-b-2 border-r-2 border-[#f35b22]" />
                </div>
              </div>

              {/* Loading State */}
              {isStartingCamera && (
                <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 z-10 text-white font-mono text-xs">
                  <Loader2 size={24} className="animate-spin text-[#f35b22]" />
                  <span>Membuka kamera...</span>
                </div>
              )}

              {/* Error State */}
              {cameraError && (
                <div className="absolute inset-0 bg-black/90 p-5 flex flex-col items-center justify-center text-center gap-3 z-20">
                  <AlertTriangle size={32} className="text-[#f67976]" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white font-mono">
                      Tidak Dapat Mengakses Kamera
                    </p>
                    <p className="text-[11px] text-[#a1a1a6] max-w-xs font-sans">
                      {cameraError}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStartCamera(cameraFacing)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f35b22] hover:bg-[#ff5e24] text-white rounded-[4px] font-mono text-xs cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Coba Lagi</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseCamera}
                      className="px-3 py-1.5 bg-[#2c2c2f] hover:bg-[#3a3a3c] text-white rounded-[4px] font-mono text-xs cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Controls / Shutter Bar */}
            {!cameraError && (
              <div className="flex items-center justify-between pt-1">
                {/* Switch Camera Button */}
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  disabled={isStartingCamera}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-[4px] bg-[#2c2c2f] hover:bg-[#3a3a3c] text-white font-mono text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                  title="Ganti kamera depan / belakang"
                >
                  <RefreshCw size={13} className={isStartingCamera ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">Balik</span>
                </button>

                {/* Shutter Capture Button */}
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  disabled={isStartingCamera || !cameraStream}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-[#f35b22] hover:bg-[#ff5e24] text-white shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50 ring-4 ring-[#f35b22]/30"
                  title="Jepret Foto"
                >
                  <Camera size={24} />
                </button>

                {/* Cancel / Close */}
                <button
                  type="button"
                  onClick={handleCloseCamera}
                  className="px-3 py-2 rounded-[4px] bg-[#2c2c2f] hover:bg-[#3a3a3c] text-[#a1a1a6] hover:text-white font-mono text-xs font-medium transition-all cursor-pointer"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. MODAL: KELOLA KATEGORI PRODUK */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141415]/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#ffffff] border border-[#e4e5e1] w-full max-w-lg rounded-[12px] p-6 shadow-2xl space-y-5 text-[#141415] relative max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#e4e5e1] pb-3.5 shrink-0">
              <div className="space-y-0.5">
                <div className="font-mono text-[10px] uppercase tracking-[0.88px] text-[#f35b22]">
                  [ KELOLA KATEGORI USAHA ]
                </div>
                <h3 className="text-base font-semibold text-[#141415]">
                  Daftar Kategori Produk
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCatOld(null);
                }}
                className="w-7 h-7 rounded-[4px] bg-[#f0f0ef] hover:bg-[#e4e5e1] text-[#141415] flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="space-y-5 overflow-y-auto pr-1 flex-1">
              {/* Form Input Tambah Kategori Baru */}
              <div className="bg-[#fafaf8] border border-[#e4e5e1] rounded-[8px] p-3.5 space-y-2.5">
                <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
                  Tambah Kategori Baru
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: Makanan Berat, Minuman Dingin, Snack..."
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                    className="flex-1 bg-[#ffffff] border border-[#e4e5e1] rounded-[4px] px-3 py-2 text-xs font-mono text-[#141415] placeholder-[#8c8c89] focus:outline-none focus:border-[#f35b22] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCategory()}
                    className="inline-flex items-center gap-1.5 bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium px-3.5 py-2 rounded-[4px] text-xs shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    <Plus size={14} />
                    <span>Tambah</span>
                  </button>
                </div>
                <p className="font-mono text-[10px] text-[#8c8c89]">
                  Kategori akan langsung tersedia di kasir POS dan form edit produk.
                </p>
              </div>

              {/* Daftar Kategori Yang Terdaftar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c]">
                    Kategori Terdaftar ({allCategories.length})
                  </span>
                </div>

                {allCategories.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-[#fafaf8] rounded-[8px] border border-[#e4e5e1] space-y-2 font-mono">
                    <Tag size={22} className="mx-auto text-[#8c8c89]" />
                    <p className="text-xs text-[#6e6f6c]">
                      Belum ada kategori yang dibuat. Tambahkan kategori pertama Anda di atas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allCategories.map((cat) => {
                      const count = products.filter(
                        (p) => (p.kategori?.trim().toLowerCase() || "") === cat.toLowerCase()
                      ).length;
                      const isEditing = editingCatOld === cat;

                      return (
                        <div
                          key={cat}
                          className="flex items-center justify-between gap-3 p-2.5 sm:p-3 bg-[#ffffff] hover:bg-[#fafaf8] border border-[#e4e5e1] rounded-[6px] transition-all"
                        >
                          {isEditing ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                type="text"
                                autoFocus
                                value={editingCatNew}
                                onChange={(e) => setEditingCatNew(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleRenameCategory(cat);
                                  } else if (e.key === "Escape") {
                                    setEditingCatOld(null);
                                  }
                                }}
                                className="flex-1 bg-[#ffffff] border border-[#f35b22] rounded-[4px] px-2.5 py-1 text-xs font-mono text-[#141415] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleRenameCategory(cat)}
                                disabled={isPending}
                                className="px-2.5 py-1 bg-[#f35b22] hover:bg-[#ff5e24] text-white rounded-[4px] font-mono text-xs font-medium cursor-pointer transition-all flex items-center gap-1 shrink-0"
                              >
                                {isPending ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Check size={12} />
                                )}
                                <span>Simpan</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCatOld(null)}
                                className="px-2.5 py-1 bg-[#f0f0ef] hover:bg-[#e4e5e1] text-[#141415] rounded-[4px] font-mono text-xs cursor-pointer transition-all shrink-0"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="font-semibold text-xs sm:text-sm text-[#141415] truncate">
                                  {cat}
                                </span>
                                <span className="font-mono text-[10px] text-[#6e6f6c] bg-[#f0f0ef] border border-[#e4e5e1] px-2 py-0.5 rounded-[4px] shrink-0">
                                  {count} Produk
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCatOld(cat);
                                    setEditingCatNew(cat);
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#ffffff] hover:bg-[#f0f0ef] text-[#141415] font-mono text-xs border border-[#d9d9d9] transition-all cursor-pointer"
                                >
                                  <Edit size={11} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(cat)}
                                  disabled={isPending}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#ffffff] hover:bg-[#fdeaea] text-[#be400f] font-mono text-xs border border-[#f9aea9] transition-all cursor-pointer"
                                >
                                  <Trash2 size={11} />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-[#e4e5e1] shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCatOld(null);
                }}
                className="px-4 py-2 rounded-[4px] bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

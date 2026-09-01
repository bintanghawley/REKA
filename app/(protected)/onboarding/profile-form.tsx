"use client";

import { useState } from "react";
import { completeOnboardingAction, updateProfileAction } from "@/lib/actions/profile";
import type { Profile } from "@/types/database";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

interface ProfileFormProps {
  initialProfile: Profile | null;
}

interface ProductItem {
  nama: string;
  harga_jual: string;
  hpp: string;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter();
  const [namaUsaha, setNamaUsaha] = useState(initialProfile?.nama_usaha || "");
  const [jenisUsaha, setJenisUsaha] = useState(initialProfile?.jenis_usaha || "");
  const [initialProducts, setInitialProducts] = useState<ProductItem[]>([
    { nama: "", harga_jual: "", hpp: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleAddProductRow() {
    setInitialProducts([...initialProducts, { nama: "", harga_jual: "", hpp: "" }]);
  }

  function handleRemoveProductRow(index: number) {
    setInitialProducts(initialProducts.filter((_, i) => i !== index));
  }

  function handleProductChange(index: number, field: keyof ProductItem, value: string) {
    const updated = [...initialProducts];
    updated[index][field] = value;
    setInitialProducts(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      // Filter produk yang terisi nama & harganya
      const validProducts = initialProducts
        .filter((p) => p.nama.trim().length > 0)
        .map((p) => ({
          nama: p.nama.trim(),
          harga_jual: Number(p.harga_jual) || 0,
          hpp: Number(p.hpp) || 0,
        }));

      const res = await completeOnboardingAction({
        nama_usaha: namaUsaha,
        jenis_usaha: jenisUsaha,
        initialProducts: validProducts,
      });

      if (!res.success) {
        setError(res.error || "Gagal memperbarui profil.");
      } else {
        setSuccessMsg("Profil dan pengaturan awal usaha berhasil disimpan!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6"
    >
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
          {successMsg}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-800 border-b pb-2">
          1. Informasi Usaha
        </h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Nama Usaha / Warung / Lapak
          </label>
          <input
            type="text"
            value={namaUsaha}
            onChange={(e) => setNamaUsaha(e.target.value)}
            required
            placeholder="Contoh: Warung Berkah Maju"
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Jenis Usaha
          </label>
          <input
            type="text"
            value={jenisUsaha}
            onChange={(e) => setJenisUsaha(e.target.value)}
            required
            placeholder="Contoh: Makanan & Minuman, Warung Sembako, Fashion, dll"
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              2. Daftar Produk Awal (Opsional)
            </h2>
            <p className="text-xs text-slate-500">
              Masukkan menu / produk yang sering dijual beserta modal (HPP)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddProductRow}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
          >
            <Plus size={14} /> Tambah Produk
          </button>
        </div>

        <div className="space-y-3">
          {initialProducts.map((prod, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 items-center"
            >
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-medium text-slate-500 sm:hidden">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={prod.nama}
                  onChange={(e) =>
                    handleProductChange(idx, "nama", e.target.value)
                  }
                  placeholder="Nama produk (misal: Es Kopi)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-medium text-slate-500 sm:hidden">
                  Harga Jual
                </label>
                <input
                  type="number"
                  min="0"
                  value={prod.harga_jual}
                  onChange={(e) =>
                    handleProductChange(idx, "harga_jual", e.target.value)
                  }
                  placeholder="Harga Jual (Rp)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-medium text-slate-500 sm:hidden">
                  HPP / Modal
                </label>
                <input
                  type="number"
                  min="0"
                  value={prod.hpp}
                  onChange={(e) =>
                    handleProductChange(idx, "hpp", e.target.value)
                  }
                  placeholder="HPP (Rp)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-1 flex justify-end">
                {initialProducts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProductRow(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-primary/20 disabled:opacity-50"
      >
        {isLoading ? "Menyimpan..." : "Simpan & Masuk ke Dashboard"}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import type { Profile } from "@/types/database";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  initialProfile: Profile | null;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter();
  const [namaUsaha, setNamaUsaha] = useState(initialProfile?.nama_usaha || "");
  const [jenisUsaha, setJenisUsaha] = useState(initialProfile?.jenis_usaha || "");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await updateProfileAction({
        nama_usaha: namaUsaha,
        jenis_usaha: jenisUsaha,
      });

      if (!res.success) {
        setError(res.error || "Gagal memperbarui profil.");
      } else {
        setSuccessMsg("Profil usaha berhasil disimpan!");
        router.refresh();
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
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5"
    >
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Nama Usaha / Toko
        </label>
        <input
          type="text"
          value={namaUsaha}
          onChange={(e) => setNamaUsaha(e.target.value)}
          required
          placeholder="Contoh: Warung Berkah Maju"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          placeholder="Contoh: Warung Kelontong, Makanan Minuman, Fashion"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
      >
        {isLoading ? "Menyimpan..." : "Simpan Perubahan Profil"}
      </button>
    </form>
  );
}

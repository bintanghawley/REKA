"use client";

import { useState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import type { Profile } from "@/types/database";
import { useRouter } from "next/navigation";
import { CircleUserRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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
        setSuccessMsg("Profil usaha berhasil diperbarui!");
        setTimeout(() => {
          router.refresh();
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
      className="bg-white p-6 sm:p-7 rounded-[12px] border border-[#e4e5e1] shadow-[rgba(228,229,225,0.3)_0px_1px_0px_0px_inset,rgba(110,111,109,0.1)_0px_-1px_0px_0px_inset] space-y-6"
    >
      {error && (
        <div className="p-3.5 bg-rose-50/70 border border-rose-200 text-rose-800 text-xs font-medium rounded-[4px] flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-[4px] flex items-start gap-2.5">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#e4e5e1] pb-3">
          <div className="w-7 h-7 rounded-[4px] bg-[#fafaf8] border border-[#e4e5e1] flex items-center justify-center text-[#f35b22]">
            <CircleUserRound size={16} />
          </div>
          <h2 className="text-sm font-semibold text-[#141415] tracking-tight">
            Informasi Usaha & Pelaku UMKM
          </h2>
        </div>

        <div>
          <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
            Nama Usaha / Warung / Lapak <span className="text-[#f35b22]">*</span>
          </label>
          <input
            type="text"
            value={namaUsaha}
            onChange={(e) => setNamaUsaha(e.target.value)}
            required
            placeholder="Contoh: Warung Berkah Maju"
            className="w-full px-3.5 py-2.5 bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] text-sm text-[#141415] placeholder-[#b7b7b4] focus:outline-none focus:border-[#f35b22] focus:bg-white focus:ring-1 focus:ring-[#f35b22] transition-all"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.88px] text-[#6e6f6c] mb-1.5">
            Jenis Usaha <span className="text-[#f35b22]">*</span>
          </label>
          <input
            type="text"
            value={jenisUsaha}
            onChange={(e) => setJenisUsaha(e.target.value)}
            required
            placeholder="Contoh: Makanan & Minuman, Warung Sembako, Fashion, dll"
            className="w-full px-3.5 py-2.5 bg-[#fafaf8] border border-[#e4e5e1] rounded-[4px] text-sm text-[#141415] placeholder-[#b7b7b4] focus:outline-none focus:border-[#f35b22] focus:bg-white focus:ring-1 focus:ring-[#f35b22] transition-all"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#f35b22] hover:bg-[#ff5e24] text-white font-medium text-sm rounded-[4px] shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Menyimpan Perubahan...</span>
            </>
          ) : (
            <span>✓ Simpan Perubahan</span>
          )}
        </button>
      </div>
    </form>
  );
}

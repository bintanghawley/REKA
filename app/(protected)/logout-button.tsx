"use client";

import { logoutAction } from "@/lib/actions/auth";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { ConfirmModal } from "@/components/confirm-modal";

export function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirmLogout() {
    setIsLoading(true);
    try {
      await logoutAction();
      // Redirect langsung ke landing page (/) dan reset cache sesi
      window.location.href = "/";
    } catch {
      alert("Gagal keluar dari aplikasi. Silakan coba lagi.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-[#D61F1F] hover:bg-[#B91C1C] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <LogOut size={16} />
        )}
        <span>Logout</span>
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Konfirmasi Keluar Akun"
        description="Apakah Anda yakin ingin keluar dari aplikasi REKA? Sesi kasir Anda akan diakhiri dan Anda akan dialihkan ke halaman utama."
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        variant="danger"
        isLoading={isLoading}
      />
    </>
  );
}


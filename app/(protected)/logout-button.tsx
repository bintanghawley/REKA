"use client";

import { logoutAction } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    try {
      await logoutAction();
      router.push("/login");
      router.refresh();
    } catch {
      alert("Gagal logout.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="text-xs px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50"
    >
      {isLoading ? "Keluar..." : "Keluar"}
    </button>
  );
}

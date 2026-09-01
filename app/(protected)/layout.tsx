import { getCurrentUser, getCurrentProfile } from "@/lib/auth/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <span className="font-bold text-base text-slate-800">
                {profile?.nama_usaha || "UMKM App"}
              </span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                {profile?.jenis_usaha || "SDG 8"}
              </span>
            </div>

            <nav className="hidden md:flex space-x-4 text-sm font-medium">
              <Link
                href="/dashboard"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/transaksi"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Catat Transaksi
              </Link>
              <Link
                href="/pengeluaran"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Pengeluaran
              </Link>
              <Link
                href="/riwayat"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Riwayat
              </Link>
              <Link
                href="/onboarding"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Profil Usaha
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-100 space-x-4 text-xs font-medium text-slate-600">
          <Link href="/dashboard" className="hover:text-blue-600 whitespace-nowrap">
            Dashboard
          </Link>
          <Link href="/transaksi" className="hover:text-blue-600 whitespace-nowrap">
            Transaksi
          </Link>
          <Link href="/pengeluaran" className="hover:text-blue-600 whitespace-nowrap">
            Pengeluaran
          </Link>
          <Link href="/riwayat" className="hover:text-blue-600 whitespace-nowrap">
            Riwayat
          </Link>
          <Link href="/onboarding" className="hover:text-blue-600 whitespace-nowrap">
            Profil
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
        Base Backend UMKM • ItechnoCup 2026 (SDG 8)
      </footer>
    </div>
  );
}

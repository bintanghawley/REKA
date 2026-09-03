import { getCurrentUser, getCurrentProfile } from "@/lib/auth/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";
import { SidebarNav, MobileNav } from "./sidebar-nav";
import { BarChart3 } from "lucide-react";

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
  const userName = (profile?.nama_usaha || user.email?.split("@")[0] || "Pedagang").toLowerCase();
  const userEmail = user.email || "user@reka.com";

  return (
    <div className="min-h-screen bg-neutral-bg font-sans flex flex-col md:flex-row text-neutral-dark">
      {/* SIDEBAR (Desktop - Fixed & Stationary) */}
      <aside className="hidden md:flex w-64 fixed top-0 left-0 bottom-0 h-screen shrink-0 bg-white border-r border-neutral-dark/10 flex-col justify-between p-6 z-40 shadow-sm overflow-y-auto">
        <div className="space-y-8">
          {/* Brand Logo - REKA UMKM */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group px-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <BarChart3 className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary-dark">
              REKA UMKM
            </span>
          </Link>

          {/* Dynamic Active Navigation Links */}
          <SidebarNav />
        </div>

        {/* Bottom User Info & Logout Button */}
        <div className="space-y-4 pt-6 border-t border-neutral-dark/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary-dark uppercase text-sm shrink-0">
              {userName.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-primary-dark truncate capitalize">
                {userName}
              </p>
              <p className="text-xs text-neutral-dark/60 truncate">
                {userEmail}
              </p>
            </div>
          </div>

          <div className="w-full">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden bg-white border-b border-neutral-dark/10 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-xs">
            <BarChart3 className="text-white" size={18} />
          </div>
          <span className="font-bold text-lg text-primary-dark tracking-tight">
            REKA UMKM
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </header>

      {/* MOBILE NAV BAR (Dynamic Active Route Pills) */}
      <MobileNav />

      {/* MAIN CONTENT WORKSPACE (Offset by md:ml-64 for fixed sidebar) */}
      <main className="flex-1 md:ml-64 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative overflow-x-hidden">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary-light/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}



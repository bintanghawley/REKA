import { getCurrentUser, getCurrentProfile } from "@/lib/auth/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import nextDynamic from "next/dynamic";
import { LogoutButton } from "./logout-button";
import { SidebarNav, MobileNav } from "./sidebar-nav";

export const dynamic = "force-dynamic";

const ChatWidget = nextDynamic(
  () => import("@/components/chat-widget").then((mod) => mod.ChatWidget)
);

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
    <div className="min-h-screen bg-[#fafaf8] font-sans flex flex-col md:flex-row text-[#141415]">
      {/* SIDEBAR (Desktop - Fixed & Stationary) */}
      <aside className="hidden md:flex w-64 fixed top-0 left-0 bottom-0 h-screen shrink-0 bg-[#ffffff] border-r border-[#e4e5e1] flex-col justify-between p-6 z-40 shadow-xs overflow-y-auto">
        <div className="space-y-7">
          {/* Brand Logo - REKA */}
          <Link href="/dashboard" className="flex items-center px-1 group">
            <img
              src="/logo.png"
              alt="REKA"
              loading="lazy"
              decoding="async"
              className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Dynamic Active Navigation Links */}
          <SidebarNav />
        </div>

        {/* Bottom User Info & Logout Button */}
        <div className="space-y-3.5 pt-5 border-t border-[#e4e5e1]">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-[4px] bg-[#ffcab5] border border-[#f77c55] flex items-center justify-center font-mono font-bold text-[#d14200] uppercase text-xs shrink-0">
              {userName.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-xs text-[#141415] truncate capitalize">
                {userName}
              </p>
              <p className="font-mono text-[10px] text-[#8c8c89] truncate">
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
      <header className="md:hidden bg-[#ffffff] border-b border-[#e4e5e1] px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <Link href="/dashboard" className="flex items-center">
          <img
            src="/logo.png"
            alt="REKA"
            loading="lazy"
            decoding="async"
            className="h-7 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </header>

      {/* MOBILE NAV BAR (Dynamic Active Route Pills) */}
      <MobileNav />

      {/* MAIN CONTENT WORKSPACE (Offset by md:ml-64 for fixed sidebar) */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 max-w-[1200px] w-full mx-auto relative overflow-x-hidden">
        <div className="relative z-10">{children}</div>
      </main>

      <ChatWidget />
    </div>
  );
}



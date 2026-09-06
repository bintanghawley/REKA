"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  History,
  Package,
  UserRound,
} from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/produk", label: "Produk", icon: Package },
    { href: "/transaksi", label: "Transaksi", icon: Receipt },
    { href: "/pengeluaran", label: "Pengeluaran", icon: Wallet },
    { href: "/riwayat", label: "Riwayat", icon: History },
    { href: "/profil", label: "Profil", icon: UserRound },
  ];

  return (
    <nav className="space-y-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[4px] text-sm transition-all ${
              isActive
                ? "bg-[#f35b22] text-white font-medium shadow-[rgba(255,255,255,0.2)_0px_1px_0px_0px_inset,rgba(24,25,22,0.06)_0px_1px_2px_0px,rgba(24,25,22,0.1)_0px_-1px_0px_0px_inset]"
                : "text-[#454542] hover:text-[#141415] hover:bg-[#f0f0ef] font-normal"
            }`}
          >
            <Icon size={17} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/produk", label: "Produk" },
    { href: "/transaksi", label: "Transaksi" },
    { href: "/pengeluaran", label: "Pengeluaran" },
    { href: "/riwayat", label: "Riwayat" },
    { href: "/profil", label: "Profil" },
  ];

  return (
    <div className="md:hidden flex overflow-x-auto bg-[#ffffff] border-b border-[#e4e5e1] px-3 py-2 space-x-1.5 text-xs font-medium text-[#141415] shrink-0 sticky top-[57px] z-40 shadow-xs scrollbar-none">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className={`px-3 py-1.5 rounded-[4px] whitespace-nowrap transition-all font-mono text-[11px] ${
              isActive
                ? "bg-[#f35b22] text-white font-medium shadow-xs"
                : "text-[#6e6f6c] bg-[#ffffff] border border-[#e4e5e1] hover:bg-[#f0f0ef] hover:text-[#141415]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

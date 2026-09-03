"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Bot,
  History,
  Package,
} from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/produk", label: "Produk", icon: Package },
    { href: "/transaksi", label: "Transaksi", icon: Receipt },
    { href: "/pengeluaran", label: "Pengeluaran", icon: Wallet },
    { href: "/onboarding", label: "Asisten AI", icon: Bot },
    { href: "/riwayat", label: "Riwayat", icon: History },
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
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all ${
              isActive
                ? "bg-primary text-white font-bold shadow-md shadow-primary/20 hover:bg-primary-light"
                : "text-neutral-dark hover:text-primary hover:bg-primary/5 font-medium"
            }`}
          >
            <Icon size={18} />
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
    { href: "/onboarding", label: "Asisten AI" },
  ];

  return (
    <div className="md:hidden flex overflow-x-auto bg-white border-b border-neutral-dark/10 px-3 py-2 space-x-1.5 text-xs font-semibold text-neutral-dark shrink-0 sticky top-[57px] z-40 shadow-2xs scrollbar-none">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              isActive
                ? "bg-primary text-white font-bold shadow-2xs"
                : "text-neutral-dark/80 hover:bg-neutral-bg hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

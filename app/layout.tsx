import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "REKA UMKM — Catat Penjualan & Laba Bersih Warung",
  description: "Aplikasi kasir kilat dan manajemen laba rugi UMKM untuk pencatatan transaksi dan pembukuan praktis warung.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans bg-[#fafaf8] text-[#141415] min-h-screen selection:bg-[#ffcab5] selection:text-[#d14200]">
        {children}
      </body>
    </html>
  );
}

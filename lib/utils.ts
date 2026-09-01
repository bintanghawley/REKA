import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke format mata uang Rupiah (IDR)
 * Contoh: 15000 -> "Rp 15.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke format lokal Indonesia (YYYY-MM-DD -> DD MMMM YYYY)
 */
export function formatTanggalIndo(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Mengambil string tanggal dalam format YYYY-MM-DD sesuai timezone (default: Asia/Jakarta).
 */
export function getLocalDateString(
  date: Date = new Date(),
  timeZone: string = "Asia/Jakarta"
): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch {
    return date.toISOString().split("T")[0];
  }
}


"use server";

import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import {
  createTransactionSchema,
  filterTransactionSchema,
  type CreateTransactionInput,
  type FilterTransactionInput,
} from "@/lib/validations/transaction";
import type {
  Transaksi,
  TransaksiWithProduk,
  DailyFinancialSummary,
  HourlySalesPoint,
  TopProductEntry,
  PeriodeSummary,
} from "@/types/database";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// =============================================================================
// Helper: Date range utilities
// =============================================================================

/** Awal hari (00:00:00 UTC) untuk tanggal dalam format YYYY-MM-DD */
function startOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

/** Akhir hari (23:59:59.999 UTC) untuk tanggal dalam format YYYY-MM-DD */
function endOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999Z`);
}

/** Tanggal hari ini dalam format YYYY-MM-DD (UTC) */
function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// =============================================================================
// createTransactionAction
// =============================================================================

/**
 * Mencatat transaksi penjualan harian baru.
 *
 * KEPUTUSAN ARSITEKTUR KRUSIAL:
 * 1. Mengambil harga_jual dan HPP dari tabel master `produk` milik user (snapshot).
 * 2. Menyimpan `waktu` sebagai TIMESTAMPTZ — menggabungkan tanggal + jam dalam 1 kolom.
 *    Ini memudahkan query "omzet per jam" dan "7 hari terakhir" tanpa CONCAT string.
 * 3. Menolak input jika produk tidak ditemukan atau bukan milik user.
 *
 * PENEGAKAN OWNERSHIP (pengganti RLS):
 * - Fetch produk dengan where: { id: produk_id, user_id: user.id }
 * - insert transaksi dengan user_id: user.id (dari session)
 */
export async function createTransactionAction(
  input: CreateTransactionInput
): Promise<ActionResult<Transaksi>> {
  const parseResult = createTransactionSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi data transaksi gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { produk_id, qty, waktu } = parseResult.data;

  try {
    const user = await requireAuth();

    // 1. Ambil data master produk milik user untuk snapshot harga
    // PENEGAKAN OWNERSHIP: where: { id: produk_id, user_id: user.id }
    const product = await db.produk.findFirst({
      where: { id: produk_id, user_id: user.id },
      select: { id: true, harga_jual: true, hpp: true },
    });

    if (!product) {
      return {
        success: false,
        error: "Produk tidak ditemukan atau bukan milik Anda.",
      };
    }

    // 2. Tentukan waktu transaksi — default ke sekarang jika tidak dikirim
    const waktuTransaksi = waktu ? new Date(waktu) : new Date();

    // 3. Simpan transaksi dengan snapshot harga historis
    const transaction = await db.transaksi.create({
      data: {
        user_id: user.id,
        produk_id: product.id,
        qty,
        harga_jual_saat_transaksi: product.harga_jual,
        hpp_saat_transaksi: product.hpp,
        waktu: waktuTransaksi,
      },
    });

    const data: Transaksi = {
      id: transaction.id,
      user_id: transaction.user_id,
      produk_id: transaction.produk_id,
      qty: transaction.qty,
      harga_jual_saat_transaksi: Number(transaction.harga_jual_saat_transaksi),
      hpp_saat_transaksi: Number(transaction.hpp_saat_transaksi),
      waktu: transaction.waktu.toISOString(),
      created_at: transaction.created_at.toISOString(),
    };

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    revalidatePath("/riwayat");
    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mencatat transaksi.";
    return { success: false, error: message };
  }
}

// =============================================================================
// getTransactionsAction
// =============================================================================

/**
 * Mengambil daftar transaksi user dengan opsi filter tanggal dan relasi produk.
 *
 * PENEGAKAN OWNERSHIP (pengganti RLS):
 * where: { user_id: user.id }
 *
 * Filter tanggal menggunakan range DateTime (gte/lte) pada kolom `waktu`.
 */
export async function getTransactionsAction(
  filter?: FilterTransactionInput
): Promise<ActionResult<TransaksiWithProduk[]>> {
  const parseResult = filterTransactionSchema.safeParse(filter || {});
  if (!parseResult.success) {
    return {
      success: false,
      error: "Parameter filter tidak valid.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuth();

    const whereConditions: Record<string, unknown> = {
      user_id: user.id, // PENEGAKAN OWNERSHIP
    };

    // Konversi YYYY-MM-DD string ke DateTime range untuk filter waktu
    if (parseResult.data.tanggalMulai || parseResult.data.tanggalAkhir) {
      whereConditions.waktu = {
        ...(parseResult.data.tanggalMulai && {
          gte: startOfDay(parseResult.data.tanggalMulai),
        }),
        ...(parseResult.data.tanggalAkhir && {
          lte: endOfDay(parseResult.data.tanggalAkhir),
        }),
      };
    }

    if (parseResult.data.produk_id) {
      whereConditions.produk_id = parseResult.data.produk_id;
    }

    const transactions = await db.transaksi.findMany({
      where: whereConditions,
      include: {
        produk: {
          select: { nama: true, harga_jual: true, hpp: true },
        },
      },
      orderBy: { waktu: "desc" },
    });

    const data: TransaksiWithProduk[] = transactions.map((t) => ({
      id: t.id,
      user_id: t.user_id,
      produk_id: t.produk_id,
      qty: t.qty,
      harga_jual_saat_transaksi: Number(t.harga_jual_saat_transaksi),
      hpp_saat_transaksi: Number(t.hpp_saat_transaksi),
      waktu: t.waktu.toISOString(),
      created_at: t.created_at.toISOString(),
      produk: t.produk
        ? {
            nama: t.produk.nama,
            harga_jual: Number(t.produk.harga_jual),
            hpp: Number(t.produk.hpp),
          }
        : null,
    }));

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil daftar transaksi.";
    return { success: false, error: message };
  }
}

// =============================================================================
// getDailyFinancialSummaryAction
// =============================================================================

/**
 * Menghitung ringkasan keuangan harian.
 *
 * Formula bisnis (tidak berubah):
 *   Omzet             = SUM(harga_jual_saat_transaksi * qty)
 *   Total HPP         = SUM(hpp_saat_transaksi * qty)
 *   Laba Kotor        = Omzet - Total HPP
 *   Total Pengeluaran = SUM(nominal pengeluaran)
 *   Laba Bersih       = Laba Kotor - Total Pengeluaran
 *
 * Filter tanggal: WHERE waktu BETWEEN startOfDay AND endOfDay
 *
 * PENEGAKAN OWNERSHIP: semua query dengan where: { user_id: user.id }
 */
export async function getDailyFinancialSummaryAction(
  targetTanggal?: string
): Promise<ActionResult<DailyFinancialSummary>> {
  try {
    const user = await requireAuth();
    const selectedDate = targetTanggal || todayStr();

    // 1. Ambil transaksi pada hari itu
    const transactions = await db.transaksi.findMany({
      where: {
        user_id: user.id,
        waktu: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate),
        },
      },
      select: {
        qty: true,
        harga_jual_saat_transaksi: true,
        hpp_saat_transaksi: true,
      },
    });

    // 2. Ambil pengeluaran pada hari itu
    const expenses = await db.pengeluaranDadakan.findMany({
      where: {
        user_id: user.id,
        tanggal: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate),
        },
      },
      select: { nominal: true },
    });

    // 3. Kalkulasi metrik keuangan
    let omzet = 0;
    let total_hpp = 0;
    const total_transaksi_count = transactions.length;

    for (const trx of transactions) {
      omzet += Number(trx.harga_jual_saat_transaksi) * Number(trx.qty);
      total_hpp += Number(trx.hpp_saat_transaksi) * Number(trx.qty);
    }

    const laba_kotor = omzet - total_hpp;
    const total_pengeluaran = expenses.reduce(
      (sum, e) => sum + Number(e.nominal),
      0
    );
    const laba_bersih = laba_kotor - total_pengeluaran;

    const summary: DailyFinancialSummary = {
      tanggal: selectedDate,
      total_transaksi_count,
      omzet,
      total_hpp,
      laba_kotor,
      total_pengeluaran,
      laba_bersih,
    };

    return { success: true, data: summary };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghitung ringkasan keuangan.";
    return { success: false, error: message };
  }
}

// =============================================================================
// deleteTransactionAction
// =============================================================================

/**
 * Menghapus transaksi milik user.
 * PENEGAKAN OWNERSHIP: deleteMany dengan where: { id, user_id: user.id }
 */
export async function deleteTransactionAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAuth();

    const result = await db.transaksi.deleteMany({
      where: { id, user_id: user.id },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Transaksi tidak ditemukan atau Anda tidak memiliki akses.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    revalidatePath("/riwayat");
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghapus transaksi.";
    return { success: false, error: message };
  }
}

// =============================================================================
// getHourlySales — NEW: Data untuk grafik penjualan per jam
// =============================================================================

/**
 * Menghitung omzet dan jumlah transaksi per jam (0-23) untuk tanggal tertentu.
 * Data digunakan oleh komponen HourlySalesChart di dashboard.
 *
 * Strategi: Fetch transaksi hari itu, group by jam di JavaScript.
 * Ini lebih sederhana & portable daripada raw SQL EXTRACT(HOUR FROM waktu).
 *
 * PENEGAKAN OWNERSHIP: where: { user_id: user.id }
 */
export async function getHourlySalesAction(
  targetTanggal?: string
): Promise<ActionResult<HourlySalesPoint[]>> {
  try {
    const user = await requireAuth();
    const selectedDate = targetTanggal || todayStr();

    const transactions = await db.transaksi.findMany({
      where: {
        user_id: user.id,
        waktu: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate),
        },
      },
      select: {
        waktu: true,
        qty: true,
        harga_jual_saat_transaksi: true,
      },
    });

    // Group by jam (WIB = UTC+7, tapi untuk konsistensi gunakan UTC jam dari waktu)
    const hourlyMap: Record<number, { omzet: number; count: number }> = {};

    for (let h = 0; h < 24; h++) {
      hourlyMap[h] = { omzet: 0, count: 0 };
    }

    for (const trx of transactions) {
      const jam = trx.waktu.getUTCHours();
      hourlyMap[jam].omzet +=
        Number(trx.harga_jual_saat_transaksi) * Number(trx.qty);
      hourlyMap[jam].count += 1;
    }

    const data: HourlySalesPoint[] = Object.entries(hourlyMap).map(
      ([h, val]) => ({
        jam: Number(h),
        omzet: val.omzet,
        count: val.count,
      })
    );

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil data penjualan per jam.";
    return { success: false, error: message };
  }
}

// =============================================================================
// getTopProductsAction — NEW: Ranking produk terlaris
// =============================================================================

/**
 * Mengambil top 5 produk berdasarkan unit terjual (qty).
 * Mendukung filter "hari_ini" dan "minggu_ini".
 *
 * PENEGAKAN OWNERSHIP: where: { user_id: user.id }
 */
export async function getTopProductsAction(
  periode: "hari_ini" | "minggu_ini" = "hari_ini"
): Promise<ActionResult<TopProductEntry[]>> {
  try {
    const user = await requireAuth();

    const now = new Date();
    let startDate: Date;

    if (periode === "minggu_ini") {
      // 7 hari terakhir
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      // Hari ini dari awal hari
      startDate = startOfDay(todayStr());
    }

    const transactions = await db.transaksi.findMany({
      where: {
        user_id: user.id,
        waktu: { gte: startDate, lte: now },
      },
      select: {
        produk_id: true,
        qty: true,
        harga_jual_saat_transaksi: true,
        produk: { select: { nama: true } },
      },
    });

    // Aggregate per produk
    const produkMap: Record<
      string,
      { nama: string; total_qty: number; total_omzet: number }
    > = {};

    for (const trx of transactions) {
      if (!produkMap[trx.produk_id]) {
        produkMap[trx.produk_id] = {
          nama: trx.produk?.nama ?? "Produk dihapus",
          total_qty: 0,
          total_omzet: 0,
        };
      }
      produkMap[trx.produk_id].total_qty += Number(trx.qty);
      produkMap[trx.produk_id].total_omzet +=
        Number(trx.harga_jual_saat_transaksi) * Number(trx.qty);
    }

    // Sort by qty descending, ambil top 5
    const sorted = Object.entries(produkMap)
      .sort(([, a], [, b]) => b.total_qty - a.total_qty)
      .slice(0, 5);

    const data: TopProductEntry[] = sorted.map(([produk_id, val], idx) => ({
      produk_id,
      nama: val.nama,
      total_qty: val.total_qty,
      total_omzet: val.total_omzet,
      rank: idx + 1,
    }));

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil ranking produk.";
    return { success: false, error: message };
  }
}

// =============================================================================
// getHistorySummaryAction — NEW: Ringkasan keuangan per periode
// =============================================================================

/**
 * Menghitung ringkasan keuangan untuk periode tertentu (harian/mingguan/bulanan).
 * Digunakan oleh halaman Riwayat.
 *
 * PENEGAKAN OWNERSHIP: semua query dengan where: { user_id: user.id }
 */
export async function getHistorySummaryAction(
  periode: "harian" | "mingguan" | "bulanan"
): Promise<ActionResult<PeriodeSummary>> {
  try {
    const user = await requireAuth();
    const now = new Date();
    let startDate: Date;

    switch (periode) {
      case "harian":
        startDate = startOfDay(todayStr());
        break;
      case "mingguan":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "bulanan":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const [transactions, expenses] = await Promise.all([
      db.transaksi.findMany({
        where: {
          user_id: user.id,
          waktu: { gte: startDate, lte: now },
        },
        select: { qty: true, harga_jual_saat_transaksi: true, hpp_saat_transaksi: true },
      }),
      db.pengeluaranDadakan.findMany({
        where: {
          user_id: user.id,
          tanggal: { gte: startDate, lte: now },
        },
        select: { nominal: true },
      }),
    ]);

    let omzet = 0;
    let total_hpp = 0;
    for (const trx of transactions) {
      omzet += Number(trx.harga_jual_saat_transaksi) * Number(trx.qty);
      total_hpp += Number(trx.hpp_saat_transaksi) * Number(trx.qty);
    }

    const laba_kotor = omzet - total_hpp;
    const total_pengeluaran = expenses.reduce((s, e) => s + Number(e.nominal), 0);
    const laba_bersih = laba_kotor - total_pengeluaran;

    return {
      success: true,
      data: {
        omzet,
        laba_kotor,
        total_pengeluaran,
        laba_bersih,
        total_transaksi: transactions.length,
        total_pengeluaran_count: expenses.length,
      },
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghitung ringkasan periode.";
    return { success: false, error: message };
  }
}

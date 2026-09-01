"use server";

import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import {
  createTransactionSchema,
  createBatchTransactionSchema,
  filterTransactionSchema,
  type CreateTransactionInput,
  type CreateBatchTransactionInput,
  type FilterTransactionInput,
} from "@/lib/validations/transaction";
import type {
  Transaksi,
  TransaksiWithProduk,
  DailyFinancialSummary,
  HourlySalesPoint,
  TopProductEntry,
  PeriodeSummary,
  EndOfDaySummary,
  RestockStatus,
} from "@/types/database";
import { getLocalDateString } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// =============================================================================
// Helper: Date & Time Utilities
// =============================================================================

/** Awal hari (00:00:00 UTC) untuk format tanggal YYYY-MM-DD */
function startOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

/** Akhir hari (23:59:59.999 UTC) untuk format tanggal YYYY-MM-DD */
function endOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999Z`);
}

/** Tanggal hari ini dalam format YYYY-MM-DD (WIB / Asia-Jakarta) */
function todayStr(): string {
  return getLocalDateString();
}

/** Mengambil string YYYY-MM-DD satu hari sebelum target tanggal */
function getPreviousDateStr(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().split("T")[0];
}

/** Menghitung persentase perubahan antara nilai hari ini vs kemarin */
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  const change = ((current - previous) / Math.abs(previous)) * 100;
  return Math.round(change * 10) / 10; // 1 desimal
}

// =============================================================================
// 1. createTransactionAction (Input Transaksi Tunggal Cepat)
// =============================================================================

/**
 * Mencatat transaksi penjualan harian baru (Single Item).
 *
 * FITUR KRUSIAL:
 * 1. Snapshot harga jual dan HPP saat transaksi terjadi.
 * 2. Penegakan ownership (where: { id: produk_id, user_id: user.id }).
 * 3. Otomatis revalidate cache dashboard, transaksi, dan riwayat.
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

    // 1. Ambil master produk milik user untuk snapshot harga
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

    const waktuTransaksi = waktu ? new Date(waktu) : new Date();

    // 2. Simpan transaksi dengan snapshot harga historis
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
// 2. createBatchTransactionsAction (Input Transaksi Kasir Multi-Item Cepat)
// =============================================================================

/**
 * Mencatat transaksi penjualan multi-item (keranjang belanja) sekaligus secara atomic.
 */
export async function createBatchTransactionsAction(
  input: CreateBatchTransactionInput
): Promise<ActionResult<Transaksi[]>> {
  const parseResult = createBatchTransactionSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi data transaksi keranjang gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { items, waktu } = parseResult.data;

  try {
    const user = await requireAuth();
    const productIds = items.map((i) => i.produk_id);

    // Ambil seluruh master produk terkait milik user
    const products = await db.produk.findMany({
      where: {
        id: { in: productIds },
        user_id: user.id,
      },
      select: { id: true, harga_jual: true, hpp: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validasi apakah seluruh produk valid
    for (const item of items) {
      if (!productMap.has(item.produk_id)) {
        return {
          success: false,
          error: `Salah satu produk tidak ditemukan atau bukan milik Anda.`,
        };
      }
    }

    const waktuTransaksi = waktu ? new Date(waktu) : new Date();

    // Simpan semua item transaksi dalam database transaction
    const createdTransactions = await db.$transaction(
      items.map((item) => {
        const prod = productMap.get(item.produk_id)!;
        return db.transaksi.create({
          data: {
            user_id: user.id,
            produk_id: prod.id,
            qty: item.qty,
            harga_jual_saat_transaksi: prod.harga_jual,
            hpp_saat_transaksi: prod.hpp,
            waktu: waktuTransaksi,
          },
        });
      })
    );

    const data: Transaksi[] = createdTransactions.map((t) => ({
      id: t.id,
      user_id: t.user_id,
      produk_id: t.produk_id,
      qty: t.qty,
      harga_jual_saat_transaksi: Number(t.harga_jual_saat_transaksi),
      hpp_saat_transaksi: Number(t.hpp_saat_transaksi),
      waktu: t.waktu.toISOString(),
      created_at: t.created_at.toISOString(),
    }));

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    revalidatePath("/riwayat");
    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal memproses transaksi keranjang.";
    return { success: false, error: message };
  }
}

// =============================================================================
// 3. getTransactionsAction (Daftar & Filter Transaksi)
// =============================================================================

/**
 * Mengambil daftar riwayat transaksi user dengan opsi filter tanggal dan produk.
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
      user_id: user.id,
    };

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
// 4. getDailyFinancialSummaryAction (Ringkasan Keuangan Harian + vs Kemarin)
// =============================================================================

/**
 * Menghitung ringkasan keuangan harian:
 *   - Omzet = SUM(harga_jual_saat_transaksi * qty)
 *   - Total HPP = SUM(hpp_saat_transaksi * qty)
 *   - Laba Kotor = Omzet - Total HPP
 *   - Total Pengeluaran = SUM(nominal pengeluaran_dadakan)
 *   - Laba Bersih = Laba Kotor - Total Pengeluaran
 *   - Perbandingan vs Hari Sebelumnya (Omzet & Laba Bersih % Change + Trend)
 */
export async function getDailyFinancialSummaryAction(
  targetTanggal?: string
): Promise<ActionResult<DailyFinancialSummary>> {
  try {
    const user = await requireAuth();
    const selectedDate = targetTanggal || todayStr();
    const prevDate = getPreviousDateStr(selectedDate);

    // Ambil data hari ini & hari kemarin secara paralel
    const [todayTrx, todayExpenses, prevTrx, prevExpenses] = await Promise.all([
      db.transaksi.findMany({
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
      }),
      db.pengeluaranDadakan.findMany({
        where: {
          user_id: user.id,
          tanggal: {
            gte: startOfDay(selectedDate),
            lte: endOfDay(selectedDate),
          },
        },
        select: { nominal: true },
      }),
      db.transaksi.findMany({
        where: {
          user_id: user.id,
          waktu: {
            gte: startOfDay(prevDate),
            lte: endOfDay(prevDate),
          },
        },
        select: {
          qty: true,
          harga_jual_saat_transaksi: true,
          hpp_saat_transaksi: true,
        },
      }),
      db.pengeluaranDadakan.findMany({
        where: {
          user_id: user.id,
          tanggal: {
            gte: startOfDay(prevDate),
            lte: endOfDay(prevDate),
          },
        },
        select: { nominal: true },
      }),
    ]);

    // Kalkulasi Hari Ini
    let omzet = 0;
    let total_hpp = 0;
    let total_qty_count = 0;
    for (const t of todayTrx) {
      const q = Number(t.qty);
      omzet += Number(t.harga_jual_saat_transaksi) * q;
      total_hpp += Number(t.hpp_saat_transaksi) * q;
      total_qty_count += q;
    }
    const laba_kotor = omzet - total_hpp;
    const total_pengeluaran = todayExpenses.reduce(
      (sum, e) => sum + Number(e.nominal),
      0
    );
    const laba_bersih = laba_kotor - total_pengeluaran;

    // Kalkulasi Hari Kemarin
    let prev_omzet = 0;
    let prev_hpp = 0;
    for (const t of prevTrx) {
      const q = Number(t.qty);
      prev_omzet += Number(t.harga_jual_saat_transaksi) * q;
      prev_hpp += Number(t.hpp_saat_transaksi) * q;
    }
    const prev_laba_kotor = prev_omzet - prev_hpp;
    const prev_pengeluaran = prevExpenses.reduce(
      (sum, e) => sum + Number(e.nominal),
      0
    );
    const prev_laba_bersih = prev_laba_kotor - prev_pengeluaran;

    // Perhitungan % Perubahan
    const omzet_change = calculatePercentageChange(omzet, prev_omzet);
    const laba_change = calculatePercentageChange(laba_bersih, prev_laba_bersih);

    const summary: DailyFinancialSummary = {
      tanggal: selectedDate,
      total_transaksi_count: todayTrx.length,
      total_qty_count,
      omzet,
      total_hpp,
      laba_kotor,
      total_pengeluaran,
      laba_bersih,
      perbandingan_kemarin: {
        omzet_kemarin: prev_omzet,
        laba_bersih_kemarin: prev_laba_bersih,
        omzet_change_percent: omzet_change,
        laba_change_percent: laba_change,
        omzet_trend:
          omzet_change > 0 ? "up" : omzet_change < 0 ? "down" : "flat",
        laba_trend:
          laba_change > 0 ? "up" : laba_change < 0 ? "down" : "flat",
      },
    };

    return { success: true, data: summary };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghitung ringkasan keuangan.";
    return { success: false, error: message };
  }
}

// =============================================================================
// 5. getHourlySalesAction (Grafik Pola Keramaian Penjualan per Jam)
// =============================================================================

/**
 * Menghitung omzet, jumlah transaksi, dan unit terjual per jam (0-23)
 * untuk grafik pola keramaian harian.
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

    const hourlyMap: Record<number, { omzet: number; count: number; qty: number }> = {};
    for (let h = 0; h < 24; h++) {
      hourlyMap[h] = { omzet: 0, count: 0, qty: 0 };
    }

    for (const trx of transactions) {
      const jam = trx.waktu.getUTCHours();
      const q = Number(trx.qty);
      hourlyMap[jam].omzet += Number(trx.harga_jual_saat_transaksi) * q;
      hourlyMap[jam].count += 1;
      hourlyMap[jam].qty += q;
    }

    const data: HourlySalesPoint[] = Object.entries(hourlyMap).map(
      ([h, val]) => {
        const jamNum = Number(h);
        const label = `${jamNum.toString().padStart(2, "0")}:00`;
        return {
          jam: jamNum,
          label,
          omzet: val.omzet,
          count: val.count,
          qty: val.qty,
        };
      }
    );

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil data penjualan per jam.";
    return { success: false, error: message };
  }
}

// =============================================================================
// 6. getTopProductsAction (Ranking Produk Terlaris + Rekomendasi Restock Cerdas)
// =============================================================================

/**
 * Mengambil ranking produk terlaris dengan rekomendasi kuantitas restock.
 * Mendukung periode: "hari_ini" | "minggu_ini".
 */
export async function getTopProductsAction(
  periode: "hari_ini" | "minggu_ini" = "hari_ini"
): Promise<ActionResult<TopProductEntry[]>> {
  try {
    const user = await requireAuth();

    const now = new Date();
    let startDate: Date;
    const dividerDays = periode === "minggu_ini" ? 7 : 1;

    if (periode === "minggu_ini") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
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

    let totalAllOmzet = 0;
    const produkMap: Record<
      string,
      { nama: string; total_qty: number; total_omzet: number }
    > = {};

    for (const trx of transactions) {
      const q = Number(trx.qty);
      const omzet = Number(trx.harga_jual_saat_transaksi) * q;
      totalAllOmzet += omzet;

      if (!produkMap[trx.produk_id]) {
        produkMap[trx.produk_id] = {
          nama: trx.produk?.nama ?? "Produk (Dihapus)",
          total_qty: 0,
          total_omzet: 0,
        };
      }
      produkMap[trx.produk_id].total_qty += q;
      produkMap[trx.produk_id].total_omzet += omzet;
    }

    const sorted = Object.entries(produkMap)
      .sort(([, a], [, b]) => b.total_qty - a.total_qty)
      .slice(0, 10);

    const data: TopProductEntry[] = sorted.map(([produk_id, val], idx) => {
      const rank = idx + 1;
      const dailyVelocity = Math.ceil(val.total_qty / dividerDays);
      const kontribusiPercent =
        totalAllOmzet > 0
          ? Math.round((val.total_omzet / totalAllOmzet) * 1000) / 10
          : 0;

      let status_restock: RestockStatus = "aman";
      let rekomendasi_restock = "";
      let saran_restock_qty = 0;

      if (rank === 1) {
        status_restock = "prioritas_tinggi";
        saran_restock_qty = Math.max(dailyVelocity * 2, 10);
        rekomendasi_restock = `Produk terlaris #1! Prioritas restock tinggi. Siapkan minimal ${saran_restock_qty} unit untuk antisipasi lonjakan pembeli.`;
      } else if (rank <= 3) {
        status_restock = "prioritas_tinggi";
        saran_restock_qty = Math.max(Math.ceil(dailyVelocity * 1.5), 5);
        rekomendasi_restock = `Permintaan tinggi (Top 3). Disarankan menyiapkan stok minimal ${saran_restock_qty} unit.`;
      } else if (val.total_qty >= 5) {
        status_restock = "sedang";
        saran_restock_qty = Math.max(dailyVelocity, 3);
        rekomendasi_restock = `Penjualan stabil. Jaga ketersediaan stok minimal ${saran_restock_qty} unit.`;
      } else {
        status_restock = "aman";
        saran_restock_qty = Math.max(dailyVelocity, 2);
        rekomendasi_restock = `Stok terpantau aman. Restock standar ${saran_restock_qty} unit.`;
      }

      return {
        produk_id,
        nama: val.nama,
        total_qty: val.total_qty,
        total_omzet: val.total_omzet,
        rank,
        kontribusi_omzet_percent: kontribusiPercent,
        status_restock,
        rekomendasi_restock,
        saran_restock_qty,
      };
    });

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil ranking produk.";
    return { success: false, error: message };
  }
}

// =============================================================================
// 7. getHistorySummaryAction (Ringkasan Riwayat Laporan Harian/Mingguan/Bulanan)
// =============================================================================

/**
 * Menghitung ringkasan keuangan untuk kebutuhan laporan berkala (harian / mingguan / bulanan).
 */
export async function getHistorySummaryAction(
  periode: "harian" | "mingguan" | "bulanan"
): Promise<ActionResult<PeriodeSummary>> {
  try {
    const user = await requireAuth();
    const now = new Date();
    let startDate: Date;
    let daysCount = 1;

    switch (periode) {
      case "harian":
        startDate = startOfDay(todayStr());
        daysCount = 1;
        break;
      case "mingguan":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        daysCount = 7;
        break;
      case "bulanan":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const dayOfMonth = now.getDate();
        daysCount = Math.max(dayOfMonth, 1);
        break;
    }

    const [transactions, expenses] = await Promise.all([
      db.transaksi.findMany({
        where: {
          user_id: user.id,
          waktu: { gte: startDate, lte: now },
        },
        select: {
          qty: true,
          harga_jual_saat_transaksi: true,
          hpp_saat_transaksi: true,
        },
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
    let total_qty = 0;

    for (const trx of transactions) {
      const q = Number(trx.qty);
      omzet += Number(trx.harga_jual_saat_transaksi) * q;
      total_hpp += Number(trx.hpp_saat_transaksi) * q;
      total_qty += q;
    }

    const laba_kotor = omzet - total_hpp;
    const total_pengeluaran = expenses.reduce(
      (s, e) => s + Number(e.nominal),
      0
    );
    const laba_bersih = laba_kotor - total_pengeluaran;
    const rata_rata_omzet_per_hari = Math.round(omzet / daysCount);

    return {
      success: true,
      data: {
        periode,
        tanggal_mulai: startDate.toISOString().split("T")[0],
        tanggal_akhir: now.toISOString().split("T")[0],
        omzet,
        total_hpp,
        laba_kotor,
        total_pengeluaran,
        laba_bersih,
        total_transaksi: transactions.length,
        total_qty,
        total_pengeluaran_count: expenses.length,
        rata_rata_omzet_per_hari,
      },
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghitung ringkasan periode.";
    return { success: false, error: message };
  }
}

// =============================================================================
// 8. getEndOfDaySummaryAction (Ringkasan Akhir Hari Otomatis Tanpa Tutup Buku)
// =============================================================================

/**
 * Menyajikan ringkasan performa harian lengkap otomatis di akhir hari:
 * - Omzet, Laba Kotor, Pengeluaran, Laba Bersih, Margin %
 * - Jam Paling Ramai & Paling Sepi
 * - Produk Terlaris Hari Ini
 * - Komparasi vs Hari Sebelumnya
 */
export async function getEndOfDaySummaryAction(
  targetTanggal?: string
): Promise<ActionResult<EndOfDaySummary>> {
  try {
    const user = await requireAuth();
    const selectedDate = targetTanggal || todayStr();
    const prevDate = getPreviousDateStr(selectedDate);

    const [
      profile,
      todayTrx,
      todayExpenses,
      prevTrx,
      prevExpenses,
      topProductsRes,
    ] = await Promise.all([
      db.profile.findUnique({ where: { id: user.id } }),
      db.transaksi.findMany({
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
          hpp_saat_transaksi: true,
        },
      }),
      db.pengeluaranDadakan.findMany({
        where: {
          user_id: user.id,
          tanggal: {
            gte: startOfDay(selectedDate),
            lte: endOfDay(selectedDate),
          },
        },
        select: { kategori: true, nominal: true },
      }),
      db.transaksi.findMany({
        where: {
          user_id: user.id,
          waktu: {
            gte: startOfDay(prevDate),
            lte: endOfDay(prevDate),
          },
        },
        select: {
          qty: true,
          harga_jual_saat_transaksi: true,
          hpp_saat_transaksi: true,
        },
      }),
      db.pengeluaranDadakan.findMany({
        where: {
          user_id: user.id,
          tanggal: {
            gte: startOfDay(prevDate),
            lte: endOfDay(prevDate),
          },
        },
        select: { nominal: true },
      }),
      getTopProductsAction("hari_ini"),
    ]);

    // Kalkulasi Hari Ini
    let omzet = 0;
    let total_hpp = 0;
    let total_item_terjual = 0;
    const hourlyDistribution: Record<number, { omzet: number; count: number }> = {};

    for (let h = 0; h < 24; h++) {
      hourlyDistribution[h] = { omzet: 0, count: 0 };
    }

    for (const trx of todayTrx) {
      const q = Number(trx.qty);
      const trxOmzet = Number(trx.harga_jual_saat_transaksi) * q;
      omzet += trxOmzet;
      total_hpp += Number(trx.hpp_saat_transaksi) * q;
      total_item_terjual += q;

      const jam = trx.waktu.getUTCHours();
      hourlyDistribution[jam].omzet += trxOmzet;
      hourlyDistribution[jam].count += 1;
    }

    const laba_kotor = omzet - total_hpp;
    const total_pengeluaran = todayExpenses.reduce(
      (sum, e) => sum + Number(e.nominal),
      0
    );
    const laba_bersih = laba_kotor - total_pengeluaran;
    const total_transaksi = todayTrx.length;
    const rata_rata_transaksi =
      total_transaksi > 0 ? Math.round(omzet / total_transaksi) : 0;
    const margin_laba_bersih_percent =
      omzet > 0 ? Math.round((laba_bersih / omzet) * 1000) / 10 : 0;

    // Hitung Jam Teramai & Jam Tersepi (hanya dari jam operasional yang ada transaksi)
    const activeHours = Object.entries(hourlyDistribution)
      .map(([h, val]) => ({
        jam: Number(h),
        label: `${h.padStart(2, "0")}:00`,
        omzet: val.omzet,
        count: val.count,
      }))
      .filter((h) => h.count > 0);

    let jam_teramai = null;
    let jam_tersepi = null;

    if (activeHours.length > 0) {
      const sortedByOmzet = [...activeHours].sort((a, b) => b.omzet - a.omzet);
      jam_teramai = sortedByOmzet[0];
      jam_tersepi = sortedByOmzet[sortedByOmzet.length - 1];
    }

    // Kategori Pengeluaran Terbesar
    const expenseCatMap: Record<string, { nominal: number; count: number }> = {};
    for (const exp of todayExpenses) {
      if (!expenseCatMap[exp.kategori]) {
        expenseCatMap[exp.kategori] = { nominal: 0, count: 0 };
      }
      expenseCatMap[exp.kategori].nominal += Number(exp.nominal);
      expenseCatMap[exp.kategori].count += 1;
    }

    const sortedExpCats = Object.entries(expenseCatMap).sort(
      ([, a], [, b]) => b.nominal - a.nominal
    );

    const kategori_pengeluaran_terbesar =
      sortedExpCats.length > 0
        ? {
            kategori: sortedExpCats[0][0],
            total_nominal: sortedExpCats[0][1].nominal,
            persentase:
              total_pengeluaran > 0
                ? Math.round(
                    (sortedExpCats[0][1].nominal / total_pengeluaran) * 1000
                  ) / 10
                : 0,
            count: sortedExpCats[0][1].count,
          }
        : null;

    // Kalkulasi Hari Kemarin & Narasi
    let prev_omzet = 0;
    let prev_hpp = 0;
    for (const t of prevTrx) {
      const q = Number(t.qty);
      prev_omzet += Number(t.harga_jual_saat_transaksi) * q;
      prev_hpp += Number(t.hpp_saat_transaksi) * q;
    }
    const prev_laba_bersih =
      prev_omzet -
      prev_hpp -
      prevExpenses.reduce((sum, e) => sum + Number(e.nominal), 0);

    const omzet_change = calculatePercentageChange(omzet, prev_omzet);
    const laba_change = calculatePercentageChange(laba_bersih, prev_laba_bersih);

    let status_narasi = "Aktivitas usaha berjalan dengan stabil.";
    if (omzet_change > 0 && laba_change > 0) {
      status_narasi = `Luar biasa! Omzet meningkat +${omzet_change}% dan Laba Bersih naik +${laba_change}% dibanding hari kemarin.`;
    } else if (omzet_change < 0) {
      status_narasi = `Omzet mengalami penurunan ${omzet_change}% dibanding kemarin. Pantau jam sepi untuk promosi esok hari.`;
    }

    const topProduct =
      topProductsRes.success && topProductsRes.data && topProductsRes.data.length > 0
        ? topProductsRes.data[0]
        : null;

    const data: EndOfDaySummary = {
      tanggal: selectedDate,
      nama_usaha: profile?.nama_usaha || "Usaha Saya",
      jenis_usaha: profile?.jenis_usaha || "UMKM",
      omzet,
      total_hpp,
      laba_kotor,
      total_pengeluaran,
      laba_bersih,
      margin_laba_bersih_percent,
      total_transaksi,
      total_item_terjual,
      rata_rata_transaksi,
      jam_teramai,
      jam_tersepi,
      produk_terlaris: topProduct,
      kategori_pengeluaran_terbesar,
      perbandingan_kemarin: {
        omzet_change_percent: omzet_change,
        laba_change_percent: laba_change,
        status_narasi,
      },
    };

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menyusun ringkasan akhir hari.";
    return { success: false, error: message };
  }
}

// =============================================================================
// 9. deleteTransactionAction (Hapus / Batal Transaksi)
// =============================================================================

/**
 * Menghapus transaksi milik user dengan verifikasi ownership.
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


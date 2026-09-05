"use server";

import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import {
  createBatchTransactionSchema,
  filterTransactionSchema,
  type CreateBatchTransactionInput,
  type FilterTransactionInput,
} from "@/lib/validations/transaction";
import type {
  Transaksi,
  TransaksiWithProduk,
  PeriodeSummary,
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
// Helper: Date & Time Utilities (WIB / Asia-Jakarta = UTC+7)
// =============================================================================

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Awal hari (00:00:00 WIB) untuk format tanggal YYYY-MM-DD */
function startOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00+07:00`);
}

/** Akhir hari (23:59:59.999 WIB) untuk format tanggal YYYY-MM-DD */
function endOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999+07:00`);
}

/** Tanggal hari ini dalam format YYYY-MM-DD (WIB / Asia-Jakarta) */
function todayStr(): string {
  return getLocalDateString();
}

// =============================================================================
// 1. createBatchTransactionsAction (Input Transaksi Kasir Multi-Item Cepat)
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
    console.error("[createBatchTransactionsAction Error]", err);
    return { success: false, error: "Gagal memproses transaksi keranjang." };
  }
}

// =============================================================================
// 2. getTransactionsAction (Daftar & Filter Transaksi)
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
    console.error("[getTransactionsAction Error]", err);
    return { success: false, error: "Gagal mengambil daftar transaksi." };
  }
}

// =============================================================================
// 3. getHistorySummaryAction (Ringkasan Riwayat Laporan Harian/Mingguan/Bulanan)
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
      case "bulanan": {
        const nowWib = new Date(Date.now() + WIB_OFFSET_MS);
        startDate = new Date(Date.UTC(nowWib.getUTCFullYear(), nowWib.getUTCMonth(), 1) - WIB_OFFSET_MS);
        const dayOfMonth = nowWib.getUTCDate();
        daysCount = Math.max(dayOfMonth, 1);
        break;
      }
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
        tanggal_mulai: getLocalDateString(startDate),
        tanggal_akhir: getLocalDateString(now),
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
    console.error("[getHistorySummaryAction Error]", err);
    return { success: false, error: "Gagal menghitung ringkasan periode." };
  }
}

// =============================================================================
// 4. deleteTransactionAction (Hapus / Batal Transaksi)
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
    console.error("[deleteTransactionAction Error]", err);
    return { success: false, error: "Gagal menghapus transaksi." };
  }
}

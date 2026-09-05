"use server";

import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import {
  createExpenseSchema,
  filterExpenseSchema,
  type CreateExpenseInput,
  type FilterExpenseInput,
} from "@/lib/validations/expense";
import type { PengeluaranDadakan } from "@/types/database";
import { getLocalDateString } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/** Format Date ke string YYYY-MM-DD (UTC date) */
function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * 1. Mencatat pengeluaran dadakan / operasional baru.
 */
export async function createExpenseAction(
  input: CreateExpenseInput
): Promise<ActionResult<PengeluaranDadakan>> {
  const parseResult = createExpenseSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi pengeluaran gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { kategori, nominal, tanggal } = parseResult.data;

  try {
    const user = await requireAuth();

    const targetDate = tanggal
      ? new Date(`${tanggal}T00:00:00+07:00`)
      : new Date(`${getLocalDateString()}T00:00:00+07:00`);

    const expense = await db.pengeluaranDadakan.create({
      data: {
        user_id: user.id,
        kategori,
        nominal,
        tanggal: targetDate,
      },
    });

    const data: PengeluaranDadakan = {
      id: expense.id,
      user_id: expense.user_id,
      kategori: expense.kategori,
      nominal: Number(expense.nominal),
      tanggal: toDateStr(expense.tanggal),
      created_at: expense.created_at.toISOString(),
    };

    revalidatePath("/dashboard");
    revalidatePath("/pengeluaran");
    revalidatePath("/riwayat");
    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mencatat pengeluaran.";
    return { success: false, error: message };
  }
}

/**
 * 2. Mengambil daftar pengeluaran milik user (bisa string tanggal atau FilterExpenseInput).
 */
export async function getExpensesAction(
  filterOrTanggal?: string | FilterExpenseInput
): Promise<ActionResult<PengeluaranDadakan[]>> {
  try {
    const user = await requireAuth();

    const whereConditions: Record<string, unknown> = {
      user_id: user.id,
    };

    if (typeof filterOrTanggal === "string") {
      const targetDate = new Date(`${filterOrTanggal}T00:00:00+07:00`);
      const endDate = new Date(`${filterOrTanggal}T23:59:59.999+07:00`);
      whereConditions.tanggal = { gte: targetDate, lte: endDate };
    } else if (typeof filterOrTanggal === "object" && filterOrTanggal !== null) {
      const parseResult = filterExpenseSchema.safeParse(filterOrTanggal);
      if (parseResult.success) {
        const { tanggalMulai, tanggalAkhir, kategori } = parseResult.data;
        if (tanggalMulai || tanggalAkhir) {
          whereConditions.tanggal = {
            ...(tanggalMulai && { gte: new Date(`${tanggalMulai}T00:00:00+07:00`) }),
            ...(tanggalAkhir && { lte: new Date(`${tanggalAkhir}T23:59:59.999+07:00`) }),
          };
        }
        if (kategori) {
          whereConditions.kategori = kategori;
        }
      }
    }

    const expenses = await db.pengeluaranDadakan.findMany({
      where: whereConditions,
      orderBy: [{ tanggal: "desc" }, { created_at: "desc" }],
    });

    const data: PengeluaranDadakan[] = expenses.map((e) => ({
      id: e.id,
      user_id: e.user_id,
      kategori: e.kategori,
      nominal: Number(e.nominal),
      tanggal: toDateStr(e.tanggal),
      created_at: e.created_at.toISOString(),
    }));

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil daftar pengeluaran.";
    return { success: false, error: message };
  }
}


/**
 * 5. Menghapus pengeluaran milik user.
 */
export async function deleteExpenseAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAuth();

    const result = await db.pengeluaranDadakan.deleteMany({
      where: { id, user_id: user.id },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Pengeluaran tidak ditemukan atau Anda tidak memiliki akses.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/pengeluaran");
    revalidatePath("/riwayat");
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghapus pengeluaran.";
    return { success: false, error: message };
  }
}


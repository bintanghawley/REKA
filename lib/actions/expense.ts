"use server";

import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import {
  createExpenseSchema,
  updateExpenseSchema,
  type CreateExpenseInput,
  type UpdateExpenseInput,
} from "@/lib/validations/expense";
import type { PengeluaranDadakan } from "@/types/database";
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
 * Mencatat pengeluaran dadakan baru.
 *
 * tanggal disimpan sebagai DATE native di PostgreSQL (via Prisma DateTime @db.Date).
 * Input dari client: YYYY-MM-DD string → dikonversi ke Date object.
 *
 * PENEGAKAN OWNERSHIP: user_id dari session.user.id.
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

    // Konversi string YYYY-MM-DD ke Date object untuk Prisma @db.Date
    const targetDate = tanggal
      ? new Date(`${tanggal}T00:00:00.000Z`)
      : new Date(new Date().toISOString().split("T")[0] + "T00:00:00.000Z");

    const expense = await db.pengeluaranDadakan.create({
      data: {
        user_id: user.id, // PENEGAKAN OWNERSHIP
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
    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mencatat pengeluaran.";
    return { success: false, error: message };
  }
}

/**
 * Mengambil daftar pengeluaran milik user.
 *
 * Filter tanggal: Date range (gte/lte) pada kolom `tanggal` DATE.
 * PENEGAKAN OWNERSHIP: where: { user_id: user.id }
 */
export async function getExpensesAction(
  tanggal?: string
): Promise<ActionResult<PengeluaranDadakan[]>> {
  try {
    const user = await requireAuth();

    const whereConditions: Record<string, unknown> = {
      user_id: user.id, // PENEGAKAN OWNERSHIP
    };

    if (tanggal) {
      const targetDate = new Date(`${tanggal}T00:00:00.000Z`);
      const endDate = new Date(`${tanggal}T23:59:59.999Z`);
      whereConditions.tanggal = { gte: targetDate, lte: endDate };
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
 * Memperbarui pengeluaran milik user.
 * PENEGAKAN OWNERSHIP: findFirst dengan where: { id, user_id: user.id } sebelum update.
 */
export async function updateExpenseAction(
  input: UpdateExpenseInput
): Promise<ActionResult<PengeluaranDadakan>> {
  const parseResult = updateExpenseSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi pembaruan pengeluaran gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { id, tanggal, ...otherFields } = parseResult.data;

  try {
    const user = await requireAuth();

    // Cek ownership
    const existing = await db.pengeluaranDadakan.findFirst({
      where: { id, user_id: user.id }, // PENEGAKAN OWNERSHIP
      select: { id: true },
    });

    if (!existing) {
      return {
        success: false,
        error: "Pengeluaran tidak ditemukan atau Anda tidak memiliki akses.",
      };
    }

    const updateData: Record<string, unknown> = { ...otherFields };
    if (tanggal) {
      updateData.tanggal = new Date(`${tanggal}T00:00:00.000Z`);
    }

    const expense = await db.pengeluaranDadakan.update({
      where: { id },
      data: updateData,
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
    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal memperbarui pengeluaran.";
    return { success: false, error: message };
  }
}

/**
 * Menghapus pengeluaran milik user.
 * PENEGAKAN OWNERSHIP: deleteMany dengan where: { id, user_id: user.id }
 */
export async function deleteExpenseAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAuth();

    const result = await db.pengeluaranDadakan.deleteMany({
      where: { id, user_id: user.id }, // PENEGAKAN OWNERSHIP
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Pengeluaran tidak ditemukan atau Anda tidak memiliki akses.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/pengeluaran");
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghapus pengeluaran.";
    return { success: false, error: message };
  }
}

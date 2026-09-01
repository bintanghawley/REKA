"use server";

import { createClient } from "@/lib/supabase/server";
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

/**
 * Mencatat pengeluaran dadakan / operasional baru.
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
    const supabase = createClient();

    const targetDate = tanggal || new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("pengeluaran_dadakan")
      .insert({
        user_id: user.id,
        kategori,
        nominal,
        tanggal: targetDate,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/pengeluaran");
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mencatat pengeluaran.";
    return { success: false, error: message };
  }
}

/**
 * Mengambil daftar pengeluaran milik user.
 */
export async function getExpensesAction(
  tanggal?: string
): Promise<ActionResult<PengeluaranDadakan[]>> {
  try {
    const user = await requireAuth();
    const supabase = createClient();

    let query = supabase
      .from("pengeluaran_dadakan")
      .select("*")
      .eq("user_id", user.id)
      .order("tanggal", { ascending: false })
      .order("created_at", { ascending: false });

    if (tanggal) {
      query = query.eq("tanggal", tanggal);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengambil daftar pengeluaran.";
    return { success: false, error: message };
  }
}

/**
 * Memperbarui pengeluaran dadakan milik user.
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

  const { id, ...updateFields } = parseResult.data;

  try {
    const user = await requireAuth();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("pengeluaran_dadakan")
      .update(updateFields)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/pengeluaran");
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui pengeluaran.";
    return { success: false, error: message };
  }
}

/**
 * Menghapus data pengeluaran milik user.
 */
export async function deleteExpenseAction(id: string): Promise<ActionResult<void>> {
  try {
    const user = await requireAuth();
    const supabase = createClient();

    const { error } = await supabase
      .from("pengeluaran_dadakan")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/pengeluaran");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus pengeluaran.";
    return { success: false, error: message };
  }
}

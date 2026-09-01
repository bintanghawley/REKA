"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/session";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/lib/validations/product";
import type { Produk } from "@/types/database";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Mengambil seluruh daftar produk milik user yang sedang terautentikasi.
 */
export async function getProductsAction(): Promise<ActionResult<Produk[]>> {
  try {
    const user = await requireAuth();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("user_id", user.id)
      .order("nama", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengambil daftar produk.";
    return { success: false, error: message };
  }
}

/**
 * Menambahkan produk baru. `user_id` diisi secara otomatis dari authenticated session.
 */
export async function createProductAction(
  input: CreateProductInput
): Promise<ActionResult<Produk>> {
  const parseResult = createProductSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi data produk gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuth();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("produk")
      .insert({
        user_id: user.id,
        nama: parseResult.data.nama,
        harga_jual: parseResult.data.harga_jual,
        hpp: parseResult.data.hpp,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal membuat produk.";
    return { success: false, error: message };
  }
}

/**
 * Memperbarui data produk. Hanya dapat mengubah produk milik user yang sedang login.
 */
export async function updateProductAction(
  input: UpdateProductInput
): Promise<ActionResult<Produk>> {
  const parseResult = updateProductSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi pembaruan produk gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { id, ...updateFields } = parseResult.data;

  try {
    const user = await requireAuth();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("produk")
      .update(updateFields)
      .eq("id", id)
      .eq("user_id", user.id) // Penegakan ownership di data layer selain RLS
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui produk.";
    return { success: false, error: message };
  }
}

/**
 * Menghapus produk milik user.
 */
export async function deleteProductAction(id: string): Promise<ActionResult<void>> {
  try {
    const user = await requireAuth();
    const supabase = createClient();

    const { error } = await supabase
      .from("produk")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus produk.";
    return { success: false, error: message };
  }
}

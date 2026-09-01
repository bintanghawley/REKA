"use server";

import { db } from "@/lib/prisma";
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
 *
 * PENEGAKAN OWNERSHIP (pengganti RLS):
 * Klausa where: { user_id: user.id } memastikan hanya produk milik
 * user yang sedang login yang dikembalikan.
 */
export async function getProductsAction(): Promise<ActionResult<Produk[]>> {
  try {
    const user = await requireAuth();

    const products = await db.produk.findMany({
      where: { user_id: user.id },
      orderBy: { nama: "asc" },
    });

    const data: Produk[] = products.map((p) => ({
      id: p.id,
      user_id: p.user_id,
      nama: p.nama,
      harga_jual: Number(p.harga_jual),
      hpp: Number(p.hpp),
      created_at: p.created_at.toISOString(),
      updated_at: p.updated_at.toISOString(),
    }));

    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengambil daftar produk.";
    return { success: false, error: message };
  }
}

/**
 * Menambahkan produk baru. `user_id` diisi secara otomatis dari authenticated session.
 *
 * PENEGAKAN OWNERSHIP (pengganti RLS):
 * user_id di-set dari session.user.id — tidak bisa dimanipulasi dari client.
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

    const product = await db.produk.create({
      data: {
        user_id: user.id,
        nama: parseResult.data.nama,
        harga_jual: parseResult.data.harga_jual,
        hpp: parseResult.data.hpp,
      },
    });

    const data: Produk = {
      id: product.id,
      user_id: product.user_id,
      nama: product.nama,
      harga_jual: Number(product.harga_jual),
      hpp: Number(product.hpp),
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at.toISOString(),
    };

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal membuat produk.";
    return { success: false, error: message };
  }
}

/**
 * Memperbarui data produk. Hanya dapat mengubah produk milik user yang sedang login.
 *
 * PENEGAKAN OWNERSHIP (pengganti RLS):
 * updateMany dengan where: { id, user_id: user.id } — jika count === 0,
 * berarti record tidak ada atau bukan milik user ini → return FORBIDDEN.
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

    // Cek ownership dulu sebelum update
    const existing = await db.produk.findFirst({
      where: { id, user_id: user.id },
      select: { id: true },
    });

    if (!existing) {
      return {
        success: false,
        error: "Produk tidak ditemukan atau Anda tidak memiliki akses.",
      };
    }

    const product = await db.produk.update({
      where: { id },
      data: updateFields,
    });

    const data: Produk = {
      id: product.id,
      user_id: product.user_id,
      nama: product.nama,
      harga_jual: Number(product.harga_jual),
      hpp: Number(product.hpp),
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at.toISOString(),
    };

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal memperbarui produk.";
    return { success: false, error: message };
  }
}

/**
 * Menghapus produk milik user.
 *
 * PENEGAKAN OWNERSHIP (pengganti RLS):
 * deleteMany dengan where: { id, user_id: user.id } — jika count === 0,
 * reject dengan pesan FORBIDDEN.
 */
export async function deleteProductAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    const user = await requireAuth();

    const result = await db.produk.deleteMany({
      where: { id, user_id: user.id },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Produk tidak ditemukan atau Anda tidak memiliki akses.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghapus produk.";
    return { success: false, error: message };
  }
}

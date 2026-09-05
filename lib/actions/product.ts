"use server";

import { db } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import {
  createProductSchema,
  bulkCreateProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type BulkCreateProductInput,
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
 * 1. Mengambil seluruh daftar produk milik user yang sedang terautentikasi.
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
      kategori: p.kategori || "",
      status: p.status ?? "Tersedia",
      foto: p.foto ?? null,
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
 * 2. Menambahkan satu produk baru.
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
        kategori: parseResult.data.kategori || "",
        status: parseResult.data.status || "Tersedia",
        foto: parseResult.data.foto || null,
      },
    });

    const data: Produk = {
      id: product.id,
      user_id: product.user_id,
      nama: product.nama,
      harga_jual: Number(product.harga_jual),
      hpp: Number(product.hpp),
      kategori: product.kategori || "",
      status: product.status ?? "Tersedia",
      foto: product.foto ?? null,
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at.toISOString(),
    };

    revalidatePath("/produk");
    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    revalidatePath("/profil");
    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal membuat produk.";
    return { success: false, error: message };
  }
}

/**
 * 3. Menambahkan banyak produk sekaligus (Batch / Onboarding Setup).
 */
export async function bulkCreateProductsAction(
  input: BulkCreateProductInput
): Promise<ActionResult<Produk[]>> {
  const parseResult = bulkCreateProductSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validasi daftar produk gagal.",
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await requireAuth();

    const created = await db.$transaction(
      parseResult.data.products.map((p) =>
        db.produk.create({
          data: {
            user_id: user.id,
            nama: p.nama,
            harga_jual: p.harga_jual,
            hpp: p.hpp,
            kategori: p.kategori || "",
            status: p.status || "Tersedia",
            foto: p.foto || null,
          },
        })
      )
    );

    const data: Produk[] = created.map((product) => ({
      id: product.id,
      user_id: product.user_id,
      nama: product.nama,
      harga_jual: Number(product.harga_jual),
      hpp: Number(product.hpp),
      kategori: product.kategori || "",
      status: product.status ?? "Tersedia",
      foto: product.foto ?? null,
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at.toISOString(),
    }));

    revalidatePath("/produk");
    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    revalidatePath("/profil");
    return { success: true, data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menyimpan daftar produk.";
    return { success: false, error: message };
  }
}

/**
 * 4. Memperbarui data produk milik user.
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
      kategori: product.kategori || "",
      status: product.status ?? "Tersedia",
      foto: product.foto ?? null,
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at.toISOString(),
    };

    revalidatePath("/produk");
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
 * 5. Menghapus produk milik user.
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

    revalidatePath("/produk");
    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghapus produk.";
    return { success: false, error: message };
  }
}

/**
 * 6. Mengubah nama kategori produk pada database.
 */
export async function renameCategoryAction(
  oldName: string,
  newName: string
): Promise<ActionResult<{ updatedCount: number }>> {
  const trimmedOld = oldName.trim();
  const trimmedNew = newName.trim();
  if (!trimmedOld || !trimmedNew) {
    return { success: false, error: "Nama kategori tidak boleh kosong." };
  }

  try {
    const user = await requireAuth();

    const res = await db.produk.updateMany({
      where: {
        user_id: user.id,
        kategori: trimmedOld,
      },
      data: {
        kategori: trimmedNew,
      },
    });

    revalidatePath("/produk");
    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    return { success: true, data: { updatedCount: res.count } };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengubah nama kategori.";
    return { success: false, error: message };
  }
}

/**
 * 7. Menghapus kategori produk pada database (mengalihkan produk ke kategori 'Lainnya').
 */
export async function deleteCategoryAction(
  categoryName: string
): Promise<ActionResult<{ updatedCount: number }>> {
  const trimmed = categoryName.trim();
  if (!trimmed) {
    return { success: false, error: "Nama kategori tidak boleh kosong." };
  }

  try {
    const user = await requireAuth();

    const res = await db.produk.updateMany({
      where: {
        user_id: user.id,
        kategori: trimmed,
      },
      data: {
        kategori: "",
      },
    });

    revalidatePath("/produk");
    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    return { success: true, data: { updatedCount: res.count } };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghapus kategori.";
    return { success: false, error: message };
  }
}


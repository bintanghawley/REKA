"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/session";
import {
  createTransactionSchema,
  filterTransactionSchema,
  type CreateTransactionInput,
  type FilterTransactionInput,
} from "@/lib/validations/transaction";
import type { Transaksi, TransaksiWithProduk, DailyFinancialSummary } from "@/types/database";
import { revalidatePath } from "next/cache";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Mencatat transaksi penjualan harian baru.
 *
 * KEPUTUSAN ARSITEKTUR KRUSIAL:
 * 1. Mengambil harga_jual dan HPP langsung dari tabel master `produk` milik user di database server.
 * 2. Mengunci snapshot harga ini ke dalam record `transaksi` (harga_jual_saat_transaksi & hpp_saat_transaksi).
 * 3. Menolak input jika produk tidak ditemukan atau bukan milik user yang sedang terautentikasi.
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

  const { produk_id, qty, tanggal, jam } = parseResult.data;

  try {
    const user = await requireAuth();
    const supabase = createClient();

    // 1. Ambil data master produk milik user untuk snapshot harga
    const { data: product, error: productError } = await supabase
      .from("produk")
      .select("id, nama, harga_jual, hpp, user_id")
      .eq("id", produk_id)
      .eq("user_id", user.id) // Memastikan user hanya bisa bertransaksi dengan produk miliknya
      .single();

    if (productError || !product) {
      return {
        success: false,
        error: "Produk tidak ditemukan atau bukan milik Anda.",
      };
    }

    // 2. Tentukan timestamp tanggal & jam default jika tidak dikirim
    const now = new Date();
    const defaultTanggal = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const defaultJam = now.toTimeString().split(" ")[0]; // HH:MM:SS

    // 3. Simpan transaksi dengan snapshot harga historis
    const { data: transaction, error: insertError } = await supabase
      .from("transaksi")
      .insert({
        user_id: user.id,
        produk_id: product.id,
        qty: qty,
        harga_jual_saat_transaksi: product.harga_jual,
        hpp_saat_transaksi: product.hpp,
        tanggal: tanggal || defaultTanggal,
        jam: jam || defaultJam,
      })
      .select()
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    revalidatePath("/riwayat");

    return { success: true, data: transaction };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mencatat transaksi.";
    return { success: false, error: message };
  }
}

/**
 * Mengambil daftar transaksi user dengan opsi filter tanggal dan relasi produk.
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
    const supabase = createClient();

    let query = supabase
      .from("transaksi")
      .select(`
        id,
        user_id,
        produk_id,
        qty,
        harga_jual_saat_transaksi,
        hpp_saat_transaksi,
        tanggal,
        jam,
        created_at,
        produk (
          nama,
          harga_jual,
          hpp
        )
      `)
      .eq("user_id", user.id)
      .order("tanggal", { ascending: false })
      .order("jam", { ascending: false });

    if (parseResult.data.tanggalMulai) {
      query = query.gte("tanggal", parseResult.data.tanggalMulai);
    }
    if (parseResult.data.tanggalAkhir) {
      query = query.lte("tanggal", parseResult.data.tanggalAkhir);
    }
    if (parseResult.data.produk_id) {
      query = query.eq("produk_id", parseResult.data.produk_id);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    // Normalisasi struktur return agar sesuai TransaksiWithProduk
    const formattedData: TransaksiWithProduk[] = (data || []).map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      produk_id: item.produk_id,
      qty: item.qty,
      harga_jual_saat_transaksi: Number(item.harga_jual_saat_transaksi),
      hpp_saat_transaksi: Number(item.hpp_saat_transaksi),
      tanggal: item.tanggal,
      jam: item.jam,
      created_at: item.created_at,
      produk: item.produk
        ? {
            nama: item.produk.nama,
            harga_jual: Number(item.produk.harga_jual),
            hpp: Number(item.produk.hpp),
          }
        : null,
    }));

    return { success: true, data: formattedData };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengambil daftar transaksi.";
    return { success: false, error: message };
  }
}

/**
 * Menghitung ringkasan keuangan harian:
 * - Omzet = SUM(harga_jual_saat_transaksi * qty)
 * - Total HPP = SUM(hpp_saat_transaksi * qty)
 * - Laba Kotor = Omzet - Total HPP
 * - Total Pengeluaran = SUM(nominal pengeluaran)
 * - Laba Bersih = Laba Kotor - Total Pengeluaran
 */
export async function getDailyFinancialSummaryAction(
  targetTanggal?: string
): Promise<ActionResult<DailyFinancialSummary>> {
  try {
    const user = await requireAuth();
    const supabase = createClient();

    const selectedDate = targetTanggal || new Date().toISOString().split("T")[0];

    // 1. Ambil seluruh transaksi pada tanggal tersebut
    const { data: transactions, error: trxError } = await supabase
      .from("transaksi")
      .select("qty, harga_jual_saat_transaksi, hpp_saat_transaksi")
      .eq("user_id", user.id)
      .eq("tanggal", selectedDate);

    if (trxError) {
      return { success: false, error: trxError.message };
    }

    // 2. Ambil seluruh pengeluaran dadakan pada tanggal tersebut
    const { data: expenses, error: expError } = await supabase
      .from("pengeluaran_dadakan")
      .select("nominal")
      .eq("user_id", user.id)
      .eq("tanggal", selectedDate);

    if (expError) {
      return { success: false, error: expError.message };
    }

    // 3. Kalkulasi metrik keuangan berdasarkan snapshot historis
    let omzet = 0;
    let total_hpp = 0;
    const total_transaksi_count = transactions ? transactions.length : 0;

    for (const trx of transactions || []) {
      const qty = Number(trx.qty);
      const hargaJual = Number(trx.harga_jual_saat_transaksi);
      const hpp = Number(trx.hpp_saat_transaksi);

      omzet += hargaJual * qty;
      total_hpp += hpp * qty;
    }

    const laba_kotor = omzet - total_hpp;

    let total_pengeluaran = 0;
    for (const exp of expenses || []) {
      total_pengeluaran += Number(exp.nominal);
    }

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
    const message = err instanceof Error ? err.message : "Gagal menghitung ringkasan keuangan.";
    return { success: false, error: message };
  }
}

/**
 * Menghapus transaksi milik user.
 */
export async function deleteTransactionAction(id: string): Promise<ActionResult<void>> {
  try {
    const user = await requireAuth();
    const supabase = createClient();

    const { error } = await supabase
      .from("transaksi")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/transaksi");
    revalidatePath("/riwayat");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus transaksi.";
    return { success: false, error: message };
  }
}

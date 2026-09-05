// =============================================================================
// Database Types — REKA UMKM Daily Transaction Logging
// ItechnoCup 2026 (SDG 8)
// =============================================================================

// Session user dari Auth.js
export type SessionUser = {
  id: string;
  email: string | null | undefined;
};

// Model: profiles
export type Profile = {
  id: string;
  nama_usaha: string;
  jenis_usaha: string;
  created_at: string;
  updated_at: string;
};
export type ProfileInsert = Omit<Profile, "created_at" | "updated_at">;
export type ProfileUpdate = Partial<Pick<Profile, "nama_usaha" | "jenis_usaha">>;

// Model: produk
export type Produk = {
  id: string;
  user_id: string;
  nama: string;
  harga_jual: number;
  hpp: number;
  kategori?: string;
  status?: string;
  foto?: string | null;
  is_deleted?: boolean;
  created_at: string;
  updated_at: string;
};
export type ProdukInsert = Omit<Produk, "id" | "created_at" | "updated_at">;
export type ProdukUpdate = Partial<Pick<Produk, "nama" | "harga_jual" | "hpp" | "kategori" | "status" | "foto">>;

// Model: transaksi
// PENTING: harga_jual_saat_transaksi & hpp_saat_transaksi adalah snapshot
// harga pada saat transaksi, bukan FK lookup ke produk.
export type Transaksi = {
  id: string;
  user_id: string;
  produk_id: string;
  qty: number;
  harga_jual_saat_transaksi: number;
  hpp_saat_transaksi: number;
  waktu: string; // ISO 8601: "2026-09-01T14:30:00.000Z"
  created_at: string;
};
export type TransaksiInsert = Omit<Transaksi, "id" | "created_at">;
export type TransaksiUpdate = Partial<Pick<Transaksi, "qty" | "waktu">>;

// Model: pengeluaran_dadakan
export type PengeluaranDadakan = {
  id: string;
  user_id: string;
  kategori: string;
  nominal: number;
  tanggal: string; // YYYY-MM-DD
  created_at: string;
};
export type PengeluaranDadakanInsert = Omit<PengeluaranDadakan, "id" | "created_at">;
export type PengeluaranDadakanUpdate = Partial<Pick<PengeluaranDadakan, "kategori" | "nominal" | "tanggal">>;

// Transaksi dengan join produk info (untuk tampilan riwayat)
export interface TransaksiWithProduk extends Transaksi {
  produk?: Pick<Produk, "nama" | "harga_jual" | "hpp"> | null;
}

// History summary per periode (Harian / Mingguan / Bulanan)
export interface PeriodeSummary {
  periode: "harian" | "mingguan" | "bulanan";
  tanggal_mulai: string;
  tanggal_akhir: string;
  omzet: number;
  total_hpp: number;
  laba_kotor: number;
  total_pengeluaran: number;
  laba_bersih: number;
  total_transaksi: number;
  total_qty: number;
  total_pengeluaran_count: number;
  rata_rata_omzet_per_hari: number;
}


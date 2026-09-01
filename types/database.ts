// =============================================================================
// Database Types — REKA UMKM
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
  created_at: string;
  updated_at: string;
};
export type ProdukInsert = Omit<Produk, "id" | "created_at" | "updated_at">;
export type ProdukUpdate = Partial<Pick<Produk, "nama" | "harga_jual" | "hpp">>;

// Model: transaksi
// PENTING: harga_jual_saat_transaksi & hpp_saat_transaksi adalah snapshot
// harga pada saat transaksi, bukan FK lookup ke produk.
//
// waktu: ISO 8601 string (dari DateTime Prisma → .toISOString())
// Menggabungkan tanggal + jam dalam satu kolom TIMESTAMPTZ untuk
// kemudahan query "omzet per jam" dan "7 hari terakhir".
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
// tanggal: ISO date string (YYYY-MM-DD dari Date Prisma → .toISOString().split('T')[0])
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

// Financial calculation summary interface
// Formula (tidak berubah):
//   Omzet              = SUM(harga_jual_saat_transaksi * qty)
//   Total HPP          = SUM(hpp_saat_transaksi * qty)
//   Laba Kotor         = Omzet - Total HPP
//   Total Pengeluaran  = SUM(nominal pengeluaran_dadakan)
//   Laba Bersih        = Laba Kotor - Total Pengeluaran
export interface DailyFinancialSummary {
  tanggal: string; // YYYY-MM-DD
  total_transaksi_count: number;
  omzet: number;
  total_hpp: number;
  laba_kotor: number;
  total_pengeluaran: number;
  laba_bersih: number;
}

// Hourly sales data point untuk grafik
export interface HourlySalesPoint {
  jam: number;      // 0-23
  omzet: number;    // total omzet pada jam tersebut
  count: number;    // jumlah transaksi
}

// Top product entry untuk ranking
export interface TopProductEntry {
  produk_id: string;
  nama: string;
  total_qty: number;
  total_omzet: number;
  rank: number;
}

// History summary per periode
export interface PeriodeSummary {
  omzet: number;
  laba_kotor: number;
  total_pengeluaran: number;
  laba_bersih: number;
  total_transaksi: number;
  total_pengeluaran_count: number;
}

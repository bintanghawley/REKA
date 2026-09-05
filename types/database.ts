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

// Financial calculation summary interface
// Formula Bisnis:
//   Omzet              = SUM(harga_jual_saat_transaksi * qty)
//   Total HPP          = SUM(hpp_saat_transaksi * qty)
//   Laba Kotor         = Omzet - Total HPP
//   Total Pengeluaran  = SUM(nominal pengeluaran_dadakan)
//   Laba Bersih        = Laba Kotor - Total Pengeluaran
export interface DailyFinancialSummary {
  tanggal: string; // YYYY-MM-DD
  total_transaksi_count: number;
  total_qty_count: number;
  omzet: number;
  total_hpp: number;
  laba_kotor: number;
  total_pengeluaran: number;
  laba_bersih: number;
  
  // Perbandingan vs Hari Sebelumnya (Kemarin)
  perbandingan_kemarin?: {
    omzet_kemarin: number;
    laba_bersih_kemarin: number;
    omzet_change_percent: number; // misal: +15.5 atau -8.2
    laba_change_percent: number;
    omzet_trend: "up" | "down" | "flat";
    laba_trend: "up" | "down" | "flat";
  };
}

// Hourly sales data point untuk grafik keramaian per jam
export interface HourlySalesPoint {
  jam: number;      // 0-23
  label: string;    // "00:00", "01:00", dst.
  omzet: number;    // total omzet pada jam tersebut
  count: number;    // jumlah transaksi pada jam tersebut
  qty: number;      // total unit produk terjual
}

// Status & Prioritas Restock Produk
export type RestockStatus = "prioritas_tinggi" | "sedang" | "aman";

// Top product entry untuk ranking & rekomendasi restock
export interface TopProductEntry {
  produk_id: string;
  nama: string;
  total_qty: number;
  total_omzet: number;
  rank: number;
  kontribusi_omzet_percent: number; // % kontribusi ke total omzet
  
  // Rekomendasi Restock Cerdas
  status_restock: RestockStatus;
  rekomendasi_restock: string;     // Narasi saran restock
  saran_restock_qty: number;       // Estimasi unit yang perlu disiapkan
}

// Breakdown pengeluaran per kategori
export interface ExpenseCategorySummary {
  kategori: string;
  total_nominal: number;
  persentase: number; // % terhadap total pengeluaran
  count: number;
}

// Ringkasan Akhir Hari Otomatis (Automatic End of Day Summary)
export interface EndOfDaySummary {
  tanggal: string;
  nama_usaha: string;
  jenis_usaha: string;
  
  // Metrik Keuangan Inti
  omzet: number;
  total_hpp: number;
  laba_kotor: number;
  total_pengeluaran: number;
  laba_bersih: number;
  margin_laba_bersih_percent: number;
  
  // Statistik Penjualan
  total_transaksi: number;
  total_item_terjual: number;
  rata_rata_transaksi: number; // Average Order Value (AOV)
  
  // Insight Jam Ramai & Sepi
  jam_teramai: {
    jam: number;
    label: string;
    omzet: number;
    count: number;
  } | null;
  
  jam_tersepi: {
    jam: number;
    label: string;
    omzet: number;
    count: number;
  } | null;
  
  // Produk Unggulan & Pengeluaran Terbesar
  produk_terlaris: TopProductEntry | null;
  kategori_pengeluaran_terbesar: ExpenseCategorySummary | null;
  
  // Perbandingan vs Hari Kemarin
  perbandingan_kemarin: {
    omzet_change_percent: number;
    laba_change_percent: number;
    status_narasi: string;
  };
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


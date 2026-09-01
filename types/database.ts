export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type GenericView = {
  Row: Record<string, unknown>;
  Insert?: Record<string, unknown>;
  Update?: Record<string, unknown>;
  Relationships: GenericRelationship[];
};

export type GenericFunction = {
  Args: Record<string, unknown> | never;
  Returns: unknown;
  SetofOptions?: {
    isSetofReturn?: boolean;
    isOneToOne?: boolean;
    isNotNullable?: boolean;
    to: string;
    from: string;
  };
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nama_usaha: string;
          jenis_usaha: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nama_usaha?: string;
          jenis_usaha?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama_usaha?: string;
          jenis_usaha?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      produk: {
        Row: {
          id: string;
          user_id: string;
          nama: string;
          harga_jual: number;
          hpp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nama: string;
          harga_jual: number;
          hpp: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nama?: string;
          harga_jual?: number;
          hpp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      transaksi: {
        Row: {
          id: string;
          user_id: string;
          produk_id: string;
          qty: number;
          harga_jual_saat_transaksi: number;
          hpp_saat_transaksi: number;
          tanggal: string;
          jam: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          produk_id: string;
          qty: number;
          harga_jual_saat_transaksi: number;
          hpp_saat_transaksi: number;
          tanggal?: string;
          jam?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          produk_id?: string;
          qty?: number;
          harga_jual_saat_transaksi?: number;
          hpp_saat_transaksi?: number;
          tanggal?: string;
          jam?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transaksi_produk_id_fkey";
            columns: ["produk_id"];
            isOneToOne: false;
            referencedRelation: "produk";
            referencedColumns: ["id"];
          }
        ];
      };
      pengeluaran_dadakan: {
        Row: {
          id: string;
          user_id: string;
          kategori: string;
          nominal: number;
          tanggal: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kategori: string;
          nominal: number;
          tanggal?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kategori?: string;
          nominal?: number;
          tanggal?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, GenericView>;
    Functions: Record<string, GenericFunction>;
  };
};

// Model Alias Helpers
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Produk = Database["public"]["Tables"]["produk"]["Row"];
export type ProdukInsert = Database["public"]["Tables"]["produk"]["Insert"];
export type ProdukUpdate = Database["public"]["Tables"]["produk"]["Update"];

export type Transaksi = Database["public"]["Tables"]["transaksi"]["Row"];
export type TransaksiInsert = Database["public"]["Tables"]["transaksi"]["Insert"];
export type TransaksiUpdate = Database["public"]["Tables"]["transaksi"]["Update"];

export type PengeluaranDadakan = Database["public"]["Tables"]["pengeluaran_dadakan"]["Row"];
export type PengeluaranDadakanInsert = Database["public"]["Tables"]["pengeluaran_dadakan"]["Insert"];
export type PengeluaranDadakanUpdate = Database["public"]["Tables"]["pengeluaran_dadakan"]["Update"];

// Transaksi dengan join produk info
export interface TransaksiWithProduk extends Transaksi {
  produk?: Pick<Produk, "nama" | "harga_jual" | "hpp"> | null;
}

// Financial calculation summary interface
export interface DailyFinancialSummary {
  tanggal: string;
  total_transaksi_count: number;
  omzet: number;          // SUM(harga_jual_saat_transaksi * qty)
  total_hpp: number;      // SUM(hpp_saat_transaksi * qty)
  laba_kotor: number;     // omzet - total_hpp
  total_pengeluaran: number; // SUM(nominal)
  laba_bersih: number;    // laba_kotor - total_pengeluaran
}

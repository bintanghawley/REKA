-- ==============================================================================
-- MIGRATION: 20260901000001_initial_schema.sql
-- PROJECT: Base Backend UMKM Daily Transaction Logging (ItechnoCup 2026 - SDG 8)
-- ==============================================================================

-- 1. HELPER EXTENSIONS & FUNCTIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to handle automated updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABEL: PROFILES
-- Menyimpan informasi profil usaha UMKM yang terhubung 1-to-1 dengan auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama_usaha TEXT NOT NULL DEFAULT '',
    jenis_usaha TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. TABEL: PRODUK
-- Menyimpan master data produk UMKM
CREATE TABLE IF NOT EXISTS public.produk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    harga_jual NUMERIC(15, 2) NOT NULL CHECK (harga_jual >= 0),
    hpp NUMERIC(15, 2) NOT NULL CHECK (hpp >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_produk_updated_at
    BEFORE UPDATE ON public.produk
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. TABEL: TRANSAKSI
-- Menyimpan catatan transaksi harian
-- KEPUTUSAN DATA MODELING:
-- Kolom 'harga_jual_saat_transaksi' dan 'hpp_saat_transaksi' menyimpan snapshot harga
-- pada saat transaksi terjadi. Hal ini menjamin integritas data historis perhitungan omzet
-- dan laba kotor/bersih meskipun harga produk diubah di kemudian hari.
CREATE TABLE IF NOT EXISTS public.transaksi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    produk_id UUID NOT NULL REFERENCES public.produk(id) ON DELETE RESTRICT,
    qty INTEGER NOT NULL CHECK (qty > 0),
    harga_jual_saat_transaksi NUMERIC(15, 2) NOT NULL CHECK (harga_jual_saat_transaksi >= 0),
    hpp_saat_transaksi NUMERIC(15, 2) NOT NULL CHECK (hpp_saat_transaksi >= 0),
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    jam TIME NOT NULL DEFAULT CURRENT_TIME,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABEL: PENGELUARAN_DADAKAN
-- Menyimpan catatan pengeluaran tak terduga/operasional UMKM
CREATE TABLE IF NOT EXISTS public.pengeluaran_dadakan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    kategori TEXT NOT NULL,
    nominal NUMERIC(15, 2) NOT NULL CHECK (nominal >= 0),
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. INDEXES
-- Index strategis untuk performa query dan filtering berdasarkan user dan tanggal
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_produk_user_id ON public.produk(user_id);

CREATE INDEX IF NOT EXISTS idx_transaksi_user_id ON public.transaksi(user_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_produk_id ON public.transaksi(produk_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON public.transaksi(tanggal);
CREATE INDEX IF NOT EXISTS idx_transaksi_user_tanggal ON public.transaksi(user_id, tanggal);

CREATE INDEX IF NOT EXISTS idx_pengeluaran_user_id ON public.pengeluaran_dadakan(user_id);
CREATE INDEX IF NOT EXISTS idx_pengeluaran_tanggal ON public.pengeluaran_dadakan(tanggal);
CREATE INDEX IF NOT EXISTS idx_pengeluaran_user_tanggal ON public.pengeluaran_dadakan(user_id, tanggal);

-- ==============================================================================
-- 7. TRIGGER: AUTO CREATE PROFILE ON USER REGISTRATION
-- Membuat profil default secara otomatis dan aman saat user baru mendaftar di auth.users
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, nama_usaha, jenis_usaha)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nama_usaha', ''),
        COALESCE(NEW.raw_user_meta_data->>'jenis_usaha', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Pasang trigger pada auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- Menjamin isolasi data antar user secara mutlak
-- ==============================================================================

-- A. PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id);

-- B. PRODUK RLS
ALTER TABLE public.produk ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products"
    ON public.produk FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
    ON public.produk FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
    ON public.produk FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
    ON public.produk FOR DELETE
    USING (auth.uid() = user_id);

-- C. TRANSAKSI RLS
-- Policy INSERT & UPDATE memastikan user_id adalah auth.uid() DAN produk_id milik user yang sama
ALTER TABLE public.transaksi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON public.transaksi FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions for own products"
    ON public.transaksi FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.produk
            WHERE public.produk.id = transaksi.produk_id
              AND public.produk.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own transactions for own products"
    ON public.transaksi FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.produk
            WHERE public.produk.id = transaksi.produk_id
              AND public.produk.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own transactions"
    ON public.transaksi FOR DELETE
    USING (auth.uid() = user_id);

-- D. PENGELUARAN_DADAKAN RLS
ALTER TABLE public.pengeluaran_dadakan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
    ON public.pengeluaran_dadakan FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
    ON public.pengeluaran_dadakan FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
    ON public.pengeluaran_dadakan FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
    ON public.pengeluaran_dadakan FOR DELETE
    USING (auth.uid() = user_id);

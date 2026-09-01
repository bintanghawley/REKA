-- =============================================================================
-- MIGRATION: 0002_fix_date_types
-- Mengonversi kolom tanggal+jam (TEXT) di transaksi menjadi satu kolom
-- `waktu TIMESTAMPTZ`, dan kolom tanggal (TEXT) di pengeluaran_dadakan
-- menjadi `tanggal DATE` native.
--
-- Jalankan di VPS setelah `prisma migrate deploy` atau manual via psql:
--   psql $DATABASE_URL -f prisma/migrations/0002_fix_date_types.sql
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. TABEL transaksi: Konversi tanggal (TEXT) + jam (TEXT) → waktu (TIMESTAMPTZ)
-- =============================================================================

-- Step 1a: Tambah kolom baru waktu (nullable dulu untuk transisi)
ALTER TABLE "transaksi" ADD COLUMN "waktu" TIMESTAMPTZ;

-- Step 1b: Konversi data existing dari TEXT ke TIMESTAMPTZ
-- Format input: '2026-09-01' + ' ' + '14:30:00' → TIMESTAMPTZ UTC
UPDATE "transaksi"
SET "waktu" = TO_TIMESTAMP(tanggal || ' ' || jam, 'YYYY-MM-DD HH24:MI:SS') AT TIME ZONE 'UTC'
WHERE tanggal IS NOT NULL AND jam IS NOT NULL;

-- Step 1c: Set default untuk row yang tanggal/jam-nya NULL (tidak seharusnya ada)
UPDATE "transaksi"
SET "waktu" = "created_at"
WHERE "waktu" IS NULL;

-- Step 1d: Enforce NOT NULL
ALTER TABLE "transaksi" ALTER COLUMN "waktu" SET NOT NULL;

-- Step 1e: Hapus index lama (jika ada)
DROP INDEX IF EXISTS "transaksi_tanggal_idx";
DROP INDEX IF EXISTS "transaksi_user_id_tanggal_idx";

-- Step 1f: Hapus kolom lama
ALTER TABLE "transaksi" DROP COLUMN "tanggal";
ALTER TABLE "transaksi" DROP COLUMN "jam";

-- Step 1g: Buat index baru pada waktu
CREATE INDEX "transaksi_waktu_idx" ON "transaksi"("waktu");
CREATE INDEX "transaksi_user_id_waktu_idx" ON "transaksi"("user_id", "waktu");

-- =============================================================================
-- 2. TABEL pengeluaran_dadakan: Konversi tanggal (TEXT) → tanggal (DATE)
-- =============================================================================

-- Step 2a: Tambah kolom DATE sementara
ALTER TABLE "pengeluaran_dadakan" ADD COLUMN "tanggal_native" DATE;

-- Step 2b: Konversi data existing dari TEXT ke DATE
UPDATE "pengeluaran_dadakan"
SET "tanggal_native" = tanggal::DATE
WHERE tanggal IS NOT NULL AND tanggal ~ '^\d{4}-\d{2}-\d{2}$';

-- Step 2c: Fallback untuk format yang tidak sesuai
UPDATE "pengeluaran_dadakan"
SET "tanggal_native" = CURRENT_DATE
WHERE "tanggal_native" IS NULL;

-- Step 2d: Enforce NOT NULL
ALTER TABLE "pengeluaran_dadakan" ALTER COLUMN "tanggal_native" SET NOT NULL;

-- Step 2e: Hapus index lama
DROP INDEX IF EXISTS "pengeluaran_dadakan_tanggal_idx";
DROP INDEX IF EXISTS "pengeluaran_dadakan_user_id_tanggal_idx";

-- Step 2f: Swap kolom
ALTER TABLE "pengeluaran_dadakan" DROP COLUMN "tanggal";
ALTER TABLE "pengeluaran_dadakan" RENAME COLUMN "tanggal_native" TO "tanggal";

-- Step 2g: Buat index baru
CREATE INDEX "pengeluaran_dadakan_tanggal_idx" ON "pengeluaran_dadakan"("tanggal");
CREATE INDEX "pengeluaran_dadakan_user_id_tanggal_idx" ON "pengeluaran_dadakan"("user_id", "tanggal");

COMMIT;

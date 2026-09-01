-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "nama_usaha" TEXT NOT NULL DEFAULT '',
    "jenis_usaha" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "harga_jual" DECIMAL(15,2) NOT NULL,
    "hpp" DECIMAL(15,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaksi" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "produk_id" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga_jual_saat_transaksi" DECIMAL(15,2) NOT NULL,
    "hpp_saat_transaksi" DECIMAL(15,2) NOT NULL,
    "tanggal" TEXT NOT NULL,
    "jam" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengeluaran_dadakan" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "kategori" TEXT NOT NULL,
    "nominal" DECIMAL(15,2) NOT NULL,
    "tanggal" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengeluaran_dadakan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "produk_user_id_idx" ON "produk"("user_id");

-- CreateIndex
CREATE INDEX "transaksi_user_id_idx" ON "transaksi"("user_id");

-- CreateIndex
CREATE INDEX "transaksi_produk_id_idx" ON "transaksi"("produk_id");

-- CreateIndex
CREATE INDEX "transaksi_tanggal_idx" ON "transaksi"("tanggal");

-- CreateIndex
CREATE INDEX "transaksi_user_id_tanggal_idx" ON "transaksi"("user_id", "tanggal");

-- CreateIndex
CREATE INDEX "pengeluaran_dadakan_user_id_idx" ON "pengeluaran_dadakan"("user_id");

-- CreateIndex
CREATE INDEX "pengeluaran_dadakan_tanggal_idx" ON "pengeluaran_dadakan"("tanggal");

-- CreateIndex
CREATE INDEX "pengeluaran_dadakan_user_id_tanggal_idx" ON "pengeluaran_dadakan"("user_id", "tanggal");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk" ADD CONSTRAINT "produk_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengeluaran_dadakan" ADD CONSTRAINT "pengeluaran_dadakan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

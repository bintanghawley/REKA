#!/bin/bash
# =============================================================================
# REKA UMKM — Deployment Script untuk VPS
# =============================================================================
# Cara penggunaan:
# 1. Pastikan script ini ada di dalam folder root project di VPS Anda.
# 2. Beri izin eksekusi: chmod +x deploy.sh
# 3. Jalankan manual: ./deploy.sh
#    (atau dipicu otomatis oleh GitHub Actions)
# =============================================================================

echo "🚀 Memulai proses deployment REKA UMKM..."

# 1. Pastikan kita ada di folder direktori script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# 2. Tarik kode terbaru dari Git
echo "📦 1/6: Menarik pembaruan dari repository..."
git pull origin main

# 3. Install dependency NPM terbaru
echo "🛠️ 2/6: Menginstal dependencies..."
npm install

# 4. Generate Prisma Client & Jalankan Migration
echo "🗄️ 3/6: Sinkronisasi database Prisma..."
npm run db:generate
npm run db:migrate

# 5. Build aplikasi Next.js (production bundle)
echo "🏗️ 4/6: Mem-build aplikasi Next.js..."
npm run build

# 6. Restart PM2 (menggunakan konfigurasi cluster)
echo "🔄 5/6: Merestart service PM2..."
pm2 reload ecosystem.config.js --env production --update-env

# 7. Selesai
echo "✅ 6/6: Deployment berhasil diselesaikan!"
echo "Aplikasi berjalan di latar belakang via PM2."

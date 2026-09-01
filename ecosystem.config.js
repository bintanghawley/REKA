/**
 * PM2 Ecosystem Config — REKA UMKM
 * ItechnoCup 2026 (SDG 8)
 *
 * Cara pakai di VPS:
 *   npm run build
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup   (untuk auto-restart saat reboot)
 */
module.exports = {
  apps: [
    {
      name: "reka-umkm",
      script: "node_modules/.bin/next",
      args: "start",

      // Cluster mode: memanfaatkan semua CPU core VPS
      exec_mode: "cluster",
      instances: "max",

      // Auto-restart jika proses crash
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",

      // Environment variables untuk production
      // Salin isi .env.local ke sini, ATAU gunakan env_file (lihat catatan)
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        // Isi nilai berikut sesuai konfigurasi VPS:
        DATABASE_URL: "postgresql://reka_user:changeme@localhost:5432/reka_db",
        AUTH_SECRET: "GANTI_DENGAN_SECRET_MINIMAL_32_KARAKTER",
        NEXTAUTH_URL: "https://yourdomain.com",
      },

      // Logging
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};

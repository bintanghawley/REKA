<#
  reset-dev.ps1 - Reset cache Next.js & restart dev server

  Digunakan ketika dev server "macet":
    - Halaman blank putih
    - Error "missing required error components, refreshing..."
    - Error "Unsupported Server Component type: undefined"
    - GET /_next/static/... mengembalikan 404
    - GET /produk (atau route lain) mengembalikan 404/500 padahal file ada

  Akar masalah: cache .next (manifest webpack) basi setelah perubahan
  massal pada banyak file sekaligus (contoh: edit dari AI tool seperti
  Antigravity). Folder .next adalah artefak build - AMAN dihapus,
  ter-regenerate otomatis saat dev server berjalan.
#>

$ErrorActionPreference = "SilentlyContinue"
$port = 3000
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

Write-Host ""
Write-Host "=== RESET DEV SERVER REKA ===" -ForegroundColor Cyan

# 1. Matikan proses yang sedang mendengar di port
Write-Host "1. Mematikan proses di port $port ..." -ForegroundColor Yellow
$conn = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
if ($conn) {
  $pids = $conn.OwningProcess | Sort-Object -Unique
  foreach ($procId in $pids) {
    taskkill /PID $procId /T /F 2>&1 | Out-Null
  }
  Start-Sleep -Seconds 2
  Write-Host "   Proses dimatikan."
} else {
  Write-Host "   Tidak ada proses di port $port."
}

# 2. Hapus cache build .next
Write-Host "2. Menghapus cache .next ..." -ForegroundColor Yellow
$next = Join-Path $root ".next"
if (Test-Path -LiteralPath $next) {
  Remove-Item -LiteralPath $next -Recurse -Force
  Write-Host "   Cache .next dihapus."
} else {
  Write-Host "   Cache .next tidak ada."
}

# 3. Konfirmasi port sudah bersih
$conn = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
if ($conn) {
  Write-Host "   [PERINGATAN] Port $port masih terisi. Ulangi script ini." -ForegroundColor Red
  exit 1
}

# 4. Jalankan ulang dev server di background
Write-Host "3. Menjalankan ulang dev server di http://localhost:$port ..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev > dev-server.log 2>&1" -WorkingDirectory $root -WindowStyle Hidden

# 5. Tunggu sampai server aktif (maks 30 detik; kompilasi ulang bisa lama)
$isUp = $false
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  $conn = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
  if ($conn) {
    $isUp = $true
    break
  }
}

if ($isUp) {
  Write-Host "   Dev server RUNNING di http://localhost:$port (PID $($conn.OwningProcess -join ','))" -ForegroundColor Green
} else {
  Write-Host "   Dev server belum aktif dalam 30 detik. Periksa file dev-server.log" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== SELESAI. Jangan lupa hard refresh browser: Ctrl+Shift+R ===" -ForegroundColor Cyan
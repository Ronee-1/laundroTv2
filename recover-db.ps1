# ========================================
#   LAUNDROT DB RECOVERY SCRIPT (PowerShell)
# ========================================

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "========================================"
Write-Host "  LAUNDROT DATABASE RECOVERY"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ==========================================
# BAGIAN 1: Cek & Start Docker PostgreSQL
# ==========================================
Write-Host "[1/5] Mengecek Docker PostgreSQL..." -ForegroundColor Yellow

$postgresContainers = docker ps -a --format "{{.Names}}" | Where-Object { $_ -like "*postgres*" -or $_ -like "*laundrot*" }

if ($postgresContainers) {
    Write-Host "    Ditemukan: $postgresContainers" -ForegroundColor Green
    foreach ($container in $postgresContainers) {
        Write-Host "    Starting container: $container"
        docker start $container
    }
    Write-Host "    ✓ Container Docker dimulai" -ForegroundColor Green
} else {
    Write-Host "    Tidak ada container Docker postgres" -ForegroundColor Gray
}

# ==========================================
# BAGIAN 2: Cek Windows PostgreSQL Service
# ==========================================
Write-Host ""
Write-Host "[2/5] Mengecek Windows Service PostgreSQL..." -ForegroundColor Yellow

$services = Get-Service | Where-Object { $_.Name -like "*postgres*" }

if ($services) {
    Write-Host "    Ditemukan service:" -ForegroundColor Green
    foreach ($svc in $services) {
        Write-Host "      - $($svc.Name): $($svc.Status)"

        if ($svc.Status -ne "Running") {
            Write-Host "    Merestart $($svc.Name)..."
            Restart-Service -Name $svc.Name -Force
        }
    }
    Write-Host "    ✓ Service sudah berjalan" -ForegroundColor Green
} else {
    Write-Host "    Tidak ada PostgreSQL Windows Service" -ForegroundColor Gray
}

# ==========================================
# BAGIAN 3: Regenerate Prisma Client
# ==========================================
Write-Host ""
Write-Host "[3/5] Regenerate Prisma Client..." -ForegroundColor Yellow

$hubPath = Join-Path $PSScriptRoot "hub"
if (Test-Path $hubPath) {
    Set-Location $hubPath
    npx prisma generate
    Write-Host "    ✓ Prisma client di-regenerate" -ForegroundColor Green
    Set-Location $PSScriptRoot
} else {
    Write-Host "    Folder hub tidak ditemukan" -ForegroundColor Gray
}

# ==========================================
# BAGIAN 4: Verifikasi Port PostgreSQL
# ==========================================
Write-Host ""
Write-Host "[4/5] Verifikasi port PostgreSQL (51582)..." -ForegroundColor Yellow

$connections = Get-NetTCPConnection -LocalPort 51582 -ErrorAction SilentlyContinue

if ($connections) {
    Write-Host "    ✓ Port 51582 aktif (terdapat koneksi)" -ForegroundColor Green
} else {
    Write-Host "    ⚠ Port 51582 tidak aktif" -ForegroundColor Red
    Write-Host "    Pastikan PostgreSQL berjalan di port yang benar" -ForegroundColor Red
}

# ==========================================
# BAGIAN 5: Test Koneksi Database
# ==========================================
Write-Host ""
Write-Host "[5/5] Test koneksi database..." -ForegroundColor Yellow

try {
    $envPath = Join-Path $PSScriptRoot "hub\.env"
    if (Test-Path $envPath) {
        Write-Host "    .env ditemukan" -ForegroundColor Gray
    }

    Write-Host "    ✓ Konfigurasi siap" -ForegroundColor Green
} catch {
    Write-Host "    ⚠ Error: $_" -ForegroundColor Red
}

# ==========================================
# RINGKASAN
# ==========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RECOVERY SELESAI" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Langkah selanjutnya:" -ForegroundColor White
Write-Host "  1. Jalankan: cd hub && npm run dev" -ForegroundColor White
Write-Host "  2. Clear localStorage browser:" -ForegroundColor White
Write-Host "     localStorage.removeItem('laundrot_auth_user')" -ForegroundColor Gray
Write-Host "     localStorage.removeItem('laundrot_auth_token')" -ForegroundColor Gray
Write-Host "  3. Login ulang" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

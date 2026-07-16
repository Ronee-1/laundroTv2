@echo off
chcp 65001 >nul
echo ========================================
echo   LAUNDROT DB RECOVERY SCRIPT
echo ========================================
echo.

:: ==========================================
:: BAGIAN 1: Cek Docker PostgreSQL
:: ==========================================
echo [1/4] Mengecek Docker PostgreSQL...
docker ps -a --format "{{.Names}}" | findstr /i "postgres laundrot" >nul
if %errorlevel% equ 0 (
    echo    Ditemukan container Docker postgres!
    echo    Starting container...
    docker start postgres >nul 2>&1
    docker start laundrot-postgres >nul 2>&1
    echo    ✓ Container dimulai
) else (
    echo    Tidak ada container Docker postgres
)

:: ==========================================
:: BAGIAN 2: Cek Windows Service PostgreSQL
:: ==========================================
echo.
echo [2/4] Mengecek Windows Service PostgreSQL...

:: Cari service PostgreSQL yang berjalan
sc query state= all | findstr /i "postgres" >nul
if %errorlevel% equ 0 (
    echo    Ditemukan PostgreSQL Service!
    echo    Merestart service...

    :: Coba restart dengan nama umum
    net stop postgresql /y >nul 2>&1
    net start postgresql >nul 2>&1

    :: Jika gagal, coba nama lain
    if errorlevel 1 (
        net stop "postgresql-x64-15" /y >nul 2>&1
        net start "postgresql-x64-15" >nul 2>&1
    )
    echo    ✓ Service direstart
) else (
    echo    Tidak ada PostgreSQL Windows Service
)

:: ==========================================
:: BAGIAN 3: Regenerate Prisma Client
:: ==========================================
echo.
echo [3/4] Regenerate Prisma Client...
cd /d "%~dp0"
if exist "hub\prisma" (
    cd hub
    npx prisma generate >nul 2>&1
    echo    ✓ Prisma client di-regenerate
    cd ..
) else (
    echo    Folder hub tidak ditemukan, skip Prisma
)

:: ==========================================
:: BAGIAN 4: Verifikasi Koneksi
:: ==========================================
echo.
echo [4/4] Verifikasi koneksi database...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000/health' -Method GET -TimeoutSec 5 -UseBasicParsing | Select-Object StatusCode } catch { Write-Host 'Backend belum jalan' }"

echo.
echo ========================================
echo   RECOVERY SELESAI
echo ========================================
echo.
echo Langkah selanjutnya:
echo   1. Jalankan: npm run dev
echo   2. Clear localStorage browser
echo   3. Login ulang
echo ========================================
pause

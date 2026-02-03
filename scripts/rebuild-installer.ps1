# Script para limpiar caché y regenerar el instalador
# Uso: powershell -ExecutionPolicy Bypass -File .\scripts\rebuild-installer.ps1

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Limpieza de Caché y Reconstrucción del Instalador" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener la ruta del proyecto
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $projectRoot

Write-Host "Ubicación del proyecto: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# Paso 1: Limpiar caché de electron-builder
Write-Host "1. Limpiando caché de electron-builder..." -ForegroundColor Green
$cacheDir = Join-Path $projectRoot "node_modules\.cache"
if (Test-Path $cacheDir) {
    Remove-Item -Recurse -Force $cacheDir
    Write-Host "   ✓ Caché de electron-builder limpiado" -ForegroundColor Green
} else {
    Write-Host "   ✓ No había caché anterior" -ForegroundColor Green
}
Write-Host ""

# Paso 2: Limpiar carpeta release anterior
Write-Host "2. Limpiando carpetas de release anteriores..." -ForegroundColor Green
$releaseDir = Join-Path $projectRoot "release"
if (Test-Path $releaseDir) {
    Remove-Item -Recurse -Force $releaseDir
    Write-Host "   ✓ Carpeta de release limpiada" -ForegroundColor Green
} else {
    Write-Host "   ✓ No había release anterior" -ForegroundColor Green
}
Write-Host ""

# Paso 3: Verificar que el logo exista
Write-Host "3. Verificando logo del instalador..." -ForegroundColor Green
$logoPath = Join-Path $projectRoot "frontend\public\logo.ico"
if (Test-Path $logoPath) {
    $logoSize = (Get-Item $logoPath).Length / 1KB
    Write-Host "   ✓ Logo encontrado: $logoSize KB" -ForegroundColor Green
} else {
    Write-Host "   ✗ Logo NO encontrado en: $logoPath" -ForegroundColor Red
    Write-Host "   Asegúrese de que el logo existe en frontend/public/logo.ico" -ForegroundColor Yellow
}
Write-Host ""

# Paso 4: Verificar que el script NSIS exista
Write-Host "4. Verificando script NSIS personalizado..." -ForegroundColor Green
$nsisScript = Join-Path $projectRoot "build\installer.nsh"
if (Test-Path $nsisScript) {
    Write-Host "   ✓ Script NSIS encontrado" -ForegroundColor Green
} else {
    Write-Host "   ✗ Script NSIS NO encontrado" -ForegroundColor Red
}
Write-Host ""

# Paso 5: Verificar estructura de directorios
Write-Host "5. Verificando estructura de directorios..." -ForegroundColor Green
$dirs = @("frontend/dist", "backend", "electron", "prisma")
foreach ($dir in $dirs) {
    $dirPath = Join-Path $projectRoot $dir
    if (Test-Path $dirPath) {
        Write-Host "   ✓ $dir existe" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $dir NO existe" -ForegroundColor Red
    }
}
Write-Host ""

# Paso 6: Compilar frontend
Write-Host "6. Compilando frontend..." -ForegroundColor Green
Write-Host "   Ejecutando: cd frontend && npm run build" -ForegroundColor Yellow
Push-Location (Join-Path $projectRoot "frontend")
& npm run build
$buildSuccess = $LASTEXITCODE -eq 0
Pop-Location

if ($buildSuccess) {
    Write-Host "   ✓ Frontend compilado exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error al compilar frontend" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Paso 7: Generar el instalador
Write-Host "7. Generando instalador..." -ForegroundColor Green
Write-Host "   Ejecutando: npm run dist:win" -ForegroundColor Yellow
& npm run dist:win
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Instalador generado exitosamente" -ForegroundColor Green
} else {
    Write-Host "   ✗ Error al generar instalador" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Paso 8: Verificar archivo del instalador
Write-Host "8. Verificando archivo del instalador..." -ForegroundColor Green
$installers = @()
if (Test-Path $releaseDir) {
    $installers = Get-ChildItem -Path $releaseDir -Filter "*.exe" -Recurse
}

if ($installers.Count -gt 0) {
    foreach ($installer in $installers) {
        $size = $installer.Length / 1MB
        Write-Host "   ✓ Instalador encontrado: $($installer.Name) ($([Math]::Round($size, 2)) MB)" -ForegroundColor Green
    }
} else {
    Write-Host "   ✗ No se encontró archivo .exe del instalador" -ForegroundColor Red
}
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Proceso completado" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pasos siguientes:" -ForegroundColor Yellow
Write-Host "1. Ejecuta el instalador desde la carpeta release" -ForegroundColor White
Write-Host "2. Completa el proceso de instalación" -ForegroundColor White
Write-Host "3. Verifica que el logo se muestre correctamente" -ForegroundColor White
Write-Host "4. Verifica que se muestren los detalles de la instalación" -ForegroundColor White
Write-Host "5. Verifica que la aplicación se ejecute sin errores" -ForegroundColor White
Write-Host ""

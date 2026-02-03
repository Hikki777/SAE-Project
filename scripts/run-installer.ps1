# Script para ejecutar el instalador
# Uso: powershell -ExecutionPolicy Bypass -File .\scripts\run-installer.ps1

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "SAE - Sistema de Administración Educativa" -ForegroundColor Cyan
Write-Host "Ejecutor de Instalador" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$releaseDir = Join-Path $projectRoot "release"

# Buscar el instalador
Write-Host "Buscando instalador..." -ForegroundColor Yellow
$installers = Get-ChildItem -Path $releaseDir -Filter "*.exe" -ErrorAction SilentlyContinue | 
    Where-Object { $_.Name -notlike "*uninstaller*" }

if ($installers.Count -eq 0) {
    Write-Host ""
    Write-Host "✗ Error: No se encontró el instalador" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para generar el instalador, ejecuta:" -ForegroundColor Yellow
    Write-Host "  npm run dist:win" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Si hay múltiples instaladores, usar el primero (generalmente el más nuevo)
$installer = $installers[0]
$installerPath = $installer.FullName
$installerName = $installer.Name
$installerSize = [Math]::Round($installer.Length / 1MB, 2)

Write-Host "✓ Instalador encontrado:" -ForegroundColor Green
Write-Host "  Nombre: $installerName" -ForegroundColor White
Write-Host "  Tamaño: $installerSize MB" -ForegroundColor White
Write-Host "  Ubicación: $(Split-Path -Parent $installerPath)" -ForegroundColor White
Write-Host ""

# Confirmar ejecución
Write-Host "¿Deseas ejecutar el instalador?" -ForegroundColor Cyan
$response = Read-Host "Escribe 'S' o 'Sí' para continuar (o cualquier otra tecla para cancelar)"

if ($response -ilike "s*") {
    Write-Host ""
    Write-Host "Iniciando instalador..." -ForegroundColor Green
    Write-Host ""
    
    # Ejecutar el instalador
    & $installerPath
    
    $exitCode = $LASTEXITCODE
    
    Write-Host ""
    if ($exitCode -eq 0) {
        Write-Host "✓ Instalador completado" -ForegroundColor Green
        Write-Host ""
        Write-Host "Próximos pasos:" -ForegroundColor Yellow
        Write-Host "  1. Busca 'SAE' en el menú de inicio" -ForegroundColor White
        Write-Host "  2. Haz clic en 'SAE - Sistema de Administración Educativa'" -ForegroundColor White
        Write-Host "  3. La aplicación debería abrir automáticamente" -ForegroundColor White
    } else {
        Write-Host "⚠ El instalador se cerró con código: $exitCode" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Instalación cancelada" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para instalar manualmente, ejecuta:" -ForegroundColor Cyan
    Write-Host "  $installerPath" -ForegroundColor White
    Write-Host ""
}

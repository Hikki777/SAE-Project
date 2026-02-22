#!/usr/bin/env powershell
<#
.SYNOPSIS
    Script para generar un archivo ICO profesional desde logo.png
    Soporta múltiples métodos: Online, ImageMagick, GraphicsMagick

.DESCRIPTION
    Este script ayuda a generar un archivo ICO de alta calidad desde logo.png
    para que el ejecutable SAE.exe muestre el logo correcto.

.EXAMPLE
    .\generate-ico-professional.ps1
#>

param(
    [string]$Method = "auto"  # auto, imagemagick, graphicsmagick, online
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$publicDir = Join-Path $projectRoot "frontend\public"
$sourceImage = Join-Path $publicDir "logo.png"
$outputIco = Join-Path $publicDir "logo.ico"

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Generador Profesional de ICO para SAE" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════`n" -ForegroundColor Cyan

# Verificar que logo.png existe
if (-not (Test-Path $sourceImage)) {
    Write-Host "❌ Error: $sourceImage no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Imagen fuente: $sourceImage`n" -ForegroundColor Green

# Función: Detectar ImageMagick
function Test-ImageMagick {
    try {
        $output = & magick --version 2>&1
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

# Función: Detectar GraphicsMagick
function Test-GraphicsMagick {
    try {
        $output = & gm version 2>&1
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

# Función: Generar ICO con ImageMagick
function New-IcoImageMagick {
    Write-Host "🔨 Usando ImageMagick..." -ForegroundColor Yellow
    & magick convert $sourceImage `
        -define icon:auto-resize=256,128,96,64,48,32,16 `
        $outputIco
    
    if ($LASTEXITCODE -eq 0) {
        $size = (Get-Item $outputIco).Length / 1KB
        Write-Host "✅ ICO generado exitosamente (${size:.1f} KB)" -ForegroundColor Green
        Write-Host "   Resoluciones: 256, 128, 96, 64, 48, 32, 16 px" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "❌ Error al generar ICO con ImageMagick" -ForegroundColor Red
        return $false
    }
}

# Función: Generar ICO con GraphicsMagick
function New-IcoGraphicsMagick {
    Write-Host "🔨 Usando GraphicsMagick..." -ForegroundColor Yellow
    & gm convert $sourceImage $outputIco
    
    if ($LASTEXITCODE -eq 0) {
        $size = (Get-Item $outputIco).Length / 1KB
        Write-Host "✅ ICO generado exitosamente (${size:.1f} KB)" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "❌ Error al generar ICO con GraphicsMagick" -ForegroundColor Red
        return $false
    }
}

# Función: Guiar al usuario a icoconvert.com
function New-IcoOnline {
    Write-Host "`n🌐 MÉTODO ONLINE - icoconvert.com`n" -ForegroundColor Cyan
    Write-Host "Siga estos pasos para generar un ICO profesional:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Abra en su navegador:" -ForegroundColor White
    Write-Host "   https://icoconvert.com" -ForegroundColor Blue -Underline
    Write-Host ""
    Write-Host "2. Haga clic en 'Choose File' y seleccione:" -ForegroundColor White
    Write-Host "   $sourceImage" -ForegroundColor Green
    Write-Host ""
    Write-Host "3. (Opcional) Personalice los ajustes de compresión" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Haga clic en 'Convert' y espere 2-3 segundos" -ForegroundColor White
    Write-Host ""
    Write-Host "5. Descargue el archivo ICO" -ForegroundColor White
    Write-Host ""
    Write-Host "6. Reemplace:" -ForegroundColor White
    Write-Host "   $outputIco" -ForegroundColor Green
    Write-Host ""
    Write-Host "7. Compile de nuevo:" -ForegroundColor White
    Write-Host "   npm run dist:win" -ForegroundColor Green
    Write-Host ""
}

# Función: Instalar herramientas
function Install-Tools {
    param([string]$Tool)
    
    Write-Host "`n📦 Se requiere $Tool para continuar..." -ForegroundColor Yellow
    Write-Host ""
    
    if ($Tool -eq "ImageMagick") {
        Write-Host "Opción 1: Con Chocolatey (recomendado):" -ForegroundColor White
        Write-Host "  choco install imagemagick -y" -ForegroundColor Green
        Write-Host ""
        Write-Host "Opción 2: Descarga directa:" -ForegroundColor White
        Write-Host "  https://imagemagick.org/script/download.php" -ForegroundColor Blue -Underline
    }
    elseif ($Tool -eq "GraphicsMagick") {
        Write-Host "Opción 1: Con Chocolatey (más ligero):" -ForegroundColor White
        Write-Host "  choco install graphicsmagick -y" -ForegroundColor Green
        Write-Host ""
        Write-Host "Opción 2: Descarga directa:" -ForegroundColor White
        Write-Host "  https://sourceforge.net/projects/graphicsmagick/files/" -ForegroundColor Blue -Underline
    }
    
    Write-Host ""
    Write-Host "Después de instalar, reinicie PowerShell y ejecute nuevamente:" -ForegroundColor White
    Write-Host "  .\generate-ico-professional.ps1 -Method $Tool" -ForegroundColor Green
    Write-Host ""
}

# ──────────────────────────────────────────────────────────
#  LÓGICA PRINCIPAL
# ──────────────────────────────────────────────────────────

if ($Method -eq "auto") {
    Write-Host "🔍 Detectando herramientas disponibles..." -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-ImageMagick) {
        Write-Host "✅ ImageMagick detectado" -ForegroundColor Green
        $success = New-IcoImageMagick
    }
    elseif (Test-GraphicsMagick) {
        Write-Host "✅ GraphicsMagick detectado" -ForegroundColor Green
        $success = New-IcoGraphicsMagick
    }
    else {
        Write-Host "⚠️  No se detectaron herramientas para generar ICO" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Opciones disponibles:" -ForegroundColor Yellow
        Write-Host "  1. Usar icoconvert.com (online, sin instalación)" -ForegroundColor White
        Write-Host "  2. Instalar ImageMagick (profesional)" -ForegroundColor White
        Write-Host "  3. Instalar GraphicsMagick (más ligero)" -ForegroundColor White
        Write-Host ""
        
        $choice = Read-Host "Seleccione una opción (1/2/3)"
        
        switch ($choice) {
            "1" {
                New-IcoOnline
                exit 0
            }
            "2" {
                Install-Tools "ImageMagick"
                exit 1
            }
            "3" {
                Install-Tools "GraphicsMagick"
                exit 1
            }
            default {
                Write-Host "❌ Opción inválida" -ForegroundColor Red
                exit 1
            }
        }
    }
}
elseif ($Method -eq "imagemagick") {
    if (-not (Test-ImageMagick)) {
        Install-Tools "ImageMagick"
        exit 1
    }
    $success = New-IcoImageMagick
}
elseif ($Method -eq "graphicsmagick") {
    if (-not (Test-GraphicsMagick)) {
        Install-Tools "GraphicsMagick"
        exit 1
    }
    $success = New-IcoGraphicsMagick
}
elseif ($Method -eq "online") {
    New-IcoOnline
    exit 0
}
else {
    Write-Host "❌ Método desconocido: $Method" -ForegroundColor Red
    Write-Host "   Use: auto, imagemagick, graphicsmagick u online" -ForegroundColor Red
    exit 1
}

# Resumen final
if ($success) {
    Write-Host ""
    Write-Host "════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✅ ICO GENERADO EXITOSAMENTE" -ForegroundColor Green
    Write-Host "════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximo paso: Compilar SAE" -ForegroundColor Yellow
    Write-Host "  npm run dist:win" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ❌ ERROR AL GENERAR ICO" -ForegroundColor Red
    Write-Host "════════════════════════════════════════════" -ForegroundColor Red
    exit 1
}

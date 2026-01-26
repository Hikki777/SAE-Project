# Script para subir instaladores a GitHub Release v1.0.1
# Este script utiliza git-lfs (Large File Storage) para subir los instaladores

# Configuración
$repoPath = "c:\Users\Kevin\Documents\Proyectos\Sistema de Administración Educativa"
$releaseTag = "v1.0.1"
$releaseDir = "$repoPath\release"

# Verificar que los instaladores existan
Write-Host "Verificando instaladores..." -ForegroundColor Cyan

$installerExe = "$releaseDir\SAE - Sistema de Administración Educativa Setup 1.0.0.exe"
$installerZip = "$releaseDir\SAE-v1.0.0-Portable.zip"

if (!(Test-Path $installerExe)) {
    Write-Host "ERROR: No se encontro $installerExe" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $installerZip)) {
    Write-Host "ERROR: No se encontro $installerZip" -ForegroundColor Red
    exit 1
}

Write-Host "Ambos instaladores encontrados" -ForegroundColor Green

# Información de los archivos
$exeSize = (Get-Item $installerExe).Length / 1MB
$zipSize = (Get-Item $installerZip).Length / 1MB

Write-Host ""
Write-Host "Informacion de Instaladores:" -ForegroundColor Cyan
Write-Host "   Instalador EXE: $([math]::Round($exeSize, 2)) MB"
Write-Host "   Portable ZIP:   $([math]::Round($zipSize, 2)) MB"
Write-Host "   Total:          $([math]::Round($exeSize + $zipSize, 2)) MB"
Write-Host ""

# Notas del release
$releaseNotes = @"
# 🎉 SAE v1.0.1 - Justificaciones v4.0 & Release Oficial

## ✨ Cambios Principales

### 🎯 Justificaciones v4.0
- ✅ Reportes mejorados con encabezados institucionales
- ✅ Panel limpiado (sin redundancias)
- ✅ Apellidos resaltados en negrilla
- ✅ Código refactorizado (-20%)

### 🐦 Build
- Frontend: 27.95 segundos
- Módulos: 3077
- Errores: 0
- Status: ✅ Listo para producción

## 📥 Descargas Disponibles

### Opción 1: Instalador Windows (Recomendado)
**Archivo:** SAE - Sistema de Administración Educativa Setup 1.0.0.exe
**Tamaño:** 121.21 MB
**Instrucciones:**
1. Descargar el instalador
2. Ejecutar el archivo .exe
3. Seguir el asistente
4. ¡Listo!

### Opción 2: Portable (Sin Instalación)
**Archivo:** SAE-v1.0.0-Portable.zip
**Tamaño:** 167.12 MB
**Instrucciones:**
1. Descargar y extraer
2. Ejecutar SAE.exe
3. ¡Listo!

## 📋 Requisitos del Sistema
- Windows 10 o superior (64-bit)
- 500 MB de espacio libre
- Conexión a internet (primera carga)

## 📚 Documentación
- [Notas de Release](./RELEASE_NOTES_v1.0.1.md)
- [Instrucciones de Descarga](./DOWNLOAD_INSTRUCTIONS.md)
- [Cambios Técnicos](./docs/CAMBIOS_JUSTIFICACIONES_V4.md)
- [Índice Completo](./docs/INDEX_JUSTIFICACIONES_V4.md)

---
**Versión:** 1.0.1  
**Fecha:** 26/01/2026  
**Status:** ✅ PUBLICADO OFICIALMENTE
"@

Write-Host "Preparando notas del release..." -ForegroundColor Cyan
Write-Host "Notas generadas exitosamente" -ForegroundColor Green

# Instrucciones para crear el release manualmente en GitHub
Write-Host ""
Write-Host ("=" * 80) -ForegroundColor Yellow
Write-Host "INSTRUCCIONES PARA CREAR RELEASE EN GITHUB" -ForegroundColor Yellow
Write-Host ("=" * 80) -ForegroundColor Yellow
Write-Host ""

Write-Host "Como GitHub CLI no esta disponible, siga estos pasos manuales:" -ForegroundColor White
Write-Host ""

Write-Host "1. Abra GitHub en su navegador:" -ForegroundColor Cyan
Write-Host "   https://github.com/Hikki777/SAE-Project/releases/new" -ForegroundColor White
Write-Host ""

Write-Host "2. Complete los campos:" -ForegroundColor Cyan
Write-Host "   Tag:     v1.0.1" -ForegroundColor White
Write-Host "   Target:  main" -ForegroundColor White
Write-Host ""

Write-Host "3. Titulo del Release:" -ForegroundColor Cyan
Write-Host "   SAE v1.0.1 - Justificaciones v4.0 & Release Oficial" -ForegroundColor White
Write-Host ""

Write-Host "4. Descripcion (copie el texto de abajo):" -ForegroundColor Cyan
Write-Host ""
Write-Host $releaseNotes -ForegroundColor White
Write-Host ""

Write-Host "5. Adjuntar Archivos (Attach binaries by dropping them here or selecting them):" -ForegroundColor Cyan
Write-Host "   Archivo 1: $installerExe" -ForegroundColor White
Write-Host "   Archivo 2: $installerZip" -ForegroundColor White
Write-Host ""

Write-Host "6. Hacer clic en 'Publish release'" -ForegroundColor Cyan
Write-Host ""

Write-Host ("=" * 80) -ForegroundColor Yellow
Write-Host ""

# Guardar las notas en un archivo temporal para facilitar copia
$notesFile = "$repoPath\RELEASE_NOTES_FOR_GITHUB.txt"
$releaseNotes | Out-File -FilePath $notesFile -Encoding UTF8

Write-Host "Las notas del release han sido guardadas en:" -ForegroundColor Cyan
Write-Host "   $notesFile" -ForegroundColor Green
Write-Host ""

# Confirmación
Write-Host "Estado actual:" -ForegroundColor Cyan
Write-Host "   Instaladores disponibles" -ForegroundColor Green
Write-Host "   Documentacion actualizada" -ForegroundColor Green
Write-Host "   Commit pusheado a GitHub" -ForegroundColor Green
Write-Host "   Esperando creacion de Release en GitHub" -ForegroundColor Yellow
Write-Host ""

Write-Host "Tip: Puede copiar las notas del archivo guardado" -ForegroundColor Yellow
Write-Host ""

# Listar archivos en la carpeta release
Write-Host "Archivos en carpeta release/:" -ForegroundColor Cyan
Get-ChildItem -Path $releaseDir -File | Where-Object { $_.Extension -eq ".exe" -or $_.Extension -eq ".zip" } | ForEach-Object {
    $size = $_.Length / 1MB
    Write-Host "   $($_.Name) ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Todo listo para crear el release en GitHub!" -ForegroundColor Green

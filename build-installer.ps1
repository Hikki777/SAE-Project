#!/usr/bin/env pwsh
# Build script for SAE Electron app
$ErrorActionPreference = 'Stop'

Write-Host "=== SAE Build Script ===" -ForegroundColor Green
Write-Host "Building frontend..." -ForegroundColor Yellow
cd frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}
cd ..

Write-Host "Frontend built successfully" -ForegroundColor Green
Write-Host "Running electron-builder..." -ForegroundColor Yellow

# Set environment variables to handle native dependencies
$env:npm_config_build_from_source="false"

# Run electron-builder without rebuilding
npx electron-builder --win --publish never --config.win.certificateFile="" 

if ($LASTEXITCODE -ne 0) {
    Write-Host "electron-builder failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "Installer created in release\ folder" -ForegroundColor Cyan
Get-ChildItem ".\release\*.exe" -ErrorAction SilentlyContinue | Select-Object -Last 1 | ForEach-Object {
    Write-Host "Output: $($_.Name) ($([math]::Round($_.Length / 1MB, 2)) MB)" -ForegroundColor Cyan
}

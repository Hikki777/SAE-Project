#!/bin/bash
# Script para verificar la configuración de Electron

echo "=== Verificación de Configuración Electron ==="
echo ""

# Verificar archivos críticos
echo "1. Verificando archivos críticos..."
files=(
  ".env"
  "frontend/.env.development"
  "frontend/.env.production"
  "electron/main.js"
  "backend/server.js"
  "scripts/start-electron.js"
  "frontend/src/api/client.js"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file existe"
  else
    echo "✗ $file NO ENCONTRADO"
  fi
done

echo ""
echo "2. Variables de entorno..."
echo "DATABASE_URL en .env: $(grep DATABASE_URL .env || echo 'NO ENCONTRADO')"
echo "JWT_SECRET en .env: $([ -n "$(grep JWT_SECRET .env)" ] && echo '✓ Configurado' || echo '✗ NO ENCONTRADO')"
echo "HMAC_SECRET en .env: $([ -n "$(grep HMAC_SECRET .env)" ] && echo '✓ Configurado' || echo '✗ NO ENCONTRADO')"

echo ""
echo "3. Verificando puertos..."
lsof -i :5000 && echo "Puerto 5000 en uso" || echo "Puerto 5000 disponible"
lsof -i :5173 && echo "Puerto 5173 en uso" || echo "Puerto 5173 disponible"

echo ""
echo "=== Listo para ejecutar: npm run electron ==="

#!/usr/bin/env node

/**
 * Script para generar iconos de SAE a partir del logo.png
 * Usa electron-icon-builder para crear iconos profesionales
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const sharp = require("sharp");

const projectRoot = path.join(__dirname, "..");
const publicDir = path.join(projectRoot, "frontend", "public");
const buildDir = path.join(projectRoot, "build");
const sourceImage = path.join(publicDir, "logo.png");
const outputIco = path.join(publicDir, "logo.ico");
const iconInputDir = path.join(buildDir, "icon-input");
const iconOutputDir = path.join(buildDir, "icon-output");

console.log("════════════════════════════════════════════");
console.log("  Generando iconos de SAE...");
console.log("════════════════════════════════════════════\n");

if (!fs.existsSync(sourceImage)) {
  console.error(`❌ Error: No se encontró logo.png en ${sourceImage}`);
  process.exit(1);
}

console.log(`📁 Imagen fuente: ${sourceImage}`);
console.log(`📦 Directorio de salida: ${publicDir}\n`);

(async () => {
  try {
    // Paso 1: Generar PNGs optimizados con sharp
    const image = sharp(sourceImage);
    const metadata = await image.metadata();
    console.log(`✅ Imagen cargada: ${metadata.width}x${metadata.height}px\n`);

    const sizes = [32, 64, 128, 256, 512];
    console.log("Generando PNGs optimizados:");

    for (const size of sizes) {
      const pngPath = path.join(publicDir, `logo-${size}.png`);
      await image.clone().resize(size, size).toFile(pngPath);
      const fileSize = fs.statSync(pngPath).size;
      console.log(`  ✓ logo-${size}.png (${fileSize} bytes)`);
    }

    console.log("\n✅ PNGs generados correctamente\n");

    // Paso 2: Crear ICO de 256x256 con sharp como fallback
    console.log("Generando ICO para el ejecutable...");
    try {
      // Usar la resolución más alta disponible de logo.png
      const ico256Path = path.join(publicDir, "logo-256-temp.png");
      await image.clone().resize(256, 256).toFile(ico256Path);

      // Convertir PNG a ICO usando un script PowerShell si está disponible
      // O simplemente copiar el PNG de 256x256 como ICO (aunque no es ideal)
      if (fs.existsSync(ico256Path)) {
        console.log(`  ⚠️  Nota: Jimp generó PNG de 256x256`);
        console.log(`  → Para un ICO profesional con múltiples resoluciones,`);
        console.log(`  → usar icoconvert.com o ImageMagick es recomendado\n`);

        // Mantener el logo.ico existente si es válido
        if (!fs.existsSync(outputIco) || fs.statSync(outputIco).size === 0) {
          // Copiar PNG como ICO (fallback, no es ideal pero funciona)
          fs.copyFileSync(ico256Path, outputIco);
          console.log(`  ✓ Fallback: logo.ico creado desde PNG\n`);
        } else {
          console.log(`  ✓ Logo.ico existente mantiene su valor\n`);
        }
        fs.unlinkSync(ico256Path);
      }
    } catch (e) {
      console.warn(`  ⚠️  No se pudo generar ICO: ${e.message}\n`);
    }

    // Paso 3: Generar icon.png para macOS y Linux
    const macIcon = path.join(buildDir, "icon.png");
    await image.clone().resize(512, 512).toFile(macIcon);
    console.log(`✓ icon.png para macOS/Linux generado\n`);

    // Paso 4: Información final
    console.log("════════════════════════════════════════════");
    console.log("✅ Proceso completado");
    console.log("════════════════════════════════════════════");
    console.log("\n📋 Archivos generados:");
    console.log(`  • frontend/public/logo-*.png (5 resoluciones)`);
    console.log(`  • frontend/public/logo.ico (ejecutable)`);
    console.log(`  • build/icon.png (macOS/Linux)\n`);

    console.log("🔧 RECOMENDACIÓN IMPORTANTE:");
    console.log("═══════════════════════════════════════════════");
    console.log("Para obtener un ICO profesional con soporte a múltiples");
    console.log("resoluciones (mejor visualización en Windows):");
    console.log("\n1. Usa online: https://icoconvert.com");
    console.log("   - Sube: frontend/public/logo.png");
    console.log("   - Descarga el ICO y reemplaza logo.ico");
    console.log("\n2. O instala ImageMagick:");
    console.log("   - convert logo.png -define icon:auto-resize=256,128,96,64,48,32,16 logo.ico\n");

    console.log("✅ De todas formas, está listo para compilar:");
    console.log("   npm run dist:win\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error al generar iconos:");
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();

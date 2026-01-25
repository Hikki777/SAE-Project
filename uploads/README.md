# Carpeta Uploads

Esta carpeta contiene **datos sensibles y personales** que NO deben subirse a GitHub.

## ⚠️ IMPORTANTE - Seguridad

- ✅ Los archivos en esta carpeta están **ignorados por git**
- ❌ **NUNCA** hacer `git add -f` en esta carpeta
- ❌ **NUNCA** modificar las reglas de `.gitignore` para esta carpeta

## 📁 Estructura

```
uploads/
├── alumnos/          # Fotos de alumnos
├── docentes/         # Fotos de docentes  
├── directores/       # Fotos de directores
├── usuarios/         # Fotos de usuarios del sistema
├── personal/         # Fotos de personal administrativo
├── carnets/          # Carnets generados (PNG/PDF)
├── qrs/              # Códigos QR generados
├── logos/            # Logos institucionales
└── documentos/       # Documentos varios
```

## 🔒 Datos Sensibles

Esta carpeta contiene:
- Fotografías de personas (alumnos, personal, directores)
- Carnets con información personal
- Códigos QR con datos identificables
- Documentos oficiales

## 📝 Notas para Desarrollo

1. Crear los subdirectorios manualmente si no existen
2. Los archivos `.gitkeep` mantienen la estructura en git
3. En producción, configurar permisos de carpeta apropiados
4. Considerar backup regular de estos archivos (fuera de git)

## 🚀 Deployment

En servidor de producción:
- Configurar permisos: `chmod 755 uploads/`
- Owner: usuario del servidor web (ej: `www-data`, `nginx`)
- Backup regular recomendado

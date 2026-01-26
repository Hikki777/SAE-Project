# Migración del Sistema de Carnets

## ⚠️ ANTES DE CONTINUAR

Este script actualiza el sistema de carnets a un sistema de doble secuencia. **Ejecutar solo una vez**.

## 📋 Pasos para Ejecutar la Migración

### 1. Aplicar cambios al esquema de la base de datos

```bash
npx prisma db push
```

Esto agregará los campos `carnet_counter_personal` y `carnet_counter_alumnos` a la tabla `institucion`.

### 2. Ejecutar script de migración

```bash
node scripts/migrate-carnet-counters.js
```

Este script:
- ✅ Analiza todos los carnets existentes
- ✅ Encuentra el número más alto de personal y alumnos
- ✅ Establece los contadores en la base de datos

### 3. Verificar contadores

El script mostrará:
```
📋 Personal encontrado: X
   └─ Número máximo de personal: XXX

📋 Alumnos encontrados: Y
   └─ Número máximo de alumnos: YYY

✅ Contadores actualizados exitosamente:
   ├─ Personal: XXX
   └─ Alumnos: YYY

📝 Próximos carnets que se generarán:
   ├─ Personal: DIR-2026XXX
   └─ Alumno: A-2026YYY
```

### 4. Probar generación de carnets

Crear un nuevo personal o alumno y verificar que el carnet se genera correctamente con el siguiente número en la secuencia.

## 🎯 Resultado Final

### Sistema Anterior (por tipo):
```
Director 1 = DIR-2026001
Director 2 = DIR-2026002
Docente 1  = D-2026001      ← Repite numeración
Auxiliar 1 = AUX-2026001    ← Repite numeración
```

### Nuevo Sistema (secuencia dual):
```
PERSONAL (secuencia compartida):
Director 1   = DIR-2026001
Director 2   = DIR-2026002
Docente 1    = D-2026003    ← Continúa numeración
Auxiliar 1   = AUX-2026004  ← Continúa numeración

ALUMNOS (secuencia separada):
Alumno 1 = A-2026001
Alumno 2 = A-2026002
Alumno 3 = A-2026003
```

## 🔍 Troubleshooting

### Error: "No se encontró la institución"
- Asegúrate de que la base de datos esté inicializada
- Verifica que existe un registro en la tabla `institucion`

### Los contadores están en 0
- Esto es normal si no hay carnets previos
- Los próximos carnets empezarán en 001

### Error al ejecutar prisma db push
- Asegúrate de que no haya procesos usando la base de datos
- Cierra la aplicación electron si está corriendo
- Intenta nuevamente

## 📝 Notas Importantes

- ✅ Los carnets existentes NO se modifican
- ✅ Solo afecta a carnets nuevos
- ✅ La numeración es continua (no se reinicia por año)
- ✅ Cada contador es independiente (personal vs alumnos)

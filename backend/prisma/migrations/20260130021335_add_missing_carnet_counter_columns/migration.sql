-- AlterTable
ALTER TABLE "alumnos" ADD COLUMN "seccion" TEXT;

-- AlterTable
ALTER TABLE "personal" ADD COLUMN "curso" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_excusas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alumno_id" INTEGER,
    "personal_id" INTEGER,
    "motivo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_ausencia" DATETIME,
    "documento_url" TEXT,
    "observaciones" TEXT,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "excusas_alumno_id_fkey" FOREIGN KEY ("alumno_id") REFERENCES "alumnos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "excusas_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "personal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_excusas" ("alumno_id", "fecha", "id", "motivo", "personal_id") SELECT "alumno_id", "fecha", "id", "motivo", "personal_id" FROM "excusas";
DROP TABLE "excusas";
ALTER TABLE "new_excusas" RENAME TO "excusas";
CREATE INDEX "excusas_fecha_idx" ON "excusas"("fecha");
CREATE INDEX "excusas_estado_idx" ON "excusas"("estado");
CREATE TABLE "new_institucion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "logo_base64" TEXT,
    "logo_path" TEXT,
    "horario_inicio" TEXT,
    "horario_salida" TEXT,
    "margen_puntualidad_min" INTEGER NOT NULL DEFAULT 5,
    "direccion" TEXT,
    "pais" TEXT,
    "departamento" TEXT,
    "municipio" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "ciclo_escolar" INTEGER NOT NULL DEFAULT 2026,
    "inicializado" BOOLEAN NOT NULL DEFAULT false,
    "carnet_counter_personal" INTEGER NOT NULL DEFAULT 0,
    "carnet_counter_alumnos" INTEGER NOT NULL DEFAULT 0,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" DATETIME NOT NULL,
    "master_recovery_key" TEXT
);
INSERT INTO "new_institucion" ("actualizado_en", "creado_en", "departamento", "direccion", "email", "horario_inicio", "horario_salida", "id", "inicializado", "logo_base64", "logo_path", "margen_puntualidad_min", "master_recovery_key", "municipio", "nombre", "pais", "telefono") SELECT "actualizado_en", "creado_en", "departamento", "direccion", "email", "horario_inicio", "horario_salida", "id", "inicializado", "logo_base64", "logo_path", "margen_puntualidad_min", "master_recovery_key", "municipio", "nombre", "pais", "telefono" FROM "institucion";
DROP TABLE "institucion";
ALTER TABLE "new_institucion" RENAME TO "institucion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

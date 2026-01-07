-- AlterTable
ALTER TABLE "institucion" ADD COLUMN "master_recovery_key" TEXT;

-- CreateTable
CREATE TABLE "equipos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT,
    "hostname" TEXT,
    "ip" TEXT NOT NULL,
    "os" TEXT,
    "mac_address" TEXT,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "clave_seguridad" TEXT NOT NULL,
    "ultima_conexion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creado_en" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "equipos_ip_key" ON "equipos"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "equipos_mac_address_key" ON "equipos"("mac_address");

-- CreateIndex
CREATE UNIQUE INDEX "equipos_clave_seguridad_key" ON "equipos"("clave_seguridad");

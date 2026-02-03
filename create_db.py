import sqlite3

db = sqlite3.connect(r'prisma\dev.db')
cursor = db.cursor()

# Crear tabla institucion con sintaxis correcta
sql = """
CREATE TABLE institucion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    logo_base64 TEXT,
    logo_path TEXT,
    horario_inicio TEXT,
    horario_salida TEXT,
    margen_puntualidad_min INTEGER NOT NULL DEFAULT 5,
    direccion TEXT,
    pais TEXT,
    departamento TEXT,
    municipio TEXT,
    email TEXT,
    telefono TEXT,
    ciclo_escolar INTEGER DEFAULT 2026,
    inicializado BOOLEAN NOT NULL DEFAULT 0,
    carnet_counter_personal INTEGER DEFAULT 0,
    carnet_counter_alumnos INTEGER DEFAULT 0,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME,
    master_recovery_key TEXT
);
"""

cursor.execute(sql)
db.commit()

# Verificar
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [t[0] for t in cursor.fetchall()]
print(f"Tablas: {tables}")

cursor.execute("PRAGMA table_info(institucion)")
columns = cursor.fetchall()
print("\nColumnas:")
for col in columns:
    print(f"  {col[1]} ({col[2]})")

db.close()

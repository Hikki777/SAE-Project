import sqlite3

# Leer la migración
with open(r'prisma\migrations\20260103025058_init\migration.sql', 'r', encoding='utf-8') as f:
    sql = f.read()

# Ejecutar
db = sqlite3.connect(r'prisma\dev.db')
cursor = db.cursor()

# Separar por líneas y ejecutar sentencias
statements = sql.split(';\n')
for stmt in statements:
    stmt = stmt.strip()
    if stmt and not stmt.startswith('--'):
        try:
            cursor.execute(stmt)
        except Exception as e:
            print(f"Error: {e}\nSQL: {stmt[:100]}")

db.commit()

# Verificar
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [t[0] for t in cursor.fetchall()]
print(f"Tablas creadas: {tables}")

db.close()

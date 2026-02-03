import sqlite3

db = sqlite3.connect(r'prisma\dev.db')
c = db.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = c.fetchall()
print('Tablas:', [t[0] for t in tables] if tables else 'NINGUNA')
db.close()

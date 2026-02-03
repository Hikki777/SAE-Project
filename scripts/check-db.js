const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/dev.db');
const db = new sqlite3.Database(dbPath);

console.log(`Checking database at: ${dbPath}`);

db.serialize(() => {
  db.all("PRAGMA table_info(Institucion)", (err, rows) => {
    if (err) {
      console.error("Error reading table info:", err);
      return;
    }
    const columns = rows.map(r => r.name);
    console.log("Columns in Institucion:", columns);
    
    if (columns.includes('ciclo_escolar')) {
        console.log("SUCCESS: Column 'ciclo_escolar' found.");
    } else {
        console.error("FAILURE: Column 'ciclo_escolar' NOT found.");
    }
  });
});

db.close();

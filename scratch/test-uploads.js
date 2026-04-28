const fs = require('fs-extra');
const path = require('path');
const { UPLOADS_DIR } = require('../backend/utils/paths');

async function test() {
  try {
    console.log('Testing UPLOADS_DIR:', UPLOADS_DIR);
    await fs.ensureDir(UPLOADS_DIR);
    const testFile = path.join(UPLOADS_DIR, 'test.txt');
    await fs.writeFile(testFile, 'test');
    console.log('Write OK');
    await fs.remove(testFile);
    console.log('Delete OK');
    
    const subDirs = ['usuarios', 'qrs', 'logos', 'alumnos', 'directores'];
    for (const d of subDirs) {
      await fs.ensureDir(path.join(UPLOADS_DIR, d));
      console.log(`Subdir ${d} OK`);
    }
  } catch (err) {
    console.error('FAILED:', err);
  }
}

test();

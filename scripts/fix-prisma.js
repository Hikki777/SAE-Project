const fs = require('fs');
const path = require('path');

function fixPrismaClient() {
  const clientDir = path.join(__dirname, '../node_modules/.prisma/client');
  const indexJs = path.join(clientDir, 'index.js');
  const defaultJs = path.join(clientDir, 'default.js');

  console.log('Checking Prisma Client in:', clientDir);

  if (!fs.existsSync(clientDir)) {
    console.error('Prisma client directory not found!');
    return;
  }

  if (fs.existsSync(indexJs)) {
    console.log('index.js found.');
    if (!fs.existsSync(defaultJs)) {
      console.log('default.js missing. Creating copy from index.js to satisfy requires...');
      fs.copyFileSync(indexJs, defaultJs);
      console.log('Created default.js successfully.');
    } else {
      console.log('default.js already exists.');
    }
  } else {
    console.error('index.js not found in Prisma client!');
  }
}

fixPrismaClient();

const { PrismaClient } = require('../backend/prisma-client');
const prisma = new PrismaClient();

async function checkDiagnostics() {
  console.log('--- Diagnostic Results ---');
  const results = await prisma.diagnosticResult.findMany({
    orderBy: { timestamp: 'desc' },
    take: 10
  });
  
  if (results.length === 0) {
    console.log('No diagnostic results found.');
  } else {
    results.forEach(r => {
      console.log(`[${r.timestamp}] ${r.tipo}: ${r.descripcion} (Reparado: ${r.reparado})`);
    });
  }

  await prisma.$disconnect();
}

checkDiagnostics();

const { PrismaClient } = require('./backend/prisma-client');
const p = new PrismaClient();
p.codigoQr.findUnique({where:{id:20}})
  .then(r=>console.log(JSON.stringify(r)))
  .catch(e=>console.error(e))
  .finally(()=>p.$disconnect());

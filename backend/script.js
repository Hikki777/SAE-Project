const p = require('./prismaClient'); p.excusa.findMany({orderBy:{id:'desc'}, take: 10}).then(r => console.log(JSON.stringify(r, null, 2))).finally(()=>p.$disconnect());

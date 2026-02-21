const p = require('./prismaClient'); p.excusa.findFirst({orderBy: {id: 'desc'}}).then(r => console.log(JSON.stringify(r))).finally(() => p.$disconnect());

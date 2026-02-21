const p = require('./prismaClient'); p.excusa.deleteMany({where: {id: {in: [3, 4]}}}).then(r => console.log(r)).finally(()=>p.$disconnect());

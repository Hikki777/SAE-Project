const { Prisma } = require('../backend/prisma-client');

try {
    const dmmf = Prisma.dmmf;
    const model = dmmf.datamodel.models.find(m => m.name === 'Institucion');
    console.log('--- DMMF MODEL: Institucion ---');
    console.log(JSON.stringify(model, null, 2));
    
    // Check fields
    if (model.fields.some(f => f.name === 'ciclo_escolar')) {
        console.log('SUCCESS: Field ciclo_escolar IS in Client Metadata.');
    } else {
        console.error('FAILURE: Field ciclo_escolar IS NOT in Client Metadata.');
    }
} catch (e) {
    console.error('Error inspecting DMMF:', e);
}

/**
 * Configuración del Sistema Educativo Guatemalteco
 * Define niveles, grados, carreras y reglas de promoción
 */

const sistemaEducativoGuatemala = {
  nombre: 'Sistema Educativo Guatemalteco',
  
  niveles: [
    {
      nombre: 'Primaria',
      grados: [
        '1ro. Primaria',
        '2do. Primaria',
        '3ro. Primaria',
        '4to. Primaria',
        '5to. Primaria',
        '6to. Primaria'
      ],
      gradoGraduacion: '6to. Primaria',
      siguienteNivel: 'Básicos'
    },
    {
      nombre: 'Básicos',
      grados: [
        '1ro. Básico',
        '2do. Básico',
        '3ro. Básico'
      ],
      gradoGraduacion: '3ro. Básico',
      siguienteNivel: 'Diversificado'
    },
    {
      nombre: 'Básicos por Madurez',
      grados: [
        '1ra. Etapa Básicos',
        '2da. Etapa Básicos'
      ],
      gradoGraduacion: '2da. Etapa Básicos',
      siguienteNivel: 'Diversificado'
    },
    {
      nombre: 'Diversificado',
      grados: [
        '4to. Diversificado',
        '5to. Diversificado',
        '6to. Diversificado',
        'Bachillerato por Madurez'
      ],
      carreras: [
        {
          nombre: 'Bachillerato en Computación',
          duracion: 2,
          gradoInicio: '4to. Diversificado',
          gradoGraduacion: '5to. Diversificado'
        },
        {
          nombre: 'Secretariado y Oficinista',
          duracion: 2,
          gradoInicio: '4to Diversificado',
          gradoGraduacion: '5to Diversificado'
        },
        {
          nombre: 'Perito Contador',
          duracion: 3,
          gradoInicio: '4to. Diversificado',
          gradoGraduacion: '6to. Diversificado'
        },
        {
          nombre: 'Secretariado Bilingüe',
          duracion: 3,
          gradoInicio: '4to Diversificado',
          gradoGraduacion: '6to Diversificado'
        },
        {
          nombre: 'Bachillerato en Diseño Gráfico',
          duracion: 2,
          gradoInicio: '4to. Diversificado',
          gradoGraduacion: '5to. Diversificado'
        },
        {
          nombre: 'Perito en Mercadotecnia',
          duracion: 3,
          gradoInicio: '4to. Diversificado',
          gradoGraduacion: '6to. Diversificado'
        },
        {
          nombre: 'Bachillerato por Madurez',
          duracion: 1,
          gradoInicio: 'Bachillerato por Madurez',
          gradoGraduacion: 'Bachillerato por Madurez'
        }
      ]
    }
  ],
  
  // Reglas de promoción automática
  reglasPromocion: {
    // Primaria
    '1ro. Primaria': '2do. Primaria',
    '2do. Primaria': '3ro. Primaria',
    '3ro. Primaria': '4to. Primaria',
    '4to. Primaria': '5to. Primaria',
    '5to. Primaria': '6to. Primaria',
    '6to. Primaria': '1ro. Básico', // Cambio de nivel
    
    // Básicos
    '1ro. Básico': '2do. Básico',
    '2do. Básico': '3ro. Básico',
    '3ro. Básico': '4to. Diversificado',
    // --- Básicos por Madurez ---
    'Básicos por Madurez (1er. Año)': 'Básicos por Madurez (2do. Año)',
    'Básicos por Madurez (2do. Año)': '4to. Diversificado',  // Nivel Básicos por Madurez (2 etapas = 2 años)
    'Básicos por Madurez': {
      duracion: 2,
      grados: ['Básicos por Madurez (1er. Año)', 'Básicos por Madurez (2do. Año)'],
      proximoNivel: 'Diversificado'
    }, // Promoción a diversificado
    
    // Diversificado (Reglas base)
    'Bachillerato por Madurez': 'GRADUADO',
    '4to. Diversificado': '5to. Diversificado',
    '5to. Diversificado': {
       // Logic handled dynamically in service for general rules
       'default': '6to. Diversificado' 
    },
    '6to. Diversificado': 'GRADUADO'
  }
};

/**
 * Obtiene la configuración educativa
 * @returns {object} Configuración del sistema educativo guatemalteco
 */
function getConfiguracion() {
  return sistemaEducativoGuatemala;
}

/**
 * Obtiene todos los grados disponibles
 * @returns {array} Lista de grados
 */
function getGrados() {
  return sistemaEducativoGuatemala.niveles.flatMap(nivel => nivel.grados);
}

/**
 * Obtiene las carreras disponibles para Diversificado
 * @returns {array} Lista de carreras
 */
function getCarreras() {
  const diversificado = sistemaEducativoGuatemala.niveles.find(n => n.nombre === 'Diversificado');
  return diversificado?.carreras || [];
}

/**
 * Obtiene los niveles educativos
 * @returns {array} Lista de niveles
 */
function getNiveles() {
  return sistemaEducativoGuatemala.niveles.map(n => n.nombre);
}

module.exports = {
  sistemaEducativoGuatemala,
  getConfiguracion,
  getGrados,
  getCarreras,
  getNiveles
};


Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.InstitucionScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  logo_base64: 'logo_base64',
  logo_path: 'logo_path',
  horario_inicio: 'horario_inicio',
  horario_salida: 'horario_salida',
  margen_puntualidad_min: 'margen_puntualidad_min',
  direccion: 'direccion',
  pais: 'pais',
  departamento: 'departamento',
  municipio: 'municipio',
  email: 'email',
  telefono: 'telefono',
  ciclo_escolar: 'ciclo_escolar',
  inicializado: 'inicializado',
  carnet_counter_personal: 'carnet_counter_personal',
  carnet_counter_alumnos: 'carnet_counter_alumnos',
  creado_en: 'creado_en',
  actualizado_en: 'actualizado_en',
  master_recovery_key: 'master_recovery_key'
};

exports.Prisma.AlumnoScalarFieldEnum = {
  id: 'id',
  carnet: 'carnet',
  nombres: 'nombres',
  apellidos: 'apellidos',
  sexo: 'sexo',
  grado: 'grado',
  seccion: 'seccion',
  carrera: 'carrera',
  especialidad: 'especialidad',
  jornada: 'jornada',
  estado: 'estado',
  anio_ingreso: 'anio_ingreso',
  anio_graduacion: 'anio_graduacion',
  nivel_actual: 'nivel_actual',
  motivo_baja: 'motivo_baja',
  fecha_baja: 'fecha_baja',
  foto_path: 'foto_path',
  creado_en: 'creado_en',
  actualizado_en: 'actualizado_en'
};

exports.Prisma.PersonalScalarFieldEnum = {
  id: 'id',
  carnet: 'carnet',
  nombres: 'nombres',
  apellidos: 'apellidos',
  sexo: 'sexo',
  cargo: 'cargo',
  jornada: 'jornada',
  grado_guia: 'grado_guia',
  estado: 'estado',
  foto_path: 'foto_path',
  creado_en: 'creado_en',
  actualizado_en: 'actualizado_en',
  curso: 'curso'
};

exports.Prisma.CodigoQrScalarFieldEnum = {
  id: 'id',
  persona_tipo: 'persona_tipo',
  alumno_id: 'alumno_id',
  personal_id: 'personal_id',
  token: 'token',
  png_path: 'png_path',
  vigente: 'vigente',
  generado_en: 'generado_en',
  regenerado_en: 'regenerado_en'
};

exports.Prisma.AsistenciaScalarFieldEnum = {
  id: 'id',
  persona_tipo: 'persona_tipo',
  alumno_id: 'alumno_id',
  personal_id: 'personal_id',
  tipo_evento: 'tipo_evento',
  timestamp: 'timestamp',
  origen: 'origen',
  dispositivo: 'dispositivo',
  estado_puntualidad: 'estado_puntualidad',
  observaciones: 'observaciones',
  creado_en: 'creado_en'
};

exports.Prisma.UsuarioScalarFieldEnum = {
  id: 'id',
  email: 'email',
  nombres: 'nombres',
  apellidos: 'apellidos',
  foto_path: 'foto_path',
  cargo: 'cargo',
  jornada: 'jornada',
  rol: 'rol',
  hash_pass: 'hash_pass',
  activo: 'activo',
  creado_en: 'creado_en',
  actualizado_en: 'actualizado_en'
};

exports.Prisma.AuditoriaScalarFieldEnum = {
  id: 'id',
  entidad: 'entidad',
  entidad_id: 'entidad_id',
  usuario_id: 'usuario_id',
  accion: 'accion',
  detalle: 'detalle',
  timestamp: 'timestamp'
};

exports.Prisma.ExcusaScalarFieldEnum = {
  id: 'id',
  alumno_id: 'alumno_id',
  personal_id: 'personal_id',
  motivo: 'motivo',
  descripcion: 'descripcion',
  estado: 'estado',
  fecha: 'fecha',
  fecha_ausencia: 'fecha_ausencia',
  documento_url: 'documento_url',
  observaciones: 'observaciones',
  creado_en: 'creado_en'
};

exports.Prisma.HistorialAcademicoScalarFieldEnum = {
  id: 'id',
  alumno_id: 'alumno_id',
  anio_escolar: 'anio_escolar',
  grado_cursado: 'grado_cursado',
  nivel: 'nivel',
  carrera: 'carrera',
  promovido: 'promovido',
  observaciones: 'observaciones',
  creado_en: 'creado_en'
};

exports.Prisma.DiagnosticResultScalarFieldEnum = {
  id: 'id',
  tipo: 'tipo',
  codigo_qr_id: 'codigo_qr_id',
  descripcion: 'descripcion',
  reparado: 'reparado',
  reparado_en: 'reparado_en',
  timestamp: 'timestamp'
};

exports.Prisma.EquipoScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  hostname: 'hostname',
  ip: 'ip',
  os: 'os',
  mac_address: 'mac_address',
  aprobado: 'aprobado',
  clave_seguridad: 'clave_seguridad',
  ultima_conexion: 'ultima_conexion',
  creado_en: 'creado_en',
  actualizado_en: 'actualizado_en'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Institucion: 'Institucion',
  Alumno: 'Alumno',
  Personal: 'Personal',
  CodigoQr: 'CodigoQr',
  Asistencia: 'Asistencia',
  Usuario: 'Usuario',
  Auditoria: 'Auditoria',
  Excusa: 'Excusa',
  HistorialAcademico: 'HistorialAcademico',
  DiagnosticResult: 'DiagnosticResult',
  Equipo: 'Equipo'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

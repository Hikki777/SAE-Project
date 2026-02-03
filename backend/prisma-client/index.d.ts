
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Institucion
 * 
 */
export type Institucion = $Result.DefaultSelection<Prisma.$InstitucionPayload>
/**
 * Model Alumno
 * 
 */
export type Alumno = $Result.DefaultSelection<Prisma.$AlumnoPayload>
/**
 * Model Personal
 * 
 */
export type Personal = $Result.DefaultSelection<Prisma.$PersonalPayload>
/**
 * Model CodigoQr
 * 
 */
export type CodigoQr = $Result.DefaultSelection<Prisma.$CodigoQrPayload>
/**
 * Model Asistencia
 * 
 */
export type Asistencia = $Result.DefaultSelection<Prisma.$AsistenciaPayload>
/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>
/**
 * Model Auditoria
 * 
 */
export type Auditoria = $Result.DefaultSelection<Prisma.$AuditoriaPayload>
/**
 * Model Excusa
 * 
 */
export type Excusa = $Result.DefaultSelection<Prisma.$ExcusaPayload>
/**
 * Model HistorialAcademico
 * 
 */
export type HistorialAcademico = $Result.DefaultSelection<Prisma.$HistorialAcademicoPayload>
/**
 * Model DiagnosticResult
 * 
 */
export type DiagnosticResult = $Result.DefaultSelection<Prisma.$DiagnosticResultPayload>
/**
 * Model Equipo
 * 
 */
export type Equipo = $Result.DefaultSelection<Prisma.$EquipoPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Institucions
 * const institucions = await prisma.institucion.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Institucions
   * const institucions = await prisma.institucion.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.institucion`: Exposes CRUD operations for the **Institucion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Institucions
    * const institucions = await prisma.institucion.findMany()
    * ```
    */
  get institucion(): Prisma.InstitucionDelegate<ExtArgs>;

  /**
   * `prisma.alumno`: Exposes CRUD operations for the **Alumno** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Alumnos
    * const alumnos = await prisma.alumno.findMany()
    * ```
    */
  get alumno(): Prisma.AlumnoDelegate<ExtArgs>;

  /**
   * `prisma.personal`: Exposes CRUD operations for the **Personal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Personals
    * const personals = await prisma.personal.findMany()
    * ```
    */
  get personal(): Prisma.PersonalDelegate<ExtArgs>;

  /**
   * `prisma.codigoQr`: Exposes CRUD operations for the **CodigoQr** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CodigoQrs
    * const codigoQrs = await prisma.codigoQr.findMany()
    * ```
    */
  get codigoQr(): Prisma.CodigoQrDelegate<ExtArgs>;

  /**
   * `prisma.asistencia`: Exposes CRUD operations for the **Asistencia** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Asistencias
    * const asistencias = await prisma.asistencia.findMany()
    * ```
    */
  get asistencia(): Prisma.AsistenciaDelegate<ExtArgs>;

  /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs>;

  /**
   * `prisma.auditoria`: Exposes CRUD operations for the **Auditoria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Auditorias
    * const auditorias = await prisma.auditoria.findMany()
    * ```
    */
  get auditoria(): Prisma.AuditoriaDelegate<ExtArgs>;

  /**
   * `prisma.excusa`: Exposes CRUD operations for the **Excusa** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Excusas
    * const excusas = await prisma.excusa.findMany()
    * ```
    */
  get excusa(): Prisma.ExcusaDelegate<ExtArgs>;

  /**
   * `prisma.historialAcademico`: Exposes CRUD operations for the **HistorialAcademico** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HistorialAcademicos
    * const historialAcademicos = await prisma.historialAcademico.findMany()
    * ```
    */
  get historialAcademico(): Prisma.HistorialAcademicoDelegate<ExtArgs>;

  /**
   * `prisma.diagnosticResult`: Exposes CRUD operations for the **DiagnosticResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiagnosticResults
    * const diagnosticResults = await prisma.diagnosticResult.findMany()
    * ```
    */
  get diagnosticResult(): Prisma.DiagnosticResultDelegate<ExtArgs>;

  /**
   * `prisma.equipo`: Exposes CRUD operations for the **Equipo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Equipos
    * const equipos = await prisma.equipo.findMany()
    * ```
    */
  get equipo(): Prisma.EquipoDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "institucion" | "alumno" | "personal" | "codigoQr" | "asistencia" | "usuario" | "auditoria" | "excusa" | "historialAcademico" | "diagnosticResult" | "equipo"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Institucion: {
        payload: Prisma.$InstitucionPayload<ExtArgs>
        fields: Prisma.InstitucionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InstitucionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InstitucionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload>
          }
          findFirst: {
            args: Prisma.InstitucionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InstitucionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload>
          }
          findMany: {
            args: Prisma.InstitucionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload>[]
          }
          create: {
            args: Prisma.InstitucionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload>
          }
          createMany: {
            args: Prisma.InstitucionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InstitucionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload>[]
          }
          delete: {
            args: Prisma.InstitucionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload>
          }
          update: {
            args: Prisma.InstitucionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload>
          }
          deleteMany: {
            args: Prisma.InstitucionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InstitucionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InstitucionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstitucionPayload>
          }
          aggregate: {
            args: Prisma.InstitucionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInstitucion>
          }
          groupBy: {
            args: Prisma.InstitucionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InstitucionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InstitucionCountArgs<ExtArgs>
            result: $Utils.Optional<InstitucionCountAggregateOutputType> | number
          }
        }
      }
      Alumno: {
        payload: Prisma.$AlumnoPayload<ExtArgs>
        fields: Prisma.AlumnoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlumnoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlumnoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          findFirst: {
            args: Prisma.AlumnoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlumnoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          findMany: {
            args: Prisma.AlumnoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>[]
          }
          create: {
            args: Prisma.AlumnoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          createMany: {
            args: Prisma.AlumnoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlumnoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>[]
          }
          delete: {
            args: Prisma.AlumnoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          update: {
            args: Prisma.AlumnoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          deleteMany: {
            args: Prisma.AlumnoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlumnoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlumnoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlumnoPayload>
          }
          aggregate: {
            args: Prisma.AlumnoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlumno>
          }
          groupBy: {
            args: Prisma.AlumnoGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlumnoGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlumnoCountArgs<ExtArgs>
            result: $Utils.Optional<AlumnoCountAggregateOutputType> | number
          }
        }
      }
      Personal: {
        payload: Prisma.$PersonalPayload<ExtArgs>
        fields: Prisma.PersonalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PersonalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PersonalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload>
          }
          findFirst: {
            args: Prisma.PersonalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PersonalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload>
          }
          findMany: {
            args: Prisma.PersonalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload>[]
          }
          create: {
            args: Prisma.PersonalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload>
          }
          createMany: {
            args: Prisma.PersonalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PersonalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload>[]
          }
          delete: {
            args: Prisma.PersonalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload>
          }
          update: {
            args: Prisma.PersonalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload>
          }
          deleteMany: {
            args: Prisma.PersonalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PersonalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PersonalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersonalPayload>
          }
          aggregate: {
            args: Prisma.PersonalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePersonal>
          }
          groupBy: {
            args: Prisma.PersonalGroupByArgs<ExtArgs>
            result: $Utils.Optional<PersonalGroupByOutputType>[]
          }
          count: {
            args: Prisma.PersonalCountArgs<ExtArgs>
            result: $Utils.Optional<PersonalCountAggregateOutputType> | number
          }
        }
      }
      CodigoQr: {
        payload: Prisma.$CodigoQrPayload<ExtArgs>
        fields: Prisma.CodigoQrFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CodigoQrFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CodigoQrFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload>
          }
          findFirst: {
            args: Prisma.CodigoQrFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CodigoQrFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload>
          }
          findMany: {
            args: Prisma.CodigoQrFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload>[]
          }
          create: {
            args: Prisma.CodigoQrCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload>
          }
          createMany: {
            args: Prisma.CodigoQrCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CodigoQrCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload>[]
          }
          delete: {
            args: Prisma.CodigoQrDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload>
          }
          update: {
            args: Prisma.CodigoQrUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload>
          }
          deleteMany: {
            args: Prisma.CodigoQrDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CodigoQrUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CodigoQrUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CodigoQrPayload>
          }
          aggregate: {
            args: Prisma.CodigoQrAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCodigoQr>
          }
          groupBy: {
            args: Prisma.CodigoQrGroupByArgs<ExtArgs>
            result: $Utils.Optional<CodigoQrGroupByOutputType>[]
          }
          count: {
            args: Prisma.CodigoQrCountArgs<ExtArgs>
            result: $Utils.Optional<CodigoQrCountAggregateOutputType> | number
          }
        }
      }
      Asistencia: {
        payload: Prisma.$AsistenciaPayload<ExtArgs>
        fields: Prisma.AsistenciaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AsistenciaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AsistenciaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          findFirst: {
            args: Prisma.AsistenciaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AsistenciaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          findMany: {
            args: Prisma.AsistenciaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>[]
          }
          create: {
            args: Prisma.AsistenciaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          createMany: {
            args: Prisma.AsistenciaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AsistenciaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>[]
          }
          delete: {
            args: Prisma.AsistenciaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          update: {
            args: Prisma.AsistenciaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          deleteMany: {
            args: Prisma.AsistenciaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AsistenciaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AsistenciaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AsistenciaPayload>
          }
          aggregate: {
            args: Prisma.AsistenciaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsistencia>
          }
          groupBy: {
            args: Prisma.AsistenciaGroupByArgs<ExtArgs>
            result: $Utils.Optional<AsistenciaGroupByOutputType>[]
          }
          count: {
            args: Prisma.AsistenciaCountArgs<ExtArgs>
            result: $Utils.Optional<AsistenciaCountAggregateOutputType> | number
          }
        }
      }
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
      Auditoria: {
        payload: Prisma.$AuditoriaPayload<ExtArgs>
        fields: Prisma.AuditoriaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditoriaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditoriaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload>
          }
          findFirst: {
            args: Prisma.AuditoriaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditoriaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload>
          }
          findMany: {
            args: Prisma.AuditoriaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload>[]
          }
          create: {
            args: Prisma.AuditoriaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload>
          }
          createMany: {
            args: Prisma.AuditoriaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditoriaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload>[]
          }
          delete: {
            args: Prisma.AuditoriaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload>
          }
          update: {
            args: Prisma.AuditoriaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload>
          }
          deleteMany: {
            args: Prisma.AuditoriaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditoriaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditoriaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditoriaPayload>
          }
          aggregate: {
            args: Prisma.AuditoriaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditoria>
          }
          groupBy: {
            args: Prisma.AuditoriaGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditoriaGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditoriaCountArgs<ExtArgs>
            result: $Utils.Optional<AuditoriaCountAggregateOutputType> | number
          }
        }
      }
      Excusa: {
        payload: Prisma.$ExcusaPayload<ExtArgs>
        fields: Prisma.ExcusaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExcusaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExcusaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload>
          }
          findFirst: {
            args: Prisma.ExcusaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExcusaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload>
          }
          findMany: {
            args: Prisma.ExcusaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload>[]
          }
          create: {
            args: Prisma.ExcusaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload>
          }
          createMany: {
            args: Prisma.ExcusaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExcusaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload>[]
          }
          delete: {
            args: Prisma.ExcusaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload>
          }
          update: {
            args: Prisma.ExcusaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload>
          }
          deleteMany: {
            args: Prisma.ExcusaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExcusaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExcusaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExcusaPayload>
          }
          aggregate: {
            args: Prisma.ExcusaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExcusa>
          }
          groupBy: {
            args: Prisma.ExcusaGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExcusaGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExcusaCountArgs<ExtArgs>
            result: $Utils.Optional<ExcusaCountAggregateOutputType> | number
          }
        }
      }
      HistorialAcademico: {
        payload: Prisma.$HistorialAcademicoPayload<ExtArgs>
        fields: Prisma.HistorialAcademicoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HistorialAcademicoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HistorialAcademicoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload>
          }
          findFirst: {
            args: Prisma.HistorialAcademicoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HistorialAcademicoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload>
          }
          findMany: {
            args: Prisma.HistorialAcademicoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload>[]
          }
          create: {
            args: Prisma.HistorialAcademicoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload>
          }
          createMany: {
            args: Prisma.HistorialAcademicoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HistorialAcademicoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload>[]
          }
          delete: {
            args: Prisma.HistorialAcademicoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload>
          }
          update: {
            args: Prisma.HistorialAcademicoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload>
          }
          deleteMany: {
            args: Prisma.HistorialAcademicoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HistorialAcademicoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HistorialAcademicoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistorialAcademicoPayload>
          }
          aggregate: {
            args: Prisma.HistorialAcademicoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHistorialAcademico>
          }
          groupBy: {
            args: Prisma.HistorialAcademicoGroupByArgs<ExtArgs>
            result: $Utils.Optional<HistorialAcademicoGroupByOutputType>[]
          }
          count: {
            args: Prisma.HistorialAcademicoCountArgs<ExtArgs>
            result: $Utils.Optional<HistorialAcademicoCountAggregateOutputType> | number
          }
        }
      }
      DiagnosticResult: {
        payload: Prisma.$DiagnosticResultPayload<ExtArgs>
        fields: Prisma.DiagnosticResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiagnosticResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiagnosticResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload>
          }
          findFirst: {
            args: Prisma.DiagnosticResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiagnosticResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload>
          }
          findMany: {
            args: Prisma.DiagnosticResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload>[]
          }
          create: {
            args: Prisma.DiagnosticResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload>
          }
          createMany: {
            args: Prisma.DiagnosticResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiagnosticResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload>[]
          }
          delete: {
            args: Prisma.DiagnosticResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload>
          }
          update: {
            args: Prisma.DiagnosticResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload>
          }
          deleteMany: {
            args: Prisma.DiagnosticResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiagnosticResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DiagnosticResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosticResultPayload>
          }
          aggregate: {
            args: Prisma.DiagnosticResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiagnosticResult>
          }
          groupBy: {
            args: Prisma.DiagnosticResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiagnosticResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiagnosticResultCountArgs<ExtArgs>
            result: $Utils.Optional<DiagnosticResultCountAggregateOutputType> | number
          }
        }
      }
      Equipo: {
        payload: Prisma.$EquipoPayload<ExtArgs>
        fields: Prisma.EquipoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EquipoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EquipoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload>
          }
          findFirst: {
            args: Prisma.EquipoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EquipoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload>
          }
          findMany: {
            args: Prisma.EquipoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload>[]
          }
          create: {
            args: Prisma.EquipoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload>
          }
          createMany: {
            args: Prisma.EquipoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EquipoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload>[]
          }
          delete: {
            args: Prisma.EquipoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload>
          }
          update: {
            args: Prisma.EquipoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload>
          }
          deleteMany: {
            args: Prisma.EquipoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EquipoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EquipoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EquipoPayload>
          }
          aggregate: {
            args: Prisma.EquipoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEquipo>
          }
          groupBy: {
            args: Prisma.EquipoGroupByArgs<ExtArgs>
            result: $Utils.Optional<EquipoGroupByOutputType>[]
          }
          count: {
            args: Prisma.EquipoCountArgs<ExtArgs>
            result: $Utils.Optional<EquipoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AlumnoCountOutputType
   */

  export type AlumnoCountOutputType = {
    asistencias: number
    codigos_qr: number
    excusas: number
    historial: number
  }

  export type AlumnoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asistencias?: boolean | AlumnoCountOutputTypeCountAsistenciasArgs
    codigos_qr?: boolean | AlumnoCountOutputTypeCountCodigos_qrArgs
    excusas?: boolean | AlumnoCountOutputTypeCountExcusasArgs
    historial?: boolean | AlumnoCountOutputTypeCountHistorialArgs
  }

  // Custom InputTypes
  /**
   * AlumnoCountOutputType without action
   */
  export type AlumnoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlumnoCountOutputType
     */
    select?: AlumnoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AlumnoCountOutputType without action
   */
  export type AlumnoCountOutputTypeCountAsistenciasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsistenciaWhereInput
  }

  /**
   * AlumnoCountOutputType without action
   */
  export type AlumnoCountOutputTypeCountCodigos_qrArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CodigoQrWhereInput
  }

  /**
   * AlumnoCountOutputType without action
   */
  export type AlumnoCountOutputTypeCountExcusasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExcusaWhereInput
  }

  /**
   * AlumnoCountOutputType without action
   */
  export type AlumnoCountOutputTypeCountHistorialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistorialAcademicoWhereInput
  }


  /**
   * Count Type PersonalCountOutputType
   */

  export type PersonalCountOutputType = {
    asistencias: number
    codigos_qr: number
    excusas: number
  }

  export type PersonalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asistencias?: boolean | PersonalCountOutputTypeCountAsistenciasArgs
    codigos_qr?: boolean | PersonalCountOutputTypeCountCodigos_qrArgs
    excusas?: boolean | PersonalCountOutputTypeCountExcusasArgs
  }

  // Custom InputTypes
  /**
   * PersonalCountOutputType without action
   */
  export type PersonalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PersonalCountOutputType
     */
    select?: PersonalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PersonalCountOutputType without action
   */
  export type PersonalCountOutputTypeCountAsistenciasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsistenciaWhereInput
  }

  /**
   * PersonalCountOutputType without action
   */
  export type PersonalCountOutputTypeCountCodigos_qrArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CodigoQrWhereInput
  }

  /**
   * PersonalCountOutputType without action
   */
  export type PersonalCountOutputTypeCountExcusasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExcusaWhereInput
  }


  /**
   * Count Type UsuarioCountOutputType
   */

  export type UsuarioCountOutputType = {
    auditorias: number
  }

  export type UsuarioCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditorias?: boolean | UsuarioCountOutputTypeCountAuditoriasArgs
  }

  // Custom InputTypes
  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsuarioCountOutputType
     */
    select?: UsuarioCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsuarioCountOutputType without action
   */
  export type UsuarioCountOutputTypeCountAuditoriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditoriaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Institucion
   */

  export type AggregateInstitucion = {
    _count: InstitucionCountAggregateOutputType | null
    _avg: InstitucionAvgAggregateOutputType | null
    _sum: InstitucionSumAggregateOutputType | null
    _min: InstitucionMinAggregateOutputType | null
    _max: InstitucionMaxAggregateOutputType | null
  }

  export type InstitucionAvgAggregateOutputType = {
    id: number | null
    margen_puntualidad_min: number | null
    ciclo_escolar: number | null
    carnet_counter_personal: number | null
    carnet_counter_alumnos: number | null
  }

  export type InstitucionSumAggregateOutputType = {
    id: number | null
    margen_puntualidad_min: number | null
    ciclo_escolar: number | null
    carnet_counter_personal: number | null
    carnet_counter_alumnos: number | null
  }

  export type InstitucionMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    logo_base64: string | null
    logo_path: string | null
    horario_inicio: string | null
    horario_salida: string | null
    margen_puntualidad_min: number | null
    direccion: string | null
    pais: string | null
    departamento: string | null
    municipio: string | null
    email: string | null
    telefono: string | null
    ciclo_escolar: number | null
    inicializado: boolean | null
    carnet_counter_personal: number | null
    carnet_counter_alumnos: number | null
    creado_en: Date | null
    actualizado_en: Date | null
    master_recovery_key: string | null
  }

  export type InstitucionMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    logo_base64: string | null
    logo_path: string | null
    horario_inicio: string | null
    horario_salida: string | null
    margen_puntualidad_min: number | null
    direccion: string | null
    pais: string | null
    departamento: string | null
    municipio: string | null
    email: string | null
    telefono: string | null
    ciclo_escolar: number | null
    inicializado: boolean | null
    carnet_counter_personal: number | null
    carnet_counter_alumnos: number | null
    creado_en: Date | null
    actualizado_en: Date | null
    master_recovery_key: string | null
  }

  export type InstitucionCountAggregateOutputType = {
    id: number
    nombre: number
    logo_base64: number
    logo_path: number
    horario_inicio: number
    horario_salida: number
    margen_puntualidad_min: number
    direccion: number
    pais: number
    departamento: number
    municipio: number
    email: number
    telefono: number
    ciclo_escolar: number
    inicializado: number
    carnet_counter_personal: number
    carnet_counter_alumnos: number
    creado_en: number
    actualizado_en: number
    master_recovery_key: number
    _all: number
  }


  export type InstitucionAvgAggregateInputType = {
    id?: true
    margen_puntualidad_min?: true
    ciclo_escolar?: true
    carnet_counter_personal?: true
    carnet_counter_alumnos?: true
  }

  export type InstitucionSumAggregateInputType = {
    id?: true
    margen_puntualidad_min?: true
    ciclo_escolar?: true
    carnet_counter_personal?: true
    carnet_counter_alumnos?: true
  }

  export type InstitucionMinAggregateInputType = {
    id?: true
    nombre?: true
    logo_base64?: true
    logo_path?: true
    horario_inicio?: true
    horario_salida?: true
    margen_puntualidad_min?: true
    direccion?: true
    pais?: true
    departamento?: true
    municipio?: true
    email?: true
    telefono?: true
    ciclo_escolar?: true
    inicializado?: true
    carnet_counter_personal?: true
    carnet_counter_alumnos?: true
    creado_en?: true
    actualizado_en?: true
    master_recovery_key?: true
  }

  export type InstitucionMaxAggregateInputType = {
    id?: true
    nombre?: true
    logo_base64?: true
    logo_path?: true
    horario_inicio?: true
    horario_salida?: true
    margen_puntualidad_min?: true
    direccion?: true
    pais?: true
    departamento?: true
    municipio?: true
    email?: true
    telefono?: true
    ciclo_escolar?: true
    inicializado?: true
    carnet_counter_personal?: true
    carnet_counter_alumnos?: true
    creado_en?: true
    actualizado_en?: true
    master_recovery_key?: true
  }

  export type InstitucionCountAggregateInputType = {
    id?: true
    nombre?: true
    logo_base64?: true
    logo_path?: true
    horario_inicio?: true
    horario_salida?: true
    margen_puntualidad_min?: true
    direccion?: true
    pais?: true
    departamento?: true
    municipio?: true
    email?: true
    telefono?: true
    ciclo_escolar?: true
    inicializado?: true
    carnet_counter_personal?: true
    carnet_counter_alumnos?: true
    creado_en?: true
    actualizado_en?: true
    master_recovery_key?: true
    _all?: true
  }

  export type InstitucionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Institucion to aggregate.
     */
    where?: InstitucionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institucions to fetch.
     */
    orderBy?: InstitucionOrderByWithRelationInput | InstitucionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InstitucionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institucions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institucions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Institucions
    **/
    _count?: true | InstitucionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InstitucionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InstitucionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InstitucionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InstitucionMaxAggregateInputType
  }

  export type GetInstitucionAggregateType<T extends InstitucionAggregateArgs> = {
        [P in keyof T & keyof AggregateInstitucion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInstitucion[P]>
      : GetScalarType<T[P], AggregateInstitucion[P]>
  }




  export type InstitucionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstitucionWhereInput
    orderBy?: InstitucionOrderByWithAggregationInput | InstitucionOrderByWithAggregationInput[]
    by: InstitucionScalarFieldEnum[] | InstitucionScalarFieldEnum
    having?: InstitucionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InstitucionCountAggregateInputType | true
    _avg?: InstitucionAvgAggregateInputType
    _sum?: InstitucionSumAggregateInputType
    _min?: InstitucionMinAggregateInputType
    _max?: InstitucionMaxAggregateInputType
  }

  export type InstitucionGroupByOutputType = {
    id: number
    nombre: string
    logo_base64: string | null
    logo_path: string | null
    horario_inicio: string | null
    horario_salida: string | null
    margen_puntualidad_min: number
    direccion: string | null
    pais: string | null
    departamento: string | null
    municipio: string | null
    email: string | null
    telefono: string | null
    ciclo_escolar: number
    inicializado: boolean
    carnet_counter_personal: number
    carnet_counter_alumnos: number
    creado_en: Date
    actualizado_en: Date
    master_recovery_key: string | null
    _count: InstitucionCountAggregateOutputType | null
    _avg: InstitucionAvgAggregateOutputType | null
    _sum: InstitucionSumAggregateOutputType | null
    _min: InstitucionMinAggregateOutputType | null
    _max: InstitucionMaxAggregateOutputType | null
  }

  type GetInstitucionGroupByPayload<T extends InstitucionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InstitucionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InstitucionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InstitucionGroupByOutputType[P]>
            : GetScalarType<T[P], InstitucionGroupByOutputType[P]>
        }
      >
    >


  export type InstitucionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    logo_base64?: boolean
    logo_path?: boolean
    horario_inicio?: boolean
    horario_salida?: boolean
    margen_puntualidad_min?: boolean
    direccion?: boolean
    pais?: boolean
    departamento?: boolean
    municipio?: boolean
    email?: boolean
    telefono?: boolean
    ciclo_escolar?: boolean
    inicializado?: boolean
    carnet_counter_personal?: boolean
    carnet_counter_alumnos?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
    master_recovery_key?: boolean
  }, ExtArgs["result"]["institucion"]>

  export type InstitucionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    logo_base64?: boolean
    logo_path?: boolean
    horario_inicio?: boolean
    horario_salida?: boolean
    margen_puntualidad_min?: boolean
    direccion?: boolean
    pais?: boolean
    departamento?: boolean
    municipio?: boolean
    email?: boolean
    telefono?: boolean
    ciclo_escolar?: boolean
    inicializado?: boolean
    carnet_counter_personal?: boolean
    carnet_counter_alumnos?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
    master_recovery_key?: boolean
  }, ExtArgs["result"]["institucion"]>

  export type InstitucionSelectScalar = {
    id?: boolean
    nombre?: boolean
    logo_base64?: boolean
    logo_path?: boolean
    horario_inicio?: boolean
    horario_salida?: boolean
    margen_puntualidad_min?: boolean
    direccion?: boolean
    pais?: boolean
    departamento?: boolean
    municipio?: boolean
    email?: boolean
    telefono?: boolean
    ciclo_escolar?: boolean
    inicializado?: boolean
    carnet_counter_personal?: boolean
    carnet_counter_alumnos?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
    master_recovery_key?: boolean
  }


  export type $InstitucionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Institucion"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string
      logo_base64: string | null
      logo_path: string | null
      horario_inicio: string | null
      horario_salida: string | null
      margen_puntualidad_min: number
      direccion: string | null
      pais: string | null
      departamento: string | null
      municipio: string | null
      email: string | null
      telefono: string | null
      ciclo_escolar: number
      inicializado: boolean
      carnet_counter_personal: number
      carnet_counter_alumnos: number
      creado_en: Date
      actualizado_en: Date
      master_recovery_key: string | null
    }, ExtArgs["result"]["institucion"]>
    composites: {}
  }

  type InstitucionGetPayload<S extends boolean | null | undefined | InstitucionDefaultArgs> = $Result.GetResult<Prisma.$InstitucionPayload, S>

  type InstitucionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InstitucionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InstitucionCountAggregateInputType | true
    }

  export interface InstitucionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Institucion'], meta: { name: 'Institucion' } }
    /**
     * Find zero or one Institucion that matches the filter.
     * @param {InstitucionFindUniqueArgs} args - Arguments to find a Institucion
     * @example
     * // Get one Institucion
     * const institucion = await prisma.institucion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InstitucionFindUniqueArgs>(args: SelectSubset<T, InstitucionFindUniqueArgs<ExtArgs>>): Prisma__InstitucionClient<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Institucion that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InstitucionFindUniqueOrThrowArgs} args - Arguments to find a Institucion
     * @example
     * // Get one Institucion
     * const institucion = await prisma.institucion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InstitucionFindUniqueOrThrowArgs>(args: SelectSubset<T, InstitucionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InstitucionClient<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Institucion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionFindFirstArgs} args - Arguments to find a Institucion
     * @example
     * // Get one Institucion
     * const institucion = await prisma.institucion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InstitucionFindFirstArgs>(args?: SelectSubset<T, InstitucionFindFirstArgs<ExtArgs>>): Prisma__InstitucionClient<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Institucion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionFindFirstOrThrowArgs} args - Arguments to find a Institucion
     * @example
     * // Get one Institucion
     * const institucion = await prisma.institucion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InstitucionFindFirstOrThrowArgs>(args?: SelectSubset<T, InstitucionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InstitucionClient<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Institucions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Institucions
     * const institucions = await prisma.institucion.findMany()
     * 
     * // Get first 10 Institucions
     * const institucions = await prisma.institucion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const institucionWithIdOnly = await prisma.institucion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InstitucionFindManyArgs>(args?: SelectSubset<T, InstitucionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Institucion.
     * @param {InstitucionCreateArgs} args - Arguments to create a Institucion.
     * @example
     * // Create one Institucion
     * const Institucion = await prisma.institucion.create({
     *   data: {
     *     // ... data to create a Institucion
     *   }
     * })
     * 
     */
    create<T extends InstitucionCreateArgs>(args: SelectSubset<T, InstitucionCreateArgs<ExtArgs>>): Prisma__InstitucionClient<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Institucions.
     * @param {InstitucionCreateManyArgs} args - Arguments to create many Institucions.
     * @example
     * // Create many Institucions
     * const institucion = await prisma.institucion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InstitucionCreateManyArgs>(args?: SelectSubset<T, InstitucionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Institucions and returns the data saved in the database.
     * @param {InstitucionCreateManyAndReturnArgs} args - Arguments to create many Institucions.
     * @example
     * // Create many Institucions
     * const institucion = await prisma.institucion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Institucions and only return the `id`
     * const institucionWithIdOnly = await prisma.institucion.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InstitucionCreateManyAndReturnArgs>(args?: SelectSubset<T, InstitucionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Institucion.
     * @param {InstitucionDeleteArgs} args - Arguments to delete one Institucion.
     * @example
     * // Delete one Institucion
     * const Institucion = await prisma.institucion.delete({
     *   where: {
     *     // ... filter to delete one Institucion
     *   }
     * })
     * 
     */
    delete<T extends InstitucionDeleteArgs>(args: SelectSubset<T, InstitucionDeleteArgs<ExtArgs>>): Prisma__InstitucionClient<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Institucion.
     * @param {InstitucionUpdateArgs} args - Arguments to update one Institucion.
     * @example
     * // Update one Institucion
     * const institucion = await prisma.institucion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InstitucionUpdateArgs>(args: SelectSubset<T, InstitucionUpdateArgs<ExtArgs>>): Prisma__InstitucionClient<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Institucions.
     * @param {InstitucionDeleteManyArgs} args - Arguments to filter Institucions to delete.
     * @example
     * // Delete a few Institucions
     * const { count } = await prisma.institucion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InstitucionDeleteManyArgs>(args?: SelectSubset<T, InstitucionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Institucions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Institucions
     * const institucion = await prisma.institucion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InstitucionUpdateManyArgs>(args: SelectSubset<T, InstitucionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Institucion.
     * @param {InstitucionUpsertArgs} args - Arguments to update or create a Institucion.
     * @example
     * // Update or create a Institucion
     * const institucion = await prisma.institucion.upsert({
     *   create: {
     *     // ... data to create a Institucion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Institucion we want to update
     *   }
     * })
     */
    upsert<T extends InstitucionUpsertArgs>(args: SelectSubset<T, InstitucionUpsertArgs<ExtArgs>>): Prisma__InstitucionClient<$Result.GetResult<Prisma.$InstitucionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Institucions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionCountArgs} args - Arguments to filter Institucions to count.
     * @example
     * // Count the number of Institucions
     * const count = await prisma.institucion.count({
     *   where: {
     *     // ... the filter for the Institucions we want to count
     *   }
     * })
    **/
    count<T extends InstitucionCountArgs>(
      args?: Subset<T, InstitucionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InstitucionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Institucion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InstitucionAggregateArgs>(args: Subset<T, InstitucionAggregateArgs>): Prisma.PrismaPromise<GetInstitucionAggregateType<T>>

    /**
     * Group by Institucion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstitucionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InstitucionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InstitucionGroupByArgs['orderBy'] }
        : { orderBy?: InstitucionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InstitucionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInstitucionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Institucion model
   */
  readonly fields: InstitucionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Institucion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InstitucionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Institucion model
   */ 
  interface InstitucionFieldRefs {
    readonly id: FieldRef<"Institucion", 'Int'>
    readonly nombre: FieldRef<"Institucion", 'String'>
    readonly logo_base64: FieldRef<"Institucion", 'String'>
    readonly logo_path: FieldRef<"Institucion", 'String'>
    readonly horario_inicio: FieldRef<"Institucion", 'String'>
    readonly horario_salida: FieldRef<"Institucion", 'String'>
    readonly margen_puntualidad_min: FieldRef<"Institucion", 'Int'>
    readonly direccion: FieldRef<"Institucion", 'String'>
    readonly pais: FieldRef<"Institucion", 'String'>
    readonly departamento: FieldRef<"Institucion", 'String'>
    readonly municipio: FieldRef<"Institucion", 'String'>
    readonly email: FieldRef<"Institucion", 'String'>
    readonly telefono: FieldRef<"Institucion", 'String'>
    readonly ciclo_escolar: FieldRef<"Institucion", 'Int'>
    readonly inicializado: FieldRef<"Institucion", 'Boolean'>
    readonly carnet_counter_personal: FieldRef<"Institucion", 'Int'>
    readonly carnet_counter_alumnos: FieldRef<"Institucion", 'Int'>
    readonly creado_en: FieldRef<"Institucion", 'DateTime'>
    readonly actualizado_en: FieldRef<"Institucion", 'DateTime'>
    readonly master_recovery_key: FieldRef<"Institucion", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Institucion findUnique
   */
  export type InstitucionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
    /**
     * Filter, which Institucion to fetch.
     */
    where: InstitucionWhereUniqueInput
  }

  /**
   * Institucion findUniqueOrThrow
   */
  export type InstitucionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
    /**
     * Filter, which Institucion to fetch.
     */
    where: InstitucionWhereUniqueInput
  }

  /**
   * Institucion findFirst
   */
  export type InstitucionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
    /**
     * Filter, which Institucion to fetch.
     */
    where?: InstitucionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institucions to fetch.
     */
    orderBy?: InstitucionOrderByWithRelationInput | InstitucionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Institucions.
     */
    cursor?: InstitucionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institucions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institucions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Institucions.
     */
    distinct?: InstitucionScalarFieldEnum | InstitucionScalarFieldEnum[]
  }

  /**
   * Institucion findFirstOrThrow
   */
  export type InstitucionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
    /**
     * Filter, which Institucion to fetch.
     */
    where?: InstitucionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institucions to fetch.
     */
    orderBy?: InstitucionOrderByWithRelationInput | InstitucionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Institucions.
     */
    cursor?: InstitucionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institucions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institucions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Institucions.
     */
    distinct?: InstitucionScalarFieldEnum | InstitucionScalarFieldEnum[]
  }

  /**
   * Institucion findMany
   */
  export type InstitucionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
    /**
     * Filter, which Institucions to fetch.
     */
    where?: InstitucionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Institucions to fetch.
     */
    orderBy?: InstitucionOrderByWithRelationInput | InstitucionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Institucions.
     */
    cursor?: InstitucionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Institucions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Institucions.
     */
    skip?: number
    distinct?: InstitucionScalarFieldEnum | InstitucionScalarFieldEnum[]
  }

  /**
   * Institucion create
   */
  export type InstitucionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
    /**
     * The data needed to create a Institucion.
     */
    data: XOR<InstitucionCreateInput, InstitucionUncheckedCreateInput>
  }

  /**
   * Institucion createMany
   */
  export type InstitucionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Institucions.
     */
    data: InstitucionCreateManyInput | InstitucionCreateManyInput[]
  }

  /**
   * Institucion createManyAndReturn
   */
  export type InstitucionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Institucions.
     */
    data: InstitucionCreateManyInput | InstitucionCreateManyInput[]
  }

  /**
   * Institucion update
   */
  export type InstitucionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
    /**
     * The data needed to update a Institucion.
     */
    data: XOR<InstitucionUpdateInput, InstitucionUncheckedUpdateInput>
    /**
     * Choose, which Institucion to update.
     */
    where: InstitucionWhereUniqueInput
  }

  /**
   * Institucion updateMany
   */
  export type InstitucionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Institucions.
     */
    data: XOR<InstitucionUpdateManyMutationInput, InstitucionUncheckedUpdateManyInput>
    /**
     * Filter which Institucions to update
     */
    where?: InstitucionWhereInput
  }

  /**
   * Institucion upsert
   */
  export type InstitucionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
    /**
     * The filter to search for the Institucion to update in case it exists.
     */
    where: InstitucionWhereUniqueInput
    /**
     * In case the Institucion found by the `where` argument doesn't exist, create a new Institucion with this data.
     */
    create: XOR<InstitucionCreateInput, InstitucionUncheckedCreateInput>
    /**
     * In case the Institucion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InstitucionUpdateInput, InstitucionUncheckedUpdateInput>
  }

  /**
   * Institucion delete
   */
  export type InstitucionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
    /**
     * Filter which Institucion to delete.
     */
    where: InstitucionWhereUniqueInput
  }

  /**
   * Institucion deleteMany
   */
  export type InstitucionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Institucions to delete
     */
    where?: InstitucionWhereInput
  }

  /**
   * Institucion without action
   */
  export type InstitucionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Institucion
     */
    select?: InstitucionSelect<ExtArgs> | null
  }


  /**
   * Model Alumno
   */

  export type AggregateAlumno = {
    _count: AlumnoCountAggregateOutputType | null
    _avg: AlumnoAvgAggregateOutputType | null
    _sum: AlumnoSumAggregateOutputType | null
    _min: AlumnoMinAggregateOutputType | null
    _max: AlumnoMaxAggregateOutputType | null
  }

  export type AlumnoAvgAggregateOutputType = {
    id: number | null
    anio_ingreso: number | null
    anio_graduacion: number | null
  }

  export type AlumnoSumAggregateOutputType = {
    id: number | null
    anio_ingreso: number | null
    anio_graduacion: number | null
  }

  export type AlumnoMinAggregateOutputType = {
    id: number | null
    carnet: string | null
    nombres: string | null
    apellidos: string | null
    sexo: string | null
    grado: string | null
    seccion: string | null
    carrera: string | null
    especialidad: string | null
    jornada: string | null
    estado: string | null
    anio_ingreso: number | null
    anio_graduacion: number | null
    nivel_actual: string | null
    motivo_baja: string | null
    fecha_baja: Date | null
    foto_path: string | null
    creado_en: Date | null
    actualizado_en: Date | null
  }

  export type AlumnoMaxAggregateOutputType = {
    id: number | null
    carnet: string | null
    nombres: string | null
    apellidos: string | null
    sexo: string | null
    grado: string | null
    seccion: string | null
    carrera: string | null
    especialidad: string | null
    jornada: string | null
    estado: string | null
    anio_ingreso: number | null
    anio_graduacion: number | null
    nivel_actual: string | null
    motivo_baja: string | null
    fecha_baja: Date | null
    foto_path: string | null
    creado_en: Date | null
    actualizado_en: Date | null
  }

  export type AlumnoCountAggregateOutputType = {
    id: number
    carnet: number
    nombres: number
    apellidos: number
    sexo: number
    grado: number
    seccion: number
    carrera: number
    especialidad: number
    jornada: number
    estado: number
    anio_ingreso: number
    anio_graduacion: number
    nivel_actual: number
    motivo_baja: number
    fecha_baja: number
    foto_path: number
    creado_en: number
    actualizado_en: number
    _all: number
  }


  export type AlumnoAvgAggregateInputType = {
    id?: true
    anio_ingreso?: true
    anio_graduacion?: true
  }

  export type AlumnoSumAggregateInputType = {
    id?: true
    anio_ingreso?: true
    anio_graduacion?: true
  }

  export type AlumnoMinAggregateInputType = {
    id?: true
    carnet?: true
    nombres?: true
    apellidos?: true
    sexo?: true
    grado?: true
    seccion?: true
    carrera?: true
    especialidad?: true
    jornada?: true
    estado?: true
    anio_ingreso?: true
    anio_graduacion?: true
    nivel_actual?: true
    motivo_baja?: true
    fecha_baja?: true
    foto_path?: true
    creado_en?: true
    actualizado_en?: true
  }

  export type AlumnoMaxAggregateInputType = {
    id?: true
    carnet?: true
    nombres?: true
    apellidos?: true
    sexo?: true
    grado?: true
    seccion?: true
    carrera?: true
    especialidad?: true
    jornada?: true
    estado?: true
    anio_ingreso?: true
    anio_graduacion?: true
    nivel_actual?: true
    motivo_baja?: true
    fecha_baja?: true
    foto_path?: true
    creado_en?: true
    actualizado_en?: true
  }

  export type AlumnoCountAggregateInputType = {
    id?: true
    carnet?: true
    nombres?: true
    apellidos?: true
    sexo?: true
    grado?: true
    seccion?: true
    carrera?: true
    especialidad?: true
    jornada?: true
    estado?: true
    anio_ingreso?: true
    anio_graduacion?: true
    nivel_actual?: true
    motivo_baja?: true
    fecha_baja?: true
    foto_path?: true
    creado_en?: true
    actualizado_en?: true
    _all?: true
  }

  export type AlumnoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alumno to aggregate.
     */
    where?: AlumnoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alumnos to fetch.
     */
    orderBy?: AlumnoOrderByWithRelationInput | AlumnoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlumnoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alumnos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alumnos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Alumnos
    **/
    _count?: true | AlumnoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlumnoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlumnoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlumnoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlumnoMaxAggregateInputType
  }

  export type GetAlumnoAggregateType<T extends AlumnoAggregateArgs> = {
        [P in keyof T & keyof AggregateAlumno]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlumno[P]>
      : GetScalarType<T[P], AggregateAlumno[P]>
  }




  export type AlumnoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlumnoWhereInput
    orderBy?: AlumnoOrderByWithAggregationInput | AlumnoOrderByWithAggregationInput[]
    by: AlumnoScalarFieldEnum[] | AlumnoScalarFieldEnum
    having?: AlumnoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlumnoCountAggregateInputType | true
    _avg?: AlumnoAvgAggregateInputType
    _sum?: AlumnoSumAggregateInputType
    _min?: AlumnoMinAggregateInputType
    _max?: AlumnoMaxAggregateInputType
  }

  export type AlumnoGroupByOutputType = {
    id: number
    carnet: string
    nombres: string
    apellidos: string
    sexo: string | null
    grado: string
    seccion: string | null
    carrera: string | null
    especialidad: string | null
    jornada: string | null
    estado: string
    anio_ingreso: number | null
    anio_graduacion: number | null
    nivel_actual: string | null
    motivo_baja: string | null
    fecha_baja: Date | null
    foto_path: string | null
    creado_en: Date
    actualizado_en: Date
    _count: AlumnoCountAggregateOutputType | null
    _avg: AlumnoAvgAggregateOutputType | null
    _sum: AlumnoSumAggregateOutputType | null
    _min: AlumnoMinAggregateOutputType | null
    _max: AlumnoMaxAggregateOutputType | null
  }

  type GetAlumnoGroupByPayload<T extends AlumnoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlumnoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlumnoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlumnoGroupByOutputType[P]>
            : GetScalarType<T[P], AlumnoGroupByOutputType[P]>
        }
      >
    >


  export type AlumnoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    carnet?: boolean
    nombres?: boolean
    apellidos?: boolean
    sexo?: boolean
    grado?: boolean
    seccion?: boolean
    carrera?: boolean
    especialidad?: boolean
    jornada?: boolean
    estado?: boolean
    anio_ingreso?: boolean
    anio_graduacion?: boolean
    nivel_actual?: boolean
    motivo_baja?: boolean
    fecha_baja?: boolean
    foto_path?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
    asistencias?: boolean | Alumno$asistenciasArgs<ExtArgs>
    codigos_qr?: boolean | Alumno$codigos_qrArgs<ExtArgs>
    excusas?: boolean | Alumno$excusasArgs<ExtArgs>
    historial?: boolean | Alumno$historialArgs<ExtArgs>
    _count?: boolean | AlumnoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["alumno"]>

  export type AlumnoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    carnet?: boolean
    nombres?: boolean
    apellidos?: boolean
    sexo?: boolean
    grado?: boolean
    seccion?: boolean
    carrera?: boolean
    especialidad?: boolean
    jornada?: boolean
    estado?: boolean
    anio_ingreso?: boolean
    anio_graduacion?: boolean
    nivel_actual?: boolean
    motivo_baja?: boolean
    fecha_baja?: boolean
    foto_path?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
  }, ExtArgs["result"]["alumno"]>

  export type AlumnoSelectScalar = {
    id?: boolean
    carnet?: boolean
    nombres?: boolean
    apellidos?: boolean
    sexo?: boolean
    grado?: boolean
    seccion?: boolean
    carrera?: boolean
    especialidad?: boolean
    jornada?: boolean
    estado?: boolean
    anio_ingreso?: boolean
    anio_graduacion?: boolean
    nivel_actual?: boolean
    motivo_baja?: boolean
    fecha_baja?: boolean
    foto_path?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
  }

  export type AlumnoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asistencias?: boolean | Alumno$asistenciasArgs<ExtArgs>
    codigos_qr?: boolean | Alumno$codigos_qrArgs<ExtArgs>
    excusas?: boolean | Alumno$excusasArgs<ExtArgs>
    historial?: boolean | Alumno$historialArgs<ExtArgs>
    _count?: boolean | AlumnoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AlumnoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AlumnoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Alumno"
    objects: {
      asistencias: Prisma.$AsistenciaPayload<ExtArgs>[]
      codigos_qr: Prisma.$CodigoQrPayload<ExtArgs>[]
      excusas: Prisma.$ExcusaPayload<ExtArgs>[]
      historial: Prisma.$HistorialAcademicoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      carnet: string
      nombres: string
      apellidos: string
      sexo: string | null
      grado: string
      seccion: string | null
      carrera: string | null
      especialidad: string | null
      jornada: string | null
      estado: string
      anio_ingreso: number | null
      anio_graduacion: number | null
      nivel_actual: string | null
      motivo_baja: string | null
      fecha_baja: Date | null
      foto_path: string | null
      creado_en: Date
      actualizado_en: Date
    }, ExtArgs["result"]["alumno"]>
    composites: {}
  }

  type AlumnoGetPayload<S extends boolean | null | undefined | AlumnoDefaultArgs> = $Result.GetResult<Prisma.$AlumnoPayload, S>

  type AlumnoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AlumnoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AlumnoCountAggregateInputType | true
    }

  export interface AlumnoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Alumno'], meta: { name: 'Alumno' } }
    /**
     * Find zero or one Alumno that matches the filter.
     * @param {AlumnoFindUniqueArgs} args - Arguments to find a Alumno
     * @example
     * // Get one Alumno
     * const alumno = await prisma.alumno.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlumnoFindUniqueArgs>(args: SelectSubset<T, AlumnoFindUniqueArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Alumno that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AlumnoFindUniqueOrThrowArgs} args - Arguments to find a Alumno
     * @example
     * // Get one Alumno
     * const alumno = await prisma.alumno.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlumnoFindUniqueOrThrowArgs>(args: SelectSubset<T, AlumnoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Alumno that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoFindFirstArgs} args - Arguments to find a Alumno
     * @example
     * // Get one Alumno
     * const alumno = await prisma.alumno.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlumnoFindFirstArgs>(args?: SelectSubset<T, AlumnoFindFirstArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Alumno that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoFindFirstOrThrowArgs} args - Arguments to find a Alumno
     * @example
     * // Get one Alumno
     * const alumno = await prisma.alumno.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlumnoFindFirstOrThrowArgs>(args?: SelectSubset<T, AlumnoFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Alumnos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Alumnos
     * const alumnos = await prisma.alumno.findMany()
     * 
     * // Get first 10 Alumnos
     * const alumnos = await prisma.alumno.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alumnoWithIdOnly = await prisma.alumno.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlumnoFindManyArgs>(args?: SelectSubset<T, AlumnoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Alumno.
     * @param {AlumnoCreateArgs} args - Arguments to create a Alumno.
     * @example
     * // Create one Alumno
     * const Alumno = await prisma.alumno.create({
     *   data: {
     *     // ... data to create a Alumno
     *   }
     * })
     * 
     */
    create<T extends AlumnoCreateArgs>(args: SelectSubset<T, AlumnoCreateArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Alumnos.
     * @param {AlumnoCreateManyArgs} args - Arguments to create many Alumnos.
     * @example
     * // Create many Alumnos
     * const alumno = await prisma.alumno.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlumnoCreateManyArgs>(args?: SelectSubset<T, AlumnoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Alumnos and returns the data saved in the database.
     * @param {AlumnoCreateManyAndReturnArgs} args - Arguments to create many Alumnos.
     * @example
     * // Create many Alumnos
     * const alumno = await prisma.alumno.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Alumnos and only return the `id`
     * const alumnoWithIdOnly = await prisma.alumno.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlumnoCreateManyAndReturnArgs>(args?: SelectSubset<T, AlumnoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Alumno.
     * @param {AlumnoDeleteArgs} args - Arguments to delete one Alumno.
     * @example
     * // Delete one Alumno
     * const Alumno = await prisma.alumno.delete({
     *   where: {
     *     // ... filter to delete one Alumno
     *   }
     * })
     * 
     */
    delete<T extends AlumnoDeleteArgs>(args: SelectSubset<T, AlumnoDeleteArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Alumno.
     * @param {AlumnoUpdateArgs} args - Arguments to update one Alumno.
     * @example
     * // Update one Alumno
     * const alumno = await prisma.alumno.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlumnoUpdateArgs>(args: SelectSubset<T, AlumnoUpdateArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Alumnos.
     * @param {AlumnoDeleteManyArgs} args - Arguments to filter Alumnos to delete.
     * @example
     * // Delete a few Alumnos
     * const { count } = await prisma.alumno.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlumnoDeleteManyArgs>(args?: SelectSubset<T, AlumnoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alumnos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Alumnos
     * const alumno = await prisma.alumno.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlumnoUpdateManyArgs>(args: SelectSubset<T, AlumnoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Alumno.
     * @param {AlumnoUpsertArgs} args - Arguments to update or create a Alumno.
     * @example
     * // Update or create a Alumno
     * const alumno = await prisma.alumno.upsert({
     *   create: {
     *     // ... data to create a Alumno
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Alumno we want to update
     *   }
     * })
     */
    upsert<T extends AlumnoUpsertArgs>(args: SelectSubset<T, AlumnoUpsertArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Alumnos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoCountArgs} args - Arguments to filter Alumnos to count.
     * @example
     * // Count the number of Alumnos
     * const count = await prisma.alumno.count({
     *   where: {
     *     // ... the filter for the Alumnos we want to count
     *   }
     * })
    **/
    count<T extends AlumnoCountArgs>(
      args?: Subset<T, AlumnoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlumnoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Alumno.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlumnoAggregateArgs>(args: Subset<T, AlumnoAggregateArgs>): Prisma.PrismaPromise<GetAlumnoAggregateType<T>>

    /**
     * Group by Alumno.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlumnoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlumnoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlumnoGroupByArgs['orderBy'] }
        : { orderBy?: AlumnoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlumnoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlumnoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Alumno model
   */
  readonly fields: AlumnoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Alumno.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlumnoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    asistencias<T extends Alumno$asistenciasArgs<ExtArgs> = {}>(args?: Subset<T, Alumno$asistenciasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findMany"> | Null>
    codigos_qr<T extends Alumno$codigos_qrArgs<ExtArgs> = {}>(args?: Subset<T, Alumno$codigos_qrArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "findMany"> | Null>
    excusas<T extends Alumno$excusasArgs<ExtArgs> = {}>(args?: Subset<T, Alumno$excusasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "findMany"> | Null>
    historial<T extends Alumno$historialArgs<ExtArgs> = {}>(args?: Subset<T, Alumno$historialArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Alumno model
   */ 
  interface AlumnoFieldRefs {
    readonly id: FieldRef<"Alumno", 'Int'>
    readonly carnet: FieldRef<"Alumno", 'String'>
    readonly nombres: FieldRef<"Alumno", 'String'>
    readonly apellidos: FieldRef<"Alumno", 'String'>
    readonly sexo: FieldRef<"Alumno", 'String'>
    readonly grado: FieldRef<"Alumno", 'String'>
    readonly seccion: FieldRef<"Alumno", 'String'>
    readonly carrera: FieldRef<"Alumno", 'String'>
    readonly especialidad: FieldRef<"Alumno", 'String'>
    readonly jornada: FieldRef<"Alumno", 'String'>
    readonly estado: FieldRef<"Alumno", 'String'>
    readonly anio_ingreso: FieldRef<"Alumno", 'Int'>
    readonly anio_graduacion: FieldRef<"Alumno", 'Int'>
    readonly nivel_actual: FieldRef<"Alumno", 'String'>
    readonly motivo_baja: FieldRef<"Alumno", 'String'>
    readonly fecha_baja: FieldRef<"Alumno", 'DateTime'>
    readonly foto_path: FieldRef<"Alumno", 'String'>
    readonly creado_en: FieldRef<"Alumno", 'DateTime'>
    readonly actualizado_en: FieldRef<"Alumno", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Alumno findUnique
   */
  export type AlumnoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumno to fetch.
     */
    where: AlumnoWhereUniqueInput
  }

  /**
   * Alumno findUniqueOrThrow
   */
  export type AlumnoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumno to fetch.
     */
    where: AlumnoWhereUniqueInput
  }

  /**
   * Alumno findFirst
   */
  export type AlumnoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumno to fetch.
     */
    where?: AlumnoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alumnos to fetch.
     */
    orderBy?: AlumnoOrderByWithRelationInput | AlumnoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alumnos.
     */
    cursor?: AlumnoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alumnos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alumnos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alumnos.
     */
    distinct?: AlumnoScalarFieldEnum | AlumnoScalarFieldEnum[]
  }

  /**
   * Alumno findFirstOrThrow
   */
  export type AlumnoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumno to fetch.
     */
    where?: AlumnoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alumnos to fetch.
     */
    orderBy?: AlumnoOrderByWithRelationInput | AlumnoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alumnos.
     */
    cursor?: AlumnoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alumnos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alumnos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alumnos.
     */
    distinct?: AlumnoScalarFieldEnum | AlumnoScalarFieldEnum[]
  }

  /**
   * Alumno findMany
   */
  export type AlumnoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter, which Alumnos to fetch.
     */
    where?: AlumnoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alumnos to fetch.
     */
    orderBy?: AlumnoOrderByWithRelationInput | AlumnoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Alumnos.
     */
    cursor?: AlumnoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alumnos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alumnos.
     */
    skip?: number
    distinct?: AlumnoScalarFieldEnum | AlumnoScalarFieldEnum[]
  }

  /**
   * Alumno create
   */
  export type AlumnoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * The data needed to create a Alumno.
     */
    data: XOR<AlumnoCreateInput, AlumnoUncheckedCreateInput>
  }

  /**
   * Alumno createMany
   */
  export type AlumnoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Alumnos.
     */
    data: AlumnoCreateManyInput | AlumnoCreateManyInput[]
  }

  /**
   * Alumno createManyAndReturn
   */
  export type AlumnoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Alumnos.
     */
    data: AlumnoCreateManyInput | AlumnoCreateManyInput[]
  }

  /**
   * Alumno update
   */
  export type AlumnoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * The data needed to update a Alumno.
     */
    data: XOR<AlumnoUpdateInput, AlumnoUncheckedUpdateInput>
    /**
     * Choose, which Alumno to update.
     */
    where: AlumnoWhereUniqueInput
  }

  /**
   * Alumno updateMany
   */
  export type AlumnoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Alumnos.
     */
    data: XOR<AlumnoUpdateManyMutationInput, AlumnoUncheckedUpdateManyInput>
    /**
     * Filter which Alumnos to update
     */
    where?: AlumnoWhereInput
  }

  /**
   * Alumno upsert
   */
  export type AlumnoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * The filter to search for the Alumno to update in case it exists.
     */
    where: AlumnoWhereUniqueInput
    /**
     * In case the Alumno found by the `where` argument doesn't exist, create a new Alumno with this data.
     */
    create: XOR<AlumnoCreateInput, AlumnoUncheckedCreateInput>
    /**
     * In case the Alumno was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlumnoUpdateInput, AlumnoUncheckedUpdateInput>
  }

  /**
   * Alumno delete
   */
  export type AlumnoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    /**
     * Filter which Alumno to delete.
     */
    where: AlumnoWhereUniqueInput
  }

  /**
   * Alumno deleteMany
   */
  export type AlumnoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alumnos to delete
     */
    where?: AlumnoWhereInput
  }

  /**
   * Alumno.asistencias
   */
  export type Alumno$asistenciasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    where?: AsistenciaWhereInput
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    cursor?: AsistenciaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AsistenciaScalarFieldEnum | AsistenciaScalarFieldEnum[]
  }

  /**
   * Alumno.codigos_qr
   */
  export type Alumno$codigos_qrArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    where?: CodigoQrWhereInput
    orderBy?: CodigoQrOrderByWithRelationInput | CodigoQrOrderByWithRelationInput[]
    cursor?: CodigoQrWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CodigoQrScalarFieldEnum | CodigoQrScalarFieldEnum[]
  }

  /**
   * Alumno.excusas
   */
  export type Alumno$excusasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    where?: ExcusaWhereInput
    orderBy?: ExcusaOrderByWithRelationInput | ExcusaOrderByWithRelationInput[]
    cursor?: ExcusaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExcusaScalarFieldEnum | ExcusaScalarFieldEnum[]
  }

  /**
   * Alumno.historial
   */
  export type Alumno$historialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    where?: HistorialAcademicoWhereInput
    orderBy?: HistorialAcademicoOrderByWithRelationInput | HistorialAcademicoOrderByWithRelationInput[]
    cursor?: HistorialAcademicoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HistorialAcademicoScalarFieldEnum | HistorialAcademicoScalarFieldEnum[]
  }

  /**
   * Alumno without action
   */
  export type AlumnoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
  }


  /**
   * Model Personal
   */

  export type AggregatePersonal = {
    _count: PersonalCountAggregateOutputType | null
    _avg: PersonalAvgAggregateOutputType | null
    _sum: PersonalSumAggregateOutputType | null
    _min: PersonalMinAggregateOutputType | null
    _max: PersonalMaxAggregateOutputType | null
  }

  export type PersonalAvgAggregateOutputType = {
    id: number | null
  }

  export type PersonalSumAggregateOutputType = {
    id: number | null
  }

  export type PersonalMinAggregateOutputType = {
    id: number | null
    carnet: string | null
    nombres: string | null
    apellidos: string | null
    sexo: string | null
    cargo: string | null
    jornada: string | null
    grado_guia: string | null
    estado: string | null
    foto_path: string | null
    creado_en: Date | null
    actualizado_en: Date | null
    curso: string | null
  }

  export type PersonalMaxAggregateOutputType = {
    id: number | null
    carnet: string | null
    nombres: string | null
    apellidos: string | null
    sexo: string | null
    cargo: string | null
    jornada: string | null
    grado_guia: string | null
    estado: string | null
    foto_path: string | null
    creado_en: Date | null
    actualizado_en: Date | null
    curso: string | null
  }

  export type PersonalCountAggregateOutputType = {
    id: number
    carnet: number
    nombres: number
    apellidos: number
    sexo: number
    cargo: number
    jornada: number
    grado_guia: number
    estado: number
    foto_path: number
    creado_en: number
    actualizado_en: number
    curso: number
    _all: number
  }


  export type PersonalAvgAggregateInputType = {
    id?: true
  }

  export type PersonalSumAggregateInputType = {
    id?: true
  }

  export type PersonalMinAggregateInputType = {
    id?: true
    carnet?: true
    nombres?: true
    apellidos?: true
    sexo?: true
    cargo?: true
    jornada?: true
    grado_guia?: true
    estado?: true
    foto_path?: true
    creado_en?: true
    actualizado_en?: true
    curso?: true
  }

  export type PersonalMaxAggregateInputType = {
    id?: true
    carnet?: true
    nombres?: true
    apellidos?: true
    sexo?: true
    cargo?: true
    jornada?: true
    grado_guia?: true
    estado?: true
    foto_path?: true
    creado_en?: true
    actualizado_en?: true
    curso?: true
  }

  export type PersonalCountAggregateInputType = {
    id?: true
    carnet?: true
    nombres?: true
    apellidos?: true
    sexo?: true
    cargo?: true
    jornada?: true
    grado_guia?: true
    estado?: true
    foto_path?: true
    creado_en?: true
    actualizado_en?: true
    curso?: true
    _all?: true
  }

  export type PersonalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Personal to aggregate.
     */
    where?: PersonalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personals to fetch.
     */
    orderBy?: PersonalOrderByWithRelationInput | PersonalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PersonalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Personals
    **/
    _count?: true | PersonalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PersonalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PersonalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PersonalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PersonalMaxAggregateInputType
  }

  export type GetPersonalAggregateType<T extends PersonalAggregateArgs> = {
        [P in keyof T & keyof AggregatePersonal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePersonal[P]>
      : GetScalarType<T[P], AggregatePersonal[P]>
  }




  export type PersonalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersonalWhereInput
    orderBy?: PersonalOrderByWithAggregationInput | PersonalOrderByWithAggregationInput[]
    by: PersonalScalarFieldEnum[] | PersonalScalarFieldEnum
    having?: PersonalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PersonalCountAggregateInputType | true
    _avg?: PersonalAvgAggregateInputType
    _sum?: PersonalSumAggregateInputType
    _min?: PersonalMinAggregateInputType
    _max?: PersonalMaxAggregateInputType
  }

  export type PersonalGroupByOutputType = {
    id: number
    carnet: string
    nombres: string
    apellidos: string
    sexo: string | null
    cargo: string | null
    jornada: string | null
    grado_guia: string | null
    estado: string
    foto_path: string | null
    creado_en: Date
    actualizado_en: Date
    curso: string | null
    _count: PersonalCountAggregateOutputType | null
    _avg: PersonalAvgAggregateOutputType | null
    _sum: PersonalSumAggregateOutputType | null
    _min: PersonalMinAggregateOutputType | null
    _max: PersonalMaxAggregateOutputType | null
  }

  type GetPersonalGroupByPayload<T extends PersonalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PersonalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PersonalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PersonalGroupByOutputType[P]>
            : GetScalarType<T[P], PersonalGroupByOutputType[P]>
        }
      >
    >


  export type PersonalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    carnet?: boolean
    nombres?: boolean
    apellidos?: boolean
    sexo?: boolean
    cargo?: boolean
    jornada?: boolean
    grado_guia?: boolean
    estado?: boolean
    foto_path?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
    curso?: boolean
    asistencias?: boolean | Personal$asistenciasArgs<ExtArgs>
    codigos_qr?: boolean | Personal$codigos_qrArgs<ExtArgs>
    excusas?: boolean | Personal$excusasArgs<ExtArgs>
    _count?: boolean | PersonalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["personal"]>

  export type PersonalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    carnet?: boolean
    nombres?: boolean
    apellidos?: boolean
    sexo?: boolean
    cargo?: boolean
    jornada?: boolean
    grado_guia?: boolean
    estado?: boolean
    foto_path?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
    curso?: boolean
  }, ExtArgs["result"]["personal"]>

  export type PersonalSelectScalar = {
    id?: boolean
    carnet?: boolean
    nombres?: boolean
    apellidos?: boolean
    sexo?: boolean
    cargo?: boolean
    jornada?: boolean
    grado_guia?: boolean
    estado?: boolean
    foto_path?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
    curso?: boolean
  }

  export type PersonalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asistencias?: boolean | Personal$asistenciasArgs<ExtArgs>
    codigos_qr?: boolean | Personal$codigos_qrArgs<ExtArgs>
    excusas?: boolean | Personal$excusasArgs<ExtArgs>
    _count?: boolean | PersonalCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PersonalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PersonalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Personal"
    objects: {
      asistencias: Prisma.$AsistenciaPayload<ExtArgs>[]
      codigos_qr: Prisma.$CodigoQrPayload<ExtArgs>[]
      excusas: Prisma.$ExcusaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      carnet: string
      nombres: string
      apellidos: string
      sexo: string | null
      cargo: string | null
      jornada: string | null
      grado_guia: string | null
      estado: string
      foto_path: string | null
      creado_en: Date
      actualizado_en: Date
      curso: string | null
    }, ExtArgs["result"]["personal"]>
    composites: {}
  }

  type PersonalGetPayload<S extends boolean | null | undefined | PersonalDefaultArgs> = $Result.GetResult<Prisma.$PersonalPayload, S>

  type PersonalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PersonalFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PersonalCountAggregateInputType | true
    }

  export interface PersonalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Personal'], meta: { name: 'Personal' } }
    /**
     * Find zero or one Personal that matches the filter.
     * @param {PersonalFindUniqueArgs} args - Arguments to find a Personal
     * @example
     * // Get one Personal
     * const personal = await prisma.personal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PersonalFindUniqueArgs>(args: SelectSubset<T, PersonalFindUniqueArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Personal that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PersonalFindUniqueOrThrowArgs} args - Arguments to find a Personal
     * @example
     * // Get one Personal
     * const personal = await prisma.personal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PersonalFindUniqueOrThrowArgs>(args: SelectSubset<T, PersonalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Personal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalFindFirstArgs} args - Arguments to find a Personal
     * @example
     * // Get one Personal
     * const personal = await prisma.personal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PersonalFindFirstArgs>(args?: SelectSubset<T, PersonalFindFirstArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Personal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalFindFirstOrThrowArgs} args - Arguments to find a Personal
     * @example
     * // Get one Personal
     * const personal = await prisma.personal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PersonalFindFirstOrThrowArgs>(args?: SelectSubset<T, PersonalFindFirstOrThrowArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Personals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Personals
     * const personals = await prisma.personal.findMany()
     * 
     * // Get first 10 Personals
     * const personals = await prisma.personal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const personalWithIdOnly = await prisma.personal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PersonalFindManyArgs>(args?: SelectSubset<T, PersonalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Personal.
     * @param {PersonalCreateArgs} args - Arguments to create a Personal.
     * @example
     * // Create one Personal
     * const Personal = await prisma.personal.create({
     *   data: {
     *     // ... data to create a Personal
     *   }
     * })
     * 
     */
    create<T extends PersonalCreateArgs>(args: SelectSubset<T, PersonalCreateArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Personals.
     * @param {PersonalCreateManyArgs} args - Arguments to create many Personals.
     * @example
     * // Create many Personals
     * const personal = await prisma.personal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PersonalCreateManyArgs>(args?: SelectSubset<T, PersonalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Personals and returns the data saved in the database.
     * @param {PersonalCreateManyAndReturnArgs} args - Arguments to create many Personals.
     * @example
     * // Create many Personals
     * const personal = await prisma.personal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Personals and only return the `id`
     * const personalWithIdOnly = await prisma.personal.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PersonalCreateManyAndReturnArgs>(args?: SelectSubset<T, PersonalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Personal.
     * @param {PersonalDeleteArgs} args - Arguments to delete one Personal.
     * @example
     * // Delete one Personal
     * const Personal = await prisma.personal.delete({
     *   where: {
     *     // ... filter to delete one Personal
     *   }
     * })
     * 
     */
    delete<T extends PersonalDeleteArgs>(args: SelectSubset<T, PersonalDeleteArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Personal.
     * @param {PersonalUpdateArgs} args - Arguments to update one Personal.
     * @example
     * // Update one Personal
     * const personal = await prisma.personal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PersonalUpdateArgs>(args: SelectSubset<T, PersonalUpdateArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Personals.
     * @param {PersonalDeleteManyArgs} args - Arguments to filter Personals to delete.
     * @example
     * // Delete a few Personals
     * const { count } = await prisma.personal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PersonalDeleteManyArgs>(args?: SelectSubset<T, PersonalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Personals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Personals
     * const personal = await prisma.personal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PersonalUpdateManyArgs>(args: SelectSubset<T, PersonalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Personal.
     * @param {PersonalUpsertArgs} args - Arguments to update or create a Personal.
     * @example
     * // Update or create a Personal
     * const personal = await prisma.personal.upsert({
     *   create: {
     *     // ... data to create a Personal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Personal we want to update
     *   }
     * })
     */
    upsert<T extends PersonalUpsertArgs>(args: SelectSubset<T, PersonalUpsertArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Personals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalCountArgs} args - Arguments to filter Personals to count.
     * @example
     * // Count the number of Personals
     * const count = await prisma.personal.count({
     *   where: {
     *     // ... the filter for the Personals we want to count
     *   }
     * })
    **/
    count<T extends PersonalCountArgs>(
      args?: Subset<T, PersonalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PersonalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Personal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PersonalAggregateArgs>(args: Subset<T, PersonalAggregateArgs>): Prisma.PrismaPromise<GetPersonalAggregateType<T>>

    /**
     * Group by Personal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersonalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PersonalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PersonalGroupByArgs['orderBy'] }
        : { orderBy?: PersonalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PersonalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPersonalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Personal model
   */
  readonly fields: PersonalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Personal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PersonalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    asistencias<T extends Personal$asistenciasArgs<ExtArgs> = {}>(args?: Subset<T, Personal$asistenciasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findMany"> | Null>
    codigos_qr<T extends Personal$codigos_qrArgs<ExtArgs> = {}>(args?: Subset<T, Personal$codigos_qrArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "findMany"> | Null>
    excusas<T extends Personal$excusasArgs<ExtArgs> = {}>(args?: Subset<T, Personal$excusasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Personal model
   */ 
  interface PersonalFieldRefs {
    readonly id: FieldRef<"Personal", 'Int'>
    readonly carnet: FieldRef<"Personal", 'String'>
    readonly nombres: FieldRef<"Personal", 'String'>
    readonly apellidos: FieldRef<"Personal", 'String'>
    readonly sexo: FieldRef<"Personal", 'String'>
    readonly cargo: FieldRef<"Personal", 'String'>
    readonly jornada: FieldRef<"Personal", 'String'>
    readonly grado_guia: FieldRef<"Personal", 'String'>
    readonly estado: FieldRef<"Personal", 'String'>
    readonly foto_path: FieldRef<"Personal", 'String'>
    readonly creado_en: FieldRef<"Personal", 'DateTime'>
    readonly actualizado_en: FieldRef<"Personal", 'DateTime'>
    readonly curso: FieldRef<"Personal", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Personal findUnique
   */
  export type PersonalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    /**
     * Filter, which Personal to fetch.
     */
    where: PersonalWhereUniqueInput
  }

  /**
   * Personal findUniqueOrThrow
   */
  export type PersonalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    /**
     * Filter, which Personal to fetch.
     */
    where: PersonalWhereUniqueInput
  }

  /**
   * Personal findFirst
   */
  export type PersonalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    /**
     * Filter, which Personal to fetch.
     */
    where?: PersonalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personals to fetch.
     */
    orderBy?: PersonalOrderByWithRelationInput | PersonalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Personals.
     */
    cursor?: PersonalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Personals.
     */
    distinct?: PersonalScalarFieldEnum | PersonalScalarFieldEnum[]
  }

  /**
   * Personal findFirstOrThrow
   */
  export type PersonalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    /**
     * Filter, which Personal to fetch.
     */
    where?: PersonalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personals to fetch.
     */
    orderBy?: PersonalOrderByWithRelationInput | PersonalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Personals.
     */
    cursor?: PersonalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Personals.
     */
    distinct?: PersonalScalarFieldEnum | PersonalScalarFieldEnum[]
  }

  /**
   * Personal findMany
   */
  export type PersonalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    /**
     * Filter, which Personals to fetch.
     */
    where?: PersonalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Personals to fetch.
     */
    orderBy?: PersonalOrderByWithRelationInput | PersonalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Personals.
     */
    cursor?: PersonalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Personals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Personals.
     */
    skip?: number
    distinct?: PersonalScalarFieldEnum | PersonalScalarFieldEnum[]
  }

  /**
   * Personal create
   */
  export type PersonalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    /**
     * The data needed to create a Personal.
     */
    data: XOR<PersonalCreateInput, PersonalUncheckedCreateInput>
  }

  /**
   * Personal createMany
   */
  export type PersonalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Personals.
     */
    data: PersonalCreateManyInput | PersonalCreateManyInput[]
  }

  /**
   * Personal createManyAndReturn
   */
  export type PersonalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Personals.
     */
    data: PersonalCreateManyInput | PersonalCreateManyInput[]
  }

  /**
   * Personal update
   */
  export type PersonalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    /**
     * The data needed to update a Personal.
     */
    data: XOR<PersonalUpdateInput, PersonalUncheckedUpdateInput>
    /**
     * Choose, which Personal to update.
     */
    where: PersonalWhereUniqueInput
  }

  /**
   * Personal updateMany
   */
  export type PersonalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Personals.
     */
    data: XOR<PersonalUpdateManyMutationInput, PersonalUncheckedUpdateManyInput>
    /**
     * Filter which Personals to update
     */
    where?: PersonalWhereInput
  }

  /**
   * Personal upsert
   */
  export type PersonalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    /**
     * The filter to search for the Personal to update in case it exists.
     */
    where: PersonalWhereUniqueInput
    /**
     * In case the Personal found by the `where` argument doesn't exist, create a new Personal with this data.
     */
    create: XOR<PersonalCreateInput, PersonalUncheckedCreateInput>
    /**
     * In case the Personal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PersonalUpdateInput, PersonalUncheckedUpdateInput>
  }

  /**
   * Personal delete
   */
  export type PersonalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    /**
     * Filter which Personal to delete.
     */
    where: PersonalWhereUniqueInput
  }

  /**
   * Personal deleteMany
   */
  export type PersonalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Personals to delete
     */
    where?: PersonalWhereInput
  }

  /**
   * Personal.asistencias
   */
  export type Personal$asistenciasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    where?: AsistenciaWhereInput
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    cursor?: AsistenciaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AsistenciaScalarFieldEnum | AsistenciaScalarFieldEnum[]
  }

  /**
   * Personal.codigos_qr
   */
  export type Personal$codigos_qrArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    where?: CodigoQrWhereInput
    orderBy?: CodigoQrOrderByWithRelationInput | CodigoQrOrderByWithRelationInput[]
    cursor?: CodigoQrWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CodigoQrScalarFieldEnum | CodigoQrScalarFieldEnum[]
  }

  /**
   * Personal.excusas
   */
  export type Personal$excusasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    where?: ExcusaWhereInput
    orderBy?: ExcusaOrderByWithRelationInput | ExcusaOrderByWithRelationInput[]
    cursor?: ExcusaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExcusaScalarFieldEnum | ExcusaScalarFieldEnum[]
  }

  /**
   * Personal without action
   */
  export type PersonalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
  }


  /**
   * Model CodigoQr
   */

  export type AggregateCodigoQr = {
    _count: CodigoQrCountAggregateOutputType | null
    _avg: CodigoQrAvgAggregateOutputType | null
    _sum: CodigoQrSumAggregateOutputType | null
    _min: CodigoQrMinAggregateOutputType | null
    _max: CodigoQrMaxAggregateOutputType | null
  }

  export type CodigoQrAvgAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    personal_id: number | null
  }

  export type CodigoQrSumAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    personal_id: number | null
  }

  export type CodigoQrMinAggregateOutputType = {
    id: number | null
    persona_tipo: string | null
    alumno_id: number | null
    personal_id: number | null
    token: string | null
    png_path: string | null
    vigente: boolean | null
    generado_en: Date | null
    regenerado_en: Date | null
  }

  export type CodigoQrMaxAggregateOutputType = {
    id: number | null
    persona_tipo: string | null
    alumno_id: number | null
    personal_id: number | null
    token: string | null
    png_path: string | null
    vigente: boolean | null
    generado_en: Date | null
    regenerado_en: Date | null
  }

  export type CodigoQrCountAggregateOutputType = {
    id: number
    persona_tipo: number
    alumno_id: number
    personal_id: number
    token: number
    png_path: number
    vigente: number
    generado_en: number
    regenerado_en: number
    _all: number
  }


  export type CodigoQrAvgAggregateInputType = {
    id?: true
    alumno_id?: true
    personal_id?: true
  }

  export type CodigoQrSumAggregateInputType = {
    id?: true
    alumno_id?: true
    personal_id?: true
  }

  export type CodigoQrMinAggregateInputType = {
    id?: true
    persona_tipo?: true
    alumno_id?: true
    personal_id?: true
    token?: true
    png_path?: true
    vigente?: true
    generado_en?: true
    regenerado_en?: true
  }

  export type CodigoQrMaxAggregateInputType = {
    id?: true
    persona_tipo?: true
    alumno_id?: true
    personal_id?: true
    token?: true
    png_path?: true
    vigente?: true
    generado_en?: true
    regenerado_en?: true
  }

  export type CodigoQrCountAggregateInputType = {
    id?: true
    persona_tipo?: true
    alumno_id?: true
    personal_id?: true
    token?: true
    png_path?: true
    vigente?: true
    generado_en?: true
    regenerado_en?: true
    _all?: true
  }

  export type CodigoQrAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CodigoQr to aggregate.
     */
    where?: CodigoQrWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodigoQrs to fetch.
     */
    orderBy?: CodigoQrOrderByWithRelationInput | CodigoQrOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CodigoQrWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodigoQrs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodigoQrs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CodigoQrs
    **/
    _count?: true | CodigoQrCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CodigoQrAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CodigoQrSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CodigoQrMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CodigoQrMaxAggregateInputType
  }

  export type GetCodigoQrAggregateType<T extends CodigoQrAggregateArgs> = {
        [P in keyof T & keyof AggregateCodigoQr]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCodigoQr[P]>
      : GetScalarType<T[P], AggregateCodigoQr[P]>
  }




  export type CodigoQrGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CodigoQrWhereInput
    orderBy?: CodigoQrOrderByWithAggregationInput | CodigoQrOrderByWithAggregationInput[]
    by: CodigoQrScalarFieldEnum[] | CodigoQrScalarFieldEnum
    having?: CodigoQrScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CodigoQrCountAggregateInputType | true
    _avg?: CodigoQrAvgAggregateInputType
    _sum?: CodigoQrSumAggregateInputType
    _min?: CodigoQrMinAggregateInputType
    _max?: CodigoQrMaxAggregateInputType
  }

  export type CodigoQrGroupByOutputType = {
    id: number
    persona_tipo: string
    alumno_id: number | null
    personal_id: number | null
    token: string
    png_path: string | null
    vigente: boolean
    generado_en: Date
    regenerado_en: Date | null
    _count: CodigoQrCountAggregateOutputType | null
    _avg: CodigoQrAvgAggregateOutputType | null
    _sum: CodigoQrSumAggregateOutputType | null
    _min: CodigoQrMinAggregateOutputType | null
    _max: CodigoQrMaxAggregateOutputType | null
  }

  type GetCodigoQrGroupByPayload<T extends CodigoQrGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CodigoQrGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CodigoQrGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CodigoQrGroupByOutputType[P]>
            : GetScalarType<T[P], CodigoQrGroupByOutputType[P]>
        }
      >
    >


  export type CodigoQrSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    persona_tipo?: boolean
    alumno_id?: boolean
    personal_id?: boolean
    token?: boolean
    png_path?: boolean
    vigente?: boolean
    generado_en?: boolean
    regenerado_en?: boolean
    personal?: boolean | CodigoQr$personalArgs<ExtArgs>
    alumno?: boolean | CodigoQr$alumnoArgs<ExtArgs>
  }, ExtArgs["result"]["codigoQr"]>

  export type CodigoQrSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    persona_tipo?: boolean
    alumno_id?: boolean
    personal_id?: boolean
    token?: boolean
    png_path?: boolean
    vigente?: boolean
    generado_en?: boolean
    regenerado_en?: boolean
    personal?: boolean | CodigoQr$personalArgs<ExtArgs>
    alumno?: boolean | CodigoQr$alumnoArgs<ExtArgs>
  }, ExtArgs["result"]["codigoQr"]>

  export type CodigoQrSelectScalar = {
    id?: boolean
    persona_tipo?: boolean
    alumno_id?: boolean
    personal_id?: boolean
    token?: boolean
    png_path?: boolean
    vigente?: boolean
    generado_en?: boolean
    regenerado_en?: boolean
  }

  export type CodigoQrInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    personal?: boolean | CodigoQr$personalArgs<ExtArgs>
    alumno?: boolean | CodigoQr$alumnoArgs<ExtArgs>
  }
  export type CodigoQrIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    personal?: boolean | CodigoQr$personalArgs<ExtArgs>
    alumno?: boolean | CodigoQr$alumnoArgs<ExtArgs>
  }

  export type $CodigoQrPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CodigoQr"
    objects: {
      personal: Prisma.$PersonalPayload<ExtArgs> | null
      alumno: Prisma.$AlumnoPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      persona_tipo: string
      alumno_id: number | null
      personal_id: number | null
      token: string
      png_path: string | null
      vigente: boolean
      generado_en: Date
      regenerado_en: Date | null
    }, ExtArgs["result"]["codigoQr"]>
    composites: {}
  }

  type CodigoQrGetPayload<S extends boolean | null | undefined | CodigoQrDefaultArgs> = $Result.GetResult<Prisma.$CodigoQrPayload, S>

  type CodigoQrCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CodigoQrFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CodigoQrCountAggregateInputType | true
    }

  export interface CodigoQrDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CodigoQr'], meta: { name: 'CodigoQr' } }
    /**
     * Find zero or one CodigoQr that matches the filter.
     * @param {CodigoQrFindUniqueArgs} args - Arguments to find a CodigoQr
     * @example
     * // Get one CodigoQr
     * const codigoQr = await prisma.codigoQr.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CodigoQrFindUniqueArgs>(args: SelectSubset<T, CodigoQrFindUniqueArgs<ExtArgs>>): Prisma__CodigoQrClient<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CodigoQr that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CodigoQrFindUniqueOrThrowArgs} args - Arguments to find a CodigoQr
     * @example
     * // Get one CodigoQr
     * const codigoQr = await prisma.codigoQr.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CodigoQrFindUniqueOrThrowArgs>(args: SelectSubset<T, CodigoQrFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CodigoQrClient<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CodigoQr that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoQrFindFirstArgs} args - Arguments to find a CodigoQr
     * @example
     * // Get one CodigoQr
     * const codigoQr = await prisma.codigoQr.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CodigoQrFindFirstArgs>(args?: SelectSubset<T, CodigoQrFindFirstArgs<ExtArgs>>): Prisma__CodigoQrClient<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CodigoQr that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoQrFindFirstOrThrowArgs} args - Arguments to find a CodigoQr
     * @example
     * // Get one CodigoQr
     * const codigoQr = await prisma.codigoQr.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CodigoQrFindFirstOrThrowArgs>(args?: SelectSubset<T, CodigoQrFindFirstOrThrowArgs<ExtArgs>>): Prisma__CodigoQrClient<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CodigoQrs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoQrFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CodigoQrs
     * const codigoQrs = await prisma.codigoQr.findMany()
     * 
     * // Get first 10 CodigoQrs
     * const codigoQrs = await prisma.codigoQr.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const codigoQrWithIdOnly = await prisma.codigoQr.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CodigoQrFindManyArgs>(args?: SelectSubset<T, CodigoQrFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CodigoQr.
     * @param {CodigoQrCreateArgs} args - Arguments to create a CodigoQr.
     * @example
     * // Create one CodigoQr
     * const CodigoQr = await prisma.codigoQr.create({
     *   data: {
     *     // ... data to create a CodigoQr
     *   }
     * })
     * 
     */
    create<T extends CodigoQrCreateArgs>(args: SelectSubset<T, CodigoQrCreateArgs<ExtArgs>>): Prisma__CodigoQrClient<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CodigoQrs.
     * @param {CodigoQrCreateManyArgs} args - Arguments to create many CodigoQrs.
     * @example
     * // Create many CodigoQrs
     * const codigoQr = await prisma.codigoQr.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CodigoQrCreateManyArgs>(args?: SelectSubset<T, CodigoQrCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CodigoQrs and returns the data saved in the database.
     * @param {CodigoQrCreateManyAndReturnArgs} args - Arguments to create many CodigoQrs.
     * @example
     * // Create many CodigoQrs
     * const codigoQr = await prisma.codigoQr.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CodigoQrs and only return the `id`
     * const codigoQrWithIdOnly = await prisma.codigoQr.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CodigoQrCreateManyAndReturnArgs>(args?: SelectSubset<T, CodigoQrCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CodigoQr.
     * @param {CodigoQrDeleteArgs} args - Arguments to delete one CodigoQr.
     * @example
     * // Delete one CodigoQr
     * const CodigoQr = await prisma.codigoQr.delete({
     *   where: {
     *     // ... filter to delete one CodigoQr
     *   }
     * })
     * 
     */
    delete<T extends CodigoQrDeleteArgs>(args: SelectSubset<T, CodigoQrDeleteArgs<ExtArgs>>): Prisma__CodigoQrClient<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CodigoQr.
     * @param {CodigoQrUpdateArgs} args - Arguments to update one CodigoQr.
     * @example
     * // Update one CodigoQr
     * const codigoQr = await prisma.codigoQr.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CodigoQrUpdateArgs>(args: SelectSubset<T, CodigoQrUpdateArgs<ExtArgs>>): Prisma__CodigoQrClient<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CodigoQrs.
     * @param {CodigoQrDeleteManyArgs} args - Arguments to filter CodigoQrs to delete.
     * @example
     * // Delete a few CodigoQrs
     * const { count } = await prisma.codigoQr.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CodigoQrDeleteManyArgs>(args?: SelectSubset<T, CodigoQrDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CodigoQrs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoQrUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CodigoQrs
     * const codigoQr = await prisma.codigoQr.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CodigoQrUpdateManyArgs>(args: SelectSubset<T, CodigoQrUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CodigoQr.
     * @param {CodigoQrUpsertArgs} args - Arguments to update or create a CodigoQr.
     * @example
     * // Update or create a CodigoQr
     * const codigoQr = await prisma.codigoQr.upsert({
     *   create: {
     *     // ... data to create a CodigoQr
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CodigoQr we want to update
     *   }
     * })
     */
    upsert<T extends CodigoQrUpsertArgs>(args: SelectSubset<T, CodigoQrUpsertArgs<ExtArgs>>): Prisma__CodigoQrClient<$Result.GetResult<Prisma.$CodigoQrPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CodigoQrs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoQrCountArgs} args - Arguments to filter CodigoQrs to count.
     * @example
     * // Count the number of CodigoQrs
     * const count = await prisma.codigoQr.count({
     *   where: {
     *     // ... the filter for the CodigoQrs we want to count
     *   }
     * })
    **/
    count<T extends CodigoQrCountArgs>(
      args?: Subset<T, CodigoQrCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CodigoQrCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CodigoQr.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoQrAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CodigoQrAggregateArgs>(args: Subset<T, CodigoQrAggregateArgs>): Prisma.PrismaPromise<GetCodigoQrAggregateType<T>>

    /**
     * Group by CodigoQr.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CodigoQrGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CodigoQrGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CodigoQrGroupByArgs['orderBy'] }
        : { orderBy?: CodigoQrGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CodigoQrGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCodigoQrGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CodigoQr model
   */
  readonly fields: CodigoQrFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CodigoQr.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CodigoQrClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    personal<T extends CodigoQr$personalArgs<ExtArgs> = {}>(args?: Subset<T, CodigoQr$personalArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    alumno<T extends CodigoQr$alumnoArgs<ExtArgs> = {}>(args?: Subset<T, CodigoQr$alumnoArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CodigoQr model
   */ 
  interface CodigoQrFieldRefs {
    readonly id: FieldRef<"CodigoQr", 'Int'>
    readonly persona_tipo: FieldRef<"CodigoQr", 'String'>
    readonly alumno_id: FieldRef<"CodigoQr", 'Int'>
    readonly personal_id: FieldRef<"CodigoQr", 'Int'>
    readonly token: FieldRef<"CodigoQr", 'String'>
    readonly png_path: FieldRef<"CodigoQr", 'String'>
    readonly vigente: FieldRef<"CodigoQr", 'Boolean'>
    readonly generado_en: FieldRef<"CodigoQr", 'DateTime'>
    readonly regenerado_en: FieldRef<"CodigoQr", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CodigoQr findUnique
   */
  export type CodigoQrFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    /**
     * Filter, which CodigoQr to fetch.
     */
    where: CodigoQrWhereUniqueInput
  }

  /**
   * CodigoQr findUniqueOrThrow
   */
  export type CodigoQrFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    /**
     * Filter, which CodigoQr to fetch.
     */
    where: CodigoQrWhereUniqueInput
  }

  /**
   * CodigoQr findFirst
   */
  export type CodigoQrFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    /**
     * Filter, which CodigoQr to fetch.
     */
    where?: CodigoQrWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodigoQrs to fetch.
     */
    orderBy?: CodigoQrOrderByWithRelationInput | CodigoQrOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CodigoQrs.
     */
    cursor?: CodigoQrWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodigoQrs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodigoQrs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CodigoQrs.
     */
    distinct?: CodigoQrScalarFieldEnum | CodigoQrScalarFieldEnum[]
  }

  /**
   * CodigoQr findFirstOrThrow
   */
  export type CodigoQrFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    /**
     * Filter, which CodigoQr to fetch.
     */
    where?: CodigoQrWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodigoQrs to fetch.
     */
    orderBy?: CodigoQrOrderByWithRelationInput | CodigoQrOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CodigoQrs.
     */
    cursor?: CodigoQrWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodigoQrs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodigoQrs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CodigoQrs.
     */
    distinct?: CodigoQrScalarFieldEnum | CodigoQrScalarFieldEnum[]
  }

  /**
   * CodigoQr findMany
   */
  export type CodigoQrFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    /**
     * Filter, which CodigoQrs to fetch.
     */
    where?: CodigoQrWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CodigoQrs to fetch.
     */
    orderBy?: CodigoQrOrderByWithRelationInput | CodigoQrOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CodigoQrs.
     */
    cursor?: CodigoQrWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CodigoQrs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CodigoQrs.
     */
    skip?: number
    distinct?: CodigoQrScalarFieldEnum | CodigoQrScalarFieldEnum[]
  }

  /**
   * CodigoQr create
   */
  export type CodigoQrCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    /**
     * The data needed to create a CodigoQr.
     */
    data: XOR<CodigoQrCreateInput, CodigoQrUncheckedCreateInput>
  }

  /**
   * CodigoQr createMany
   */
  export type CodigoQrCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CodigoQrs.
     */
    data: CodigoQrCreateManyInput | CodigoQrCreateManyInput[]
  }

  /**
   * CodigoQr createManyAndReturn
   */
  export type CodigoQrCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CodigoQrs.
     */
    data: CodigoQrCreateManyInput | CodigoQrCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CodigoQr update
   */
  export type CodigoQrUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    /**
     * The data needed to update a CodigoQr.
     */
    data: XOR<CodigoQrUpdateInput, CodigoQrUncheckedUpdateInput>
    /**
     * Choose, which CodigoQr to update.
     */
    where: CodigoQrWhereUniqueInput
  }

  /**
   * CodigoQr updateMany
   */
  export type CodigoQrUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CodigoQrs.
     */
    data: XOR<CodigoQrUpdateManyMutationInput, CodigoQrUncheckedUpdateManyInput>
    /**
     * Filter which CodigoQrs to update
     */
    where?: CodigoQrWhereInput
  }

  /**
   * CodigoQr upsert
   */
  export type CodigoQrUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    /**
     * The filter to search for the CodigoQr to update in case it exists.
     */
    where: CodigoQrWhereUniqueInput
    /**
     * In case the CodigoQr found by the `where` argument doesn't exist, create a new CodigoQr with this data.
     */
    create: XOR<CodigoQrCreateInput, CodigoQrUncheckedCreateInput>
    /**
     * In case the CodigoQr was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CodigoQrUpdateInput, CodigoQrUncheckedUpdateInput>
  }

  /**
   * CodigoQr delete
   */
  export type CodigoQrDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
    /**
     * Filter which CodigoQr to delete.
     */
    where: CodigoQrWhereUniqueInput
  }

  /**
   * CodigoQr deleteMany
   */
  export type CodigoQrDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CodigoQrs to delete
     */
    where?: CodigoQrWhereInput
  }

  /**
   * CodigoQr.personal
   */
  export type CodigoQr$personalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    where?: PersonalWhereInput
  }

  /**
   * CodigoQr.alumno
   */
  export type CodigoQr$alumnoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    where?: AlumnoWhereInput
  }

  /**
   * CodigoQr without action
   */
  export type CodigoQrDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CodigoQr
     */
    select?: CodigoQrSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CodigoQrInclude<ExtArgs> | null
  }


  /**
   * Model Asistencia
   */

  export type AggregateAsistencia = {
    _count: AsistenciaCountAggregateOutputType | null
    _avg: AsistenciaAvgAggregateOutputType | null
    _sum: AsistenciaSumAggregateOutputType | null
    _min: AsistenciaMinAggregateOutputType | null
    _max: AsistenciaMaxAggregateOutputType | null
  }

  export type AsistenciaAvgAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    personal_id: number | null
  }

  export type AsistenciaSumAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    personal_id: number | null
  }

  export type AsistenciaMinAggregateOutputType = {
    id: number | null
    persona_tipo: string | null
    alumno_id: number | null
    personal_id: number | null
    tipo_evento: string | null
    timestamp: Date | null
    origen: string | null
    dispositivo: string | null
    estado_puntualidad: string | null
    observaciones: string | null
    creado_en: Date | null
  }

  export type AsistenciaMaxAggregateOutputType = {
    id: number | null
    persona_tipo: string | null
    alumno_id: number | null
    personal_id: number | null
    tipo_evento: string | null
    timestamp: Date | null
    origen: string | null
    dispositivo: string | null
    estado_puntualidad: string | null
    observaciones: string | null
    creado_en: Date | null
  }

  export type AsistenciaCountAggregateOutputType = {
    id: number
    persona_tipo: number
    alumno_id: number
    personal_id: number
    tipo_evento: number
    timestamp: number
    origen: number
    dispositivo: number
    estado_puntualidad: number
    observaciones: number
    creado_en: number
    _all: number
  }


  export type AsistenciaAvgAggregateInputType = {
    id?: true
    alumno_id?: true
    personal_id?: true
  }

  export type AsistenciaSumAggregateInputType = {
    id?: true
    alumno_id?: true
    personal_id?: true
  }

  export type AsistenciaMinAggregateInputType = {
    id?: true
    persona_tipo?: true
    alumno_id?: true
    personal_id?: true
    tipo_evento?: true
    timestamp?: true
    origen?: true
    dispositivo?: true
    estado_puntualidad?: true
    observaciones?: true
    creado_en?: true
  }

  export type AsistenciaMaxAggregateInputType = {
    id?: true
    persona_tipo?: true
    alumno_id?: true
    personal_id?: true
    tipo_evento?: true
    timestamp?: true
    origen?: true
    dispositivo?: true
    estado_puntualidad?: true
    observaciones?: true
    creado_en?: true
  }

  export type AsistenciaCountAggregateInputType = {
    id?: true
    persona_tipo?: true
    alumno_id?: true
    personal_id?: true
    tipo_evento?: true
    timestamp?: true
    origen?: true
    dispositivo?: true
    estado_puntualidad?: true
    observaciones?: true
    creado_en?: true
    _all?: true
  }

  export type AsistenciaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asistencia to aggregate.
     */
    where?: AsistenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asistencias to fetch.
     */
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AsistenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asistencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asistencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Asistencias
    **/
    _count?: true | AsistenciaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AsistenciaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AsistenciaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AsistenciaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AsistenciaMaxAggregateInputType
  }

  export type GetAsistenciaAggregateType<T extends AsistenciaAggregateArgs> = {
        [P in keyof T & keyof AggregateAsistencia]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsistencia[P]>
      : GetScalarType<T[P], AggregateAsistencia[P]>
  }




  export type AsistenciaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AsistenciaWhereInput
    orderBy?: AsistenciaOrderByWithAggregationInput | AsistenciaOrderByWithAggregationInput[]
    by: AsistenciaScalarFieldEnum[] | AsistenciaScalarFieldEnum
    having?: AsistenciaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AsistenciaCountAggregateInputType | true
    _avg?: AsistenciaAvgAggregateInputType
    _sum?: AsistenciaSumAggregateInputType
    _min?: AsistenciaMinAggregateInputType
    _max?: AsistenciaMaxAggregateInputType
  }

  export type AsistenciaGroupByOutputType = {
    id: number
    persona_tipo: string
    alumno_id: number | null
    personal_id: number | null
    tipo_evento: string
    timestamp: Date
    origen: string
    dispositivo: string | null
    estado_puntualidad: string | null
    observaciones: string | null
    creado_en: Date
    _count: AsistenciaCountAggregateOutputType | null
    _avg: AsistenciaAvgAggregateOutputType | null
    _sum: AsistenciaSumAggregateOutputType | null
    _min: AsistenciaMinAggregateOutputType | null
    _max: AsistenciaMaxAggregateOutputType | null
  }

  type GetAsistenciaGroupByPayload<T extends AsistenciaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AsistenciaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AsistenciaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AsistenciaGroupByOutputType[P]>
            : GetScalarType<T[P], AsistenciaGroupByOutputType[P]>
        }
      >
    >


  export type AsistenciaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    persona_tipo?: boolean
    alumno_id?: boolean
    personal_id?: boolean
    tipo_evento?: boolean
    timestamp?: boolean
    origen?: boolean
    dispositivo?: boolean
    estado_puntualidad?: boolean
    observaciones?: boolean
    creado_en?: boolean
    personal?: boolean | Asistencia$personalArgs<ExtArgs>
    alumno?: boolean | Asistencia$alumnoArgs<ExtArgs>
  }, ExtArgs["result"]["asistencia"]>

  export type AsistenciaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    persona_tipo?: boolean
    alumno_id?: boolean
    personal_id?: boolean
    tipo_evento?: boolean
    timestamp?: boolean
    origen?: boolean
    dispositivo?: boolean
    estado_puntualidad?: boolean
    observaciones?: boolean
    creado_en?: boolean
    personal?: boolean | Asistencia$personalArgs<ExtArgs>
    alumno?: boolean | Asistencia$alumnoArgs<ExtArgs>
  }, ExtArgs["result"]["asistencia"]>

  export type AsistenciaSelectScalar = {
    id?: boolean
    persona_tipo?: boolean
    alumno_id?: boolean
    personal_id?: boolean
    tipo_evento?: boolean
    timestamp?: boolean
    origen?: boolean
    dispositivo?: boolean
    estado_puntualidad?: boolean
    observaciones?: boolean
    creado_en?: boolean
  }

  export type AsistenciaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    personal?: boolean | Asistencia$personalArgs<ExtArgs>
    alumno?: boolean | Asistencia$alumnoArgs<ExtArgs>
  }
  export type AsistenciaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    personal?: boolean | Asistencia$personalArgs<ExtArgs>
    alumno?: boolean | Asistencia$alumnoArgs<ExtArgs>
  }

  export type $AsistenciaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Asistencia"
    objects: {
      personal: Prisma.$PersonalPayload<ExtArgs> | null
      alumno: Prisma.$AlumnoPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      persona_tipo: string
      alumno_id: number | null
      personal_id: number | null
      tipo_evento: string
      timestamp: Date
      origen: string
      dispositivo: string | null
      estado_puntualidad: string | null
      observaciones: string | null
      creado_en: Date
    }, ExtArgs["result"]["asistencia"]>
    composites: {}
  }

  type AsistenciaGetPayload<S extends boolean | null | undefined | AsistenciaDefaultArgs> = $Result.GetResult<Prisma.$AsistenciaPayload, S>

  type AsistenciaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AsistenciaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AsistenciaCountAggregateInputType | true
    }

  export interface AsistenciaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Asistencia'], meta: { name: 'Asistencia' } }
    /**
     * Find zero or one Asistencia that matches the filter.
     * @param {AsistenciaFindUniqueArgs} args - Arguments to find a Asistencia
     * @example
     * // Get one Asistencia
     * const asistencia = await prisma.asistencia.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AsistenciaFindUniqueArgs>(args: SelectSubset<T, AsistenciaFindUniqueArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Asistencia that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AsistenciaFindUniqueOrThrowArgs} args - Arguments to find a Asistencia
     * @example
     * // Get one Asistencia
     * const asistencia = await prisma.asistencia.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AsistenciaFindUniqueOrThrowArgs>(args: SelectSubset<T, AsistenciaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Asistencia that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaFindFirstArgs} args - Arguments to find a Asistencia
     * @example
     * // Get one Asistencia
     * const asistencia = await prisma.asistencia.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AsistenciaFindFirstArgs>(args?: SelectSubset<T, AsistenciaFindFirstArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Asistencia that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaFindFirstOrThrowArgs} args - Arguments to find a Asistencia
     * @example
     * // Get one Asistencia
     * const asistencia = await prisma.asistencia.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AsistenciaFindFirstOrThrowArgs>(args?: SelectSubset<T, AsistenciaFindFirstOrThrowArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Asistencias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Asistencias
     * const asistencias = await prisma.asistencia.findMany()
     * 
     * // Get first 10 Asistencias
     * const asistencias = await prisma.asistencia.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const asistenciaWithIdOnly = await prisma.asistencia.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AsistenciaFindManyArgs>(args?: SelectSubset<T, AsistenciaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Asistencia.
     * @param {AsistenciaCreateArgs} args - Arguments to create a Asistencia.
     * @example
     * // Create one Asistencia
     * const Asistencia = await prisma.asistencia.create({
     *   data: {
     *     // ... data to create a Asistencia
     *   }
     * })
     * 
     */
    create<T extends AsistenciaCreateArgs>(args: SelectSubset<T, AsistenciaCreateArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Asistencias.
     * @param {AsistenciaCreateManyArgs} args - Arguments to create many Asistencias.
     * @example
     * // Create many Asistencias
     * const asistencia = await prisma.asistencia.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AsistenciaCreateManyArgs>(args?: SelectSubset<T, AsistenciaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Asistencias and returns the data saved in the database.
     * @param {AsistenciaCreateManyAndReturnArgs} args - Arguments to create many Asistencias.
     * @example
     * // Create many Asistencias
     * const asistencia = await prisma.asistencia.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Asistencias and only return the `id`
     * const asistenciaWithIdOnly = await prisma.asistencia.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AsistenciaCreateManyAndReturnArgs>(args?: SelectSubset<T, AsistenciaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Asistencia.
     * @param {AsistenciaDeleteArgs} args - Arguments to delete one Asistencia.
     * @example
     * // Delete one Asistencia
     * const Asistencia = await prisma.asistencia.delete({
     *   where: {
     *     // ... filter to delete one Asistencia
     *   }
     * })
     * 
     */
    delete<T extends AsistenciaDeleteArgs>(args: SelectSubset<T, AsistenciaDeleteArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Asistencia.
     * @param {AsistenciaUpdateArgs} args - Arguments to update one Asistencia.
     * @example
     * // Update one Asistencia
     * const asistencia = await prisma.asistencia.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AsistenciaUpdateArgs>(args: SelectSubset<T, AsistenciaUpdateArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Asistencias.
     * @param {AsistenciaDeleteManyArgs} args - Arguments to filter Asistencias to delete.
     * @example
     * // Delete a few Asistencias
     * const { count } = await prisma.asistencia.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AsistenciaDeleteManyArgs>(args?: SelectSubset<T, AsistenciaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Asistencias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Asistencias
     * const asistencia = await prisma.asistencia.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AsistenciaUpdateManyArgs>(args: SelectSubset<T, AsistenciaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Asistencia.
     * @param {AsistenciaUpsertArgs} args - Arguments to update or create a Asistencia.
     * @example
     * // Update or create a Asistencia
     * const asistencia = await prisma.asistencia.upsert({
     *   create: {
     *     // ... data to create a Asistencia
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asistencia we want to update
     *   }
     * })
     */
    upsert<T extends AsistenciaUpsertArgs>(args: SelectSubset<T, AsistenciaUpsertArgs<ExtArgs>>): Prisma__AsistenciaClient<$Result.GetResult<Prisma.$AsistenciaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Asistencias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaCountArgs} args - Arguments to filter Asistencias to count.
     * @example
     * // Count the number of Asistencias
     * const count = await prisma.asistencia.count({
     *   where: {
     *     // ... the filter for the Asistencias we want to count
     *   }
     * })
    **/
    count<T extends AsistenciaCountArgs>(
      args?: Subset<T, AsistenciaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AsistenciaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Asistencia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AsistenciaAggregateArgs>(args: Subset<T, AsistenciaAggregateArgs>): Prisma.PrismaPromise<GetAsistenciaAggregateType<T>>

    /**
     * Group by Asistencia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AsistenciaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AsistenciaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AsistenciaGroupByArgs['orderBy'] }
        : { orderBy?: AsistenciaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AsistenciaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAsistenciaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Asistencia model
   */
  readonly fields: AsistenciaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asistencia.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AsistenciaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    personal<T extends Asistencia$personalArgs<ExtArgs> = {}>(args?: Subset<T, Asistencia$personalArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    alumno<T extends Asistencia$alumnoArgs<ExtArgs> = {}>(args?: Subset<T, Asistencia$alumnoArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Asistencia model
   */ 
  interface AsistenciaFieldRefs {
    readonly id: FieldRef<"Asistencia", 'Int'>
    readonly persona_tipo: FieldRef<"Asistencia", 'String'>
    readonly alumno_id: FieldRef<"Asistencia", 'Int'>
    readonly personal_id: FieldRef<"Asistencia", 'Int'>
    readonly tipo_evento: FieldRef<"Asistencia", 'String'>
    readonly timestamp: FieldRef<"Asistencia", 'DateTime'>
    readonly origen: FieldRef<"Asistencia", 'String'>
    readonly dispositivo: FieldRef<"Asistencia", 'String'>
    readonly estado_puntualidad: FieldRef<"Asistencia", 'String'>
    readonly observaciones: FieldRef<"Asistencia", 'String'>
    readonly creado_en: FieldRef<"Asistencia", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Asistencia findUnique
   */
  export type AsistenciaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencia to fetch.
     */
    where: AsistenciaWhereUniqueInput
  }

  /**
   * Asistencia findUniqueOrThrow
   */
  export type AsistenciaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencia to fetch.
     */
    where: AsistenciaWhereUniqueInput
  }

  /**
   * Asistencia findFirst
   */
  export type AsistenciaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencia to fetch.
     */
    where?: AsistenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asistencias to fetch.
     */
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Asistencias.
     */
    cursor?: AsistenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asistencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asistencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Asistencias.
     */
    distinct?: AsistenciaScalarFieldEnum | AsistenciaScalarFieldEnum[]
  }

  /**
   * Asistencia findFirstOrThrow
   */
  export type AsistenciaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencia to fetch.
     */
    where?: AsistenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asistencias to fetch.
     */
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Asistencias.
     */
    cursor?: AsistenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asistencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asistencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Asistencias.
     */
    distinct?: AsistenciaScalarFieldEnum | AsistenciaScalarFieldEnum[]
  }

  /**
   * Asistencia findMany
   */
  export type AsistenciaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter, which Asistencias to fetch.
     */
    where?: AsistenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Asistencias to fetch.
     */
    orderBy?: AsistenciaOrderByWithRelationInput | AsistenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Asistencias.
     */
    cursor?: AsistenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Asistencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Asistencias.
     */
    skip?: number
    distinct?: AsistenciaScalarFieldEnum | AsistenciaScalarFieldEnum[]
  }

  /**
   * Asistencia create
   */
  export type AsistenciaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * The data needed to create a Asistencia.
     */
    data: XOR<AsistenciaCreateInput, AsistenciaUncheckedCreateInput>
  }

  /**
   * Asistencia createMany
   */
  export type AsistenciaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Asistencias.
     */
    data: AsistenciaCreateManyInput | AsistenciaCreateManyInput[]
  }

  /**
   * Asistencia createManyAndReturn
   */
  export type AsistenciaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Asistencias.
     */
    data: AsistenciaCreateManyInput | AsistenciaCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asistencia update
   */
  export type AsistenciaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * The data needed to update a Asistencia.
     */
    data: XOR<AsistenciaUpdateInput, AsistenciaUncheckedUpdateInput>
    /**
     * Choose, which Asistencia to update.
     */
    where: AsistenciaWhereUniqueInput
  }

  /**
   * Asistencia updateMany
   */
  export type AsistenciaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Asistencias.
     */
    data: XOR<AsistenciaUpdateManyMutationInput, AsistenciaUncheckedUpdateManyInput>
    /**
     * Filter which Asistencias to update
     */
    where?: AsistenciaWhereInput
  }

  /**
   * Asistencia upsert
   */
  export type AsistenciaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * The filter to search for the Asistencia to update in case it exists.
     */
    where: AsistenciaWhereUniqueInput
    /**
     * In case the Asistencia found by the `where` argument doesn't exist, create a new Asistencia with this data.
     */
    create: XOR<AsistenciaCreateInput, AsistenciaUncheckedCreateInput>
    /**
     * In case the Asistencia was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AsistenciaUpdateInput, AsistenciaUncheckedUpdateInput>
  }

  /**
   * Asistencia delete
   */
  export type AsistenciaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
    /**
     * Filter which Asistencia to delete.
     */
    where: AsistenciaWhereUniqueInput
  }

  /**
   * Asistencia deleteMany
   */
  export type AsistenciaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asistencias to delete
     */
    where?: AsistenciaWhereInput
  }

  /**
   * Asistencia.personal
   */
  export type Asistencia$personalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    where?: PersonalWhereInput
  }

  /**
   * Asistencia.alumno
   */
  export type Asistencia$alumnoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    where?: AlumnoWhereInput
  }

  /**
   * Asistencia without action
   */
  export type AsistenciaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asistencia
     */
    select?: AsistenciaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AsistenciaInclude<ExtArgs> | null
  }


  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioAvgAggregateOutputType = {
    id: number | null
  }

  export type UsuarioSumAggregateOutputType = {
    id: number | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: number | null
    email: string | null
    nombres: string | null
    apellidos: string | null
    foto_path: string | null
    cargo: string | null
    jornada: string | null
    rol: string | null
    hash_pass: string | null
    activo: boolean | null
    creado_en: Date | null
    actualizado_en: Date | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: number | null
    email: string | null
    nombres: string | null
    apellidos: string | null
    foto_path: string | null
    cargo: string | null
    jornada: string | null
    rol: string | null
    hash_pass: string | null
    activo: boolean | null
    creado_en: Date | null
    actualizado_en: Date | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    email: number
    nombres: number
    apellidos: number
    foto_path: number
    cargo: number
    jornada: number
    rol: number
    hash_pass: number
    activo: number
    creado_en: number
    actualizado_en: number
    _all: number
  }


  export type UsuarioAvgAggregateInputType = {
    id?: true
  }

  export type UsuarioSumAggregateInputType = {
    id?: true
  }

  export type UsuarioMinAggregateInputType = {
    id?: true
    email?: true
    nombres?: true
    apellidos?: true
    foto_path?: true
    cargo?: true
    jornada?: true
    rol?: true
    hash_pass?: true
    activo?: true
    creado_en?: true
    actualizado_en?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    email?: true
    nombres?: true
    apellidos?: true
    foto_path?: true
    cargo?: true
    jornada?: true
    rol?: true
    hash_pass?: true
    activo?: true
    creado_en?: true
    actualizado_en?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    email?: true
    nombres?: true
    apellidos?: true
    foto_path?: true
    cargo?: true
    jornada?: true
    rol?: true
    hash_pass?: true
    activo?: true
    creado_en?: true
    actualizado_en?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _avg?: UsuarioAvgAggregateInputType
    _sum?: UsuarioSumAggregateInputType
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: number
    email: string
    nombres: string | null
    apellidos: string | null
    foto_path: string | null
    cargo: string | null
    jornada: string | null
    rol: string
    hash_pass: string
    activo: boolean
    creado_en: Date
    actualizado_en: Date
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    nombres?: boolean
    apellidos?: boolean
    foto_path?: boolean
    cargo?: boolean
    jornada?: boolean
    rol?: boolean
    hash_pass?: boolean
    activo?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
    auditorias?: boolean | Usuario$auditoriasArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    nombres?: boolean
    apellidos?: boolean
    foto_path?: boolean
    cargo?: boolean
    jornada?: boolean
    rol?: boolean
    hash_pass?: boolean
    activo?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    id?: boolean
    email?: boolean
    nombres?: boolean
    apellidos?: boolean
    foto_path?: boolean
    cargo?: boolean
    jornada?: boolean
    rol?: boolean
    hash_pass?: boolean
    activo?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
  }

  export type UsuarioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditorias?: boolean | Usuario$auditoriasArgs<ExtArgs>
    _count?: boolean | UsuarioCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {
      auditorias: Prisma.$AuditoriaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      nombres: string | null
      apellidos: string | null
      foto_path: string | null
      cargo: string | null
      jornada: string | null
      rol: string
      hash_pass: string
      activo: boolean
      creado_en: Date
      actualizado_en: Date
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auditorias<T extends Usuario$auditoriasArgs<ExtArgs> = {}>(args?: Subset<T, Usuario$auditoriasArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */ 
  interface UsuarioFieldRefs {
    readonly id: FieldRef<"Usuario", 'Int'>
    readonly email: FieldRef<"Usuario", 'String'>
    readonly nombres: FieldRef<"Usuario", 'String'>
    readonly apellidos: FieldRef<"Usuario", 'String'>
    readonly foto_path: FieldRef<"Usuario", 'String'>
    readonly cargo: FieldRef<"Usuario", 'String'>
    readonly jornada: FieldRef<"Usuario", 'String'>
    readonly rol: FieldRef<"Usuario", 'String'>
    readonly hash_pass: FieldRef<"Usuario", 'String'>
    readonly activo: FieldRef<"Usuario", 'Boolean'>
    readonly creado_en: FieldRef<"Usuario", 'DateTime'>
    readonly actualizado_en: FieldRef<"Usuario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
  }

  /**
   * Usuario.auditorias
   */
  export type Usuario$auditoriasArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    where?: AuditoriaWhereInput
    orderBy?: AuditoriaOrderByWithRelationInput | AuditoriaOrderByWithRelationInput[]
    cursor?: AuditoriaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditoriaScalarFieldEnum | AuditoriaScalarFieldEnum[]
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
  }


  /**
   * Model Auditoria
   */

  export type AggregateAuditoria = {
    _count: AuditoriaCountAggregateOutputType | null
    _avg: AuditoriaAvgAggregateOutputType | null
    _sum: AuditoriaSumAggregateOutputType | null
    _min: AuditoriaMinAggregateOutputType | null
    _max: AuditoriaMaxAggregateOutputType | null
  }

  export type AuditoriaAvgAggregateOutputType = {
    id: number | null
    entidad_id: number | null
    usuario_id: number | null
  }

  export type AuditoriaSumAggregateOutputType = {
    id: number | null
    entidad_id: number | null
    usuario_id: number | null
  }

  export type AuditoriaMinAggregateOutputType = {
    id: number | null
    entidad: string | null
    entidad_id: number | null
    usuario_id: number | null
    accion: string | null
    detalle: string | null
    timestamp: Date | null
  }

  export type AuditoriaMaxAggregateOutputType = {
    id: number | null
    entidad: string | null
    entidad_id: number | null
    usuario_id: number | null
    accion: string | null
    detalle: string | null
    timestamp: Date | null
  }

  export type AuditoriaCountAggregateOutputType = {
    id: number
    entidad: number
    entidad_id: number
    usuario_id: number
    accion: number
    detalle: number
    timestamp: number
    _all: number
  }


  export type AuditoriaAvgAggregateInputType = {
    id?: true
    entidad_id?: true
    usuario_id?: true
  }

  export type AuditoriaSumAggregateInputType = {
    id?: true
    entidad_id?: true
    usuario_id?: true
  }

  export type AuditoriaMinAggregateInputType = {
    id?: true
    entidad?: true
    entidad_id?: true
    usuario_id?: true
    accion?: true
    detalle?: true
    timestamp?: true
  }

  export type AuditoriaMaxAggregateInputType = {
    id?: true
    entidad?: true
    entidad_id?: true
    usuario_id?: true
    accion?: true
    detalle?: true
    timestamp?: true
  }

  export type AuditoriaCountAggregateInputType = {
    id?: true
    entidad?: true
    entidad_id?: true
    usuario_id?: true
    accion?: true
    detalle?: true
    timestamp?: true
    _all?: true
  }

  export type AuditoriaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auditoria to aggregate.
     */
    where?: AuditoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auditorias to fetch.
     */
    orderBy?: AuditoriaOrderByWithRelationInput | AuditoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auditorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auditorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Auditorias
    **/
    _count?: true | AuditoriaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditoriaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditoriaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditoriaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditoriaMaxAggregateInputType
  }

  export type GetAuditoriaAggregateType<T extends AuditoriaAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditoria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditoria[P]>
      : GetScalarType<T[P], AggregateAuditoria[P]>
  }




  export type AuditoriaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditoriaWhereInput
    orderBy?: AuditoriaOrderByWithAggregationInput | AuditoriaOrderByWithAggregationInput[]
    by: AuditoriaScalarFieldEnum[] | AuditoriaScalarFieldEnum
    having?: AuditoriaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditoriaCountAggregateInputType | true
    _avg?: AuditoriaAvgAggregateInputType
    _sum?: AuditoriaSumAggregateInputType
    _min?: AuditoriaMinAggregateInputType
    _max?: AuditoriaMaxAggregateInputType
  }

  export type AuditoriaGroupByOutputType = {
    id: number
    entidad: string
    entidad_id: number | null
    usuario_id: number | null
    accion: string
    detalle: string | null
    timestamp: Date
    _count: AuditoriaCountAggregateOutputType | null
    _avg: AuditoriaAvgAggregateOutputType | null
    _sum: AuditoriaSumAggregateOutputType | null
    _min: AuditoriaMinAggregateOutputType | null
    _max: AuditoriaMaxAggregateOutputType | null
  }

  type GetAuditoriaGroupByPayload<T extends AuditoriaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditoriaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditoriaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditoriaGroupByOutputType[P]>
            : GetScalarType<T[P], AuditoriaGroupByOutputType[P]>
        }
      >
    >


  export type AuditoriaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entidad?: boolean
    entidad_id?: boolean
    usuario_id?: boolean
    accion?: boolean
    detalle?: boolean
    timestamp?: boolean
    usuario?: boolean | Auditoria$usuarioArgs<ExtArgs>
  }, ExtArgs["result"]["auditoria"]>

  export type AuditoriaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entidad?: boolean
    entidad_id?: boolean
    usuario_id?: boolean
    accion?: boolean
    detalle?: boolean
    timestamp?: boolean
    usuario?: boolean | Auditoria$usuarioArgs<ExtArgs>
  }, ExtArgs["result"]["auditoria"]>

  export type AuditoriaSelectScalar = {
    id?: boolean
    entidad?: boolean
    entidad_id?: boolean
    usuario_id?: boolean
    accion?: boolean
    detalle?: boolean
    timestamp?: boolean
  }

  export type AuditoriaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | Auditoria$usuarioArgs<ExtArgs>
  }
  export type AuditoriaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuario?: boolean | Auditoria$usuarioArgs<ExtArgs>
  }

  export type $AuditoriaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Auditoria"
    objects: {
      usuario: Prisma.$UsuarioPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      entidad: string
      entidad_id: number | null
      usuario_id: number | null
      accion: string
      detalle: string | null
      timestamp: Date
    }, ExtArgs["result"]["auditoria"]>
    composites: {}
  }

  type AuditoriaGetPayload<S extends boolean | null | undefined | AuditoriaDefaultArgs> = $Result.GetResult<Prisma.$AuditoriaPayload, S>

  type AuditoriaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditoriaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditoriaCountAggregateInputType | true
    }

  export interface AuditoriaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Auditoria'], meta: { name: 'Auditoria' } }
    /**
     * Find zero or one Auditoria that matches the filter.
     * @param {AuditoriaFindUniqueArgs} args - Arguments to find a Auditoria
     * @example
     * // Get one Auditoria
     * const auditoria = await prisma.auditoria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditoriaFindUniqueArgs>(args: SelectSubset<T, AuditoriaFindUniqueArgs<ExtArgs>>): Prisma__AuditoriaClient<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Auditoria that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditoriaFindUniqueOrThrowArgs} args - Arguments to find a Auditoria
     * @example
     * // Get one Auditoria
     * const auditoria = await prisma.auditoria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditoriaFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditoriaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditoriaClient<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Auditoria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditoriaFindFirstArgs} args - Arguments to find a Auditoria
     * @example
     * // Get one Auditoria
     * const auditoria = await prisma.auditoria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditoriaFindFirstArgs>(args?: SelectSubset<T, AuditoriaFindFirstArgs<ExtArgs>>): Prisma__AuditoriaClient<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Auditoria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditoriaFindFirstOrThrowArgs} args - Arguments to find a Auditoria
     * @example
     * // Get one Auditoria
     * const auditoria = await prisma.auditoria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditoriaFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditoriaFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditoriaClient<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Auditorias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditoriaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Auditorias
     * const auditorias = await prisma.auditoria.findMany()
     * 
     * // Get first 10 Auditorias
     * const auditorias = await prisma.auditoria.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditoriaWithIdOnly = await prisma.auditoria.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditoriaFindManyArgs>(args?: SelectSubset<T, AuditoriaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Auditoria.
     * @param {AuditoriaCreateArgs} args - Arguments to create a Auditoria.
     * @example
     * // Create one Auditoria
     * const Auditoria = await prisma.auditoria.create({
     *   data: {
     *     // ... data to create a Auditoria
     *   }
     * })
     * 
     */
    create<T extends AuditoriaCreateArgs>(args: SelectSubset<T, AuditoriaCreateArgs<ExtArgs>>): Prisma__AuditoriaClient<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Auditorias.
     * @param {AuditoriaCreateManyArgs} args - Arguments to create many Auditorias.
     * @example
     * // Create many Auditorias
     * const auditoria = await prisma.auditoria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditoriaCreateManyArgs>(args?: SelectSubset<T, AuditoriaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Auditorias and returns the data saved in the database.
     * @param {AuditoriaCreateManyAndReturnArgs} args - Arguments to create many Auditorias.
     * @example
     * // Create many Auditorias
     * const auditoria = await prisma.auditoria.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Auditorias and only return the `id`
     * const auditoriaWithIdOnly = await prisma.auditoria.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditoriaCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditoriaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Auditoria.
     * @param {AuditoriaDeleteArgs} args - Arguments to delete one Auditoria.
     * @example
     * // Delete one Auditoria
     * const Auditoria = await prisma.auditoria.delete({
     *   where: {
     *     // ... filter to delete one Auditoria
     *   }
     * })
     * 
     */
    delete<T extends AuditoriaDeleteArgs>(args: SelectSubset<T, AuditoriaDeleteArgs<ExtArgs>>): Prisma__AuditoriaClient<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Auditoria.
     * @param {AuditoriaUpdateArgs} args - Arguments to update one Auditoria.
     * @example
     * // Update one Auditoria
     * const auditoria = await prisma.auditoria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditoriaUpdateArgs>(args: SelectSubset<T, AuditoriaUpdateArgs<ExtArgs>>): Prisma__AuditoriaClient<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Auditorias.
     * @param {AuditoriaDeleteManyArgs} args - Arguments to filter Auditorias to delete.
     * @example
     * // Delete a few Auditorias
     * const { count } = await prisma.auditoria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditoriaDeleteManyArgs>(args?: SelectSubset<T, AuditoriaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auditorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditoriaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Auditorias
     * const auditoria = await prisma.auditoria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditoriaUpdateManyArgs>(args: SelectSubset<T, AuditoriaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Auditoria.
     * @param {AuditoriaUpsertArgs} args - Arguments to update or create a Auditoria.
     * @example
     * // Update or create a Auditoria
     * const auditoria = await prisma.auditoria.upsert({
     *   create: {
     *     // ... data to create a Auditoria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Auditoria we want to update
     *   }
     * })
     */
    upsert<T extends AuditoriaUpsertArgs>(args: SelectSubset<T, AuditoriaUpsertArgs<ExtArgs>>): Prisma__AuditoriaClient<$Result.GetResult<Prisma.$AuditoriaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Auditorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditoriaCountArgs} args - Arguments to filter Auditorias to count.
     * @example
     * // Count the number of Auditorias
     * const count = await prisma.auditoria.count({
     *   where: {
     *     // ... the filter for the Auditorias we want to count
     *   }
     * })
    **/
    count<T extends AuditoriaCountArgs>(
      args?: Subset<T, AuditoriaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditoriaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Auditoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditoriaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditoriaAggregateArgs>(args: Subset<T, AuditoriaAggregateArgs>): Prisma.PrismaPromise<GetAuditoriaAggregateType<T>>

    /**
     * Group by Auditoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditoriaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditoriaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditoriaGroupByArgs['orderBy'] }
        : { orderBy?: AuditoriaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditoriaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditoriaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Auditoria model
   */
  readonly fields: AuditoriaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Auditoria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditoriaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuario<T extends Auditoria$usuarioArgs<ExtArgs> = {}>(args?: Subset<T, Auditoria$usuarioArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Auditoria model
   */ 
  interface AuditoriaFieldRefs {
    readonly id: FieldRef<"Auditoria", 'Int'>
    readonly entidad: FieldRef<"Auditoria", 'String'>
    readonly entidad_id: FieldRef<"Auditoria", 'Int'>
    readonly usuario_id: FieldRef<"Auditoria", 'Int'>
    readonly accion: FieldRef<"Auditoria", 'String'>
    readonly detalle: FieldRef<"Auditoria", 'String'>
    readonly timestamp: FieldRef<"Auditoria", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Auditoria findUnique
   */
  export type AuditoriaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    /**
     * Filter, which Auditoria to fetch.
     */
    where: AuditoriaWhereUniqueInput
  }

  /**
   * Auditoria findUniqueOrThrow
   */
  export type AuditoriaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    /**
     * Filter, which Auditoria to fetch.
     */
    where: AuditoriaWhereUniqueInput
  }

  /**
   * Auditoria findFirst
   */
  export type AuditoriaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    /**
     * Filter, which Auditoria to fetch.
     */
    where?: AuditoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auditorias to fetch.
     */
    orderBy?: AuditoriaOrderByWithRelationInput | AuditoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auditorias.
     */
    cursor?: AuditoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auditorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auditorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auditorias.
     */
    distinct?: AuditoriaScalarFieldEnum | AuditoriaScalarFieldEnum[]
  }

  /**
   * Auditoria findFirstOrThrow
   */
  export type AuditoriaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    /**
     * Filter, which Auditoria to fetch.
     */
    where?: AuditoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auditorias to fetch.
     */
    orderBy?: AuditoriaOrderByWithRelationInput | AuditoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Auditorias.
     */
    cursor?: AuditoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auditorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auditorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Auditorias.
     */
    distinct?: AuditoriaScalarFieldEnum | AuditoriaScalarFieldEnum[]
  }

  /**
   * Auditoria findMany
   */
  export type AuditoriaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    /**
     * Filter, which Auditorias to fetch.
     */
    where?: AuditoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Auditorias to fetch.
     */
    orderBy?: AuditoriaOrderByWithRelationInput | AuditoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Auditorias.
     */
    cursor?: AuditoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Auditorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Auditorias.
     */
    skip?: number
    distinct?: AuditoriaScalarFieldEnum | AuditoriaScalarFieldEnum[]
  }

  /**
   * Auditoria create
   */
  export type AuditoriaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    /**
     * The data needed to create a Auditoria.
     */
    data: XOR<AuditoriaCreateInput, AuditoriaUncheckedCreateInput>
  }

  /**
   * Auditoria createMany
   */
  export type AuditoriaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Auditorias.
     */
    data: AuditoriaCreateManyInput | AuditoriaCreateManyInput[]
  }

  /**
   * Auditoria createManyAndReturn
   */
  export type AuditoriaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Auditorias.
     */
    data: AuditoriaCreateManyInput | AuditoriaCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Auditoria update
   */
  export type AuditoriaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    /**
     * The data needed to update a Auditoria.
     */
    data: XOR<AuditoriaUpdateInput, AuditoriaUncheckedUpdateInput>
    /**
     * Choose, which Auditoria to update.
     */
    where: AuditoriaWhereUniqueInput
  }

  /**
   * Auditoria updateMany
   */
  export type AuditoriaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Auditorias.
     */
    data: XOR<AuditoriaUpdateManyMutationInput, AuditoriaUncheckedUpdateManyInput>
    /**
     * Filter which Auditorias to update
     */
    where?: AuditoriaWhereInput
  }

  /**
   * Auditoria upsert
   */
  export type AuditoriaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    /**
     * The filter to search for the Auditoria to update in case it exists.
     */
    where: AuditoriaWhereUniqueInput
    /**
     * In case the Auditoria found by the `where` argument doesn't exist, create a new Auditoria with this data.
     */
    create: XOR<AuditoriaCreateInput, AuditoriaUncheckedCreateInput>
    /**
     * In case the Auditoria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditoriaUpdateInput, AuditoriaUncheckedUpdateInput>
  }

  /**
   * Auditoria delete
   */
  export type AuditoriaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
    /**
     * Filter which Auditoria to delete.
     */
    where: AuditoriaWhereUniqueInput
  }

  /**
   * Auditoria deleteMany
   */
  export type AuditoriaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Auditorias to delete
     */
    where?: AuditoriaWhereInput
  }

  /**
   * Auditoria.usuario
   */
  export type Auditoria$usuarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsuarioInclude<ExtArgs> | null
    where?: UsuarioWhereInput
  }

  /**
   * Auditoria without action
   */
  export type AuditoriaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Auditoria
     */
    select?: AuditoriaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditoriaInclude<ExtArgs> | null
  }


  /**
   * Model Excusa
   */

  export type AggregateExcusa = {
    _count: ExcusaCountAggregateOutputType | null
    _avg: ExcusaAvgAggregateOutputType | null
    _sum: ExcusaSumAggregateOutputType | null
    _min: ExcusaMinAggregateOutputType | null
    _max: ExcusaMaxAggregateOutputType | null
  }

  export type ExcusaAvgAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    personal_id: number | null
  }

  export type ExcusaSumAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    personal_id: number | null
  }

  export type ExcusaMinAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    personal_id: number | null
    motivo: string | null
    descripcion: string | null
    estado: string | null
    fecha: Date | null
    fecha_ausencia: Date | null
    documento_url: string | null
    observaciones: string | null
    creado_en: Date | null
  }

  export type ExcusaMaxAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    personal_id: number | null
    motivo: string | null
    descripcion: string | null
    estado: string | null
    fecha: Date | null
    fecha_ausencia: Date | null
    documento_url: string | null
    observaciones: string | null
    creado_en: Date | null
  }

  export type ExcusaCountAggregateOutputType = {
    id: number
    alumno_id: number
    personal_id: number
    motivo: number
    descripcion: number
    estado: number
    fecha: number
    fecha_ausencia: number
    documento_url: number
    observaciones: number
    creado_en: number
    _all: number
  }


  export type ExcusaAvgAggregateInputType = {
    id?: true
    alumno_id?: true
    personal_id?: true
  }

  export type ExcusaSumAggregateInputType = {
    id?: true
    alumno_id?: true
    personal_id?: true
  }

  export type ExcusaMinAggregateInputType = {
    id?: true
    alumno_id?: true
    personal_id?: true
    motivo?: true
    descripcion?: true
    estado?: true
    fecha?: true
    fecha_ausencia?: true
    documento_url?: true
    observaciones?: true
    creado_en?: true
  }

  export type ExcusaMaxAggregateInputType = {
    id?: true
    alumno_id?: true
    personal_id?: true
    motivo?: true
    descripcion?: true
    estado?: true
    fecha?: true
    fecha_ausencia?: true
    documento_url?: true
    observaciones?: true
    creado_en?: true
  }

  export type ExcusaCountAggregateInputType = {
    id?: true
    alumno_id?: true
    personal_id?: true
    motivo?: true
    descripcion?: true
    estado?: true
    fecha?: true
    fecha_ausencia?: true
    documento_url?: true
    observaciones?: true
    creado_en?: true
    _all?: true
  }

  export type ExcusaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Excusa to aggregate.
     */
    where?: ExcusaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Excusas to fetch.
     */
    orderBy?: ExcusaOrderByWithRelationInput | ExcusaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExcusaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Excusas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Excusas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Excusas
    **/
    _count?: true | ExcusaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExcusaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExcusaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExcusaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExcusaMaxAggregateInputType
  }

  export type GetExcusaAggregateType<T extends ExcusaAggregateArgs> = {
        [P in keyof T & keyof AggregateExcusa]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExcusa[P]>
      : GetScalarType<T[P], AggregateExcusa[P]>
  }




  export type ExcusaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExcusaWhereInput
    orderBy?: ExcusaOrderByWithAggregationInput | ExcusaOrderByWithAggregationInput[]
    by: ExcusaScalarFieldEnum[] | ExcusaScalarFieldEnum
    having?: ExcusaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExcusaCountAggregateInputType | true
    _avg?: ExcusaAvgAggregateInputType
    _sum?: ExcusaSumAggregateInputType
    _min?: ExcusaMinAggregateInputType
    _max?: ExcusaMaxAggregateInputType
  }

  export type ExcusaGroupByOutputType = {
    id: number
    alumno_id: number | null
    personal_id: number | null
    motivo: string
    descripcion: string | null
    estado: string
    fecha: Date
    fecha_ausencia: Date | null
    documento_url: string | null
    observaciones: string | null
    creado_en: Date
    _count: ExcusaCountAggregateOutputType | null
    _avg: ExcusaAvgAggregateOutputType | null
    _sum: ExcusaSumAggregateOutputType | null
    _min: ExcusaMinAggregateOutputType | null
    _max: ExcusaMaxAggregateOutputType | null
  }

  type GetExcusaGroupByPayload<T extends ExcusaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExcusaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExcusaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExcusaGroupByOutputType[P]>
            : GetScalarType<T[P], ExcusaGroupByOutputType[P]>
        }
      >
    >


  export type ExcusaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumno_id?: boolean
    personal_id?: boolean
    motivo?: boolean
    descripcion?: boolean
    estado?: boolean
    fecha?: boolean
    fecha_ausencia?: boolean
    documento_url?: boolean
    observaciones?: boolean
    creado_en?: boolean
    alumno?: boolean | Excusa$alumnoArgs<ExtArgs>
    personal?: boolean | Excusa$personalArgs<ExtArgs>
  }, ExtArgs["result"]["excusa"]>

  export type ExcusaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumno_id?: boolean
    personal_id?: boolean
    motivo?: boolean
    descripcion?: boolean
    estado?: boolean
    fecha?: boolean
    fecha_ausencia?: boolean
    documento_url?: boolean
    observaciones?: boolean
    creado_en?: boolean
    alumno?: boolean | Excusa$alumnoArgs<ExtArgs>
    personal?: boolean | Excusa$personalArgs<ExtArgs>
  }, ExtArgs["result"]["excusa"]>

  export type ExcusaSelectScalar = {
    id?: boolean
    alumno_id?: boolean
    personal_id?: boolean
    motivo?: boolean
    descripcion?: boolean
    estado?: boolean
    fecha?: boolean
    fecha_ausencia?: boolean
    documento_url?: boolean
    observaciones?: boolean
    creado_en?: boolean
  }

  export type ExcusaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | Excusa$alumnoArgs<ExtArgs>
    personal?: boolean | Excusa$personalArgs<ExtArgs>
  }
  export type ExcusaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | Excusa$alumnoArgs<ExtArgs>
    personal?: boolean | Excusa$personalArgs<ExtArgs>
  }

  export type $ExcusaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Excusa"
    objects: {
      alumno: Prisma.$AlumnoPayload<ExtArgs> | null
      personal: Prisma.$PersonalPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      alumno_id: number | null
      personal_id: number | null
      motivo: string
      descripcion: string | null
      estado: string
      fecha: Date
      fecha_ausencia: Date | null
      documento_url: string | null
      observaciones: string | null
      creado_en: Date
    }, ExtArgs["result"]["excusa"]>
    composites: {}
  }

  type ExcusaGetPayload<S extends boolean | null | undefined | ExcusaDefaultArgs> = $Result.GetResult<Prisma.$ExcusaPayload, S>

  type ExcusaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ExcusaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ExcusaCountAggregateInputType | true
    }

  export interface ExcusaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Excusa'], meta: { name: 'Excusa' } }
    /**
     * Find zero or one Excusa that matches the filter.
     * @param {ExcusaFindUniqueArgs} args - Arguments to find a Excusa
     * @example
     * // Get one Excusa
     * const excusa = await prisma.excusa.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExcusaFindUniqueArgs>(args: SelectSubset<T, ExcusaFindUniqueArgs<ExtArgs>>): Prisma__ExcusaClient<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Excusa that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ExcusaFindUniqueOrThrowArgs} args - Arguments to find a Excusa
     * @example
     * // Get one Excusa
     * const excusa = await prisma.excusa.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExcusaFindUniqueOrThrowArgs>(args: SelectSubset<T, ExcusaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExcusaClient<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Excusa that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExcusaFindFirstArgs} args - Arguments to find a Excusa
     * @example
     * // Get one Excusa
     * const excusa = await prisma.excusa.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExcusaFindFirstArgs>(args?: SelectSubset<T, ExcusaFindFirstArgs<ExtArgs>>): Prisma__ExcusaClient<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Excusa that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExcusaFindFirstOrThrowArgs} args - Arguments to find a Excusa
     * @example
     * // Get one Excusa
     * const excusa = await prisma.excusa.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExcusaFindFirstOrThrowArgs>(args?: SelectSubset<T, ExcusaFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExcusaClient<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Excusas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExcusaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Excusas
     * const excusas = await prisma.excusa.findMany()
     * 
     * // Get first 10 Excusas
     * const excusas = await prisma.excusa.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const excusaWithIdOnly = await prisma.excusa.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExcusaFindManyArgs>(args?: SelectSubset<T, ExcusaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Excusa.
     * @param {ExcusaCreateArgs} args - Arguments to create a Excusa.
     * @example
     * // Create one Excusa
     * const Excusa = await prisma.excusa.create({
     *   data: {
     *     // ... data to create a Excusa
     *   }
     * })
     * 
     */
    create<T extends ExcusaCreateArgs>(args: SelectSubset<T, ExcusaCreateArgs<ExtArgs>>): Prisma__ExcusaClient<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Excusas.
     * @param {ExcusaCreateManyArgs} args - Arguments to create many Excusas.
     * @example
     * // Create many Excusas
     * const excusa = await prisma.excusa.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExcusaCreateManyArgs>(args?: SelectSubset<T, ExcusaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Excusas and returns the data saved in the database.
     * @param {ExcusaCreateManyAndReturnArgs} args - Arguments to create many Excusas.
     * @example
     * // Create many Excusas
     * const excusa = await prisma.excusa.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Excusas and only return the `id`
     * const excusaWithIdOnly = await prisma.excusa.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExcusaCreateManyAndReturnArgs>(args?: SelectSubset<T, ExcusaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Excusa.
     * @param {ExcusaDeleteArgs} args - Arguments to delete one Excusa.
     * @example
     * // Delete one Excusa
     * const Excusa = await prisma.excusa.delete({
     *   where: {
     *     // ... filter to delete one Excusa
     *   }
     * })
     * 
     */
    delete<T extends ExcusaDeleteArgs>(args: SelectSubset<T, ExcusaDeleteArgs<ExtArgs>>): Prisma__ExcusaClient<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Excusa.
     * @param {ExcusaUpdateArgs} args - Arguments to update one Excusa.
     * @example
     * // Update one Excusa
     * const excusa = await prisma.excusa.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExcusaUpdateArgs>(args: SelectSubset<T, ExcusaUpdateArgs<ExtArgs>>): Prisma__ExcusaClient<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Excusas.
     * @param {ExcusaDeleteManyArgs} args - Arguments to filter Excusas to delete.
     * @example
     * // Delete a few Excusas
     * const { count } = await prisma.excusa.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExcusaDeleteManyArgs>(args?: SelectSubset<T, ExcusaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Excusas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExcusaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Excusas
     * const excusa = await prisma.excusa.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExcusaUpdateManyArgs>(args: SelectSubset<T, ExcusaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Excusa.
     * @param {ExcusaUpsertArgs} args - Arguments to update or create a Excusa.
     * @example
     * // Update or create a Excusa
     * const excusa = await prisma.excusa.upsert({
     *   create: {
     *     // ... data to create a Excusa
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Excusa we want to update
     *   }
     * })
     */
    upsert<T extends ExcusaUpsertArgs>(args: SelectSubset<T, ExcusaUpsertArgs<ExtArgs>>): Prisma__ExcusaClient<$Result.GetResult<Prisma.$ExcusaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Excusas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExcusaCountArgs} args - Arguments to filter Excusas to count.
     * @example
     * // Count the number of Excusas
     * const count = await prisma.excusa.count({
     *   where: {
     *     // ... the filter for the Excusas we want to count
     *   }
     * })
    **/
    count<T extends ExcusaCountArgs>(
      args?: Subset<T, ExcusaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExcusaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Excusa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExcusaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExcusaAggregateArgs>(args: Subset<T, ExcusaAggregateArgs>): Prisma.PrismaPromise<GetExcusaAggregateType<T>>

    /**
     * Group by Excusa.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExcusaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExcusaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExcusaGroupByArgs['orderBy'] }
        : { orderBy?: ExcusaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExcusaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExcusaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Excusa model
   */
  readonly fields: ExcusaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Excusa.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExcusaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    alumno<T extends Excusa$alumnoArgs<ExtArgs> = {}>(args?: Subset<T, Excusa$alumnoArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    personal<T extends Excusa$personalArgs<ExtArgs> = {}>(args?: Subset<T, Excusa$personalArgs<ExtArgs>>): Prisma__PersonalClient<$Result.GetResult<Prisma.$PersonalPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Excusa model
   */ 
  interface ExcusaFieldRefs {
    readonly id: FieldRef<"Excusa", 'Int'>
    readonly alumno_id: FieldRef<"Excusa", 'Int'>
    readonly personal_id: FieldRef<"Excusa", 'Int'>
    readonly motivo: FieldRef<"Excusa", 'String'>
    readonly descripcion: FieldRef<"Excusa", 'String'>
    readonly estado: FieldRef<"Excusa", 'String'>
    readonly fecha: FieldRef<"Excusa", 'DateTime'>
    readonly fecha_ausencia: FieldRef<"Excusa", 'DateTime'>
    readonly documento_url: FieldRef<"Excusa", 'String'>
    readonly observaciones: FieldRef<"Excusa", 'String'>
    readonly creado_en: FieldRef<"Excusa", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Excusa findUnique
   */
  export type ExcusaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    /**
     * Filter, which Excusa to fetch.
     */
    where: ExcusaWhereUniqueInput
  }

  /**
   * Excusa findUniqueOrThrow
   */
  export type ExcusaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    /**
     * Filter, which Excusa to fetch.
     */
    where: ExcusaWhereUniqueInput
  }

  /**
   * Excusa findFirst
   */
  export type ExcusaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    /**
     * Filter, which Excusa to fetch.
     */
    where?: ExcusaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Excusas to fetch.
     */
    orderBy?: ExcusaOrderByWithRelationInput | ExcusaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Excusas.
     */
    cursor?: ExcusaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Excusas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Excusas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Excusas.
     */
    distinct?: ExcusaScalarFieldEnum | ExcusaScalarFieldEnum[]
  }

  /**
   * Excusa findFirstOrThrow
   */
  export type ExcusaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    /**
     * Filter, which Excusa to fetch.
     */
    where?: ExcusaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Excusas to fetch.
     */
    orderBy?: ExcusaOrderByWithRelationInput | ExcusaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Excusas.
     */
    cursor?: ExcusaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Excusas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Excusas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Excusas.
     */
    distinct?: ExcusaScalarFieldEnum | ExcusaScalarFieldEnum[]
  }

  /**
   * Excusa findMany
   */
  export type ExcusaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    /**
     * Filter, which Excusas to fetch.
     */
    where?: ExcusaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Excusas to fetch.
     */
    orderBy?: ExcusaOrderByWithRelationInput | ExcusaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Excusas.
     */
    cursor?: ExcusaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Excusas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Excusas.
     */
    skip?: number
    distinct?: ExcusaScalarFieldEnum | ExcusaScalarFieldEnum[]
  }

  /**
   * Excusa create
   */
  export type ExcusaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    /**
     * The data needed to create a Excusa.
     */
    data: XOR<ExcusaCreateInput, ExcusaUncheckedCreateInput>
  }

  /**
   * Excusa createMany
   */
  export type ExcusaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Excusas.
     */
    data: ExcusaCreateManyInput | ExcusaCreateManyInput[]
  }

  /**
   * Excusa createManyAndReturn
   */
  export type ExcusaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Excusas.
     */
    data: ExcusaCreateManyInput | ExcusaCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Excusa update
   */
  export type ExcusaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    /**
     * The data needed to update a Excusa.
     */
    data: XOR<ExcusaUpdateInput, ExcusaUncheckedUpdateInput>
    /**
     * Choose, which Excusa to update.
     */
    where: ExcusaWhereUniqueInput
  }

  /**
   * Excusa updateMany
   */
  export type ExcusaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Excusas.
     */
    data: XOR<ExcusaUpdateManyMutationInput, ExcusaUncheckedUpdateManyInput>
    /**
     * Filter which Excusas to update
     */
    where?: ExcusaWhereInput
  }

  /**
   * Excusa upsert
   */
  export type ExcusaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    /**
     * The filter to search for the Excusa to update in case it exists.
     */
    where: ExcusaWhereUniqueInput
    /**
     * In case the Excusa found by the `where` argument doesn't exist, create a new Excusa with this data.
     */
    create: XOR<ExcusaCreateInput, ExcusaUncheckedCreateInput>
    /**
     * In case the Excusa was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExcusaUpdateInput, ExcusaUncheckedUpdateInput>
  }

  /**
   * Excusa delete
   */
  export type ExcusaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
    /**
     * Filter which Excusa to delete.
     */
    where: ExcusaWhereUniqueInput
  }

  /**
   * Excusa deleteMany
   */
  export type ExcusaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Excusas to delete
     */
    where?: ExcusaWhereInput
  }

  /**
   * Excusa.alumno
   */
  export type Excusa$alumnoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Alumno
     */
    select?: AlumnoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlumnoInclude<ExtArgs> | null
    where?: AlumnoWhereInput
  }

  /**
   * Excusa.personal
   */
  export type Excusa$personalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Personal
     */
    select?: PersonalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersonalInclude<ExtArgs> | null
    where?: PersonalWhereInput
  }

  /**
   * Excusa without action
   */
  export type ExcusaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Excusa
     */
    select?: ExcusaSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExcusaInclude<ExtArgs> | null
  }


  /**
   * Model HistorialAcademico
   */

  export type AggregateHistorialAcademico = {
    _count: HistorialAcademicoCountAggregateOutputType | null
    _avg: HistorialAcademicoAvgAggregateOutputType | null
    _sum: HistorialAcademicoSumAggregateOutputType | null
    _min: HistorialAcademicoMinAggregateOutputType | null
    _max: HistorialAcademicoMaxAggregateOutputType | null
  }

  export type HistorialAcademicoAvgAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    anio_escolar: number | null
  }

  export type HistorialAcademicoSumAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    anio_escolar: number | null
  }

  export type HistorialAcademicoMinAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    anio_escolar: number | null
    grado_cursado: string | null
    nivel: string | null
    carrera: string | null
    promovido: boolean | null
    observaciones: string | null
    creado_en: Date | null
  }

  export type HistorialAcademicoMaxAggregateOutputType = {
    id: number | null
    alumno_id: number | null
    anio_escolar: number | null
    grado_cursado: string | null
    nivel: string | null
    carrera: string | null
    promovido: boolean | null
    observaciones: string | null
    creado_en: Date | null
  }

  export type HistorialAcademicoCountAggregateOutputType = {
    id: number
    alumno_id: number
    anio_escolar: number
    grado_cursado: number
    nivel: number
    carrera: number
    promovido: number
    observaciones: number
    creado_en: number
    _all: number
  }


  export type HistorialAcademicoAvgAggregateInputType = {
    id?: true
    alumno_id?: true
    anio_escolar?: true
  }

  export type HistorialAcademicoSumAggregateInputType = {
    id?: true
    alumno_id?: true
    anio_escolar?: true
  }

  export type HistorialAcademicoMinAggregateInputType = {
    id?: true
    alumno_id?: true
    anio_escolar?: true
    grado_cursado?: true
    nivel?: true
    carrera?: true
    promovido?: true
    observaciones?: true
    creado_en?: true
  }

  export type HistorialAcademicoMaxAggregateInputType = {
    id?: true
    alumno_id?: true
    anio_escolar?: true
    grado_cursado?: true
    nivel?: true
    carrera?: true
    promovido?: true
    observaciones?: true
    creado_en?: true
  }

  export type HistorialAcademicoCountAggregateInputType = {
    id?: true
    alumno_id?: true
    anio_escolar?: true
    grado_cursado?: true
    nivel?: true
    carrera?: true
    promovido?: true
    observaciones?: true
    creado_en?: true
    _all?: true
  }

  export type HistorialAcademicoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistorialAcademico to aggregate.
     */
    where?: HistorialAcademicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistorialAcademicos to fetch.
     */
    orderBy?: HistorialAcademicoOrderByWithRelationInput | HistorialAcademicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HistorialAcademicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistorialAcademicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistorialAcademicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HistorialAcademicos
    **/
    _count?: true | HistorialAcademicoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HistorialAcademicoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HistorialAcademicoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HistorialAcademicoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HistorialAcademicoMaxAggregateInputType
  }

  export type GetHistorialAcademicoAggregateType<T extends HistorialAcademicoAggregateArgs> = {
        [P in keyof T & keyof AggregateHistorialAcademico]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHistorialAcademico[P]>
      : GetScalarType<T[P], AggregateHistorialAcademico[P]>
  }




  export type HistorialAcademicoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistorialAcademicoWhereInput
    orderBy?: HistorialAcademicoOrderByWithAggregationInput | HistorialAcademicoOrderByWithAggregationInput[]
    by: HistorialAcademicoScalarFieldEnum[] | HistorialAcademicoScalarFieldEnum
    having?: HistorialAcademicoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HistorialAcademicoCountAggregateInputType | true
    _avg?: HistorialAcademicoAvgAggregateInputType
    _sum?: HistorialAcademicoSumAggregateInputType
    _min?: HistorialAcademicoMinAggregateInputType
    _max?: HistorialAcademicoMaxAggregateInputType
  }

  export type HistorialAcademicoGroupByOutputType = {
    id: number
    alumno_id: number
    anio_escolar: number
    grado_cursado: string
    nivel: string
    carrera: string | null
    promovido: boolean
    observaciones: string | null
    creado_en: Date
    _count: HistorialAcademicoCountAggregateOutputType | null
    _avg: HistorialAcademicoAvgAggregateOutputType | null
    _sum: HistorialAcademicoSumAggregateOutputType | null
    _min: HistorialAcademicoMinAggregateOutputType | null
    _max: HistorialAcademicoMaxAggregateOutputType | null
  }

  type GetHistorialAcademicoGroupByPayload<T extends HistorialAcademicoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HistorialAcademicoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HistorialAcademicoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HistorialAcademicoGroupByOutputType[P]>
            : GetScalarType<T[P], HistorialAcademicoGroupByOutputType[P]>
        }
      >
    >


  export type HistorialAcademicoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumno_id?: boolean
    anio_escolar?: boolean
    grado_cursado?: boolean
    nivel?: boolean
    carrera?: boolean
    promovido?: boolean
    observaciones?: boolean
    creado_en?: boolean
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historialAcademico"]>

  export type HistorialAcademicoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alumno_id?: boolean
    anio_escolar?: boolean
    grado_cursado?: boolean
    nivel?: boolean
    carrera?: boolean
    promovido?: boolean
    observaciones?: boolean
    creado_en?: boolean
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historialAcademico"]>

  export type HistorialAcademicoSelectScalar = {
    id?: boolean
    alumno_id?: boolean
    anio_escolar?: boolean
    grado_cursado?: boolean
    nivel?: boolean
    carrera?: boolean
    promovido?: boolean
    observaciones?: boolean
    creado_en?: boolean
  }

  export type HistorialAcademicoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }
  export type HistorialAcademicoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alumno?: boolean | AlumnoDefaultArgs<ExtArgs>
  }

  export type $HistorialAcademicoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HistorialAcademico"
    objects: {
      alumno: Prisma.$AlumnoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      alumno_id: number
      anio_escolar: number
      grado_cursado: string
      nivel: string
      carrera: string | null
      promovido: boolean
      observaciones: string | null
      creado_en: Date
    }, ExtArgs["result"]["historialAcademico"]>
    composites: {}
  }

  type HistorialAcademicoGetPayload<S extends boolean | null | undefined | HistorialAcademicoDefaultArgs> = $Result.GetResult<Prisma.$HistorialAcademicoPayload, S>

  type HistorialAcademicoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<HistorialAcademicoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: HistorialAcademicoCountAggregateInputType | true
    }

  export interface HistorialAcademicoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HistorialAcademico'], meta: { name: 'HistorialAcademico' } }
    /**
     * Find zero or one HistorialAcademico that matches the filter.
     * @param {HistorialAcademicoFindUniqueArgs} args - Arguments to find a HistorialAcademico
     * @example
     * // Get one HistorialAcademico
     * const historialAcademico = await prisma.historialAcademico.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HistorialAcademicoFindUniqueArgs>(args: SelectSubset<T, HistorialAcademicoFindUniqueArgs<ExtArgs>>): Prisma__HistorialAcademicoClient<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one HistorialAcademico that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {HistorialAcademicoFindUniqueOrThrowArgs} args - Arguments to find a HistorialAcademico
     * @example
     * // Get one HistorialAcademico
     * const historialAcademico = await prisma.historialAcademico.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HistorialAcademicoFindUniqueOrThrowArgs>(args: SelectSubset<T, HistorialAcademicoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HistorialAcademicoClient<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first HistorialAcademico that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialAcademicoFindFirstArgs} args - Arguments to find a HistorialAcademico
     * @example
     * // Get one HistorialAcademico
     * const historialAcademico = await prisma.historialAcademico.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HistorialAcademicoFindFirstArgs>(args?: SelectSubset<T, HistorialAcademicoFindFirstArgs<ExtArgs>>): Prisma__HistorialAcademicoClient<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first HistorialAcademico that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialAcademicoFindFirstOrThrowArgs} args - Arguments to find a HistorialAcademico
     * @example
     * // Get one HistorialAcademico
     * const historialAcademico = await prisma.historialAcademico.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HistorialAcademicoFindFirstOrThrowArgs>(args?: SelectSubset<T, HistorialAcademicoFindFirstOrThrowArgs<ExtArgs>>): Prisma__HistorialAcademicoClient<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more HistorialAcademicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialAcademicoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HistorialAcademicos
     * const historialAcademicos = await prisma.historialAcademico.findMany()
     * 
     * // Get first 10 HistorialAcademicos
     * const historialAcademicos = await prisma.historialAcademico.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const historialAcademicoWithIdOnly = await prisma.historialAcademico.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HistorialAcademicoFindManyArgs>(args?: SelectSubset<T, HistorialAcademicoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a HistorialAcademico.
     * @param {HistorialAcademicoCreateArgs} args - Arguments to create a HistorialAcademico.
     * @example
     * // Create one HistorialAcademico
     * const HistorialAcademico = await prisma.historialAcademico.create({
     *   data: {
     *     // ... data to create a HistorialAcademico
     *   }
     * })
     * 
     */
    create<T extends HistorialAcademicoCreateArgs>(args: SelectSubset<T, HistorialAcademicoCreateArgs<ExtArgs>>): Prisma__HistorialAcademicoClient<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many HistorialAcademicos.
     * @param {HistorialAcademicoCreateManyArgs} args - Arguments to create many HistorialAcademicos.
     * @example
     * // Create many HistorialAcademicos
     * const historialAcademico = await prisma.historialAcademico.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HistorialAcademicoCreateManyArgs>(args?: SelectSubset<T, HistorialAcademicoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HistorialAcademicos and returns the data saved in the database.
     * @param {HistorialAcademicoCreateManyAndReturnArgs} args - Arguments to create many HistorialAcademicos.
     * @example
     * // Create many HistorialAcademicos
     * const historialAcademico = await prisma.historialAcademico.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HistorialAcademicos and only return the `id`
     * const historialAcademicoWithIdOnly = await prisma.historialAcademico.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HistorialAcademicoCreateManyAndReturnArgs>(args?: SelectSubset<T, HistorialAcademicoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a HistorialAcademico.
     * @param {HistorialAcademicoDeleteArgs} args - Arguments to delete one HistorialAcademico.
     * @example
     * // Delete one HistorialAcademico
     * const HistorialAcademico = await prisma.historialAcademico.delete({
     *   where: {
     *     // ... filter to delete one HistorialAcademico
     *   }
     * })
     * 
     */
    delete<T extends HistorialAcademicoDeleteArgs>(args: SelectSubset<T, HistorialAcademicoDeleteArgs<ExtArgs>>): Prisma__HistorialAcademicoClient<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one HistorialAcademico.
     * @param {HistorialAcademicoUpdateArgs} args - Arguments to update one HistorialAcademico.
     * @example
     * // Update one HistorialAcademico
     * const historialAcademico = await prisma.historialAcademico.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HistorialAcademicoUpdateArgs>(args: SelectSubset<T, HistorialAcademicoUpdateArgs<ExtArgs>>): Prisma__HistorialAcademicoClient<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more HistorialAcademicos.
     * @param {HistorialAcademicoDeleteManyArgs} args - Arguments to filter HistorialAcademicos to delete.
     * @example
     * // Delete a few HistorialAcademicos
     * const { count } = await prisma.historialAcademico.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HistorialAcademicoDeleteManyArgs>(args?: SelectSubset<T, HistorialAcademicoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HistorialAcademicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialAcademicoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HistorialAcademicos
     * const historialAcademico = await prisma.historialAcademico.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HistorialAcademicoUpdateManyArgs>(args: SelectSubset<T, HistorialAcademicoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HistorialAcademico.
     * @param {HistorialAcademicoUpsertArgs} args - Arguments to update or create a HistorialAcademico.
     * @example
     * // Update or create a HistorialAcademico
     * const historialAcademico = await prisma.historialAcademico.upsert({
     *   create: {
     *     // ... data to create a HistorialAcademico
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HistorialAcademico we want to update
     *   }
     * })
     */
    upsert<T extends HistorialAcademicoUpsertArgs>(args: SelectSubset<T, HistorialAcademicoUpsertArgs<ExtArgs>>): Prisma__HistorialAcademicoClient<$Result.GetResult<Prisma.$HistorialAcademicoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of HistorialAcademicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialAcademicoCountArgs} args - Arguments to filter HistorialAcademicos to count.
     * @example
     * // Count the number of HistorialAcademicos
     * const count = await prisma.historialAcademico.count({
     *   where: {
     *     // ... the filter for the HistorialAcademicos we want to count
     *   }
     * })
    **/
    count<T extends HistorialAcademicoCountArgs>(
      args?: Subset<T, HistorialAcademicoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HistorialAcademicoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HistorialAcademico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialAcademicoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HistorialAcademicoAggregateArgs>(args: Subset<T, HistorialAcademicoAggregateArgs>): Prisma.PrismaPromise<GetHistorialAcademicoAggregateType<T>>

    /**
     * Group by HistorialAcademico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistorialAcademicoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HistorialAcademicoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HistorialAcademicoGroupByArgs['orderBy'] }
        : { orderBy?: HistorialAcademicoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HistorialAcademicoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHistorialAcademicoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HistorialAcademico model
   */
  readonly fields: HistorialAcademicoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HistorialAcademico.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HistorialAcademicoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    alumno<T extends AlumnoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AlumnoDefaultArgs<ExtArgs>>): Prisma__AlumnoClient<$Result.GetResult<Prisma.$AlumnoPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HistorialAcademico model
   */ 
  interface HistorialAcademicoFieldRefs {
    readonly id: FieldRef<"HistorialAcademico", 'Int'>
    readonly alumno_id: FieldRef<"HistorialAcademico", 'Int'>
    readonly anio_escolar: FieldRef<"HistorialAcademico", 'Int'>
    readonly grado_cursado: FieldRef<"HistorialAcademico", 'String'>
    readonly nivel: FieldRef<"HistorialAcademico", 'String'>
    readonly carrera: FieldRef<"HistorialAcademico", 'String'>
    readonly promovido: FieldRef<"HistorialAcademico", 'Boolean'>
    readonly observaciones: FieldRef<"HistorialAcademico", 'String'>
    readonly creado_en: FieldRef<"HistorialAcademico", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HistorialAcademico findUnique
   */
  export type HistorialAcademicoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    /**
     * Filter, which HistorialAcademico to fetch.
     */
    where: HistorialAcademicoWhereUniqueInput
  }

  /**
   * HistorialAcademico findUniqueOrThrow
   */
  export type HistorialAcademicoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    /**
     * Filter, which HistorialAcademico to fetch.
     */
    where: HistorialAcademicoWhereUniqueInput
  }

  /**
   * HistorialAcademico findFirst
   */
  export type HistorialAcademicoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    /**
     * Filter, which HistorialAcademico to fetch.
     */
    where?: HistorialAcademicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistorialAcademicos to fetch.
     */
    orderBy?: HistorialAcademicoOrderByWithRelationInput | HistorialAcademicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistorialAcademicos.
     */
    cursor?: HistorialAcademicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistorialAcademicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistorialAcademicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistorialAcademicos.
     */
    distinct?: HistorialAcademicoScalarFieldEnum | HistorialAcademicoScalarFieldEnum[]
  }

  /**
   * HistorialAcademico findFirstOrThrow
   */
  export type HistorialAcademicoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    /**
     * Filter, which HistorialAcademico to fetch.
     */
    where?: HistorialAcademicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistorialAcademicos to fetch.
     */
    orderBy?: HistorialAcademicoOrderByWithRelationInput | HistorialAcademicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistorialAcademicos.
     */
    cursor?: HistorialAcademicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistorialAcademicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistorialAcademicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistorialAcademicos.
     */
    distinct?: HistorialAcademicoScalarFieldEnum | HistorialAcademicoScalarFieldEnum[]
  }

  /**
   * HistorialAcademico findMany
   */
  export type HistorialAcademicoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    /**
     * Filter, which HistorialAcademicos to fetch.
     */
    where?: HistorialAcademicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistorialAcademicos to fetch.
     */
    orderBy?: HistorialAcademicoOrderByWithRelationInput | HistorialAcademicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HistorialAcademicos.
     */
    cursor?: HistorialAcademicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistorialAcademicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistorialAcademicos.
     */
    skip?: number
    distinct?: HistorialAcademicoScalarFieldEnum | HistorialAcademicoScalarFieldEnum[]
  }

  /**
   * HistorialAcademico create
   */
  export type HistorialAcademicoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    /**
     * The data needed to create a HistorialAcademico.
     */
    data: XOR<HistorialAcademicoCreateInput, HistorialAcademicoUncheckedCreateInput>
  }

  /**
   * HistorialAcademico createMany
   */
  export type HistorialAcademicoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HistorialAcademicos.
     */
    data: HistorialAcademicoCreateManyInput | HistorialAcademicoCreateManyInput[]
  }

  /**
   * HistorialAcademico createManyAndReturn
   */
  export type HistorialAcademicoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many HistorialAcademicos.
     */
    data: HistorialAcademicoCreateManyInput | HistorialAcademicoCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HistorialAcademico update
   */
  export type HistorialAcademicoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    /**
     * The data needed to update a HistorialAcademico.
     */
    data: XOR<HistorialAcademicoUpdateInput, HistorialAcademicoUncheckedUpdateInput>
    /**
     * Choose, which HistorialAcademico to update.
     */
    where: HistorialAcademicoWhereUniqueInput
  }

  /**
   * HistorialAcademico updateMany
   */
  export type HistorialAcademicoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HistorialAcademicos.
     */
    data: XOR<HistorialAcademicoUpdateManyMutationInput, HistorialAcademicoUncheckedUpdateManyInput>
    /**
     * Filter which HistorialAcademicos to update
     */
    where?: HistorialAcademicoWhereInput
  }

  /**
   * HistorialAcademico upsert
   */
  export type HistorialAcademicoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    /**
     * The filter to search for the HistorialAcademico to update in case it exists.
     */
    where: HistorialAcademicoWhereUniqueInput
    /**
     * In case the HistorialAcademico found by the `where` argument doesn't exist, create a new HistorialAcademico with this data.
     */
    create: XOR<HistorialAcademicoCreateInput, HistorialAcademicoUncheckedCreateInput>
    /**
     * In case the HistorialAcademico was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HistorialAcademicoUpdateInput, HistorialAcademicoUncheckedUpdateInput>
  }

  /**
   * HistorialAcademico delete
   */
  export type HistorialAcademicoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
    /**
     * Filter which HistorialAcademico to delete.
     */
    where: HistorialAcademicoWhereUniqueInput
  }

  /**
   * HistorialAcademico deleteMany
   */
  export type HistorialAcademicoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistorialAcademicos to delete
     */
    where?: HistorialAcademicoWhereInput
  }

  /**
   * HistorialAcademico without action
   */
  export type HistorialAcademicoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistorialAcademico
     */
    select?: HistorialAcademicoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistorialAcademicoInclude<ExtArgs> | null
  }


  /**
   * Model DiagnosticResult
   */

  export type AggregateDiagnosticResult = {
    _count: DiagnosticResultCountAggregateOutputType | null
    _avg: DiagnosticResultAvgAggregateOutputType | null
    _sum: DiagnosticResultSumAggregateOutputType | null
    _min: DiagnosticResultMinAggregateOutputType | null
    _max: DiagnosticResultMaxAggregateOutputType | null
  }

  export type DiagnosticResultAvgAggregateOutputType = {
    id: number | null
    codigo_qr_id: number | null
  }

  export type DiagnosticResultSumAggregateOutputType = {
    id: number | null
    codigo_qr_id: number | null
  }

  export type DiagnosticResultMinAggregateOutputType = {
    id: number | null
    tipo: string | null
    codigo_qr_id: number | null
    descripcion: string | null
    reparado: boolean | null
    reparado_en: Date | null
    timestamp: Date | null
  }

  export type DiagnosticResultMaxAggregateOutputType = {
    id: number | null
    tipo: string | null
    codigo_qr_id: number | null
    descripcion: string | null
    reparado: boolean | null
    reparado_en: Date | null
    timestamp: Date | null
  }

  export type DiagnosticResultCountAggregateOutputType = {
    id: number
    tipo: number
    codigo_qr_id: number
    descripcion: number
    reparado: number
    reparado_en: number
    timestamp: number
    _all: number
  }


  export type DiagnosticResultAvgAggregateInputType = {
    id?: true
    codigo_qr_id?: true
  }

  export type DiagnosticResultSumAggregateInputType = {
    id?: true
    codigo_qr_id?: true
  }

  export type DiagnosticResultMinAggregateInputType = {
    id?: true
    tipo?: true
    codigo_qr_id?: true
    descripcion?: true
    reparado?: true
    reparado_en?: true
    timestamp?: true
  }

  export type DiagnosticResultMaxAggregateInputType = {
    id?: true
    tipo?: true
    codigo_qr_id?: true
    descripcion?: true
    reparado?: true
    reparado_en?: true
    timestamp?: true
  }

  export type DiagnosticResultCountAggregateInputType = {
    id?: true
    tipo?: true
    codigo_qr_id?: true
    descripcion?: true
    reparado?: true
    reparado_en?: true
    timestamp?: true
    _all?: true
  }

  export type DiagnosticResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiagnosticResult to aggregate.
     */
    where?: DiagnosticResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosticResults to fetch.
     */
    orderBy?: DiagnosticResultOrderByWithRelationInput | DiagnosticResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiagnosticResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosticResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosticResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiagnosticResults
    **/
    _count?: true | DiagnosticResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DiagnosticResultAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DiagnosticResultSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiagnosticResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiagnosticResultMaxAggregateInputType
  }

  export type GetDiagnosticResultAggregateType<T extends DiagnosticResultAggregateArgs> = {
        [P in keyof T & keyof AggregateDiagnosticResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiagnosticResult[P]>
      : GetScalarType<T[P], AggregateDiagnosticResult[P]>
  }




  export type DiagnosticResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiagnosticResultWhereInput
    orderBy?: DiagnosticResultOrderByWithAggregationInput | DiagnosticResultOrderByWithAggregationInput[]
    by: DiagnosticResultScalarFieldEnum[] | DiagnosticResultScalarFieldEnum
    having?: DiagnosticResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiagnosticResultCountAggregateInputType | true
    _avg?: DiagnosticResultAvgAggregateInputType
    _sum?: DiagnosticResultSumAggregateInputType
    _min?: DiagnosticResultMinAggregateInputType
    _max?: DiagnosticResultMaxAggregateInputType
  }

  export type DiagnosticResultGroupByOutputType = {
    id: number
    tipo: string
    codigo_qr_id: number | null
    descripcion: string
    reparado: boolean
    reparado_en: Date | null
    timestamp: Date
    _count: DiagnosticResultCountAggregateOutputType | null
    _avg: DiagnosticResultAvgAggregateOutputType | null
    _sum: DiagnosticResultSumAggregateOutputType | null
    _min: DiagnosticResultMinAggregateOutputType | null
    _max: DiagnosticResultMaxAggregateOutputType | null
  }

  type GetDiagnosticResultGroupByPayload<T extends DiagnosticResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiagnosticResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiagnosticResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiagnosticResultGroupByOutputType[P]>
            : GetScalarType<T[P], DiagnosticResultGroupByOutputType[P]>
        }
      >
    >


  export type DiagnosticResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    codigo_qr_id?: boolean
    descripcion?: boolean
    reparado?: boolean
    reparado_en?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["diagnosticResult"]>

  export type DiagnosticResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tipo?: boolean
    codigo_qr_id?: boolean
    descripcion?: boolean
    reparado?: boolean
    reparado_en?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["diagnosticResult"]>

  export type DiagnosticResultSelectScalar = {
    id?: boolean
    tipo?: boolean
    codigo_qr_id?: boolean
    descripcion?: boolean
    reparado?: boolean
    reparado_en?: boolean
    timestamp?: boolean
  }


  export type $DiagnosticResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiagnosticResult"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      tipo: string
      codigo_qr_id: number | null
      descripcion: string
      reparado: boolean
      reparado_en: Date | null
      timestamp: Date
    }, ExtArgs["result"]["diagnosticResult"]>
    composites: {}
  }

  type DiagnosticResultGetPayload<S extends boolean | null | undefined | DiagnosticResultDefaultArgs> = $Result.GetResult<Prisma.$DiagnosticResultPayload, S>

  type DiagnosticResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DiagnosticResultFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DiagnosticResultCountAggregateInputType | true
    }

  export interface DiagnosticResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiagnosticResult'], meta: { name: 'DiagnosticResult' } }
    /**
     * Find zero or one DiagnosticResult that matches the filter.
     * @param {DiagnosticResultFindUniqueArgs} args - Arguments to find a DiagnosticResult
     * @example
     * // Get one DiagnosticResult
     * const diagnosticResult = await prisma.diagnosticResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiagnosticResultFindUniqueArgs>(args: SelectSubset<T, DiagnosticResultFindUniqueArgs<ExtArgs>>): Prisma__DiagnosticResultClient<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DiagnosticResult that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DiagnosticResultFindUniqueOrThrowArgs} args - Arguments to find a DiagnosticResult
     * @example
     * // Get one DiagnosticResult
     * const diagnosticResult = await prisma.diagnosticResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiagnosticResultFindUniqueOrThrowArgs>(args: SelectSubset<T, DiagnosticResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiagnosticResultClient<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DiagnosticResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticResultFindFirstArgs} args - Arguments to find a DiagnosticResult
     * @example
     * // Get one DiagnosticResult
     * const diagnosticResult = await prisma.diagnosticResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiagnosticResultFindFirstArgs>(args?: SelectSubset<T, DiagnosticResultFindFirstArgs<ExtArgs>>): Prisma__DiagnosticResultClient<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DiagnosticResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticResultFindFirstOrThrowArgs} args - Arguments to find a DiagnosticResult
     * @example
     * // Get one DiagnosticResult
     * const diagnosticResult = await prisma.diagnosticResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiagnosticResultFindFirstOrThrowArgs>(args?: SelectSubset<T, DiagnosticResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiagnosticResultClient<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DiagnosticResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiagnosticResults
     * const diagnosticResults = await prisma.diagnosticResult.findMany()
     * 
     * // Get first 10 DiagnosticResults
     * const diagnosticResults = await prisma.diagnosticResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diagnosticResultWithIdOnly = await prisma.diagnosticResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiagnosticResultFindManyArgs>(args?: SelectSubset<T, DiagnosticResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DiagnosticResult.
     * @param {DiagnosticResultCreateArgs} args - Arguments to create a DiagnosticResult.
     * @example
     * // Create one DiagnosticResult
     * const DiagnosticResult = await prisma.diagnosticResult.create({
     *   data: {
     *     // ... data to create a DiagnosticResult
     *   }
     * })
     * 
     */
    create<T extends DiagnosticResultCreateArgs>(args: SelectSubset<T, DiagnosticResultCreateArgs<ExtArgs>>): Prisma__DiagnosticResultClient<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DiagnosticResults.
     * @param {DiagnosticResultCreateManyArgs} args - Arguments to create many DiagnosticResults.
     * @example
     * // Create many DiagnosticResults
     * const diagnosticResult = await prisma.diagnosticResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiagnosticResultCreateManyArgs>(args?: SelectSubset<T, DiagnosticResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiagnosticResults and returns the data saved in the database.
     * @param {DiagnosticResultCreateManyAndReturnArgs} args - Arguments to create many DiagnosticResults.
     * @example
     * // Create many DiagnosticResults
     * const diagnosticResult = await prisma.diagnosticResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiagnosticResults and only return the `id`
     * const diagnosticResultWithIdOnly = await prisma.diagnosticResult.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiagnosticResultCreateManyAndReturnArgs>(args?: SelectSubset<T, DiagnosticResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DiagnosticResult.
     * @param {DiagnosticResultDeleteArgs} args - Arguments to delete one DiagnosticResult.
     * @example
     * // Delete one DiagnosticResult
     * const DiagnosticResult = await prisma.diagnosticResult.delete({
     *   where: {
     *     // ... filter to delete one DiagnosticResult
     *   }
     * })
     * 
     */
    delete<T extends DiagnosticResultDeleteArgs>(args: SelectSubset<T, DiagnosticResultDeleteArgs<ExtArgs>>): Prisma__DiagnosticResultClient<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DiagnosticResult.
     * @param {DiagnosticResultUpdateArgs} args - Arguments to update one DiagnosticResult.
     * @example
     * // Update one DiagnosticResult
     * const diagnosticResult = await prisma.diagnosticResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiagnosticResultUpdateArgs>(args: SelectSubset<T, DiagnosticResultUpdateArgs<ExtArgs>>): Prisma__DiagnosticResultClient<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DiagnosticResults.
     * @param {DiagnosticResultDeleteManyArgs} args - Arguments to filter DiagnosticResults to delete.
     * @example
     * // Delete a few DiagnosticResults
     * const { count } = await prisma.diagnosticResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiagnosticResultDeleteManyArgs>(args?: SelectSubset<T, DiagnosticResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiagnosticResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiagnosticResults
     * const diagnosticResult = await prisma.diagnosticResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiagnosticResultUpdateManyArgs>(args: SelectSubset<T, DiagnosticResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DiagnosticResult.
     * @param {DiagnosticResultUpsertArgs} args - Arguments to update or create a DiagnosticResult.
     * @example
     * // Update or create a DiagnosticResult
     * const diagnosticResult = await prisma.diagnosticResult.upsert({
     *   create: {
     *     // ... data to create a DiagnosticResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiagnosticResult we want to update
     *   }
     * })
     */
    upsert<T extends DiagnosticResultUpsertArgs>(args: SelectSubset<T, DiagnosticResultUpsertArgs<ExtArgs>>): Prisma__DiagnosticResultClient<$Result.GetResult<Prisma.$DiagnosticResultPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DiagnosticResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticResultCountArgs} args - Arguments to filter DiagnosticResults to count.
     * @example
     * // Count the number of DiagnosticResults
     * const count = await prisma.diagnosticResult.count({
     *   where: {
     *     // ... the filter for the DiagnosticResults we want to count
     *   }
     * })
    **/
    count<T extends DiagnosticResultCountArgs>(
      args?: Subset<T, DiagnosticResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiagnosticResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiagnosticResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DiagnosticResultAggregateArgs>(args: Subset<T, DiagnosticResultAggregateArgs>): Prisma.PrismaPromise<GetDiagnosticResultAggregateType<T>>

    /**
     * Group by DiagnosticResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosticResultGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DiagnosticResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiagnosticResultGroupByArgs['orderBy'] }
        : { orderBy?: DiagnosticResultGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DiagnosticResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiagnosticResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiagnosticResult model
   */
  readonly fields: DiagnosticResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiagnosticResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiagnosticResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DiagnosticResult model
   */ 
  interface DiagnosticResultFieldRefs {
    readonly id: FieldRef<"DiagnosticResult", 'Int'>
    readonly tipo: FieldRef<"DiagnosticResult", 'String'>
    readonly codigo_qr_id: FieldRef<"DiagnosticResult", 'Int'>
    readonly descripcion: FieldRef<"DiagnosticResult", 'String'>
    readonly reparado: FieldRef<"DiagnosticResult", 'Boolean'>
    readonly reparado_en: FieldRef<"DiagnosticResult", 'DateTime'>
    readonly timestamp: FieldRef<"DiagnosticResult", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiagnosticResult findUnique
   */
  export type DiagnosticResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticResult to fetch.
     */
    where: DiagnosticResultWhereUniqueInput
  }

  /**
   * DiagnosticResult findUniqueOrThrow
   */
  export type DiagnosticResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticResult to fetch.
     */
    where: DiagnosticResultWhereUniqueInput
  }

  /**
   * DiagnosticResult findFirst
   */
  export type DiagnosticResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticResult to fetch.
     */
    where?: DiagnosticResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosticResults to fetch.
     */
    orderBy?: DiagnosticResultOrderByWithRelationInput | DiagnosticResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiagnosticResults.
     */
    cursor?: DiagnosticResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosticResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosticResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiagnosticResults.
     */
    distinct?: DiagnosticResultScalarFieldEnum | DiagnosticResultScalarFieldEnum[]
  }

  /**
   * DiagnosticResult findFirstOrThrow
   */
  export type DiagnosticResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticResult to fetch.
     */
    where?: DiagnosticResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosticResults to fetch.
     */
    orderBy?: DiagnosticResultOrderByWithRelationInput | DiagnosticResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiagnosticResults.
     */
    cursor?: DiagnosticResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosticResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosticResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiagnosticResults.
     */
    distinct?: DiagnosticResultScalarFieldEnum | DiagnosticResultScalarFieldEnum[]
  }

  /**
   * DiagnosticResult findMany
   */
  export type DiagnosticResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
    /**
     * Filter, which DiagnosticResults to fetch.
     */
    where?: DiagnosticResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosticResults to fetch.
     */
    orderBy?: DiagnosticResultOrderByWithRelationInput | DiagnosticResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiagnosticResults.
     */
    cursor?: DiagnosticResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosticResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosticResults.
     */
    skip?: number
    distinct?: DiagnosticResultScalarFieldEnum | DiagnosticResultScalarFieldEnum[]
  }

  /**
   * DiagnosticResult create
   */
  export type DiagnosticResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
    /**
     * The data needed to create a DiagnosticResult.
     */
    data: XOR<DiagnosticResultCreateInput, DiagnosticResultUncheckedCreateInput>
  }

  /**
   * DiagnosticResult createMany
   */
  export type DiagnosticResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiagnosticResults.
     */
    data: DiagnosticResultCreateManyInput | DiagnosticResultCreateManyInput[]
  }

  /**
   * DiagnosticResult createManyAndReturn
   */
  export type DiagnosticResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DiagnosticResults.
     */
    data: DiagnosticResultCreateManyInput | DiagnosticResultCreateManyInput[]
  }

  /**
   * DiagnosticResult update
   */
  export type DiagnosticResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
    /**
     * The data needed to update a DiagnosticResult.
     */
    data: XOR<DiagnosticResultUpdateInput, DiagnosticResultUncheckedUpdateInput>
    /**
     * Choose, which DiagnosticResult to update.
     */
    where: DiagnosticResultWhereUniqueInput
  }

  /**
   * DiagnosticResult updateMany
   */
  export type DiagnosticResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiagnosticResults.
     */
    data: XOR<DiagnosticResultUpdateManyMutationInput, DiagnosticResultUncheckedUpdateManyInput>
    /**
     * Filter which DiagnosticResults to update
     */
    where?: DiagnosticResultWhereInput
  }

  /**
   * DiagnosticResult upsert
   */
  export type DiagnosticResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
    /**
     * The filter to search for the DiagnosticResult to update in case it exists.
     */
    where: DiagnosticResultWhereUniqueInput
    /**
     * In case the DiagnosticResult found by the `where` argument doesn't exist, create a new DiagnosticResult with this data.
     */
    create: XOR<DiagnosticResultCreateInput, DiagnosticResultUncheckedCreateInput>
    /**
     * In case the DiagnosticResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiagnosticResultUpdateInput, DiagnosticResultUncheckedUpdateInput>
  }

  /**
   * DiagnosticResult delete
   */
  export type DiagnosticResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
    /**
     * Filter which DiagnosticResult to delete.
     */
    where: DiagnosticResultWhereUniqueInput
  }

  /**
   * DiagnosticResult deleteMany
   */
  export type DiagnosticResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiagnosticResults to delete
     */
    where?: DiagnosticResultWhereInput
  }

  /**
   * DiagnosticResult without action
   */
  export type DiagnosticResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosticResult
     */
    select?: DiagnosticResultSelect<ExtArgs> | null
  }


  /**
   * Model Equipo
   */

  export type AggregateEquipo = {
    _count: EquipoCountAggregateOutputType | null
    _avg: EquipoAvgAggregateOutputType | null
    _sum: EquipoSumAggregateOutputType | null
    _min: EquipoMinAggregateOutputType | null
    _max: EquipoMaxAggregateOutputType | null
  }

  export type EquipoAvgAggregateOutputType = {
    id: number | null
  }

  export type EquipoSumAggregateOutputType = {
    id: number | null
  }

  export type EquipoMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    hostname: string | null
    ip: string | null
    os: string | null
    mac_address: string | null
    aprobado: boolean | null
    clave_seguridad: string | null
    ultima_conexion: Date | null
    creado_en: Date | null
    actualizado_en: Date | null
  }

  export type EquipoMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    hostname: string | null
    ip: string | null
    os: string | null
    mac_address: string | null
    aprobado: boolean | null
    clave_seguridad: string | null
    ultima_conexion: Date | null
    creado_en: Date | null
    actualizado_en: Date | null
  }

  export type EquipoCountAggregateOutputType = {
    id: number
    nombre: number
    hostname: number
    ip: number
    os: number
    mac_address: number
    aprobado: number
    clave_seguridad: number
    ultima_conexion: number
    creado_en: number
    actualizado_en: number
    _all: number
  }


  export type EquipoAvgAggregateInputType = {
    id?: true
  }

  export type EquipoSumAggregateInputType = {
    id?: true
  }

  export type EquipoMinAggregateInputType = {
    id?: true
    nombre?: true
    hostname?: true
    ip?: true
    os?: true
    mac_address?: true
    aprobado?: true
    clave_seguridad?: true
    ultima_conexion?: true
    creado_en?: true
    actualizado_en?: true
  }

  export type EquipoMaxAggregateInputType = {
    id?: true
    nombre?: true
    hostname?: true
    ip?: true
    os?: true
    mac_address?: true
    aprobado?: true
    clave_seguridad?: true
    ultima_conexion?: true
    creado_en?: true
    actualizado_en?: true
  }

  export type EquipoCountAggregateInputType = {
    id?: true
    nombre?: true
    hostname?: true
    ip?: true
    os?: true
    mac_address?: true
    aprobado?: true
    clave_seguridad?: true
    ultima_conexion?: true
    creado_en?: true
    actualizado_en?: true
    _all?: true
  }

  export type EquipoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Equipo to aggregate.
     */
    where?: EquipoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Equipos to fetch.
     */
    orderBy?: EquipoOrderByWithRelationInput | EquipoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EquipoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Equipos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Equipos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Equipos
    **/
    _count?: true | EquipoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EquipoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EquipoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EquipoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EquipoMaxAggregateInputType
  }

  export type GetEquipoAggregateType<T extends EquipoAggregateArgs> = {
        [P in keyof T & keyof AggregateEquipo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEquipo[P]>
      : GetScalarType<T[P], AggregateEquipo[P]>
  }




  export type EquipoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EquipoWhereInput
    orderBy?: EquipoOrderByWithAggregationInput | EquipoOrderByWithAggregationInput[]
    by: EquipoScalarFieldEnum[] | EquipoScalarFieldEnum
    having?: EquipoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EquipoCountAggregateInputType | true
    _avg?: EquipoAvgAggregateInputType
    _sum?: EquipoSumAggregateInputType
    _min?: EquipoMinAggregateInputType
    _max?: EquipoMaxAggregateInputType
  }

  export type EquipoGroupByOutputType = {
    id: number
    nombre: string | null
    hostname: string | null
    ip: string
    os: string | null
    mac_address: string | null
    aprobado: boolean
    clave_seguridad: string
    ultima_conexion: Date
    creado_en: Date
    actualizado_en: Date
    _count: EquipoCountAggregateOutputType | null
    _avg: EquipoAvgAggregateOutputType | null
    _sum: EquipoSumAggregateOutputType | null
    _min: EquipoMinAggregateOutputType | null
    _max: EquipoMaxAggregateOutputType | null
  }

  type GetEquipoGroupByPayload<T extends EquipoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EquipoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EquipoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EquipoGroupByOutputType[P]>
            : GetScalarType<T[P], EquipoGroupByOutputType[P]>
        }
      >
    >


  export type EquipoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    hostname?: boolean
    ip?: boolean
    os?: boolean
    mac_address?: boolean
    aprobado?: boolean
    clave_seguridad?: boolean
    ultima_conexion?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
  }, ExtArgs["result"]["equipo"]>

  export type EquipoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    hostname?: boolean
    ip?: boolean
    os?: boolean
    mac_address?: boolean
    aprobado?: boolean
    clave_seguridad?: boolean
    ultima_conexion?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
  }, ExtArgs["result"]["equipo"]>

  export type EquipoSelectScalar = {
    id?: boolean
    nombre?: boolean
    hostname?: boolean
    ip?: boolean
    os?: boolean
    mac_address?: boolean
    aprobado?: boolean
    clave_seguridad?: boolean
    ultima_conexion?: boolean
    creado_en?: boolean
    actualizado_en?: boolean
  }


  export type $EquipoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Equipo"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nombre: string | null
      hostname: string | null
      ip: string
      os: string | null
      mac_address: string | null
      aprobado: boolean
      clave_seguridad: string
      ultima_conexion: Date
      creado_en: Date
      actualizado_en: Date
    }, ExtArgs["result"]["equipo"]>
    composites: {}
  }

  type EquipoGetPayload<S extends boolean | null | undefined | EquipoDefaultArgs> = $Result.GetResult<Prisma.$EquipoPayload, S>

  type EquipoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EquipoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EquipoCountAggregateInputType | true
    }

  export interface EquipoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Equipo'], meta: { name: 'Equipo' } }
    /**
     * Find zero or one Equipo that matches the filter.
     * @param {EquipoFindUniqueArgs} args - Arguments to find a Equipo
     * @example
     * // Get one Equipo
     * const equipo = await prisma.equipo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EquipoFindUniqueArgs>(args: SelectSubset<T, EquipoFindUniqueArgs<ExtArgs>>): Prisma__EquipoClient<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Equipo that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EquipoFindUniqueOrThrowArgs} args - Arguments to find a Equipo
     * @example
     * // Get one Equipo
     * const equipo = await prisma.equipo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EquipoFindUniqueOrThrowArgs>(args: SelectSubset<T, EquipoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EquipoClient<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Equipo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipoFindFirstArgs} args - Arguments to find a Equipo
     * @example
     * // Get one Equipo
     * const equipo = await prisma.equipo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EquipoFindFirstArgs>(args?: SelectSubset<T, EquipoFindFirstArgs<ExtArgs>>): Prisma__EquipoClient<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Equipo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipoFindFirstOrThrowArgs} args - Arguments to find a Equipo
     * @example
     * // Get one Equipo
     * const equipo = await prisma.equipo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EquipoFindFirstOrThrowArgs>(args?: SelectSubset<T, EquipoFindFirstOrThrowArgs<ExtArgs>>): Prisma__EquipoClient<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Equipos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Equipos
     * const equipos = await prisma.equipo.findMany()
     * 
     * // Get first 10 Equipos
     * const equipos = await prisma.equipo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const equipoWithIdOnly = await prisma.equipo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EquipoFindManyArgs>(args?: SelectSubset<T, EquipoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Equipo.
     * @param {EquipoCreateArgs} args - Arguments to create a Equipo.
     * @example
     * // Create one Equipo
     * const Equipo = await prisma.equipo.create({
     *   data: {
     *     // ... data to create a Equipo
     *   }
     * })
     * 
     */
    create<T extends EquipoCreateArgs>(args: SelectSubset<T, EquipoCreateArgs<ExtArgs>>): Prisma__EquipoClient<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Equipos.
     * @param {EquipoCreateManyArgs} args - Arguments to create many Equipos.
     * @example
     * // Create many Equipos
     * const equipo = await prisma.equipo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EquipoCreateManyArgs>(args?: SelectSubset<T, EquipoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Equipos and returns the data saved in the database.
     * @param {EquipoCreateManyAndReturnArgs} args - Arguments to create many Equipos.
     * @example
     * // Create many Equipos
     * const equipo = await prisma.equipo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Equipos and only return the `id`
     * const equipoWithIdOnly = await prisma.equipo.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EquipoCreateManyAndReturnArgs>(args?: SelectSubset<T, EquipoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Equipo.
     * @param {EquipoDeleteArgs} args - Arguments to delete one Equipo.
     * @example
     * // Delete one Equipo
     * const Equipo = await prisma.equipo.delete({
     *   where: {
     *     // ... filter to delete one Equipo
     *   }
     * })
     * 
     */
    delete<T extends EquipoDeleteArgs>(args: SelectSubset<T, EquipoDeleteArgs<ExtArgs>>): Prisma__EquipoClient<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Equipo.
     * @param {EquipoUpdateArgs} args - Arguments to update one Equipo.
     * @example
     * // Update one Equipo
     * const equipo = await prisma.equipo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EquipoUpdateArgs>(args: SelectSubset<T, EquipoUpdateArgs<ExtArgs>>): Prisma__EquipoClient<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Equipos.
     * @param {EquipoDeleteManyArgs} args - Arguments to filter Equipos to delete.
     * @example
     * // Delete a few Equipos
     * const { count } = await prisma.equipo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EquipoDeleteManyArgs>(args?: SelectSubset<T, EquipoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Equipos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Equipos
     * const equipo = await prisma.equipo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EquipoUpdateManyArgs>(args: SelectSubset<T, EquipoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Equipo.
     * @param {EquipoUpsertArgs} args - Arguments to update or create a Equipo.
     * @example
     * // Update or create a Equipo
     * const equipo = await prisma.equipo.upsert({
     *   create: {
     *     // ... data to create a Equipo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Equipo we want to update
     *   }
     * })
     */
    upsert<T extends EquipoUpsertArgs>(args: SelectSubset<T, EquipoUpsertArgs<ExtArgs>>): Prisma__EquipoClient<$Result.GetResult<Prisma.$EquipoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Equipos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipoCountArgs} args - Arguments to filter Equipos to count.
     * @example
     * // Count the number of Equipos
     * const count = await prisma.equipo.count({
     *   where: {
     *     // ... the filter for the Equipos we want to count
     *   }
     * })
    **/
    count<T extends EquipoCountArgs>(
      args?: Subset<T, EquipoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EquipoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Equipo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EquipoAggregateArgs>(args: Subset<T, EquipoAggregateArgs>): Prisma.PrismaPromise<GetEquipoAggregateType<T>>

    /**
     * Group by Equipo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EquipoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EquipoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EquipoGroupByArgs['orderBy'] }
        : { orderBy?: EquipoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EquipoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEquipoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Equipo model
   */
  readonly fields: EquipoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Equipo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EquipoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Equipo model
   */ 
  interface EquipoFieldRefs {
    readonly id: FieldRef<"Equipo", 'Int'>
    readonly nombre: FieldRef<"Equipo", 'String'>
    readonly hostname: FieldRef<"Equipo", 'String'>
    readonly ip: FieldRef<"Equipo", 'String'>
    readonly os: FieldRef<"Equipo", 'String'>
    readonly mac_address: FieldRef<"Equipo", 'String'>
    readonly aprobado: FieldRef<"Equipo", 'Boolean'>
    readonly clave_seguridad: FieldRef<"Equipo", 'String'>
    readonly ultima_conexion: FieldRef<"Equipo", 'DateTime'>
    readonly creado_en: FieldRef<"Equipo", 'DateTime'>
    readonly actualizado_en: FieldRef<"Equipo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Equipo findUnique
   */
  export type EquipoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
    /**
     * Filter, which Equipo to fetch.
     */
    where: EquipoWhereUniqueInput
  }

  /**
   * Equipo findUniqueOrThrow
   */
  export type EquipoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
    /**
     * Filter, which Equipo to fetch.
     */
    where: EquipoWhereUniqueInput
  }

  /**
   * Equipo findFirst
   */
  export type EquipoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
    /**
     * Filter, which Equipo to fetch.
     */
    where?: EquipoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Equipos to fetch.
     */
    orderBy?: EquipoOrderByWithRelationInput | EquipoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Equipos.
     */
    cursor?: EquipoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Equipos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Equipos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Equipos.
     */
    distinct?: EquipoScalarFieldEnum | EquipoScalarFieldEnum[]
  }

  /**
   * Equipo findFirstOrThrow
   */
  export type EquipoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
    /**
     * Filter, which Equipo to fetch.
     */
    where?: EquipoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Equipos to fetch.
     */
    orderBy?: EquipoOrderByWithRelationInput | EquipoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Equipos.
     */
    cursor?: EquipoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Equipos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Equipos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Equipos.
     */
    distinct?: EquipoScalarFieldEnum | EquipoScalarFieldEnum[]
  }

  /**
   * Equipo findMany
   */
  export type EquipoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
    /**
     * Filter, which Equipos to fetch.
     */
    where?: EquipoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Equipos to fetch.
     */
    orderBy?: EquipoOrderByWithRelationInput | EquipoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Equipos.
     */
    cursor?: EquipoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Equipos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Equipos.
     */
    skip?: number
    distinct?: EquipoScalarFieldEnum | EquipoScalarFieldEnum[]
  }

  /**
   * Equipo create
   */
  export type EquipoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
    /**
     * The data needed to create a Equipo.
     */
    data: XOR<EquipoCreateInput, EquipoUncheckedCreateInput>
  }

  /**
   * Equipo createMany
   */
  export type EquipoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Equipos.
     */
    data: EquipoCreateManyInput | EquipoCreateManyInput[]
  }

  /**
   * Equipo createManyAndReturn
   */
  export type EquipoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Equipos.
     */
    data: EquipoCreateManyInput | EquipoCreateManyInput[]
  }

  /**
   * Equipo update
   */
  export type EquipoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
    /**
     * The data needed to update a Equipo.
     */
    data: XOR<EquipoUpdateInput, EquipoUncheckedUpdateInput>
    /**
     * Choose, which Equipo to update.
     */
    where: EquipoWhereUniqueInput
  }

  /**
   * Equipo updateMany
   */
  export type EquipoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Equipos.
     */
    data: XOR<EquipoUpdateManyMutationInput, EquipoUncheckedUpdateManyInput>
    /**
     * Filter which Equipos to update
     */
    where?: EquipoWhereInput
  }

  /**
   * Equipo upsert
   */
  export type EquipoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
    /**
     * The filter to search for the Equipo to update in case it exists.
     */
    where: EquipoWhereUniqueInput
    /**
     * In case the Equipo found by the `where` argument doesn't exist, create a new Equipo with this data.
     */
    create: XOR<EquipoCreateInput, EquipoUncheckedCreateInput>
    /**
     * In case the Equipo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EquipoUpdateInput, EquipoUncheckedUpdateInput>
  }

  /**
   * Equipo delete
   */
  export type EquipoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
    /**
     * Filter which Equipo to delete.
     */
    where: EquipoWhereUniqueInput
  }

  /**
   * Equipo deleteMany
   */
  export type EquipoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Equipos to delete
     */
    where?: EquipoWhereInput
  }

  /**
   * Equipo without action
   */
  export type EquipoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Equipo
     */
    select?: EquipoSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const InstitucionScalarFieldEnum: {
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

  export type InstitucionScalarFieldEnum = (typeof InstitucionScalarFieldEnum)[keyof typeof InstitucionScalarFieldEnum]


  export const AlumnoScalarFieldEnum: {
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

  export type AlumnoScalarFieldEnum = (typeof AlumnoScalarFieldEnum)[keyof typeof AlumnoScalarFieldEnum]


  export const PersonalScalarFieldEnum: {
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

  export type PersonalScalarFieldEnum = (typeof PersonalScalarFieldEnum)[keyof typeof PersonalScalarFieldEnum]


  export const CodigoQrScalarFieldEnum: {
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

  export type CodigoQrScalarFieldEnum = (typeof CodigoQrScalarFieldEnum)[keyof typeof CodigoQrScalarFieldEnum]


  export const AsistenciaScalarFieldEnum: {
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

  export type AsistenciaScalarFieldEnum = (typeof AsistenciaScalarFieldEnum)[keyof typeof AsistenciaScalarFieldEnum]


  export const UsuarioScalarFieldEnum: {
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

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const AuditoriaScalarFieldEnum: {
    id: 'id',
    entidad: 'entidad',
    entidad_id: 'entidad_id',
    usuario_id: 'usuario_id',
    accion: 'accion',
    detalle: 'detalle',
    timestamp: 'timestamp'
  };

  export type AuditoriaScalarFieldEnum = (typeof AuditoriaScalarFieldEnum)[keyof typeof AuditoriaScalarFieldEnum]


  export const ExcusaScalarFieldEnum: {
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

  export type ExcusaScalarFieldEnum = (typeof ExcusaScalarFieldEnum)[keyof typeof ExcusaScalarFieldEnum]


  export const HistorialAcademicoScalarFieldEnum: {
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

  export type HistorialAcademicoScalarFieldEnum = (typeof HistorialAcademicoScalarFieldEnum)[keyof typeof HistorialAcademicoScalarFieldEnum]


  export const DiagnosticResultScalarFieldEnum: {
    id: 'id',
    tipo: 'tipo',
    codigo_qr_id: 'codigo_qr_id',
    descripcion: 'descripcion',
    reparado: 'reparado',
    reparado_en: 'reparado_en',
    timestamp: 'timestamp'
  };

  export type DiagnosticResultScalarFieldEnum = (typeof DiagnosticResultScalarFieldEnum)[keyof typeof DiagnosticResultScalarFieldEnum]


  export const EquipoScalarFieldEnum: {
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

  export type EquipoScalarFieldEnum = (typeof EquipoScalarFieldEnum)[keyof typeof EquipoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type InstitucionWhereInput = {
    AND?: InstitucionWhereInput | InstitucionWhereInput[]
    OR?: InstitucionWhereInput[]
    NOT?: InstitucionWhereInput | InstitucionWhereInput[]
    id?: IntFilter<"Institucion"> | number
    nombre?: StringFilter<"Institucion"> | string
    logo_base64?: StringNullableFilter<"Institucion"> | string | null
    logo_path?: StringNullableFilter<"Institucion"> | string | null
    horario_inicio?: StringNullableFilter<"Institucion"> | string | null
    horario_salida?: StringNullableFilter<"Institucion"> | string | null
    margen_puntualidad_min?: IntFilter<"Institucion"> | number
    direccion?: StringNullableFilter<"Institucion"> | string | null
    pais?: StringNullableFilter<"Institucion"> | string | null
    departamento?: StringNullableFilter<"Institucion"> | string | null
    municipio?: StringNullableFilter<"Institucion"> | string | null
    email?: StringNullableFilter<"Institucion"> | string | null
    telefono?: StringNullableFilter<"Institucion"> | string | null
    ciclo_escolar?: IntFilter<"Institucion"> | number
    inicializado?: BoolFilter<"Institucion"> | boolean
    carnet_counter_personal?: IntFilter<"Institucion"> | number
    carnet_counter_alumnos?: IntFilter<"Institucion"> | number
    creado_en?: DateTimeFilter<"Institucion"> | Date | string
    actualizado_en?: DateTimeFilter<"Institucion"> | Date | string
    master_recovery_key?: StringNullableFilter<"Institucion"> | string | null
  }

  export type InstitucionOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    logo_base64?: SortOrderInput | SortOrder
    logo_path?: SortOrderInput | SortOrder
    horario_inicio?: SortOrderInput | SortOrder
    horario_salida?: SortOrderInput | SortOrder
    margen_puntualidad_min?: SortOrder
    direccion?: SortOrderInput | SortOrder
    pais?: SortOrderInput | SortOrder
    departamento?: SortOrderInput | SortOrder
    municipio?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    telefono?: SortOrderInput | SortOrder
    ciclo_escolar?: SortOrder
    inicializado?: SortOrder
    carnet_counter_personal?: SortOrder
    carnet_counter_alumnos?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    master_recovery_key?: SortOrderInput | SortOrder
  }

  export type InstitucionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: InstitucionWhereInput | InstitucionWhereInput[]
    OR?: InstitucionWhereInput[]
    NOT?: InstitucionWhereInput | InstitucionWhereInput[]
    nombre?: StringFilter<"Institucion"> | string
    logo_base64?: StringNullableFilter<"Institucion"> | string | null
    logo_path?: StringNullableFilter<"Institucion"> | string | null
    horario_inicio?: StringNullableFilter<"Institucion"> | string | null
    horario_salida?: StringNullableFilter<"Institucion"> | string | null
    margen_puntualidad_min?: IntFilter<"Institucion"> | number
    direccion?: StringNullableFilter<"Institucion"> | string | null
    pais?: StringNullableFilter<"Institucion"> | string | null
    departamento?: StringNullableFilter<"Institucion"> | string | null
    municipio?: StringNullableFilter<"Institucion"> | string | null
    email?: StringNullableFilter<"Institucion"> | string | null
    telefono?: StringNullableFilter<"Institucion"> | string | null
    ciclo_escolar?: IntFilter<"Institucion"> | number
    inicializado?: BoolFilter<"Institucion"> | boolean
    carnet_counter_personal?: IntFilter<"Institucion"> | number
    carnet_counter_alumnos?: IntFilter<"Institucion"> | number
    creado_en?: DateTimeFilter<"Institucion"> | Date | string
    actualizado_en?: DateTimeFilter<"Institucion"> | Date | string
    master_recovery_key?: StringNullableFilter<"Institucion"> | string | null
  }, "id">

  export type InstitucionOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    logo_base64?: SortOrderInput | SortOrder
    logo_path?: SortOrderInput | SortOrder
    horario_inicio?: SortOrderInput | SortOrder
    horario_salida?: SortOrderInput | SortOrder
    margen_puntualidad_min?: SortOrder
    direccion?: SortOrderInput | SortOrder
    pais?: SortOrderInput | SortOrder
    departamento?: SortOrderInput | SortOrder
    municipio?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    telefono?: SortOrderInput | SortOrder
    ciclo_escolar?: SortOrder
    inicializado?: SortOrder
    carnet_counter_personal?: SortOrder
    carnet_counter_alumnos?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    master_recovery_key?: SortOrderInput | SortOrder
    _count?: InstitucionCountOrderByAggregateInput
    _avg?: InstitucionAvgOrderByAggregateInput
    _max?: InstitucionMaxOrderByAggregateInput
    _min?: InstitucionMinOrderByAggregateInput
    _sum?: InstitucionSumOrderByAggregateInput
  }

  export type InstitucionScalarWhereWithAggregatesInput = {
    AND?: InstitucionScalarWhereWithAggregatesInput | InstitucionScalarWhereWithAggregatesInput[]
    OR?: InstitucionScalarWhereWithAggregatesInput[]
    NOT?: InstitucionScalarWhereWithAggregatesInput | InstitucionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Institucion"> | number
    nombre?: StringWithAggregatesFilter<"Institucion"> | string
    logo_base64?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    logo_path?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    horario_inicio?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    horario_salida?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    margen_puntualidad_min?: IntWithAggregatesFilter<"Institucion"> | number
    direccion?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    pais?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    departamento?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    municipio?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    email?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    telefono?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
    ciclo_escolar?: IntWithAggregatesFilter<"Institucion"> | number
    inicializado?: BoolWithAggregatesFilter<"Institucion"> | boolean
    carnet_counter_personal?: IntWithAggregatesFilter<"Institucion"> | number
    carnet_counter_alumnos?: IntWithAggregatesFilter<"Institucion"> | number
    creado_en?: DateTimeWithAggregatesFilter<"Institucion"> | Date | string
    actualizado_en?: DateTimeWithAggregatesFilter<"Institucion"> | Date | string
    master_recovery_key?: StringNullableWithAggregatesFilter<"Institucion"> | string | null
  }

  export type AlumnoWhereInput = {
    AND?: AlumnoWhereInput | AlumnoWhereInput[]
    OR?: AlumnoWhereInput[]
    NOT?: AlumnoWhereInput | AlumnoWhereInput[]
    id?: IntFilter<"Alumno"> | number
    carnet?: StringFilter<"Alumno"> | string
    nombres?: StringFilter<"Alumno"> | string
    apellidos?: StringFilter<"Alumno"> | string
    sexo?: StringNullableFilter<"Alumno"> | string | null
    grado?: StringFilter<"Alumno"> | string
    seccion?: StringNullableFilter<"Alumno"> | string | null
    carrera?: StringNullableFilter<"Alumno"> | string | null
    especialidad?: StringNullableFilter<"Alumno"> | string | null
    jornada?: StringNullableFilter<"Alumno"> | string | null
    estado?: StringFilter<"Alumno"> | string
    anio_ingreso?: IntNullableFilter<"Alumno"> | number | null
    anio_graduacion?: IntNullableFilter<"Alumno"> | number | null
    nivel_actual?: StringNullableFilter<"Alumno"> | string | null
    motivo_baja?: StringNullableFilter<"Alumno"> | string | null
    fecha_baja?: DateTimeNullableFilter<"Alumno"> | Date | string | null
    foto_path?: StringNullableFilter<"Alumno"> | string | null
    creado_en?: DateTimeFilter<"Alumno"> | Date | string
    actualizado_en?: DateTimeFilter<"Alumno"> | Date | string
    asistencias?: AsistenciaListRelationFilter
    codigos_qr?: CodigoQrListRelationFilter
    excusas?: ExcusaListRelationFilter
    historial?: HistorialAcademicoListRelationFilter
  }

  export type AlumnoOrderByWithRelationInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrderInput | SortOrder
    grado?: SortOrder
    seccion?: SortOrderInput | SortOrder
    carrera?: SortOrderInput | SortOrder
    especialidad?: SortOrderInput | SortOrder
    jornada?: SortOrderInput | SortOrder
    estado?: SortOrder
    anio_ingreso?: SortOrderInput | SortOrder
    anio_graduacion?: SortOrderInput | SortOrder
    nivel_actual?: SortOrderInput | SortOrder
    motivo_baja?: SortOrderInput | SortOrder
    fecha_baja?: SortOrderInput | SortOrder
    foto_path?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    asistencias?: AsistenciaOrderByRelationAggregateInput
    codigos_qr?: CodigoQrOrderByRelationAggregateInput
    excusas?: ExcusaOrderByRelationAggregateInput
    historial?: HistorialAcademicoOrderByRelationAggregateInput
  }

  export type AlumnoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    carnet?: string
    AND?: AlumnoWhereInput | AlumnoWhereInput[]
    OR?: AlumnoWhereInput[]
    NOT?: AlumnoWhereInput | AlumnoWhereInput[]
    nombres?: StringFilter<"Alumno"> | string
    apellidos?: StringFilter<"Alumno"> | string
    sexo?: StringNullableFilter<"Alumno"> | string | null
    grado?: StringFilter<"Alumno"> | string
    seccion?: StringNullableFilter<"Alumno"> | string | null
    carrera?: StringNullableFilter<"Alumno"> | string | null
    especialidad?: StringNullableFilter<"Alumno"> | string | null
    jornada?: StringNullableFilter<"Alumno"> | string | null
    estado?: StringFilter<"Alumno"> | string
    anio_ingreso?: IntNullableFilter<"Alumno"> | number | null
    anio_graduacion?: IntNullableFilter<"Alumno"> | number | null
    nivel_actual?: StringNullableFilter<"Alumno"> | string | null
    motivo_baja?: StringNullableFilter<"Alumno"> | string | null
    fecha_baja?: DateTimeNullableFilter<"Alumno"> | Date | string | null
    foto_path?: StringNullableFilter<"Alumno"> | string | null
    creado_en?: DateTimeFilter<"Alumno"> | Date | string
    actualizado_en?: DateTimeFilter<"Alumno"> | Date | string
    asistencias?: AsistenciaListRelationFilter
    codigos_qr?: CodigoQrListRelationFilter
    excusas?: ExcusaListRelationFilter
    historial?: HistorialAcademicoListRelationFilter
  }, "id" | "carnet">

  export type AlumnoOrderByWithAggregationInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrderInput | SortOrder
    grado?: SortOrder
    seccion?: SortOrderInput | SortOrder
    carrera?: SortOrderInput | SortOrder
    especialidad?: SortOrderInput | SortOrder
    jornada?: SortOrderInput | SortOrder
    estado?: SortOrder
    anio_ingreso?: SortOrderInput | SortOrder
    anio_graduacion?: SortOrderInput | SortOrder
    nivel_actual?: SortOrderInput | SortOrder
    motivo_baja?: SortOrderInput | SortOrder
    fecha_baja?: SortOrderInput | SortOrder
    foto_path?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    _count?: AlumnoCountOrderByAggregateInput
    _avg?: AlumnoAvgOrderByAggregateInput
    _max?: AlumnoMaxOrderByAggregateInput
    _min?: AlumnoMinOrderByAggregateInput
    _sum?: AlumnoSumOrderByAggregateInput
  }

  export type AlumnoScalarWhereWithAggregatesInput = {
    AND?: AlumnoScalarWhereWithAggregatesInput | AlumnoScalarWhereWithAggregatesInput[]
    OR?: AlumnoScalarWhereWithAggregatesInput[]
    NOT?: AlumnoScalarWhereWithAggregatesInput | AlumnoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Alumno"> | number
    carnet?: StringWithAggregatesFilter<"Alumno"> | string
    nombres?: StringWithAggregatesFilter<"Alumno"> | string
    apellidos?: StringWithAggregatesFilter<"Alumno"> | string
    sexo?: StringNullableWithAggregatesFilter<"Alumno"> | string | null
    grado?: StringWithAggregatesFilter<"Alumno"> | string
    seccion?: StringNullableWithAggregatesFilter<"Alumno"> | string | null
    carrera?: StringNullableWithAggregatesFilter<"Alumno"> | string | null
    especialidad?: StringNullableWithAggregatesFilter<"Alumno"> | string | null
    jornada?: StringNullableWithAggregatesFilter<"Alumno"> | string | null
    estado?: StringWithAggregatesFilter<"Alumno"> | string
    anio_ingreso?: IntNullableWithAggregatesFilter<"Alumno"> | number | null
    anio_graduacion?: IntNullableWithAggregatesFilter<"Alumno"> | number | null
    nivel_actual?: StringNullableWithAggregatesFilter<"Alumno"> | string | null
    motivo_baja?: StringNullableWithAggregatesFilter<"Alumno"> | string | null
    fecha_baja?: DateTimeNullableWithAggregatesFilter<"Alumno"> | Date | string | null
    foto_path?: StringNullableWithAggregatesFilter<"Alumno"> | string | null
    creado_en?: DateTimeWithAggregatesFilter<"Alumno"> | Date | string
    actualizado_en?: DateTimeWithAggregatesFilter<"Alumno"> | Date | string
  }

  export type PersonalWhereInput = {
    AND?: PersonalWhereInput | PersonalWhereInput[]
    OR?: PersonalWhereInput[]
    NOT?: PersonalWhereInput | PersonalWhereInput[]
    id?: IntFilter<"Personal"> | number
    carnet?: StringFilter<"Personal"> | string
    nombres?: StringFilter<"Personal"> | string
    apellidos?: StringFilter<"Personal"> | string
    sexo?: StringNullableFilter<"Personal"> | string | null
    cargo?: StringNullableFilter<"Personal"> | string | null
    jornada?: StringNullableFilter<"Personal"> | string | null
    grado_guia?: StringNullableFilter<"Personal"> | string | null
    estado?: StringFilter<"Personal"> | string
    foto_path?: StringNullableFilter<"Personal"> | string | null
    creado_en?: DateTimeFilter<"Personal"> | Date | string
    actualizado_en?: DateTimeFilter<"Personal"> | Date | string
    curso?: StringNullableFilter<"Personal"> | string | null
    asistencias?: AsistenciaListRelationFilter
    codigos_qr?: CodigoQrListRelationFilter
    excusas?: ExcusaListRelationFilter
  }

  export type PersonalOrderByWithRelationInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrderInput | SortOrder
    cargo?: SortOrderInput | SortOrder
    jornada?: SortOrderInput | SortOrder
    grado_guia?: SortOrderInput | SortOrder
    estado?: SortOrder
    foto_path?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    curso?: SortOrderInput | SortOrder
    asistencias?: AsistenciaOrderByRelationAggregateInput
    codigos_qr?: CodigoQrOrderByRelationAggregateInput
    excusas?: ExcusaOrderByRelationAggregateInput
  }

  export type PersonalWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    carnet?: string
    AND?: PersonalWhereInput | PersonalWhereInput[]
    OR?: PersonalWhereInput[]
    NOT?: PersonalWhereInput | PersonalWhereInput[]
    nombres?: StringFilter<"Personal"> | string
    apellidos?: StringFilter<"Personal"> | string
    sexo?: StringNullableFilter<"Personal"> | string | null
    cargo?: StringNullableFilter<"Personal"> | string | null
    jornada?: StringNullableFilter<"Personal"> | string | null
    grado_guia?: StringNullableFilter<"Personal"> | string | null
    estado?: StringFilter<"Personal"> | string
    foto_path?: StringNullableFilter<"Personal"> | string | null
    creado_en?: DateTimeFilter<"Personal"> | Date | string
    actualizado_en?: DateTimeFilter<"Personal"> | Date | string
    curso?: StringNullableFilter<"Personal"> | string | null
    asistencias?: AsistenciaListRelationFilter
    codigos_qr?: CodigoQrListRelationFilter
    excusas?: ExcusaListRelationFilter
  }, "id" | "carnet">

  export type PersonalOrderByWithAggregationInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrderInput | SortOrder
    cargo?: SortOrderInput | SortOrder
    jornada?: SortOrderInput | SortOrder
    grado_guia?: SortOrderInput | SortOrder
    estado?: SortOrder
    foto_path?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    curso?: SortOrderInput | SortOrder
    _count?: PersonalCountOrderByAggregateInput
    _avg?: PersonalAvgOrderByAggregateInput
    _max?: PersonalMaxOrderByAggregateInput
    _min?: PersonalMinOrderByAggregateInput
    _sum?: PersonalSumOrderByAggregateInput
  }

  export type PersonalScalarWhereWithAggregatesInput = {
    AND?: PersonalScalarWhereWithAggregatesInput | PersonalScalarWhereWithAggregatesInput[]
    OR?: PersonalScalarWhereWithAggregatesInput[]
    NOT?: PersonalScalarWhereWithAggregatesInput | PersonalScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Personal"> | number
    carnet?: StringWithAggregatesFilter<"Personal"> | string
    nombres?: StringWithAggregatesFilter<"Personal"> | string
    apellidos?: StringWithAggregatesFilter<"Personal"> | string
    sexo?: StringNullableWithAggregatesFilter<"Personal"> | string | null
    cargo?: StringNullableWithAggregatesFilter<"Personal"> | string | null
    jornada?: StringNullableWithAggregatesFilter<"Personal"> | string | null
    grado_guia?: StringNullableWithAggregatesFilter<"Personal"> | string | null
    estado?: StringWithAggregatesFilter<"Personal"> | string
    foto_path?: StringNullableWithAggregatesFilter<"Personal"> | string | null
    creado_en?: DateTimeWithAggregatesFilter<"Personal"> | Date | string
    actualizado_en?: DateTimeWithAggregatesFilter<"Personal"> | Date | string
    curso?: StringNullableWithAggregatesFilter<"Personal"> | string | null
  }

  export type CodigoQrWhereInput = {
    AND?: CodigoQrWhereInput | CodigoQrWhereInput[]
    OR?: CodigoQrWhereInput[]
    NOT?: CodigoQrWhereInput | CodigoQrWhereInput[]
    id?: IntFilter<"CodigoQr"> | number
    persona_tipo?: StringFilter<"CodigoQr"> | string
    alumno_id?: IntNullableFilter<"CodigoQr"> | number | null
    personal_id?: IntNullableFilter<"CodigoQr"> | number | null
    token?: StringFilter<"CodigoQr"> | string
    png_path?: StringNullableFilter<"CodigoQr"> | string | null
    vigente?: BoolFilter<"CodigoQr"> | boolean
    generado_en?: DateTimeFilter<"CodigoQr"> | Date | string
    regenerado_en?: DateTimeNullableFilter<"CodigoQr"> | Date | string | null
    personal?: XOR<PersonalNullableRelationFilter, PersonalWhereInput> | null
    alumno?: XOR<AlumnoNullableRelationFilter, AlumnoWhereInput> | null
  }

  export type CodigoQrOrderByWithRelationInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrderInput | SortOrder
    personal_id?: SortOrderInput | SortOrder
    token?: SortOrder
    png_path?: SortOrderInput | SortOrder
    vigente?: SortOrder
    generado_en?: SortOrder
    regenerado_en?: SortOrderInput | SortOrder
    personal?: PersonalOrderByWithRelationInput
    alumno?: AlumnoOrderByWithRelationInput
  }

  export type CodigoQrWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    token?: string
    persona_tipo_alumno_id?: CodigoQrPersona_tipoAlumno_idCompoundUniqueInput
    persona_tipo_personal_id?: CodigoQrPersona_tipoPersonal_idCompoundUniqueInput
    AND?: CodigoQrWhereInput | CodigoQrWhereInput[]
    OR?: CodigoQrWhereInput[]
    NOT?: CodigoQrWhereInput | CodigoQrWhereInput[]
    persona_tipo?: StringFilter<"CodigoQr"> | string
    alumno_id?: IntNullableFilter<"CodigoQr"> | number | null
    personal_id?: IntNullableFilter<"CodigoQr"> | number | null
    png_path?: StringNullableFilter<"CodigoQr"> | string | null
    vigente?: BoolFilter<"CodigoQr"> | boolean
    generado_en?: DateTimeFilter<"CodigoQr"> | Date | string
    regenerado_en?: DateTimeNullableFilter<"CodigoQr"> | Date | string | null
    personal?: XOR<PersonalNullableRelationFilter, PersonalWhereInput> | null
    alumno?: XOR<AlumnoNullableRelationFilter, AlumnoWhereInput> | null
  }, "id" | "token" | "persona_tipo_alumno_id" | "persona_tipo_personal_id">

  export type CodigoQrOrderByWithAggregationInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrderInput | SortOrder
    personal_id?: SortOrderInput | SortOrder
    token?: SortOrder
    png_path?: SortOrderInput | SortOrder
    vigente?: SortOrder
    generado_en?: SortOrder
    regenerado_en?: SortOrderInput | SortOrder
    _count?: CodigoQrCountOrderByAggregateInput
    _avg?: CodigoQrAvgOrderByAggregateInput
    _max?: CodigoQrMaxOrderByAggregateInput
    _min?: CodigoQrMinOrderByAggregateInput
    _sum?: CodigoQrSumOrderByAggregateInput
  }

  export type CodigoQrScalarWhereWithAggregatesInput = {
    AND?: CodigoQrScalarWhereWithAggregatesInput | CodigoQrScalarWhereWithAggregatesInput[]
    OR?: CodigoQrScalarWhereWithAggregatesInput[]
    NOT?: CodigoQrScalarWhereWithAggregatesInput | CodigoQrScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CodigoQr"> | number
    persona_tipo?: StringWithAggregatesFilter<"CodigoQr"> | string
    alumno_id?: IntNullableWithAggregatesFilter<"CodigoQr"> | number | null
    personal_id?: IntNullableWithAggregatesFilter<"CodigoQr"> | number | null
    token?: StringWithAggregatesFilter<"CodigoQr"> | string
    png_path?: StringNullableWithAggregatesFilter<"CodigoQr"> | string | null
    vigente?: BoolWithAggregatesFilter<"CodigoQr"> | boolean
    generado_en?: DateTimeWithAggregatesFilter<"CodigoQr"> | Date | string
    regenerado_en?: DateTimeNullableWithAggregatesFilter<"CodigoQr"> | Date | string | null
  }

  export type AsistenciaWhereInput = {
    AND?: AsistenciaWhereInput | AsistenciaWhereInput[]
    OR?: AsistenciaWhereInput[]
    NOT?: AsistenciaWhereInput | AsistenciaWhereInput[]
    id?: IntFilter<"Asistencia"> | number
    persona_tipo?: StringFilter<"Asistencia"> | string
    alumno_id?: IntNullableFilter<"Asistencia"> | number | null
    personal_id?: IntNullableFilter<"Asistencia"> | number | null
    tipo_evento?: StringFilter<"Asistencia"> | string
    timestamp?: DateTimeFilter<"Asistencia"> | Date | string
    origen?: StringFilter<"Asistencia"> | string
    dispositivo?: StringNullableFilter<"Asistencia"> | string | null
    estado_puntualidad?: StringNullableFilter<"Asistencia"> | string | null
    observaciones?: StringNullableFilter<"Asistencia"> | string | null
    creado_en?: DateTimeFilter<"Asistencia"> | Date | string
    personal?: XOR<PersonalNullableRelationFilter, PersonalWhereInput> | null
    alumno?: XOR<AlumnoNullableRelationFilter, AlumnoWhereInput> | null
  }

  export type AsistenciaOrderByWithRelationInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrderInput | SortOrder
    personal_id?: SortOrderInput | SortOrder
    tipo_evento?: SortOrder
    timestamp?: SortOrder
    origen?: SortOrder
    dispositivo?: SortOrderInput | SortOrder
    estado_puntualidad?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    personal?: PersonalOrderByWithRelationInput
    alumno?: AlumnoOrderByWithRelationInput
  }

  export type AsistenciaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AsistenciaWhereInput | AsistenciaWhereInput[]
    OR?: AsistenciaWhereInput[]
    NOT?: AsistenciaWhereInput | AsistenciaWhereInput[]
    persona_tipo?: StringFilter<"Asistencia"> | string
    alumno_id?: IntNullableFilter<"Asistencia"> | number | null
    personal_id?: IntNullableFilter<"Asistencia"> | number | null
    tipo_evento?: StringFilter<"Asistencia"> | string
    timestamp?: DateTimeFilter<"Asistencia"> | Date | string
    origen?: StringFilter<"Asistencia"> | string
    dispositivo?: StringNullableFilter<"Asistencia"> | string | null
    estado_puntualidad?: StringNullableFilter<"Asistencia"> | string | null
    observaciones?: StringNullableFilter<"Asistencia"> | string | null
    creado_en?: DateTimeFilter<"Asistencia"> | Date | string
    personal?: XOR<PersonalNullableRelationFilter, PersonalWhereInput> | null
    alumno?: XOR<AlumnoNullableRelationFilter, AlumnoWhereInput> | null
  }, "id">

  export type AsistenciaOrderByWithAggregationInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrderInput | SortOrder
    personal_id?: SortOrderInput | SortOrder
    tipo_evento?: SortOrder
    timestamp?: SortOrder
    origen?: SortOrder
    dispositivo?: SortOrderInput | SortOrder
    estado_puntualidad?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    _count?: AsistenciaCountOrderByAggregateInput
    _avg?: AsistenciaAvgOrderByAggregateInput
    _max?: AsistenciaMaxOrderByAggregateInput
    _min?: AsistenciaMinOrderByAggregateInput
    _sum?: AsistenciaSumOrderByAggregateInput
  }

  export type AsistenciaScalarWhereWithAggregatesInput = {
    AND?: AsistenciaScalarWhereWithAggregatesInput | AsistenciaScalarWhereWithAggregatesInput[]
    OR?: AsistenciaScalarWhereWithAggregatesInput[]
    NOT?: AsistenciaScalarWhereWithAggregatesInput | AsistenciaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Asistencia"> | number
    persona_tipo?: StringWithAggregatesFilter<"Asistencia"> | string
    alumno_id?: IntNullableWithAggregatesFilter<"Asistencia"> | number | null
    personal_id?: IntNullableWithAggregatesFilter<"Asistencia"> | number | null
    tipo_evento?: StringWithAggregatesFilter<"Asistencia"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Asistencia"> | Date | string
    origen?: StringWithAggregatesFilter<"Asistencia"> | string
    dispositivo?: StringNullableWithAggregatesFilter<"Asistencia"> | string | null
    estado_puntualidad?: StringNullableWithAggregatesFilter<"Asistencia"> | string | null
    observaciones?: StringNullableWithAggregatesFilter<"Asistencia"> | string | null
    creado_en?: DateTimeWithAggregatesFilter<"Asistencia"> | Date | string
  }

  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    id?: IntFilter<"Usuario"> | number
    email?: StringFilter<"Usuario"> | string
    nombres?: StringNullableFilter<"Usuario"> | string | null
    apellidos?: StringNullableFilter<"Usuario"> | string | null
    foto_path?: StringNullableFilter<"Usuario"> | string | null
    cargo?: StringNullableFilter<"Usuario"> | string | null
    jornada?: StringNullableFilter<"Usuario"> | string | null
    rol?: StringFilter<"Usuario"> | string
    hash_pass?: StringFilter<"Usuario"> | string
    activo?: BoolFilter<"Usuario"> | boolean
    creado_en?: DateTimeFilter<"Usuario"> | Date | string
    actualizado_en?: DateTimeFilter<"Usuario"> | Date | string
    auditorias?: AuditoriaListRelationFilter
  }

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    nombres?: SortOrderInput | SortOrder
    apellidos?: SortOrderInput | SortOrder
    foto_path?: SortOrderInput | SortOrder
    cargo?: SortOrderInput | SortOrder
    jornada?: SortOrderInput | SortOrder
    rol?: SortOrder
    hash_pass?: SortOrder
    activo?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    auditorias?: AuditoriaOrderByRelationAggregateInput
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    nombres?: StringNullableFilter<"Usuario"> | string | null
    apellidos?: StringNullableFilter<"Usuario"> | string | null
    foto_path?: StringNullableFilter<"Usuario"> | string | null
    cargo?: StringNullableFilter<"Usuario"> | string | null
    jornada?: StringNullableFilter<"Usuario"> | string | null
    rol?: StringFilter<"Usuario"> | string
    hash_pass?: StringFilter<"Usuario"> | string
    activo?: BoolFilter<"Usuario"> | boolean
    creado_en?: DateTimeFilter<"Usuario"> | Date | string
    actualizado_en?: DateTimeFilter<"Usuario"> | Date | string
    auditorias?: AuditoriaListRelationFilter
  }, "id" | "email">

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    nombres?: SortOrderInput | SortOrder
    apellidos?: SortOrderInput | SortOrder
    foto_path?: SortOrderInput | SortOrder
    cargo?: SortOrderInput | SortOrder
    jornada?: SortOrderInput | SortOrder
    rol?: SortOrder
    hash_pass?: SortOrder
    activo?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _avg?: UsuarioAvgOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
    _sum?: UsuarioSumOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Usuario"> | number
    email?: StringWithAggregatesFilter<"Usuario"> | string
    nombres?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    apellidos?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    foto_path?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    cargo?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    jornada?: StringNullableWithAggregatesFilter<"Usuario"> | string | null
    rol?: StringWithAggregatesFilter<"Usuario"> | string
    hash_pass?: StringWithAggregatesFilter<"Usuario"> | string
    activo?: BoolWithAggregatesFilter<"Usuario"> | boolean
    creado_en?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
    actualizado_en?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
  }

  export type AuditoriaWhereInput = {
    AND?: AuditoriaWhereInput | AuditoriaWhereInput[]
    OR?: AuditoriaWhereInput[]
    NOT?: AuditoriaWhereInput | AuditoriaWhereInput[]
    id?: IntFilter<"Auditoria"> | number
    entidad?: StringFilter<"Auditoria"> | string
    entidad_id?: IntNullableFilter<"Auditoria"> | number | null
    usuario_id?: IntNullableFilter<"Auditoria"> | number | null
    accion?: StringFilter<"Auditoria"> | string
    detalle?: StringNullableFilter<"Auditoria"> | string | null
    timestamp?: DateTimeFilter<"Auditoria"> | Date | string
    usuario?: XOR<UsuarioNullableRelationFilter, UsuarioWhereInput> | null
  }

  export type AuditoriaOrderByWithRelationInput = {
    id?: SortOrder
    entidad?: SortOrder
    entidad_id?: SortOrderInput | SortOrder
    usuario_id?: SortOrderInput | SortOrder
    accion?: SortOrder
    detalle?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    usuario?: UsuarioOrderByWithRelationInput
  }

  export type AuditoriaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AuditoriaWhereInput | AuditoriaWhereInput[]
    OR?: AuditoriaWhereInput[]
    NOT?: AuditoriaWhereInput | AuditoriaWhereInput[]
    entidad?: StringFilter<"Auditoria"> | string
    entidad_id?: IntNullableFilter<"Auditoria"> | number | null
    usuario_id?: IntNullableFilter<"Auditoria"> | number | null
    accion?: StringFilter<"Auditoria"> | string
    detalle?: StringNullableFilter<"Auditoria"> | string | null
    timestamp?: DateTimeFilter<"Auditoria"> | Date | string
    usuario?: XOR<UsuarioNullableRelationFilter, UsuarioWhereInput> | null
  }, "id">

  export type AuditoriaOrderByWithAggregationInput = {
    id?: SortOrder
    entidad?: SortOrder
    entidad_id?: SortOrderInput | SortOrder
    usuario_id?: SortOrderInput | SortOrder
    accion?: SortOrder
    detalle?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: AuditoriaCountOrderByAggregateInput
    _avg?: AuditoriaAvgOrderByAggregateInput
    _max?: AuditoriaMaxOrderByAggregateInput
    _min?: AuditoriaMinOrderByAggregateInput
    _sum?: AuditoriaSumOrderByAggregateInput
  }

  export type AuditoriaScalarWhereWithAggregatesInput = {
    AND?: AuditoriaScalarWhereWithAggregatesInput | AuditoriaScalarWhereWithAggregatesInput[]
    OR?: AuditoriaScalarWhereWithAggregatesInput[]
    NOT?: AuditoriaScalarWhereWithAggregatesInput | AuditoriaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Auditoria"> | number
    entidad?: StringWithAggregatesFilter<"Auditoria"> | string
    entidad_id?: IntNullableWithAggregatesFilter<"Auditoria"> | number | null
    usuario_id?: IntNullableWithAggregatesFilter<"Auditoria"> | number | null
    accion?: StringWithAggregatesFilter<"Auditoria"> | string
    detalle?: StringNullableWithAggregatesFilter<"Auditoria"> | string | null
    timestamp?: DateTimeWithAggregatesFilter<"Auditoria"> | Date | string
  }

  export type ExcusaWhereInput = {
    AND?: ExcusaWhereInput | ExcusaWhereInput[]
    OR?: ExcusaWhereInput[]
    NOT?: ExcusaWhereInput | ExcusaWhereInput[]
    id?: IntFilter<"Excusa"> | number
    alumno_id?: IntNullableFilter<"Excusa"> | number | null
    personal_id?: IntNullableFilter<"Excusa"> | number | null
    motivo?: StringFilter<"Excusa"> | string
    descripcion?: StringNullableFilter<"Excusa"> | string | null
    estado?: StringFilter<"Excusa"> | string
    fecha?: DateTimeFilter<"Excusa"> | Date | string
    fecha_ausencia?: DateTimeNullableFilter<"Excusa"> | Date | string | null
    documento_url?: StringNullableFilter<"Excusa"> | string | null
    observaciones?: StringNullableFilter<"Excusa"> | string | null
    creado_en?: DateTimeFilter<"Excusa"> | Date | string
    alumno?: XOR<AlumnoNullableRelationFilter, AlumnoWhereInput> | null
    personal?: XOR<PersonalNullableRelationFilter, PersonalWhereInput> | null
  }

  export type ExcusaOrderByWithRelationInput = {
    id?: SortOrder
    alumno_id?: SortOrderInput | SortOrder
    personal_id?: SortOrderInput | SortOrder
    motivo?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    fecha_ausencia?: SortOrderInput | SortOrder
    documento_url?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    alumno?: AlumnoOrderByWithRelationInput
    personal?: PersonalOrderByWithRelationInput
  }

  export type ExcusaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ExcusaWhereInput | ExcusaWhereInput[]
    OR?: ExcusaWhereInput[]
    NOT?: ExcusaWhereInput | ExcusaWhereInput[]
    alumno_id?: IntNullableFilter<"Excusa"> | number | null
    personal_id?: IntNullableFilter<"Excusa"> | number | null
    motivo?: StringFilter<"Excusa"> | string
    descripcion?: StringNullableFilter<"Excusa"> | string | null
    estado?: StringFilter<"Excusa"> | string
    fecha?: DateTimeFilter<"Excusa"> | Date | string
    fecha_ausencia?: DateTimeNullableFilter<"Excusa"> | Date | string | null
    documento_url?: StringNullableFilter<"Excusa"> | string | null
    observaciones?: StringNullableFilter<"Excusa"> | string | null
    creado_en?: DateTimeFilter<"Excusa"> | Date | string
    alumno?: XOR<AlumnoNullableRelationFilter, AlumnoWhereInput> | null
    personal?: XOR<PersonalNullableRelationFilter, PersonalWhereInput> | null
  }, "id">

  export type ExcusaOrderByWithAggregationInput = {
    id?: SortOrder
    alumno_id?: SortOrderInput | SortOrder
    personal_id?: SortOrderInput | SortOrder
    motivo?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    fecha_ausencia?: SortOrderInput | SortOrder
    documento_url?: SortOrderInput | SortOrder
    observaciones?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    _count?: ExcusaCountOrderByAggregateInput
    _avg?: ExcusaAvgOrderByAggregateInput
    _max?: ExcusaMaxOrderByAggregateInput
    _min?: ExcusaMinOrderByAggregateInput
    _sum?: ExcusaSumOrderByAggregateInput
  }

  export type ExcusaScalarWhereWithAggregatesInput = {
    AND?: ExcusaScalarWhereWithAggregatesInput | ExcusaScalarWhereWithAggregatesInput[]
    OR?: ExcusaScalarWhereWithAggregatesInput[]
    NOT?: ExcusaScalarWhereWithAggregatesInput | ExcusaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Excusa"> | number
    alumno_id?: IntNullableWithAggregatesFilter<"Excusa"> | number | null
    personal_id?: IntNullableWithAggregatesFilter<"Excusa"> | number | null
    motivo?: StringWithAggregatesFilter<"Excusa"> | string
    descripcion?: StringNullableWithAggregatesFilter<"Excusa"> | string | null
    estado?: StringWithAggregatesFilter<"Excusa"> | string
    fecha?: DateTimeWithAggregatesFilter<"Excusa"> | Date | string
    fecha_ausencia?: DateTimeNullableWithAggregatesFilter<"Excusa"> | Date | string | null
    documento_url?: StringNullableWithAggregatesFilter<"Excusa"> | string | null
    observaciones?: StringNullableWithAggregatesFilter<"Excusa"> | string | null
    creado_en?: DateTimeWithAggregatesFilter<"Excusa"> | Date | string
  }

  export type HistorialAcademicoWhereInput = {
    AND?: HistorialAcademicoWhereInput | HistorialAcademicoWhereInput[]
    OR?: HistorialAcademicoWhereInput[]
    NOT?: HistorialAcademicoWhereInput | HistorialAcademicoWhereInput[]
    id?: IntFilter<"HistorialAcademico"> | number
    alumno_id?: IntFilter<"HistorialAcademico"> | number
    anio_escolar?: IntFilter<"HistorialAcademico"> | number
    grado_cursado?: StringFilter<"HistorialAcademico"> | string
    nivel?: StringFilter<"HistorialAcademico"> | string
    carrera?: StringNullableFilter<"HistorialAcademico"> | string | null
    promovido?: BoolFilter<"HistorialAcademico"> | boolean
    observaciones?: StringNullableFilter<"HistorialAcademico"> | string | null
    creado_en?: DateTimeFilter<"HistorialAcademico"> | Date | string
    alumno?: XOR<AlumnoRelationFilter, AlumnoWhereInput>
  }

  export type HistorialAcademicoOrderByWithRelationInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    anio_escolar?: SortOrder
    grado_cursado?: SortOrder
    nivel?: SortOrder
    carrera?: SortOrderInput | SortOrder
    promovido?: SortOrder
    observaciones?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    alumno?: AlumnoOrderByWithRelationInput
  }

  export type HistorialAcademicoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: HistorialAcademicoWhereInput | HistorialAcademicoWhereInput[]
    OR?: HistorialAcademicoWhereInput[]
    NOT?: HistorialAcademicoWhereInput | HistorialAcademicoWhereInput[]
    alumno_id?: IntFilter<"HistorialAcademico"> | number
    anio_escolar?: IntFilter<"HistorialAcademico"> | number
    grado_cursado?: StringFilter<"HistorialAcademico"> | string
    nivel?: StringFilter<"HistorialAcademico"> | string
    carrera?: StringNullableFilter<"HistorialAcademico"> | string | null
    promovido?: BoolFilter<"HistorialAcademico"> | boolean
    observaciones?: StringNullableFilter<"HistorialAcademico"> | string | null
    creado_en?: DateTimeFilter<"HistorialAcademico"> | Date | string
    alumno?: XOR<AlumnoRelationFilter, AlumnoWhereInput>
  }, "id">

  export type HistorialAcademicoOrderByWithAggregationInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    anio_escolar?: SortOrder
    grado_cursado?: SortOrder
    nivel?: SortOrder
    carrera?: SortOrderInput | SortOrder
    promovido?: SortOrder
    observaciones?: SortOrderInput | SortOrder
    creado_en?: SortOrder
    _count?: HistorialAcademicoCountOrderByAggregateInput
    _avg?: HistorialAcademicoAvgOrderByAggregateInput
    _max?: HistorialAcademicoMaxOrderByAggregateInput
    _min?: HistorialAcademicoMinOrderByAggregateInput
    _sum?: HistorialAcademicoSumOrderByAggregateInput
  }

  export type HistorialAcademicoScalarWhereWithAggregatesInput = {
    AND?: HistorialAcademicoScalarWhereWithAggregatesInput | HistorialAcademicoScalarWhereWithAggregatesInput[]
    OR?: HistorialAcademicoScalarWhereWithAggregatesInput[]
    NOT?: HistorialAcademicoScalarWhereWithAggregatesInput | HistorialAcademicoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"HistorialAcademico"> | number
    alumno_id?: IntWithAggregatesFilter<"HistorialAcademico"> | number
    anio_escolar?: IntWithAggregatesFilter<"HistorialAcademico"> | number
    grado_cursado?: StringWithAggregatesFilter<"HistorialAcademico"> | string
    nivel?: StringWithAggregatesFilter<"HistorialAcademico"> | string
    carrera?: StringNullableWithAggregatesFilter<"HistorialAcademico"> | string | null
    promovido?: BoolWithAggregatesFilter<"HistorialAcademico"> | boolean
    observaciones?: StringNullableWithAggregatesFilter<"HistorialAcademico"> | string | null
    creado_en?: DateTimeWithAggregatesFilter<"HistorialAcademico"> | Date | string
  }

  export type DiagnosticResultWhereInput = {
    AND?: DiagnosticResultWhereInput | DiagnosticResultWhereInput[]
    OR?: DiagnosticResultWhereInput[]
    NOT?: DiagnosticResultWhereInput | DiagnosticResultWhereInput[]
    id?: IntFilter<"DiagnosticResult"> | number
    tipo?: StringFilter<"DiagnosticResult"> | string
    codigo_qr_id?: IntNullableFilter<"DiagnosticResult"> | number | null
    descripcion?: StringFilter<"DiagnosticResult"> | string
    reparado?: BoolFilter<"DiagnosticResult"> | boolean
    reparado_en?: DateTimeNullableFilter<"DiagnosticResult"> | Date | string | null
    timestamp?: DateTimeFilter<"DiagnosticResult"> | Date | string
  }

  export type DiagnosticResultOrderByWithRelationInput = {
    id?: SortOrder
    tipo?: SortOrder
    codigo_qr_id?: SortOrderInput | SortOrder
    descripcion?: SortOrder
    reparado?: SortOrder
    reparado_en?: SortOrderInput | SortOrder
    timestamp?: SortOrder
  }

  export type DiagnosticResultWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DiagnosticResultWhereInput | DiagnosticResultWhereInput[]
    OR?: DiagnosticResultWhereInput[]
    NOT?: DiagnosticResultWhereInput | DiagnosticResultWhereInput[]
    tipo?: StringFilter<"DiagnosticResult"> | string
    codigo_qr_id?: IntNullableFilter<"DiagnosticResult"> | number | null
    descripcion?: StringFilter<"DiagnosticResult"> | string
    reparado?: BoolFilter<"DiagnosticResult"> | boolean
    reparado_en?: DateTimeNullableFilter<"DiagnosticResult"> | Date | string | null
    timestamp?: DateTimeFilter<"DiagnosticResult"> | Date | string
  }, "id">

  export type DiagnosticResultOrderByWithAggregationInput = {
    id?: SortOrder
    tipo?: SortOrder
    codigo_qr_id?: SortOrderInput | SortOrder
    descripcion?: SortOrder
    reparado?: SortOrder
    reparado_en?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: DiagnosticResultCountOrderByAggregateInput
    _avg?: DiagnosticResultAvgOrderByAggregateInput
    _max?: DiagnosticResultMaxOrderByAggregateInput
    _min?: DiagnosticResultMinOrderByAggregateInput
    _sum?: DiagnosticResultSumOrderByAggregateInput
  }

  export type DiagnosticResultScalarWhereWithAggregatesInput = {
    AND?: DiagnosticResultScalarWhereWithAggregatesInput | DiagnosticResultScalarWhereWithAggregatesInput[]
    OR?: DiagnosticResultScalarWhereWithAggregatesInput[]
    NOT?: DiagnosticResultScalarWhereWithAggregatesInput | DiagnosticResultScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DiagnosticResult"> | number
    tipo?: StringWithAggregatesFilter<"DiagnosticResult"> | string
    codigo_qr_id?: IntNullableWithAggregatesFilter<"DiagnosticResult"> | number | null
    descripcion?: StringWithAggregatesFilter<"DiagnosticResult"> | string
    reparado?: BoolWithAggregatesFilter<"DiagnosticResult"> | boolean
    reparado_en?: DateTimeNullableWithAggregatesFilter<"DiagnosticResult"> | Date | string | null
    timestamp?: DateTimeWithAggregatesFilter<"DiagnosticResult"> | Date | string
  }

  export type EquipoWhereInput = {
    AND?: EquipoWhereInput | EquipoWhereInput[]
    OR?: EquipoWhereInput[]
    NOT?: EquipoWhereInput | EquipoWhereInput[]
    id?: IntFilter<"Equipo"> | number
    nombre?: StringNullableFilter<"Equipo"> | string | null
    hostname?: StringNullableFilter<"Equipo"> | string | null
    ip?: StringFilter<"Equipo"> | string
    os?: StringNullableFilter<"Equipo"> | string | null
    mac_address?: StringNullableFilter<"Equipo"> | string | null
    aprobado?: BoolFilter<"Equipo"> | boolean
    clave_seguridad?: StringFilter<"Equipo"> | string
    ultima_conexion?: DateTimeFilter<"Equipo"> | Date | string
    creado_en?: DateTimeFilter<"Equipo"> | Date | string
    actualizado_en?: DateTimeFilter<"Equipo"> | Date | string
  }

  export type EquipoOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrderInput | SortOrder
    hostname?: SortOrderInput | SortOrder
    ip?: SortOrder
    os?: SortOrderInput | SortOrder
    mac_address?: SortOrderInput | SortOrder
    aprobado?: SortOrder
    clave_seguridad?: SortOrder
    ultima_conexion?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type EquipoWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    ip?: string
    mac_address?: string
    clave_seguridad?: string
    AND?: EquipoWhereInput | EquipoWhereInput[]
    OR?: EquipoWhereInput[]
    NOT?: EquipoWhereInput | EquipoWhereInput[]
    nombre?: StringNullableFilter<"Equipo"> | string | null
    hostname?: StringNullableFilter<"Equipo"> | string | null
    os?: StringNullableFilter<"Equipo"> | string | null
    aprobado?: BoolFilter<"Equipo"> | boolean
    ultima_conexion?: DateTimeFilter<"Equipo"> | Date | string
    creado_en?: DateTimeFilter<"Equipo"> | Date | string
    actualizado_en?: DateTimeFilter<"Equipo"> | Date | string
  }, "id" | "ip" | "mac_address" | "clave_seguridad">

  export type EquipoOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrderInput | SortOrder
    hostname?: SortOrderInput | SortOrder
    ip?: SortOrder
    os?: SortOrderInput | SortOrder
    mac_address?: SortOrderInput | SortOrder
    aprobado?: SortOrder
    clave_seguridad?: SortOrder
    ultima_conexion?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    _count?: EquipoCountOrderByAggregateInput
    _avg?: EquipoAvgOrderByAggregateInput
    _max?: EquipoMaxOrderByAggregateInput
    _min?: EquipoMinOrderByAggregateInput
    _sum?: EquipoSumOrderByAggregateInput
  }

  export type EquipoScalarWhereWithAggregatesInput = {
    AND?: EquipoScalarWhereWithAggregatesInput | EquipoScalarWhereWithAggregatesInput[]
    OR?: EquipoScalarWhereWithAggregatesInput[]
    NOT?: EquipoScalarWhereWithAggregatesInput | EquipoScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Equipo"> | number
    nombre?: StringNullableWithAggregatesFilter<"Equipo"> | string | null
    hostname?: StringNullableWithAggregatesFilter<"Equipo"> | string | null
    ip?: StringWithAggregatesFilter<"Equipo"> | string
    os?: StringNullableWithAggregatesFilter<"Equipo"> | string | null
    mac_address?: StringNullableWithAggregatesFilter<"Equipo"> | string | null
    aprobado?: BoolWithAggregatesFilter<"Equipo"> | boolean
    clave_seguridad?: StringWithAggregatesFilter<"Equipo"> | string
    ultima_conexion?: DateTimeWithAggregatesFilter<"Equipo"> | Date | string
    creado_en?: DateTimeWithAggregatesFilter<"Equipo"> | Date | string
    actualizado_en?: DateTimeWithAggregatesFilter<"Equipo"> | Date | string
  }

  export type InstitucionCreateInput = {
    nombre: string
    logo_base64?: string | null
    logo_path?: string | null
    horario_inicio?: string | null
    horario_salida?: string | null
    margen_puntualidad_min?: number
    direccion?: string | null
    pais?: string | null
    departamento?: string | null
    municipio?: string | null
    email?: string | null
    telefono?: string | null
    ciclo_escolar?: number
    inicializado?: boolean
    carnet_counter_personal?: number
    carnet_counter_alumnos?: number
    creado_en?: Date | string
    actualizado_en?: Date | string
    master_recovery_key?: string | null
  }

  export type InstitucionUncheckedCreateInput = {
    id?: number
    nombre: string
    logo_base64?: string | null
    logo_path?: string | null
    horario_inicio?: string | null
    horario_salida?: string | null
    margen_puntualidad_min?: number
    direccion?: string | null
    pais?: string | null
    departamento?: string | null
    municipio?: string | null
    email?: string | null
    telefono?: string | null
    ciclo_escolar?: number
    inicializado?: boolean
    carnet_counter_personal?: number
    carnet_counter_alumnos?: number
    creado_en?: Date | string
    actualizado_en?: Date | string
    master_recovery_key?: string | null
  }

  export type InstitucionUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    logo_base64?: NullableStringFieldUpdateOperationsInput | string | null
    logo_path?: NullableStringFieldUpdateOperationsInput | string | null
    horario_inicio?: NullableStringFieldUpdateOperationsInput | string | null
    horario_salida?: NullableStringFieldUpdateOperationsInput | string | null
    margen_puntualidad_min?: IntFieldUpdateOperationsInput | number
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    pais?: NullableStringFieldUpdateOperationsInput | string | null
    departamento?: NullableStringFieldUpdateOperationsInput | string | null
    municipio?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    ciclo_escolar?: IntFieldUpdateOperationsInput | number
    inicializado?: BoolFieldUpdateOperationsInput | boolean
    carnet_counter_personal?: IntFieldUpdateOperationsInput | number
    carnet_counter_alumnos?: IntFieldUpdateOperationsInput | number
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    master_recovery_key?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InstitucionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    logo_base64?: NullableStringFieldUpdateOperationsInput | string | null
    logo_path?: NullableStringFieldUpdateOperationsInput | string | null
    horario_inicio?: NullableStringFieldUpdateOperationsInput | string | null
    horario_salida?: NullableStringFieldUpdateOperationsInput | string | null
    margen_puntualidad_min?: IntFieldUpdateOperationsInput | number
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    pais?: NullableStringFieldUpdateOperationsInput | string | null
    departamento?: NullableStringFieldUpdateOperationsInput | string | null
    municipio?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    ciclo_escolar?: IntFieldUpdateOperationsInput | number
    inicializado?: BoolFieldUpdateOperationsInput | boolean
    carnet_counter_personal?: IntFieldUpdateOperationsInput | number
    carnet_counter_alumnos?: IntFieldUpdateOperationsInput | number
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    master_recovery_key?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InstitucionCreateManyInput = {
    id?: number
    nombre: string
    logo_base64?: string | null
    logo_path?: string | null
    horario_inicio?: string | null
    horario_salida?: string | null
    margen_puntualidad_min?: number
    direccion?: string | null
    pais?: string | null
    departamento?: string | null
    municipio?: string | null
    email?: string | null
    telefono?: string | null
    ciclo_escolar?: number
    inicializado?: boolean
    carnet_counter_personal?: number
    carnet_counter_alumnos?: number
    creado_en?: Date | string
    actualizado_en?: Date | string
    master_recovery_key?: string | null
  }

  export type InstitucionUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    logo_base64?: NullableStringFieldUpdateOperationsInput | string | null
    logo_path?: NullableStringFieldUpdateOperationsInput | string | null
    horario_inicio?: NullableStringFieldUpdateOperationsInput | string | null
    horario_salida?: NullableStringFieldUpdateOperationsInput | string | null
    margen_puntualidad_min?: IntFieldUpdateOperationsInput | number
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    pais?: NullableStringFieldUpdateOperationsInput | string | null
    departamento?: NullableStringFieldUpdateOperationsInput | string | null
    municipio?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    ciclo_escolar?: IntFieldUpdateOperationsInput | number
    inicializado?: BoolFieldUpdateOperationsInput | boolean
    carnet_counter_personal?: IntFieldUpdateOperationsInput | number
    carnet_counter_alumnos?: IntFieldUpdateOperationsInput | number
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    master_recovery_key?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InstitucionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    logo_base64?: NullableStringFieldUpdateOperationsInput | string | null
    logo_path?: NullableStringFieldUpdateOperationsInput | string | null
    horario_inicio?: NullableStringFieldUpdateOperationsInput | string | null
    horario_salida?: NullableStringFieldUpdateOperationsInput | string | null
    margen_puntualidad_min?: IntFieldUpdateOperationsInput | number
    direccion?: NullableStringFieldUpdateOperationsInput | string | null
    pais?: NullableStringFieldUpdateOperationsInput | string | null
    departamento?: NullableStringFieldUpdateOperationsInput | string | null
    municipio?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    ciclo_escolar?: IntFieldUpdateOperationsInput | number
    inicializado?: BoolFieldUpdateOperationsInput | boolean
    carnet_counter_personal?: IntFieldUpdateOperationsInput | number
    carnet_counter_alumnos?: IntFieldUpdateOperationsInput | number
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    master_recovery_key?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AlumnoCreateInput = {
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    asistencias?: AsistenciaCreateNestedManyWithoutAlumnoInput
    codigos_qr?: CodigoQrCreateNestedManyWithoutAlumnoInput
    excusas?: ExcusaCreateNestedManyWithoutAlumnoInput
    historial?: HistorialAcademicoCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutAlumnoInput
    codigos_qr?: CodigoQrUncheckedCreateNestedManyWithoutAlumnoInput
    excusas?: ExcusaUncheckedCreateNestedManyWithoutAlumnoInput
    historial?: HistorialAcademicoUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUpdateInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencias?: AsistenciaUpdateManyWithoutAlumnoNestedInput
    codigos_qr?: CodigoQrUpdateManyWithoutAlumnoNestedInput
    excusas?: ExcusaUpdateManyWithoutAlumnoNestedInput
    historial?: HistorialAcademicoUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencias?: AsistenciaUncheckedUpdateManyWithoutAlumnoNestedInput
    codigos_qr?: CodigoQrUncheckedUpdateManyWithoutAlumnoNestedInput
    excusas?: ExcusaUncheckedUpdateManyWithoutAlumnoNestedInput
    historial?: HistorialAcademicoUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoCreateManyInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
  }

  export type AlumnoUpdateManyMutationInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlumnoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PersonalCreateInput = {
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    cargo?: string | null
    jornada?: string | null
    grado_guia?: string | null
    estado?: string
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    curso?: string | null
    asistencias?: AsistenciaCreateNestedManyWithoutPersonalInput
    codigos_qr?: CodigoQrCreateNestedManyWithoutPersonalInput
    excusas?: ExcusaCreateNestedManyWithoutPersonalInput
  }

  export type PersonalUncheckedCreateInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    cargo?: string | null
    jornada?: string | null
    grado_guia?: string | null
    estado?: string
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    curso?: string | null
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutPersonalInput
    codigos_qr?: CodigoQrUncheckedCreateNestedManyWithoutPersonalInput
    excusas?: ExcusaUncheckedCreateNestedManyWithoutPersonalInput
  }

  export type PersonalUpdateInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
    asistencias?: AsistenciaUpdateManyWithoutPersonalNestedInput
    codigos_qr?: CodigoQrUpdateManyWithoutPersonalNestedInput
    excusas?: ExcusaUpdateManyWithoutPersonalNestedInput
  }

  export type PersonalUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
    asistencias?: AsistenciaUncheckedUpdateManyWithoutPersonalNestedInput
    codigos_qr?: CodigoQrUncheckedUpdateManyWithoutPersonalNestedInput
    excusas?: ExcusaUncheckedUpdateManyWithoutPersonalNestedInput
  }

  export type PersonalCreateManyInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    cargo?: string | null
    jornada?: string | null
    grado_guia?: string | null
    estado?: string
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    curso?: string | null
  }

  export type PersonalUpdateManyMutationInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PersonalUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CodigoQrCreateInput = {
    persona_tipo: string
    token: string
    png_path?: string | null
    vigente?: boolean
    generado_en?: Date | string
    regenerado_en?: Date | string | null
    personal?: PersonalCreateNestedOneWithoutCodigos_qrInput
    alumno?: AlumnoCreateNestedOneWithoutCodigos_qrInput
  }

  export type CodigoQrUncheckedCreateInput = {
    id?: number
    persona_tipo: string
    alumno_id?: number | null
    personal_id?: number | null
    token: string
    png_path?: string | null
    vigente?: boolean
    generado_en?: Date | string
    regenerado_en?: Date | string | null
  }

  export type CodigoQrUpdateInput = {
    persona_tipo?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    personal?: PersonalUpdateOneWithoutCodigos_qrNestedInput
    alumno?: AlumnoUpdateOneWithoutCodigos_qrNestedInput
  }

  export type CodigoQrUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CodigoQrCreateManyInput = {
    id?: number
    persona_tipo: string
    alumno_id?: number | null
    personal_id?: number | null
    token: string
    png_path?: string | null
    vigente?: boolean
    generado_en?: Date | string
    regenerado_en?: Date | string | null
  }

  export type CodigoQrUpdateManyMutationInput = {
    persona_tipo?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CodigoQrUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AsistenciaCreateInput = {
    persona_tipo: string
    tipo_evento: string
    timestamp?: Date | string
    origen?: string
    dispositivo?: string | null
    estado_puntualidad?: string | null
    observaciones?: string | null
    creado_en?: Date | string
    personal?: PersonalCreateNestedOneWithoutAsistenciasInput
    alumno?: AlumnoCreateNestedOneWithoutAsistenciasInput
  }

  export type AsistenciaUncheckedCreateInput = {
    id?: number
    persona_tipo: string
    alumno_id?: number | null
    personal_id?: number | null
    tipo_evento: string
    timestamp?: Date | string
    origen?: string
    dispositivo?: string | null
    estado_puntualidad?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type AsistenciaUpdateInput = {
    persona_tipo?: StringFieldUpdateOperationsInput | string
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    personal?: PersonalUpdateOneWithoutAsistenciasNestedInput
    alumno?: AlumnoUpdateOneWithoutAsistenciasNestedInput
  }

  export type AsistenciaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsistenciaCreateManyInput = {
    id?: number
    persona_tipo: string
    alumno_id?: number | null
    personal_id?: number | null
    tipo_evento: string
    timestamp?: Date | string
    origen?: string
    dispositivo?: string | null
    estado_puntualidad?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type AsistenciaUpdateManyMutationInput = {
    persona_tipo?: StringFieldUpdateOperationsInput | string
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsistenciaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioCreateInput = {
    email: string
    nombres?: string | null
    apellidos?: string | null
    foto_path?: string | null
    cargo?: string | null
    jornada?: string | null
    rol?: string
    hash_pass: string
    activo?: boolean
    creado_en?: Date | string
    actualizado_en?: Date | string
    auditorias?: AuditoriaCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUncheckedCreateInput = {
    id?: number
    email: string
    nombres?: string | null
    apellidos?: string | null
    foto_path?: string | null
    cargo?: string | null
    jornada?: string | null
    rol?: string
    hash_pass: string
    activo?: boolean
    creado_en?: Date | string
    actualizado_en?: Date | string
    auditorias?: AuditoriaUncheckedCreateNestedManyWithoutUsuarioInput
  }

  export type UsuarioUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    nombres?: NullableStringFieldUpdateOperationsInput | string | null
    apellidos?: NullableStringFieldUpdateOperationsInput | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    hash_pass?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    auditorias?: AuditoriaUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    nombres?: NullableStringFieldUpdateOperationsInput | string | null
    apellidos?: NullableStringFieldUpdateOperationsInput | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    hash_pass?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    auditorias?: AuditoriaUncheckedUpdateManyWithoutUsuarioNestedInput
  }

  export type UsuarioCreateManyInput = {
    id?: number
    email: string
    nombres?: string | null
    apellidos?: string | null
    foto_path?: string | null
    cargo?: string | null
    jornada?: string | null
    rol?: string
    hash_pass: string
    activo?: boolean
    creado_en?: Date | string
    actualizado_en?: Date | string
  }

  export type UsuarioUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    nombres?: NullableStringFieldUpdateOperationsInput | string | null
    apellidos?: NullableStringFieldUpdateOperationsInput | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    hash_pass?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    nombres?: NullableStringFieldUpdateOperationsInput | string | null
    apellidos?: NullableStringFieldUpdateOperationsInput | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    hash_pass?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditoriaCreateInput = {
    entidad: string
    entidad_id?: number | null
    accion: string
    detalle?: string | null
    timestamp?: Date | string
    usuario?: UsuarioCreateNestedOneWithoutAuditoriasInput
  }

  export type AuditoriaUncheckedCreateInput = {
    id?: number
    entidad: string
    entidad_id?: number | null
    usuario_id?: number | null
    accion: string
    detalle?: string | null
    timestamp?: Date | string
  }

  export type AuditoriaUpdateInput = {
    entidad?: StringFieldUpdateOperationsInput | string
    entidad_id?: NullableIntFieldUpdateOperationsInput | number | null
    accion?: StringFieldUpdateOperationsInput | string
    detalle?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    usuario?: UsuarioUpdateOneWithoutAuditoriasNestedInput
  }

  export type AuditoriaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    entidad?: StringFieldUpdateOperationsInput | string
    entidad_id?: NullableIntFieldUpdateOperationsInput | number | null
    usuario_id?: NullableIntFieldUpdateOperationsInput | number | null
    accion?: StringFieldUpdateOperationsInput | string
    detalle?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditoriaCreateManyInput = {
    id?: number
    entidad: string
    entidad_id?: number | null
    usuario_id?: number | null
    accion: string
    detalle?: string | null
    timestamp?: Date | string
  }

  export type AuditoriaUpdateManyMutationInput = {
    entidad?: StringFieldUpdateOperationsInput | string
    entidad_id?: NullableIntFieldUpdateOperationsInput | number | null
    accion?: StringFieldUpdateOperationsInput | string
    detalle?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditoriaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    entidad?: StringFieldUpdateOperationsInput | string
    entidad_id?: NullableIntFieldUpdateOperationsInput | number | null
    usuario_id?: NullableIntFieldUpdateOperationsInput | number | null
    accion?: StringFieldUpdateOperationsInput | string
    detalle?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExcusaCreateInput = {
    motivo: string
    descripcion?: string | null
    estado?: string
    fecha?: Date | string
    fecha_ausencia?: Date | string | null
    documento_url?: string | null
    observaciones?: string | null
    creado_en?: Date | string
    alumno?: AlumnoCreateNestedOneWithoutExcusasInput
    personal?: PersonalCreateNestedOneWithoutExcusasInput
  }

  export type ExcusaUncheckedCreateInput = {
    id?: number
    alumno_id?: number | null
    personal_id?: number | null
    motivo: string
    descripcion?: string | null
    estado?: string
    fecha?: Date | string
    fecha_ausencia?: Date | string | null
    documento_url?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type ExcusaUpdateInput = {
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    alumno?: AlumnoUpdateOneWithoutExcusasNestedInput
    personal?: PersonalUpdateOneWithoutExcusasNestedInput
  }

  export type ExcusaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExcusaCreateManyInput = {
    id?: number
    alumno_id?: number | null
    personal_id?: number | null
    motivo: string
    descripcion?: string | null
    estado?: string
    fecha?: Date | string
    fecha_ausencia?: Date | string | null
    documento_url?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type ExcusaUpdateManyMutationInput = {
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExcusaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialAcademicoCreateInput = {
    anio_escolar: number
    grado_cursado: string
    nivel: string
    carrera?: string | null
    promovido?: boolean
    observaciones?: string | null
    creado_en?: Date | string
    alumno: AlumnoCreateNestedOneWithoutHistorialInput
  }

  export type HistorialAcademicoUncheckedCreateInput = {
    id?: number
    alumno_id: number
    anio_escolar: number
    grado_cursado: string
    nivel: string
    carrera?: string | null
    promovido?: boolean
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type HistorialAcademicoUpdateInput = {
    anio_escolar?: IntFieldUpdateOperationsInput | number
    grado_cursado?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    promovido?: BoolFieldUpdateOperationsInput | boolean
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    alumno?: AlumnoUpdateOneRequiredWithoutHistorialNestedInput
  }

  export type HistorialAcademicoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    alumno_id?: IntFieldUpdateOperationsInput | number
    anio_escolar?: IntFieldUpdateOperationsInput | number
    grado_cursado?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    promovido?: BoolFieldUpdateOperationsInput | boolean
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialAcademicoCreateManyInput = {
    id?: number
    alumno_id: number
    anio_escolar: number
    grado_cursado: string
    nivel: string
    carrera?: string | null
    promovido?: boolean
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type HistorialAcademicoUpdateManyMutationInput = {
    anio_escolar?: IntFieldUpdateOperationsInput | number
    grado_cursado?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    promovido?: BoolFieldUpdateOperationsInput | boolean
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialAcademicoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    alumno_id?: IntFieldUpdateOperationsInput | number
    anio_escolar?: IntFieldUpdateOperationsInput | number
    grado_cursado?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    promovido?: BoolFieldUpdateOperationsInput | boolean
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosticResultCreateInput = {
    tipo: string
    codigo_qr_id?: number | null
    descripcion: string
    reparado?: boolean
    reparado_en?: Date | string | null
    timestamp?: Date | string
  }

  export type DiagnosticResultUncheckedCreateInput = {
    id?: number
    tipo: string
    codigo_qr_id?: number | null
    descripcion: string
    reparado?: boolean
    reparado_en?: Date | string | null
    timestamp?: Date | string
  }

  export type DiagnosticResultUpdateInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    codigo_qr_id?: NullableIntFieldUpdateOperationsInput | number | null
    descripcion?: StringFieldUpdateOperationsInput | string
    reparado?: BoolFieldUpdateOperationsInput | boolean
    reparado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosticResultUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    codigo_qr_id?: NullableIntFieldUpdateOperationsInput | number | null
    descripcion?: StringFieldUpdateOperationsInput | string
    reparado?: BoolFieldUpdateOperationsInput | boolean
    reparado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosticResultCreateManyInput = {
    id?: number
    tipo: string
    codigo_qr_id?: number | null
    descripcion: string
    reparado?: boolean
    reparado_en?: Date | string | null
    timestamp?: Date | string
  }

  export type DiagnosticResultUpdateManyMutationInput = {
    tipo?: StringFieldUpdateOperationsInput | string
    codigo_qr_id?: NullableIntFieldUpdateOperationsInput | number | null
    descripcion?: StringFieldUpdateOperationsInput | string
    reparado?: BoolFieldUpdateOperationsInput | boolean
    reparado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosticResultUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    tipo?: StringFieldUpdateOperationsInput | string
    codigo_qr_id?: NullableIntFieldUpdateOperationsInput | number | null
    descripcion?: StringFieldUpdateOperationsInput | string
    reparado?: BoolFieldUpdateOperationsInput | boolean
    reparado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EquipoCreateInput = {
    nombre?: string | null
    hostname?: string | null
    ip: string
    os?: string | null
    mac_address?: string | null
    aprobado?: boolean
    clave_seguridad: string
    ultima_conexion?: Date | string
    creado_en?: Date | string
    actualizado_en?: Date | string
  }

  export type EquipoUncheckedCreateInput = {
    id?: number
    nombre?: string | null
    hostname?: string | null
    ip: string
    os?: string | null
    mac_address?: string | null
    aprobado?: boolean
    clave_seguridad: string
    ultima_conexion?: Date | string
    creado_en?: Date | string
    actualizado_en?: Date | string
  }

  export type EquipoUpdateInput = {
    nombre?: NullableStringFieldUpdateOperationsInput | string | null
    hostname?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: StringFieldUpdateOperationsInput | string
    os?: NullableStringFieldUpdateOperationsInput | string | null
    mac_address?: NullableStringFieldUpdateOperationsInput | string | null
    aprobado?: BoolFieldUpdateOperationsInput | boolean
    clave_seguridad?: StringFieldUpdateOperationsInput | string
    ultima_conexion?: DateTimeFieldUpdateOperationsInput | Date | string
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EquipoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: NullableStringFieldUpdateOperationsInput | string | null
    hostname?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: StringFieldUpdateOperationsInput | string
    os?: NullableStringFieldUpdateOperationsInput | string | null
    mac_address?: NullableStringFieldUpdateOperationsInput | string | null
    aprobado?: BoolFieldUpdateOperationsInput | boolean
    clave_seguridad?: StringFieldUpdateOperationsInput | string
    ultima_conexion?: DateTimeFieldUpdateOperationsInput | Date | string
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EquipoCreateManyInput = {
    id?: number
    nombre?: string | null
    hostname?: string | null
    ip: string
    os?: string | null
    mac_address?: string | null
    aprobado?: boolean
    clave_seguridad: string
    ultima_conexion?: Date | string
    creado_en?: Date | string
    actualizado_en?: Date | string
  }

  export type EquipoUpdateManyMutationInput = {
    nombre?: NullableStringFieldUpdateOperationsInput | string | null
    hostname?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: StringFieldUpdateOperationsInput | string
    os?: NullableStringFieldUpdateOperationsInput | string | null
    mac_address?: NullableStringFieldUpdateOperationsInput | string | null
    aprobado?: BoolFieldUpdateOperationsInput | boolean
    clave_seguridad?: StringFieldUpdateOperationsInput | string
    ultima_conexion?: DateTimeFieldUpdateOperationsInput | Date | string
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EquipoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: NullableStringFieldUpdateOperationsInput | string | null
    hostname?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: StringFieldUpdateOperationsInput | string
    os?: NullableStringFieldUpdateOperationsInput | string | null
    mac_address?: NullableStringFieldUpdateOperationsInput | string | null
    aprobado?: BoolFieldUpdateOperationsInput | boolean
    clave_seguridad?: StringFieldUpdateOperationsInput | string
    ultima_conexion?: DateTimeFieldUpdateOperationsInput | Date | string
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type InstitucionCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    logo_base64?: SortOrder
    logo_path?: SortOrder
    horario_inicio?: SortOrder
    horario_salida?: SortOrder
    margen_puntualidad_min?: SortOrder
    direccion?: SortOrder
    pais?: SortOrder
    departamento?: SortOrder
    municipio?: SortOrder
    email?: SortOrder
    telefono?: SortOrder
    ciclo_escolar?: SortOrder
    inicializado?: SortOrder
    carnet_counter_personal?: SortOrder
    carnet_counter_alumnos?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    master_recovery_key?: SortOrder
  }

  export type InstitucionAvgOrderByAggregateInput = {
    id?: SortOrder
    margen_puntualidad_min?: SortOrder
    ciclo_escolar?: SortOrder
    carnet_counter_personal?: SortOrder
    carnet_counter_alumnos?: SortOrder
  }

  export type InstitucionMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    logo_base64?: SortOrder
    logo_path?: SortOrder
    horario_inicio?: SortOrder
    horario_salida?: SortOrder
    margen_puntualidad_min?: SortOrder
    direccion?: SortOrder
    pais?: SortOrder
    departamento?: SortOrder
    municipio?: SortOrder
    email?: SortOrder
    telefono?: SortOrder
    ciclo_escolar?: SortOrder
    inicializado?: SortOrder
    carnet_counter_personal?: SortOrder
    carnet_counter_alumnos?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    master_recovery_key?: SortOrder
  }

  export type InstitucionMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    logo_base64?: SortOrder
    logo_path?: SortOrder
    horario_inicio?: SortOrder
    horario_salida?: SortOrder
    margen_puntualidad_min?: SortOrder
    direccion?: SortOrder
    pais?: SortOrder
    departamento?: SortOrder
    municipio?: SortOrder
    email?: SortOrder
    telefono?: SortOrder
    ciclo_escolar?: SortOrder
    inicializado?: SortOrder
    carnet_counter_personal?: SortOrder
    carnet_counter_alumnos?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    master_recovery_key?: SortOrder
  }

  export type InstitucionSumOrderByAggregateInput = {
    id?: SortOrder
    margen_puntualidad_min?: SortOrder
    ciclo_escolar?: SortOrder
    carnet_counter_personal?: SortOrder
    carnet_counter_alumnos?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AsistenciaListRelationFilter = {
    every?: AsistenciaWhereInput
    some?: AsistenciaWhereInput
    none?: AsistenciaWhereInput
  }

  export type CodigoQrListRelationFilter = {
    every?: CodigoQrWhereInput
    some?: CodigoQrWhereInput
    none?: CodigoQrWhereInput
  }

  export type ExcusaListRelationFilter = {
    every?: ExcusaWhereInput
    some?: ExcusaWhereInput
    none?: ExcusaWhereInput
  }

  export type HistorialAcademicoListRelationFilter = {
    every?: HistorialAcademicoWhereInput
    some?: HistorialAcademicoWhereInput
    none?: HistorialAcademicoWhereInput
  }

  export type AsistenciaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CodigoQrOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExcusaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HistorialAcademicoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlumnoCountOrderByAggregateInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrder
    grado?: SortOrder
    seccion?: SortOrder
    carrera?: SortOrder
    especialidad?: SortOrder
    jornada?: SortOrder
    estado?: SortOrder
    anio_ingreso?: SortOrder
    anio_graduacion?: SortOrder
    nivel_actual?: SortOrder
    motivo_baja?: SortOrder
    fecha_baja?: SortOrder
    foto_path?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type AlumnoAvgOrderByAggregateInput = {
    id?: SortOrder
    anio_ingreso?: SortOrder
    anio_graduacion?: SortOrder
  }

  export type AlumnoMaxOrderByAggregateInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrder
    grado?: SortOrder
    seccion?: SortOrder
    carrera?: SortOrder
    especialidad?: SortOrder
    jornada?: SortOrder
    estado?: SortOrder
    anio_ingreso?: SortOrder
    anio_graduacion?: SortOrder
    nivel_actual?: SortOrder
    motivo_baja?: SortOrder
    fecha_baja?: SortOrder
    foto_path?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type AlumnoMinOrderByAggregateInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrder
    grado?: SortOrder
    seccion?: SortOrder
    carrera?: SortOrder
    especialidad?: SortOrder
    jornada?: SortOrder
    estado?: SortOrder
    anio_ingreso?: SortOrder
    anio_graduacion?: SortOrder
    nivel_actual?: SortOrder
    motivo_baja?: SortOrder
    fecha_baja?: SortOrder
    foto_path?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type AlumnoSumOrderByAggregateInput = {
    id?: SortOrder
    anio_ingreso?: SortOrder
    anio_graduacion?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PersonalCountOrderByAggregateInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrder
    cargo?: SortOrder
    jornada?: SortOrder
    grado_guia?: SortOrder
    estado?: SortOrder
    foto_path?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    curso?: SortOrder
  }

  export type PersonalAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PersonalMaxOrderByAggregateInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrder
    cargo?: SortOrder
    jornada?: SortOrder
    grado_guia?: SortOrder
    estado?: SortOrder
    foto_path?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    curso?: SortOrder
  }

  export type PersonalMinOrderByAggregateInput = {
    id?: SortOrder
    carnet?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    sexo?: SortOrder
    cargo?: SortOrder
    jornada?: SortOrder
    grado_guia?: SortOrder
    estado?: SortOrder
    foto_path?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
    curso?: SortOrder
  }

  export type PersonalSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PersonalNullableRelationFilter = {
    is?: PersonalWhereInput | null
    isNot?: PersonalWhereInput | null
  }

  export type AlumnoNullableRelationFilter = {
    is?: AlumnoWhereInput | null
    isNot?: AlumnoWhereInput | null
  }

  export type CodigoQrPersona_tipoAlumno_idCompoundUniqueInput = {
    persona_tipo: string
    alumno_id: number
  }

  export type CodigoQrPersona_tipoPersonal_idCompoundUniqueInput = {
    persona_tipo: string
    personal_id: number
  }

  export type CodigoQrCountOrderByAggregateInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
    token?: SortOrder
    png_path?: SortOrder
    vigente?: SortOrder
    generado_en?: SortOrder
    regenerado_en?: SortOrder
  }

  export type CodigoQrAvgOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
  }

  export type CodigoQrMaxOrderByAggregateInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
    token?: SortOrder
    png_path?: SortOrder
    vigente?: SortOrder
    generado_en?: SortOrder
    regenerado_en?: SortOrder
  }

  export type CodigoQrMinOrderByAggregateInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
    token?: SortOrder
    png_path?: SortOrder
    vigente?: SortOrder
    generado_en?: SortOrder
    regenerado_en?: SortOrder
  }

  export type CodigoQrSumOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
  }

  export type AsistenciaCountOrderByAggregateInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
    tipo_evento?: SortOrder
    timestamp?: SortOrder
    origen?: SortOrder
    dispositivo?: SortOrder
    estado_puntualidad?: SortOrder
    observaciones?: SortOrder
    creado_en?: SortOrder
  }

  export type AsistenciaAvgOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
  }

  export type AsistenciaMaxOrderByAggregateInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
    tipo_evento?: SortOrder
    timestamp?: SortOrder
    origen?: SortOrder
    dispositivo?: SortOrder
    estado_puntualidad?: SortOrder
    observaciones?: SortOrder
    creado_en?: SortOrder
  }

  export type AsistenciaMinOrderByAggregateInput = {
    id?: SortOrder
    persona_tipo?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
    tipo_evento?: SortOrder
    timestamp?: SortOrder
    origen?: SortOrder
    dispositivo?: SortOrder
    estado_puntualidad?: SortOrder
    observaciones?: SortOrder
    creado_en?: SortOrder
  }

  export type AsistenciaSumOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
  }

  export type AuditoriaListRelationFilter = {
    every?: AuditoriaWhereInput
    some?: AuditoriaWhereInput
    none?: AuditoriaWhereInput
  }

  export type AuditoriaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    foto_path?: SortOrder
    cargo?: SortOrder
    jornada?: SortOrder
    rol?: SortOrder
    hash_pass?: SortOrder
    activo?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type UsuarioAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    foto_path?: SortOrder
    cargo?: SortOrder
    jornada?: SortOrder
    rol?: SortOrder
    hash_pass?: SortOrder
    activo?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    nombres?: SortOrder
    apellidos?: SortOrder
    foto_path?: SortOrder
    cargo?: SortOrder
    jornada?: SortOrder
    rol?: SortOrder
    hash_pass?: SortOrder
    activo?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type UsuarioSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UsuarioNullableRelationFilter = {
    is?: UsuarioWhereInput | null
    isNot?: UsuarioWhereInput | null
  }

  export type AuditoriaCountOrderByAggregateInput = {
    id?: SortOrder
    entidad?: SortOrder
    entidad_id?: SortOrder
    usuario_id?: SortOrder
    accion?: SortOrder
    detalle?: SortOrder
    timestamp?: SortOrder
  }

  export type AuditoriaAvgOrderByAggregateInput = {
    id?: SortOrder
    entidad_id?: SortOrder
    usuario_id?: SortOrder
  }

  export type AuditoriaMaxOrderByAggregateInput = {
    id?: SortOrder
    entidad?: SortOrder
    entidad_id?: SortOrder
    usuario_id?: SortOrder
    accion?: SortOrder
    detalle?: SortOrder
    timestamp?: SortOrder
  }

  export type AuditoriaMinOrderByAggregateInput = {
    id?: SortOrder
    entidad?: SortOrder
    entidad_id?: SortOrder
    usuario_id?: SortOrder
    accion?: SortOrder
    detalle?: SortOrder
    timestamp?: SortOrder
  }

  export type AuditoriaSumOrderByAggregateInput = {
    id?: SortOrder
    entidad_id?: SortOrder
    usuario_id?: SortOrder
  }

  export type ExcusaCountOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
    motivo?: SortOrder
    descripcion?: SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    fecha_ausencia?: SortOrder
    documento_url?: SortOrder
    observaciones?: SortOrder
    creado_en?: SortOrder
  }

  export type ExcusaAvgOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
  }

  export type ExcusaMaxOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
    motivo?: SortOrder
    descripcion?: SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    fecha_ausencia?: SortOrder
    documento_url?: SortOrder
    observaciones?: SortOrder
    creado_en?: SortOrder
  }

  export type ExcusaMinOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
    motivo?: SortOrder
    descripcion?: SortOrder
    estado?: SortOrder
    fecha?: SortOrder
    fecha_ausencia?: SortOrder
    documento_url?: SortOrder
    observaciones?: SortOrder
    creado_en?: SortOrder
  }

  export type ExcusaSumOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    personal_id?: SortOrder
  }

  export type AlumnoRelationFilter = {
    is?: AlumnoWhereInput
    isNot?: AlumnoWhereInput
  }

  export type HistorialAcademicoCountOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    anio_escolar?: SortOrder
    grado_cursado?: SortOrder
    nivel?: SortOrder
    carrera?: SortOrder
    promovido?: SortOrder
    observaciones?: SortOrder
    creado_en?: SortOrder
  }

  export type HistorialAcademicoAvgOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    anio_escolar?: SortOrder
  }

  export type HistorialAcademicoMaxOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    anio_escolar?: SortOrder
    grado_cursado?: SortOrder
    nivel?: SortOrder
    carrera?: SortOrder
    promovido?: SortOrder
    observaciones?: SortOrder
    creado_en?: SortOrder
  }

  export type HistorialAcademicoMinOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    anio_escolar?: SortOrder
    grado_cursado?: SortOrder
    nivel?: SortOrder
    carrera?: SortOrder
    promovido?: SortOrder
    observaciones?: SortOrder
    creado_en?: SortOrder
  }

  export type HistorialAcademicoSumOrderByAggregateInput = {
    id?: SortOrder
    alumno_id?: SortOrder
    anio_escolar?: SortOrder
  }

  export type DiagnosticResultCountOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    codigo_qr_id?: SortOrder
    descripcion?: SortOrder
    reparado?: SortOrder
    reparado_en?: SortOrder
    timestamp?: SortOrder
  }

  export type DiagnosticResultAvgOrderByAggregateInput = {
    id?: SortOrder
    codigo_qr_id?: SortOrder
  }

  export type DiagnosticResultMaxOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    codigo_qr_id?: SortOrder
    descripcion?: SortOrder
    reparado?: SortOrder
    reparado_en?: SortOrder
    timestamp?: SortOrder
  }

  export type DiagnosticResultMinOrderByAggregateInput = {
    id?: SortOrder
    tipo?: SortOrder
    codigo_qr_id?: SortOrder
    descripcion?: SortOrder
    reparado?: SortOrder
    reparado_en?: SortOrder
    timestamp?: SortOrder
  }

  export type DiagnosticResultSumOrderByAggregateInput = {
    id?: SortOrder
    codigo_qr_id?: SortOrder
  }

  export type EquipoCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    hostname?: SortOrder
    ip?: SortOrder
    os?: SortOrder
    mac_address?: SortOrder
    aprobado?: SortOrder
    clave_seguridad?: SortOrder
    ultima_conexion?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type EquipoAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EquipoMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    hostname?: SortOrder
    ip?: SortOrder
    os?: SortOrder
    mac_address?: SortOrder
    aprobado?: SortOrder
    clave_seguridad?: SortOrder
    ultima_conexion?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type EquipoMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    hostname?: SortOrder
    ip?: SortOrder
    os?: SortOrder
    mac_address?: SortOrder
    aprobado?: SortOrder
    clave_seguridad?: SortOrder
    ultima_conexion?: SortOrder
    creado_en?: SortOrder
    actualizado_en?: SortOrder
  }

  export type EquipoSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AsistenciaCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<AsistenciaCreateWithoutAlumnoInput, AsistenciaUncheckedCreateWithoutAlumnoInput> | AsistenciaCreateWithoutAlumnoInput[] | AsistenciaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutAlumnoInput | AsistenciaCreateOrConnectWithoutAlumnoInput[]
    createMany?: AsistenciaCreateManyAlumnoInputEnvelope
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
  }

  export type CodigoQrCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<CodigoQrCreateWithoutAlumnoInput, CodigoQrUncheckedCreateWithoutAlumnoInput> | CodigoQrCreateWithoutAlumnoInput[] | CodigoQrUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: CodigoQrCreateOrConnectWithoutAlumnoInput | CodigoQrCreateOrConnectWithoutAlumnoInput[]
    createMany?: CodigoQrCreateManyAlumnoInputEnvelope
    connect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
  }

  export type ExcusaCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<ExcusaCreateWithoutAlumnoInput, ExcusaUncheckedCreateWithoutAlumnoInput> | ExcusaCreateWithoutAlumnoInput[] | ExcusaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ExcusaCreateOrConnectWithoutAlumnoInput | ExcusaCreateOrConnectWithoutAlumnoInput[]
    createMany?: ExcusaCreateManyAlumnoInputEnvelope
    connect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
  }

  export type HistorialAcademicoCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<HistorialAcademicoCreateWithoutAlumnoInput, HistorialAcademicoUncheckedCreateWithoutAlumnoInput> | HistorialAcademicoCreateWithoutAlumnoInput[] | HistorialAcademicoUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: HistorialAcademicoCreateOrConnectWithoutAlumnoInput | HistorialAcademicoCreateOrConnectWithoutAlumnoInput[]
    createMany?: HistorialAcademicoCreateManyAlumnoInputEnvelope
    connect?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
  }

  export type AsistenciaUncheckedCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<AsistenciaCreateWithoutAlumnoInput, AsistenciaUncheckedCreateWithoutAlumnoInput> | AsistenciaCreateWithoutAlumnoInput[] | AsistenciaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutAlumnoInput | AsistenciaCreateOrConnectWithoutAlumnoInput[]
    createMany?: AsistenciaCreateManyAlumnoInputEnvelope
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
  }

  export type CodigoQrUncheckedCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<CodigoQrCreateWithoutAlumnoInput, CodigoQrUncheckedCreateWithoutAlumnoInput> | CodigoQrCreateWithoutAlumnoInput[] | CodigoQrUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: CodigoQrCreateOrConnectWithoutAlumnoInput | CodigoQrCreateOrConnectWithoutAlumnoInput[]
    createMany?: CodigoQrCreateManyAlumnoInputEnvelope
    connect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
  }

  export type ExcusaUncheckedCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<ExcusaCreateWithoutAlumnoInput, ExcusaUncheckedCreateWithoutAlumnoInput> | ExcusaCreateWithoutAlumnoInput[] | ExcusaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ExcusaCreateOrConnectWithoutAlumnoInput | ExcusaCreateOrConnectWithoutAlumnoInput[]
    createMany?: ExcusaCreateManyAlumnoInputEnvelope
    connect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
  }

  export type HistorialAcademicoUncheckedCreateNestedManyWithoutAlumnoInput = {
    create?: XOR<HistorialAcademicoCreateWithoutAlumnoInput, HistorialAcademicoUncheckedCreateWithoutAlumnoInput> | HistorialAcademicoCreateWithoutAlumnoInput[] | HistorialAcademicoUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: HistorialAcademicoCreateOrConnectWithoutAlumnoInput | HistorialAcademicoCreateOrConnectWithoutAlumnoInput[]
    createMany?: HistorialAcademicoCreateManyAlumnoInputEnvelope
    connect?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AsistenciaUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<AsistenciaCreateWithoutAlumnoInput, AsistenciaUncheckedCreateWithoutAlumnoInput> | AsistenciaCreateWithoutAlumnoInput[] | AsistenciaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutAlumnoInput | AsistenciaCreateOrConnectWithoutAlumnoInput[]
    upsert?: AsistenciaUpsertWithWhereUniqueWithoutAlumnoInput | AsistenciaUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: AsistenciaCreateManyAlumnoInputEnvelope
    set?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    disconnect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    delete?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    update?: AsistenciaUpdateWithWhereUniqueWithoutAlumnoInput | AsistenciaUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: AsistenciaUpdateManyWithWhereWithoutAlumnoInput | AsistenciaUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
  }

  export type CodigoQrUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<CodigoQrCreateWithoutAlumnoInput, CodigoQrUncheckedCreateWithoutAlumnoInput> | CodigoQrCreateWithoutAlumnoInput[] | CodigoQrUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: CodigoQrCreateOrConnectWithoutAlumnoInput | CodigoQrCreateOrConnectWithoutAlumnoInput[]
    upsert?: CodigoQrUpsertWithWhereUniqueWithoutAlumnoInput | CodigoQrUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: CodigoQrCreateManyAlumnoInputEnvelope
    set?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    disconnect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    delete?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    connect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    update?: CodigoQrUpdateWithWhereUniqueWithoutAlumnoInput | CodigoQrUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: CodigoQrUpdateManyWithWhereWithoutAlumnoInput | CodigoQrUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: CodigoQrScalarWhereInput | CodigoQrScalarWhereInput[]
  }

  export type ExcusaUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<ExcusaCreateWithoutAlumnoInput, ExcusaUncheckedCreateWithoutAlumnoInput> | ExcusaCreateWithoutAlumnoInput[] | ExcusaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ExcusaCreateOrConnectWithoutAlumnoInput | ExcusaCreateOrConnectWithoutAlumnoInput[]
    upsert?: ExcusaUpsertWithWhereUniqueWithoutAlumnoInput | ExcusaUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: ExcusaCreateManyAlumnoInputEnvelope
    set?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    disconnect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    delete?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    connect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    update?: ExcusaUpdateWithWhereUniqueWithoutAlumnoInput | ExcusaUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: ExcusaUpdateManyWithWhereWithoutAlumnoInput | ExcusaUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: ExcusaScalarWhereInput | ExcusaScalarWhereInput[]
  }

  export type HistorialAcademicoUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<HistorialAcademicoCreateWithoutAlumnoInput, HistorialAcademicoUncheckedCreateWithoutAlumnoInput> | HistorialAcademicoCreateWithoutAlumnoInput[] | HistorialAcademicoUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: HistorialAcademicoCreateOrConnectWithoutAlumnoInput | HistorialAcademicoCreateOrConnectWithoutAlumnoInput[]
    upsert?: HistorialAcademicoUpsertWithWhereUniqueWithoutAlumnoInput | HistorialAcademicoUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: HistorialAcademicoCreateManyAlumnoInputEnvelope
    set?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
    disconnect?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
    delete?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
    connect?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
    update?: HistorialAcademicoUpdateWithWhereUniqueWithoutAlumnoInput | HistorialAcademicoUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: HistorialAcademicoUpdateManyWithWhereWithoutAlumnoInput | HistorialAcademicoUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: HistorialAcademicoScalarWhereInput | HistorialAcademicoScalarWhereInput[]
  }

  export type AsistenciaUncheckedUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<AsistenciaCreateWithoutAlumnoInput, AsistenciaUncheckedCreateWithoutAlumnoInput> | AsistenciaCreateWithoutAlumnoInput[] | AsistenciaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutAlumnoInput | AsistenciaCreateOrConnectWithoutAlumnoInput[]
    upsert?: AsistenciaUpsertWithWhereUniqueWithoutAlumnoInput | AsistenciaUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: AsistenciaCreateManyAlumnoInputEnvelope
    set?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    disconnect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    delete?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    update?: AsistenciaUpdateWithWhereUniqueWithoutAlumnoInput | AsistenciaUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: AsistenciaUpdateManyWithWhereWithoutAlumnoInput | AsistenciaUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
  }

  export type CodigoQrUncheckedUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<CodigoQrCreateWithoutAlumnoInput, CodigoQrUncheckedCreateWithoutAlumnoInput> | CodigoQrCreateWithoutAlumnoInput[] | CodigoQrUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: CodigoQrCreateOrConnectWithoutAlumnoInput | CodigoQrCreateOrConnectWithoutAlumnoInput[]
    upsert?: CodigoQrUpsertWithWhereUniqueWithoutAlumnoInput | CodigoQrUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: CodigoQrCreateManyAlumnoInputEnvelope
    set?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    disconnect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    delete?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    connect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    update?: CodigoQrUpdateWithWhereUniqueWithoutAlumnoInput | CodigoQrUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: CodigoQrUpdateManyWithWhereWithoutAlumnoInput | CodigoQrUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: CodigoQrScalarWhereInput | CodigoQrScalarWhereInput[]
  }

  export type ExcusaUncheckedUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<ExcusaCreateWithoutAlumnoInput, ExcusaUncheckedCreateWithoutAlumnoInput> | ExcusaCreateWithoutAlumnoInput[] | ExcusaUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: ExcusaCreateOrConnectWithoutAlumnoInput | ExcusaCreateOrConnectWithoutAlumnoInput[]
    upsert?: ExcusaUpsertWithWhereUniqueWithoutAlumnoInput | ExcusaUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: ExcusaCreateManyAlumnoInputEnvelope
    set?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    disconnect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    delete?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    connect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    update?: ExcusaUpdateWithWhereUniqueWithoutAlumnoInput | ExcusaUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: ExcusaUpdateManyWithWhereWithoutAlumnoInput | ExcusaUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: ExcusaScalarWhereInput | ExcusaScalarWhereInput[]
  }

  export type HistorialAcademicoUncheckedUpdateManyWithoutAlumnoNestedInput = {
    create?: XOR<HistorialAcademicoCreateWithoutAlumnoInput, HistorialAcademicoUncheckedCreateWithoutAlumnoInput> | HistorialAcademicoCreateWithoutAlumnoInput[] | HistorialAcademicoUncheckedCreateWithoutAlumnoInput[]
    connectOrCreate?: HistorialAcademicoCreateOrConnectWithoutAlumnoInput | HistorialAcademicoCreateOrConnectWithoutAlumnoInput[]
    upsert?: HistorialAcademicoUpsertWithWhereUniqueWithoutAlumnoInput | HistorialAcademicoUpsertWithWhereUniqueWithoutAlumnoInput[]
    createMany?: HistorialAcademicoCreateManyAlumnoInputEnvelope
    set?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
    disconnect?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
    delete?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
    connect?: HistorialAcademicoWhereUniqueInput | HistorialAcademicoWhereUniqueInput[]
    update?: HistorialAcademicoUpdateWithWhereUniqueWithoutAlumnoInput | HistorialAcademicoUpdateWithWhereUniqueWithoutAlumnoInput[]
    updateMany?: HistorialAcademicoUpdateManyWithWhereWithoutAlumnoInput | HistorialAcademicoUpdateManyWithWhereWithoutAlumnoInput[]
    deleteMany?: HistorialAcademicoScalarWhereInput | HistorialAcademicoScalarWhereInput[]
  }

  export type AsistenciaCreateNestedManyWithoutPersonalInput = {
    create?: XOR<AsistenciaCreateWithoutPersonalInput, AsistenciaUncheckedCreateWithoutPersonalInput> | AsistenciaCreateWithoutPersonalInput[] | AsistenciaUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutPersonalInput | AsistenciaCreateOrConnectWithoutPersonalInput[]
    createMany?: AsistenciaCreateManyPersonalInputEnvelope
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
  }

  export type CodigoQrCreateNestedManyWithoutPersonalInput = {
    create?: XOR<CodigoQrCreateWithoutPersonalInput, CodigoQrUncheckedCreateWithoutPersonalInput> | CodigoQrCreateWithoutPersonalInput[] | CodigoQrUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: CodigoQrCreateOrConnectWithoutPersonalInput | CodigoQrCreateOrConnectWithoutPersonalInput[]
    createMany?: CodigoQrCreateManyPersonalInputEnvelope
    connect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
  }

  export type ExcusaCreateNestedManyWithoutPersonalInput = {
    create?: XOR<ExcusaCreateWithoutPersonalInput, ExcusaUncheckedCreateWithoutPersonalInput> | ExcusaCreateWithoutPersonalInput[] | ExcusaUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: ExcusaCreateOrConnectWithoutPersonalInput | ExcusaCreateOrConnectWithoutPersonalInput[]
    createMany?: ExcusaCreateManyPersonalInputEnvelope
    connect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
  }

  export type AsistenciaUncheckedCreateNestedManyWithoutPersonalInput = {
    create?: XOR<AsistenciaCreateWithoutPersonalInput, AsistenciaUncheckedCreateWithoutPersonalInput> | AsistenciaCreateWithoutPersonalInput[] | AsistenciaUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutPersonalInput | AsistenciaCreateOrConnectWithoutPersonalInput[]
    createMany?: AsistenciaCreateManyPersonalInputEnvelope
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
  }

  export type CodigoQrUncheckedCreateNestedManyWithoutPersonalInput = {
    create?: XOR<CodigoQrCreateWithoutPersonalInput, CodigoQrUncheckedCreateWithoutPersonalInput> | CodigoQrCreateWithoutPersonalInput[] | CodigoQrUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: CodigoQrCreateOrConnectWithoutPersonalInput | CodigoQrCreateOrConnectWithoutPersonalInput[]
    createMany?: CodigoQrCreateManyPersonalInputEnvelope
    connect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
  }

  export type ExcusaUncheckedCreateNestedManyWithoutPersonalInput = {
    create?: XOR<ExcusaCreateWithoutPersonalInput, ExcusaUncheckedCreateWithoutPersonalInput> | ExcusaCreateWithoutPersonalInput[] | ExcusaUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: ExcusaCreateOrConnectWithoutPersonalInput | ExcusaCreateOrConnectWithoutPersonalInput[]
    createMany?: ExcusaCreateManyPersonalInputEnvelope
    connect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
  }

  export type AsistenciaUpdateManyWithoutPersonalNestedInput = {
    create?: XOR<AsistenciaCreateWithoutPersonalInput, AsistenciaUncheckedCreateWithoutPersonalInput> | AsistenciaCreateWithoutPersonalInput[] | AsistenciaUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutPersonalInput | AsistenciaCreateOrConnectWithoutPersonalInput[]
    upsert?: AsistenciaUpsertWithWhereUniqueWithoutPersonalInput | AsistenciaUpsertWithWhereUniqueWithoutPersonalInput[]
    createMany?: AsistenciaCreateManyPersonalInputEnvelope
    set?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    disconnect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    delete?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    update?: AsistenciaUpdateWithWhereUniqueWithoutPersonalInput | AsistenciaUpdateWithWhereUniqueWithoutPersonalInput[]
    updateMany?: AsistenciaUpdateManyWithWhereWithoutPersonalInput | AsistenciaUpdateManyWithWhereWithoutPersonalInput[]
    deleteMany?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
  }

  export type CodigoQrUpdateManyWithoutPersonalNestedInput = {
    create?: XOR<CodigoQrCreateWithoutPersonalInput, CodigoQrUncheckedCreateWithoutPersonalInput> | CodigoQrCreateWithoutPersonalInput[] | CodigoQrUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: CodigoQrCreateOrConnectWithoutPersonalInput | CodigoQrCreateOrConnectWithoutPersonalInput[]
    upsert?: CodigoQrUpsertWithWhereUniqueWithoutPersonalInput | CodigoQrUpsertWithWhereUniqueWithoutPersonalInput[]
    createMany?: CodigoQrCreateManyPersonalInputEnvelope
    set?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    disconnect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    delete?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    connect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    update?: CodigoQrUpdateWithWhereUniqueWithoutPersonalInput | CodigoQrUpdateWithWhereUniqueWithoutPersonalInput[]
    updateMany?: CodigoQrUpdateManyWithWhereWithoutPersonalInput | CodigoQrUpdateManyWithWhereWithoutPersonalInput[]
    deleteMany?: CodigoQrScalarWhereInput | CodigoQrScalarWhereInput[]
  }

  export type ExcusaUpdateManyWithoutPersonalNestedInput = {
    create?: XOR<ExcusaCreateWithoutPersonalInput, ExcusaUncheckedCreateWithoutPersonalInput> | ExcusaCreateWithoutPersonalInput[] | ExcusaUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: ExcusaCreateOrConnectWithoutPersonalInput | ExcusaCreateOrConnectWithoutPersonalInput[]
    upsert?: ExcusaUpsertWithWhereUniqueWithoutPersonalInput | ExcusaUpsertWithWhereUniqueWithoutPersonalInput[]
    createMany?: ExcusaCreateManyPersonalInputEnvelope
    set?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    disconnect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    delete?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    connect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    update?: ExcusaUpdateWithWhereUniqueWithoutPersonalInput | ExcusaUpdateWithWhereUniqueWithoutPersonalInput[]
    updateMany?: ExcusaUpdateManyWithWhereWithoutPersonalInput | ExcusaUpdateManyWithWhereWithoutPersonalInput[]
    deleteMany?: ExcusaScalarWhereInput | ExcusaScalarWhereInput[]
  }

  export type AsistenciaUncheckedUpdateManyWithoutPersonalNestedInput = {
    create?: XOR<AsistenciaCreateWithoutPersonalInput, AsistenciaUncheckedCreateWithoutPersonalInput> | AsistenciaCreateWithoutPersonalInput[] | AsistenciaUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: AsistenciaCreateOrConnectWithoutPersonalInput | AsistenciaCreateOrConnectWithoutPersonalInput[]
    upsert?: AsistenciaUpsertWithWhereUniqueWithoutPersonalInput | AsistenciaUpsertWithWhereUniqueWithoutPersonalInput[]
    createMany?: AsistenciaCreateManyPersonalInputEnvelope
    set?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    disconnect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    delete?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    connect?: AsistenciaWhereUniqueInput | AsistenciaWhereUniqueInput[]
    update?: AsistenciaUpdateWithWhereUniqueWithoutPersonalInput | AsistenciaUpdateWithWhereUniqueWithoutPersonalInput[]
    updateMany?: AsistenciaUpdateManyWithWhereWithoutPersonalInput | AsistenciaUpdateManyWithWhereWithoutPersonalInput[]
    deleteMany?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
  }

  export type CodigoQrUncheckedUpdateManyWithoutPersonalNestedInput = {
    create?: XOR<CodigoQrCreateWithoutPersonalInput, CodigoQrUncheckedCreateWithoutPersonalInput> | CodigoQrCreateWithoutPersonalInput[] | CodigoQrUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: CodigoQrCreateOrConnectWithoutPersonalInput | CodigoQrCreateOrConnectWithoutPersonalInput[]
    upsert?: CodigoQrUpsertWithWhereUniqueWithoutPersonalInput | CodigoQrUpsertWithWhereUniqueWithoutPersonalInput[]
    createMany?: CodigoQrCreateManyPersonalInputEnvelope
    set?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    disconnect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    delete?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    connect?: CodigoQrWhereUniqueInput | CodigoQrWhereUniqueInput[]
    update?: CodigoQrUpdateWithWhereUniqueWithoutPersonalInput | CodigoQrUpdateWithWhereUniqueWithoutPersonalInput[]
    updateMany?: CodigoQrUpdateManyWithWhereWithoutPersonalInput | CodigoQrUpdateManyWithWhereWithoutPersonalInput[]
    deleteMany?: CodigoQrScalarWhereInput | CodigoQrScalarWhereInput[]
  }

  export type ExcusaUncheckedUpdateManyWithoutPersonalNestedInput = {
    create?: XOR<ExcusaCreateWithoutPersonalInput, ExcusaUncheckedCreateWithoutPersonalInput> | ExcusaCreateWithoutPersonalInput[] | ExcusaUncheckedCreateWithoutPersonalInput[]
    connectOrCreate?: ExcusaCreateOrConnectWithoutPersonalInput | ExcusaCreateOrConnectWithoutPersonalInput[]
    upsert?: ExcusaUpsertWithWhereUniqueWithoutPersonalInput | ExcusaUpsertWithWhereUniqueWithoutPersonalInput[]
    createMany?: ExcusaCreateManyPersonalInputEnvelope
    set?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    disconnect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    delete?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    connect?: ExcusaWhereUniqueInput | ExcusaWhereUniqueInput[]
    update?: ExcusaUpdateWithWhereUniqueWithoutPersonalInput | ExcusaUpdateWithWhereUniqueWithoutPersonalInput[]
    updateMany?: ExcusaUpdateManyWithWhereWithoutPersonalInput | ExcusaUpdateManyWithWhereWithoutPersonalInput[]
    deleteMany?: ExcusaScalarWhereInput | ExcusaScalarWhereInput[]
  }

  export type PersonalCreateNestedOneWithoutCodigos_qrInput = {
    create?: XOR<PersonalCreateWithoutCodigos_qrInput, PersonalUncheckedCreateWithoutCodigos_qrInput>
    connectOrCreate?: PersonalCreateOrConnectWithoutCodigos_qrInput
    connect?: PersonalWhereUniqueInput
  }

  export type AlumnoCreateNestedOneWithoutCodigos_qrInput = {
    create?: XOR<AlumnoCreateWithoutCodigos_qrInput, AlumnoUncheckedCreateWithoutCodigos_qrInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutCodigos_qrInput
    connect?: AlumnoWhereUniqueInput
  }

  export type PersonalUpdateOneWithoutCodigos_qrNestedInput = {
    create?: XOR<PersonalCreateWithoutCodigos_qrInput, PersonalUncheckedCreateWithoutCodigos_qrInput>
    connectOrCreate?: PersonalCreateOrConnectWithoutCodigos_qrInput
    upsert?: PersonalUpsertWithoutCodigos_qrInput
    disconnect?: PersonalWhereInput | boolean
    delete?: PersonalWhereInput | boolean
    connect?: PersonalWhereUniqueInput
    update?: XOR<XOR<PersonalUpdateToOneWithWhereWithoutCodigos_qrInput, PersonalUpdateWithoutCodigos_qrInput>, PersonalUncheckedUpdateWithoutCodigos_qrInput>
  }

  export type AlumnoUpdateOneWithoutCodigos_qrNestedInput = {
    create?: XOR<AlumnoCreateWithoutCodigos_qrInput, AlumnoUncheckedCreateWithoutCodigos_qrInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutCodigos_qrInput
    upsert?: AlumnoUpsertWithoutCodigos_qrInput
    disconnect?: AlumnoWhereInput | boolean
    delete?: AlumnoWhereInput | boolean
    connect?: AlumnoWhereUniqueInput
    update?: XOR<XOR<AlumnoUpdateToOneWithWhereWithoutCodigos_qrInput, AlumnoUpdateWithoutCodigos_qrInput>, AlumnoUncheckedUpdateWithoutCodigos_qrInput>
  }

  export type PersonalCreateNestedOneWithoutAsistenciasInput = {
    create?: XOR<PersonalCreateWithoutAsistenciasInput, PersonalUncheckedCreateWithoutAsistenciasInput>
    connectOrCreate?: PersonalCreateOrConnectWithoutAsistenciasInput
    connect?: PersonalWhereUniqueInput
  }

  export type AlumnoCreateNestedOneWithoutAsistenciasInput = {
    create?: XOR<AlumnoCreateWithoutAsistenciasInput, AlumnoUncheckedCreateWithoutAsistenciasInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutAsistenciasInput
    connect?: AlumnoWhereUniqueInput
  }

  export type PersonalUpdateOneWithoutAsistenciasNestedInput = {
    create?: XOR<PersonalCreateWithoutAsistenciasInput, PersonalUncheckedCreateWithoutAsistenciasInput>
    connectOrCreate?: PersonalCreateOrConnectWithoutAsistenciasInput
    upsert?: PersonalUpsertWithoutAsistenciasInput
    disconnect?: PersonalWhereInput | boolean
    delete?: PersonalWhereInput | boolean
    connect?: PersonalWhereUniqueInput
    update?: XOR<XOR<PersonalUpdateToOneWithWhereWithoutAsistenciasInput, PersonalUpdateWithoutAsistenciasInput>, PersonalUncheckedUpdateWithoutAsistenciasInput>
  }

  export type AlumnoUpdateOneWithoutAsistenciasNestedInput = {
    create?: XOR<AlumnoCreateWithoutAsistenciasInput, AlumnoUncheckedCreateWithoutAsistenciasInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutAsistenciasInput
    upsert?: AlumnoUpsertWithoutAsistenciasInput
    disconnect?: AlumnoWhereInput | boolean
    delete?: AlumnoWhereInput | boolean
    connect?: AlumnoWhereUniqueInput
    update?: XOR<XOR<AlumnoUpdateToOneWithWhereWithoutAsistenciasInput, AlumnoUpdateWithoutAsistenciasInput>, AlumnoUncheckedUpdateWithoutAsistenciasInput>
  }

  export type AuditoriaCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<AuditoriaCreateWithoutUsuarioInput, AuditoriaUncheckedCreateWithoutUsuarioInput> | AuditoriaCreateWithoutUsuarioInput[] | AuditoriaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: AuditoriaCreateOrConnectWithoutUsuarioInput | AuditoriaCreateOrConnectWithoutUsuarioInput[]
    createMany?: AuditoriaCreateManyUsuarioInputEnvelope
    connect?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
  }

  export type AuditoriaUncheckedCreateNestedManyWithoutUsuarioInput = {
    create?: XOR<AuditoriaCreateWithoutUsuarioInput, AuditoriaUncheckedCreateWithoutUsuarioInput> | AuditoriaCreateWithoutUsuarioInput[] | AuditoriaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: AuditoriaCreateOrConnectWithoutUsuarioInput | AuditoriaCreateOrConnectWithoutUsuarioInput[]
    createMany?: AuditoriaCreateManyUsuarioInputEnvelope
    connect?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
  }

  export type AuditoriaUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<AuditoriaCreateWithoutUsuarioInput, AuditoriaUncheckedCreateWithoutUsuarioInput> | AuditoriaCreateWithoutUsuarioInput[] | AuditoriaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: AuditoriaCreateOrConnectWithoutUsuarioInput | AuditoriaCreateOrConnectWithoutUsuarioInput[]
    upsert?: AuditoriaUpsertWithWhereUniqueWithoutUsuarioInput | AuditoriaUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: AuditoriaCreateManyUsuarioInputEnvelope
    set?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
    disconnect?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
    delete?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
    connect?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
    update?: AuditoriaUpdateWithWhereUniqueWithoutUsuarioInput | AuditoriaUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: AuditoriaUpdateManyWithWhereWithoutUsuarioInput | AuditoriaUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: AuditoriaScalarWhereInput | AuditoriaScalarWhereInput[]
  }

  export type AuditoriaUncheckedUpdateManyWithoutUsuarioNestedInput = {
    create?: XOR<AuditoriaCreateWithoutUsuarioInput, AuditoriaUncheckedCreateWithoutUsuarioInput> | AuditoriaCreateWithoutUsuarioInput[] | AuditoriaUncheckedCreateWithoutUsuarioInput[]
    connectOrCreate?: AuditoriaCreateOrConnectWithoutUsuarioInput | AuditoriaCreateOrConnectWithoutUsuarioInput[]
    upsert?: AuditoriaUpsertWithWhereUniqueWithoutUsuarioInput | AuditoriaUpsertWithWhereUniqueWithoutUsuarioInput[]
    createMany?: AuditoriaCreateManyUsuarioInputEnvelope
    set?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
    disconnect?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
    delete?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
    connect?: AuditoriaWhereUniqueInput | AuditoriaWhereUniqueInput[]
    update?: AuditoriaUpdateWithWhereUniqueWithoutUsuarioInput | AuditoriaUpdateWithWhereUniqueWithoutUsuarioInput[]
    updateMany?: AuditoriaUpdateManyWithWhereWithoutUsuarioInput | AuditoriaUpdateManyWithWhereWithoutUsuarioInput[]
    deleteMany?: AuditoriaScalarWhereInput | AuditoriaScalarWhereInput[]
  }

  export type UsuarioCreateNestedOneWithoutAuditoriasInput = {
    create?: XOR<UsuarioCreateWithoutAuditoriasInput, UsuarioUncheckedCreateWithoutAuditoriasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutAuditoriasInput
    connect?: UsuarioWhereUniqueInput
  }

  export type UsuarioUpdateOneWithoutAuditoriasNestedInput = {
    create?: XOR<UsuarioCreateWithoutAuditoriasInput, UsuarioUncheckedCreateWithoutAuditoriasInput>
    connectOrCreate?: UsuarioCreateOrConnectWithoutAuditoriasInput
    upsert?: UsuarioUpsertWithoutAuditoriasInput
    disconnect?: UsuarioWhereInput | boolean
    delete?: UsuarioWhereInput | boolean
    connect?: UsuarioWhereUniqueInput
    update?: XOR<XOR<UsuarioUpdateToOneWithWhereWithoutAuditoriasInput, UsuarioUpdateWithoutAuditoriasInput>, UsuarioUncheckedUpdateWithoutAuditoriasInput>
  }

  export type AlumnoCreateNestedOneWithoutExcusasInput = {
    create?: XOR<AlumnoCreateWithoutExcusasInput, AlumnoUncheckedCreateWithoutExcusasInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutExcusasInput
    connect?: AlumnoWhereUniqueInput
  }

  export type PersonalCreateNestedOneWithoutExcusasInput = {
    create?: XOR<PersonalCreateWithoutExcusasInput, PersonalUncheckedCreateWithoutExcusasInput>
    connectOrCreate?: PersonalCreateOrConnectWithoutExcusasInput
    connect?: PersonalWhereUniqueInput
  }

  export type AlumnoUpdateOneWithoutExcusasNestedInput = {
    create?: XOR<AlumnoCreateWithoutExcusasInput, AlumnoUncheckedCreateWithoutExcusasInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutExcusasInput
    upsert?: AlumnoUpsertWithoutExcusasInput
    disconnect?: AlumnoWhereInput | boolean
    delete?: AlumnoWhereInput | boolean
    connect?: AlumnoWhereUniqueInput
    update?: XOR<XOR<AlumnoUpdateToOneWithWhereWithoutExcusasInput, AlumnoUpdateWithoutExcusasInput>, AlumnoUncheckedUpdateWithoutExcusasInput>
  }

  export type PersonalUpdateOneWithoutExcusasNestedInput = {
    create?: XOR<PersonalCreateWithoutExcusasInput, PersonalUncheckedCreateWithoutExcusasInput>
    connectOrCreate?: PersonalCreateOrConnectWithoutExcusasInput
    upsert?: PersonalUpsertWithoutExcusasInput
    disconnect?: PersonalWhereInput | boolean
    delete?: PersonalWhereInput | boolean
    connect?: PersonalWhereUniqueInput
    update?: XOR<XOR<PersonalUpdateToOneWithWhereWithoutExcusasInput, PersonalUpdateWithoutExcusasInput>, PersonalUncheckedUpdateWithoutExcusasInput>
  }

  export type AlumnoCreateNestedOneWithoutHistorialInput = {
    create?: XOR<AlumnoCreateWithoutHistorialInput, AlumnoUncheckedCreateWithoutHistorialInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutHistorialInput
    connect?: AlumnoWhereUniqueInput
  }

  export type AlumnoUpdateOneRequiredWithoutHistorialNestedInput = {
    create?: XOR<AlumnoCreateWithoutHistorialInput, AlumnoUncheckedCreateWithoutHistorialInput>
    connectOrCreate?: AlumnoCreateOrConnectWithoutHistorialInput
    upsert?: AlumnoUpsertWithoutHistorialInput
    connect?: AlumnoWhereUniqueInput
    update?: XOR<XOR<AlumnoUpdateToOneWithWhereWithoutHistorialInput, AlumnoUpdateWithoutHistorialInput>, AlumnoUncheckedUpdateWithoutHistorialInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AsistenciaCreateWithoutAlumnoInput = {
    persona_tipo: string
    tipo_evento: string
    timestamp?: Date | string
    origen?: string
    dispositivo?: string | null
    estado_puntualidad?: string | null
    observaciones?: string | null
    creado_en?: Date | string
    personal?: PersonalCreateNestedOneWithoutAsistenciasInput
  }

  export type AsistenciaUncheckedCreateWithoutAlumnoInput = {
    id?: number
    persona_tipo: string
    personal_id?: number | null
    tipo_evento: string
    timestamp?: Date | string
    origen?: string
    dispositivo?: string | null
    estado_puntualidad?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type AsistenciaCreateOrConnectWithoutAlumnoInput = {
    where: AsistenciaWhereUniqueInput
    create: XOR<AsistenciaCreateWithoutAlumnoInput, AsistenciaUncheckedCreateWithoutAlumnoInput>
  }

  export type AsistenciaCreateManyAlumnoInputEnvelope = {
    data: AsistenciaCreateManyAlumnoInput | AsistenciaCreateManyAlumnoInput[]
  }

  export type CodigoQrCreateWithoutAlumnoInput = {
    persona_tipo: string
    token: string
    png_path?: string | null
    vigente?: boolean
    generado_en?: Date | string
    regenerado_en?: Date | string | null
    personal?: PersonalCreateNestedOneWithoutCodigos_qrInput
  }

  export type CodigoQrUncheckedCreateWithoutAlumnoInput = {
    id?: number
    persona_tipo: string
    personal_id?: number | null
    token: string
    png_path?: string | null
    vigente?: boolean
    generado_en?: Date | string
    regenerado_en?: Date | string | null
  }

  export type CodigoQrCreateOrConnectWithoutAlumnoInput = {
    where: CodigoQrWhereUniqueInput
    create: XOR<CodigoQrCreateWithoutAlumnoInput, CodigoQrUncheckedCreateWithoutAlumnoInput>
  }

  export type CodigoQrCreateManyAlumnoInputEnvelope = {
    data: CodigoQrCreateManyAlumnoInput | CodigoQrCreateManyAlumnoInput[]
  }

  export type ExcusaCreateWithoutAlumnoInput = {
    motivo: string
    descripcion?: string | null
    estado?: string
    fecha?: Date | string
    fecha_ausencia?: Date | string | null
    documento_url?: string | null
    observaciones?: string | null
    creado_en?: Date | string
    personal?: PersonalCreateNestedOneWithoutExcusasInput
  }

  export type ExcusaUncheckedCreateWithoutAlumnoInput = {
    id?: number
    personal_id?: number | null
    motivo: string
    descripcion?: string | null
    estado?: string
    fecha?: Date | string
    fecha_ausencia?: Date | string | null
    documento_url?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type ExcusaCreateOrConnectWithoutAlumnoInput = {
    where: ExcusaWhereUniqueInput
    create: XOR<ExcusaCreateWithoutAlumnoInput, ExcusaUncheckedCreateWithoutAlumnoInput>
  }

  export type ExcusaCreateManyAlumnoInputEnvelope = {
    data: ExcusaCreateManyAlumnoInput | ExcusaCreateManyAlumnoInput[]
  }

  export type HistorialAcademicoCreateWithoutAlumnoInput = {
    anio_escolar: number
    grado_cursado: string
    nivel: string
    carrera?: string | null
    promovido?: boolean
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type HistorialAcademicoUncheckedCreateWithoutAlumnoInput = {
    id?: number
    anio_escolar: number
    grado_cursado: string
    nivel: string
    carrera?: string | null
    promovido?: boolean
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type HistorialAcademicoCreateOrConnectWithoutAlumnoInput = {
    where: HistorialAcademicoWhereUniqueInput
    create: XOR<HistorialAcademicoCreateWithoutAlumnoInput, HistorialAcademicoUncheckedCreateWithoutAlumnoInput>
  }

  export type HistorialAcademicoCreateManyAlumnoInputEnvelope = {
    data: HistorialAcademicoCreateManyAlumnoInput | HistorialAcademicoCreateManyAlumnoInput[]
  }

  export type AsistenciaUpsertWithWhereUniqueWithoutAlumnoInput = {
    where: AsistenciaWhereUniqueInput
    update: XOR<AsistenciaUpdateWithoutAlumnoInput, AsistenciaUncheckedUpdateWithoutAlumnoInput>
    create: XOR<AsistenciaCreateWithoutAlumnoInput, AsistenciaUncheckedCreateWithoutAlumnoInput>
  }

  export type AsistenciaUpdateWithWhereUniqueWithoutAlumnoInput = {
    where: AsistenciaWhereUniqueInput
    data: XOR<AsistenciaUpdateWithoutAlumnoInput, AsistenciaUncheckedUpdateWithoutAlumnoInput>
  }

  export type AsistenciaUpdateManyWithWhereWithoutAlumnoInput = {
    where: AsistenciaScalarWhereInput
    data: XOR<AsistenciaUpdateManyMutationInput, AsistenciaUncheckedUpdateManyWithoutAlumnoInput>
  }

  export type AsistenciaScalarWhereInput = {
    AND?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
    OR?: AsistenciaScalarWhereInput[]
    NOT?: AsistenciaScalarWhereInput | AsistenciaScalarWhereInput[]
    id?: IntFilter<"Asistencia"> | number
    persona_tipo?: StringFilter<"Asistencia"> | string
    alumno_id?: IntNullableFilter<"Asistencia"> | number | null
    personal_id?: IntNullableFilter<"Asistencia"> | number | null
    tipo_evento?: StringFilter<"Asistencia"> | string
    timestamp?: DateTimeFilter<"Asistencia"> | Date | string
    origen?: StringFilter<"Asistencia"> | string
    dispositivo?: StringNullableFilter<"Asistencia"> | string | null
    estado_puntualidad?: StringNullableFilter<"Asistencia"> | string | null
    observaciones?: StringNullableFilter<"Asistencia"> | string | null
    creado_en?: DateTimeFilter<"Asistencia"> | Date | string
  }

  export type CodigoQrUpsertWithWhereUniqueWithoutAlumnoInput = {
    where: CodigoQrWhereUniqueInput
    update: XOR<CodigoQrUpdateWithoutAlumnoInput, CodigoQrUncheckedUpdateWithoutAlumnoInput>
    create: XOR<CodigoQrCreateWithoutAlumnoInput, CodigoQrUncheckedCreateWithoutAlumnoInput>
  }

  export type CodigoQrUpdateWithWhereUniqueWithoutAlumnoInput = {
    where: CodigoQrWhereUniqueInput
    data: XOR<CodigoQrUpdateWithoutAlumnoInput, CodigoQrUncheckedUpdateWithoutAlumnoInput>
  }

  export type CodigoQrUpdateManyWithWhereWithoutAlumnoInput = {
    where: CodigoQrScalarWhereInput
    data: XOR<CodigoQrUpdateManyMutationInput, CodigoQrUncheckedUpdateManyWithoutAlumnoInput>
  }

  export type CodigoQrScalarWhereInput = {
    AND?: CodigoQrScalarWhereInput | CodigoQrScalarWhereInput[]
    OR?: CodigoQrScalarWhereInput[]
    NOT?: CodigoQrScalarWhereInput | CodigoQrScalarWhereInput[]
    id?: IntFilter<"CodigoQr"> | number
    persona_tipo?: StringFilter<"CodigoQr"> | string
    alumno_id?: IntNullableFilter<"CodigoQr"> | number | null
    personal_id?: IntNullableFilter<"CodigoQr"> | number | null
    token?: StringFilter<"CodigoQr"> | string
    png_path?: StringNullableFilter<"CodigoQr"> | string | null
    vigente?: BoolFilter<"CodigoQr"> | boolean
    generado_en?: DateTimeFilter<"CodigoQr"> | Date | string
    regenerado_en?: DateTimeNullableFilter<"CodigoQr"> | Date | string | null
  }

  export type ExcusaUpsertWithWhereUniqueWithoutAlumnoInput = {
    where: ExcusaWhereUniqueInput
    update: XOR<ExcusaUpdateWithoutAlumnoInput, ExcusaUncheckedUpdateWithoutAlumnoInput>
    create: XOR<ExcusaCreateWithoutAlumnoInput, ExcusaUncheckedCreateWithoutAlumnoInput>
  }

  export type ExcusaUpdateWithWhereUniqueWithoutAlumnoInput = {
    where: ExcusaWhereUniqueInput
    data: XOR<ExcusaUpdateWithoutAlumnoInput, ExcusaUncheckedUpdateWithoutAlumnoInput>
  }

  export type ExcusaUpdateManyWithWhereWithoutAlumnoInput = {
    where: ExcusaScalarWhereInput
    data: XOR<ExcusaUpdateManyMutationInput, ExcusaUncheckedUpdateManyWithoutAlumnoInput>
  }

  export type ExcusaScalarWhereInput = {
    AND?: ExcusaScalarWhereInput | ExcusaScalarWhereInput[]
    OR?: ExcusaScalarWhereInput[]
    NOT?: ExcusaScalarWhereInput | ExcusaScalarWhereInput[]
    id?: IntFilter<"Excusa"> | number
    alumno_id?: IntNullableFilter<"Excusa"> | number | null
    personal_id?: IntNullableFilter<"Excusa"> | number | null
    motivo?: StringFilter<"Excusa"> | string
    descripcion?: StringNullableFilter<"Excusa"> | string | null
    estado?: StringFilter<"Excusa"> | string
    fecha?: DateTimeFilter<"Excusa"> | Date | string
    fecha_ausencia?: DateTimeNullableFilter<"Excusa"> | Date | string | null
    documento_url?: StringNullableFilter<"Excusa"> | string | null
    observaciones?: StringNullableFilter<"Excusa"> | string | null
    creado_en?: DateTimeFilter<"Excusa"> | Date | string
  }

  export type HistorialAcademicoUpsertWithWhereUniqueWithoutAlumnoInput = {
    where: HistorialAcademicoWhereUniqueInput
    update: XOR<HistorialAcademicoUpdateWithoutAlumnoInput, HistorialAcademicoUncheckedUpdateWithoutAlumnoInput>
    create: XOR<HistorialAcademicoCreateWithoutAlumnoInput, HistorialAcademicoUncheckedCreateWithoutAlumnoInput>
  }

  export type HistorialAcademicoUpdateWithWhereUniqueWithoutAlumnoInput = {
    where: HistorialAcademicoWhereUniqueInput
    data: XOR<HistorialAcademicoUpdateWithoutAlumnoInput, HistorialAcademicoUncheckedUpdateWithoutAlumnoInput>
  }

  export type HistorialAcademicoUpdateManyWithWhereWithoutAlumnoInput = {
    where: HistorialAcademicoScalarWhereInput
    data: XOR<HistorialAcademicoUpdateManyMutationInput, HistorialAcademicoUncheckedUpdateManyWithoutAlumnoInput>
  }

  export type HistorialAcademicoScalarWhereInput = {
    AND?: HistorialAcademicoScalarWhereInput | HistorialAcademicoScalarWhereInput[]
    OR?: HistorialAcademicoScalarWhereInput[]
    NOT?: HistorialAcademicoScalarWhereInput | HistorialAcademicoScalarWhereInput[]
    id?: IntFilter<"HistorialAcademico"> | number
    alumno_id?: IntFilter<"HistorialAcademico"> | number
    anio_escolar?: IntFilter<"HistorialAcademico"> | number
    grado_cursado?: StringFilter<"HistorialAcademico"> | string
    nivel?: StringFilter<"HistorialAcademico"> | string
    carrera?: StringNullableFilter<"HistorialAcademico"> | string | null
    promovido?: BoolFilter<"HistorialAcademico"> | boolean
    observaciones?: StringNullableFilter<"HistorialAcademico"> | string | null
    creado_en?: DateTimeFilter<"HistorialAcademico"> | Date | string
  }

  export type AsistenciaCreateWithoutPersonalInput = {
    persona_tipo: string
    tipo_evento: string
    timestamp?: Date | string
    origen?: string
    dispositivo?: string | null
    estado_puntualidad?: string | null
    observaciones?: string | null
    creado_en?: Date | string
    alumno?: AlumnoCreateNestedOneWithoutAsistenciasInput
  }

  export type AsistenciaUncheckedCreateWithoutPersonalInput = {
    id?: number
    persona_tipo: string
    alumno_id?: number | null
    tipo_evento: string
    timestamp?: Date | string
    origen?: string
    dispositivo?: string | null
    estado_puntualidad?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type AsistenciaCreateOrConnectWithoutPersonalInput = {
    where: AsistenciaWhereUniqueInput
    create: XOR<AsistenciaCreateWithoutPersonalInput, AsistenciaUncheckedCreateWithoutPersonalInput>
  }

  export type AsistenciaCreateManyPersonalInputEnvelope = {
    data: AsistenciaCreateManyPersonalInput | AsistenciaCreateManyPersonalInput[]
  }

  export type CodigoQrCreateWithoutPersonalInput = {
    persona_tipo: string
    token: string
    png_path?: string | null
    vigente?: boolean
    generado_en?: Date | string
    regenerado_en?: Date | string | null
    alumno?: AlumnoCreateNestedOneWithoutCodigos_qrInput
  }

  export type CodigoQrUncheckedCreateWithoutPersonalInput = {
    id?: number
    persona_tipo: string
    alumno_id?: number | null
    token: string
    png_path?: string | null
    vigente?: boolean
    generado_en?: Date | string
    regenerado_en?: Date | string | null
  }

  export type CodigoQrCreateOrConnectWithoutPersonalInput = {
    where: CodigoQrWhereUniqueInput
    create: XOR<CodigoQrCreateWithoutPersonalInput, CodigoQrUncheckedCreateWithoutPersonalInput>
  }

  export type CodigoQrCreateManyPersonalInputEnvelope = {
    data: CodigoQrCreateManyPersonalInput | CodigoQrCreateManyPersonalInput[]
  }

  export type ExcusaCreateWithoutPersonalInput = {
    motivo: string
    descripcion?: string | null
    estado?: string
    fecha?: Date | string
    fecha_ausencia?: Date | string | null
    documento_url?: string | null
    observaciones?: string | null
    creado_en?: Date | string
    alumno?: AlumnoCreateNestedOneWithoutExcusasInput
  }

  export type ExcusaUncheckedCreateWithoutPersonalInput = {
    id?: number
    alumno_id?: number | null
    motivo: string
    descripcion?: string | null
    estado?: string
    fecha?: Date | string
    fecha_ausencia?: Date | string | null
    documento_url?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type ExcusaCreateOrConnectWithoutPersonalInput = {
    where: ExcusaWhereUniqueInput
    create: XOR<ExcusaCreateWithoutPersonalInput, ExcusaUncheckedCreateWithoutPersonalInput>
  }

  export type ExcusaCreateManyPersonalInputEnvelope = {
    data: ExcusaCreateManyPersonalInput | ExcusaCreateManyPersonalInput[]
  }

  export type AsistenciaUpsertWithWhereUniqueWithoutPersonalInput = {
    where: AsistenciaWhereUniqueInput
    update: XOR<AsistenciaUpdateWithoutPersonalInput, AsistenciaUncheckedUpdateWithoutPersonalInput>
    create: XOR<AsistenciaCreateWithoutPersonalInput, AsistenciaUncheckedCreateWithoutPersonalInput>
  }

  export type AsistenciaUpdateWithWhereUniqueWithoutPersonalInput = {
    where: AsistenciaWhereUniqueInput
    data: XOR<AsistenciaUpdateWithoutPersonalInput, AsistenciaUncheckedUpdateWithoutPersonalInput>
  }

  export type AsistenciaUpdateManyWithWhereWithoutPersonalInput = {
    where: AsistenciaScalarWhereInput
    data: XOR<AsistenciaUpdateManyMutationInput, AsistenciaUncheckedUpdateManyWithoutPersonalInput>
  }

  export type CodigoQrUpsertWithWhereUniqueWithoutPersonalInput = {
    where: CodigoQrWhereUniqueInput
    update: XOR<CodigoQrUpdateWithoutPersonalInput, CodigoQrUncheckedUpdateWithoutPersonalInput>
    create: XOR<CodigoQrCreateWithoutPersonalInput, CodigoQrUncheckedCreateWithoutPersonalInput>
  }

  export type CodigoQrUpdateWithWhereUniqueWithoutPersonalInput = {
    where: CodigoQrWhereUniqueInput
    data: XOR<CodigoQrUpdateWithoutPersonalInput, CodigoQrUncheckedUpdateWithoutPersonalInput>
  }

  export type CodigoQrUpdateManyWithWhereWithoutPersonalInput = {
    where: CodigoQrScalarWhereInput
    data: XOR<CodigoQrUpdateManyMutationInput, CodigoQrUncheckedUpdateManyWithoutPersonalInput>
  }

  export type ExcusaUpsertWithWhereUniqueWithoutPersonalInput = {
    where: ExcusaWhereUniqueInput
    update: XOR<ExcusaUpdateWithoutPersonalInput, ExcusaUncheckedUpdateWithoutPersonalInput>
    create: XOR<ExcusaCreateWithoutPersonalInput, ExcusaUncheckedCreateWithoutPersonalInput>
  }

  export type ExcusaUpdateWithWhereUniqueWithoutPersonalInput = {
    where: ExcusaWhereUniqueInput
    data: XOR<ExcusaUpdateWithoutPersonalInput, ExcusaUncheckedUpdateWithoutPersonalInput>
  }

  export type ExcusaUpdateManyWithWhereWithoutPersonalInput = {
    where: ExcusaScalarWhereInput
    data: XOR<ExcusaUpdateManyMutationInput, ExcusaUncheckedUpdateManyWithoutPersonalInput>
  }

  export type PersonalCreateWithoutCodigos_qrInput = {
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    cargo?: string | null
    jornada?: string | null
    grado_guia?: string | null
    estado?: string
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    curso?: string | null
    asistencias?: AsistenciaCreateNestedManyWithoutPersonalInput
    excusas?: ExcusaCreateNestedManyWithoutPersonalInput
  }

  export type PersonalUncheckedCreateWithoutCodigos_qrInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    cargo?: string | null
    jornada?: string | null
    grado_guia?: string | null
    estado?: string
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    curso?: string | null
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutPersonalInput
    excusas?: ExcusaUncheckedCreateNestedManyWithoutPersonalInput
  }

  export type PersonalCreateOrConnectWithoutCodigos_qrInput = {
    where: PersonalWhereUniqueInput
    create: XOR<PersonalCreateWithoutCodigos_qrInput, PersonalUncheckedCreateWithoutCodigos_qrInput>
  }

  export type AlumnoCreateWithoutCodigos_qrInput = {
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    asistencias?: AsistenciaCreateNestedManyWithoutAlumnoInput
    excusas?: ExcusaCreateNestedManyWithoutAlumnoInput
    historial?: HistorialAcademicoCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateWithoutCodigos_qrInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutAlumnoInput
    excusas?: ExcusaUncheckedCreateNestedManyWithoutAlumnoInput
    historial?: HistorialAcademicoUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoCreateOrConnectWithoutCodigos_qrInput = {
    where: AlumnoWhereUniqueInput
    create: XOR<AlumnoCreateWithoutCodigos_qrInput, AlumnoUncheckedCreateWithoutCodigos_qrInput>
  }

  export type PersonalUpsertWithoutCodigos_qrInput = {
    update: XOR<PersonalUpdateWithoutCodigos_qrInput, PersonalUncheckedUpdateWithoutCodigos_qrInput>
    create: XOR<PersonalCreateWithoutCodigos_qrInput, PersonalUncheckedCreateWithoutCodigos_qrInput>
    where?: PersonalWhereInput
  }

  export type PersonalUpdateToOneWithWhereWithoutCodigos_qrInput = {
    where?: PersonalWhereInput
    data: XOR<PersonalUpdateWithoutCodigos_qrInput, PersonalUncheckedUpdateWithoutCodigos_qrInput>
  }

  export type PersonalUpdateWithoutCodigos_qrInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
    asistencias?: AsistenciaUpdateManyWithoutPersonalNestedInput
    excusas?: ExcusaUpdateManyWithoutPersonalNestedInput
  }

  export type PersonalUncheckedUpdateWithoutCodigos_qrInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
    asistencias?: AsistenciaUncheckedUpdateManyWithoutPersonalNestedInput
    excusas?: ExcusaUncheckedUpdateManyWithoutPersonalNestedInput
  }

  export type AlumnoUpsertWithoutCodigos_qrInput = {
    update: XOR<AlumnoUpdateWithoutCodigos_qrInput, AlumnoUncheckedUpdateWithoutCodigos_qrInput>
    create: XOR<AlumnoCreateWithoutCodigos_qrInput, AlumnoUncheckedCreateWithoutCodigos_qrInput>
    where?: AlumnoWhereInput
  }

  export type AlumnoUpdateToOneWithWhereWithoutCodigos_qrInput = {
    where?: AlumnoWhereInput
    data: XOR<AlumnoUpdateWithoutCodigos_qrInput, AlumnoUncheckedUpdateWithoutCodigos_qrInput>
  }

  export type AlumnoUpdateWithoutCodigos_qrInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencias?: AsistenciaUpdateManyWithoutAlumnoNestedInput
    excusas?: ExcusaUpdateManyWithoutAlumnoNestedInput
    historial?: HistorialAcademicoUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateWithoutCodigos_qrInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencias?: AsistenciaUncheckedUpdateManyWithoutAlumnoNestedInput
    excusas?: ExcusaUncheckedUpdateManyWithoutAlumnoNestedInput
    historial?: HistorialAcademicoUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type PersonalCreateWithoutAsistenciasInput = {
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    cargo?: string | null
    jornada?: string | null
    grado_guia?: string | null
    estado?: string
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    curso?: string | null
    codigos_qr?: CodigoQrCreateNestedManyWithoutPersonalInput
    excusas?: ExcusaCreateNestedManyWithoutPersonalInput
  }

  export type PersonalUncheckedCreateWithoutAsistenciasInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    cargo?: string | null
    jornada?: string | null
    grado_guia?: string | null
    estado?: string
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    curso?: string | null
    codigos_qr?: CodigoQrUncheckedCreateNestedManyWithoutPersonalInput
    excusas?: ExcusaUncheckedCreateNestedManyWithoutPersonalInput
  }

  export type PersonalCreateOrConnectWithoutAsistenciasInput = {
    where: PersonalWhereUniqueInput
    create: XOR<PersonalCreateWithoutAsistenciasInput, PersonalUncheckedCreateWithoutAsistenciasInput>
  }

  export type AlumnoCreateWithoutAsistenciasInput = {
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    codigos_qr?: CodigoQrCreateNestedManyWithoutAlumnoInput
    excusas?: ExcusaCreateNestedManyWithoutAlumnoInput
    historial?: HistorialAcademicoCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateWithoutAsistenciasInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    codigos_qr?: CodigoQrUncheckedCreateNestedManyWithoutAlumnoInput
    excusas?: ExcusaUncheckedCreateNestedManyWithoutAlumnoInput
    historial?: HistorialAcademicoUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoCreateOrConnectWithoutAsistenciasInput = {
    where: AlumnoWhereUniqueInput
    create: XOR<AlumnoCreateWithoutAsistenciasInput, AlumnoUncheckedCreateWithoutAsistenciasInput>
  }

  export type PersonalUpsertWithoutAsistenciasInput = {
    update: XOR<PersonalUpdateWithoutAsistenciasInput, PersonalUncheckedUpdateWithoutAsistenciasInput>
    create: XOR<PersonalCreateWithoutAsistenciasInput, PersonalUncheckedCreateWithoutAsistenciasInput>
    where?: PersonalWhereInput
  }

  export type PersonalUpdateToOneWithWhereWithoutAsistenciasInput = {
    where?: PersonalWhereInput
    data: XOR<PersonalUpdateWithoutAsistenciasInput, PersonalUncheckedUpdateWithoutAsistenciasInput>
  }

  export type PersonalUpdateWithoutAsistenciasInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
    codigos_qr?: CodigoQrUpdateManyWithoutPersonalNestedInput
    excusas?: ExcusaUpdateManyWithoutPersonalNestedInput
  }

  export type PersonalUncheckedUpdateWithoutAsistenciasInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
    codigos_qr?: CodigoQrUncheckedUpdateManyWithoutPersonalNestedInput
    excusas?: ExcusaUncheckedUpdateManyWithoutPersonalNestedInput
  }

  export type AlumnoUpsertWithoutAsistenciasInput = {
    update: XOR<AlumnoUpdateWithoutAsistenciasInput, AlumnoUncheckedUpdateWithoutAsistenciasInput>
    create: XOR<AlumnoCreateWithoutAsistenciasInput, AlumnoUncheckedCreateWithoutAsistenciasInput>
    where?: AlumnoWhereInput
  }

  export type AlumnoUpdateToOneWithWhereWithoutAsistenciasInput = {
    where?: AlumnoWhereInput
    data: XOR<AlumnoUpdateWithoutAsistenciasInput, AlumnoUncheckedUpdateWithoutAsistenciasInput>
  }

  export type AlumnoUpdateWithoutAsistenciasInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    codigos_qr?: CodigoQrUpdateManyWithoutAlumnoNestedInput
    excusas?: ExcusaUpdateManyWithoutAlumnoNestedInput
    historial?: HistorialAcademicoUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateWithoutAsistenciasInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    codigos_qr?: CodigoQrUncheckedUpdateManyWithoutAlumnoNestedInput
    excusas?: ExcusaUncheckedUpdateManyWithoutAlumnoNestedInput
    historial?: HistorialAcademicoUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type AuditoriaCreateWithoutUsuarioInput = {
    entidad: string
    entidad_id?: number | null
    accion: string
    detalle?: string | null
    timestamp?: Date | string
  }

  export type AuditoriaUncheckedCreateWithoutUsuarioInput = {
    id?: number
    entidad: string
    entidad_id?: number | null
    accion: string
    detalle?: string | null
    timestamp?: Date | string
  }

  export type AuditoriaCreateOrConnectWithoutUsuarioInput = {
    where: AuditoriaWhereUniqueInput
    create: XOR<AuditoriaCreateWithoutUsuarioInput, AuditoriaUncheckedCreateWithoutUsuarioInput>
  }

  export type AuditoriaCreateManyUsuarioInputEnvelope = {
    data: AuditoriaCreateManyUsuarioInput | AuditoriaCreateManyUsuarioInput[]
  }

  export type AuditoriaUpsertWithWhereUniqueWithoutUsuarioInput = {
    where: AuditoriaWhereUniqueInput
    update: XOR<AuditoriaUpdateWithoutUsuarioInput, AuditoriaUncheckedUpdateWithoutUsuarioInput>
    create: XOR<AuditoriaCreateWithoutUsuarioInput, AuditoriaUncheckedCreateWithoutUsuarioInput>
  }

  export type AuditoriaUpdateWithWhereUniqueWithoutUsuarioInput = {
    where: AuditoriaWhereUniqueInput
    data: XOR<AuditoriaUpdateWithoutUsuarioInput, AuditoriaUncheckedUpdateWithoutUsuarioInput>
  }

  export type AuditoriaUpdateManyWithWhereWithoutUsuarioInput = {
    where: AuditoriaScalarWhereInput
    data: XOR<AuditoriaUpdateManyMutationInput, AuditoriaUncheckedUpdateManyWithoutUsuarioInput>
  }

  export type AuditoriaScalarWhereInput = {
    AND?: AuditoriaScalarWhereInput | AuditoriaScalarWhereInput[]
    OR?: AuditoriaScalarWhereInput[]
    NOT?: AuditoriaScalarWhereInput | AuditoriaScalarWhereInput[]
    id?: IntFilter<"Auditoria"> | number
    entidad?: StringFilter<"Auditoria"> | string
    entidad_id?: IntNullableFilter<"Auditoria"> | number | null
    usuario_id?: IntNullableFilter<"Auditoria"> | number | null
    accion?: StringFilter<"Auditoria"> | string
    detalle?: StringNullableFilter<"Auditoria"> | string | null
    timestamp?: DateTimeFilter<"Auditoria"> | Date | string
  }

  export type UsuarioCreateWithoutAuditoriasInput = {
    email: string
    nombres?: string | null
    apellidos?: string | null
    foto_path?: string | null
    cargo?: string | null
    jornada?: string | null
    rol?: string
    hash_pass: string
    activo?: boolean
    creado_en?: Date | string
    actualizado_en?: Date | string
  }

  export type UsuarioUncheckedCreateWithoutAuditoriasInput = {
    id?: number
    email: string
    nombres?: string | null
    apellidos?: string | null
    foto_path?: string | null
    cargo?: string | null
    jornada?: string | null
    rol?: string
    hash_pass: string
    activo?: boolean
    creado_en?: Date | string
    actualizado_en?: Date | string
  }

  export type UsuarioCreateOrConnectWithoutAuditoriasInput = {
    where: UsuarioWhereUniqueInput
    create: XOR<UsuarioCreateWithoutAuditoriasInput, UsuarioUncheckedCreateWithoutAuditoriasInput>
  }

  export type UsuarioUpsertWithoutAuditoriasInput = {
    update: XOR<UsuarioUpdateWithoutAuditoriasInput, UsuarioUncheckedUpdateWithoutAuditoriasInput>
    create: XOR<UsuarioCreateWithoutAuditoriasInput, UsuarioUncheckedCreateWithoutAuditoriasInput>
    where?: UsuarioWhereInput
  }

  export type UsuarioUpdateToOneWithWhereWithoutAuditoriasInput = {
    where?: UsuarioWhereInput
    data: XOR<UsuarioUpdateWithoutAuditoriasInput, UsuarioUncheckedUpdateWithoutAuditoriasInput>
  }

  export type UsuarioUpdateWithoutAuditoriasInput = {
    email?: StringFieldUpdateOperationsInput | string
    nombres?: NullableStringFieldUpdateOperationsInput | string | null
    apellidos?: NullableStringFieldUpdateOperationsInput | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    hash_pass?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateWithoutAuditoriasInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    nombres?: NullableStringFieldUpdateOperationsInput | string | null
    apellidos?: NullableStringFieldUpdateOperationsInput | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    rol?: StringFieldUpdateOperationsInput | string
    hash_pass?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlumnoCreateWithoutExcusasInput = {
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    asistencias?: AsistenciaCreateNestedManyWithoutAlumnoInput
    codigos_qr?: CodigoQrCreateNestedManyWithoutAlumnoInput
    historial?: HistorialAcademicoCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateWithoutExcusasInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutAlumnoInput
    codigos_qr?: CodigoQrUncheckedCreateNestedManyWithoutAlumnoInput
    historial?: HistorialAcademicoUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoCreateOrConnectWithoutExcusasInput = {
    where: AlumnoWhereUniqueInput
    create: XOR<AlumnoCreateWithoutExcusasInput, AlumnoUncheckedCreateWithoutExcusasInput>
  }

  export type PersonalCreateWithoutExcusasInput = {
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    cargo?: string | null
    jornada?: string | null
    grado_guia?: string | null
    estado?: string
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    curso?: string | null
    asistencias?: AsistenciaCreateNestedManyWithoutPersonalInput
    codigos_qr?: CodigoQrCreateNestedManyWithoutPersonalInput
  }

  export type PersonalUncheckedCreateWithoutExcusasInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    cargo?: string | null
    jornada?: string | null
    grado_guia?: string | null
    estado?: string
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    curso?: string | null
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutPersonalInput
    codigos_qr?: CodigoQrUncheckedCreateNestedManyWithoutPersonalInput
  }

  export type PersonalCreateOrConnectWithoutExcusasInput = {
    where: PersonalWhereUniqueInput
    create: XOR<PersonalCreateWithoutExcusasInput, PersonalUncheckedCreateWithoutExcusasInput>
  }

  export type AlumnoUpsertWithoutExcusasInput = {
    update: XOR<AlumnoUpdateWithoutExcusasInput, AlumnoUncheckedUpdateWithoutExcusasInput>
    create: XOR<AlumnoCreateWithoutExcusasInput, AlumnoUncheckedCreateWithoutExcusasInput>
    where?: AlumnoWhereInput
  }

  export type AlumnoUpdateToOneWithWhereWithoutExcusasInput = {
    where?: AlumnoWhereInput
    data: XOR<AlumnoUpdateWithoutExcusasInput, AlumnoUncheckedUpdateWithoutExcusasInput>
  }

  export type AlumnoUpdateWithoutExcusasInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencias?: AsistenciaUpdateManyWithoutAlumnoNestedInput
    codigos_qr?: CodigoQrUpdateManyWithoutAlumnoNestedInput
    historial?: HistorialAcademicoUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateWithoutExcusasInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencias?: AsistenciaUncheckedUpdateManyWithoutAlumnoNestedInput
    codigos_qr?: CodigoQrUncheckedUpdateManyWithoutAlumnoNestedInput
    historial?: HistorialAcademicoUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type PersonalUpsertWithoutExcusasInput = {
    update: XOR<PersonalUpdateWithoutExcusasInput, PersonalUncheckedUpdateWithoutExcusasInput>
    create: XOR<PersonalCreateWithoutExcusasInput, PersonalUncheckedCreateWithoutExcusasInput>
    where?: PersonalWhereInput
  }

  export type PersonalUpdateToOneWithWhereWithoutExcusasInput = {
    where?: PersonalWhereInput
    data: XOR<PersonalUpdateWithoutExcusasInput, PersonalUncheckedUpdateWithoutExcusasInput>
  }

  export type PersonalUpdateWithoutExcusasInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
    asistencias?: AsistenciaUpdateManyWithoutPersonalNestedInput
    codigos_qr?: CodigoQrUpdateManyWithoutPersonalNestedInput
  }

  export type PersonalUncheckedUpdateWithoutExcusasInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    cargo?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    grado_guia?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    curso?: NullableStringFieldUpdateOperationsInput | string | null
    asistencias?: AsistenciaUncheckedUpdateManyWithoutPersonalNestedInput
    codigos_qr?: CodigoQrUncheckedUpdateManyWithoutPersonalNestedInput
  }

  export type AlumnoCreateWithoutHistorialInput = {
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    asistencias?: AsistenciaCreateNestedManyWithoutAlumnoInput
    codigos_qr?: CodigoQrCreateNestedManyWithoutAlumnoInput
    excusas?: ExcusaCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoUncheckedCreateWithoutHistorialInput = {
    id?: number
    carnet: string
    nombres: string
    apellidos: string
    sexo?: string | null
    grado: string
    seccion?: string | null
    carrera?: string | null
    especialidad?: string | null
    jornada?: string | null
    estado?: string
    anio_ingreso?: number | null
    anio_graduacion?: number | null
    nivel_actual?: string | null
    motivo_baja?: string | null
    fecha_baja?: Date | string | null
    foto_path?: string | null
    creado_en?: Date | string
    actualizado_en?: Date | string
    asistencias?: AsistenciaUncheckedCreateNestedManyWithoutAlumnoInput
    codigos_qr?: CodigoQrUncheckedCreateNestedManyWithoutAlumnoInput
    excusas?: ExcusaUncheckedCreateNestedManyWithoutAlumnoInput
  }

  export type AlumnoCreateOrConnectWithoutHistorialInput = {
    where: AlumnoWhereUniqueInput
    create: XOR<AlumnoCreateWithoutHistorialInput, AlumnoUncheckedCreateWithoutHistorialInput>
  }

  export type AlumnoUpsertWithoutHistorialInput = {
    update: XOR<AlumnoUpdateWithoutHistorialInput, AlumnoUncheckedUpdateWithoutHistorialInput>
    create: XOR<AlumnoCreateWithoutHistorialInput, AlumnoUncheckedCreateWithoutHistorialInput>
    where?: AlumnoWhereInput
  }

  export type AlumnoUpdateToOneWithWhereWithoutHistorialInput = {
    where?: AlumnoWhereInput
    data: XOR<AlumnoUpdateWithoutHistorialInput, AlumnoUncheckedUpdateWithoutHistorialInput>
  }

  export type AlumnoUpdateWithoutHistorialInput = {
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencias?: AsistenciaUpdateManyWithoutAlumnoNestedInput
    codigos_qr?: CodigoQrUpdateManyWithoutAlumnoNestedInput
    excusas?: ExcusaUpdateManyWithoutAlumnoNestedInput
  }

  export type AlumnoUncheckedUpdateWithoutHistorialInput = {
    id?: IntFieldUpdateOperationsInput | number
    carnet?: StringFieldUpdateOperationsInput | string
    nombres?: StringFieldUpdateOperationsInput | string
    apellidos?: StringFieldUpdateOperationsInput | string
    sexo?: NullableStringFieldUpdateOperationsInput | string | null
    grado?: StringFieldUpdateOperationsInput | string
    seccion?: NullableStringFieldUpdateOperationsInput | string | null
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    especialidad?: NullableStringFieldUpdateOperationsInput | string | null
    jornada?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    anio_ingreso?: NullableIntFieldUpdateOperationsInput | number | null
    anio_graduacion?: NullableIntFieldUpdateOperationsInput | number | null
    nivel_actual?: NullableStringFieldUpdateOperationsInput | string | null
    motivo_baja?: NullableStringFieldUpdateOperationsInput | string | null
    fecha_baja?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    foto_path?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    actualizado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    asistencias?: AsistenciaUncheckedUpdateManyWithoutAlumnoNestedInput
    codigos_qr?: CodigoQrUncheckedUpdateManyWithoutAlumnoNestedInput
    excusas?: ExcusaUncheckedUpdateManyWithoutAlumnoNestedInput
  }

  export type AsistenciaCreateManyAlumnoInput = {
    id?: number
    persona_tipo: string
    personal_id?: number | null
    tipo_evento: string
    timestamp?: Date | string
    origen?: string
    dispositivo?: string | null
    estado_puntualidad?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type CodigoQrCreateManyAlumnoInput = {
    id?: number
    persona_tipo: string
    personal_id?: number | null
    token: string
    png_path?: string | null
    vigente?: boolean
    generado_en?: Date | string
    regenerado_en?: Date | string | null
  }

  export type ExcusaCreateManyAlumnoInput = {
    id?: number
    personal_id?: number | null
    motivo: string
    descripcion?: string | null
    estado?: string
    fecha?: Date | string
    fecha_ausencia?: Date | string | null
    documento_url?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type HistorialAcademicoCreateManyAlumnoInput = {
    id?: number
    anio_escolar: number
    grado_cursado: string
    nivel: string
    carrera?: string | null
    promovido?: boolean
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type AsistenciaUpdateWithoutAlumnoInput = {
    persona_tipo?: StringFieldUpdateOperationsInput | string
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    personal?: PersonalUpdateOneWithoutAsistenciasNestedInput
  }

  export type AsistenciaUncheckedUpdateWithoutAlumnoInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsistenciaUncheckedUpdateManyWithoutAlumnoInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CodigoQrUpdateWithoutAlumnoInput = {
    persona_tipo?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    personal?: PersonalUpdateOneWithoutCodigos_qrNestedInput
  }

  export type CodigoQrUncheckedUpdateWithoutAlumnoInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CodigoQrUncheckedUpdateManyWithoutAlumnoInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExcusaUpdateWithoutAlumnoInput = {
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    personal?: PersonalUpdateOneWithoutExcusasNestedInput
  }

  export type ExcusaUncheckedUpdateWithoutAlumnoInput = {
    id?: IntFieldUpdateOperationsInput | number
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExcusaUncheckedUpdateManyWithoutAlumnoInput = {
    id?: IntFieldUpdateOperationsInput | number
    personal_id?: NullableIntFieldUpdateOperationsInput | number | null
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialAcademicoUpdateWithoutAlumnoInput = {
    anio_escolar?: IntFieldUpdateOperationsInput | number
    grado_cursado?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    promovido?: BoolFieldUpdateOperationsInput | boolean
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialAcademicoUncheckedUpdateWithoutAlumnoInput = {
    id?: IntFieldUpdateOperationsInput | number
    anio_escolar?: IntFieldUpdateOperationsInput | number
    grado_cursado?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    promovido?: BoolFieldUpdateOperationsInput | boolean
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistorialAcademicoUncheckedUpdateManyWithoutAlumnoInput = {
    id?: IntFieldUpdateOperationsInput | number
    anio_escolar?: IntFieldUpdateOperationsInput | number
    grado_cursado?: StringFieldUpdateOperationsInput | string
    nivel?: StringFieldUpdateOperationsInput | string
    carrera?: NullableStringFieldUpdateOperationsInput | string | null
    promovido?: BoolFieldUpdateOperationsInput | boolean
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsistenciaCreateManyPersonalInput = {
    id?: number
    persona_tipo: string
    alumno_id?: number | null
    tipo_evento: string
    timestamp?: Date | string
    origen?: string
    dispositivo?: string | null
    estado_puntualidad?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type CodigoQrCreateManyPersonalInput = {
    id?: number
    persona_tipo: string
    alumno_id?: number | null
    token: string
    png_path?: string | null
    vigente?: boolean
    generado_en?: Date | string
    regenerado_en?: Date | string | null
  }

  export type ExcusaCreateManyPersonalInput = {
    id?: number
    alumno_id?: number | null
    motivo: string
    descripcion?: string | null
    estado?: string
    fecha?: Date | string
    fecha_ausencia?: Date | string | null
    documento_url?: string | null
    observaciones?: string | null
    creado_en?: Date | string
  }

  export type AsistenciaUpdateWithoutPersonalInput = {
    persona_tipo?: StringFieldUpdateOperationsInput | string
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    alumno?: AlumnoUpdateOneWithoutAsistenciasNestedInput
  }

  export type AsistenciaUncheckedUpdateWithoutPersonalInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AsistenciaUncheckedUpdateManyWithoutPersonalInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    tipo_evento?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    origen?: StringFieldUpdateOperationsInput | string
    dispositivo?: NullableStringFieldUpdateOperationsInput | string | null
    estado_puntualidad?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CodigoQrUpdateWithoutPersonalInput = {
    persona_tipo?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    alumno?: AlumnoUpdateOneWithoutCodigos_qrNestedInput
  }

  export type CodigoQrUncheckedUpdateWithoutPersonalInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CodigoQrUncheckedUpdateManyWithoutPersonalInput = {
    id?: IntFieldUpdateOperationsInput | number
    persona_tipo?: StringFieldUpdateOperationsInput | string
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    token?: StringFieldUpdateOperationsInput | string
    png_path?: NullableStringFieldUpdateOperationsInput | string | null
    vigente?: BoolFieldUpdateOperationsInput | boolean
    generado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    regenerado_en?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ExcusaUpdateWithoutPersonalInput = {
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
    alumno?: AlumnoUpdateOneWithoutExcusasNestedInput
  }

  export type ExcusaUncheckedUpdateWithoutPersonalInput = {
    id?: IntFieldUpdateOperationsInput | number
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExcusaUncheckedUpdateManyWithoutPersonalInput = {
    id?: IntFieldUpdateOperationsInput | number
    alumno_id?: NullableIntFieldUpdateOperationsInput | number | null
    motivo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    estado?: StringFieldUpdateOperationsInput | string
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    fecha_ausencia?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    documento_url?: NullableStringFieldUpdateOperationsInput | string | null
    observaciones?: NullableStringFieldUpdateOperationsInput | string | null
    creado_en?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditoriaCreateManyUsuarioInput = {
    id?: number
    entidad: string
    entidad_id?: number | null
    accion: string
    detalle?: string | null
    timestamp?: Date | string
  }

  export type AuditoriaUpdateWithoutUsuarioInput = {
    entidad?: StringFieldUpdateOperationsInput | string
    entidad_id?: NullableIntFieldUpdateOperationsInput | number | null
    accion?: StringFieldUpdateOperationsInput | string
    detalle?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditoriaUncheckedUpdateWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    entidad?: StringFieldUpdateOperationsInput | string
    entidad_id?: NullableIntFieldUpdateOperationsInput | number | null
    accion?: StringFieldUpdateOperationsInput | string
    detalle?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditoriaUncheckedUpdateManyWithoutUsuarioInput = {
    id?: IntFieldUpdateOperationsInput | number
    entidad?: StringFieldUpdateOperationsInput | string
    entidad_id?: NullableIntFieldUpdateOperationsInput | number | null
    accion?: StringFieldUpdateOperationsInput | string
    detalle?: NullableStringFieldUpdateOperationsInput | string | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use AlumnoCountOutputTypeDefaultArgs instead
     */
    export type AlumnoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlumnoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PersonalCountOutputTypeDefaultArgs instead
     */
    export type PersonalCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PersonalCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UsuarioCountOutputTypeDefaultArgs instead
     */
    export type UsuarioCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UsuarioCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InstitucionDefaultArgs instead
     */
    export type InstitucionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InstitucionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlumnoDefaultArgs instead
     */
    export type AlumnoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlumnoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PersonalDefaultArgs instead
     */
    export type PersonalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PersonalDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CodigoQrDefaultArgs instead
     */
    export type CodigoQrArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CodigoQrDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AsistenciaDefaultArgs instead
     */
    export type AsistenciaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AsistenciaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UsuarioDefaultArgs instead
     */
    export type UsuarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UsuarioDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditoriaDefaultArgs instead
     */
    export type AuditoriaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditoriaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ExcusaDefaultArgs instead
     */
    export type ExcusaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ExcusaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use HistorialAcademicoDefaultArgs instead
     */
    export type HistorialAcademicoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = HistorialAcademicoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DiagnosticResultDefaultArgs instead
     */
    export type DiagnosticResultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DiagnosticResultDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EquipoDefaultArgs instead
     */
    export type EquipoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EquipoDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
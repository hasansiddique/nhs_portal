
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Patient
 * 
 */
export type Patient = $Result.DefaultSelection<Prisma.$PatientPayload>
/**
 * Model Practitioner
 * 
 */
export type Practitioner = $Result.DefaultSelection<Prisma.$PractitionerPayload>
/**
 * Model Location
 * 
 */
export type Location = $Result.DefaultSelection<Prisma.$LocationPayload>
/**
 * Model PractitionerLocation
 * Practitioners who work at a given clinic (for directory / filtering).
 */
export type PractitionerLocation = $Result.DefaultSelection<Prisma.$PractitionerLocationPayload>
/**
 * Model PractitionerAvailabilityWindow
 * Weekly recurring availability template for a practitioner at a location.
 * `dayOfWeek`: 1 = Monday … 7 = Sunday (ISO-style).
 * `windowStartMin` / `windowEndMin`: minutes from midnight (e.g. 9:00 → 540).
 */
export type PractitionerAvailabilityWindow = $Result.DefaultSelection<Prisma.$PractitionerAvailabilityWindowPayload>
/**
 * Model Slot
 * 
 */
export type Slot = $Result.DefaultSelection<Prisma.$SlotPayload>
/**
 * Model Appointment
 * 
 */
export type Appointment = $Result.DefaultSelection<Prisma.$AppointmentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  PATIENT: 'PATIENT',
  PRACTITIONER: 'PRACTITIONER',
  ADMIN: 'ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const AppointmentStatus: {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type AppointmentStatus = $Enums.AppointmentStatus

export const AppointmentStatus: typeof $Enums.AppointmentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.practitioner`: Exposes CRUD operations for the **Practitioner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Practitioners
    * const practitioners = await prisma.practitioner.findMany()
    * ```
    */
  get practitioner(): Prisma.PractitionerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.location`: Exposes CRUD operations for the **Location** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.location.findMany()
    * ```
    */
  get location(): Prisma.LocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.practitionerLocation`: Exposes CRUD operations for the **PractitionerLocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PractitionerLocations
    * const practitionerLocations = await prisma.practitionerLocation.findMany()
    * ```
    */
  get practitionerLocation(): Prisma.PractitionerLocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.practitionerAvailabilityWindow`: Exposes CRUD operations for the **PractitionerAvailabilityWindow** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PractitionerAvailabilityWindows
    * const practitionerAvailabilityWindows = await prisma.practitionerAvailabilityWindow.findMany()
    * ```
    */
  get practitionerAvailabilityWindow(): Prisma.PractitionerAvailabilityWindowDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.slot`: Exposes CRUD operations for the **Slot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Slots
    * const slots = await prisma.slot.findMany()
    * ```
    */
  get slot(): Prisma.SlotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointment.findMany()
    * ```
    */
  get appointment(): Prisma.AppointmentDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    User: 'User',
    Patient: 'Patient',
    Practitioner: 'Practitioner',
    Location: 'Location',
    PractitionerLocation: 'PractitionerLocation',
    PractitionerAvailabilityWindow: 'PractitionerAvailabilityWindow',
    Slot: 'Slot',
    Appointment: 'Appointment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "patient" | "practitioner" | "location" | "practitionerLocation" | "practitionerAvailabilityWindow" | "slot" | "appointment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Patient: {
        payload: Prisma.$PatientPayload<ExtArgs>
        fields: Prisma.PatientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findFirst: {
            args: Prisma.PatientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findMany: {
            args: Prisma.PatientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          create: {
            args: Prisma.PatientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          createMany: {
            args: Prisma.PatientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          delete: {
            args: Prisma.PatientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          update: {
            args: Prisma.PatientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          deleteMany: {
            args: Prisma.PatientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PatientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          upsert: {
            args: Prisma.PatientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          aggregate: {
            args: Prisma.PatientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatient>
          }
          groupBy: {
            args: Prisma.PatientGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientCountArgs<ExtArgs>
            result: $Utils.Optional<PatientCountAggregateOutputType> | number
          }
        }
      }
      Practitioner: {
        payload: Prisma.$PractitionerPayload<ExtArgs>
        fields: Prisma.PractitionerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PractitionerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PractitionerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          findFirst: {
            args: Prisma.PractitionerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PractitionerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          findMany: {
            args: Prisma.PractitionerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>[]
          }
          create: {
            args: Prisma.PractitionerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          createMany: {
            args: Prisma.PractitionerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PractitionerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>[]
          }
          delete: {
            args: Prisma.PractitionerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          update: {
            args: Prisma.PractitionerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          deleteMany: {
            args: Prisma.PractitionerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PractitionerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PractitionerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>[]
          }
          upsert: {
            args: Prisma.PractitionerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerPayload>
          }
          aggregate: {
            args: Prisma.PractitionerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePractitioner>
          }
          groupBy: {
            args: Prisma.PractitionerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PractitionerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PractitionerCountArgs<ExtArgs>
            result: $Utils.Optional<PractitionerCountAggregateOutputType> | number
          }
        }
      }
      Location: {
        payload: Prisma.$LocationPayload<ExtArgs>
        fields: Prisma.LocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findFirst: {
            args: Prisma.LocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findMany: {
            args: Prisma.LocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          create: {
            args: Prisma.LocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          createMany: {
            args: Prisma.LocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          delete: {
            args: Prisma.LocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          update: {
            args: Prisma.LocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          deleteMany: {
            args: Prisma.LocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          upsert: {
            args: Prisma.LocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          aggregate: {
            args: Prisma.LocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocation>
          }
          groupBy: {
            args: Prisma.LocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationCountArgs<ExtArgs>
            result: $Utils.Optional<LocationCountAggregateOutputType> | number
          }
        }
      }
      PractitionerLocation: {
        payload: Prisma.$PractitionerLocationPayload<ExtArgs>
        fields: Prisma.PractitionerLocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PractitionerLocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PractitionerLocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload>
          }
          findFirst: {
            args: Prisma.PractitionerLocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PractitionerLocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload>
          }
          findMany: {
            args: Prisma.PractitionerLocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload>[]
          }
          create: {
            args: Prisma.PractitionerLocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload>
          }
          createMany: {
            args: Prisma.PractitionerLocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PractitionerLocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload>[]
          }
          delete: {
            args: Prisma.PractitionerLocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload>
          }
          update: {
            args: Prisma.PractitionerLocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload>
          }
          deleteMany: {
            args: Prisma.PractitionerLocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PractitionerLocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PractitionerLocationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload>[]
          }
          upsert: {
            args: Prisma.PractitionerLocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerLocationPayload>
          }
          aggregate: {
            args: Prisma.PractitionerLocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePractitionerLocation>
          }
          groupBy: {
            args: Prisma.PractitionerLocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PractitionerLocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PractitionerLocationCountArgs<ExtArgs>
            result: $Utils.Optional<PractitionerLocationCountAggregateOutputType> | number
          }
        }
      }
      PractitionerAvailabilityWindow: {
        payload: Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>
        fields: Prisma.PractitionerAvailabilityWindowFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PractitionerAvailabilityWindowFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PractitionerAvailabilityWindowFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload>
          }
          findFirst: {
            args: Prisma.PractitionerAvailabilityWindowFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PractitionerAvailabilityWindowFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload>
          }
          findMany: {
            args: Prisma.PractitionerAvailabilityWindowFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload>[]
          }
          create: {
            args: Prisma.PractitionerAvailabilityWindowCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload>
          }
          createMany: {
            args: Prisma.PractitionerAvailabilityWindowCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PractitionerAvailabilityWindowCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload>[]
          }
          delete: {
            args: Prisma.PractitionerAvailabilityWindowDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload>
          }
          update: {
            args: Prisma.PractitionerAvailabilityWindowUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload>
          }
          deleteMany: {
            args: Prisma.PractitionerAvailabilityWindowDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PractitionerAvailabilityWindowUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PractitionerAvailabilityWindowUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload>[]
          }
          upsert: {
            args: Prisma.PractitionerAvailabilityWindowUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PractitionerAvailabilityWindowPayload>
          }
          aggregate: {
            args: Prisma.PractitionerAvailabilityWindowAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePractitionerAvailabilityWindow>
          }
          groupBy: {
            args: Prisma.PractitionerAvailabilityWindowGroupByArgs<ExtArgs>
            result: $Utils.Optional<PractitionerAvailabilityWindowGroupByOutputType>[]
          }
          count: {
            args: Prisma.PractitionerAvailabilityWindowCountArgs<ExtArgs>
            result: $Utils.Optional<PractitionerAvailabilityWindowCountAggregateOutputType> | number
          }
        }
      }
      Slot: {
        payload: Prisma.$SlotPayload<ExtArgs>
        fields: Prisma.SlotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SlotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SlotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload>
          }
          findFirst: {
            args: Prisma.SlotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SlotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload>
          }
          findMany: {
            args: Prisma.SlotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload>[]
          }
          create: {
            args: Prisma.SlotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload>
          }
          createMany: {
            args: Prisma.SlotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SlotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload>[]
          }
          delete: {
            args: Prisma.SlotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload>
          }
          update: {
            args: Prisma.SlotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload>
          }
          deleteMany: {
            args: Prisma.SlotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SlotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SlotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload>[]
          }
          upsert: {
            args: Prisma.SlotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SlotPayload>
          }
          aggregate: {
            args: Prisma.SlotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSlot>
          }
          groupBy: {
            args: Prisma.SlotGroupByArgs<ExtArgs>
            result: $Utils.Optional<SlotGroupByOutputType>[]
          }
          count: {
            args: Prisma.SlotCountArgs<ExtArgs>
            result: $Utils.Optional<SlotCountAggregateOutputType> | number
          }
        }
      }
      Appointment: {
        payload: Prisma.$AppointmentPayload<ExtArgs>
        fields: Prisma.AppointmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findFirst: {
            args: Prisma.AppointmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findMany: {
            args: Prisma.AppointmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          create: {
            args: Prisma.AppointmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          createMany: {
            args: Prisma.AppointmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          delete: {
            args: Prisma.AppointmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          update: {
            args: Prisma.AppointmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          deleteMany: {
            args: Prisma.AppointmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppointmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          upsert: {
            args: Prisma.AppointmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          aggregate: {
            args: Prisma.AppointmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointment>
          }
          groupBy: {
            args: Prisma.AppointmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentCountAggregateOutputType> | number
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
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
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
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    patient?: PatientOmit
    practitioner?: PractitionerOmit
    location?: LocationOmit
    practitionerLocation?: PractitionerLocationOmit
    practitionerAvailabilityWindow?: PractitionerAvailabilityWindowOmit
    slot?: SlotOmit
    appointment?: AppointmentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'updateManyAndReturn'
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
   * Count Type PatientCountOutputType
   */

  export type PatientCountOutputType = {
    appointments: number
  }

  export type PatientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | PatientCountOutputTypeCountAppointmentsArgs
  }

  // Custom InputTypes
  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientCountOutputType
     */
    select?: PatientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }


  /**
   * Count Type PractitionerCountOutputType
   */

  export type PractitionerCountOutputType = {
    slots: number
    appointments: number
    availabilityWindows: number
    practitionerLocations: number
  }

  export type PractitionerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    slots?: boolean | PractitionerCountOutputTypeCountSlotsArgs
    appointments?: boolean | PractitionerCountOutputTypeCountAppointmentsArgs
    availabilityWindows?: boolean | PractitionerCountOutputTypeCountAvailabilityWindowsArgs
    practitionerLocations?: boolean | PractitionerCountOutputTypeCountPractitionerLocationsArgs
  }

  // Custom InputTypes
  /**
   * PractitionerCountOutputType without action
   */
  export type PractitionerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerCountOutputType
     */
    select?: PractitionerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PractitionerCountOutputType without action
   */
  export type PractitionerCountOutputTypeCountSlotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SlotWhereInput
  }

  /**
   * PractitionerCountOutputType without action
   */
  export type PractitionerCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * PractitionerCountOutputType without action
   */
  export type PractitionerCountOutputTypeCountAvailabilityWindowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PractitionerAvailabilityWindowWhereInput
  }

  /**
   * PractitionerCountOutputType without action
   */
  export type PractitionerCountOutputTypeCountPractitionerLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PractitionerLocationWhereInput
  }


  /**
   * Count Type LocationCountOutputType
   */

  export type LocationCountOutputType = {
    slots: number
    patients: number
    availabilityWindows: number
    practitionerLocations: number
  }

  export type LocationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    slots?: boolean | LocationCountOutputTypeCountSlotsArgs
    patients?: boolean | LocationCountOutputTypeCountPatientsArgs
    availabilityWindows?: boolean | LocationCountOutputTypeCountAvailabilityWindowsArgs
    practitionerLocations?: boolean | LocationCountOutputTypeCountPractitionerLocationsArgs
  }

  // Custom InputTypes
  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationCountOutputType
     */
    select?: LocationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountSlotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SlotWhereInput
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountPatientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountAvailabilityWindowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PractitionerAvailabilityWindowWhereInput
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountPractitionerLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PractitionerLocationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.UserRole | null
    nhsNumber: string | null
    dateOfBirth: Date | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
    resetToken: string | null
    resetTokenExpiresAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.UserRole | null
    nhsNumber: string | null
    dateOfBirth: Date | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
    resetToken: string | null
    resetTokenExpiresAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    name: number
    role: number
    nhsNumber: number
    dateOfBirth: number
    phone: number
    createdAt: number
    updatedAt: number
    resetToken: number
    resetTokenExpiresAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    nhsNumber?: true
    dateOfBirth?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    resetToken?: true
    resetTokenExpiresAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    nhsNumber?: true
    dateOfBirth?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    resetToken?: true
    resetTokenExpiresAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    nhsNumber?: true
    dateOfBirth?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    resetToken?: true
    resetTokenExpiresAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    name: string | null
    role: $Enums.UserRole
    nhsNumber: string | null
    dateOfBirth: Date | null
    phone: string | null
    createdAt: Date
    updatedAt: Date
    resetToken: string | null
    resetTokenExpiresAt: Date | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    nhsNumber?: boolean
    dateOfBirth?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiresAt?: boolean
    patient?: boolean | User$patientArgs<ExtArgs>
    practitioner?: boolean | User$practitionerArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    nhsNumber?: boolean
    dateOfBirth?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiresAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    nhsNumber?: boolean
    dateOfBirth?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiresAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    nhsNumber?: boolean
    dateOfBirth?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resetToken?: boolean
    resetTokenExpiresAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "name" | "role" | "nhsNumber" | "dateOfBirth" | "phone" | "createdAt" | "updatedAt" | "resetToken" | "resetTokenExpiresAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | User$patientArgs<ExtArgs>
    practitioner?: boolean | User$practitionerArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs> | null
      practitioner: Prisma.$PractitionerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      name: string | null
      role: $Enums.UserRole
      nhsNumber: string | null
      dateOfBirth: Date | null
      phone: string | null
      createdAt: Date
      updatedAt: Date
      resetToken: string | null
      resetTokenExpiresAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends User$patientArgs<ExtArgs> = {}>(args?: Subset<T, User$patientArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    practitioner<T extends User$practitionerArgs<ExtArgs> = {}>(args?: Subset<T, User$practitionerArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly nhsNumber: FieldRef<"User", 'String'>
    readonly dateOfBirth: FieldRef<"User", 'DateTime'>
    readonly phone: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly resetToken: FieldRef<"User", 'String'>
    readonly resetTokenExpiresAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.patient
   */
  export type User$patientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    where?: PatientWhereInput
  }

  /**
   * User.practitioner
   */
  export type User$practitionerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    where?: PractitionerWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Patient
   */

  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientMinAggregateOutputType = {
    id: string | null
    userId: string | null
    nhsNumber: string | null
    dateOfBirth: Date | null
    addressLine1: string | null
    addressLine2: string | null
    postcode: string | null
    gpSurgeryName: string | null
    gpSurgeryCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
    locationId: string | null
  }

  export type PatientMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    nhsNumber: string | null
    dateOfBirth: Date | null
    addressLine1: string | null
    addressLine2: string | null
    postcode: string | null
    gpSurgeryName: string | null
    gpSurgeryCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
    locationId: string | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    userId: number
    nhsNumber: number
    dateOfBirth: number
    addressLine1: number
    addressLine2: number
    postcode: number
    gpSurgeryName: number
    gpSurgeryCode: number
    createdAt: number
    updatedAt: number
    locationId: number
    _all: number
  }


  export type PatientMinAggregateInputType = {
    id?: true
    userId?: true
    nhsNumber?: true
    dateOfBirth?: true
    addressLine1?: true
    addressLine2?: true
    postcode?: true
    gpSurgeryName?: true
    gpSurgeryCode?: true
    createdAt?: true
    updatedAt?: true
    locationId?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    userId?: true
    nhsNumber?: true
    dateOfBirth?: true
    addressLine1?: true
    addressLine2?: true
    postcode?: true
    gpSurgeryName?: true
    gpSurgeryCode?: true
    createdAt?: true
    updatedAt?: true
    locationId?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    userId?: true
    nhsNumber?: true
    dateOfBirth?: true
    addressLine1?: true
    addressLine2?: true
    postcode?: true
    gpSurgeryName?: true
    gpSurgeryCode?: true
    createdAt?: true
    updatedAt?: true
    locationId?: true
    _all?: true
  }

  export type PatientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patient to aggregate.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithAggregationInput | PatientOrderByWithAggregationInput[]
    by: PatientScalarFieldEnum[] | PatientScalarFieldEnum
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }

  export type PatientGroupByOutputType = {
    id: string
    userId: string
    nhsNumber: string
    dateOfBirth: Date
    addressLine1: string | null
    addressLine2: string | null
    postcode: string | null
    gpSurgeryName: string | null
    gpSurgeryCode: string | null
    createdAt: Date
    updatedAt: Date
    locationId: string | null
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nhsNumber?: boolean
    dateOfBirth?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    postcode?: boolean
    gpSurgeryName?: boolean
    gpSurgeryCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    locationId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    appointments?: boolean | Patient$appointmentsArgs<ExtArgs>
    location?: boolean | Patient$locationArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nhsNumber?: boolean
    dateOfBirth?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    postcode?: boolean
    gpSurgeryName?: boolean
    gpSurgeryCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    locationId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    location?: boolean | Patient$locationArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nhsNumber?: boolean
    dateOfBirth?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    postcode?: boolean
    gpSurgeryName?: boolean
    gpSurgeryCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    locationId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    location?: boolean | Patient$locationArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectScalar = {
    id?: boolean
    userId?: boolean
    nhsNumber?: boolean
    dateOfBirth?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    postcode?: boolean
    gpSurgeryName?: boolean
    gpSurgeryCode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    locationId?: boolean
  }

  export type PatientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "nhsNumber" | "dateOfBirth" | "addressLine1" | "addressLine2" | "postcode" | "gpSurgeryName" | "gpSurgeryCode" | "createdAt" | "updatedAt" | "locationId", ExtArgs["result"]["patient"]>
  export type PatientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    appointments?: boolean | Patient$appointmentsArgs<ExtArgs>
    location?: boolean | Patient$locationArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PatientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    location?: boolean | Patient$locationArgs<ExtArgs>
  }
  export type PatientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    location?: boolean | Patient$locationArgs<ExtArgs>
  }

  export type $PatientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Patient"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      location: Prisma.$LocationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      nhsNumber: string
      dateOfBirth: Date
      addressLine1: string | null
      addressLine2: string | null
      postcode: string | null
      gpSurgeryName: string | null
      gpSurgeryCode: string | null
      createdAt: Date
      updatedAt: Date
      locationId: string | null
    }, ExtArgs["result"]["patient"]>
    composites: {}
  }

  type PatientGetPayload<S extends boolean | null | undefined | PatientDefaultArgs> = $Result.GetResult<Prisma.$PatientPayload, S>

  type PatientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PatientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PatientCountAggregateInputType | true
    }

  export interface PatientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Patient'], meta: { name: 'Patient' } }
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientFindUniqueArgs>(args: SelectSubset<T, PatientFindUniqueArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Patient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientFindFirstArgs>(args?: SelectSubset<T, PatientFindFirstArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientFindManyArgs>(args?: SelectSubset<T, PatientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
     */
    create<T extends PatientCreateArgs>(args: SelectSubset<T, PatientCreateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Patients.
     * @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientCreateManyArgs>(args?: SelectSubset<T, PatientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Patients and returns the data saved in the database.
     * @param {PatientCreateManyAndReturnArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
     */
    delete<T extends PatientDeleteArgs>(args: SelectSubset<T, PatientDeleteArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientUpdateArgs>(args: SelectSubset<T, PatientUpdateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDeleteManyArgs>(args?: SelectSubset<T, PatientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientUpdateManyArgs>(args: SelectSubset<T, PatientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients and returns the data updated in the database.
     * @param {PatientUpdateManyAndReturnArgs} args - Arguments to update many Patients.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PatientUpdateManyAndReturnArgs>(args: SelectSubset<T, PatientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
     */
    upsert<T extends PatientUpsertArgs>(args: SelectSubset<T, PatientUpsertArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): Prisma.PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
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
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Patient model
   */
  readonly fields: PatientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    appointments<T extends Patient$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    location<T extends Patient$locationArgs<ExtArgs> = {}>(args?: Subset<T, Patient$locationArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Patient model
   */
  interface PatientFieldRefs {
    readonly id: FieldRef<"Patient", 'String'>
    readonly userId: FieldRef<"Patient", 'String'>
    readonly nhsNumber: FieldRef<"Patient", 'String'>
    readonly dateOfBirth: FieldRef<"Patient", 'DateTime'>
    readonly addressLine1: FieldRef<"Patient", 'String'>
    readonly addressLine2: FieldRef<"Patient", 'String'>
    readonly postcode: FieldRef<"Patient", 'String'>
    readonly gpSurgeryName: FieldRef<"Patient", 'String'>
    readonly gpSurgeryCode: FieldRef<"Patient", 'String'>
    readonly createdAt: FieldRef<"Patient", 'DateTime'>
    readonly updatedAt: FieldRef<"Patient", 'DateTime'>
    readonly locationId: FieldRef<"Patient", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Patient findUnique
   */
  export type PatientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findFirst
   */
  export type PatientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patients to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient create
   */
  export type PatientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to create a Patient.
     */
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }

  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient createManyAndReturn
   */
  export type PatientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Patient update
   */
  export type PatientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to update a Patient.
     */
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient updateManyAndReturn
   */
  export type PatientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Patient upsert
   */
  export type PatientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The filter to search for the Patient to update in case it exists.
     */
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     */
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }

  /**
   * Patient delete
   */
  export type PatientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter which Patient to delete.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patients to delete
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to delete.
     */
    limit?: number
  }

  /**
   * Patient.appointments
   */
  export type Patient$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Patient.location
   */
  export type Patient$locationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    where?: LocationWhereInput
  }

  /**
   * Patient without action
   */
  export type PatientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
  }


  /**
   * Model Practitioner
   */

  export type AggregatePractitioner = {
    _count: PractitionerCountAggregateOutputType | null
    _min: PractitionerMinAggregateOutputType | null
    _max: PractitionerMaxAggregateOutputType | null
  }

  export type PractitionerMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    gmcNumber: string | null
    speciality: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PractitionerMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    gmcNumber: string | null
    speciality: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PractitionerCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    gmcNumber: number
    speciality: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PractitionerMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    gmcNumber?: true
    speciality?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PractitionerMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    gmcNumber?: true
    speciality?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PractitionerCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    gmcNumber?: true
    speciality?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PractitionerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Practitioner to aggregate.
     */
    where?: PractitionerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Practitioners to fetch.
     */
    orderBy?: PractitionerOrderByWithRelationInput | PractitionerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PractitionerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Practitioners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Practitioners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Practitioners
    **/
    _count?: true | PractitionerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PractitionerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PractitionerMaxAggregateInputType
  }

  export type GetPractitionerAggregateType<T extends PractitionerAggregateArgs> = {
        [P in keyof T & keyof AggregatePractitioner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePractitioner[P]>
      : GetScalarType<T[P], AggregatePractitioner[P]>
  }




  export type PractitionerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PractitionerWhereInput
    orderBy?: PractitionerOrderByWithAggregationInput | PractitionerOrderByWithAggregationInput[]
    by: PractitionerScalarFieldEnum[] | PractitionerScalarFieldEnum
    having?: PractitionerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PractitionerCountAggregateInputType | true
    _min?: PractitionerMinAggregateInputType
    _max?: PractitionerMaxAggregateInputType
  }

  export type PractitionerGroupByOutputType = {
    id: string
    userId: string
    title: string | null
    gmcNumber: string | null
    speciality: string | null
    createdAt: Date
    updatedAt: Date
    _count: PractitionerCountAggregateOutputType | null
    _min: PractitionerMinAggregateOutputType | null
    _max: PractitionerMaxAggregateOutputType | null
  }

  type GetPractitionerGroupByPayload<T extends PractitionerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PractitionerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PractitionerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PractitionerGroupByOutputType[P]>
            : GetScalarType<T[P], PractitionerGroupByOutputType[P]>
        }
      >
    >


  export type PractitionerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    gmcNumber?: boolean
    speciality?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    slots?: boolean | Practitioner$slotsArgs<ExtArgs>
    appointments?: boolean | Practitioner$appointmentsArgs<ExtArgs>
    availabilityWindows?: boolean | Practitioner$availabilityWindowsArgs<ExtArgs>
    practitionerLocations?: boolean | Practitioner$practitionerLocationsArgs<ExtArgs>
    _count?: boolean | PractitionerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitioner"]>

  export type PractitionerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    gmcNumber?: boolean
    speciality?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitioner"]>

  export type PractitionerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    gmcNumber?: boolean
    speciality?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitioner"]>

  export type PractitionerSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    gmcNumber?: boolean
    speciality?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PractitionerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "gmcNumber" | "speciality" | "createdAt" | "updatedAt", ExtArgs["result"]["practitioner"]>
  export type PractitionerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    slots?: boolean | Practitioner$slotsArgs<ExtArgs>
    appointments?: boolean | Practitioner$appointmentsArgs<ExtArgs>
    availabilityWindows?: boolean | Practitioner$availabilityWindowsArgs<ExtArgs>
    practitionerLocations?: boolean | Practitioner$practitionerLocationsArgs<ExtArgs>
    _count?: boolean | PractitionerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PractitionerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PractitionerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PractitionerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Practitioner"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      slots: Prisma.$SlotPayload<ExtArgs>[]
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      availabilityWindows: Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>[]
      practitionerLocations: Prisma.$PractitionerLocationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string | null
      gmcNumber: string | null
      speciality: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["practitioner"]>
    composites: {}
  }

  type PractitionerGetPayload<S extends boolean | null | undefined | PractitionerDefaultArgs> = $Result.GetResult<Prisma.$PractitionerPayload, S>

  type PractitionerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PractitionerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PractitionerCountAggregateInputType | true
    }

  export interface PractitionerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Practitioner'], meta: { name: 'Practitioner' } }
    /**
     * Find zero or one Practitioner that matches the filter.
     * @param {PractitionerFindUniqueArgs} args - Arguments to find a Practitioner
     * @example
     * // Get one Practitioner
     * const practitioner = await prisma.practitioner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PractitionerFindUniqueArgs>(args: SelectSubset<T, PractitionerFindUniqueArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Practitioner that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PractitionerFindUniqueOrThrowArgs} args - Arguments to find a Practitioner
     * @example
     * // Get one Practitioner
     * const practitioner = await prisma.practitioner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PractitionerFindUniqueOrThrowArgs>(args: SelectSubset<T, PractitionerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Practitioner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerFindFirstArgs} args - Arguments to find a Practitioner
     * @example
     * // Get one Practitioner
     * const practitioner = await prisma.practitioner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PractitionerFindFirstArgs>(args?: SelectSubset<T, PractitionerFindFirstArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Practitioner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerFindFirstOrThrowArgs} args - Arguments to find a Practitioner
     * @example
     * // Get one Practitioner
     * const practitioner = await prisma.practitioner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PractitionerFindFirstOrThrowArgs>(args?: SelectSubset<T, PractitionerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Practitioners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Practitioners
     * const practitioners = await prisma.practitioner.findMany()
     * 
     * // Get first 10 Practitioners
     * const practitioners = await prisma.practitioner.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const practitionerWithIdOnly = await prisma.practitioner.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PractitionerFindManyArgs>(args?: SelectSubset<T, PractitionerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Practitioner.
     * @param {PractitionerCreateArgs} args - Arguments to create a Practitioner.
     * @example
     * // Create one Practitioner
     * const Practitioner = await prisma.practitioner.create({
     *   data: {
     *     // ... data to create a Practitioner
     *   }
     * })
     * 
     */
    create<T extends PractitionerCreateArgs>(args: SelectSubset<T, PractitionerCreateArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Practitioners.
     * @param {PractitionerCreateManyArgs} args - Arguments to create many Practitioners.
     * @example
     * // Create many Practitioners
     * const practitioner = await prisma.practitioner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PractitionerCreateManyArgs>(args?: SelectSubset<T, PractitionerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Practitioners and returns the data saved in the database.
     * @param {PractitionerCreateManyAndReturnArgs} args - Arguments to create many Practitioners.
     * @example
     * // Create many Practitioners
     * const practitioner = await prisma.practitioner.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Practitioners and only return the `id`
     * const practitionerWithIdOnly = await prisma.practitioner.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PractitionerCreateManyAndReturnArgs>(args?: SelectSubset<T, PractitionerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Practitioner.
     * @param {PractitionerDeleteArgs} args - Arguments to delete one Practitioner.
     * @example
     * // Delete one Practitioner
     * const Practitioner = await prisma.practitioner.delete({
     *   where: {
     *     // ... filter to delete one Practitioner
     *   }
     * })
     * 
     */
    delete<T extends PractitionerDeleteArgs>(args: SelectSubset<T, PractitionerDeleteArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Practitioner.
     * @param {PractitionerUpdateArgs} args - Arguments to update one Practitioner.
     * @example
     * // Update one Practitioner
     * const practitioner = await prisma.practitioner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PractitionerUpdateArgs>(args: SelectSubset<T, PractitionerUpdateArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Practitioners.
     * @param {PractitionerDeleteManyArgs} args - Arguments to filter Practitioners to delete.
     * @example
     * // Delete a few Practitioners
     * const { count } = await prisma.practitioner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PractitionerDeleteManyArgs>(args?: SelectSubset<T, PractitionerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Practitioners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Practitioners
     * const practitioner = await prisma.practitioner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PractitionerUpdateManyArgs>(args: SelectSubset<T, PractitionerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Practitioners and returns the data updated in the database.
     * @param {PractitionerUpdateManyAndReturnArgs} args - Arguments to update many Practitioners.
     * @example
     * // Update many Practitioners
     * const practitioner = await prisma.practitioner.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Practitioners and only return the `id`
     * const practitionerWithIdOnly = await prisma.practitioner.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PractitionerUpdateManyAndReturnArgs>(args: SelectSubset<T, PractitionerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Practitioner.
     * @param {PractitionerUpsertArgs} args - Arguments to update or create a Practitioner.
     * @example
     * // Update or create a Practitioner
     * const practitioner = await prisma.practitioner.upsert({
     *   create: {
     *     // ... data to create a Practitioner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Practitioner we want to update
     *   }
     * })
     */
    upsert<T extends PractitionerUpsertArgs>(args: SelectSubset<T, PractitionerUpsertArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Practitioners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerCountArgs} args - Arguments to filter Practitioners to count.
     * @example
     * // Count the number of Practitioners
     * const count = await prisma.practitioner.count({
     *   where: {
     *     // ... the filter for the Practitioners we want to count
     *   }
     * })
    **/
    count<T extends PractitionerCountArgs>(
      args?: Subset<T, PractitionerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PractitionerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Practitioner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PractitionerAggregateArgs>(args: Subset<T, PractitionerAggregateArgs>): Prisma.PrismaPromise<GetPractitionerAggregateType<T>>

    /**
     * Group by Practitioner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerGroupByArgs} args - Group by arguments.
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
      T extends PractitionerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PractitionerGroupByArgs['orderBy'] }
        : { orderBy?: PractitionerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PractitionerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPractitionerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Practitioner model
   */
  readonly fields: PractitionerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Practitioner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PractitionerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    slots<T extends Practitioner$slotsArgs<ExtArgs> = {}>(args?: Subset<T, Practitioner$slotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    appointments<T extends Practitioner$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Practitioner$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    availabilityWindows<T extends Practitioner$availabilityWindowsArgs<ExtArgs> = {}>(args?: Subset<T, Practitioner$availabilityWindowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    practitionerLocations<T extends Practitioner$practitionerLocationsArgs<ExtArgs> = {}>(args?: Subset<T, Practitioner$practitionerLocationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Practitioner model
   */
  interface PractitionerFieldRefs {
    readonly id: FieldRef<"Practitioner", 'String'>
    readonly userId: FieldRef<"Practitioner", 'String'>
    readonly title: FieldRef<"Practitioner", 'String'>
    readonly gmcNumber: FieldRef<"Practitioner", 'String'>
    readonly speciality: FieldRef<"Practitioner", 'String'>
    readonly createdAt: FieldRef<"Practitioner", 'DateTime'>
    readonly updatedAt: FieldRef<"Practitioner", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Practitioner findUnique
   */
  export type PractitionerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioner to fetch.
     */
    where: PractitionerWhereUniqueInput
  }

  /**
   * Practitioner findUniqueOrThrow
   */
  export type PractitionerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioner to fetch.
     */
    where: PractitionerWhereUniqueInput
  }

  /**
   * Practitioner findFirst
   */
  export type PractitionerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioner to fetch.
     */
    where?: PractitionerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Practitioners to fetch.
     */
    orderBy?: PractitionerOrderByWithRelationInput | PractitionerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Practitioners.
     */
    cursor?: PractitionerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Practitioners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Practitioners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Practitioners.
     */
    distinct?: PractitionerScalarFieldEnum | PractitionerScalarFieldEnum[]
  }

  /**
   * Practitioner findFirstOrThrow
   */
  export type PractitionerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioner to fetch.
     */
    where?: PractitionerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Practitioners to fetch.
     */
    orderBy?: PractitionerOrderByWithRelationInput | PractitionerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Practitioners.
     */
    cursor?: PractitionerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Practitioners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Practitioners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Practitioners.
     */
    distinct?: PractitionerScalarFieldEnum | PractitionerScalarFieldEnum[]
  }

  /**
   * Practitioner findMany
   */
  export type PractitionerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter, which Practitioners to fetch.
     */
    where?: PractitionerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Practitioners to fetch.
     */
    orderBy?: PractitionerOrderByWithRelationInput | PractitionerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Practitioners.
     */
    cursor?: PractitionerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Practitioners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Practitioners.
     */
    skip?: number
    distinct?: PractitionerScalarFieldEnum | PractitionerScalarFieldEnum[]
  }

  /**
   * Practitioner create
   */
  export type PractitionerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * The data needed to create a Practitioner.
     */
    data: XOR<PractitionerCreateInput, PractitionerUncheckedCreateInput>
  }

  /**
   * Practitioner createMany
   */
  export type PractitionerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Practitioners.
     */
    data: PractitionerCreateManyInput | PractitionerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Practitioner createManyAndReturn
   */
  export type PractitionerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * The data used to create many Practitioners.
     */
    data: PractitionerCreateManyInput | PractitionerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Practitioner update
   */
  export type PractitionerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * The data needed to update a Practitioner.
     */
    data: XOR<PractitionerUpdateInput, PractitionerUncheckedUpdateInput>
    /**
     * Choose, which Practitioner to update.
     */
    where: PractitionerWhereUniqueInput
  }

  /**
   * Practitioner updateMany
   */
  export type PractitionerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Practitioners.
     */
    data: XOR<PractitionerUpdateManyMutationInput, PractitionerUncheckedUpdateManyInput>
    /**
     * Filter which Practitioners to update
     */
    where?: PractitionerWhereInput
    /**
     * Limit how many Practitioners to update.
     */
    limit?: number
  }

  /**
   * Practitioner updateManyAndReturn
   */
  export type PractitionerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * The data used to update Practitioners.
     */
    data: XOR<PractitionerUpdateManyMutationInput, PractitionerUncheckedUpdateManyInput>
    /**
     * Filter which Practitioners to update
     */
    where?: PractitionerWhereInput
    /**
     * Limit how many Practitioners to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Practitioner upsert
   */
  export type PractitionerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * The filter to search for the Practitioner to update in case it exists.
     */
    where: PractitionerWhereUniqueInput
    /**
     * In case the Practitioner found by the `where` argument doesn't exist, create a new Practitioner with this data.
     */
    create: XOR<PractitionerCreateInput, PractitionerUncheckedCreateInput>
    /**
     * In case the Practitioner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PractitionerUpdateInput, PractitionerUncheckedUpdateInput>
  }

  /**
   * Practitioner delete
   */
  export type PractitionerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
    /**
     * Filter which Practitioner to delete.
     */
    where: PractitionerWhereUniqueInput
  }

  /**
   * Practitioner deleteMany
   */
  export type PractitionerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Practitioners to delete
     */
    where?: PractitionerWhereInput
    /**
     * Limit how many Practitioners to delete.
     */
    limit?: number
  }

  /**
   * Practitioner.slots
   */
  export type Practitioner$slotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    where?: SlotWhereInput
    orderBy?: SlotOrderByWithRelationInput | SlotOrderByWithRelationInput[]
    cursor?: SlotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SlotScalarFieldEnum | SlotScalarFieldEnum[]
  }

  /**
   * Practitioner.appointments
   */
  export type Practitioner$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Practitioner.availabilityWindows
   */
  export type Practitioner$availabilityWindowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    where?: PractitionerAvailabilityWindowWhereInput
    orderBy?: PractitionerAvailabilityWindowOrderByWithRelationInput | PractitionerAvailabilityWindowOrderByWithRelationInput[]
    cursor?: PractitionerAvailabilityWindowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PractitionerAvailabilityWindowScalarFieldEnum | PractitionerAvailabilityWindowScalarFieldEnum[]
  }

  /**
   * Practitioner.practitionerLocations
   */
  export type Practitioner$practitionerLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    where?: PractitionerLocationWhereInput
    orderBy?: PractitionerLocationOrderByWithRelationInput | PractitionerLocationOrderByWithRelationInput[]
    cursor?: PractitionerLocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PractitionerLocationScalarFieldEnum | PractitionerLocationScalarFieldEnum[]
  }

  /**
   * Practitioner without action
   */
  export type PractitionerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Practitioner
     */
    select?: PractitionerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Practitioner
     */
    omit?: PractitionerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerInclude<ExtArgs> | null
  }


  /**
   * Model Location
   */

  export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  export type LocationMinAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    postcode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    postcode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LocationCountAggregateOutputType = {
    id: number
    name: number
    address: number
    postcode: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LocationMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    postcode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocationMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    postcode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LocationCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    postcode?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Location to aggregate.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Locations
    **/
    _count?: true | LocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationMaxAggregateInputType
  }

  export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
        [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocation[P]>
      : GetScalarType<T[P], AggregateLocation[P]>
  }




  export type LocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithAggregationInput | LocationOrderByWithAggregationInput[]
    by: LocationScalarFieldEnum[] | LocationScalarFieldEnum
    having?: LocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationCountAggregateInputType | true
    _min?: LocationMinAggregateInputType
    _max?: LocationMaxAggregateInputType
  }

  export type LocationGroupByOutputType = {
    id: string
    name: string
    address: string | null
    postcode: string | null
    createdAt: Date
    updatedAt: Date
    _count: LocationCountAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationGroupByOutputType[P]>
            : GetScalarType<T[P], LocationGroupByOutputType[P]>
        }
      >
    >


  export type LocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    postcode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    slots?: boolean | Location$slotsArgs<ExtArgs>
    patients?: boolean | Location$patientsArgs<ExtArgs>
    availabilityWindows?: boolean | Location$availabilityWindowsArgs<ExtArgs>
    practitionerLocations?: boolean | Location$practitionerLocationsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>

  export type LocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    postcode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["location"]>

  export type LocationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    postcode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["location"]>

  export type LocationSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    postcode?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "address" | "postcode" | "createdAt" | "updatedAt", ExtArgs["result"]["location"]>
  export type LocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    slots?: boolean | Location$slotsArgs<ExtArgs>
    patients?: boolean | Location$patientsArgs<ExtArgs>
    availabilityWindows?: boolean | Location$availabilityWindowsArgs<ExtArgs>
    practitionerLocations?: boolean | Location$practitionerLocationsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LocationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Location"
    objects: {
      slots: Prisma.$SlotPayload<ExtArgs>[]
      patients: Prisma.$PatientPayload<ExtArgs>[]
      availabilityWindows: Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>[]
      practitionerLocations: Prisma.$PractitionerLocationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      address: string | null
      postcode: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["location"]>
    composites: {}
  }

  type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = $Result.GetResult<Prisma.$LocationPayload, S>

  type LocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationCountAggregateInputType | true
    }

  export interface LocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Location'], meta: { name: 'Location' } }
    /**
     * Find zero or one Location that matches the filter.
     * @param {LocationFindUniqueArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationFindUniqueArgs>(args: SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Location that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationFindUniqueOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationFindFirstArgs>(args?: SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.location.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.location.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationWithIdOnly = await prisma.location.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationFindManyArgs>(args?: SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Location.
     * @param {LocationCreateArgs} args - Arguments to create a Location.
     * @example
     * // Create one Location
     * const Location = await prisma.location.create({
     *   data: {
     *     // ... data to create a Location
     *   }
     * })
     * 
     */
    create<T extends LocationCreateArgs>(args: SelectSubset<T, LocationCreateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Locations.
     * @param {LocationCreateManyArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationCreateManyArgs>(args?: SelectSubset<T, LocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Locations and returns the data saved in the database.
     * @param {LocationCreateManyAndReturnArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Locations and only return the `id`
     * const locationWithIdOnly = await prisma.location.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocationCreateManyAndReturnArgs>(args?: SelectSubset<T, LocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Location.
     * @param {LocationDeleteArgs} args - Arguments to delete one Location.
     * @example
     * // Delete one Location
     * const Location = await prisma.location.delete({
     *   where: {
     *     // ... filter to delete one Location
     *   }
     * })
     * 
     */
    delete<T extends LocationDeleteArgs>(args: SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Location.
     * @param {LocationUpdateArgs} args - Arguments to update one Location.
     * @example
     * // Update one Location
     * const location = await prisma.location.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationUpdateArgs>(args: SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Locations.
     * @param {LocationDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.location.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationDeleteManyArgs>(args?: SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationUpdateManyArgs>(args: SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations and returns the data updated in the database.
     * @param {LocationUpdateManyAndReturnArgs} args - Arguments to update many Locations.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Locations and only return the `id`
     * const locationWithIdOnly = await prisma.location.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocationUpdateManyAndReturnArgs>(args: SelectSubset<T, LocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Location.
     * @param {LocationUpsertArgs} args - Arguments to update or create a Location.
     * @example
     * // Update or create a Location
     * const location = await prisma.location.upsert({
     *   create: {
     *     // ... data to create a Location
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Location we want to update
     *   }
     * })
     */
    upsert<T extends LocationUpsertArgs>(args: SelectSubset<T, LocationUpsertArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.location.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends LocationCountArgs>(
      args?: Subset<T, LocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LocationAggregateArgs>(args: Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>

    /**
     * Group by Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationGroupByArgs} args - Group by arguments.
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
      T extends LocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationGroupByArgs['orderBy'] }
        : { orderBy?: LocationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Location model
   */
  readonly fields: LocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Location.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    slots<T extends Location$slotsArgs<ExtArgs> = {}>(args?: Subset<T, Location$slotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    patients<T extends Location$patientsArgs<ExtArgs> = {}>(args?: Subset<T, Location$patientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    availabilityWindows<T extends Location$availabilityWindowsArgs<ExtArgs> = {}>(args?: Subset<T, Location$availabilityWindowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    practitionerLocations<T extends Location$practitionerLocationsArgs<ExtArgs> = {}>(args?: Subset<T, Location$practitionerLocationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Location model
   */
  interface LocationFieldRefs {
    readonly id: FieldRef<"Location", 'String'>
    readonly name: FieldRef<"Location", 'String'>
    readonly address: FieldRef<"Location", 'String'>
    readonly postcode: FieldRef<"Location", 'String'>
    readonly createdAt: FieldRef<"Location", 'DateTime'>
    readonly updatedAt: FieldRef<"Location", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Location findUnique
   */
  export type LocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findUniqueOrThrow
   */
  export type LocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findFirst
   */
  export type LocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findFirstOrThrow
   */
  export type LocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findMany
   */
  export type LocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Locations to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location create
   */
  export type LocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to create a Location.
     */
    data: XOR<LocationCreateInput, LocationUncheckedCreateInput>
  }

  /**
   * Location createMany
   */
  export type LocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location createManyAndReturn
   */
  export type LocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location update
   */
  export type LocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to update a Location.
     */
    data: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
    /**
     * Choose, which Location to update.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location updateMany
   */
  export type LocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
  }

  /**
   * Location updateManyAndReturn
   */
  export type LocationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
  }

  /**
   * Location upsert
   */
  export type LocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The filter to search for the Location to update in case it exists.
     */
    where: LocationWhereUniqueInput
    /**
     * In case the Location found by the `where` argument doesn't exist, create a new Location with this data.
     */
    create: XOR<LocationCreateInput, LocationUncheckedCreateInput>
    /**
     * In case the Location was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
  }

  /**
   * Location delete
   */
  export type LocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter which Location to delete.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location deleteMany
   */
  export type LocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Locations to delete
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to delete.
     */
    limit?: number
  }

  /**
   * Location.slots
   */
  export type Location$slotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    where?: SlotWhereInput
    orderBy?: SlotOrderByWithRelationInput | SlotOrderByWithRelationInput[]
    cursor?: SlotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SlotScalarFieldEnum | SlotScalarFieldEnum[]
  }

  /**
   * Location.patients
   */
  export type Location$patientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    cursor?: PatientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Location.availabilityWindows
   */
  export type Location$availabilityWindowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    where?: PractitionerAvailabilityWindowWhereInput
    orderBy?: PractitionerAvailabilityWindowOrderByWithRelationInput | PractitionerAvailabilityWindowOrderByWithRelationInput[]
    cursor?: PractitionerAvailabilityWindowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PractitionerAvailabilityWindowScalarFieldEnum | PractitionerAvailabilityWindowScalarFieldEnum[]
  }

  /**
   * Location.practitionerLocations
   */
  export type Location$practitionerLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    where?: PractitionerLocationWhereInput
    orderBy?: PractitionerLocationOrderByWithRelationInput | PractitionerLocationOrderByWithRelationInput[]
    cursor?: PractitionerLocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PractitionerLocationScalarFieldEnum | PractitionerLocationScalarFieldEnum[]
  }

  /**
   * Location without action
   */
  export type LocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
  }


  /**
   * Model PractitionerLocation
   */

  export type AggregatePractitionerLocation = {
    _count: PractitionerLocationCountAggregateOutputType | null
    _min: PractitionerLocationMinAggregateOutputType | null
    _max: PractitionerLocationMaxAggregateOutputType | null
  }

  export type PractitionerLocationMinAggregateOutputType = {
    id: string | null
    practitionerId: string | null
    locationId: string | null
    createdAt: Date | null
  }

  export type PractitionerLocationMaxAggregateOutputType = {
    id: string | null
    practitionerId: string | null
    locationId: string | null
    createdAt: Date | null
  }

  export type PractitionerLocationCountAggregateOutputType = {
    id: number
    practitionerId: number
    locationId: number
    createdAt: number
    _all: number
  }


  export type PractitionerLocationMinAggregateInputType = {
    id?: true
    practitionerId?: true
    locationId?: true
    createdAt?: true
  }

  export type PractitionerLocationMaxAggregateInputType = {
    id?: true
    practitionerId?: true
    locationId?: true
    createdAt?: true
  }

  export type PractitionerLocationCountAggregateInputType = {
    id?: true
    practitionerId?: true
    locationId?: true
    createdAt?: true
    _all?: true
  }

  export type PractitionerLocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PractitionerLocation to aggregate.
     */
    where?: PractitionerLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PractitionerLocations to fetch.
     */
    orderBy?: PractitionerLocationOrderByWithRelationInput | PractitionerLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PractitionerLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PractitionerLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PractitionerLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PractitionerLocations
    **/
    _count?: true | PractitionerLocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PractitionerLocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PractitionerLocationMaxAggregateInputType
  }

  export type GetPractitionerLocationAggregateType<T extends PractitionerLocationAggregateArgs> = {
        [P in keyof T & keyof AggregatePractitionerLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePractitionerLocation[P]>
      : GetScalarType<T[P], AggregatePractitionerLocation[P]>
  }




  export type PractitionerLocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PractitionerLocationWhereInput
    orderBy?: PractitionerLocationOrderByWithAggregationInput | PractitionerLocationOrderByWithAggregationInput[]
    by: PractitionerLocationScalarFieldEnum[] | PractitionerLocationScalarFieldEnum
    having?: PractitionerLocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PractitionerLocationCountAggregateInputType | true
    _min?: PractitionerLocationMinAggregateInputType
    _max?: PractitionerLocationMaxAggregateInputType
  }

  export type PractitionerLocationGroupByOutputType = {
    id: string
    practitionerId: string
    locationId: string
    createdAt: Date
    _count: PractitionerLocationCountAggregateOutputType | null
    _min: PractitionerLocationMinAggregateOutputType | null
    _max: PractitionerLocationMaxAggregateOutputType | null
  }

  type GetPractitionerLocationGroupByPayload<T extends PractitionerLocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PractitionerLocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PractitionerLocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PractitionerLocationGroupByOutputType[P]>
            : GetScalarType<T[P], PractitionerLocationGroupByOutputType[P]>
        }
      >
    >


  export type PractitionerLocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    createdAt?: boolean
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitionerLocation"]>

  export type PractitionerLocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    createdAt?: boolean
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitionerLocation"]>

  export type PractitionerLocationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    createdAt?: boolean
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitionerLocation"]>

  export type PractitionerLocationSelectScalar = {
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    createdAt?: boolean
  }

  export type PractitionerLocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "practitionerId" | "locationId" | "createdAt", ExtArgs["result"]["practitionerLocation"]>
  export type PractitionerLocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }
  export type PractitionerLocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }
  export type PractitionerLocationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $PractitionerLocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PractitionerLocation"
    objects: {
      practitioner: Prisma.$PractitionerPayload<ExtArgs>
      location: Prisma.$LocationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      practitionerId: string
      locationId: string
      createdAt: Date
    }, ExtArgs["result"]["practitionerLocation"]>
    composites: {}
  }

  type PractitionerLocationGetPayload<S extends boolean | null | undefined | PractitionerLocationDefaultArgs> = $Result.GetResult<Prisma.$PractitionerLocationPayload, S>

  type PractitionerLocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PractitionerLocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PractitionerLocationCountAggregateInputType | true
    }

  export interface PractitionerLocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PractitionerLocation'], meta: { name: 'PractitionerLocation' } }
    /**
     * Find zero or one PractitionerLocation that matches the filter.
     * @param {PractitionerLocationFindUniqueArgs} args - Arguments to find a PractitionerLocation
     * @example
     * // Get one PractitionerLocation
     * const practitionerLocation = await prisma.practitionerLocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PractitionerLocationFindUniqueArgs>(args: SelectSubset<T, PractitionerLocationFindUniqueArgs<ExtArgs>>): Prisma__PractitionerLocationClient<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PractitionerLocation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PractitionerLocationFindUniqueOrThrowArgs} args - Arguments to find a PractitionerLocation
     * @example
     * // Get one PractitionerLocation
     * const practitionerLocation = await prisma.practitionerLocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PractitionerLocationFindUniqueOrThrowArgs>(args: SelectSubset<T, PractitionerLocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PractitionerLocationClient<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PractitionerLocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerLocationFindFirstArgs} args - Arguments to find a PractitionerLocation
     * @example
     * // Get one PractitionerLocation
     * const practitionerLocation = await prisma.practitionerLocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PractitionerLocationFindFirstArgs>(args?: SelectSubset<T, PractitionerLocationFindFirstArgs<ExtArgs>>): Prisma__PractitionerLocationClient<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PractitionerLocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerLocationFindFirstOrThrowArgs} args - Arguments to find a PractitionerLocation
     * @example
     * // Get one PractitionerLocation
     * const practitionerLocation = await prisma.practitionerLocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PractitionerLocationFindFirstOrThrowArgs>(args?: SelectSubset<T, PractitionerLocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PractitionerLocationClient<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PractitionerLocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerLocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PractitionerLocations
     * const practitionerLocations = await prisma.practitionerLocation.findMany()
     * 
     * // Get first 10 PractitionerLocations
     * const practitionerLocations = await prisma.practitionerLocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const practitionerLocationWithIdOnly = await prisma.practitionerLocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PractitionerLocationFindManyArgs>(args?: SelectSubset<T, PractitionerLocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PractitionerLocation.
     * @param {PractitionerLocationCreateArgs} args - Arguments to create a PractitionerLocation.
     * @example
     * // Create one PractitionerLocation
     * const PractitionerLocation = await prisma.practitionerLocation.create({
     *   data: {
     *     // ... data to create a PractitionerLocation
     *   }
     * })
     * 
     */
    create<T extends PractitionerLocationCreateArgs>(args: SelectSubset<T, PractitionerLocationCreateArgs<ExtArgs>>): Prisma__PractitionerLocationClient<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PractitionerLocations.
     * @param {PractitionerLocationCreateManyArgs} args - Arguments to create many PractitionerLocations.
     * @example
     * // Create many PractitionerLocations
     * const practitionerLocation = await prisma.practitionerLocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PractitionerLocationCreateManyArgs>(args?: SelectSubset<T, PractitionerLocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PractitionerLocations and returns the data saved in the database.
     * @param {PractitionerLocationCreateManyAndReturnArgs} args - Arguments to create many PractitionerLocations.
     * @example
     * // Create many PractitionerLocations
     * const practitionerLocation = await prisma.practitionerLocation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PractitionerLocations and only return the `id`
     * const practitionerLocationWithIdOnly = await prisma.practitionerLocation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PractitionerLocationCreateManyAndReturnArgs>(args?: SelectSubset<T, PractitionerLocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PractitionerLocation.
     * @param {PractitionerLocationDeleteArgs} args - Arguments to delete one PractitionerLocation.
     * @example
     * // Delete one PractitionerLocation
     * const PractitionerLocation = await prisma.practitionerLocation.delete({
     *   where: {
     *     // ... filter to delete one PractitionerLocation
     *   }
     * })
     * 
     */
    delete<T extends PractitionerLocationDeleteArgs>(args: SelectSubset<T, PractitionerLocationDeleteArgs<ExtArgs>>): Prisma__PractitionerLocationClient<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PractitionerLocation.
     * @param {PractitionerLocationUpdateArgs} args - Arguments to update one PractitionerLocation.
     * @example
     * // Update one PractitionerLocation
     * const practitionerLocation = await prisma.practitionerLocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PractitionerLocationUpdateArgs>(args: SelectSubset<T, PractitionerLocationUpdateArgs<ExtArgs>>): Prisma__PractitionerLocationClient<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PractitionerLocations.
     * @param {PractitionerLocationDeleteManyArgs} args - Arguments to filter PractitionerLocations to delete.
     * @example
     * // Delete a few PractitionerLocations
     * const { count } = await prisma.practitionerLocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PractitionerLocationDeleteManyArgs>(args?: SelectSubset<T, PractitionerLocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PractitionerLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerLocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PractitionerLocations
     * const practitionerLocation = await prisma.practitionerLocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PractitionerLocationUpdateManyArgs>(args: SelectSubset<T, PractitionerLocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PractitionerLocations and returns the data updated in the database.
     * @param {PractitionerLocationUpdateManyAndReturnArgs} args - Arguments to update many PractitionerLocations.
     * @example
     * // Update many PractitionerLocations
     * const practitionerLocation = await prisma.practitionerLocation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PractitionerLocations and only return the `id`
     * const practitionerLocationWithIdOnly = await prisma.practitionerLocation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PractitionerLocationUpdateManyAndReturnArgs>(args: SelectSubset<T, PractitionerLocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PractitionerLocation.
     * @param {PractitionerLocationUpsertArgs} args - Arguments to update or create a PractitionerLocation.
     * @example
     * // Update or create a PractitionerLocation
     * const practitionerLocation = await prisma.practitionerLocation.upsert({
     *   create: {
     *     // ... data to create a PractitionerLocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PractitionerLocation we want to update
     *   }
     * })
     */
    upsert<T extends PractitionerLocationUpsertArgs>(args: SelectSubset<T, PractitionerLocationUpsertArgs<ExtArgs>>): Prisma__PractitionerLocationClient<$Result.GetResult<Prisma.$PractitionerLocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PractitionerLocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerLocationCountArgs} args - Arguments to filter PractitionerLocations to count.
     * @example
     * // Count the number of PractitionerLocations
     * const count = await prisma.practitionerLocation.count({
     *   where: {
     *     // ... the filter for the PractitionerLocations we want to count
     *   }
     * })
    **/
    count<T extends PractitionerLocationCountArgs>(
      args?: Subset<T, PractitionerLocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PractitionerLocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PractitionerLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerLocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PractitionerLocationAggregateArgs>(args: Subset<T, PractitionerLocationAggregateArgs>): Prisma.PrismaPromise<GetPractitionerLocationAggregateType<T>>

    /**
     * Group by PractitionerLocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerLocationGroupByArgs} args - Group by arguments.
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
      T extends PractitionerLocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PractitionerLocationGroupByArgs['orderBy'] }
        : { orderBy?: PractitionerLocationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PractitionerLocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPractitionerLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PractitionerLocation model
   */
  readonly fields: PractitionerLocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PractitionerLocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PractitionerLocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    practitioner<T extends PractitionerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PractitionerDefaultArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PractitionerLocation model
   */
  interface PractitionerLocationFieldRefs {
    readonly id: FieldRef<"PractitionerLocation", 'String'>
    readonly practitionerId: FieldRef<"PractitionerLocation", 'String'>
    readonly locationId: FieldRef<"PractitionerLocation", 'String'>
    readonly createdAt: FieldRef<"PractitionerLocation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PractitionerLocation findUnique
   */
  export type PractitionerLocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerLocation to fetch.
     */
    where: PractitionerLocationWhereUniqueInput
  }

  /**
   * PractitionerLocation findUniqueOrThrow
   */
  export type PractitionerLocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerLocation to fetch.
     */
    where: PractitionerLocationWhereUniqueInput
  }

  /**
   * PractitionerLocation findFirst
   */
  export type PractitionerLocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerLocation to fetch.
     */
    where?: PractitionerLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PractitionerLocations to fetch.
     */
    orderBy?: PractitionerLocationOrderByWithRelationInput | PractitionerLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PractitionerLocations.
     */
    cursor?: PractitionerLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PractitionerLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PractitionerLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PractitionerLocations.
     */
    distinct?: PractitionerLocationScalarFieldEnum | PractitionerLocationScalarFieldEnum[]
  }

  /**
   * PractitionerLocation findFirstOrThrow
   */
  export type PractitionerLocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerLocation to fetch.
     */
    where?: PractitionerLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PractitionerLocations to fetch.
     */
    orderBy?: PractitionerLocationOrderByWithRelationInput | PractitionerLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PractitionerLocations.
     */
    cursor?: PractitionerLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PractitionerLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PractitionerLocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PractitionerLocations.
     */
    distinct?: PractitionerLocationScalarFieldEnum | PractitionerLocationScalarFieldEnum[]
  }

  /**
   * PractitionerLocation findMany
   */
  export type PractitionerLocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerLocations to fetch.
     */
    where?: PractitionerLocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PractitionerLocations to fetch.
     */
    orderBy?: PractitionerLocationOrderByWithRelationInput | PractitionerLocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PractitionerLocations.
     */
    cursor?: PractitionerLocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PractitionerLocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PractitionerLocations.
     */
    skip?: number
    distinct?: PractitionerLocationScalarFieldEnum | PractitionerLocationScalarFieldEnum[]
  }

  /**
   * PractitionerLocation create
   */
  export type PractitionerLocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    /**
     * The data needed to create a PractitionerLocation.
     */
    data: XOR<PractitionerLocationCreateInput, PractitionerLocationUncheckedCreateInput>
  }

  /**
   * PractitionerLocation createMany
   */
  export type PractitionerLocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PractitionerLocations.
     */
    data: PractitionerLocationCreateManyInput | PractitionerLocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PractitionerLocation createManyAndReturn
   */
  export type PractitionerLocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * The data used to create many PractitionerLocations.
     */
    data: PractitionerLocationCreateManyInput | PractitionerLocationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PractitionerLocation update
   */
  export type PractitionerLocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    /**
     * The data needed to update a PractitionerLocation.
     */
    data: XOR<PractitionerLocationUpdateInput, PractitionerLocationUncheckedUpdateInput>
    /**
     * Choose, which PractitionerLocation to update.
     */
    where: PractitionerLocationWhereUniqueInput
  }

  /**
   * PractitionerLocation updateMany
   */
  export type PractitionerLocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PractitionerLocations.
     */
    data: XOR<PractitionerLocationUpdateManyMutationInput, PractitionerLocationUncheckedUpdateManyInput>
    /**
     * Filter which PractitionerLocations to update
     */
    where?: PractitionerLocationWhereInput
    /**
     * Limit how many PractitionerLocations to update.
     */
    limit?: number
  }

  /**
   * PractitionerLocation updateManyAndReturn
   */
  export type PractitionerLocationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * The data used to update PractitionerLocations.
     */
    data: XOR<PractitionerLocationUpdateManyMutationInput, PractitionerLocationUncheckedUpdateManyInput>
    /**
     * Filter which PractitionerLocations to update
     */
    where?: PractitionerLocationWhereInput
    /**
     * Limit how many PractitionerLocations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PractitionerLocation upsert
   */
  export type PractitionerLocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    /**
     * The filter to search for the PractitionerLocation to update in case it exists.
     */
    where: PractitionerLocationWhereUniqueInput
    /**
     * In case the PractitionerLocation found by the `where` argument doesn't exist, create a new PractitionerLocation with this data.
     */
    create: XOR<PractitionerLocationCreateInput, PractitionerLocationUncheckedCreateInput>
    /**
     * In case the PractitionerLocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PractitionerLocationUpdateInput, PractitionerLocationUncheckedUpdateInput>
  }

  /**
   * PractitionerLocation delete
   */
  export type PractitionerLocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
    /**
     * Filter which PractitionerLocation to delete.
     */
    where: PractitionerLocationWhereUniqueInput
  }

  /**
   * PractitionerLocation deleteMany
   */
  export type PractitionerLocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PractitionerLocations to delete
     */
    where?: PractitionerLocationWhereInput
    /**
     * Limit how many PractitionerLocations to delete.
     */
    limit?: number
  }

  /**
   * PractitionerLocation without action
   */
  export type PractitionerLocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerLocation
     */
    select?: PractitionerLocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerLocation
     */
    omit?: PractitionerLocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerLocationInclude<ExtArgs> | null
  }


  /**
   * Model PractitionerAvailabilityWindow
   */

  export type AggregatePractitionerAvailabilityWindow = {
    _count: PractitionerAvailabilityWindowCountAggregateOutputType | null
    _avg: PractitionerAvailabilityWindowAvgAggregateOutputType | null
    _sum: PractitionerAvailabilityWindowSumAggregateOutputType | null
    _min: PractitionerAvailabilityWindowMinAggregateOutputType | null
    _max: PractitionerAvailabilityWindowMaxAggregateOutputType | null
  }

  export type PractitionerAvailabilityWindowAvgAggregateOutputType = {
    dayOfWeek: number | null
    windowStartMin: number | null
    windowEndMin: number | null
    slotDurationMin: number | null
  }

  export type PractitionerAvailabilityWindowSumAggregateOutputType = {
    dayOfWeek: number | null
    windowStartMin: number | null
    windowEndMin: number | null
    slotDurationMin: number | null
  }

  export type PractitionerAvailabilityWindowMinAggregateOutputType = {
    id: string | null
    practitionerId: string | null
    locationId: string | null
    dayOfWeek: number | null
    windowStartMin: number | null
    windowEndMin: number | null
    slotDurationMin: number | null
  }

  export type PractitionerAvailabilityWindowMaxAggregateOutputType = {
    id: string | null
    practitionerId: string | null
    locationId: string | null
    dayOfWeek: number | null
    windowStartMin: number | null
    windowEndMin: number | null
    slotDurationMin: number | null
  }

  export type PractitionerAvailabilityWindowCountAggregateOutputType = {
    id: number
    practitionerId: number
    locationId: number
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin: number
    _all: number
  }


  export type PractitionerAvailabilityWindowAvgAggregateInputType = {
    dayOfWeek?: true
    windowStartMin?: true
    windowEndMin?: true
    slotDurationMin?: true
  }

  export type PractitionerAvailabilityWindowSumAggregateInputType = {
    dayOfWeek?: true
    windowStartMin?: true
    windowEndMin?: true
    slotDurationMin?: true
  }

  export type PractitionerAvailabilityWindowMinAggregateInputType = {
    id?: true
    practitionerId?: true
    locationId?: true
    dayOfWeek?: true
    windowStartMin?: true
    windowEndMin?: true
    slotDurationMin?: true
  }

  export type PractitionerAvailabilityWindowMaxAggregateInputType = {
    id?: true
    practitionerId?: true
    locationId?: true
    dayOfWeek?: true
    windowStartMin?: true
    windowEndMin?: true
    slotDurationMin?: true
  }

  export type PractitionerAvailabilityWindowCountAggregateInputType = {
    id?: true
    practitionerId?: true
    locationId?: true
    dayOfWeek?: true
    windowStartMin?: true
    windowEndMin?: true
    slotDurationMin?: true
    _all?: true
  }

  export type PractitionerAvailabilityWindowAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PractitionerAvailabilityWindow to aggregate.
     */
    where?: PractitionerAvailabilityWindowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PractitionerAvailabilityWindows to fetch.
     */
    orderBy?: PractitionerAvailabilityWindowOrderByWithRelationInput | PractitionerAvailabilityWindowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PractitionerAvailabilityWindowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PractitionerAvailabilityWindows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PractitionerAvailabilityWindows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PractitionerAvailabilityWindows
    **/
    _count?: true | PractitionerAvailabilityWindowCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PractitionerAvailabilityWindowAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PractitionerAvailabilityWindowSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PractitionerAvailabilityWindowMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PractitionerAvailabilityWindowMaxAggregateInputType
  }

  export type GetPractitionerAvailabilityWindowAggregateType<T extends PractitionerAvailabilityWindowAggregateArgs> = {
        [P in keyof T & keyof AggregatePractitionerAvailabilityWindow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePractitionerAvailabilityWindow[P]>
      : GetScalarType<T[P], AggregatePractitionerAvailabilityWindow[P]>
  }




  export type PractitionerAvailabilityWindowGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PractitionerAvailabilityWindowWhereInput
    orderBy?: PractitionerAvailabilityWindowOrderByWithAggregationInput | PractitionerAvailabilityWindowOrderByWithAggregationInput[]
    by: PractitionerAvailabilityWindowScalarFieldEnum[] | PractitionerAvailabilityWindowScalarFieldEnum
    having?: PractitionerAvailabilityWindowScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PractitionerAvailabilityWindowCountAggregateInputType | true
    _avg?: PractitionerAvailabilityWindowAvgAggregateInputType
    _sum?: PractitionerAvailabilityWindowSumAggregateInputType
    _min?: PractitionerAvailabilityWindowMinAggregateInputType
    _max?: PractitionerAvailabilityWindowMaxAggregateInputType
  }

  export type PractitionerAvailabilityWindowGroupByOutputType = {
    id: string
    practitionerId: string
    locationId: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin: number
    _count: PractitionerAvailabilityWindowCountAggregateOutputType | null
    _avg: PractitionerAvailabilityWindowAvgAggregateOutputType | null
    _sum: PractitionerAvailabilityWindowSumAggregateOutputType | null
    _min: PractitionerAvailabilityWindowMinAggregateOutputType | null
    _max: PractitionerAvailabilityWindowMaxAggregateOutputType | null
  }

  type GetPractitionerAvailabilityWindowGroupByPayload<T extends PractitionerAvailabilityWindowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PractitionerAvailabilityWindowGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PractitionerAvailabilityWindowGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PractitionerAvailabilityWindowGroupByOutputType[P]>
            : GetScalarType<T[P], PractitionerAvailabilityWindowGroupByOutputType[P]>
        }
      >
    >


  export type PractitionerAvailabilityWindowSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    dayOfWeek?: boolean
    windowStartMin?: boolean
    windowEndMin?: boolean
    slotDurationMin?: boolean
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitionerAvailabilityWindow"]>

  export type PractitionerAvailabilityWindowSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    dayOfWeek?: boolean
    windowStartMin?: boolean
    windowEndMin?: boolean
    slotDurationMin?: boolean
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitionerAvailabilityWindow"]>

  export type PractitionerAvailabilityWindowSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    dayOfWeek?: boolean
    windowStartMin?: boolean
    windowEndMin?: boolean
    slotDurationMin?: boolean
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practitionerAvailabilityWindow"]>

  export type PractitionerAvailabilityWindowSelectScalar = {
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    dayOfWeek?: boolean
    windowStartMin?: boolean
    windowEndMin?: boolean
    slotDurationMin?: boolean
  }

  export type PractitionerAvailabilityWindowOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "practitionerId" | "locationId" | "dayOfWeek" | "windowStartMin" | "windowEndMin" | "slotDurationMin", ExtArgs["result"]["practitionerAvailabilityWindow"]>
  export type PractitionerAvailabilityWindowInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }
  export type PractitionerAvailabilityWindowIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }
  export type PractitionerAvailabilityWindowIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $PractitionerAvailabilityWindowPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PractitionerAvailabilityWindow"
    objects: {
      practitioner: Prisma.$PractitionerPayload<ExtArgs>
      location: Prisma.$LocationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      practitionerId: string
      locationId: string
      dayOfWeek: number
      windowStartMin: number
      windowEndMin: number
      slotDurationMin: number
    }, ExtArgs["result"]["practitionerAvailabilityWindow"]>
    composites: {}
  }

  type PractitionerAvailabilityWindowGetPayload<S extends boolean | null | undefined | PractitionerAvailabilityWindowDefaultArgs> = $Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload, S>

  type PractitionerAvailabilityWindowCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PractitionerAvailabilityWindowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PractitionerAvailabilityWindowCountAggregateInputType | true
    }

  export interface PractitionerAvailabilityWindowDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PractitionerAvailabilityWindow'], meta: { name: 'PractitionerAvailabilityWindow' } }
    /**
     * Find zero or one PractitionerAvailabilityWindow that matches the filter.
     * @param {PractitionerAvailabilityWindowFindUniqueArgs} args - Arguments to find a PractitionerAvailabilityWindow
     * @example
     * // Get one PractitionerAvailabilityWindow
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PractitionerAvailabilityWindowFindUniqueArgs>(args: SelectSubset<T, PractitionerAvailabilityWindowFindUniqueArgs<ExtArgs>>): Prisma__PractitionerAvailabilityWindowClient<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PractitionerAvailabilityWindow that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PractitionerAvailabilityWindowFindUniqueOrThrowArgs} args - Arguments to find a PractitionerAvailabilityWindow
     * @example
     * // Get one PractitionerAvailabilityWindow
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PractitionerAvailabilityWindowFindUniqueOrThrowArgs>(args: SelectSubset<T, PractitionerAvailabilityWindowFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PractitionerAvailabilityWindowClient<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PractitionerAvailabilityWindow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerAvailabilityWindowFindFirstArgs} args - Arguments to find a PractitionerAvailabilityWindow
     * @example
     * // Get one PractitionerAvailabilityWindow
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PractitionerAvailabilityWindowFindFirstArgs>(args?: SelectSubset<T, PractitionerAvailabilityWindowFindFirstArgs<ExtArgs>>): Prisma__PractitionerAvailabilityWindowClient<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PractitionerAvailabilityWindow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerAvailabilityWindowFindFirstOrThrowArgs} args - Arguments to find a PractitionerAvailabilityWindow
     * @example
     * // Get one PractitionerAvailabilityWindow
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PractitionerAvailabilityWindowFindFirstOrThrowArgs>(args?: SelectSubset<T, PractitionerAvailabilityWindowFindFirstOrThrowArgs<ExtArgs>>): Prisma__PractitionerAvailabilityWindowClient<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PractitionerAvailabilityWindows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerAvailabilityWindowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PractitionerAvailabilityWindows
     * const practitionerAvailabilityWindows = await prisma.practitionerAvailabilityWindow.findMany()
     * 
     * // Get first 10 PractitionerAvailabilityWindows
     * const practitionerAvailabilityWindows = await prisma.practitionerAvailabilityWindow.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const practitionerAvailabilityWindowWithIdOnly = await prisma.practitionerAvailabilityWindow.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PractitionerAvailabilityWindowFindManyArgs>(args?: SelectSubset<T, PractitionerAvailabilityWindowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PractitionerAvailabilityWindow.
     * @param {PractitionerAvailabilityWindowCreateArgs} args - Arguments to create a PractitionerAvailabilityWindow.
     * @example
     * // Create one PractitionerAvailabilityWindow
     * const PractitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.create({
     *   data: {
     *     // ... data to create a PractitionerAvailabilityWindow
     *   }
     * })
     * 
     */
    create<T extends PractitionerAvailabilityWindowCreateArgs>(args: SelectSubset<T, PractitionerAvailabilityWindowCreateArgs<ExtArgs>>): Prisma__PractitionerAvailabilityWindowClient<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PractitionerAvailabilityWindows.
     * @param {PractitionerAvailabilityWindowCreateManyArgs} args - Arguments to create many PractitionerAvailabilityWindows.
     * @example
     * // Create many PractitionerAvailabilityWindows
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PractitionerAvailabilityWindowCreateManyArgs>(args?: SelectSubset<T, PractitionerAvailabilityWindowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PractitionerAvailabilityWindows and returns the data saved in the database.
     * @param {PractitionerAvailabilityWindowCreateManyAndReturnArgs} args - Arguments to create many PractitionerAvailabilityWindows.
     * @example
     * // Create many PractitionerAvailabilityWindows
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PractitionerAvailabilityWindows and only return the `id`
     * const practitionerAvailabilityWindowWithIdOnly = await prisma.practitionerAvailabilityWindow.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PractitionerAvailabilityWindowCreateManyAndReturnArgs>(args?: SelectSubset<T, PractitionerAvailabilityWindowCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PractitionerAvailabilityWindow.
     * @param {PractitionerAvailabilityWindowDeleteArgs} args - Arguments to delete one PractitionerAvailabilityWindow.
     * @example
     * // Delete one PractitionerAvailabilityWindow
     * const PractitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.delete({
     *   where: {
     *     // ... filter to delete one PractitionerAvailabilityWindow
     *   }
     * })
     * 
     */
    delete<T extends PractitionerAvailabilityWindowDeleteArgs>(args: SelectSubset<T, PractitionerAvailabilityWindowDeleteArgs<ExtArgs>>): Prisma__PractitionerAvailabilityWindowClient<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PractitionerAvailabilityWindow.
     * @param {PractitionerAvailabilityWindowUpdateArgs} args - Arguments to update one PractitionerAvailabilityWindow.
     * @example
     * // Update one PractitionerAvailabilityWindow
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PractitionerAvailabilityWindowUpdateArgs>(args: SelectSubset<T, PractitionerAvailabilityWindowUpdateArgs<ExtArgs>>): Prisma__PractitionerAvailabilityWindowClient<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PractitionerAvailabilityWindows.
     * @param {PractitionerAvailabilityWindowDeleteManyArgs} args - Arguments to filter PractitionerAvailabilityWindows to delete.
     * @example
     * // Delete a few PractitionerAvailabilityWindows
     * const { count } = await prisma.practitionerAvailabilityWindow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PractitionerAvailabilityWindowDeleteManyArgs>(args?: SelectSubset<T, PractitionerAvailabilityWindowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PractitionerAvailabilityWindows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerAvailabilityWindowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PractitionerAvailabilityWindows
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PractitionerAvailabilityWindowUpdateManyArgs>(args: SelectSubset<T, PractitionerAvailabilityWindowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PractitionerAvailabilityWindows and returns the data updated in the database.
     * @param {PractitionerAvailabilityWindowUpdateManyAndReturnArgs} args - Arguments to update many PractitionerAvailabilityWindows.
     * @example
     * // Update many PractitionerAvailabilityWindows
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PractitionerAvailabilityWindows and only return the `id`
     * const practitionerAvailabilityWindowWithIdOnly = await prisma.practitionerAvailabilityWindow.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PractitionerAvailabilityWindowUpdateManyAndReturnArgs>(args: SelectSubset<T, PractitionerAvailabilityWindowUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PractitionerAvailabilityWindow.
     * @param {PractitionerAvailabilityWindowUpsertArgs} args - Arguments to update or create a PractitionerAvailabilityWindow.
     * @example
     * // Update or create a PractitionerAvailabilityWindow
     * const practitionerAvailabilityWindow = await prisma.practitionerAvailabilityWindow.upsert({
     *   create: {
     *     // ... data to create a PractitionerAvailabilityWindow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PractitionerAvailabilityWindow we want to update
     *   }
     * })
     */
    upsert<T extends PractitionerAvailabilityWindowUpsertArgs>(args: SelectSubset<T, PractitionerAvailabilityWindowUpsertArgs<ExtArgs>>): Prisma__PractitionerAvailabilityWindowClient<$Result.GetResult<Prisma.$PractitionerAvailabilityWindowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PractitionerAvailabilityWindows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerAvailabilityWindowCountArgs} args - Arguments to filter PractitionerAvailabilityWindows to count.
     * @example
     * // Count the number of PractitionerAvailabilityWindows
     * const count = await prisma.practitionerAvailabilityWindow.count({
     *   where: {
     *     // ... the filter for the PractitionerAvailabilityWindows we want to count
     *   }
     * })
    **/
    count<T extends PractitionerAvailabilityWindowCountArgs>(
      args?: Subset<T, PractitionerAvailabilityWindowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PractitionerAvailabilityWindowCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PractitionerAvailabilityWindow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerAvailabilityWindowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PractitionerAvailabilityWindowAggregateArgs>(args: Subset<T, PractitionerAvailabilityWindowAggregateArgs>): Prisma.PrismaPromise<GetPractitionerAvailabilityWindowAggregateType<T>>

    /**
     * Group by PractitionerAvailabilityWindow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PractitionerAvailabilityWindowGroupByArgs} args - Group by arguments.
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
      T extends PractitionerAvailabilityWindowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PractitionerAvailabilityWindowGroupByArgs['orderBy'] }
        : { orderBy?: PractitionerAvailabilityWindowGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PractitionerAvailabilityWindowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPractitionerAvailabilityWindowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PractitionerAvailabilityWindow model
   */
  readonly fields: PractitionerAvailabilityWindowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PractitionerAvailabilityWindow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PractitionerAvailabilityWindowClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    practitioner<T extends PractitionerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PractitionerDefaultArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PractitionerAvailabilityWindow model
   */
  interface PractitionerAvailabilityWindowFieldRefs {
    readonly id: FieldRef<"PractitionerAvailabilityWindow", 'String'>
    readonly practitionerId: FieldRef<"PractitionerAvailabilityWindow", 'String'>
    readonly locationId: FieldRef<"PractitionerAvailabilityWindow", 'String'>
    readonly dayOfWeek: FieldRef<"PractitionerAvailabilityWindow", 'Int'>
    readonly windowStartMin: FieldRef<"PractitionerAvailabilityWindow", 'Int'>
    readonly windowEndMin: FieldRef<"PractitionerAvailabilityWindow", 'Int'>
    readonly slotDurationMin: FieldRef<"PractitionerAvailabilityWindow", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * PractitionerAvailabilityWindow findUnique
   */
  export type PractitionerAvailabilityWindowFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerAvailabilityWindow to fetch.
     */
    where: PractitionerAvailabilityWindowWhereUniqueInput
  }

  /**
   * PractitionerAvailabilityWindow findUniqueOrThrow
   */
  export type PractitionerAvailabilityWindowFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerAvailabilityWindow to fetch.
     */
    where: PractitionerAvailabilityWindowWhereUniqueInput
  }

  /**
   * PractitionerAvailabilityWindow findFirst
   */
  export type PractitionerAvailabilityWindowFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerAvailabilityWindow to fetch.
     */
    where?: PractitionerAvailabilityWindowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PractitionerAvailabilityWindows to fetch.
     */
    orderBy?: PractitionerAvailabilityWindowOrderByWithRelationInput | PractitionerAvailabilityWindowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PractitionerAvailabilityWindows.
     */
    cursor?: PractitionerAvailabilityWindowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PractitionerAvailabilityWindows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PractitionerAvailabilityWindows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PractitionerAvailabilityWindows.
     */
    distinct?: PractitionerAvailabilityWindowScalarFieldEnum | PractitionerAvailabilityWindowScalarFieldEnum[]
  }

  /**
   * PractitionerAvailabilityWindow findFirstOrThrow
   */
  export type PractitionerAvailabilityWindowFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerAvailabilityWindow to fetch.
     */
    where?: PractitionerAvailabilityWindowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PractitionerAvailabilityWindows to fetch.
     */
    orderBy?: PractitionerAvailabilityWindowOrderByWithRelationInput | PractitionerAvailabilityWindowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PractitionerAvailabilityWindows.
     */
    cursor?: PractitionerAvailabilityWindowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PractitionerAvailabilityWindows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PractitionerAvailabilityWindows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PractitionerAvailabilityWindows.
     */
    distinct?: PractitionerAvailabilityWindowScalarFieldEnum | PractitionerAvailabilityWindowScalarFieldEnum[]
  }

  /**
   * PractitionerAvailabilityWindow findMany
   */
  export type PractitionerAvailabilityWindowFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    /**
     * Filter, which PractitionerAvailabilityWindows to fetch.
     */
    where?: PractitionerAvailabilityWindowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PractitionerAvailabilityWindows to fetch.
     */
    orderBy?: PractitionerAvailabilityWindowOrderByWithRelationInput | PractitionerAvailabilityWindowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PractitionerAvailabilityWindows.
     */
    cursor?: PractitionerAvailabilityWindowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PractitionerAvailabilityWindows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PractitionerAvailabilityWindows.
     */
    skip?: number
    distinct?: PractitionerAvailabilityWindowScalarFieldEnum | PractitionerAvailabilityWindowScalarFieldEnum[]
  }

  /**
   * PractitionerAvailabilityWindow create
   */
  export type PractitionerAvailabilityWindowCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    /**
     * The data needed to create a PractitionerAvailabilityWindow.
     */
    data: XOR<PractitionerAvailabilityWindowCreateInput, PractitionerAvailabilityWindowUncheckedCreateInput>
  }

  /**
   * PractitionerAvailabilityWindow createMany
   */
  export type PractitionerAvailabilityWindowCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PractitionerAvailabilityWindows.
     */
    data: PractitionerAvailabilityWindowCreateManyInput | PractitionerAvailabilityWindowCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PractitionerAvailabilityWindow createManyAndReturn
   */
  export type PractitionerAvailabilityWindowCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * The data used to create many PractitionerAvailabilityWindows.
     */
    data: PractitionerAvailabilityWindowCreateManyInput | PractitionerAvailabilityWindowCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PractitionerAvailabilityWindow update
   */
  export type PractitionerAvailabilityWindowUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    /**
     * The data needed to update a PractitionerAvailabilityWindow.
     */
    data: XOR<PractitionerAvailabilityWindowUpdateInput, PractitionerAvailabilityWindowUncheckedUpdateInput>
    /**
     * Choose, which PractitionerAvailabilityWindow to update.
     */
    where: PractitionerAvailabilityWindowWhereUniqueInput
  }

  /**
   * PractitionerAvailabilityWindow updateMany
   */
  export type PractitionerAvailabilityWindowUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PractitionerAvailabilityWindows.
     */
    data: XOR<PractitionerAvailabilityWindowUpdateManyMutationInput, PractitionerAvailabilityWindowUncheckedUpdateManyInput>
    /**
     * Filter which PractitionerAvailabilityWindows to update
     */
    where?: PractitionerAvailabilityWindowWhereInput
    /**
     * Limit how many PractitionerAvailabilityWindows to update.
     */
    limit?: number
  }

  /**
   * PractitionerAvailabilityWindow updateManyAndReturn
   */
  export type PractitionerAvailabilityWindowUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * The data used to update PractitionerAvailabilityWindows.
     */
    data: XOR<PractitionerAvailabilityWindowUpdateManyMutationInput, PractitionerAvailabilityWindowUncheckedUpdateManyInput>
    /**
     * Filter which PractitionerAvailabilityWindows to update
     */
    where?: PractitionerAvailabilityWindowWhereInput
    /**
     * Limit how many PractitionerAvailabilityWindows to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PractitionerAvailabilityWindow upsert
   */
  export type PractitionerAvailabilityWindowUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    /**
     * The filter to search for the PractitionerAvailabilityWindow to update in case it exists.
     */
    where: PractitionerAvailabilityWindowWhereUniqueInput
    /**
     * In case the PractitionerAvailabilityWindow found by the `where` argument doesn't exist, create a new PractitionerAvailabilityWindow with this data.
     */
    create: XOR<PractitionerAvailabilityWindowCreateInput, PractitionerAvailabilityWindowUncheckedCreateInput>
    /**
     * In case the PractitionerAvailabilityWindow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PractitionerAvailabilityWindowUpdateInput, PractitionerAvailabilityWindowUncheckedUpdateInput>
  }

  /**
   * PractitionerAvailabilityWindow delete
   */
  export type PractitionerAvailabilityWindowDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
    /**
     * Filter which PractitionerAvailabilityWindow to delete.
     */
    where: PractitionerAvailabilityWindowWhereUniqueInput
  }

  /**
   * PractitionerAvailabilityWindow deleteMany
   */
  export type PractitionerAvailabilityWindowDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PractitionerAvailabilityWindows to delete
     */
    where?: PractitionerAvailabilityWindowWhereInput
    /**
     * Limit how many PractitionerAvailabilityWindows to delete.
     */
    limit?: number
  }

  /**
   * PractitionerAvailabilityWindow without action
   */
  export type PractitionerAvailabilityWindowDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PractitionerAvailabilityWindow
     */
    select?: PractitionerAvailabilityWindowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PractitionerAvailabilityWindow
     */
    omit?: PractitionerAvailabilityWindowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PractitionerAvailabilityWindowInclude<ExtArgs> | null
  }


  /**
   * Model Slot
   */

  export type AggregateSlot = {
    _count: SlotCountAggregateOutputType | null
    _min: SlotMinAggregateOutputType | null
    _max: SlotMaxAggregateOutputType | null
  }

  export type SlotMinAggregateOutputType = {
    id: string | null
    practitionerId: string | null
    locationId: string | null
    startAt: Date | null
    endAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SlotMaxAggregateOutputType = {
    id: string | null
    practitionerId: string | null
    locationId: string | null
    startAt: Date | null
    endAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SlotCountAggregateOutputType = {
    id: number
    practitionerId: number
    locationId: number
    startAt: number
    endAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SlotMinAggregateInputType = {
    id?: true
    practitionerId?: true
    locationId?: true
    startAt?: true
    endAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SlotMaxAggregateInputType = {
    id?: true
    practitionerId?: true
    locationId?: true
    startAt?: true
    endAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SlotCountAggregateInputType = {
    id?: true
    practitionerId?: true
    locationId?: true
    startAt?: true
    endAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SlotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Slot to aggregate.
     */
    where?: SlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Slots to fetch.
     */
    orderBy?: SlotOrderByWithRelationInput | SlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Slots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Slots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Slots
    **/
    _count?: true | SlotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SlotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SlotMaxAggregateInputType
  }

  export type GetSlotAggregateType<T extends SlotAggregateArgs> = {
        [P in keyof T & keyof AggregateSlot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSlot[P]>
      : GetScalarType<T[P], AggregateSlot[P]>
  }




  export type SlotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SlotWhereInput
    orderBy?: SlotOrderByWithAggregationInput | SlotOrderByWithAggregationInput[]
    by: SlotScalarFieldEnum[] | SlotScalarFieldEnum
    having?: SlotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SlotCountAggregateInputType | true
    _min?: SlotMinAggregateInputType
    _max?: SlotMaxAggregateInputType
  }

  export type SlotGroupByOutputType = {
    id: string
    practitionerId: string
    locationId: string
    startAt: Date
    endAt: Date
    createdAt: Date
    updatedAt: Date
    _count: SlotCountAggregateOutputType | null
    _min: SlotMinAggregateOutputType | null
    _max: SlotMaxAggregateOutputType | null
  }

  type GetSlotGroupByPayload<T extends SlotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SlotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SlotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SlotGroupByOutputType[P]>
            : GetScalarType<T[P], SlotGroupByOutputType[P]>
        }
      >
    >


  export type SlotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    startAt?: boolean
    endAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
    appointment?: boolean | Slot$appointmentArgs<ExtArgs>
  }, ExtArgs["result"]["slot"]>

  export type SlotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    startAt?: boolean
    endAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["slot"]>

  export type SlotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    startAt?: boolean
    endAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["slot"]>

  export type SlotSelectScalar = {
    id?: boolean
    practitionerId?: boolean
    locationId?: boolean
    startAt?: boolean
    endAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SlotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "practitionerId" | "locationId" | "startAt" | "endAt" | "createdAt" | "updatedAt", ExtArgs["result"]["slot"]>
  export type SlotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
    appointment?: boolean | Slot$appointmentArgs<ExtArgs>
  }
  export type SlotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }
  export type SlotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
  }

  export type $SlotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Slot"
    objects: {
      practitioner: Prisma.$PractitionerPayload<ExtArgs>
      location: Prisma.$LocationPayload<ExtArgs>
      appointment: Prisma.$AppointmentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      practitionerId: string
      locationId: string
      startAt: Date
      endAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["slot"]>
    composites: {}
  }

  type SlotGetPayload<S extends boolean | null | undefined | SlotDefaultArgs> = $Result.GetResult<Prisma.$SlotPayload, S>

  type SlotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SlotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SlotCountAggregateInputType | true
    }

  export interface SlotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Slot'], meta: { name: 'Slot' } }
    /**
     * Find zero or one Slot that matches the filter.
     * @param {SlotFindUniqueArgs} args - Arguments to find a Slot
     * @example
     * // Get one Slot
     * const slot = await prisma.slot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SlotFindUniqueArgs>(args: SelectSubset<T, SlotFindUniqueArgs<ExtArgs>>): Prisma__SlotClient<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Slot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SlotFindUniqueOrThrowArgs} args - Arguments to find a Slot
     * @example
     * // Get one Slot
     * const slot = await prisma.slot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SlotFindUniqueOrThrowArgs>(args: SelectSubset<T, SlotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SlotClient<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Slot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlotFindFirstArgs} args - Arguments to find a Slot
     * @example
     * // Get one Slot
     * const slot = await prisma.slot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SlotFindFirstArgs>(args?: SelectSubset<T, SlotFindFirstArgs<ExtArgs>>): Prisma__SlotClient<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Slot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlotFindFirstOrThrowArgs} args - Arguments to find a Slot
     * @example
     * // Get one Slot
     * const slot = await prisma.slot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SlotFindFirstOrThrowArgs>(args?: SelectSubset<T, SlotFindFirstOrThrowArgs<ExtArgs>>): Prisma__SlotClient<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Slots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Slots
     * const slots = await prisma.slot.findMany()
     * 
     * // Get first 10 Slots
     * const slots = await prisma.slot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const slotWithIdOnly = await prisma.slot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SlotFindManyArgs>(args?: SelectSubset<T, SlotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Slot.
     * @param {SlotCreateArgs} args - Arguments to create a Slot.
     * @example
     * // Create one Slot
     * const Slot = await prisma.slot.create({
     *   data: {
     *     // ... data to create a Slot
     *   }
     * })
     * 
     */
    create<T extends SlotCreateArgs>(args: SelectSubset<T, SlotCreateArgs<ExtArgs>>): Prisma__SlotClient<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Slots.
     * @param {SlotCreateManyArgs} args - Arguments to create many Slots.
     * @example
     * // Create many Slots
     * const slot = await prisma.slot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SlotCreateManyArgs>(args?: SelectSubset<T, SlotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Slots and returns the data saved in the database.
     * @param {SlotCreateManyAndReturnArgs} args - Arguments to create many Slots.
     * @example
     * // Create many Slots
     * const slot = await prisma.slot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Slots and only return the `id`
     * const slotWithIdOnly = await prisma.slot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SlotCreateManyAndReturnArgs>(args?: SelectSubset<T, SlotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Slot.
     * @param {SlotDeleteArgs} args - Arguments to delete one Slot.
     * @example
     * // Delete one Slot
     * const Slot = await prisma.slot.delete({
     *   where: {
     *     // ... filter to delete one Slot
     *   }
     * })
     * 
     */
    delete<T extends SlotDeleteArgs>(args: SelectSubset<T, SlotDeleteArgs<ExtArgs>>): Prisma__SlotClient<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Slot.
     * @param {SlotUpdateArgs} args - Arguments to update one Slot.
     * @example
     * // Update one Slot
     * const slot = await prisma.slot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SlotUpdateArgs>(args: SelectSubset<T, SlotUpdateArgs<ExtArgs>>): Prisma__SlotClient<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Slots.
     * @param {SlotDeleteManyArgs} args - Arguments to filter Slots to delete.
     * @example
     * // Delete a few Slots
     * const { count } = await prisma.slot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SlotDeleteManyArgs>(args?: SelectSubset<T, SlotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Slots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Slots
     * const slot = await prisma.slot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SlotUpdateManyArgs>(args: SelectSubset<T, SlotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Slots and returns the data updated in the database.
     * @param {SlotUpdateManyAndReturnArgs} args - Arguments to update many Slots.
     * @example
     * // Update many Slots
     * const slot = await prisma.slot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Slots and only return the `id`
     * const slotWithIdOnly = await prisma.slot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SlotUpdateManyAndReturnArgs>(args: SelectSubset<T, SlotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Slot.
     * @param {SlotUpsertArgs} args - Arguments to update or create a Slot.
     * @example
     * // Update or create a Slot
     * const slot = await prisma.slot.upsert({
     *   create: {
     *     // ... data to create a Slot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Slot we want to update
     *   }
     * })
     */
    upsert<T extends SlotUpsertArgs>(args: SelectSubset<T, SlotUpsertArgs<ExtArgs>>): Prisma__SlotClient<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Slots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlotCountArgs} args - Arguments to filter Slots to count.
     * @example
     * // Count the number of Slots
     * const count = await prisma.slot.count({
     *   where: {
     *     // ... the filter for the Slots we want to count
     *   }
     * })
    **/
    count<T extends SlotCountArgs>(
      args?: Subset<T, SlotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SlotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Slot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SlotAggregateArgs>(args: Subset<T, SlotAggregateArgs>): Prisma.PrismaPromise<GetSlotAggregateType<T>>

    /**
     * Group by Slot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SlotGroupByArgs} args - Group by arguments.
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
      T extends SlotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SlotGroupByArgs['orderBy'] }
        : { orderBy?: SlotGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SlotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSlotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Slot model
   */
  readonly fields: SlotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Slot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SlotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    practitioner<T extends PractitionerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PractitionerDefaultArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    appointment<T extends Slot$appointmentArgs<ExtArgs> = {}>(args?: Subset<T, Slot$appointmentArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Slot model
   */
  interface SlotFieldRefs {
    readonly id: FieldRef<"Slot", 'String'>
    readonly practitionerId: FieldRef<"Slot", 'String'>
    readonly locationId: FieldRef<"Slot", 'String'>
    readonly startAt: FieldRef<"Slot", 'DateTime'>
    readonly endAt: FieldRef<"Slot", 'DateTime'>
    readonly createdAt: FieldRef<"Slot", 'DateTime'>
    readonly updatedAt: FieldRef<"Slot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Slot findUnique
   */
  export type SlotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    /**
     * Filter, which Slot to fetch.
     */
    where: SlotWhereUniqueInput
  }

  /**
   * Slot findUniqueOrThrow
   */
  export type SlotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    /**
     * Filter, which Slot to fetch.
     */
    where: SlotWhereUniqueInput
  }

  /**
   * Slot findFirst
   */
  export type SlotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    /**
     * Filter, which Slot to fetch.
     */
    where?: SlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Slots to fetch.
     */
    orderBy?: SlotOrderByWithRelationInput | SlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Slots.
     */
    cursor?: SlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Slots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Slots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Slots.
     */
    distinct?: SlotScalarFieldEnum | SlotScalarFieldEnum[]
  }

  /**
   * Slot findFirstOrThrow
   */
  export type SlotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    /**
     * Filter, which Slot to fetch.
     */
    where?: SlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Slots to fetch.
     */
    orderBy?: SlotOrderByWithRelationInput | SlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Slots.
     */
    cursor?: SlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Slots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Slots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Slots.
     */
    distinct?: SlotScalarFieldEnum | SlotScalarFieldEnum[]
  }

  /**
   * Slot findMany
   */
  export type SlotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    /**
     * Filter, which Slots to fetch.
     */
    where?: SlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Slots to fetch.
     */
    orderBy?: SlotOrderByWithRelationInput | SlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Slots.
     */
    cursor?: SlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Slots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Slots.
     */
    skip?: number
    distinct?: SlotScalarFieldEnum | SlotScalarFieldEnum[]
  }

  /**
   * Slot create
   */
  export type SlotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    /**
     * The data needed to create a Slot.
     */
    data: XOR<SlotCreateInput, SlotUncheckedCreateInput>
  }

  /**
   * Slot createMany
   */
  export type SlotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Slots.
     */
    data: SlotCreateManyInput | SlotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Slot createManyAndReturn
   */
  export type SlotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * The data used to create many Slots.
     */
    data: SlotCreateManyInput | SlotCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Slot update
   */
  export type SlotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    /**
     * The data needed to update a Slot.
     */
    data: XOR<SlotUpdateInput, SlotUncheckedUpdateInput>
    /**
     * Choose, which Slot to update.
     */
    where: SlotWhereUniqueInput
  }

  /**
   * Slot updateMany
   */
  export type SlotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Slots.
     */
    data: XOR<SlotUpdateManyMutationInput, SlotUncheckedUpdateManyInput>
    /**
     * Filter which Slots to update
     */
    where?: SlotWhereInput
    /**
     * Limit how many Slots to update.
     */
    limit?: number
  }

  /**
   * Slot updateManyAndReturn
   */
  export type SlotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * The data used to update Slots.
     */
    data: XOR<SlotUpdateManyMutationInput, SlotUncheckedUpdateManyInput>
    /**
     * Filter which Slots to update
     */
    where?: SlotWhereInput
    /**
     * Limit how many Slots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Slot upsert
   */
  export type SlotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    /**
     * The filter to search for the Slot to update in case it exists.
     */
    where: SlotWhereUniqueInput
    /**
     * In case the Slot found by the `where` argument doesn't exist, create a new Slot with this data.
     */
    create: XOR<SlotCreateInput, SlotUncheckedCreateInput>
    /**
     * In case the Slot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SlotUpdateInput, SlotUncheckedUpdateInput>
  }

  /**
   * Slot delete
   */
  export type SlotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
    /**
     * Filter which Slot to delete.
     */
    where: SlotWhereUniqueInput
  }

  /**
   * Slot deleteMany
   */
  export type SlotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Slots to delete
     */
    where?: SlotWhereInput
    /**
     * Limit how many Slots to delete.
     */
    limit?: number
  }

  /**
   * Slot.appointment
   */
  export type Slot$appointmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
  }

  /**
   * Slot without action
   */
  export type SlotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Slot
     */
    select?: SlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Slot
     */
    omit?: SlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SlotInclude<ExtArgs> | null
  }


  /**
   * Model Appointment
   */

  export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  export type AppointmentMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    slotId: string | null
    status: $Enums.AppointmentStatus | null
    reason: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    practitionerId: string | null
  }

  export type AppointmentMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    slotId: string | null
    status: $Enums.AppointmentStatus | null
    reason: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    practitionerId: string | null
  }

  export type AppointmentCountAggregateOutputType = {
    id: number
    patientId: number
    slotId: number
    status: number
    reason: number
    notes: number
    createdAt: number
    updatedAt: number
    practitionerId: number
    _all: number
  }


  export type AppointmentMinAggregateInputType = {
    id?: true
    patientId?: true
    slotId?: true
    status?: true
    reason?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    practitionerId?: true
  }

  export type AppointmentMaxAggregateInputType = {
    id?: true
    patientId?: true
    slotId?: true
    status?: true
    reason?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    practitionerId?: true
  }

  export type AppointmentCountAggregateInputType = {
    id?: true
    patientId?: true
    slotId?: true
    status?: true
    reason?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    practitionerId?: true
    _all?: true
  }

  export type AppointmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointment to aggregate.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appointments
    **/
    _count?: true | AppointmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentMaxAggregateInputType
  }

  export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointment[P]>
      : GetScalarType<T[P], AggregateAppointment[P]>
  }




  export type AppointmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithAggregationInput | AppointmentOrderByWithAggregationInput[]
    by: AppointmentScalarFieldEnum[] | AppointmentScalarFieldEnum
    having?: AppointmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentCountAggregateInputType | true
    _min?: AppointmentMinAggregateInputType
    _max?: AppointmentMaxAggregateInputType
  }

  export type AppointmentGroupByOutputType = {
    id: string
    patientId: string
    slotId: string
    status: $Enums.AppointmentStatus
    reason: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    practitionerId: string
    _count: AppointmentCountAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    slotId?: boolean
    status?: boolean
    reason?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    practitionerId?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    slot?: boolean | SlotDefaultArgs<ExtArgs>
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    slotId?: boolean
    status?: boolean
    reason?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    practitionerId?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    slot?: boolean | SlotDefaultArgs<ExtArgs>
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    slotId?: boolean
    status?: boolean
    reason?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    practitionerId?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    slot?: boolean | SlotDefaultArgs<ExtArgs>
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectScalar = {
    id?: boolean
    patientId?: boolean
    slotId?: boolean
    status?: boolean
    reason?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    practitionerId?: boolean
  }

  export type AppointmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "slotId" | "status" | "reason" | "notes" | "createdAt" | "updatedAt" | "practitionerId", ExtArgs["result"]["appointment"]>
  export type AppointmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    slot?: boolean | SlotDefaultArgs<ExtArgs>
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
  }
  export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    slot?: boolean | SlotDefaultArgs<ExtArgs>
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
  }
  export type AppointmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    slot?: boolean | SlotDefaultArgs<ExtArgs>
    practitioner?: boolean | PractitionerDefaultArgs<ExtArgs>
  }

  export type $AppointmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appointment"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      slot: Prisma.$SlotPayload<ExtArgs>
      practitioner: Prisma.$PractitionerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      slotId: string
      status: $Enums.AppointmentStatus
      reason: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
      practitionerId: string
    }, ExtArgs["result"]["appointment"]>
    composites: {}
  }

  type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = $Result.GetResult<Prisma.$AppointmentPayload, S>

  type AppointmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppointmentCountAggregateInputType | true
    }

  export interface AppointmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appointment'], meta: { name: 'Appointment' } }
    /**
     * Find zero or one Appointment that matches the filter.
     * @param {AppointmentFindUniqueArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentFindUniqueArgs>(args: SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Appointment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppointmentFindUniqueOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentFindFirstArgs>(args?: SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointment.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentWithIdOnly = await prisma.appointment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentFindManyArgs>(args?: SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Appointment.
     * @param {AppointmentCreateArgs} args - Arguments to create a Appointment.
     * @example
     * // Create one Appointment
     * const Appointment = await prisma.appointment.create({
     *   data: {
     *     // ... data to create a Appointment
     *   }
     * })
     * 
     */
    create<T extends AppointmentCreateArgs>(args: SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Appointments.
     * @param {AppointmentCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentCreateManyArgs>(args?: SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {AppointmentCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Appointment.
     * @param {AppointmentDeleteArgs} args - Arguments to delete one Appointment.
     * @example
     * // Delete one Appointment
     * const Appointment = await prisma.appointment.delete({
     *   where: {
     *     // ... filter to delete one Appointment
     *   }
     * })
     * 
     */
    delete<T extends AppointmentDeleteArgs>(args: SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Appointment.
     * @param {AppointmentUpdateArgs} args - Arguments to update one Appointment.
     * @example
     * // Update one Appointment
     * const appointment = await prisma.appointment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentUpdateArgs>(args: SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Appointments.
     * @param {AppointmentDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentUpdateManyArgs>(args: SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments and returns the data updated in the database.
     * @param {AppointmentUpdateManyAndReturnArgs} args - Arguments to update many Appointments.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppointmentUpdateManyAndReturnArgs>(args: SelectSubset<T, AppointmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Appointment.
     * @param {AppointmentUpsertArgs} args - Arguments to update or create a Appointment.
     * @example
     * // Update or create a Appointment
     * const appointment = await prisma.appointment.upsert({
     *   create: {
     *     // ... data to create a Appointment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointment we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentUpsertArgs>(args: SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointment.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends AppointmentCountArgs>(
      args?: Subset<T, AppointmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AppointmentAggregateArgs>(args: Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>

    /**
     * Group by Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentGroupByArgs} args - Group by arguments.
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
      T extends AppointmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appointment model
   */
  readonly fields: AppointmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appointment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    slot<T extends SlotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SlotDefaultArgs<ExtArgs>>): Prisma__SlotClient<$Result.GetResult<Prisma.$SlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    practitioner<T extends PractitionerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PractitionerDefaultArgs<ExtArgs>>): Prisma__PractitionerClient<$Result.GetResult<Prisma.$PractitionerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Appointment model
   */
  interface AppointmentFieldRefs {
    readonly id: FieldRef<"Appointment", 'String'>
    readonly patientId: FieldRef<"Appointment", 'String'>
    readonly slotId: FieldRef<"Appointment", 'String'>
    readonly status: FieldRef<"Appointment", 'AppointmentStatus'>
    readonly reason: FieldRef<"Appointment", 'String'>
    readonly notes: FieldRef<"Appointment", 'String'>
    readonly createdAt: FieldRef<"Appointment", 'DateTime'>
    readonly updatedAt: FieldRef<"Appointment", 'DateTime'>
    readonly practitionerId: FieldRef<"Appointment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Appointment findUnique
   */
  export type AppointmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findUniqueOrThrow
   */
  export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findFirst
   */
  export type AppointmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findFirstOrThrow
   */
  export type AppointmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findMany
   */
  export type AppointmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointments to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment create
   */
  export type AppointmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Appointment.
     */
    data: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
  }

  /**
   * Appointment createMany
   */
  export type AppointmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment createManyAndReturn
   */
  export type AppointmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment update
   */
  export type AppointmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Appointment.
     */
    data: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
    /**
     * Choose, which Appointment to update.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment updateMany
   */
  export type AppointmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
  }

  /**
   * Appointment updateManyAndReturn
   */
  export type AppointmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment upsert
   */
  export type AppointmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Appointment to update in case it exists.
     */
    where: AppointmentWhereUniqueInput
    /**
     * In case the Appointment found by the `where` argument doesn't exist, create a new Appointment with this data.
     */
    create: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
    /**
     * In case the Appointment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
  }

  /**
   * Appointment delete
   */
  export type AppointmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter which Appointment to delete.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment deleteMany
   */
  export type AppointmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointments to delete
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to delete.
     */
    limit?: number
  }

  /**
   * Appointment without action
   */
  export type AppointmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    role: 'role',
    nhsNumber: 'nhsNumber',
    dateOfBirth: 'dateOfBirth',
    phone: 'phone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    resetToken: 'resetToken',
    resetTokenExpiresAt: 'resetTokenExpiresAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PatientScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    nhsNumber: 'nhsNumber',
    dateOfBirth: 'dateOfBirth',
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    postcode: 'postcode',
    gpSurgeryName: 'gpSurgeryName',
    gpSurgeryCode: 'gpSurgeryCode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    locationId: 'locationId'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const PractitionerScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    gmcNumber: 'gmcNumber',
    speciality: 'speciality',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PractitionerScalarFieldEnum = (typeof PractitionerScalarFieldEnum)[keyof typeof PractitionerScalarFieldEnum]


  export const LocationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    address: 'address',
    postcode: 'postcode',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum]


  export const PractitionerLocationScalarFieldEnum: {
    id: 'id',
    practitionerId: 'practitionerId',
    locationId: 'locationId',
    createdAt: 'createdAt'
  };

  export type PractitionerLocationScalarFieldEnum = (typeof PractitionerLocationScalarFieldEnum)[keyof typeof PractitionerLocationScalarFieldEnum]


  export const PractitionerAvailabilityWindowScalarFieldEnum: {
    id: 'id',
    practitionerId: 'practitionerId',
    locationId: 'locationId',
    dayOfWeek: 'dayOfWeek',
    windowStartMin: 'windowStartMin',
    windowEndMin: 'windowEndMin',
    slotDurationMin: 'slotDurationMin'
  };

  export type PractitionerAvailabilityWindowScalarFieldEnum = (typeof PractitionerAvailabilityWindowScalarFieldEnum)[keyof typeof PractitionerAvailabilityWindowScalarFieldEnum]


  export const SlotScalarFieldEnum: {
    id: 'id',
    practitionerId: 'practitionerId',
    locationId: 'locationId',
    startAt: 'startAt',
    endAt: 'endAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SlotScalarFieldEnum = (typeof SlotScalarFieldEnum)[keyof typeof SlotScalarFieldEnum]


  export const AppointmentScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    slotId: 'slotId',
    status: 'status',
    reason: 'reason',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    practitionerId: 'practitionerId'
  };

  export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'AppointmentStatus'
   */
  export type EnumAppointmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentStatus'>
    


  /**
   * Reference to a field of type 'AppointmentStatus[]'
   */
  export type ListEnumAppointmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    nhsNumber?: StringNullableFilter<"User"> | string | null
    dateOfBirth?: DateTimeNullableFilter<"User"> | Date | string | null
    phone?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    resetToken?: StringNullableFilter<"User"> | string | null
    resetTokenExpiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    patient?: XOR<PatientNullableScalarRelationFilter, PatientWhereInput> | null
    practitioner?: XOR<PractitionerNullableScalarRelationFilter, PractitionerWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    nhsNumber?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpiresAt?: SortOrderInput | SortOrder
    patient?: PatientOrderByWithRelationInput
    practitioner?: PractitionerOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    nhsNumber?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    dateOfBirth?: DateTimeNullableFilter<"User"> | Date | string | null
    phone?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    resetToken?: StringNullableFilter<"User"> | string | null
    resetTokenExpiresAt?: DateTimeNullableFilter<"User"> | Date | string | null
    patient?: XOR<PatientNullableScalarRelationFilter, PatientWhereInput> | null
    practitioner?: XOR<PractitionerNullableScalarRelationFilter, PractitionerWhereInput> | null
  }, "id" | "email" | "nhsNumber">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    nhsNumber?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpiresAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    nhsNumber?: StringNullableWithAggregatesFilter<"User"> | string | null
    dateOfBirth?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    resetToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    resetTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type PatientWhereInput = {
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    id?: StringFilter<"Patient"> | string
    userId?: StringFilter<"Patient"> | string
    nhsNumber?: StringFilter<"Patient"> | string
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    addressLine1?: StringNullableFilter<"Patient"> | string | null
    addressLine2?: StringNullableFilter<"Patient"> | string | null
    postcode?: StringNullableFilter<"Patient"> | string | null
    gpSurgeryName?: StringNullableFilter<"Patient"> | string | null
    gpSurgeryCode?: StringNullableFilter<"Patient"> | string | null
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    locationId?: StringNullableFilter<"Patient"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    appointments?: AppointmentListRelationFilter
    location?: XOR<LocationNullableScalarRelationFilter, LocationWhereInput> | null
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    nhsNumber?: SortOrder
    dateOfBirth?: SortOrder
    addressLine1?: SortOrderInput | SortOrder
    addressLine2?: SortOrderInput | SortOrder
    postcode?: SortOrderInput | SortOrder
    gpSurgeryName?: SortOrderInput | SortOrder
    gpSurgeryCode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    locationId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    appointments?: AppointmentOrderByRelationAggregateInput
    location?: LocationOrderByWithRelationInput
  }

  export type PatientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    nhsNumber?: string
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    addressLine1?: StringNullableFilter<"Patient"> | string | null
    addressLine2?: StringNullableFilter<"Patient"> | string | null
    postcode?: StringNullableFilter<"Patient"> | string | null
    gpSurgeryName?: StringNullableFilter<"Patient"> | string | null
    gpSurgeryCode?: StringNullableFilter<"Patient"> | string | null
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    locationId?: StringNullableFilter<"Patient"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    appointments?: AppointmentListRelationFilter
    location?: XOR<LocationNullableScalarRelationFilter, LocationWhereInput> | null
  }, "id" | "userId" | "nhsNumber">

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    nhsNumber?: SortOrder
    dateOfBirth?: SortOrder
    addressLine1?: SortOrderInput | SortOrder
    addressLine2?: SortOrderInput | SortOrder
    postcode?: SortOrderInput | SortOrder
    gpSurgeryName?: SortOrderInput | SortOrder
    gpSurgeryCode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    locationId?: SortOrderInput | SortOrder
    _count?: PatientCountOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    OR?: PatientScalarWhereWithAggregatesInput[]
    NOT?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Patient"> | string
    userId?: StringWithAggregatesFilter<"Patient"> | string
    nhsNumber?: StringWithAggregatesFilter<"Patient"> | string
    dateOfBirth?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    addressLine1?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    addressLine2?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    postcode?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    gpSurgeryName?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    gpSurgeryCode?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    locationId?: StringNullableWithAggregatesFilter<"Patient"> | string | null
  }

  export type PractitionerWhereInput = {
    AND?: PractitionerWhereInput | PractitionerWhereInput[]
    OR?: PractitionerWhereInput[]
    NOT?: PractitionerWhereInput | PractitionerWhereInput[]
    id?: StringFilter<"Practitioner"> | string
    userId?: StringFilter<"Practitioner"> | string
    title?: StringNullableFilter<"Practitioner"> | string | null
    gmcNumber?: StringNullableFilter<"Practitioner"> | string | null
    speciality?: StringNullableFilter<"Practitioner"> | string | null
    createdAt?: DateTimeFilter<"Practitioner"> | Date | string
    updatedAt?: DateTimeFilter<"Practitioner"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    slots?: SlotListRelationFilter
    appointments?: AppointmentListRelationFilter
    availabilityWindows?: PractitionerAvailabilityWindowListRelationFilter
    practitionerLocations?: PractitionerLocationListRelationFilter
  }

  export type PractitionerOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrderInput | SortOrder
    gmcNumber?: SortOrderInput | SortOrder
    speciality?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    slots?: SlotOrderByRelationAggregateInput
    appointments?: AppointmentOrderByRelationAggregateInput
    availabilityWindows?: PractitionerAvailabilityWindowOrderByRelationAggregateInput
    practitionerLocations?: PractitionerLocationOrderByRelationAggregateInput
  }

  export type PractitionerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    gmcNumber?: string
    AND?: PractitionerWhereInput | PractitionerWhereInput[]
    OR?: PractitionerWhereInput[]
    NOT?: PractitionerWhereInput | PractitionerWhereInput[]
    title?: StringNullableFilter<"Practitioner"> | string | null
    speciality?: StringNullableFilter<"Practitioner"> | string | null
    createdAt?: DateTimeFilter<"Practitioner"> | Date | string
    updatedAt?: DateTimeFilter<"Practitioner"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    slots?: SlotListRelationFilter
    appointments?: AppointmentListRelationFilter
    availabilityWindows?: PractitionerAvailabilityWindowListRelationFilter
    practitionerLocations?: PractitionerLocationListRelationFilter
  }, "id" | "userId" | "gmcNumber">

  export type PractitionerOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrderInput | SortOrder
    gmcNumber?: SortOrderInput | SortOrder
    speciality?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PractitionerCountOrderByAggregateInput
    _max?: PractitionerMaxOrderByAggregateInput
    _min?: PractitionerMinOrderByAggregateInput
  }

  export type PractitionerScalarWhereWithAggregatesInput = {
    AND?: PractitionerScalarWhereWithAggregatesInput | PractitionerScalarWhereWithAggregatesInput[]
    OR?: PractitionerScalarWhereWithAggregatesInput[]
    NOT?: PractitionerScalarWhereWithAggregatesInput | PractitionerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Practitioner"> | string
    userId?: StringWithAggregatesFilter<"Practitioner"> | string
    title?: StringNullableWithAggregatesFilter<"Practitioner"> | string | null
    gmcNumber?: StringNullableWithAggregatesFilter<"Practitioner"> | string | null
    speciality?: StringNullableWithAggregatesFilter<"Practitioner"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Practitioner"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Practitioner"> | Date | string
  }

  export type LocationWhereInput = {
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    id?: StringFilter<"Location"> | string
    name?: StringFilter<"Location"> | string
    address?: StringNullableFilter<"Location"> | string | null
    postcode?: StringNullableFilter<"Location"> | string | null
    createdAt?: DateTimeFilter<"Location"> | Date | string
    updatedAt?: DateTimeFilter<"Location"> | Date | string
    slots?: SlotListRelationFilter
    patients?: PatientListRelationFilter
    availabilityWindows?: PractitionerAvailabilityWindowListRelationFilter
    practitionerLocations?: PractitionerLocationListRelationFilter
  }

  export type LocationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrderInput | SortOrder
    postcode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    slots?: SlotOrderByRelationAggregateInput
    patients?: PatientOrderByRelationAggregateInput
    availabilityWindows?: PractitionerAvailabilityWindowOrderByRelationAggregateInput
    practitionerLocations?: PractitionerLocationOrderByRelationAggregateInput
  }

  export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    name?: StringFilter<"Location"> | string
    address?: StringNullableFilter<"Location"> | string | null
    postcode?: StringNullableFilter<"Location"> | string | null
    createdAt?: DateTimeFilter<"Location"> | Date | string
    updatedAt?: DateTimeFilter<"Location"> | Date | string
    slots?: SlotListRelationFilter
    patients?: PatientListRelationFilter
    availabilityWindows?: PractitionerAvailabilityWindowListRelationFilter
    practitionerLocations?: PractitionerLocationListRelationFilter
  }, "id">

  export type LocationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrderInput | SortOrder
    postcode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LocationCountOrderByAggregateInput
    _max?: LocationMaxOrderByAggregateInput
    _min?: LocationMinOrderByAggregateInput
  }

  export type LocationScalarWhereWithAggregatesInput = {
    AND?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    OR?: LocationScalarWhereWithAggregatesInput[]
    NOT?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Location"> | string
    name?: StringWithAggregatesFilter<"Location"> | string
    address?: StringNullableWithAggregatesFilter<"Location"> | string | null
    postcode?: StringNullableWithAggregatesFilter<"Location"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Location"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Location"> | Date | string
  }

  export type PractitionerLocationWhereInput = {
    AND?: PractitionerLocationWhereInput | PractitionerLocationWhereInput[]
    OR?: PractitionerLocationWhereInput[]
    NOT?: PractitionerLocationWhereInput | PractitionerLocationWhereInput[]
    id?: StringFilter<"PractitionerLocation"> | string
    practitionerId?: StringFilter<"PractitionerLocation"> | string
    locationId?: StringFilter<"PractitionerLocation"> | string
    createdAt?: DateTimeFilter<"PractitionerLocation"> | Date | string
    practitioner?: XOR<PractitionerScalarRelationFilter, PractitionerWhereInput>
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }

  export type PractitionerLocationOrderByWithRelationInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    createdAt?: SortOrder
    practitioner?: PractitionerOrderByWithRelationInput
    location?: LocationOrderByWithRelationInput
  }

  export type PractitionerLocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    practitionerId_locationId?: PractitionerLocationPractitionerIdLocationIdCompoundUniqueInput
    AND?: PractitionerLocationWhereInput | PractitionerLocationWhereInput[]
    OR?: PractitionerLocationWhereInput[]
    NOT?: PractitionerLocationWhereInput | PractitionerLocationWhereInput[]
    practitionerId?: StringFilter<"PractitionerLocation"> | string
    locationId?: StringFilter<"PractitionerLocation"> | string
    createdAt?: DateTimeFilter<"PractitionerLocation"> | Date | string
    practitioner?: XOR<PractitionerScalarRelationFilter, PractitionerWhereInput>
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }, "id" | "practitionerId_locationId">

  export type PractitionerLocationOrderByWithAggregationInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    createdAt?: SortOrder
    _count?: PractitionerLocationCountOrderByAggregateInput
    _max?: PractitionerLocationMaxOrderByAggregateInput
    _min?: PractitionerLocationMinOrderByAggregateInput
  }

  export type PractitionerLocationScalarWhereWithAggregatesInput = {
    AND?: PractitionerLocationScalarWhereWithAggregatesInput | PractitionerLocationScalarWhereWithAggregatesInput[]
    OR?: PractitionerLocationScalarWhereWithAggregatesInput[]
    NOT?: PractitionerLocationScalarWhereWithAggregatesInput | PractitionerLocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PractitionerLocation"> | string
    practitionerId?: StringWithAggregatesFilter<"PractitionerLocation"> | string
    locationId?: StringWithAggregatesFilter<"PractitionerLocation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PractitionerLocation"> | Date | string
  }

  export type PractitionerAvailabilityWindowWhereInput = {
    AND?: PractitionerAvailabilityWindowWhereInput | PractitionerAvailabilityWindowWhereInput[]
    OR?: PractitionerAvailabilityWindowWhereInput[]
    NOT?: PractitionerAvailabilityWindowWhereInput | PractitionerAvailabilityWindowWhereInput[]
    id?: StringFilter<"PractitionerAvailabilityWindow"> | string
    practitionerId?: StringFilter<"PractitionerAvailabilityWindow"> | string
    locationId?: StringFilter<"PractitionerAvailabilityWindow"> | string
    dayOfWeek?: IntFilter<"PractitionerAvailabilityWindow"> | number
    windowStartMin?: IntFilter<"PractitionerAvailabilityWindow"> | number
    windowEndMin?: IntFilter<"PractitionerAvailabilityWindow"> | number
    slotDurationMin?: IntFilter<"PractitionerAvailabilityWindow"> | number
    practitioner?: XOR<PractitionerScalarRelationFilter, PractitionerWhereInput>
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }

  export type PractitionerAvailabilityWindowOrderByWithRelationInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    dayOfWeek?: SortOrder
    windowStartMin?: SortOrder
    windowEndMin?: SortOrder
    slotDurationMin?: SortOrder
    practitioner?: PractitionerOrderByWithRelationInput
    location?: LocationOrderByWithRelationInput
  }

  export type PractitionerAvailabilityWindowWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PractitionerAvailabilityWindowWhereInput | PractitionerAvailabilityWindowWhereInput[]
    OR?: PractitionerAvailabilityWindowWhereInput[]
    NOT?: PractitionerAvailabilityWindowWhereInput | PractitionerAvailabilityWindowWhereInput[]
    practitionerId?: StringFilter<"PractitionerAvailabilityWindow"> | string
    locationId?: StringFilter<"PractitionerAvailabilityWindow"> | string
    dayOfWeek?: IntFilter<"PractitionerAvailabilityWindow"> | number
    windowStartMin?: IntFilter<"PractitionerAvailabilityWindow"> | number
    windowEndMin?: IntFilter<"PractitionerAvailabilityWindow"> | number
    slotDurationMin?: IntFilter<"PractitionerAvailabilityWindow"> | number
    practitioner?: XOR<PractitionerScalarRelationFilter, PractitionerWhereInput>
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
  }, "id">

  export type PractitionerAvailabilityWindowOrderByWithAggregationInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    dayOfWeek?: SortOrder
    windowStartMin?: SortOrder
    windowEndMin?: SortOrder
    slotDurationMin?: SortOrder
    _count?: PractitionerAvailabilityWindowCountOrderByAggregateInput
    _avg?: PractitionerAvailabilityWindowAvgOrderByAggregateInput
    _max?: PractitionerAvailabilityWindowMaxOrderByAggregateInput
    _min?: PractitionerAvailabilityWindowMinOrderByAggregateInput
    _sum?: PractitionerAvailabilityWindowSumOrderByAggregateInput
  }

  export type PractitionerAvailabilityWindowScalarWhereWithAggregatesInput = {
    AND?: PractitionerAvailabilityWindowScalarWhereWithAggregatesInput | PractitionerAvailabilityWindowScalarWhereWithAggregatesInput[]
    OR?: PractitionerAvailabilityWindowScalarWhereWithAggregatesInput[]
    NOT?: PractitionerAvailabilityWindowScalarWhereWithAggregatesInput | PractitionerAvailabilityWindowScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PractitionerAvailabilityWindow"> | string
    practitionerId?: StringWithAggregatesFilter<"PractitionerAvailabilityWindow"> | string
    locationId?: StringWithAggregatesFilter<"PractitionerAvailabilityWindow"> | string
    dayOfWeek?: IntWithAggregatesFilter<"PractitionerAvailabilityWindow"> | number
    windowStartMin?: IntWithAggregatesFilter<"PractitionerAvailabilityWindow"> | number
    windowEndMin?: IntWithAggregatesFilter<"PractitionerAvailabilityWindow"> | number
    slotDurationMin?: IntWithAggregatesFilter<"PractitionerAvailabilityWindow"> | number
  }

  export type SlotWhereInput = {
    AND?: SlotWhereInput | SlotWhereInput[]
    OR?: SlotWhereInput[]
    NOT?: SlotWhereInput | SlotWhereInput[]
    id?: StringFilter<"Slot"> | string
    practitionerId?: StringFilter<"Slot"> | string
    locationId?: StringFilter<"Slot"> | string
    startAt?: DateTimeFilter<"Slot"> | Date | string
    endAt?: DateTimeFilter<"Slot"> | Date | string
    createdAt?: DateTimeFilter<"Slot"> | Date | string
    updatedAt?: DateTimeFilter<"Slot"> | Date | string
    practitioner?: XOR<PractitionerScalarRelationFilter, PractitionerWhereInput>
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    appointment?: XOR<AppointmentNullableScalarRelationFilter, AppointmentWhereInput> | null
  }

  export type SlotOrderByWithRelationInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    practitioner?: PractitionerOrderByWithRelationInput
    location?: LocationOrderByWithRelationInput
    appointment?: AppointmentOrderByWithRelationInput
  }

  export type SlotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    practitionerId_locationId_startAt_endAt?: SlotPractitionerIdLocationIdStartAtEndAtCompoundUniqueInput
    AND?: SlotWhereInput | SlotWhereInput[]
    OR?: SlotWhereInput[]
    NOT?: SlotWhereInput | SlotWhereInput[]
    practitionerId?: StringFilter<"Slot"> | string
    locationId?: StringFilter<"Slot"> | string
    startAt?: DateTimeFilter<"Slot"> | Date | string
    endAt?: DateTimeFilter<"Slot"> | Date | string
    createdAt?: DateTimeFilter<"Slot"> | Date | string
    updatedAt?: DateTimeFilter<"Slot"> | Date | string
    practitioner?: XOR<PractitionerScalarRelationFilter, PractitionerWhereInput>
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    appointment?: XOR<AppointmentNullableScalarRelationFilter, AppointmentWhereInput> | null
  }, "id" | "practitionerId_locationId_startAt_endAt">

  export type SlotOrderByWithAggregationInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SlotCountOrderByAggregateInput
    _max?: SlotMaxOrderByAggregateInput
    _min?: SlotMinOrderByAggregateInput
  }

  export type SlotScalarWhereWithAggregatesInput = {
    AND?: SlotScalarWhereWithAggregatesInput | SlotScalarWhereWithAggregatesInput[]
    OR?: SlotScalarWhereWithAggregatesInput[]
    NOT?: SlotScalarWhereWithAggregatesInput | SlotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Slot"> | string
    practitionerId?: StringWithAggregatesFilter<"Slot"> | string
    locationId?: StringWithAggregatesFilter<"Slot"> | string
    startAt?: DateTimeWithAggregatesFilter<"Slot"> | Date | string
    endAt?: DateTimeWithAggregatesFilter<"Slot"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Slot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Slot"> | Date | string
  }

  export type AppointmentWhereInput = {
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    id?: StringFilter<"Appointment"> | string
    patientId?: StringFilter<"Appointment"> | string
    slotId?: StringFilter<"Appointment"> | string
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    reason?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    practitionerId?: StringFilter<"Appointment"> | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    slot?: XOR<SlotScalarRelationFilter, SlotWhereInput>
    practitioner?: XOR<PractitionerScalarRelationFilter, PractitionerWhereInput>
  }

  export type AppointmentOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    slotId?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    practitionerId?: SortOrder
    patient?: PatientOrderByWithRelationInput
    slot?: SlotOrderByWithRelationInput
    practitioner?: PractitionerOrderByWithRelationInput
  }

  export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slotId?: string
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    patientId?: StringFilter<"Appointment"> | string
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    reason?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    practitionerId?: StringFilter<"Appointment"> | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    slot?: XOR<SlotScalarRelationFilter, SlotWhereInput>
    practitioner?: XOR<PractitionerScalarRelationFilter, PractitionerWhereInput>
  }, "id" | "slotId">

  export type AppointmentOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    slotId?: SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    practitionerId?: SortOrder
    _count?: AppointmentCountOrderByAggregateInput
    _max?: AppointmentMaxOrderByAggregateInput
    _min?: AppointmentMinOrderByAggregateInput
  }

  export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    OR?: AppointmentScalarWhereWithAggregatesInput[]
    NOT?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Appointment"> | string
    patientId?: StringWithAggregatesFilter<"Appointment"> | string
    slotId?: StringWithAggregatesFilter<"Appointment"> | string
    status?: EnumAppointmentStatusWithAggregatesFilter<"Appointment"> | $Enums.AppointmentStatus
    reason?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    practitionerId?: StringWithAggregatesFilter<"Appointment"> | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    nhsNumber?: string | null
    dateOfBirth?: Date | string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiresAt?: Date | string | null
    patient?: PatientCreateNestedOneWithoutUserInput
    practitioner?: PractitionerCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    nhsNumber?: string | null
    dateOfBirth?: Date | string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiresAt?: Date | string | null
    patient?: PatientUncheckedCreateNestedOneWithoutUserInput
    practitioner?: PractitionerUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    nhsNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patient?: PatientUpdateOneWithoutUserNestedInput
    practitioner?: PractitionerUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    nhsNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patient?: PatientUncheckedUpdateOneWithoutUserNestedInput
    practitioner?: PractitionerUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    nhsNumber?: string | null
    dateOfBirth?: Date | string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiresAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    nhsNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    nhsNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PatientCreateInput = {
    id?: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    location?: LocationCreateNestedOneWithoutPatientsInput
  }

  export type PatientUncheckedCreateInput = {
    id?: string
    userId: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationId?: string | null
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    location?: LocationUpdateOneWithoutPatientsNestedInput
  }

  export type PatientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateManyInput = {
    id?: string
    userId: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationId?: string | null
  }

  export type PatientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PractitionerCreateInput = {
    id?: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPractitionerInput
    slots?: SlotCreateNestedManyWithoutPractitionerInput
    appointments?: AppointmentCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerUncheckedCreateInput = {
    id?: string
    userId: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotUncheckedCreateNestedManyWithoutPractitionerInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationUncheckedCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPractitionerNestedInput
    slots?: SlotUpdateManyWithoutPractitionerNestedInput
    appointments?: AppointmentUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUpdateManyWithoutPractitionerNestedInput
  }

  export type PractitionerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUncheckedUpdateManyWithoutPractitionerNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUncheckedUpdateManyWithoutPractitionerNestedInput
  }

  export type PractitionerCreateManyInput = {
    id?: string
    userId: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PractitionerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationCreateInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotCreateNestedManyWithoutLocationInput
    patients?: PatientCreateNestedManyWithoutLocationInput
    availabilityWindows?: PractitionerAvailabilityWindowCreateNestedManyWithoutLocationInput
    practitionerLocations?: PractitionerLocationCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotUncheckedCreateNestedManyWithoutLocationInput
    patients?: PatientUncheckedCreateNestedManyWithoutLocationInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutLocationInput
    practitionerLocations?: PractitionerLocationUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUpdateManyWithoutLocationNestedInput
    patients?: PatientUpdateManyWithoutLocationNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUpdateManyWithoutLocationNestedInput
    practitionerLocations?: PractitionerLocationUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUncheckedUpdateManyWithoutLocationNestedInput
    patients?: PatientUncheckedUpdateManyWithoutLocationNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedUpdateManyWithoutLocationNestedInput
    practitionerLocations?: PractitionerLocationUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type LocationCreateManyInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerLocationCreateInput = {
    id?: string
    createdAt?: Date | string
    practitioner: PractitionerCreateNestedOneWithoutPractitionerLocationsInput
    location: LocationCreateNestedOneWithoutPractitionerLocationsInput
  }

  export type PractitionerLocationUncheckedCreateInput = {
    id?: string
    practitionerId: string
    locationId: string
    createdAt?: Date | string
  }

  export type PractitionerLocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitioner?: PractitionerUpdateOneRequiredWithoutPractitionerLocationsNestedInput
    location?: LocationUpdateOneRequiredWithoutPractitionerLocationsNestedInput
  }

  export type PractitionerLocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerLocationCreateManyInput = {
    id?: string
    practitionerId: string
    locationId: string
    createdAt?: Date | string
  }

  export type PractitionerLocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerLocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerAvailabilityWindowCreateInput = {
    id?: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin?: number
    practitioner: PractitionerCreateNestedOneWithoutAvailabilityWindowsInput
    location: LocationCreateNestedOneWithoutAvailabilityWindowsInput
  }

  export type PractitionerAvailabilityWindowUncheckedCreateInput = {
    id?: string
    practitionerId: string
    locationId: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin?: number
  }

  export type PractitionerAvailabilityWindowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
    practitioner?: PractitionerUpdateOneRequiredWithoutAvailabilityWindowsNestedInput
    location?: LocationUpdateOneRequiredWithoutAvailabilityWindowsNestedInput
  }

  export type PractitionerAvailabilityWindowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type PractitionerAvailabilityWindowCreateManyInput = {
    id?: string
    practitionerId: string
    locationId: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin?: number
  }

  export type PractitionerAvailabilityWindowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type PractitionerAvailabilityWindowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type SlotCreateInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    practitioner: PractitionerCreateNestedOneWithoutSlotsInput
    location: LocationCreateNestedOneWithoutSlotsInput
    appointment?: AppointmentCreateNestedOneWithoutSlotInput
  }

  export type SlotUncheckedCreateInput = {
    id?: string
    practitionerId: string
    locationId: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointment?: AppointmentUncheckedCreateNestedOneWithoutSlotInput
  }

  export type SlotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitioner?: PractitionerUpdateOneRequiredWithoutSlotsNestedInput
    location?: LocationUpdateOneRequiredWithoutSlotsNestedInput
    appointment?: AppointmentUpdateOneWithoutSlotNestedInput
  }

  export type SlotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUncheckedUpdateOneWithoutSlotNestedInput
  }

  export type SlotCreateManyInput = {
    id?: string
    practitionerId: string
    locationId: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SlotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SlotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateInput = {
    id?: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutAppointmentsInput
    slot: SlotCreateNestedOneWithoutAppointmentInput
    practitioner: PractitionerCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateInput = {
    id?: string
    patientId: string
    slotId: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    practitionerId: string
  }

  export type AppointmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutAppointmentsNestedInput
    slot?: SlotUpdateOneRequiredWithoutAppointmentNestedInput
    practitioner?: PractitionerUpdateOneRequiredWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    slotId?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitionerId?: StringFieldUpdateOperationsInput | string
  }

  export type AppointmentCreateManyInput = {
    id?: string
    patientId: string
    slotId: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    practitionerId: string
  }

  export type AppointmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    slotId?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitionerId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PatientNullableScalarRelationFilter = {
    is?: PatientWhereInput | null
    isNot?: PatientWhereInput | null
  }

  export type PractitionerNullableScalarRelationFilter = {
    is?: PractitionerWhereInput | null
    isNot?: PractitionerWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    nhsNumber?: SortOrder
    dateOfBirth?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiresAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    nhsNumber?: SortOrder
    dateOfBirth?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiresAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    nhsNumber?: SortOrder
    dateOfBirth?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiresAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AppointmentListRelationFilter = {
    every?: AppointmentWhereInput
    some?: AppointmentWhereInput
    none?: AppointmentWhereInput
  }

  export type LocationNullableScalarRelationFilter = {
    is?: LocationWhereInput | null
    isNot?: LocationWhereInput | null
  }

  export type AppointmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nhsNumber?: SortOrder
    dateOfBirth?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    postcode?: SortOrder
    gpSurgeryName?: SortOrder
    gpSurgeryCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    locationId?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nhsNumber?: SortOrder
    dateOfBirth?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    postcode?: SortOrder
    gpSurgeryName?: SortOrder
    gpSurgeryCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    locationId?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nhsNumber?: SortOrder
    dateOfBirth?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    postcode?: SortOrder
    gpSurgeryName?: SortOrder
    gpSurgeryCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    locationId?: SortOrder
  }

  export type SlotListRelationFilter = {
    every?: SlotWhereInput
    some?: SlotWhereInput
    none?: SlotWhereInput
  }

  export type PractitionerAvailabilityWindowListRelationFilter = {
    every?: PractitionerAvailabilityWindowWhereInput
    some?: PractitionerAvailabilityWindowWhereInput
    none?: PractitionerAvailabilityWindowWhereInput
  }

  export type PractitionerLocationListRelationFilter = {
    every?: PractitionerLocationWhereInput
    some?: PractitionerLocationWhereInput
    none?: PractitionerLocationWhereInput
  }

  export type SlotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PractitionerAvailabilityWindowOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PractitionerLocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PractitionerCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    gmcNumber?: SortOrder
    speciality?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PractitionerMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    gmcNumber?: SortOrder
    speciality?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PractitionerMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    gmcNumber?: SortOrder
    speciality?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientListRelationFilter = {
    every?: PatientWhereInput
    some?: PatientWhereInput
    none?: PatientWhereInput
  }

  export type PatientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LocationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    postcode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    postcode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LocationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    postcode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PractitionerScalarRelationFilter = {
    is?: PractitionerWhereInput
    isNot?: PractitionerWhereInput
  }

  export type LocationScalarRelationFilter = {
    is?: LocationWhereInput
    isNot?: LocationWhereInput
  }

  export type PractitionerLocationPractitionerIdLocationIdCompoundUniqueInput = {
    practitionerId: string
    locationId: string
  }

  export type PractitionerLocationCountOrderByAggregateInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    createdAt?: SortOrder
  }

  export type PractitionerLocationMaxOrderByAggregateInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    createdAt?: SortOrder
  }

  export type PractitionerLocationMinOrderByAggregateInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type PractitionerAvailabilityWindowCountOrderByAggregateInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    dayOfWeek?: SortOrder
    windowStartMin?: SortOrder
    windowEndMin?: SortOrder
    slotDurationMin?: SortOrder
  }

  export type PractitionerAvailabilityWindowAvgOrderByAggregateInput = {
    dayOfWeek?: SortOrder
    windowStartMin?: SortOrder
    windowEndMin?: SortOrder
    slotDurationMin?: SortOrder
  }

  export type PractitionerAvailabilityWindowMaxOrderByAggregateInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    dayOfWeek?: SortOrder
    windowStartMin?: SortOrder
    windowEndMin?: SortOrder
    slotDurationMin?: SortOrder
  }

  export type PractitionerAvailabilityWindowMinOrderByAggregateInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    dayOfWeek?: SortOrder
    windowStartMin?: SortOrder
    windowEndMin?: SortOrder
    slotDurationMin?: SortOrder
  }

  export type PractitionerAvailabilityWindowSumOrderByAggregateInput = {
    dayOfWeek?: SortOrder
    windowStartMin?: SortOrder
    windowEndMin?: SortOrder
    slotDurationMin?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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

  export type AppointmentNullableScalarRelationFilter = {
    is?: AppointmentWhereInput | null
    isNot?: AppointmentWhereInput | null
  }

  export type SlotPractitionerIdLocationIdStartAtEndAtCompoundUniqueInput = {
    practitionerId: string
    locationId: string
    startAt: Date | string
    endAt: Date | string
  }

  export type SlotCountOrderByAggregateInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SlotMaxOrderByAggregateInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SlotMinOrderByAggregateInput = {
    id?: SortOrder
    practitionerId?: SortOrder
    locationId?: SortOrder
    startAt?: SortOrder
    endAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus
  }

  export type PatientScalarRelationFilter = {
    is?: PatientWhereInput
    isNot?: PatientWhereInput
  }

  export type SlotScalarRelationFilter = {
    is?: SlotWhereInput
    isNot?: SlotWhereInput
  }

  export type AppointmentCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    slotId?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    practitionerId?: SortOrder
  }

  export type AppointmentMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    slotId?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    practitionerId?: SortOrder
  }

  export type AppointmentMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    slotId?: SortOrder
    status?: SortOrder
    reason?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    practitionerId?: SortOrder
  }

  export type EnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAppointmentStatusFilter<$PrismaModel>
  }

  export type PatientCreateNestedOneWithoutUserInput = {
    create?: XOR<PatientCreateWithoutUserInput, PatientUncheckedCreateWithoutUserInput>
    connectOrCreate?: PatientCreateOrConnectWithoutUserInput
    connect?: PatientWhereUniqueInput
  }

  export type PractitionerCreateNestedOneWithoutUserInput = {
    create?: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutUserInput
    connect?: PractitionerWhereUniqueInput
  }

  export type PatientUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<PatientCreateWithoutUserInput, PatientUncheckedCreateWithoutUserInput>
    connectOrCreate?: PatientCreateOrConnectWithoutUserInput
    connect?: PatientWhereUniqueInput
  }

  export type PractitionerUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutUserInput
    connect?: PractitionerWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PatientUpdateOneWithoutUserNestedInput = {
    create?: XOR<PatientCreateWithoutUserInput, PatientUncheckedCreateWithoutUserInput>
    connectOrCreate?: PatientCreateOrConnectWithoutUserInput
    upsert?: PatientUpsertWithoutUserInput
    disconnect?: PatientWhereInput | boolean
    delete?: PatientWhereInput | boolean
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutUserInput, PatientUpdateWithoutUserInput>, PatientUncheckedUpdateWithoutUserInput>
  }

  export type PractitionerUpdateOneWithoutUserNestedInput = {
    create?: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutUserInput
    upsert?: PractitionerUpsertWithoutUserInput
    disconnect?: PractitionerWhereInput | boolean
    delete?: PractitionerWhereInput | boolean
    connect?: PractitionerWhereUniqueInput
    update?: XOR<XOR<PractitionerUpdateToOneWithWhereWithoutUserInput, PractitionerUpdateWithoutUserInput>, PractitionerUncheckedUpdateWithoutUserInput>
  }

  export type PatientUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<PatientCreateWithoutUserInput, PatientUncheckedCreateWithoutUserInput>
    connectOrCreate?: PatientCreateOrConnectWithoutUserInput
    upsert?: PatientUpsertWithoutUserInput
    disconnect?: PatientWhereInput | boolean
    delete?: PatientWhereInput | boolean
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutUserInput, PatientUpdateWithoutUserInput>, PatientUncheckedUpdateWithoutUserInput>
  }

  export type PractitionerUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutUserInput
    upsert?: PractitionerUpsertWithoutUserInput
    disconnect?: PractitionerWhereInput | boolean
    delete?: PractitionerWhereInput | boolean
    connect?: PractitionerWhereUniqueInput
    update?: XOR<XOR<PractitionerUpdateToOneWithWhereWithoutUserInput, PractitionerUpdateWithoutUserInput>, PractitionerUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutPatientInput = {
    create?: XOR<UserCreateWithoutPatientInput, UserUncheckedCreateWithoutPatientInput>
    connectOrCreate?: UserCreateOrConnectWithoutPatientInput
    connect?: UserWhereUniqueInput
  }

  export type AppointmentCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type LocationCreateNestedOneWithoutPatientsInput = {
    create?: XOR<LocationCreateWithoutPatientsInput, LocationUncheckedCreateWithoutPatientsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutPatientsInput
    connect?: LocationWhereUniqueInput
  }

  export type AppointmentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutPatientNestedInput = {
    create?: XOR<UserCreateWithoutPatientInput, UserUncheckedCreateWithoutPatientInput>
    connectOrCreate?: UserCreateOrConnectWithoutPatientInput
    upsert?: UserUpsertWithoutPatientInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPatientInput, UserUpdateWithoutPatientInput>, UserUncheckedUpdateWithoutPatientInput>
  }

  export type AppointmentUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type LocationUpdateOneWithoutPatientsNestedInput = {
    create?: XOR<LocationCreateWithoutPatientsInput, LocationUncheckedCreateWithoutPatientsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutPatientsInput
    upsert?: LocationUpsertWithoutPatientsInput
    disconnect?: LocationWhereInput | boolean
    delete?: LocationWhereInput | boolean
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutPatientsInput, LocationUpdateWithoutPatientsInput>, LocationUncheckedUpdateWithoutPatientsInput>
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPractitionerInput = {
    create?: XOR<UserCreateWithoutPractitionerInput, UserUncheckedCreateWithoutPractitionerInput>
    connectOrCreate?: UserCreateOrConnectWithoutPractitionerInput
    connect?: UserWhereUniqueInput
  }

  export type SlotCreateNestedManyWithoutPractitionerInput = {
    create?: XOR<SlotCreateWithoutPractitionerInput, SlotUncheckedCreateWithoutPractitionerInput> | SlotCreateWithoutPractitionerInput[] | SlotUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: SlotCreateOrConnectWithoutPractitionerInput | SlotCreateOrConnectWithoutPractitionerInput[]
    createMany?: SlotCreateManyPractitionerInputEnvelope
    connect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
  }

  export type AppointmentCreateNestedManyWithoutPractitionerInput = {
    create?: XOR<AppointmentCreateWithoutPractitionerInput, AppointmentUncheckedCreateWithoutPractitionerInput> | AppointmentCreateWithoutPractitionerInput[] | AppointmentUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPractitionerInput | AppointmentCreateOrConnectWithoutPractitionerInput[]
    createMany?: AppointmentCreateManyPractitionerInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PractitionerAvailabilityWindowCreateNestedManyWithoutPractitionerInput = {
    create?: XOR<PractitionerAvailabilityWindowCreateWithoutPractitionerInput, PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput> | PractitionerAvailabilityWindowCreateWithoutPractitionerInput[] | PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: PractitionerAvailabilityWindowCreateOrConnectWithoutPractitionerInput | PractitionerAvailabilityWindowCreateOrConnectWithoutPractitionerInput[]
    createMany?: PractitionerAvailabilityWindowCreateManyPractitionerInputEnvelope
    connect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
  }

  export type PractitionerLocationCreateNestedManyWithoutPractitionerInput = {
    create?: XOR<PractitionerLocationCreateWithoutPractitionerInput, PractitionerLocationUncheckedCreateWithoutPractitionerInput> | PractitionerLocationCreateWithoutPractitionerInput[] | PractitionerLocationUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: PractitionerLocationCreateOrConnectWithoutPractitionerInput | PractitionerLocationCreateOrConnectWithoutPractitionerInput[]
    createMany?: PractitionerLocationCreateManyPractitionerInputEnvelope
    connect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
  }

  export type SlotUncheckedCreateNestedManyWithoutPractitionerInput = {
    create?: XOR<SlotCreateWithoutPractitionerInput, SlotUncheckedCreateWithoutPractitionerInput> | SlotCreateWithoutPractitionerInput[] | SlotUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: SlotCreateOrConnectWithoutPractitionerInput | SlotCreateOrConnectWithoutPractitionerInput[]
    createMany?: SlotCreateManyPractitionerInputEnvelope
    connect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutPractitionerInput = {
    create?: XOR<AppointmentCreateWithoutPractitionerInput, AppointmentUncheckedCreateWithoutPractitionerInput> | AppointmentCreateWithoutPractitionerInput[] | AppointmentUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPractitionerInput | AppointmentCreateOrConnectWithoutPractitionerInput[]
    createMany?: AppointmentCreateManyPractitionerInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutPractitionerInput = {
    create?: XOR<PractitionerAvailabilityWindowCreateWithoutPractitionerInput, PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput> | PractitionerAvailabilityWindowCreateWithoutPractitionerInput[] | PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: PractitionerAvailabilityWindowCreateOrConnectWithoutPractitionerInput | PractitionerAvailabilityWindowCreateOrConnectWithoutPractitionerInput[]
    createMany?: PractitionerAvailabilityWindowCreateManyPractitionerInputEnvelope
    connect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
  }

  export type PractitionerLocationUncheckedCreateNestedManyWithoutPractitionerInput = {
    create?: XOR<PractitionerLocationCreateWithoutPractitionerInput, PractitionerLocationUncheckedCreateWithoutPractitionerInput> | PractitionerLocationCreateWithoutPractitionerInput[] | PractitionerLocationUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: PractitionerLocationCreateOrConnectWithoutPractitionerInput | PractitionerLocationCreateOrConnectWithoutPractitionerInput[]
    createMany?: PractitionerLocationCreateManyPractitionerInputEnvelope
    connect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutPractitionerNestedInput = {
    create?: XOR<UserCreateWithoutPractitionerInput, UserUncheckedCreateWithoutPractitionerInput>
    connectOrCreate?: UserCreateOrConnectWithoutPractitionerInput
    upsert?: UserUpsertWithoutPractitionerInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPractitionerInput, UserUpdateWithoutPractitionerInput>, UserUncheckedUpdateWithoutPractitionerInput>
  }

  export type SlotUpdateManyWithoutPractitionerNestedInput = {
    create?: XOR<SlotCreateWithoutPractitionerInput, SlotUncheckedCreateWithoutPractitionerInput> | SlotCreateWithoutPractitionerInput[] | SlotUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: SlotCreateOrConnectWithoutPractitionerInput | SlotCreateOrConnectWithoutPractitionerInput[]
    upsert?: SlotUpsertWithWhereUniqueWithoutPractitionerInput | SlotUpsertWithWhereUniqueWithoutPractitionerInput[]
    createMany?: SlotCreateManyPractitionerInputEnvelope
    set?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    disconnect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    delete?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    connect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    update?: SlotUpdateWithWhereUniqueWithoutPractitionerInput | SlotUpdateWithWhereUniqueWithoutPractitionerInput[]
    updateMany?: SlotUpdateManyWithWhereWithoutPractitionerInput | SlotUpdateManyWithWhereWithoutPractitionerInput[]
    deleteMany?: SlotScalarWhereInput | SlotScalarWhereInput[]
  }

  export type AppointmentUpdateManyWithoutPractitionerNestedInput = {
    create?: XOR<AppointmentCreateWithoutPractitionerInput, AppointmentUncheckedCreateWithoutPractitionerInput> | AppointmentCreateWithoutPractitionerInput[] | AppointmentUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPractitionerInput | AppointmentCreateOrConnectWithoutPractitionerInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPractitionerInput | AppointmentUpsertWithWhereUniqueWithoutPractitionerInput[]
    createMany?: AppointmentCreateManyPractitionerInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPractitionerInput | AppointmentUpdateWithWhereUniqueWithoutPractitionerInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPractitionerInput | AppointmentUpdateManyWithWhereWithoutPractitionerInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PractitionerAvailabilityWindowUpdateManyWithoutPractitionerNestedInput = {
    create?: XOR<PractitionerAvailabilityWindowCreateWithoutPractitionerInput, PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput> | PractitionerAvailabilityWindowCreateWithoutPractitionerInput[] | PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: PractitionerAvailabilityWindowCreateOrConnectWithoutPractitionerInput | PractitionerAvailabilityWindowCreateOrConnectWithoutPractitionerInput[]
    upsert?: PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutPractitionerInput | PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutPractitionerInput[]
    createMany?: PractitionerAvailabilityWindowCreateManyPractitionerInputEnvelope
    set?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    disconnect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    delete?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    connect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    update?: PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutPractitionerInput | PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutPractitionerInput[]
    updateMany?: PractitionerAvailabilityWindowUpdateManyWithWhereWithoutPractitionerInput | PractitionerAvailabilityWindowUpdateManyWithWhereWithoutPractitionerInput[]
    deleteMany?: PractitionerAvailabilityWindowScalarWhereInput | PractitionerAvailabilityWindowScalarWhereInput[]
  }

  export type PractitionerLocationUpdateManyWithoutPractitionerNestedInput = {
    create?: XOR<PractitionerLocationCreateWithoutPractitionerInput, PractitionerLocationUncheckedCreateWithoutPractitionerInput> | PractitionerLocationCreateWithoutPractitionerInput[] | PractitionerLocationUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: PractitionerLocationCreateOrConnectWithoutPractitionerInput | PractitionerLocationCreateOrConnectWithoutPractitionerInput[]
    upsert?: PractitionerLocationUpsertWithWhereUniqueWithoutPractitionerInput | PractitionerLocationUpsertWithWhereUniqueWithoutPractitionerInput[]
    createMany?: PractitionerLocationCreateManyPractitionerInputEnvelope
    set?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    disconnect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    delete?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    connect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    update?: PractitionerLocationUpdateWithWhereUniqueWithoutPractitionerInput | PractitionerLocationUpdateWithWhereUniqueWithoutPractitionerInput[]
    updateMany?: PractitionerLocationUpdateManyWithWhereWithoutPractitionerInput | PractitionerLocationUpdateManyWithWhereWithoutPractitionerInput[]
    deleteMany?: PractitionerLocationScalarWhereInput | PractitionerLocationScalarWhereInput[]
  }

  export type SlotUncheckedUpdateManyWithoutPractitionerNestedInput = {
    create?: XOR<SlotCreateWithoutPractitionerInput, SlotUncheckedCreateWithoutPractitionerInput> | SlotCreateWithoutPractitionerInput[] | SlotUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: SlotCreateOrConnectWithoutPractitionerInput | SlotCreateOrConnectWithoutPractitionerInput[]
    upsert?: SlotUpsertWithWhereUniqueWithoutPractitionerInput | SlotUpsertWithWhereUniqueWithoutPractitionerInput[]
    createMany?: SlotCreateManyPractitionerInputEnvelope
    set?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    disconnect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    delete?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    connect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    update?: SlotUpdateWithWhereUniqueWithoutPractitionerInput | SlotUpdateWithWhereUniqueWithoutPractitionerInput[]
    updateMany?: SlotUpdateManyWithWhereWithoutPractitionerInput | SlotUpdateManyWithWhereWithoutPractitionerInput[]
    deleteMany?: SlotScalarWhereInput | SlotScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutPractitionerNestedInput = {
    create?: XOR<AppointmentCreateWithoutPractitionerInput, AppointmentUncheckedCreateWithoutPractitionerInput> | AppointmentCreateWithoutPractitionerInput[] | AppointmentUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPractitionerInput | AppointmentCreateOrConnectWithoutPractitionerInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPractitionerInput | AppointmentUpsertWithWhereUniqueWithoutPractitionerInput[]
    createMany?: AppointmentCreateManyPractitionerInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPractitionerInput | AppointmentUpdateWithWhereUniqueWithoutPractitionerInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPractitionerInput | AppointmentUpdateManyWithWhereWithoutPractitionerInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PractitionerAvailabilityWindowUncheckedUpdateManyWithoutPractitionerNestedInput = {
    create?: XOR<PractitionerAvailabilityWindowCreateWithoutPractitionerInput, PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput> | PractitionerAvailabilityWindowCreateWithoutPractitionerInput[] | PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: PractitionerAvailabilityWindowCreateOrConnectWithoutPractitionerInput | PractitionerAvailabilityWindowCreateOrConnectWithoutPractitionerInput[]
    upsert?: PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutPractitionerInput | PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutPractitionerInput[]
    createMany?: PractitionerAvailabilityWindowCreateManyPractitionerInputEnvelope
    set?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    disconnect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    delete?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    connect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    update?: PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutPractitionerInput | PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutPractitionerInput[]
    updateMany?: PractitionerAvailabilityWindowUpdateManyWithWhereWithoutPractitionerInput | PractitionerAvailabilityWindowUpdateManyWithWhereWithoutPractitionerInput[]
    deleteMany?: PractitionerAvailabilityWindowScalarWhereInput | PractitionerAvailabilityWindowScalarWhereInput[]
  }

  export type PractitionerLocationUncheckedUpdateManyWithoutPractitionerNestedInput = {
    create?: XOR<PractitionerLocationCreateWithoutPractitionerInput, PractitionerLocationUncheckedCreateWithoutPractitionerInput> | PractitionerLocationCreateWithoutPractitionerInput[] | PractitionerLocationUncheckedCreateWithoutPractitionerInput[]
    connectOrCreate?: PractitionerLocationCreateOrConnectWithoutPractitionerInput | PractitionerLocationCreateOrConnectWithoutPractitionerInput[]
    upsert?: PractitionerLocationUpsertWithWhereUniqueWithoutPractitionerInput | PractitionerLocationUpsertWithWhereUniqueWithoutPractitionerInput[]
    createMany?: PractitionerLocationCreateManyPractitionerInputEnvelope
    set?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    disconnect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    delete?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    connect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    update?: PractitionerLocationUpdateWithWhereUniqueWithoutPractitionerInput | PractitionerLocationUpdateWithWhereUniqueWithoutPractitionerInput[]
    updateMany?: PractitionerLocationUpdateManyWithWhereWithoutPractitionerInput | PractitionerLocationUpdateManyWithWhereWithoutPractitionerInput[]
    deleteMany?: PractitionerLocationScalarWhereInput | PractitionerLocationScalarWhereInput[]
  }

  export type SlotCreateNestedManyWithoutLocationInput = {
    create?: XOR<SlotCreateWithoutLocationInput, SlotUncheckedCreateWithoutLocationInput> | SlotCreateWithoutLocationInput[] | SlotUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: SlotCreateOrConnectWithoutLocationInput | SlotCreateOrConnectWithoutLocationInput[]
    createMany?: SlotCreateManyLocationInputEnvelope
    connect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
  }

  export type PatientCreateNestedManyWithoutLocationInput = {
    create?: XOR<PatientCreateWithoutLocationInput, PatientUncheckedCreateWithoutLocationInput> | PatientCreateWithoutLocationInput[] | PatientUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PatientCreateOrConnectWithoutLocationInput | PatientCreateOrConnectWithoutLocationInput[]
    createMany?: PatientCreateManyLocationInputEnvelope
    connect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
  }

  export type PractitionerAvailabilityWindowCreateNestedManyWithoutLocationInput = {
    create?: XOR<PractitionerAvailabilityWindowCreateWithoutLocationInput, PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput> | PractitionerAvailabilityWindowCreateWithoutLocationInput[] | PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PractitionerAvailabilityWindowCreateOrConnectWithoutLocationInput | PractitionerAvailabilityWindowCreateOrConnectWithoutLocationInput[]
    createMany?: PractitionerAvailabilityWindowCreateManyLocationInputEnvelope
    connect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
  }

  export type PractitionerLocationCreateNestedManyWithoutLocationInput = {
    create?: XOR<PractitionerLocationCreateWithoutLocationInput, PractitionerLocationUncheckedCreateWithoutLocationInput> | PractitionerLocationCreateWithoutLocationInput[] | PractitionerLocationUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PractitionerLocationCreateOrConnectWithoutLocationInput | PractitionerLocationCreateOrConnectWithoutLocationInput[]
    createMany?: PractitionerLocationCreateManyLocationInputEnvelope
    connect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
  }

  export type SlotUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<SlotCreateWithoutLocationInput, SlotUncheckedCreateWithoutLocationInput> | SlotCreateWithoutLocationInput[] | SlotUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: SlotCreateOrConnectWithoutLocationInput | SlotCreateOrConnectWithoutLocationInput[]
    createMany?: SlotCreateManyLocationInputEnvelope
    connect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
  }

  export type PatientUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<PatientCreateWithoutLocationInput, PatientUncheckedCreateWithoutLocationInput> | PatientCreateWithoutLocationInput[] | PatientUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PatientCreateOrConnectWithoutLocationInput | PatientCreateOrConnectWithoutLocationInput[]
    createMany?: PatientCreateManyLocationInputEnvelope
    connect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
  }

  export type PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<PractitionerAvailabilityWindowCreateWithoutLocationInput, PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput> | PractitionerAvailabilityWindowCreateWithoutLocationInput[] | PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PractitionerAvailabilityWindowCreateOrConnectWithoutLocationInput | PractitionerAvailabilityWindowCreateOrConnectWithoutLocationInput[]
    createMany?: PractitionerAvailabilityWindowCreateManyLocationInputEnvelope
    connect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
  }

  export type PractitionerLocationUncheckedCreateNestedManyWithoutLocationInput = {
    create?: XOR<PractitionerLocationCreateWithoutLocationInput, PractitionerLocationUncheckedCreateWithoutLocationInput> | PractitionerLocationCreateWithoutLocationInput[] | PractitionerLocationUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PractitionerLocationCreateOrConnectWithoutLocationInput | PractitionerLocationCreateOrConnectWithoutLocationInput[]
    createMany?: PractitionerLocationCreateManyLocationInputEnvelope
    connect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
  }

  export type SlotUpdateManyWithoutLocationNestedInput = {
    create?: XOR<SlotCreateWithoutLocationInput, SlotUncheckedCreateWithoutLocationInput> | SlotCreateWithoutLocationInput[] | SlotUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: SlotCreateOrConnectWithoutLocationInput | SlotCreateOrConnectWithoutLocationInput[]
    upsert?: SlotUpsertWithWhereUniqueWithoutLocationInput | SlotUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: SlotCreateManyLocationInputEnvelope
    set?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    disconnect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    delete?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    connect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    update?: SlotUpdateWithWhereUniqueWithoutLocationInput | SlotUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: SlotUpdateManyWithWhereWithoutLocationInput | SlotUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: SlotScalarWhereInput | SlotScalarWhereInput[]
  }

  export type PatientUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PatientCreateWithoutLocationInput, PatientUncheckedCreateWithoutLocationInput> | PatientCreateWithoutLocationInput[] | PatientUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PatientCreateOrConnectWithoutLocationInput | PatientCreateOrConnectWithoutLocationInput[]
    upsert?: PatientUpsertWithWhereUniqueWithoutLocationInput | PatientUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PatientCreateManyLocationInputEnvelope
    set?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    disconnect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    delete?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    connect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    update?: PatientUpdateWithWhereUniqueWithoutLocationInput | PatientUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PatientUpdateManyWithWhereWithoutLocationInput | PatientUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PatientScalarWhereInput | PatientScalarWhereInput[]
  }

  export type PractitionerAvailabilityWindowUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PractitionerAvailabilityWindowCreateWithoutLocationInput, PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput> | PractitionerAvailabilityWindowCreateWithoutLocationInput[] | PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PractitionerAvailabilityWindowCreateOrConnectWithoutLocationInput | PractitionerAvailabilityWindowCreateOrConnectWithoutLocationInput[]
    upsert?: PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutLocationInput | PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PractitionerAvailabilityWindowCreateManyLocationInputEnvelope
    set?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    disconnect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    delete?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    connect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    update?: PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutLocationInput | PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PractitionerAvailabilityWindowUpdateManyWithWhereWithoutLocationInput | PractitionerAvailabilityWindowUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PractitionerAvailabilityWindowScalarWhereInput | PractitionerAvailabilityWindowScalarWhereInput[]
  }

  export type PractitionerLocationUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PractitionerLocationCreateWithoutLocationInput, PractitionerLocationUncheckedCreateWithoutLocationInput> | PractitionerLocationCreateWithoutLocationInput[] | PractitionerLocationUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PractitionerLocationCreateOrConnectWithoutLocationInput | PractitionerLocationCreateOrConnectWithoutLocationInput[]
    upsert?: PractitionerLocationUpsertWithWhereUniqueWithoutLocationInput | PractitionerLocationUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PractitionerLocationCreateManyLocationInputEnvelope
    set?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    disconnect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    delete?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    connect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    update?: PractitionerLocationUpdateWithWhereUniqueWithoutLocationInput | PractitionerLocationUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PractitionerLocationUpdateManyWithWhereWithoutLocationInput | PractitionerLocationUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PractitionerLocationScalarWhereInput | PractitionerLocationScalarWhereInput[]
  }

  export type SlotUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<SlotCreateWithoutLocationInput, SlotUncheckedCreateWithoutLocationInput> | SlotCreateWithoutLocationInput[] | SlotUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: SlotCreateOrConnectWithoutLocationInput | SlotCreateOrConnectWithoutLocationInput[]
    upsert?: SlotUpsertWithWhereUniqueWithoutLocationInput | SlotUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: SlotCreateManyLocationInputEnvelope
    set?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    disconnect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    delete?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    connect?: SlotWhereUniqueInput | SlotWhereUniqueInput[]
    update?: SlotUpdateWithWhereUniqueWithoutLocationInput | SlotUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: SlotUpdateManyWithWhereWithoutLocationInput | SlotUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: SlotScalarWhereInput | SlotScalarWhereInput[]
  }

  export type PatientUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PatientCreateWithoutLocationInput, PatientUncheckedCreateWithoutLocationInput> | PatientCreateWithoutLocationInput[] | PatientUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PatientCreateOrConnectWithoutLocationInput | PatientCreateOrConnectWithoutLocationInput[]
    upsert?: PatientUpsertWithWhereUniqueWithoutLocationInput | PatientUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PatientCreateManyLocationInputEnvelope
    set?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    disconnect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    delete?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    connect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    update?: PatientUpdateWithWhereUniqueWithoutLocationInput | PatientUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PatientUpdateManyWithWhereWithoutLocationInput | PatientUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PatientScalarWhereInput | PatientScalarWhereInput[]
  }

  export type PractitionerAvailabilityWindowUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PractitionerAvailabilityWindowCreateWithoutLocationInput, PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput> | PractitionerAvailabilityWindowCreateWithoutLocationInput[] | PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PractitionerAvailabilityWindowCreateOrConnectWithoutLocationInput | PractitionerAvailabilityWindowCreateOrConnectWithoutLocationInput[]
    upsert?: PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutLocationInput | PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PractitionerAvailabilityWindowCreateManyLocationInputEnvelope
    set?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    disconnect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    delete?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    connect?: PractitionerAvailabilityWindowWhereUniqueInput | PractitionerAvailabilityWindowWhereUniqueInput[]
    update?: PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutLocationInput | PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PractitionerAvailabilityWindowUpdateManyWithWhereWithoutLocationInput | PractitionerAvailabilityWindowUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PractitionerAvailabilityWindowScalarWhereInput | PractitionerAvailabilityWindowScalarWhereInput[]
  }

  export type PractitionerLocationUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PractitionerLocationCreateWithoutLocationInput, PractitionerLocationUncheckedCreateWithoutLocationInput> | PractitionerLocationCreateWithoutLocationInput[] | PractitionerLocationUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PractitionerLocationCreateOrConnectWithoutLocationInput | PractitionerLocationCreateOrConnectWithoutLocationInput[]
    upsert?: PractitionerLocationUpsertWithWhereUniqueWithoutLocationInput | PractitionerLocationUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PractitionerLocationCreateManyLocationInputEnvelope
    set?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    disconnect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    delete?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    connect?: PractitionerLocationWhereUniqueInput | PractitionerLocationWhereUniqueInput[]
    update?: PractitionerLocationUpdateWithWhereUniqueWithoutLocationInput | PractitionerLocationUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PractitionerLocationUpdateManyWithWhereWithoutLocationInput | PractitionerLocationUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PractitionerLocationScalarWhereInput | PractitionerLocationScalarWhereInput[]
  }

  export type PractitionerCreateNestedOneWithoutPractitionerLocationsInput = {
    create?: XOR<PractitionerCreateWithoutPractitionerLocationsInput, PractitionerUncheckedCreateWithoutPractitionerLocationsInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutPractitionerLocationsInput
    connect?: PractitionerWhereUniqueInput
  }

  export type LocationCreateNestedOneWithoutPractitionerLocationsInput = {
    create?: XOR<LocationCreateWithoutPractitionerLocationsInput, LocationUncheckedCreateWithoutPractitionerLocationsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutPractitionerLocationsInput
    connect?: LocationWhereUniqueInput
  }

  export type PractitionerUpdateOneRequiredWithoutPractitionerLocationsNestedInput = {
    create?: XOR<PractitionerCreateWithoutPractitionerLocationsInput, PractitionerUncheckedCreateWithoutPractitionerLocationsInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutPractitionerLocationsInput
    upsert?: PractitionerUpsertWithoutPractitionerLocationsInput
    connect?: PractitionerWhereUniqueInput
    update?: XOR<XOR<PractitionerUpdateToOneWithWhereWithoutPractitionerLocationsInput, PractitionerUpdateWithoutPractitionerLocationsInput>, PractitionerUncheckedUpdateWithoutPractitionerLocationsInput>
  }

  export type LocationUpdateOneRequiredWithoutPractitionerLocationsNestedInput = {
    create?: XOR<LocationCreateWithoutPractitionerLocationsInput, LocationUncheckedCreateWithoutPractitionerLocationsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutPractitionerLocationsInput
    upsert?: LocationUpsertWithoutPractitionerLocationsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutPractitionerLocationsInput, LocationUpdateWithoutPractitionerLocationsInput>, LocationUncheckedUpdateWithoutPractitionerLocationsInput>
  }

  export type PractitionerCreateNestedOneWithoutAvailabilityWindowsInput = {
    create?: XOR<PractitionerCreateWithoutAvailabilityWindowsInput, PractitionerUncheckedCreateWithoutAvailabilityWindowsInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutAvailabilityWindowsInput
    connect?: PractitionerWhereUniqueInput
  }

  export type LocationCreateNestedOneWithoutAvailabilityWindowsInput = {
    create?: XOR<LocationCreateWithoutAvailabilityWindowsInput, LocationUncheckedCreateWithoutAvailabilityWindowsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutAvailabilityWindowsInput
    connect?: LocationWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PractitionerUpdateOneRequiredWithoutAvailabilityWindowsNestedInput = {
    create?: XOR<PractitionerCreateWithoutAvailabilityWindowsInput, PractitionerUncheckedCreateWithoutAvailabilityWindowsInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutAvailabilityWindowsInput
    upsert?: PractitionerUpsertWithoutAvailabilityWindowsInput
    connect?: PractitionerWhereUniqueInput
    update?: XOR<XOR<PractitionerUpdateToOneWithWhereWithoutAvailabilityWindowsInput, PractitionerUpdateWithoutAvailabilityWindowsInput>, PractitionerUncheckedUpdateWithoutAvailabilityWindowsInput>
  }

  export type LocationUpdateOneRequiredWithoutAvailabilityWindowsNestedInput = {
    create?: XOR<LocationCreateWithoutAvailabilityWindowsInput, LocationUncheckedCreateWithoutAvailabilityWindowsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutAvailabilityWindowsInput
    upsert?: LocationUpsertWithoutAvailabilityWindowsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutAvailabilityWindowsInput, LocationUpdateWithoutAvailabilityWindowsInput>, LocationUncheckedUpdateWithoutAvailabilityWindowsInput>
  }

  export type PractitionerCreateNestedOneWithoutSlotsInput = {
    create?: XOR<PractitionerCreateWithoutSlotsInput, PractitionerUncheckedCreateWithoutSlotsInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutSlotsInput
    connect?: PractitionerWhereUniqueInput
  }

  export type LocationCreateNestedOneWithoutSlotsInput = {
    create?: XOR<LocationCreateWithoutSlotsInput, LocationUncheckedCreateWithoutSlotsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutSlotsInput
    connect?: LocationWhereUniqueInput
  }

  export type AppointmentCreateNestedOneWithoutSlotInput = {
    create?: XOR<AppointmentCreateWithoutSlotInput, AppointmentUncheckedCreateWithoutSlotInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutSlotInput
    connect?: AppointmentWhereUniqueInput
  }

  export type AppointmentUncheckedCreateNestedOneWithoutSlotInput = {
    create?: XOR<AppointmentCreateWithoutSlotInput, AppointmentUncheckedCreateWithoutSlotInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutSlotInput
    connect?: AppointmentWhereUniqueInput
  }

  export type PractitionerUpdateOneRequiredWithoutSlotsNestedInput = {
    create?: XOR<PractitionerCreateWithoutSlotsInput, PractitionerUncheckedCreateWithoutSlotsInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutSlotsInput
    upsert?: PractitionerUpsertWithoutSlotsInput
    connect?: PractitionerWhereUniqueInput
    update?: XOR<XOR<PractitionerUpdateToOneWithWhereWithoutSlotsInput, PractitionerUpdateWithoutSlotsInput>, PractitionerUncheckedUpdateWithoutSlotsInput>
  }

  export type LocationUpdateOneRequiredWithoutSlotsNestedInput = {
    create?: XOR<LocationCreateWithoutSlotsInput, LocationUncheckedCreateWithoutSlotsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutSlotsInput
    upsert?: LocationUpsertWithoutSlotsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutSlotsInput, LocationUpdateWithoutSlotsInput>, LocationUncheckedUpdateWithoutSlotsInput>
  }

  export type AppointmentUpdateOneWithoutSlotNestedInput = {
    create?: XOR<AppointmentCreateWithoutSlotInput, AppointmentUncheckedCreateWithoutSlotInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutSlotInput
    upsert?: AppointmentUpsertWithoutSlotInput
    disconnect?: AppointmentWhereInput | boolean
    delete?: AppointmentWhereInput | boolean
    connect?: AppointmentWhereUniqueInput
    update?: XOR<XOR<AppointmentUpdateToOneWithWhereWithoutSlotInput, AppointmentUpdateWithoutSlotInput>, AppointmentUncheckedUpdateWithoutSlotInput>
  }

  export type AppointmentUncheckedUpdateOneWithoutSlotNestedInput = {
    create?: XOR<AppointmentCreateWithoutSlotInput, AppointmentUncheckedCreateWithoutSlotInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutSlotInput
    upsert?: AppointmentUpsertWithoutSlotInput
    disconnect?: AppointmentWhereInput | boolean
    delete?: AppointmentWhereInput | boolean
    connect?: AppointmentWhereUniqueInput
    update?: XOR<XOR<AppointmentUpdateToOneWithWhereWithoutSlotInput, AppointmentUpdateWithoutSlotInput>, AppointmentUncheckedUpdateWithoutSlotInput>
  }

  export type PatientCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAppointmentsInput
    connect?: PatientWhereUniqueInput
  }

  export type SlotCreateNestedOneWithoutAppointmentInput = {
    create?: XOR<SlotCreateWithoutAppointmentInput, SlotUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: SlotCreateOrConnectWithoutAppointmentInput
    connect?: SlotWhereUniqueInput
  }

  export type PractitionerCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<PractitionerCreateWithoutAppointmentsInput, PractitionerUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutAppointmentsInput
    connect?: PractitionerWhereUniqueInput
  }

  export type EnumAppointmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AppointmentStatus
  }

  export type PatientUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAppointmentsInput
    upsert?: PatientUpsertWithoutAppointmentsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutAppointmentsInput, PatientUpdateWithoutAppointmentsInput>, PatientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type SlotUpdateOneRequiredWithoutAppointmentNestedInput = {
    create?: XOR<SlotCreateWithoutAppointmentInput, SlotUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: SlotCreateOrConnectWithoutAppointmentInput
    upsert?: SlotUpsertWithoutAppointmentInput
    connect?: SlotWhereUniqueInput
    update?: XOR<XOR<SlotUpdateToOneWithWhereWithoutAppointmentInput, SlotUpdateWithoutAppointmentInput>, SlotUncheckedUpdateWithoutAppointmentInput>
  }

  export type PractitionerUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<PractitionerCreateWithoutAppointmentsInput, PractitionerUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PractitionerCreateOrConnectWithoutAppointmentsInput
    upsert?: PractitionerUpsertWithoutAppointmentsInput
    connect?: PractitionerWhereUniqueInput
    update?: XOR<XOR<PractitionerUpdateToOneWithWhereWithoutAppointmentsInput, PractitionerUpdateWithoutAppointmentsInput>, PractitionerUncheckedUpdateWithoutAppointmentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
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
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
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

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
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
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
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
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus
  }

  export type NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAppointmentStatusFilter<$PrismaModel>
  }

  export type PatientCreateWithoutUserInput = {
    id?: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    location?: LocationCreateNestedOneWithoutPatientsInput
  }

  export type PatientUncheckedCreateWithoutUserInput = {
    id?: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationId?: string | null
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutUserInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutUserInput, PatientUncheckedCreateWithoutUserInput>
  }

  export type PractitionerCreateWithoutUserInput = {
    id?: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotCreateNestedManyWithoutPractitionerInput
    appointments?: AppointmentCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotUncheckedCreateNestedManyWithoutPractitionerInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationUncheckedCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerCreateOrConnectWithoutUserInput = {
    where: PractitionerWhereUniqueInput
    create: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput>
  }

  export type PatientUpsertWithoutUserInput = {
    update: XOR<PatientUpdateWithoutUserInput, PatientUncheckedUpdateWithoutUserInput>
    create: XOR<PatientCreateWithoutUserInput, PatientUncheckedCreateWithoutUserInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutUserInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutUserInput, PatientUncheckedUpdateWithoutUserInput>
  }

  export type PatientUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    location?: LocationUpdateOneWithoutPatientsNestedInput
  }

  export type PatientUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PractitionerUpsertWithoutUserInput = {
    update: XOR<PractitionerUpdateWithoutUserInput, PractitionerUncheckedUpdateWithoutUserInput>
    create: XOR<PractitionerCreateWithoutUserInput, PractitionerUncheckedCreateWithoutUserInput>
    where?: PractitionerWhereInput
  }

  export type PractitionerUpdateToOneWithWhereWithoutUserInput = {
    where?: PractitionerWhereInput
    data: XOR<PractitionerUpdateWithoutUserInput, PractitionerUncheckedUpdateWithoutUserInput>
  }

  export type PractitionerUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUpdateManyWithoutPractitionerNestedInput
    appointments?: AppointmentUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUpdateManyWithoutPractitionerNestedInput
  }

  export type PractitionerUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUncheckedUpdateManyWithoutPractitionerNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUncheckedUpdateManyWithoutPractitionerNestedInput
  }

  export type UserCreateWithoutPatientInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    nhsNumber?: string | null
    dateOfBirth?: Date | string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiresAt?: Date | string | null
    practitioner?: PractitionerCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPatientInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    nhsNumber?: string | null
    dateOfBirth?: Date | string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiresAt?: Date | string | null
    practitioner?: PractitionerUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPatientInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPatientInput, UserUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentCreateWithoutPatientInput = {
    id?: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slot: SlotCreateNestedOneWithoutAppointmentInput
    practitioner: PractitionerCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateWithoutPatientInput = {
    id?: string
    slotId: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    practitionerId: string
  }

  export type AppointmentCreateOrConnectWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentCreateManyPatientInputEnvelope = {
    data: AppointmentCreateManyPatientInput | AppointmentCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type LocationCreateWithoutPatientsInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotCreateNestedManyWithoutLocationInput
    availabilityWindows?: PractitionerAvailabilityWindowCreateNestedManyWithoutLocationInput
    practitionerLocations?: PractitionerLocationCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutPatientsInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotUncheckedCreateNestedManyWithoutLocationInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutLocationInput
    practitionerLocations?: PractitionerLocationUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutPatientsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutPatientsInput, LocationUncheckedCreateWithoutPatientsInput>
  }

  export type UserUpsertWithoutPatientInput = {
    update: XOR<UserUpdateWithoutPatientInput, UserUncheckedUpdateWithoutPatientInput>
    create: XOR<UserCreateWithoutPatientInput, UserUncheckedCreateWithoutPatientInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPatientInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPatientInput, UserUncheckedUpdateWithoutPatientInput>
  }

  export type UserUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    nhsNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    practitioner?: PractitionerUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    nhsNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    practitioner?: PractitionerUncheckedUpdateOneWithoutUserNestedInput
  }

  export type AppointmentUpsertWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutPatientInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutPatientInput>
  }

  export type AppointmentScalarWhereInput = {
    AND?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    OR?: AppointmentScalarWhereInput[]
    NOT?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    id?: StringFilter<"Appointment"> | string
    patientId?: StringFilter<"Appointment"> | string
    slotId?: StringFilter<"Appointment"> | string
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    reason?: StringNullableFilter<"Appointment"> | string | null
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    practitionerId?: StringFilter<"Appointment"> | string
  }

  export type LocationUpsertWithoutPatientsInput = {
    update: XOR<LocationUpdateWithoutPatientsInput, LocationUncheckedUpdateWithoutPatientsInput>
    create: XOR<LocationCreateWithoutPatientsInput, LocationUncheckedCreateWithoutPatientsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutPatientsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutPatientsInput, LocationUncheckedUpdateWithoutPatientsInput>
  }

  export type LocationUpdateWithoutPatientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUpdateManyWithoutLocationNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUpdateManyWithoutLocationNestedInput
    practitionerLocations?: PractitionerLocationUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutPatientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUncheckedUpdateManyWithoutLocationNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedUpdateManyWithoutLocationNestedInput
    practitionerLocations?: PractitionerLocationUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type UserCreateWithoutPractitionerInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    nhsNumber?: string | null
    dateOfBirth?: Date | string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiresAt?: Date | string | null
    patient?: PatientCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPractitionerInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: $Enums.UserRole
    nhsNumber?: string | null
    dateOfBirth?: Date | string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resetToken?: string | null
    resetTokenExpiresAt?: Date | string | null
    patient?: PatientUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPractitionerInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPractitionerInput, UserUncheckedCreateWithoutPractitionerInput>
  }

  export type SlotCreateWithoutPractitionerInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    location: LocationCreateNestedOneWithoutSlotsInput
    appointment?: AppointmentCreateNestedOneWithoutSlotInput
  }

  export type SlotUncheckedCreateWithoutPractitionerInput = {
    id?: string
    locationId: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointment?: AppointmentUncheckedCreateNestedOneWithoutSlotInput
  }

  export type SlotCreateOrConnectWithoutPractitionerInput = {
    where: SlotWhereUniqueInput
    create: XOR<SlotCreateWithoutPractitionerInput, SlotUncheckedCreateWithoutPractitionerInput>
  }

  export type SlotCreateManyPractitionerInputEnvelope = {
    data: SlotCreateManyPractitionerInput | SlotCreateManyPractitionerInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentCreateWithoutPractitionerInput = {
    id?: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutAppointmentsInput
    slot: SlotCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutPractitionerInput = {
    id?: string
    patientId: string
    slotId: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateOrConnectWithoutPractitionerInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPractitionerInput, AppointmentUncheckedCreateWithoutPractitionerInput>
  }

  export type AppointmentCreateManyPractitionerInputEnvelope = {
    data: AppointmentCreateManyPractitionerInput | AppointmentCreateManyPractitionerInput[]
    skipDuplicates?: boolean
  }

  export type PractitionerAvailabilityWindowCreateWithoutPractitionerInput = {
    id?: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin?: number
    location: LocationCreateNestedOneWithoutAvailabilityWindowsInput
  }

  export type PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput = {
    id?: string
    locationId: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin?: number
  }

  export type PractitionerAvailabilityWindowCreateOrConnectWithoutPractitionerInput = {
    where: PractitionerAvailabilityWindowWhereUniqueInput
    create: XOR<PractitionerAvailabilityWindowCreateWithoutPractitionerInput, PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput>
  }

  export type PractitionerAvailabilityWindowCreateManyPractitionerInputEnvelope = {
    data: PractitionerAvailabilityWindowCreateManyPractitionerInput | PractitionerAvailabilityWindowCreateManyPractitionerInput[]
    skipDuplicates?: boolean
  }

  export type PractitionerLocationCreateWithoutPractitionerInput = {
    id?: string
    createdAt?: Date | string
    location: LocationCreateNestedOneWithoutPractitionerLocationsInput
  }

  export type PractitionerLocationUncheckedCreateWithoutPractitionerInput = {
    id?: string
    locationId: string
    createdAt?: Date | string
  }

  export type PractitionerLocationCreateOrConnectWithoutPractitionerInput = {
    where: PractitionerLocationWhereUniqueInput
    create: XOR<PractitionerLocationCreateWithoutPractitionerInput, PractitionerLocationUncheckedCreateWithoutPractitionerInput>
  }

  export type PractitionerLocationCreateManyPractitionerInputEnvelope = {
    data: PractitionerLocationCreateManyPractitionerInput | PractitionerLocationCreateManyPractitionerInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPractitionerInput = {
    update: XOR<UserUpdateWithoutPractitionerInput, UserUncheckedUpdateWithoutPractitionerInput>
    create: XOR<UserCreateWithoutPractitionerInput, UserUncheckedCreateWithoutPractitionerInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPractitionerInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPractitionerInput, UserUncheckedUpdateWithoutPractitionerInput>
  }

  export type UserUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    nhsNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patient?: PatientUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    nhsNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patient?: PatientUncheckedUpdateOneWithoutUserNestedInput
  }

  export type SlotUpsertWithWhereUniqueWithoutPractitionerInput = {
    where: SlotWhereUniqueInput
    update: XOR<SlotUpdateWithoutPractitionerInput, SlotUncheckedUpdateWithoutPractitionerInput>
    create: XOR<SlotCreateWithoutPractitionerInput, SlotUncheckedCreateWithoutPractitionerInput>
  }

  export type SlotUpdateWithWhereUniqueWithoutPractitionerInput = {
    where: SlotWhereUniqueInput
    data: XOR<SlotUpdateWithoutPractitionerInput, SlotUncheckedUpdateWithoutPractitionerInput>
  }

  export type SlotUpdateManyWithWhereWithoutPractitionerInput = {
    where: SlotScalarWhereInput
    data: XOR<SlotUpdateManyMutationInput, SlotUncheckedUpdateManyWithoutPractitionerInput>
  }

  export type SlotScalarWhereInput = {
    AND?: SlotScalarWhereInput | SlotScalarWhereInput[]
    OR?: SlotScalarWhereInput[]
    NOT?: SlotScalarWhereInput | SlotScalarWhereInput[]
    id?: StringFilter<"Slot"> | string
    practitionerId?: StringFilter<"Slot"> | string
    locationId?: StringFilter<"Slot"> | string
    startAt?: DateTimeFilter<"Slot"> | Date | string
    endAt?: DateTimeFilter<"Slot"> | Date | string
    createdAt?: DateTimeFilter<"Slot"> | Date | string
    updatedAt?: DateTimeFilter<"Slot"> | Date | string
  }

  export type AppointmentUpsertWithWhereUniqueWithoutPractitionerInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutPractitionerInput, AppointmentUncheckedUpdateWithoutPractitionerInput>
    create: XOR<AppointmentCreateWithoutPractitionerInput, AppointmentUncheckedCreateWithoutPractitionerInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutPractitionerInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutPractitionerInput, AppointmentUncheckedUpdateWithoutPractitionerInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutPractitionerInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutPractitionerInput>
  }

  export type PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutPractitionerInput = {
    where: PractitionerAvailabilityWindowWhereUniqueInput
    update: XOR<PractitionerAvailabilityWindowUpdateWithoutPractitionerInput, PractitionerAvailabilityWindowUncheckedUpdateWithoutPractitionerInput>
    create: XOR<PractitionerAvailabilityWindowCreateWithoutPractitionerInput, PractitionerAvailabilityWindowUncheckedCreateWithoutPractitionerInput>
  }

  export type PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutPractitionerInput = {
    where: PractitionerAvailabilityWindowWhereUniqueInput
    data: XOR<PractitionerAvailabilityWindowUpdateWithoutPractitionerInput, PractitionerAvailabilityWindowUncheckedUpdateWithoutPractitionerInput>
  }

  export type PractitionerAvailabilityWindowUpdateManyWithWhereWithoutPractitionerInput = {
    where: PractitionerAvailabilityWindowScalarWhereInput
    data: XOR<PractitionerAvailabilityWindowUpdateManyMutationInput, PractitionerAvailabilityWindowUncheckedUpdateManyWithoutPractitionerInput>
  }

  export type PractitionerAvailabilityWindowScalarWhereInput = {
    AND?: PractitionerAvailabilityWindowScalarWhereInput | PractitionerAvailabilityWindowScalarWhereInput[]
    OR?: PractitionerAvailabilityWindowScalarWhereInput[]
    NOT?: PractitionerAvailabilityWindowScalarWhereInput | PractitionerAvailabilityWindowScalarWhereInput[]
    id?: StringFilter<"PractitionerAvailabilityWindow"> | string
    practitionerId?: StringFilter<"PractitionerAvailabilityWindow"> | string
    locationId?: StringFilter<"PractitionerAvailabilityWindow"> | string
    dayOfWeek?: IntFilter<"PractitionerAvailabilityWindow"> | number
    windowStartMin?: IntFilter<"PractitionerAvailabilityWindow"> | number
    windowEndMin?: IntFilter<"PractitionerAvailabilityWindow"> | number
    slotDurationMin?: IntFilter<"PractitionerAvailabilityWindow"> | number
  }

  export type PractitionerLocationUpsertWithWhereUniqueWithoutPractitionerInput = {
    where: PractitionerLocationWhereUniqueInput
    update: XOR<PractitionerLocationUpdateWithoutPractitionerInput, PractitionerLocationUncheckedUpdateWithoutPractitionerInput>
    create: XOR<PractitionerLocationCreateWithoutPractitionerInput, PractitionerLocationUncheckedCreateWithoutPractitionerInput>
  }

  export type PractitionerLocationUpdateWithWhereUniqueWithoutPractitionerInput = {
    where: PractitionerLocationWhereUniqueInput
    data: XOR<PractitionerLocationUpdateWithoutPractitionerInput, PractitionerLocationUncheckedUpdateWithoutPractitionerInput>
  }

  export type PractitionerLocationUpdateManyWithWhereWithoutPractitionerInput = {
    where: PractitionerLocationScalarWhereInput
    data: XOR<PractitionerLocationUpdateManyMutationInput, PractitionerLocationUncheckedUpdateManyWithoutPractitionerInput>
  }

  export type PractitionerLocationScalarWhereInput = {
    AND?: PractitionerLocationScalarWhereInput | PractitionerLocationScalarWhereInput[]
    OR?: PractitionerLocationScalarWhereInput[]
    NOT?: PractitionerLocationScalarWhereInput | PractitionerLocationScalarWhereInput[]
    id?: StringFilter<"PractitionerLocation"> | string
    practitionerId?: StringFilter<"PractitionerLocation"> | string
    locationId?: StringFilter<"PractitionerLocation"> | string
    createdAt?: DateTimeFilter<"PractitionerLocation"> | Date | string
  }

  export type SlotCreateWithoutLocationInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    practitioner: PractitionerCreateNestedOneWithoutSlotsInput
    appointment?: AppointmentCreateNestedOneWithoutSlotInput
  }

  export type SlotUncheckedCreateWithoutLocationInput = {
    id?: string
    practitionerId: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointment?: AppointmentUncheckedCreateNestedOneWithoutSlotInput
  }

  export type SlotCreateOrConnectWithoutLocationInput = {
    where: SlotWhereUniqueInput
    create: XOR<SlotCreateWithoutLocationInput, SlotUncheckedCreateWithoutLocationInput>
  }

  export type SlotCreateManyLocationInputEnvelope = {
    data: SlotCreateManyLocationInput | SlotCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type PatientCreateWithoutLocationInput = {
    id?: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPatientInput
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutLocationInput = {
    id?: string
    userId: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutLocationInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutLocationInput, PatientUncheckedCreateWithoutLocationInput>
  }

  export type PatientCreateManyLocationInputEnvelope = {
    data: PatientCreateManyLocationInput | PatientCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type PractitionerAvailabilityWindowCreateWithoutLocationInput = {
    id?: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin?: number
    practitioner: PractitionerCreateNestedOneWithoutAvailabilityWindowsInput
  }

  export type PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput = {
    id?: string
    practitionerId: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin?: number
  }

  export type PractitionerAvailabilityWindowCreateOrConnectWithoutLocationInput = {
    where: PractitionerAvailabilityWindowWhereUniqueInput
    create: XOR<PractitionerAvailabilityWindowCreateWithoutLocationInput, PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput>
  }

  export type PractitionerAvailabilityWindowCreateManyLocationInputEnvelope = {
    data: PractitionerAvailabilityWindowCreateManyLocationInput | PractitionerAvailabilityWindowCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type PractitionerLocationCreateWithoutLocationInput = {
    id?: string
    createdAt?: Date | string
    practitioner: PractitionerCreateNestedOneWithoutPractitionerLocationsInput
  }

  export type PractitionerLocationUncheckedCreateWithoutLocationInput = {
    id?: string
    practitionerId: string
    createdAt?: Date | string
  }

  export type PractitionerLocationCreateOrConnectWithoutLocationInput = {
    where: PractitionerLocationWhereUniqueInput
    create: XOR<PractitionerLocationCreateWithoutLocationInput, PractitionerLocationUncheckedCreateWithoutLocationInput>
  }

  export type PractitionerLocationCreateManyLocationInputEnvelope = {
    data: PractitionerLocationCreateManyLocationInput | PractitionerLocationCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type SlotUpsertWithWhereUniqueWithoutLocationInput = {
    where: SlotWhereUniqueInput
    update: XOR<SlotUpdateWithoutLocationInput, SlotUncheckedUpdateWithoutLocationInput>
    create: XOR<SlotCreateWithoutLocationInput, SlotUncheckedCreateWithoutLocationInput>
  }

  export type SlotUpdateWithWhereUniqueWithoutLocationInput = {
    where: SlotWhereUniqueInput
    data: XOR<SlotUpdateWithoutLocationInput, SlotUncheckedUpdateWithoutLocationInput>
  }

  export type SlotUpdateManyWithWhereWithoutLocationInput = {
    where: SlotScalarWhereInput
    data: XOR<SlotUpdateManyMutationInput, SlotUncheckedUpdateManyWithoutLocationInput>
  }

  export type PatientUpsertWithWhereUniqueWithoutLocationInput = {
    where: PatientWhereUniqueInput
    update: XOR<PatientUpdateWithoutLocationInput, PatientUncheckedUpdateWithoutLocationInput>
    create: XOR<PatientCreateWithoutLocationInput, PatientUncheckedCreateWithoutLocationInput>
  }

  export type PatientUpdateWithWhereUniqueWithoutLocationInput = {
    where: PatientWhereUniqueInput
    data: XOR<PatientUpdateWithoutLocationInput, PatientUncheckedUpdateWithoutLocationInput>
  }

  export type PatientUpdateManyWithWhereWithoutLocationInput = {
    where: PatientScalarWhereInput
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyWithoutLocationInput>
  }

  export type PatientScalarWhereInput = {
    AND?: PatientScalarWhereInput | PatientScalarWhereInput[]
    OR?: PatientScalarWhereInput[]
    NOT?: PatientScalarWhereInput | PatientScalarWhereInput[]
    id?: StringFilter<"Patient"> | string
    userId?: StringFilter<"Patient"> | string
    nhsNumber?: StringFilter<"Patient"> | string
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    addressLine1?: StringNullableFilter<"Patient"> | string | null
    addressLine2?: StringNullableFilter<"Patient"> | string | null
    postcode?: StringNullableFilter<"Patient"> | string | null
    gpSurgeryName?: StringNullableFilter<"Patient"> | string | null
    gpSurgeryCode?: StringNullableFilter<"Patient"> | string | null
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    locationId?: StringNullableFilter<"Patient"> | string | null
  }

  export type PractitionerAvailabilityWindowUpsertWithWhereUniqueWithoutLocationInput = {
    where: PractitionerAvailabilityWindowWhereUniqueInput
    update: XOR<PractitionerAvailabilityWindowUpdateWithoutLocationInput, PractitionerAvailabilityWindowUncheckedUpdateWithoutLocationInput>
    create: XOR<PractitionerAvailabilityWindowCreateWithoutLocationInput, PractitionerAvailabilityWindowUncheckedCreateWithoutLocationInput>
  }

  export type PractitionerAvailabilityWindowUpdateWithWhereUniqueWithoutLocationInput = {
    where: PractitionerAvailabilityWindowWhereUniqueInput
    data: XOR<PractitionerAvailabilityWindowUpdateWithoutLocationInput, PractitionerAvailabilityWindowUncheckedUpdateWithoutLocationInput>
  }

  export type PractitionerAvailabilityWindowUpdateManyWithWhereWithoutLocationInput = {
    where: PractitionerAvailabilityWindowScalarWhereInput
    data: XOR<PractitionerAvailabilityWindowUpdateManyMutationInput, PractitionerAvailabilityWindowUncheckedUpdateManyWithoutLocationInput>
  }

  export type PractitionerLocationUpsertWithWhereUniqueWithoutLocationInput = {
    where: PractitionerLocationWhereUniqueInput
    update: XOR<PractitionerLocationUpdateWithoutLocationInput, PractitionerLocationUncheckedUpdateWithoutLocationInput>
    create: XOR<PractitionerLocationCreateWithoutLocationInput, PractitionerLocationUncheckedCreateWithoutLocationInput>
  }

  export type PractitionerLocationUpdateWithWhereUniqueWithoutLocationInput = {
    where: PractitionerLocationWhereUniqueInput
    data: XOR<PractitionerLocationUpdateWithoutLocationInput, PractitionerLocationUncheckedUpdateWithoutLocationInput>
  }

  export type PractitionerLocationUpdateManyWithWhereWithoutLocationInput = {
    where: PractitionerLocationScalarWhereInput
    data: XOR<PractitionerLocationUpdateManyMutationInput, PractitionerLocationUncheckedUpdateManyWithoutLocationInput>
  }

  export type PractitionerCreateWithoutPractitionerLocationsInput = {
    id?: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPractitionerInput
    slots?: SlotCreateNestedManyWithoutPractitionerInput
    appointments?: AppointmentCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerUncheckedCreateWithoutPractitionerLocationsInput = {
    id?: string
    userId: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotUncheckedCreateNestedManyWithoutPractitionerInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerCreateOrConnectWithoutPractitionerLocationsInput = {
    where: PractitionerWhereUniqueInput
    create: XOR<PractitionerCreateWithoutPractitionerLocationsInput, PractitionerUncheckedCreateWithoutPractitionerLocationsInput>
  }

  export type LocationCreateWithoutPractitionerLocationsInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotCreateNestedManyWithoutLocationInput
    patients?: PatientCreateNestedManyWithoutLocationInput
    availabilityWindows?: PractitionerAvailabilityWindowCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutPractitionerLocationsInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotUncheckedCreateNestedManyWithoutLocationInput
    patients?: PatientUncheckedCreateNestedManyWithoutLocationInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutPractitionerLocationsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutPractitionerLocationsInput, LocationUncheckedCreateWithoutPractitionerLocationsInput>
  }

  export type PractitionerUpsertWithoutPractitionerLocationsInput = {
    update: XOR<PractitionerUpdateWithoutPractitionerLocationsInput, PractitionerUncheckedUpdateWithoutPractitionerLocationsInput>
    create: XOR<PractitionerCreateWithoutPractitionerLocationsInput, PractitionerUncheckedCreateWithoutPractitionerLocationsInput>
    where?: PractitionerWhereInput
  }

  export type PractitionerUpdateToOneWithWhereWithoutPractitionerLocationsInput = {
    where?: PractitionerWhereInput
    data: XOR<PractitionerUpdateWithoutPractitionerLocationsInput, PractitionerUncheckedUpdateWithoutPractitionerLocationsInput>
  }

  export type PractitionerUpdateWithoutPractitionerLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPractitionerNestedInput
    slots?: SlotUpdateManyWithoutPractitionerNestedInput
    appointments?: AppointmentUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUpdateManyWithoutPractitionerNestedInput
  }

  export type PractitionerUncheckedUpdateWithoutPractitionerLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUncheckedUpdateManyWithoutPractitionerNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedUpdateManyWithoutPractitionerNestedInput
  }

  export type LocationUpsertWithoutPractitionerLocationsInput = {
    update: XOR<LocationUpdateWithoutPractitionerLocationsInput, LocationUncheckedUpdateWithoutPractitionerLocationsInput>
    create: XOR<LocationCreateWithoutPractitionerLocationsInput, LocationUncheckedCreateWithoutPractitionerLocationsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutPractitionerLocationsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutPractitionerLocationsInput, LocationUncheckedUpdateWithoutPractitionerLocationsInput>
  }

  export type LocationUpdateWithoutPractitionerLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUpdateManyWithoutLocationNestedInput
    patients?: PatientUpdateManyWithoutLocationNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutPractitionerLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUncheckedUpdateManyWithoutLocationNestedInput
    patients?: PatientUncheckedUpdateManyWithoutLocationNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type PractitionerCreateWithoutAvailabilityWindowsInput = {
    id?: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPractitionerInput
    slots?: SlotCreateNestedManyWithoutPractitionerInput
    appointments?: AppointmentCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerUncheckedCreateWithoutAvailabilityWindowsInput = {
    id?: string
    userId: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotUncheckedCreateNestedManyWithoutPractitionerInput
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationUncheckedCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerCreateOrConnectWithoutAvailabilityWindowsInput = {
    where: PractitionerWhereUniqueInput
    create: XOR<PractitionerCreateWithoutAvailabilityWindowsInput, PractitionerUncheckedCreateWithoutAvailabilityWindowsInput>
  }

  export type LocationCreateWithoutAvailabilityWindowsInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotCreateNestedManyWithoutLocationInput
    patients?: PatientCreateNestedManyWithoutLocationInput
    practitionerLocations?: PractitionerLocationCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutAvailabilityWindowsInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotUncheckedCreateNestedManyWithoutLocationInput
    patients?: PatientUncheckedCreateNestedManyWithoutLocationInput
    practitionerLocations?: PractitionerLocationUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutAvailabilityWindowsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutAvailabilityWindowsInput, LocationUncheckedCreateWithoutAvailabilityWindowsInput>
  }

  export type PractitionerUpsertWithoutAvailabilityWindowsInput = {
    update: XOR<PractitionerUpdateWithoutAvailabilityWindowsInput, PractitionerUncheckedUpdateWithoutAvailabilityWindowsInput>
    create: XOR<PractitionerCreateWithoutAvailabilityWindowsInput, PractitionerUncheckedCreateWithoutAvailabilityWindowsInput>
    where?: PractitionerWhereInput
  }

  export type PractitionerUpdateToOneWithWhereWithoutAvailabilityWindowsInput = {
    where?: PractitionerWhereInput
    data: XOR<PractitionerUpdateWithoutAvailabilityWindowsInput, PractitionerUncheckedUpdateWithoutAvailabilityWindowsInput>
  }

  export type PractitionerUpdateWithoutAvailabilityWindowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPractitionerNestedInput
    slots?: SlotUpdateManyWithoutPractitionerNestedInput
    appointments?: AppointmentUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUpdateManyWithoutPractitionerNestedInput
  }

  export type PractitionerUncheckedUpdateWithoutAvailabilityWindowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUncheckedUpdateManyWithoutPractitionerNestedInput
    appointments?: AppointmentUncheckedUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUncheckedUpdateManyWithoutPractitionerNestedInput
  }

  export type LocationUpsertWithoutAvailabilityWindowsInput = {
    update: XOR<LocationUpdateWithoutAvailabilityWindowsInput, LocationUncheckedUpdateWithoutAvailabilityWindowsInput>
    create: XOR<LocationCreateWithoutAvailabilityWindowsInput, LocationUncheckedCreateWithoutAvailabilityWindowsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutAvailabilityWindowsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutAvailabilityWindowsInput, LocationUncheckedUpdateWithoutAvailabilityWindowsInput>
  }

  export type LocationUpdateWithoutAvailabilityWindowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUpdateManyWithoutLocationNestedInput
    patients?: PatientUpdateManyWithoutLocationNestedInput
    practitionerLocations?: PractitionerLocationUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutAvailabilityWindowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUncheckedUpdateManyWithoutLocationNestedInput
    patients?: PatientUncheckedUpdateManyWithoutLocationNestedInput
    practitionerLocations?: PractitionerLocationUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type PractitionerCreateWithoutSlotsInput = {
    id?: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPractitionerInput
    appointments?: AppointmentCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerUncheckedCreateWithoutSlotsInput = {
    id?: string
    userId: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationUncheckedCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerCreateOrConnectWithoutSlotsInput = {
    where: PractitionerWhereUniqueInput
    create: XOR<PractitionerCreateWithoutSlotsInput, PractitionerUncheckedCreateWithoutSlotsInput>
  }

  export type LocationCreateWithoutSlotsInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patients?: PatientCreateNestedManyWithoutLocationInput
    availabilityWindows?: PractitionerAvailabilityWindowCreateNestedManyWithoutLocationInput
    practitionerLocations?: PractitionerLocationCreateNestedManyWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutSlotsInput = {
    id?: string
    name: string
    address?: string | null
    postcode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patients?: PatientUncheckedCreateNestedManyWithoutLocationInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutLocationInput
    practitionerLocations?: PractitionerLocationUncheckedCreateNestedManyWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutSlotsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutSlotsInput, LocationUncheckedCreateWithoutSlotsInput>
  }

  export type AppointmentCreateWithoutSlotInput = {
    id?: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutAppointmentsInput
    practitioner: PractitionerCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateWithoutSlotInput = {
    id?: string
    patientId: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    practitionerId: string
  }

  export type AppointmentCreateOrConnectWithoutSlotInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutSlotInput, AppointmentUncheckedCreateWithoutSlotInput>
  }

  export type PractitionerUpsertWithoutSlotsInput = {
    update: XOR<PractitionerUpdateWithoutSlotsInput, PractitionerUncheckedUpdateWithoutSlotsInput>
    create: XOR<PractitionerCreateWithoutSlotsInput, PractitionerUncheckedCreateWithoutSlotsInput>
    where?: PractitionerWhereInput
  }

  export type PractitionerUpdateToOneWithWhereWithoutSlotsInput = {
    where?: PractitionerWhereInput
    data: XOR<PractitionerUpdateWithoutSlotsInput, PractitionerUncheckedUpdateWithoutSlotsInput>
  }

  export type PractitionerUpdateWithoutSlotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPractitionerNestedInput
    appointments?: AppointmentUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUpdateManyWithoutPractitionerNestedInput
  }

  export type PractitionerUncheckedUpdateWithoutSlotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUncheckedUpdateManyWithoutPractitionerNestedInput
  }

  export type LocationUpsertWithoutSlotsInput = {
    update: XOR<LocationUpdateWithoutSlotsInput, LocationUncheckedUpdateWithoutSlotsInput>
    create: XOR<LocationCreateWithoutSlotsInput, LocationUncheckedCreateWithoutSlotsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutSlotsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutSlotsInput, LocationUncheckedUpdateWithoutSlotsInput>
  }

  export type LocationUpdateWithoutSlotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patients?: PatientUpdateManyWithoutLocationNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUpdateManyWithoutLocationNestedInput
    practitionerLocations?: PractitionerLocationUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutSlotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patients?: PatientUncheckedUpdateManyWithoutLocationNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedUpdateManyWithoutLocationNestedInput
    practitionerLocations?: PractitionerLocationUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type AppointmentUpsertWithoutSlotInput = {
    update: XOR<AppointmentUpdateWithoutSlotInput, AppointmentUncheckedUpdateWithoutSlotInput>
    create: XOR<AppointmentCreateWithoutSlotInput, AppointmentUncheckedCreateWithoutSlotInput>
    where?: AppointmentWhereInput
  }

  export type AppointmentUpdateToOneWithWhereWithoutSlotInput = {
    where?: AppointmentWhereInput
    data: XOR<AppointmentUpdateWithoutSlotInput, AppointmentUncheckedUpdateWithoutSlotInput>
  }

  export type AppointmentUpdateWithoutSlotInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutAppointmentsNestedInput
    practitioner?: PractitionerUpdateOneRequiredWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutSlotInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitionerId?: StringFieldUpdateOperationsInput | string
  }

  export type PatientCreateWithoutAppointmentsInput = {
    id?: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPatientInput
    location?: LocationCreateNestedOneWithoutPatientsInput
  }

  export type PatientUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    userId: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    locationId?: string | null
  }

  export type PatientCreateOrConnectWithoutAppointmentsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
  }

  export type SlotCreateWithoutAppointmentInput = {
    id?: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    practitioner: PractitionerCreateNestedOneWithoutSlotsInput
    location: LocationCreateNestedOneWithoutSlotsInput
  }

  export type SlotUncheckedCreateWithoutAppointmentInput = {
    id?: string
    practitionerId: string
    locationId: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SlotCreateOrConnectWithoutAppointmentInput = {
    where: SlotWhereUniqueInput
    create: XOR<SlotCreateWithoutAppointmentInput, SlotUncheckedCreateWithoutAppointmentInput>
  }

  export type PractitionerCreateWithoutAppointmentsInput = {
    id?: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPractitionerInput
    slots?: SlotCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    userId: string
    title?: string | null
    gmcNumber?: string | null
    speciality?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    slots?: SlotUncheckedCreateNestedManyWithoutPractitionerInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedCreateNestedManyWithoutPractitionerInput
    practitionerLocations?: PractitionerLocationUncheckedCreateNestedManyWithoutPractitionerInput
  }

  export type PractitionerCreateOrConnectWithoutAppointmentsInput = {
    where: PractitionerWhereUniqueInput
    create: XOR<PractitionerCreateWithoutAppointmentsInput, PractitionerUncheckedCreateWithoutAppointmentsInput>
  }

  export type PatientUpsertWithoutAppointmentsInput = {
    update: XOR<PatientUpdateWithoutAppointmentsInput, PatientUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutAppointmentsInput, PatientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PatientUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPatientNestedInput
    location?: LocationUpdateOneWithoutPatientsNestedInput
  }

  export type PatientUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SlotUpsertWithoutAppointmentInput = {
    update: XOR<SlotUpdateWithoutAppointmentInput, SlotUncheckedUpdateWithoutAppointmentInput>
    create: XOR<SlotCreateWithoutAppointmentInput, SlotUncheckedCreateWithoutAppointmentInput>
    where?: SlotWhereInput
  }

  export type SlotUpdateToOneWithWhereWithoutAppointmentInput = {
    where?: SlotWhereInput
    data: XOR<SlotUpdateWithoutAppointmentInput, SlotUncheckedUpdateWithoutAppointmentInput>
  }

  export type SlotUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitioner?: PractitionerUpdateOneRequiredWithoutSlotsNestedInput
    location?: LocationUpdateOneRequiredWithoutSlotsNestedInput
  }

  export type SlotUncheckedUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerUpsertWithoutAppointmentsInput = {
    update: XOR<PractitionerUpdateWithoutAppointmentsInput, PractitionerUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<PractitionerCreateWithoutAppointmentsInput, PractitionerUncheckedCreateWithoutAppointmentsInput>
    where?: PractitionerWhereInput
  }

  export type PractitionerUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: PractitionerWhereInput
    data: XOR<PractitionerUpdateWithoutAppointmentsInput, PractitionerUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PractitionerUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPractitionerNestedInput
    slots?: SlotUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUpdateManyWithoutPractitionerNestedInput
  }

  export type PractitionerUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    gmcNumber?: NullableStringFieldUpdateOperationsInput | string | null
    speciality?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slots?: SlotUncheckedUpdateManyWithoutPractitionerNestedInput
    availabilityWindows?: PractitionerAvailabilityWindowUncheckedUpdateManyWithoutPractitionerNestedInput
    practitionerLocations?: PractitionerLocationUncheckedUpdateManyWithoutPractitionerNestedInput
  }

  export type AppointmentCreateManyPatientInput = {
    id?: string
    slotId: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    practitionerId: string
  }

  export type AppointmentUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slot?: SlotUpdateOneRequiredWithoutAppointmentNestedInput
    practitioner?: PractitionerUpdateOneRequiredWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    slotId?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitionerId?: StringFieldUpdateOperationsInput | string
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    slotId?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitionerId?: StringFieldUpdateOperationsInput | string
  }

  export type SlotCreateManyPractitionerInput = {
    id?: string
    locationId: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateManyPractitionerInput = {
    id?: string
    patientId: string
    slotId: string
    status?: $Enums.AppointmentStatus
    reason?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PractitionerAvailabilityWindowCreateManyPractitionerInput = {
    id?: string
    locationId: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin?: number
  }

  export type PractitionerLocationCreateManyPractitionerInput = {
    id?: string
    locationId: string
    createdAt?: Date | string
  }

  export type SlotUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: LocationUpdateOneRequiredWithoutSlotsNestedInput
    appointment?: AppointmentUpdateOneWithoutSlotNestedInput
  }

  export type SlotUncheckedUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUncheckedUpdateOneWithoutSlotNestedInput
  }

  export type SlotUncheckedUpdateManyWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutAppointmentsNestedInput
    slot?: SlotUpdateOneRequiredWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    slotId?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    slotId?: StringFieldUpdateOperationsInput | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerAvailabilityWindowUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
    location?: LocationUpdateOneRequiredWithoutAvailabilityWindowsNestedInput
  }

  export type PractitionerAvailabilityWindowUncheckedUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type PractitionerAvailabilityWindowUncheckedUpdateManyWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type PractitionerLocationUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    location?: LocationUpdateOneRequiredWithoutPractitionerLocationsNestedInput
  }

  export type PractitionerLocationUncheckedUpdateWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerLocationUncheckedUpdateManyWithoutPractitionerInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SlotCreateManyLocationInput = {
    id?: string
    practitionerId: string
    startAt: Date | string
    endAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientCreateManyLocationInput = {
    id?: string
    userId: string
    nhsNumber: string
    dateOfBirth: Date | string
    addressLine1?: string | null
    addressLine2?: string | null
    postcode?: string | null
    gpSurgeryName?: string | null
    gpSurgeryCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PractitionerAvailabilityWindowCreateManyLocationInput = {
    id?: string
    practitionerId: string
    dayOfWeek: number
    windowStartMin: number
    windowEndMin: number
    slotDurationMin?: number
  }

  export type PractitionerLocationCreateManyLocationInput = {
    id?: string
    practitionerId: string
    createdAt?: Date | string
  }

  export type SlotUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitioner?: PractitionerUpdateOneRequiredWithoutSlotsNestedInput
    appointment?: AppointmentUpdateOneWithoutSlotNestedInput
  }

  export type SlotUncheckedUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUncheckedUpdateOneWithoutSlotNestedInput
  }

  export type SlotUncheckedUpdateManyWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    startAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPatientNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateManyWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nhsNumber?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    postcode?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryName?: NullableStringFieldUpdateOperationsInput | string | null
    gpSurgeryCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerAvailabilityWindowUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
    practitioner?: PractitionerUpdateOneRequiredWithoutAvailabilityWindowsNestedInput
  }

  export type PractitionerAvailabilityWindowUncheckedUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type PractitionerAvailabilityWindowUncheckedUpdateManyWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    windowStartMin?: IntFieldUpdateOperationsInput | number
    windowEndMin?: IntFieldUpdateOperationsInput | number
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type PractitionerLocationUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    practitioner?: PractitionerUpdateOneRequiredWithoutPractitionerLocationsNestedInput
  }

  export type PractitionerLocationUncheckedUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PractitionerLocationUncheckedUpdateManyWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    practitionerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



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
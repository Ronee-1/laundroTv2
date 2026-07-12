import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.8.0
 * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: runtime.DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: runtime.JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
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
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
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
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly Branch: "Branch";
    readonly CashBookEntry: "CashBookEntry";
    readonly Courier: "Courier";
    readonly Order: "Order";
    readonly Expense: "Expense";
    readonly MonthlyBudget: "MonthlyBudget";
    readonly InventoryItem: "InventoryItem";
    readonly ReconciliationLog: "ReconciliationLog";
    readonly RestockRequest: "RestockRequest";
    readonly LogisticsLog: "LogisticsLog";
    readonly ServiceTariff: "ServiceTariff";
    readonly ExpenseCategory: "ExpenseCategory";
    readonly CourierTaskSequence: "CourierTaskSequence";
    readonly InventoryAnomaly: "InventoryAnomaly";
    readonly Customer: "Customer";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "branch" | "cashBookEntry" | "courier" | "order" | "expense" | "monthlyBudget" | "inventoryItem" | "reconciliationLog" | "restockRequest" | "logisticsLog" | "serviceTariff" | "expenseCategory" | "courierTaskSequence" | "inventoryAnomaly" | "customer";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Branch: {
            payload: Prisma.$BranchPayload<ExtArgs>;
            fields: Prisma.BranchFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BranchFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BranchFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                findFirst: {
                    args: Prisma.BranchFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BranchFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                findMany: {
                    args: Prisma.BranchFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>[];
                };
                create: {
                    args: Prisma.BranchCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                createMany: {
                    args: Prisma.BranchCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BranchCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>[];
                };
                delete: {
                    args: Prisma.BranchDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                update: {
                    args: Prisma.BranchUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                deleteMany: {
                    args: Prisma.BranchDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BranchUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BranchUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>[];
                };
                upsert: {
                    args: Prisma.BranchUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                aggregate: {
                    args: Prisma.BranchAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBranch>;
                };
                groupBy: {
                    args: Prisma.BranchGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BranchGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BranchCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BranchCountAggregateOutputType> | number;
                };
            };
        };
        CashBookEntry: {
            payload: Prisma.$CashBookEntryPayload<ExtArgs>;
            fields: Prisma.CashBookEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CashBookEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CashBookEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload>;
                };
                findFirst: {
                    args: Prisma.CashBookEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CashBookEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload>;
                };
                findMany: {
                    args: Prisma.CashBookEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload>[];
                };
                create: {
                    args: Prisma.CashBookEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload>;
                };
                createMany: {
                    args: Prisma.CashBookEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CashBookEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload>[];
                };
                delete: {
                    args: Prisma.CashBookEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload>;
                };
                update: {
                    args: Prisma.CashBookEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.CashBookEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CashBookEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CashBookEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload>[];
                };
                upsert: {
                    args: Prisma.CashBookEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashBookEntryPayload>;
                };
                aggregate: {
                    args: Prisma.CashBookEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCashBookEntry>;
                };
                groupBy: {
                    args: Prisma.CashBookEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CashBookEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CashBookEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CashBookEntryCountAggregateOutputType> | number;
                };
            };
        };
        Courier: {
            payload: Prisma.$CourierPayload<ExtArgs>;
            fields: Prisma.CourierFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourierFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourierFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload>;
                };
                findFirst: {
                    args: Prisma.CourierFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourierFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload>;
                };
                findMany: {
                    args: Prisma.CourierFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload>[];
                };
                create: {
                    args: Prisma.CourierCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload>;
                };
                createMany: {
                    args: Prisma.CourierCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourierCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload>[];
                };
                delete: {
                    args: Prisma.CourierDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload>;
                };
                update: {
                    args: Prisma.CourierUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload>;
                };
                deleteMany: {
                    args: Prisma.CourierDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourierUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourierUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload>[];
                };
                upsert: {
                    args: Prisma.CourierUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierPayload>;
                };
                aggregate: {
                    args: Prisma.CourierAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourier>;
                };
                groupBy: {
                    args: Prisma.CourierGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourierGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourierCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourierCountAggregateOutputType> | number;
                };
            };
        };
        Order: {
            payload: Prisma.$OrderPayload<ExtArgs>;
            fields: Prisma.OrderFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrderFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrderFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                findFirst: {
                    args: Prisma.OrderFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrderFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                findMany: {
                    args: Prisma.OrderFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>[];
                };
                create: {
                    args: Prisma.OrderCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                createMany: {
                    args: Prisma.OrderCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OrderCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>[];
                };
                delete: {
                    args: Prisma.OrderDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                update: {
                    args: Prisma.OrderUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                deleteMany: {
                    args: Prisma.OrderDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrderUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OrderUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>[];
                };
                upsert: {
                    args: Prisma.OrderUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrderPayload>;
                };
                aggregate: {
                    args: Prisma.OrderAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrder>;
                };
                groupBy: {
                    args: Prisma.OrderGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrderCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrderCountAggregateOutputType> | number;
                };
            };
        };
        Expense: {
            payload: Prisma.$ExpensePayload<ExtArgs>;
            fields: Prisma.ExpenseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ExpenseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ExpenseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                findFirst: {
                    args: Prisma.ExpenseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ExpenseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                findMany: {
                    args: Prisma.ExpenseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>[];
                };
                create: {
                    args: Prisma.ExpenseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                createMany: {
                    args: Prisma.ExpenseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ExpenseCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>[];
                };
                delete: {
                    args: Prisma.ExpenseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                update: {
                    args: Prisma.ExpenseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                deleteMany: {
                    args: Prisma.ExpenseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ExpenseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ExpenseUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>[];
                };
                upsert: {
                    args: Prisma.ExpenseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                aggregate: {
                    args: Prisma.ExpenseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateExpense>;
                };
                groupBy: {
                    args: Prisma.ExpenseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpenseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ExpenseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpenseCountAggregateOutputType> | number;
                };
            };
        };
        MonthlyBudget: {
            payload: Prisma.$MonthlyBudgetPayload<ExtArgs>;
            fields: Prisma.MonthlyBudgetFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MonthlyBudgetFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MonthlyBudgetFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload>;
                };
                findFirst: {
                    args: Prisma.MonthlyBudgetFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MonthlyBudgetFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload>;
                };
                findMany: {
                    args: Prisma.MonthlyBudgetFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload>[];
                };
                create: {
                    args: Prisma.MonthlyBudgetCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload>;
                };
                createMany: {
                    args: Prisma.MonthlyBudgetCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MonthlyBudgetCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload>[];
                };
                delete: {
                    args: Prisma.MonthlyBudgetDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload>;
                };
                update: {
                    args: Prisma.MonthlyBudgetUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload>;
                };
                deleteMany: {
                    args: Prisma.MonthlyBudgetDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MonthlyBudgetUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MonthlyBudgetUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload>[];
                };
                upsert: {
                    args: Prisma.MonthlyBudgetUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MonthlyBudgetPayload>;
                };
                aggregate: {
                    args: Prisma.MonthlyBudgetAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMonthlyBudget>;
                };
                groupBy: {
                    args: Prisma.MonthlyBudgetGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MonthlyBudgetGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MonthlyBudgetCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MonthlyBudgetCountAggregateOutputType> | number;
                };
            };
        };
        InventoryItem: {
            payload: Prisma.$InventoryItemPayload<ExtArgs>;
            fields: Prisma.InventoryItemFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InventoryItemFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InventoryItemFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                findFirst: {
                    args: Prisma.InventoryItemFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InventoryItemFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                findMany: {
                    args: Prisma.InventoryItemFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>[];
                };
                create: {
                    args: Prisma.InventoryItemCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                createMany: {
                    args: Prisma.InventoryItemCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InventoryItemCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>[];
                };
                delete: {
                    args: Prisma.InventoryItemDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                update: {
                    args: Prisma.InventoryItemUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                deleteMany: {
                    args: Prisma.InventoryItemDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InventoryItemUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InventoryItemUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>[];
                };
                upsert: {
                    args: Prisma.InventoryItemUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                aggregate: {
                    args: Prisma.InventoryItemAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInventoryItem>;
                };
                groupBy: {
                    args: Prisma.InventoryItemGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InventoryItemGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InventoryItemCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InventoryItemCountAggregateOutputType> | number;
                };
            };
        };
        ReconciliationLog: {
            payload: Prisma.$ReconciliationLogPayload<ExtArgs>;
            fields: Prisma.ReconciliationLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ReconciliationLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ReconciliationLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload>;
                };
                findFirst: {
                    args: Prisma.ReconciliationLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ReconciliationLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload>;
                };
                findMany: {
                    args: Prisma.ReconciliationLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload>[];
                };
                create: {
                    args: Prisma.ReconciliationLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload>;
                };
                createMany: {
                    args: Prisma.ReconciliationLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ReconciliationLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload>[];
                };
                delete: {
                    args: Prisma.ReconciliationLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload>;
                };
                update: {
                    args: Prisma.ReconciliationLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload>;
                };
                deleteMany: {
                    args: Prisma.ReconciliationLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ReconciliationLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ReconciliationLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload>[];
                };
                upsert: {
                    args: Prisma.ReconciliationLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReconciliationLogPayload>;
                };
                aggregate: {
                    args: Prisma.ReconciliationLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReconciliationLog>;
                };
                groupBy: {
                    args: Prisma.ReconciliationLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReconciliationLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ReconciliationLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReconciliationLogCountAggregateOutputType> | number;
                };
            };
        };
        RestockRequest: {
            payload: Prisma.$RestockRequestPayload<ExtArgs>;
            fields: Prisma.RestockRequestFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RestockRequestFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RestockRequestFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload>;
                };
                findFirst: {
                    args: Prisma.RestockRequestFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RestockRequestFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload>;
                };
                findMany: {
                    args: Prisma.RestockRequestFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload>[];
                };
                create: {
                    args: Prisma.RestockRequestCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload>;
                };
                createMany: {
                    args: Prisma.RestockRequestCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RestockRequestCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload>[];
                };
                delete: {
                    args: Prisma.RestockRequestDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload>;
                };
                update: {
                    args: Prisma.RestockRequestUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload>;
                };
                deleteMany: {
                    args: Prisma.RestockRequestDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RestockRequestUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RestockRequestUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload>[];
                };
                upsert: {
                    args: Prisma.RestockRequestUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RestockRequestPayload>;
                };
                aggregate: {
                    args: Prisma.RestockRequestAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRestockRequest>;
                };
                groupBy: {
                    args: Prisma.RestockRequestGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RestockRequestGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RestockRequestCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RestockRequestCountAggregateOutputType> | number;
                };
            };
        };
        LogisticsLog: {
            payload: Prisma.$LogisticsLogPayload<ExtArgs>;
            fields: Prisma.LogisticsLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LogisticsLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LogisticsLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload>;
                };
                findFirst: {
                    args: Prisma.LogisticsLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LogisticsLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload>;
                };
                findMany: {
                    args: Prisma.LogisticsLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload>[];
                };
                create: {
                    args: Prisma.LogisticsLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload>;
                };
                createMany: {
                    args: Prisma.LogisticsLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LogisticsLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload>[];
                };
                delete: {
                    args: Prisma.LogisticsLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload>;
                };
                update: {
                    args: Prisma.LogisticsLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload>;
                };
                deleteMany: {
                    args: Prisma.LogisticsLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LogisticsLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LogisticsLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload>[];
                };
                upsert: {
                    args: Prisma.LogisticsLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogisticsLogPayload>;
                };
                aggregate: {
                    args: Prisma.LogisticsLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLogisticsLog>;
                };
                groupBy: {
                    args: Prisma.LogisticsLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LogisticsLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LogisticsLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LogisticsLogCountAggregateOutputType> | number;
                };
            };
        };
        ServiceTariff: {
            payload: Prisma.$ServiceTariffPayload<ExtArgs>;
            fields: Prisma.ServiceTariffFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ServiceTariffFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ServiceTariffFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload>;
                };
                findFirst: {
                    args: Prisma.ServiceTariffFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ServiceTariffFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload>;
                };
                findMany: {
                    args: Prisma.ServiceTariffFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload>[];
                };
                create: {
                    args: Prisma.ServiceTariffCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload>;
                };
                createMany: {
                    args: Prisma.ServiceTariffCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ServiceTariffCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload>[];
                };
                delete: {
                    args: Prisma.ServiceTariffDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload>;
                };
                update: {
                    args: Prisma.ServiceTariffUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload>;
                };
                deleteMany: {
                    args: Prisma.ServiceTariffDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ServiceTariffUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ServiceTariffUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload>[];
                };
                upsert: {
                    args: Prisma.ServiceTariffUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ServiceTariffPayload>;
                };
                aggregate: {
                    args: Prisma.ServiceTariffAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateServiceTariff>;
                };
                groupBy: {
                    args: Prisma.ServiceTariffGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ServiceTariffGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ServiceTariffCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ServiceTariffCountAggregateOutputType> | number;
                };
            };
        };
        ExpenseCategory: {
            payload: Prisma.$ExpenseCategoryPayload<ExtArgs>;
            fields: Prisma.ExpenseCategoryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ExpenseCategoryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ExpenseCategoryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload>;
                };
                findFirst: {
                    args: Prisma.ExpenseCategoryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ExpenseCategoryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload>;
                };
                findMany: {
                    args: Prisma.ExpenseCategoryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload>[];
                };
                create: {
                    args: Prisma.ExpenseCategoryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload>;
                };
                createMany: {
                    args: Prisma.ExpenseCategoryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ExpenseCategoryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload>[];
                };
                delete: {
                    args: Prisma.ExpenseCategoryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload>;
                };
                update: {
                    args: Prisma.ExpenseCategoryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload>;
                };
                deleteMany: {
                    args: Prisma.ExpenseCategoryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ExpenseCategoryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ExpenseCategoryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload>[];
                };
                upsert: {
                    args: Prisma.ExpenseCategoryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpenseCategoryPayload>;
                };
                aggregate: {
                    args: Prisma.ExpenseCategoryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateExpenseCategory>;
                };
                groupBy: {
                    args: Prisma.ExpenseCategoryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpenseCategoryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ExpenseCategoryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpenseCategoryCountAggregateOutputType> | number;
                };
            };
        };
        CourierTaskSequence: {
            payload: Prisma.$CourierTaskSequencePayload<ExtArgs>;
            fields: Prisma.CourierTaskSequenceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourierTaskSequenceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourierTaskSequenceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload>;
                };
                findFirst: {
                    args: Prisma.CourierTaskSequenceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourierTaskSequenceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload>;
                };
                findMany: {
                    args: Prisma.CourierTaskSequenceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload>[];
                };
                create: {
                    args: Prisma.CourierTaskSequenceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload>;
                };
                createMany: {
                    args: Prisma.CourierTaskSequenceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourierTaskSequenceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload>[];
                };
                delete: {
                    args: Prisma.CourierTaskSequenceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload>;
                };
                update: {
                    args: Prisma.CourierTaskSequenceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload>;
                };
                deleteMany: {
                    args: Prisma.CourierTaskSequenceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourierTaskSequenceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourierTaskSequenceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload>[];
                };
                upsert: {
                    args: Prisma.CourierTaskSequenceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourierTaskSequencePayload>;
                };
                aggregate: {
                    args: Prisma.CourierTaskSequenceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourierTaskSequence>;
                };
                groupBy: {
                    args: Prisma.CourierTaskSequenceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourierTaskSequenceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourierTaskSequenceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourierTaskSequenceCountAggregateOutputType> | number;
                };
            };
        };
        InventoryAnomaly: {
            payload: Prisma.$InventoryAnomalyPayload<ExtArgs>;
            fields: Prisma.InventoryAnomalyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InventoryAnomalyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InventoryAnomalyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload>;
                };
                findFirst: {
                    args: Prisma.InventoryAnomalyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InventoryAnomalyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload>;
                };
                findMany: {
                    args: Prisma.InventoryAnomalyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload>[];
                };
                create: {
                    args: Prisma.InventoryAnomalyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload>;
                };
                createMany: {
                    args: Prisma.InventoryAnomalyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InventoryAnomalyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload>[];
                };
                delete: {
                    args: Prisma.InventoryAnomalyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload>;
                };
                update: {
                    args: Prisma.InventoryAnomalyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload>;
                };
                deleteMany: {
                    args: Prisma.InventoryAnomalyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InventoryAnomalyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InventoryAnomalyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload>[];
                };
                upsert: {
                    args: Prisma.InventoryAnomalyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryAnomalyPayload>;
                };
                aggregate: {
                    args: Prisma.InventoryAnomalyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInventoryAnomaly>;
                };
                groupBy: {
                    args: Prisma.InventoryAnomalyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InventoryAnomalyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InventoryAnomalyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InventoryAnomalyCountAggregateOutputType> | number;
                };
            };
        };
        Customer: {
            payload: Prisma.$CustomerPayload<ExtArgs>;
            fields: Prisma.CustomerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findMany: {
                    args: Prisma.CustomerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                create: {
                    args: Prisma.CustomerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                createMany: {
                    args: Prisma.CustomerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                delete: {
                    args: Prisma.CustomerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                update: {
                    args: Prisma.CustomerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                upsert: {
                    args: Prisma.CustomerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomer>;
                };
                groupBy: {
                    args: Prisma.CustomerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id_user: "id_user";
    readonly nama: "nama";
    readonly email: "email";
    readonly password: "password";
    readonly role: "role";
    readonly id_cabang: "id_cabang";
    readonly is_active: "is_active";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const BranchScalarFieldEnum: {
    readonly id_cabang: "id_cabang";
    readonly nama_cabang: "nama_cabang";
    readonly alamat: "alamat";
    readonly latitude: "latitude";
    readonly longitude: "longitude";
    readonly kuota_harian: "kuota_harian";
    readonly kuota_terpakai: "kuota_terpakai";
    readonly is_active: "is_active";
    readonly omzet: "omzet";
    readonly wilayah: "wilayah";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type BranchScalarFieldEnum = (typeof BranchScalarFieldEnum)[keyof typeof BranchScalarFieldEnum];
export declare const CashBookEntryScalarFieldEnum: {
    readonly id_jurnal: "id_jurnal";
    readonly id_cabang: "id_cabang";
    readonly id_transaksi: "id_transaksi";
    readonly nominal: "nominal";
    readonly tipe: "tipe";
    readonly deskripsi: "deskripsi";
    readonly tanggal_jurnal: "tanggal_jurnal";
    readonly created_at: "created_at";
};
export type CashBookEntryScalarFieldEnum = (typeof CashBookEntryScalarFieldEnum)[keyof typeof CashBookEntryScalarFieldEnum];
export declare const CourierScalarFieldEnum: {
    readonly id_kurir: "id_kurir";
    readonly id_cabang: "id_cabang";
    readonly nama_kurir: "nama_kurir";
    readonly nomor_telepon: "nomor_telepon";
    readonly is_available: "is_available";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type CourierScalarFieldEnum = (typeof CourierScalarFieldEnum)[keyof typeof CourierScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id_order: "id_order";
    readonly id_cabang: "id_cabang";
    readonly id_pelanggan: "id_pelanggan";
    readonly id_kurir: "id_kurir";
    readonly alamat_penjemputan: "alamat_penjemputan";
    readonly alamat_pengantaran: "alamat_pengantaran";
    readonly latitude_penjemputan: "latitude_penjemputan";
    readonly longitude_penjemputan: "longitude_penjemputan";
    readonly latitude_pengantaran: "latitude_pengantaran";
    readonly longitude_pengantaran: "longitude_pengantaran";
    readonly status: "status";
    readonly catatan: "catatan";
    readonly berat_kg: "berat_kg";
    readonly total_harga: "total_harga";
    readonly tanggal_order: "tanggal_order";
    readonly tanggal_selesai: "tanggal_selesai";
    readonly customer_name: "customer_name";
    readonly customer_whatsapp: "customer_whatsapp";
    readonly service_type: "service_type";
    readonly service_name: "service_name";
    readonly qty: "qty";
    readonly satuan: "satuan";
    readonly wilayah: "wilayah";
    readonly google_maps_url: "google_maps_url";
    readonly source: "source";
    readonly assigned_by: "assigned_by";
    readonly assigned_at: "assigned_at";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const ExpenseScalarFieldEnum: {
    readonly id_expense: "id_expense";
    readonly id_cabang: "id_cabang";
    readonly tanggal: "tanggal";
    readonly nominal: "nominal";
    readonly deskripsi: "deskripsi";
    readonly kategori: "kategori";
    readonly bukti_nota_url: "bukti_nota_url";
    readonly status: "status";
    readonly tanggal_pengajuan: "tanggal_pengajuan";
    readonly tanggal_approval: "tanggal_approval";
    readonly catatan_approval: "catatan_approval";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type ExpenseScalarFieldEnum = (typeof ExpenseScalarFieldEnum)[keyof typeof ExpenseScalarFieldEnum];
export declare const MonthlyBudgetScalarFieldEnum: {
    readonly id: "id";
    readonly id_cabang: "id_cabang";
    readonly bulan: "bulan";
    readonly tahun: "tahun";
    readonly pagu_anggaran: "pagu_anggaran";
    readonly terpakai: "terpakai";
};
export type MonthlyBudgetScalarFieldEnum = (typeof MonthlyBudgetScalarFieldEnum)[keyof typeof MonthlyBudgetScalarFieldEnum];
export declare const InventoryItemScalarFieldEnum: {
    readonly id: "id";
    readonly id_cabang: "id_cabang";
    readonly item: "item";
    readonly satuan: "satuan";
    readonly stok_saat_ini: "stok_saat_ini";
    readonly safety_threshold: "safety_threshold";
    readonly max_capacity: "max_capacity";
};
export type InventoryItemScalarFieldEnum = (typeof InventoryItemScalarFieldEnum)[keyof typeof InventoryItemScalarFieldEnum];
export declare const ReconciliationLogScalarFieldEnum: {
    readonly id_rekonsiliasi: "id_rekonsiliasi";
    readonly id_cabang: "id_cabang";
    readonly tanggal: "tanggal";
    readonly kas_digital: "kas_digital";
    readonly kas_fisik: "kas_fisik";
    readonly selisih: "selisih";
    readonly status: "status";
    readonly approval_status: "approval_status";
    readonly catatan: "catatan";
    readonly catatan_owner: "catatan_owner";
    readonly created_at: "created_at";
};
export type ReconciliationLogScalarFieldEnum = (typeof ReconciliationLogScalarFieldEnum)[keyof typeof ReconciliationLogScalarFieldEnum];
export declare const RestockRequestScalarFieldEnum: {
    readonly id_request: "id_request";
    readonly id_cabang: "id_cabang";
    readonly nama_cabang: "nama_cabang";
    readonly created_by: "created_by";
    readonly requested_items: "requested_items";
    readonly status: "status";
    readonly catatan: "catatan";
    readonly reviewed_by: "reviewed_by";
    readonly reviewed_at: "reviewed_at";
    readonly created_at: "created_at";
};
export type RestockRequestScalarFieldEnum = (typeof RestockRequestScalarFieldEnum)[keyof typeof RestockRequestScalarFieldEnum];
export declare const LogisticsLogScalarFieldEnum: {
    readonly id: "id";
    readonly id_cabang: "id_cabang";
    readonly sent_items: "sent_items";
    readonly received_items: "received_items";
    readonly discrepancy: "discrepancy";
    readonly status: "status";
    readonly timestamp: "timestamp";
};
export type LogisticsLogScalarFieldEnum = (typeof LogisticsLogScalarFieldEnum)[keyof typeof LogisticsLogScalarFieldEnum];
export declare const ServiceTariffScalarFieldEnum: {
    readonly id_layanan: "id_layanan";
    readonly nama_layanan: "nama_layanan";
    readonly kategori: "kategori";
    readonly satuan: "satuan";
    readonly harga_per_satuan: "harga_per_satuan";
    readonly estimasi_hari: "estimasi_hari";
    readonly is_active: "is_active";
};
export type ServiceTariffScalarFieldEnum = (typeof ServiceTariffScalarFieldEnum)[keyof typeof ServiceTariffScalarFieldEnum];
export declare const ExpenseCategoryScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
};
export type ExpenseCategoryScalarFieldEnum = (typeof ExpenseCategoryScalarFieldEnum)[keyof typeof ExpenseCategoryScalarFieldEnum];
export declare const CourierTaskSequenceScalarFieldEnum: {
    readonly id: "id";
    readonly id_kurir: "id_kurir";
    readonly id_order: "id_order";
    readonly urutan: "urutan";
};
export type CourierTaskSequenceScalarFieldEnum = (typeof CourierTaskSequenceScalarFieldEnum)[keyof typeof CourierTaskSequenceScalarFieldEnum];
export declare const InventoryAnomalyScalarFieldEnum: {
    readonly id: "id";
    readonly id_cabang: "id_cabang";
    readonly nama_cabang: "nama_cabang";
    readonly item: "item";
    readonly stok_lama: "stok_lama";
    readonly stok_baru: "stok_baru";
    readonly alasan: "alasan";
    readonly timestamp: "timestamp";
};
export type InventoryAnomalyScalarFieldEnum = (typeof InventoryAnomalyScalarFieldEnum)[keyof typeof InventoryAnomalyScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id_pelanggan: "id_pelanggan";
    readonly id_cabang: "id_cabang";
    readonly nama: "nama";
    readonly whatsapp: "whatsapp";
    readonly alamat_maps: "alamat_maps";
    readonly google_maps_url: "google_maps_url";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
/**
 * Field references
 */
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'String[]'
 */
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
/**
 * Reference to a field of type 'UserRole'
 */
export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;
/**
 * Reference to a field of type 'UserRole[]'
 */
export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'DateTime[]'
 */
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Reference to a field of type 'Float[]'
 */
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Int[]'
 */
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
/**
 * Reference to a field of type 'Json'
 */
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
/**
 * Reference to a field of type 'QueryMode'
 */
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl: string;
    adapter?: never;
}) & {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
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
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
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
    omit?: GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
    /**
     * Optional maximum size for the query plan cache. If not provided, a default size will be used.
     * A value of `0` can be used to disable the cache entirely. A higher cache size can improve
     * performance for applications that execute a large number of unique queries, while a smaller
     * cache size can reduce memory usage.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   queryPlanCacheMaxSize: 100,
     * })
     * ```
     */
    queryPlanCacheMaxSize?: number;
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    branch?: Prisma.BranchOmit;
    cashBookEntry?: Prisma.CashBookEntryOmit;
    courier?: Prisma.CourierOmit;
    order?: Prisma.OrderOmit;
    expense?: Prisma.ExpenseOmit;
    monthlyBudget?: Prisma.MonthlyBudgetOmit;
    inventoryItem?: Prisma.InventoryItemOmit;
    reconciliationLog?: Prisma.ReconciliationLogOmit;
    restockRequest?: Prisma.RestockRequestOmit;
    logisticsLog?: Prisma.LogisticsLogOmit;
    serviceTariff?: Prisma.ServiceTariffOmit;
    expenseCategory?: Prisma.ExpenseCategoryOmit;
    courierTaskSequence?: Prisma.CourierTaskSequenceOmit;
    inventoryAnomaly?: Prisma.InventoryAnomalyOmit;
    customer?: Prisma.CustomerOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map
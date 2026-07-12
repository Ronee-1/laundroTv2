import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
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
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
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
     * Read more in our [docs](https://pris.ly/d/raw-queries).
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
     * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.branch`: Exposes CRUD operations for the **Branch** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Branches
      * const branches = await prisma.branch.findMany()
      * ```
      */
    get branch(): Prisma.BranchDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.cashBookEntry`: Exposes CRUD operations for the **CashBookEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CashBookEntries
      * const cashBookEntries = await prisma.cashBookEntry.findMany()
      * ```
      */
    get cashBookEntry(): Prisma.CashBookEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courier`: Exposes CRUD operations for the **Courier** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Couriers
      * const couriers = await prisma.courier.findMany()
      * ```
      */
    get courier(): Prisma.CourierDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.order`: Exposes CRUD operations for the **Order** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Orders
      * const orders = await prisma.order.findMany()
      * ```
      */
    get order(): Prisma.OrderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.expense`: Exposes CRUD operations for the **Expense** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Expenses
      * const expenses = await prisma.expense.findMany()
      * ```
      */
    get expense(): Prisma.ExpenseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.monthlyBudget`: Exposes CRUD operations for the **MonthlyBudget** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MonthlyBudgets
      * const monthlyBudgets = await prisma.monthlyBudget.findMany()
      * ```
      */
    get monthlyBudget(): Prisma.MonthlyBudgetDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inventoryItem`: Exposes CRUD operations for the **InventoryItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InventoryItems
      * const inventoryItems = await prisma.inventoryItem.findMany()
      * ```
      */
    get inventoryItem(): Prisma.InventoryItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.reconciliationLog`: Exposes CRUD operations for the **ReconciliationLog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ReconciliationLogs
      * const reconciliationLogs = await prisma.reconciliationLog.findMany()
      * ```
      */
    get reconciliationLog(): Prisma.ReconciliationLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.restockRequest`: Exposes CRUD operations for the **RestockRequest** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RestockRequests
      * const restockRequests = await prisma.restockRequest.findMany()
      * ```
      */
    get restockRequest(): Prisma.RestockRequestDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.logisticsLog`: Exposes CRUD operations for the **LogisticsLog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LogisticsLogs
      * const logisticsLogs = await prisma.logisticsLog.findMany()
      * ```
      */
    get logisticsLog(): Prisma.LogisticsLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.serviceTariff`: Exposes CRUD operations for the **ServiceTariff** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ServiceTariffs
      * const serviceTariffs = await prisma.serviceTariff.findMany()
      * ```
      */
    get serviceTariff(): Prisma.ServiceTariffDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.expenseCategory`: Exposes CRUD operations for the **ExpenseCategory** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ExpenseCategories
      * const expenseCategories = await prisma.expenseCategory.findMany()
      * ```
      */
    get expenseCategory(): Prisma.ExpenseCategoryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courierTaskSequence`: Exposes CRUD operations for the **CourierTaskSequence** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourierTaskSequences
      * const courierTaskSequences = await prisma.courierTaskSequence.findMany()
      * ```
      */
    get courierTaskSequence(): Prisma.CourierTaskSequenceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inventoryAnomaly`: Exposes CRUD operations for the **InventoryAnomaly** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InventoryAnomalies
      * const inventoryAnomalies = await prisma.inventoryAnomaly.findMany()
      * ```
      */
    get inventoryAnomaly(): Prisma.InventoryAnomalyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Customers
      * const customers = await prisma.customer.findMany()
      * ```
      */
    get customer(): Prisma.CustomerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map
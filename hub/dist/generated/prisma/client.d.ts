import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
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
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model Branch
 *
 */
export type Branch = Prisma.BranchModel;
/**
 * Model CashBookEntry
 *
 */
export type CashBookEntry = Prisma.CashBookEntryModel;
/**
 * Model Courier
 *
 */
export type Courier = Prisma.CourierModel;
/**
 * Model Order
 *
 */
export type Order = Prisma.OrderModel;
/**
 * Model Expense
 *
 */
export type Expense = Prisma.ExpenseModel;
/**
 * Model MonthlyBudget
 *
 */
export type MonthlyBudget = Prisma.MonthlyBudgetModel;
/**
 * Model InventoryItem
 *
 */
export type InventoryItem = Prisma.InventoryItemModel;
/**
 * Model ReconciliationLog
 *
 */
export type ReconciliationLog = Prisma.ReconciliationLogModel;
/**
 * Model RestockRequest
 *
 */
export type RestockRequest = Prisma.RestockRequestModel;
/**
 * Model LogisticsLog
 *
 */
export type LogisticsLog = Prisma.LogisticsLogModel;
/**
 * Model ServiceTariff
 *
 */
export type ServiceTariff = Prisma.ServiceTariffModel;
/**
 * Model ExpenseCategory
 *
 */
export type ExpenseCategory = Prisma.ExpenseCategoryModel;
/**
 * Model CourierTaskSequence
 *
 */
export type CourierTaskSequence = Prisma.CourierTaskSequenceModel;
/**
 * Model InventoryAnomaly
 *
 */
export type InventoryAnomaly = Prisma.InventoryAnomalyModel;
/**
 * Model Customer
 *
 */
export type Customer = Prisma.CustomerModel;
//# sourceMappingURL=client.d.ts.map
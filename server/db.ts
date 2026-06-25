import { createPool } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql-core";
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// Users table already exists — DO NOT modify
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", 255).notNull(),
  email: varchar("email", 255).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Add your tables below:
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  invoiceNumber: varchar("invoiceNumber", 255).notNull(),
  clientInformation: text("clientInformation").notNull(),
  amount: int("amount").notNull(),
  status: mysqlEnum("status", ["pending", "paid", "overdue"]).notNull(),
  dueDate: timestamp("dueDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const timeTracking = mysqlTable("time_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  hours: int("hours").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  level: mysqlEnum("level", ["basic", "premium", "enterprise"]).notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["active", "inactive", "canceled"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  paymentDate: timestamp("paymentDate").defaultNow().notNull(),
  status: mysqlEnum("status", ["completed", "failed", "pending"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type TimeTracking = typeof timeTracking.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Payment = typeof payments.$inferSelect;

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!db) {
    const pool = createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    db = drizzle(pool);
  }
  return db;
}

export async function upsertUser(openId: string, email: string) {
  const db = await getDb();
  await db!.insert(users).values({ openId, email }).onDuplicateKeyUpdate({ email });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  return db!.select().from(users).where(users.openId.eq(openId)).first();
}

// Query helper functions for each new business table

export async function getInvoicesByUserId(userId: number): Promise<Invoice[]> {
  const db = await getDb();
  return db!.select().from(invoices).where(invoices.userId.eq(userId));
}

export async function getTimeTrackingByUserId(userId: number): Promise<TimeTracking[]> {
  const db = await getDb();
  return db!.select().from(timeTracking).where(timeTracking.userId.eq(userId));
}

export async function getSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
  const db = await getDb();
  return db!.select().from(subscriptions).where(subscriptions.userId.eq(userId));
}

export async function getPaymentsByUserId(userId: number): Promise<Payment[]> {
  const db = await getDb();
  return db!.select().from(payments).where(payments.userId.eq(userId));
}
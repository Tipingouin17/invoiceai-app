import { pgEnum, pgTable, serial, text, timestamp, varchar, boolean, decimal, integer, numeric } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * DO NOT modify this table — it is managed by the auth system.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Business-specific tables ─────────────────────────────────────────────────

export const invoices = pgTable("invoices", {
  invoiceId: serial("invoice_id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.userId),
  clientName: varchar("client_name", 255).notNull(),
  amount: numeric("amount", 10, 2).notNull(),
  status: varchar("status", 50).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Invoice = typeof invoices.$inferSelect;

export const clients = pgTable("clients", {
  clientId: serial("client_id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.userId),
  name: varchar("name", 255).notNull(),
  email: varchar("email", 255).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Client = typeof clients.$inferSelect;

export const subscriptions = pgTable("subscriptions", {
  subscriptionId: serial("subscription_id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.userId),
  plan: varchar("plan", 50).notNull(),
  status: varchar("status", 50).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type Subscription = typeof subscriptions.$inferSelect;

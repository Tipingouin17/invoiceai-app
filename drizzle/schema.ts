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

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("trialing"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export const clientStatusEnum = pgEnum("client_status", ["active", "inactive", "archived"]);

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  status: clientStatusEnum("status").notNull().default("active"),
  notes: text("notes"),
  paymentTermsDays: integer("paymentTermsDays").notNull().default(30),
  latePaymentRiskScore: numeric("latePaymentRiskScore", { precision: 5, scale: 2 }),
  totalInvoiced: numeric("totalInvoiced", { precision: 12, scale: 2 }).notNull().default("0"),
  totalPaid: numeric("totalPaid", { precision: 12, scale: 2 }).notNull().default("0"),
  averageDaysToPayment: numeric("averageDaysToPayment", { precision: 6, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "sent",
  "viewed",
  "partially_paid",
  "paid",
  "overdue",
  "cancelled",
  "written_off",
]);

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  clientId: integer("clientId").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 100 }).notNull(),
  status: invoiceStatusEnum("status").notNull().default("draft"),
  issueDate: timestamp("issueDate").notNull(),
  dueDate: timestamp("dueDate").notNull(),
  paidAt: timestamp("paidAt"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  taxRate: numeric("taxRate", { precision: 5, scale: 2 }).notNull().default("0"),
  taxAmount: numeric("taxAmount", { precision: 12, scale: 2 }).notNull().default("0"),
  discountAmount: numeric("discountAmount", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
  amountPaid: numeric("amountPaid", { precision: 12, scale: 2 }).notNull().default("0"),
  amountDue: numeric("amountDue", { precision: 12, scale: 2 }).notNull().default("0"),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  notes: text("notes"),
  terms: text("terms"),
  footer: text("footer"),
  pdfUrl: text("pdfUrl"),
  stripePaymentLinkId: varchar("stripePaymentLinkId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  aiGenerated: boolean("aiGenerated").notNull().default(false),
  aiPromptUsed: text("aiPromptUsed"),
  latePaymentProbability: numeric("latePaymentProbability", { precision: 5, scale: 2 }),
  remindersSentCount: integer("remindersSentCount").notNull().default(0),
  lastReminderSentAt: timestamp("lastReminderSentAt"),
  viewedAt: timestamp("viewedAt"),
  viewCount: integer("viewCount").notNull().default(0),
  quickbooksSyncId: varchar("quickbooksSyncId", { length: 255 }),
  quickbooksSyncedAt: timestamp("quickbooksSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export const invoiceLineItems = pgTable("invoice_line_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoiceId").notNull(),
  userId: integer("userId").notNull(),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: numeric("unitPrice", { precision: 12, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  taxable: boolean("taxable").notNull().default(true),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type InvoiceLineItem = typeof invoiceLineItems.$inferSelect;
export type NewInvoiceLineItem = typeof invoiceLineItems.$inferInsert;

export const reminderChannelEnum = pgEnum("reminder_channel", ["email", "gmail", "outlook"]);
export const reminderStatusEnum = pgEnum("reminder_status", ["scheduled", "sent", "failed", "cancelled"]);

export const paymentReminders = pgTable("payment_reminders", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  invoiceId: integer("invoiceId").notNull(),
  clientId: integer("clientId").notNull(),
  channel: reminderChannelEnum("channel").notNull().default("email"),
  status: reminderStatusEnum("status").notNull().default("scheduled"),
  scheduledAt: timestamp("scheduledAt").notNull(),
  sentAt: timestamp("sentAt"),
  subject: varchar("subject", { length: 500 }),
  body: text("body"),
  aiGenerated: boolean("aiGenerated").notNull().default(true),
  openedAt: timestamp("openedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PaymentReminder = typeof paymentReminders.$inferSelect;
export type NewPaymentReminder = typeof paymentReminders.$inferInsert;

import { drizzle } from "drizzle-orm";
import { Pool } from "pg";
import { users, invoices, clients, subscriptions } from "../drizzle/schema";

// Initialize the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

export async function getDb() {
  return db;
}

// Existing functions (DO NOT modify)
export async function upsertUser(openId: string, email: string) {
  const db = await getDb();
  await db
    .insert(users)
    .values({ openId, email })
    .onConflict("openId")
    .doUpdate()
    .set({ email });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  return db.select().from(users).where(users.openId.eq(openId)).single();
}

// New query helper functions

// Invoices
export async function getInvoicesByUserId(userId: number) {
  const db = await getDb();
  return db.select().from(invoices).where(invoices.userId.eq(userId));
}

export async function createInvoice(data: Omit<Invoice, "invoiceId" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  return db.insert(invoices).values(data).returning();
}

export async function updateInvoice(invoiceId: number, data: Partial<Omit<Invoice, "invoiceId" | "userId" | "createdAt">>) {
  const db = await getDb();
  return db.update(invoices).set(data).where(invoices.invoiceId.eq(invoiceId)).returning();
}

// Clients
export async function getClientsByUserId(userId: number) {
  const db = await getDb();
  return db.select().from(clients).where(clients.userId.eq(userId));
}

export async function createClient(data: Omit<Client, "clientId" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  return db.insert(clients).values(data).returning();
}

export async function updateClient(clientId: number, data: Partial<Omit<Client, "clientId" | "userId" | "createdAt">>) {
  const db = await getDb();
  return db.update(clients).set(data).where(clients.clientId.eq(clientId)).returning();
}

// Subscriptions
export async function getSubscriptionsByUserId(userId: number) {
  const db = await getDb();
  return db.select().from(subscriptions).where(subscriptions.userId.eq(userId));
}

export async function createSubscription(data: Omit<Subscription, "subscriptionId" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  return db.insert(subscriptions).values(data).returning();
}

export async function updateSubscription(subscriptionId: number, data: Partial<Omit<Subscription, "subscriptionId" | "userId" | "createdAt">>) {
  const db = await getDb();
  return db.update(subscriptions).set(data).where(subscriptions.subscriptionId.eq(subscriptionId)).returning();
}
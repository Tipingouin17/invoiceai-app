import { drizzle } from "drizzle-orm";
import { Pool } from "pg";
import { users, invoices, clients, subscriptions } from "../drizzle/schema";

// Initialize the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const getDb = async () => {
  const client = await pool.connect();
  try {
    return drizzle(client);
  } finally {
    client.release();
  }
};

// Existing functions (DO NOT MODIFY)
export const upsertUser = async (user: { id: string; email: string }) => {
  const db = await getDb();
  await db!.insert(users).values({
    id: user.id,
    email: user.email,
  }).onConflictDoUpdate({
    target: users.id,
    set: { email: user.email },
  });
};

export const getUserByOpenId = async (openId: string) => {
  const db = await getDb();
  return db!.select().from(users).where(users.id.eq(openId)).single();
};

// New query helper functions

export const getInvoicesByUserId = async (userId: number) => {
  const db = await getDb();
  return db!.select().from(invoices).where(invoices.userId.eq(userId));
};

export const getClientsByUserId = async (userId: number) => {
  const db = await getDb();
  return db!.select().from(clients).where(clients.userId.eq(userId));
};

export const getSubscriptionsByUserId = async (userId: number) => {
  const db = await getDb();
  return db!.select().from(subscriptions).where(subscriptions.userId.eq(userId));
};

export const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
  const db = await getDb();
  return db!.insert(invoices).values(invoiceData).returning();
};

export const createClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
  const db = await getDb();
  return db!.insert(clients).values(clientData).returning();
};

export const createSubscription = async (subscriptionData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
  const db = await getDb();
  return db!.insert(subscriptions).values(subscriptionData).returning();
};

export const updateInvoiceStatus = async (invoiceId: number, status: string) => {
  const db = await getDb();
  return db!.update(invoices).set({ status }).where(invoices.id.eq(invoiceId));
};

export const updateClient = async (clientId: number, clientData: Partial<Client>) => {
  const db = await getDb();
  return db!.update(clients).set(clientData).where(clients.id.eq(clientId));
};

export const updateSubscription = async (subscriptionId: number, subscriptionData: Partial<Subscription>) => {
  const db = await getDb();
  return db!.update(subscriptions).set(subscriptionData).where(subscriptions.id.eq(subscriptionId));
};
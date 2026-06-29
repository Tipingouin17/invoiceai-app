import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../drizzle/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import {
  users,
  subscriptions,
  clients,
  invoices,
  invoiceLineItems,
  paymentReminders,
} from "../drizzle/schema";
import type {
  Subscription,
  NewSubscription,
  Client,
  NewClient,
  Invoice,
  NewInvoice,
  InvoiceLineItem,
  NewInvoiceLineItem,
  PaymentReminder,
  NewPaymentReminder,
} from "../drizzle/schema";

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!db) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
  }
  return db;
}

export async function upsertUser(data: {
  openId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}) {
  const db = await getDb();
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.openId, data.openId))
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(users)
      .set({
        email: data.email,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        imageUrl: data.imageUrl ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.openId, data.openId))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(users)
    .values({
      openId: data.openId,
      email: data.email,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      imageUrl: data.imageUrl ?? null,
    })
    .returning();
  return created;
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return user ?? null;
}

// ─── Subscription Helpers ───────────────────────────────────────────────────

export async function getSubscriptionByUserId(
  userId: number
): Promise<Subscription | null> {
  const db = await getDb();
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);
  return sub ?? null;
}

export async function getSubscriptionByStripeCustomerId(
  stripeCustomerId: string
): Promise<Subscription | null> {
  const db = await getDb();
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, stripeCustomerId))
    .limit(1);
  return sub ?? null;
}

export async function getSubscriptionByStripeSubscriptionId(
  stripeSubscriptionId: string
): Promise<Subscription | null> {
  const db = await getDb();
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);
  return sub ?? null;
}

export async function createSubscription(
  data: NewSubscription
): Promise<Subscription> {
  const db = await getDb();
  const [sub] = await db.insert(subscriptions).values(data).returning();
  return sub;
}

export async function updateSubscription(
  id: number,
  data: Partial<Omit<Subscription, "id" | "createdAt">>
): Promise<Subscription | null> {
  const db = await getDb();
  const [updated] = await db
    .update(subscriptions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(subscriptions.id, id))
    .returning();
  return updated ?? null;
}

export async function upsertSubscriptionByUserId(
  userId: number,
  data: Partial<NewSubscription>
): Promise<Subscription> {
  const db = await getDb();
  const existing = await getSubscriptionByUserId(userId);
  if (existing) {
    const [updated] = await db
      .update(subscriptions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscriptions.id, existing.id))
      .returning();
    return updated;
  }
  const [created] = await db
    .insert(subscriptions)
    .values({ userId, ...data } as NewSubscription)
    .returning();
  return created;
}

// ─── Client Helpers ─────────────────────────────────────────────────────────

export async function getClientsByUserId(userId: number): Promise<Client[]> {
  const db = await getDb();
  return db
    .select()
    .from(clients)
    .where(and(eq(clients.userId, userId)))
    .orderBy(asc(clients.name));
}

export async function getActiveClientsByUserId(
  userId: number
): Promise<Client[]> {
  const db = await getDb();
  return db
    .select()
    .from(clients)
    .where(and(eq(clients.userId, userId), eq(clients.status, "active")))
    .orderBy(asc(clients.name));
}

export async function getClientById(
  id: number,
  userId: number
): Promise<Client | null> {
  const db = await getDb();
  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, id), eq(clients.userId, userId)))
    .limit(1);
  return client ?? null;
}

export async function createClient(data: NewClient): Promise<Client> {
  const db = await getDb();
  const [client] = await db.insert(clients).values(data).returning();
  return client;
}

export async function updateClient(
  id: number,
  userId: number,
  data: Partial<Omit<Client, "id" | "createdAt">>
): Promise<Client | null> {
  const db = await getDb();
  const [updated] = await db
    .update(clients)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(clients.id, id), eq(clients.userId, userId)))
    .returning();
  return updated ?? null;
}

export async function deleteClient(
  id: number,
  userId: number
): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .update(clients)
    .set({ status: "archived", updatedAt: new Date() })
    .where(and(eq(clients.id, id), eq(clients.userId, userId)))
    .returning();
  return result.length > 0;
}

export async function updateClientFinancials(
  clientId: number,
  userId: number
): Promise<void> {
  const db = await getDb();
  const clientInvoices = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.clientId, clientId), eq(invoices.userId, userId)));

  const totalInvoiced = clientInvoices
    .reduce((sum, inv) => sum + parseFloat(inv.total ?? "0"), 0)
    .toFixed(2);

  const totalPaid = clientInvoices
    .reduce((sum, inv) => sum + parseFloat(inv.amountPaid ?? "0"), 0)
    .toFixed(2);

  const paidInvoices = clientInvoices.filter(
    (inv) => inv.status === "paid" && inv.paidAt && inv.issueDate
  );

  let averageDaysToPayment: string | null = null;
  if (paidInvoices.length > 0) {
    const totalDays = paidInvoices.reduce((sum, inv) => {
      const issued = new Date(inv.issueDate).getTime();
      const paid = new Date(inv.paidAt!).getTime();
      return sum + (paid - issued) / (1000 * 60 * 60 * 24);
    }, 0);
    averageDaysToPayment = (totalDays / paidInvoices.length).toFixed(2);
  }

  await db
    .update(clients)
    .set({
      totalInvoiced,
      totalPaid,
      averageDaysToPayment,
      updatedAt: new Date(),
    })
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)));
}

// ─── Invoice Helpers ─────────────────────────────────────────────────────────

export async function getInvoicesByUserId(userId: number): Promise<Invoice[]> {
  const db = await getDb();
  return db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, userId))
    .orderBy(desc(invoices.createdAt));
}

export async function getInvoicesByClientId(
  clientId: number,
  userId: number
): Promise<Invoice[]> {
  const db = await getDb();
  return db
    .select()
    .from(invoices
)
    .where(and(eq(invoices.clientId, clientId), eq(invoices.userId, userId)))
    .orderBy(desc(invoices.createdAt));
}

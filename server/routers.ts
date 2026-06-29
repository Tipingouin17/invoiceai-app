import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "./db";
import { eq, and, desc, asc, gte, lte, sql } from "drizzle-orm";
import {
  subscriptions,
  clients,
  invoices,
  invoiceLineItems,
  paymentReminders,
} from "../drizzle/schema";
import Stripe from "stripe";

// ─── Stripe Payments Router ───────────────────────────────────────────────────
const paymentsRouter = router({
  createCheckout: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
      const appUrl = process.env.VITE_APP_URL || "https://example.aibce.io";
      const session = await stripe.checkout.sessions.create({
        customer_email: ctx.user.email ?? undefined,
        line_items: [{ price: input.priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${appUrl}/dashboard?checkout=success`,
        cancel_url: `${appUrl}/pricing?checkout=cancelled`,
        metadata: { userId: String(ctx.user.id) },
      });
      return { url: session.url };
    }),
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);
    return result[0] ?? null;
  }),
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const appUrl = process.env.VITE_APP_URL || "https://example.aibce.io";
    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);
    if (!sub[0]?.stripeCustomerId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No active subscription found" });
    }
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub[0].stripeCustomerId,
      return_url: `${appUrl}/dashboard`,
    });
    return { url: portalSession.url };
  }),
});

// ─── Clients Router ───────────────────────────────────────────────────────────
const clientsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return db
      .select()
      .from(clients)
      .where(eq(clients.userId, ctx.user.id))
      .orderBy(desc(clients.createdAt));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [client] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)))
        .limit(1);
      if (!client) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      return client;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        company: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        postalCode: z.string().optional(),
        currency: z.enum(["USD", "EUR", "GBP", "CAD"]).default("USD"),
        notes: z.string().optional(),
        paymentTermsDays: z.number().int().positive().default(30),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [newClient] = await db
        .insert(clients)
        .values({
          userId: ctx.user.id,
          name: input.name,
          email: input.email,
          company: input.company ?? null,
          phone: input.phone ?? null,
          address: input.address ?? null,
          city: input.city ?? null,
          state: input.state ?? null,
          country: input.country ?? null,
          postalCode: input.postalCode ?? null,
          currency: input.currency,
          notes: input.notes ?? null,
          paymentTermsDays: input.paymentTermsDays,
          status: "active",
        })
        .returning();
      return newClient;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        company: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        postalCode: z.string().optional(),
        currency: z.enum(["USD", "EUR", "GBP", "CAD"]).optional(),
        notes: z.string().optional(),
        paymentTermsDays: z.number().int().positive().optional(),
        status: z.enum(["active", "inactive", "archived"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [existing] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)))
        .limit(1);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      const { id, ...updateData } = input;
      const [updated] = await db
        .update(clients)
        .set({ ...updateData, updatedAt: new Date() })
        .where(and(eq(clients.id, id), eq(clients.userId, ctx.user.id)))
        .returning();
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [existing] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)))
        .limit(1);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      await db
        .delete(clients)
        .where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)));
      return { success: true };
    }),

  getStats: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [client] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, input.id), eq(clients.userId, ctx.user.id)))
        .limit(1);
      if (!client) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      const clientInvoices = await db
        .select()
        .from(invoices)
        .where(and(eq(invoices.clientId, input.id), eq(invoices.userId, ctx.user.id)))
        .orderBy(desc(invoices.createdAt));
      const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);
      const totalPaid = clientInvoices.reduce((sum, inv) => sum + Number(inv.amountPaid), 0);
      const overdueCount = clientInvoices.filter((inv) => inv.status === "overdue").length;
      return {
        client,
        invoiceCount: clientInvoices.length,
        totalInvoiced,
        totalPaid,
        outstandingBalance: totalInvoiced - totalPaid,
        overdueCount,
        recentInvoices: clientInvoices.slice(0, 5),
      };
    }),
});

// ─── Feature (Invoice) Router ─────────────────────────────────────────────────
const featureRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, ctx.user.id))
      .orderBy(desc(invoices.createdAt));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const [invoice] = await db
        .select()
        .from(invoices)
        .where(and(eq(invoices.id, input.id), eq(invoices.userId, ctx.user.id)))
        .limit(1);
      if (!invoice) throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      const lineItems = await db
        .select()
        .from(invoiceLineItems)
        .where(eq(invoiceLineItems.invoiceId, input.id))
        .orderBy(asc(invoiceLineItems.sortOrder));
      return { ...invoice, lineItems };
    }),

  create: protectedProcedure
    .input(
      z.object({
        clientId: z.number().int().positive(),
        issueDate: z.string().or(z.date()),
        dueDate: z.string().or(z.date()),
        currency: z.enum(["USD", "EUR", "GBP", "CAD"]).default("USD"),
        taxRate: z.number().min(0).max(100).default(0),
        discountAmount: z.number().min(0).default(0),
        notes: z.string().optional(),
        terms: z.string().optional(),
        footer: z.string().optional(),
        aiGenerated: z.boolean().default(false),
        aiPromptUsed: z.string().optional(),
        items: z.array(
          z.object({
            description: z.string().min(1),
            quantity: z.number().positive(),
            unitPrice: z.number().positive(),
            taxable: z.boolean().default(true),
            sortOrder: z.number().int().default(0),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [client] = await db
        .select()
        .from(clients)
        .where(and(eq(clients.id, input.clientId), eq(clients.userId, ctx.user.id)))
        .limit(1);
      if (!client) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });

      const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const taxAmount = (subtotal * input.taxRate) / 100;
      const total = subtotal + taxAmount - input.discountAmount;

      const invoiceCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .where(eq(invoices.userId, ctx.user.id));
      const count = Number(invoiceCount[0]?.count ?? 0) + 1;
      const invoiceNumber = `INV-${String(count).padStart(5, "0")}`;

      const [newInvoice] = await db
        .insert(invoices)
        .values({
          userId: ctx.user.id,
          clientId: input.clientId,
          invoiceNumber,
          status: "draft",
          issueDate: new Date(input.issueDate),
          dueDate: new Date(input.dueDate),
          subtotal: String(subtotal),
          taxRate: String(input.taxRate),
          taxAmount: String(taxAmount),
          discountAmount: String(input.discountAmount),
          total: String(total),
          amountPaid: "0",
          amountDue: String(total),
          currency: input.currency,
          notes: input.notes ?? null,
          terms: input.terms ?? null,
          footer: input.footer ?? null,
          aiGenerated: input.aiGenerated,
          aiPromptUsed: input.aiPromptUsed ?? null,
        })
        .returning();

      if (input.items.length > 0) {
        await db.insert(invoiceLineItems).values(
          input.items.map((item, index) => ({
            invoiceId: newInvoice.id,
            userId: ctx.user.id,
            description: item.description,
            quantity: String(item.quantity),
            unitPrice: String(item.unitPrice),
            amount: String(item.quantity * item.unitPrice),
            taxable: item.taxable,
            sortOrder: item.sortOrder ?? index,
          }))
        );
      }

      await db
        .update(clients)
        .set({
          totalInvoiced: sql`${clients.totalInvoiced} + ${total}`,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, input.clientId));

      return newInvoice;
    }),

  update: protectedProcedure
    .input(
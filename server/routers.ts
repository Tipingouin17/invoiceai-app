import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { invoices, payments, subscriptions, timeTracking } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import Stripe from "stripe";

// Define Zod schemas for inputs and outputs
const createInvoiceInput = z.object({
  userId: z.string(),
  amount: z.number(),
});

const sendInvoiceInput = z.object({
  invoiceId: z.string(),
  email: z.string().email(),
});

const followUpPaymentInput = z.object({
  invoiceId: z.string(),
});

const getInvoicesInput = z.object({
  userId: z.string(),
});

// Define the app router
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      // Return authenticated user info
      return ctx.user;
    }),
    logout: protectedProcedure.mutation(async ({ ctx }) => {
      // Logic to log out the user
      return { success: true };
    }),
  }),
  invoices: router({
    createInvoice: protectedProcedure
      .input(createInvoiceInput)
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        const invoice = await db!.insert(invoices).values({
          userId: parseInt(input.userId),
          amount: input.amount,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return invoice;
      }),
    sendInvoice: protectedProcedure
      .input(sendInvoiceInput)
      .mutation(async ({ input }) => {
        // Logic to send invoice via email using Resend
        return { success: true };
      }),
    followUpPayment: protectedProcedure
      .input(followUpPaymentInput)
      .mutation(async ({ input }) => {
        // Logic to follow up on late payments
        return { success: true };
      }),
    getInvoices: protectedProcedure
      .input(getInvoicesInput)
      .query(async ({ input }) => {
        const db = await getDb();
        const userInvoices = await db!.select().from(invoices).where(eq(invoices.userId, parseInt(input.userId)));
        return userInvoices;
      }),
  }),
  payments: router({
    createCheckout: protectedProcedure
      .input(z.object({ priceId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        const session = await stripe.checkout.sessions.create({
          customer_email: ctx.user.email!,
          line_items: [{ price: input.priceId, quantity: 1 }],
          mode: 'subscription',
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        });
        return { url: session.url };
      }),
    webhook: publicProcedure
      .input(z.object({}))
      .mutation(async ({ input }) => {
        // Logic to handle Stripe webhook events
        return { success: true };
      }),
  }),
  subscriptions: router({
    getUserSubscription: protectedProcedure
      .query(async ({ ctx }) => {
        const db = await getDb();
        const subscription = await db!.select().from(subscriptions).where(eq(subscriptions.userId, ctx.user.id));
        return subscription;
      }),
  }),
  timeTracking: router({
    logTime: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        hours: z.number(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        await db!.insert(timeTracking).values({
          userId: ctx.user.id,
          projectId: parseInt(input.projectId),
          hours: input.hours,
          description: input.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { success: true };
      }),
    getTimeLogs: protectedProcedure
      .query(async ({ ctx }) => {
        const db = await getDb();
        const logs = await db!.select().from(timeTracking).where(eq(timeTracking.userId, ctx.user.id));
        return logs;
      }),
  }),
});
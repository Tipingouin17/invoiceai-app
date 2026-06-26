import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { invoices, clients, subscriptions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export const appRouter = router({
  // Existing auth router
  auth: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      return { user: ctx.user };
    }),
    logout: protectedProcedure.mutation(async ({ ctx }) => {
      // Logic to handle logout
    }),
  }),

  // Invoice feature routers
  invoice: router({
    createInvoice: protectedProcedure
      .input(
        z.object({
          freelancerId: z.string(),
          amount: z.number(),
          dueDate: z.string(),
          description: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        const [invoice] = await db!
          .insert(invoices)
          .values({
            userId: ctx.user.id,
            clientId: parseInt(input.freelancerId), // Assuming freelancerId is clientId
            amount: input.amount,
            status: 'pending',
          })
          .returning();

        return {
          success: true,
          invoiceId: invoice.id.toString(),
        };
      }),

    getInvoice: protectedProcedure
      .input(
        z.object({
          invoiceId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        const invoice = await db!
          .select()
          .from(invoices)
          .where(eq(invoices.id, parseInt(input.invoiceId)))
          .first();

        if (!invoice) {
          return { success: false, message: "Invoice not found" };
        }

        return {
          success: true,
          invoice: {
            freelancerId: invoice.clientId.toString(),
            amount: invoice.amount,
            dueDate: invoice.dueDate,
            description: invoice.description,
            status: invoice.status,
          },
        };
      }),

    updateInvoice: protectedProcedure
      .input(
        z.object({
          invoiceId: z.string(),
          updates: z.object({
            amount: z.number().optional(),
            dueDate: z.string().optional(),
            description: z.string().optional(),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        await db!
          .update(invoices)
          .set(input.updates)
          .where(eq(invoices.id, parseInt(input.invoiceId)));

        return { success: true, message: "Invoice updated successfully" };
      }),
  }),

  // Payments router
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
      .mutation(async ({ ctx, input }) => {
        // Logic to handle Stripe webhook events
      }),
  }),
});
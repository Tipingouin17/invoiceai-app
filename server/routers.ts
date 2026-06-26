import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    // Returns the current authenticated user from the DB (null if not signed in)
    me: publicProcedure.query(opts => opts.ctx.user),
    // Logout is handled by Clerk on the frontend via clerk.signOut()
    // This stub exists for backward compatibility
    logout: publicProcedure.mutation(() => {
      return { success: true } as const;
    }),
  }),
  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

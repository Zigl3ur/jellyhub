import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { authMiddleware, ctxMiddleware } from "./middlewares";
import { account, ssoProvider as ssoProviderSchema } from "@/lib/db/schema";

export const ssoPublicProviders = createServerFn({ method: "GET" })
  .middleware([ctxMiddleware])
  .handler(async ({ context: ctx }) => {
    const providers = await ctx.db.query.ssoProvider.findMany({
      columns: {
        providerId: true,
        issuer: true,
        oidcConfig: true,
      },
    });

    return providers;
  });

export const ssoProvidersList = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context: ctx }) => {
    if (ctx.session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const providers = await ctx.db.query.ssoProvider.findMany({
      columns: {
        id: true,
        providerId: true,
        issuer: true,
        domain: true,
        oidcConfig: true,
        createdAt: true,
      },
    });

    return providers;
  });

export const deleteSsoProvider = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ providerId: z.string() }))
  .handler(async ({ context: ctx, data }) => {
    if (ctx.session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    try {
      ctx.db.transaction((tx) => {
        tx.delete(account).where(eq(account.providerId, data.providerId)).run();
        tx.delete(ssoProviderSchema)
          .where(eq(ssoProviderSchema.providerId, data.providerId))
          .run();
      });
    } catch (error) {
      throw new Error("Failed to delete SSO provider");
    }
  });

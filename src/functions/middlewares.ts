import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

export const ctxMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    return next({
      context: {
        db,
        auth,
      },
    });
  },
);

export const authMiddleware = createMiddleware({ type: "function" })
  .middleware([ctxMiddleware])
  .server(async ({ next, context }) => {
    const session = await context.auth.api.getSession({
      headers: getRequestHeaders(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    return next({ context });
  });

import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

const ctxMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });

    return next({
      context: {
        db: db,
        auth: session,
      },
    });
  },
);

export const authMiddleware = createMiddleware({ type: "function" })
  .middleware([ctxMiddleware])
  .server(async ({ next, context }) => {
    if (!context.auth) {
      throw new Error("Unauthorized");
    }

    return next({ context });
  });

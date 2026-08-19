import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authMiddleware, ctxMiddleware } from "./middlewares";
import { auth } from "@/lib/auth";

export const isSignupAllowed = createServerFn({ method: "GET" }).handler(
  () => process.env.ALLOW_SIGNUP === "true",
);

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
});

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await auth.api.getSession({
      headers: getRequestHeaders(),
    });

    return session;
  },
);

export const ensureSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      throw new Error("Unauthorized");
    }

    return session;
  },
);

export const hasAdminUser = createServerFn({ method: "GET" })
  .middleware([ctxMiddleware])
  .handler(async ({ context: ctx }) => {
    const adminUser = await ctx.db.query.user.findFirst({
      where: {
        role: "admin",
      },
    });

    return !!adminUser;
  });

export const adminUsersList = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context: ctx }) => {
    if (ctx.session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await ctx.auth.api.listUsers({
      headers: getRequestHeaders(),
      query: {},
    });
  });

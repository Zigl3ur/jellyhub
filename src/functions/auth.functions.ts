import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

export const isSignupAllowed = createServerFn({ method: "GET" }).handler(
  () => process.env.ALLOW_SIGNUP === "true",
);

export const getUser = createServerFn().handler(async () => {
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

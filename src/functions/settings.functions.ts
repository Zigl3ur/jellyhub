import { z } from "zod/v4";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "@tanstack/react-router";
import { getUser, hasAdminUser } from "./auth.functions";
import { authMiddleware, ctxMiddleware } from "./middlewares";
import type {
  ServerActionReturn,
  jellydataDisplayed,
  userDataType,
} from "@/types/actions.types";
import { auth } from "@/lib/auth";
import { loginSchema } from "@/schemas/auth.schema";
import {
  addServerSchema,
  editUserSchema,
  endSetupSchema,
  resetPasswdScema,
} from "@/schemas/settings.schema";
import db from "@/lib/db";
import {
  jellydata as jellydataSchema,
  user as userSchema,
} from "@/lib/db/schema";

export const endSetup = createServerFn({ method: "POST" })
  .middleware([ctxMiddleware])
  .validator(endSetupSchema)
  .handler(async ({ context, data }) => {
    const alreadySetup = await hasAdminUser();

    if (alreadySetup) throw new Error("Setup has already been completed");

    const { admin, users, servers } = data;

    let adminUser;

    try {
      adminUser = await context.auth.api.createUser({
        body: {
          email: `${admin.username}@jellyhub.com`,
          name: admin.username,
          password: admin.password,
          role: "admin",
          data: {
            username: admin.username,
          },
        },
      });
    } catch {
      throw new Error("Failed to add admin user");
    }

    if (users.length > 0) {
      try {
        await Promise.all(
          users.map(async (user) => {
            await context.auth.api.createUser({
              body: {
                email: `${user.username}@jellyhub.com`,
                name: user.username,
                password: user.password,
                role: "user",
              },
            });
          }),
        );
      } catch {
        throw new Error("Failed to add user(s)");
      }
    }

    if (servers.length > 0) {
      try {
        await context.db.insert(jellydataSchema).values(
          servers.map((server) => ({
            userId: adminUser.user.id,
            serverUrl: server.address,
            serverUsername: server.username,
            serverToken: server.token,
          })),
        );
      } catch {
        throw new Error("Failed to add jellyfin server(s)");
      }
    }

    throw redirect({ to: "/" });
  });

export const getJellyData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const serverList = await context.db.query.jellydata.findMany({
      where: {
        userId: context.session.user.id,
      },
      columns: {
        serverUrl: true,
        serverUsername: true,
        serverToken: true,
      },
    });

    return { data: serverList };
  });

/**
 * Server action to create a user
 * @param username the new user username
 * @param password the new user password
 * @returns message if it succeed or an error
 */
export const addUserAction = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }): Promise<ServerActionReturn> => {
    const { username, password } = data;
    const user = await getUser();

    if (user.role !== "admin")
      return { success: false, error: "User is not an administrator" };

    const result = loginSchema.safeParse({ username, password });

    if (!result.success)
      return { success: false, error: z.prettifyError(result.error) };

    try {
      const createdUser = await auth.api.createUser({
        headers: getRequestHeaders(),
        body: {
          email: `${username}@jellyhub.com`,
          name: username,
          password: password,
          data: {
            username: username,
            displayUsername: username,
          },
        },
      });
      if (!createdUser.user.id)
        return { success: false, error: "Failed to create user" };

      return {
        success: true,
        message: "User Successfully created",
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create user",
      };
    }
  });

/**
 * Server action to delete a user
 * @param emails array of users's emails to remove
 * @returns message if it succeed or an error
 */
export const deleteUserAction = createServerFn({ method: "POST" })
  .validator((data: { emails: Array<string> }) => data)
  .handler(async ({ data }): Promise<ServerActionReturn> => {
    const { emails } = data;
    const user = await getUser();

    if (user.role !== "admin")
      return { success: false, error: "User is not an administrator" };

    try {
      const usersId = await db.query.user.findMany({
        where: {
          email: {
            in: emails,
          },
        },
        columns: { id: true },
      });

      if (usersId.length < 1)
        return { success: false, error: "User(s) not found" };

      // await prisma.user.deleteMany({
      //   where: {
      //     id: {
      //       in: usersId.map((data) => {
      //         return data.id;
      //       }),
      //     },
      //   },
      // });

      await db.delete(jellydataSchema).where(
        inArray(
          jellydataSchema.userId,
          usersId.map((u) => u.id),
        ),
      );

      return {
        success: true,
        message: "Successfully deleted user(s)",
      };
    } catch {
      return {
        success: false,
        error: "Failed to delete user(s)",
      };
    }
  });

/**
 * Server action to edit a user
 * @param id user id
 * @param baseUsername the original user username
 * @param newUsername the new usermane for the user
 * @param newPassword the new password for the user
 * @param confirmNewPassword the confirmed new password for the user
 * @returns message if it succeed or an error
 */
export const editUserAction = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      baseUsername: string;
      newUsername?: string;
      newPassword?: string;
      confirmNewPassword?: string;
    }) => data,
  )
  .handler(async ({ data }): Promise<ServerActionReturn> => {
    const { id, baseUsername, newUsername, newPassword, confirmNewPassword } =
      data;
    const user = await getUser();
    const isAdmin = user.role === "admin";

    if (!isAdmin)
      return {
        success: false,
        error: "User is not an administrator",
      };

    const result = editUserSchema.safeParse({
      username: newUsername,
      password: newPassword,
      confirmPassword: confirmNewPassword,
    });

    if (!result.success)
      return { success: false, error: z.prettifyError(result.error) };

    const ctx = await auth.$context;

    try {
      if (newPassword) {
        const hashPassword = await ctx.password.hash(newPassword);
        await ctx.internalAdapter.updatePassword(id, hashPassword);
      }

      const newName = newUsername ? newUsername : baseUsername;

      // await prisma.user.update({
      //   where: { id: id },
      //   data: {
      //     username: newName,
      //     name: newName,
      //     displayUsername: newName,
      //     email: `${newName}@jellyhub.com`,
      //     accounts: {
      //       updateMany: {
      //         where: {
      //           userId: id,
      //         },
      //         data: {
      //           password: hashPassword,
      //         },
      //       },
      //     },
      //   },
      // });

      await db
        .update(userSchema)
        .set({
          username: newName,
          name: newName,
          displayUsername: newName,
          email: `${newName}@jellyhub.com`,
        })
        .where(inArray(userSchema.id, [id]));

      return {
        success: true,
        message: "Successfully updated user",
      };
    } catch (err) {
      return {
        success: false,
        error: "Failed to update user",
      };
    }
  });

/**
 * Server action to reset password
 * @param newPassword the new password
 * @param confirmNewPassword the confirmed new password
 * @returns message if it succeed or an error
 */
export const resetPasswordAction = createServerFn({ method: "POST" })
  .validator(resetPasswdScema)
  .handler(async ({ data }): Promise<ServerActionReturn> => {
    const user = await getUser();
    const ctx = await auth.$context;
    const hash = await ctx.password.hash(data.confirmPassword);

    await ctx.internalAdapter.updatePassword(user.id, hash);

    return {
      success: true,
      message: "Successfully updated password !",
    };
  });

/**
 * Server action to get the list of users
 * @returns the list of users
 */
export const getUsersList = createServerFn({ method: "GET" }).handler(
  async (): Promise<ServerActionReturn<userDataType>> => {
    const user = await getUser();

    if (user.role !== "admin")
      return { success: false, error: "User is not an administrator" };

    const users = await auth.api.listUsers({
      headers: getRequestHeaders(),
      query: {
        limit: 100,
      },
    });

    return { success: true, data: users };
  },
);

"use server";

import { checkConn, getToken } from "@/lib/api.jellyfin";
import { prisma } from "@/lib/prisma";
import { decryptToken, encryptToken } from "@/lib/utils";
import { jellydataDisplayed, ServerActionReturn } from "@/types/actions.types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getUser } from "../utils";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { passwordSchema } from "@/schemas/settings.schema";
import { z } from "zod/v4";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/schemas/auth.schema";
import { headers } from "next/headers";

/**
 * Server action to create a user
 * @param username the new user username
 * @param password the new user password
 * @returns message if it succeed or an error
 */
export async function createUserAction(
  username: string,
  password: string
): Promise<ServerActionReturn> {
  const user = await getUser();

  if (user.role !== "admin")
    return { success: false, error: "User is not an administrator" };

  const result = loginSchema.safeParse({ username, password });

  if (!result.success)
    return { success: false, error: z.prettifyError(result.error) };

  const createdUser = await auth.api.createUser({
    headers: await headers(),
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
}

export async function deleteUserAction(
  username?: string,
  password?: string
): Promise<ServerActionReturn> {
  const user = await getUser();
  const isAdmin = user.role === "admin";

  if (password) {
    const result = passwordSchema.safeParse(password);

    if (!result.success)
      return { success: false, error: z.prettifyError(result.error) };
  }

  try {
    if (isAdmin && username) {
      const userId = await prisma.user.findFirst({
        where: { username: username },
        select: { id: true },
      });

      if (!userId) return { success: false, error: "User not found" };

      await authClient.admin.removeUser({
        userId: userId.id,
      });
    } else {
      const isDeleted = await authClient.deleteUser({
        password: password,
      });

      if (!isDeleted.data?.success)
        return {
          success: false,
          error: isDeleted.error?.message || "Failed to delete user",
        };
    }

    return {
      success: true,
      message: "User successfully deleted",
    };
  } catch {
    return {
      success: false,
      error: isAdmin ? "Failed to delete user" : "Failed to delete account",
    };
  }
}

export async function resetPasswordAction(
  newPassword: string,
  username?: string
): Promise<ServerActionReturn> {
  const user = await getUser();
  const isAdmin = user.role === "admin";

  const result = passwordSchema.safeParse(newPassword);

  if (!result.success)
    return { success: false, error: z.prettifyError(result.error) };

  const ctx = await auth.$context;
  const hashPassword = await ctx.password.hash(newPassword);

  try {
    if (isAdmin && username) {
      // get user id
      const targetUser = await prisma.user.findUnique({
        where: { username: username },
        include: { accounts: true },
      });

      if (!targetUser || !targetUser.accounts[0]) {
        return {
          success: false,
          error: "User not found",
        };
      }

      await prisma.account.update({
        where: { id: targetUser.accounts[0].id },
        data: {
          password: hashPassword,
        },
      });
    } else await ctx.internalAdapter.updatePassword("userId", hashPassword);

    return {
      success: true,
      message: "Successfully updated password",
    };
  } catch {
    return {
      success: false,
      error: isAdmin
        ? "Error while updating password"
        : "Cant update other user password",
    };
  }
}

/**
 * Server action to get the list of users
 * @returns the list of users
 */
export async function getUsersList(): Promise<
  ServerActionReturn<Awaited<ReturnType<typeof auth.api.listUsers>>>
> {
  const user = await getUser();

  if (user.role !== "admin")
    return { success: false, error: "User is not an administrator" };

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit: 100,
    },
  });

  return { success: true, data: users };
}

/**
 * Server action to add a jellyfin server of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
export async function addServerAction(
  server_url: string,
  username: string,
  password: string
): Promise<ServerActionReturn> {
  const user = await getUser();

  const { success, data, error } = await getToken(
    server_url,
    username,
    password
  );

  if (!success || !data) {
    return {
      success: false,
      error: error || "An Error Occured, check the URL / credentials",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        jellydata: {
          create: {
            serverId: data.server_id,
            serverUrl: data.server_url,
            serverUsername: data.server_username,
            serverToken: encryptToken(data.token),
          },
        },
      },
    });

    revalidatePath("/settings");
    return { success: true, message: "Successfully added jellyfin server !" };
  } catch (err) {
    const errorMessage =
      err instanceof PrismaClientKnownRequestError && err.code === "P2002"
        ? "Server already registered"
        : err instanceof Error
        ? err.message
        : "An Unknown Error Occurred";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Server action to delete one or more jellyfin servers of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
export async function deleteServerAction(
  data: Array<{ address: string; username: string }>
): Promise<ServerActionReturn> {
  const user = await getUser();

  try {
    await prisma.jellydata.deleteMany({
      where: {
        userId: user.id,
        serverUrl: {
          in: data.map((server) => server.address),
        },
        serverUsername: {
          in: data.map((server) => server.username),
        },
      },
    });
    revalidatePath("/settings");
    return {
      success: true,
      message: `Succesfully delteted server${data.length > 1 && "s"}`,
    };
  } catch (err) {
    if (err instanceof Error)
      return {
        success: false,
        error: err.message,
      };
    return {
      success: false,
      error: "An Unknow Error Occured",
    };
  }
}

/**
 * Server action to get the list of the jellyfin servers of the logged user.
 * @returns jellyfin server of the account or nothing if not authenticated
 */
export async function getJellyfinServers(): Promise<
  ServerActionReturn<Array<jellydataDisplayed>>
> {
  const user = await getUser();

  const serverList = await prisma.jellydata.findMany({
    where: {
      userId: user.id,
    },
    select: {
      serverUrl: true,
      serverUsername: true,
      serverToken: true,
    },
  });

  // add status property to each servers
  const serverListWithStatus = await Promise.all(
    serverList.map(async (server) => {
      return {
        ...server,
        status: (
          await checkConn(server.serverUrl, decryptToken(server.serverToken))
        ).data,
      };
    })
  );

  return {
    success: true,
    data: serverListWithStatus,
  };
}

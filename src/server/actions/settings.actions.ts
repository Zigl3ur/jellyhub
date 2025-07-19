"use server";

import { checkConn, getToken } from "@/lib/api.jellyfin";
import { prisma } from "@/lib/prisma";
import { decryptToken, encryptToken } from "@/lib/utils";
import {
  jellydataDisplayed,
  ServerActionReturn,
  userDataType,
} from "@/types/actions.types";
import { Prisma } from "@prisma/client";
import { getUser } from "../utils";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";
import { loginSchema } from "@/schemas/auth.schema";
import { headers } from "next/headers";
import {
  addServerSchema,
  editUserSchema,
  resetPasswdScema,
} from "@/schemas/settings.schema";

/**
 * Server action to create a user
 * @param username the new user username
 * @param password the new user password
 * @returns message if it succeed or an error
 */
export async function addUserAction(
  username: string,
  password: string
): Promise<ServerActionReturn> {
  const user = await getUser();

  if (user.role !== "admin")
    return { success: false, error: "User is not an administrator" };

  const result = loginSchema.safeParse({ username, password });

  if (!result.success)
    return { success: false, error: z.prettifyError(result.error) };

  try {
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
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create user",
    };
  }
}

/**
 * Server action to delete a user
 * @param emails array of users's emails to remove
 * @returns message if it succeed or an error
 */
export async function deleteUserAction(
  emails: Array<string>
): Promise<ServerActionReturn> {
  const user = await getUser();

  if (user.role !== "admin")
    return { success: false, error: "User is not an administrator" };

  try {
    const usersId = await prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      select: { id: true },
    });

    if (usersId.length < 1)
      return { success: false, error: "User(s) not found" };

    await prisma.user.deleteMany({
      where: {
        id: {
          in: usersId.map((data) => {
            return data.id;
          }),
        },
      },
    });

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
}

/**
 * Server action to edit a user
 * @param id user id
 * @param baseUsername the original user username
 * @param newUsername the new usermane for the user
 * @param newPassword the new password for the user
 * @param confirmNewPassword the confirmed new password for the user
 * @returns message if it succeed or an error
 */
export async function editUserAction(
  id: string,
  baseUsername: string,
  newUsername?: string,
  newPassword?: string,
  confirmNewPassword?: string
): Promise<ServerActionReturn> {
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
    let hashPassword;

    if (newPassword) hashPassword = await ctx.password.hash(newPassword);

    const newName = newUsername ? newUsername : baseUsername;

    await prisma.user.update({
      where: { id: id },
      data: {
        username: newName,
        name: newName,
        displayUsername: newName,
        email: `${newName}@jellyhub.com`,
        accounts: {
          updateMany: {
            where: {
              userId: id,
            },
            data: {
              password: hashPassword,
            },
          },
        },
      },
    });

    return {
      success: true,
      message: "Successfully updated user",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
        ? "Username already taken"
        : "Failed to update user";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Server action to reset password
 * @param newPassword the new password
 * @param confirmNewPassword the confirmed new password
 * @returns message if it succeed or an error
 */
export async function resetPasswordAction(
  newPassword: string,
  confirmNewPassword: string
): Promise<ServerActionReturn> {
  const user = await getUser();

  const result = resetPasswdScema.safeParse({
    password: newPassword,
    confirmPassword: confirmNewPassword,
  });

  if (!result.success)
    return { success: false, error: z.prettifyError(result.error) };

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(result.data.confirmPassword);

  await ctx.internalAdapter.updatePassword(user.id, hash);

  return {
    success: true,
    message: "Successfully updated password !",
  };
}

/**
 * Server action to get the list of users
 * @returns the list of users
 */
export async function getUsersList(): Promise<
  ServerActionReturn<userDataType>
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
 * Server action to add a jellyfin server.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
export async function addServerAction(
  server_url: string,
  username: string,
  password: string
): Promise<ServerActionReturn> {
  const user = await getUser();

  const result = addServerSchema.safeParse({
    address: server_url,
    username: username,
    password: password,
  });

  if (!result.success)
    return {
      success: false,
      error: z.prettifyError(result.error),
    };

  const { success, data, error } = await getToken(
    server_url,
    username,
    password
  );

  if (!success || !data) {
    return {
      success: false,
      error: error || "An error occured, check the URL / credentials",
    };
  }

  try {
    await prisma.jellydata.create({
      data: {
        userId: user.id,
        serverId: data.server_id,
        serverUrl: data.server_url,
        serverUsername: data.server_username,
        serverToken: encryptToken(data.token),
      },
    });

    return { success: true, message: "Successfully added jellyfin server !" };
  } catch (err) {
    const errorMessage =
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
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
    return {
      success: true,
      message: `Successfully deleted server${data.length > 1 ? "s" : ""}`,
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
 * @returns jellyfin server of the account
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
      const { serverToken, ...serverReturn } = server; // remove token to not send it to client
      return {
        ...serverReturn,
        status: (await checkConn(server.serverUrl, decryptToken(serverToken)))
          .data,
      };
    })
  );

  return {
    success: true,
    data: serverListWithStatus,
  };
}

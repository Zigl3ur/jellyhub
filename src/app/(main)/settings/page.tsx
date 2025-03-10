import ResetPasswd from "@/components/resetPasswd";
import { ServerTable, columns } from "@/components/serverTable";
import { getToken } from "@/lib/api.jellyfin";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  jellyfinServer,
  jellyfinServerCredentials,
  tokenJellyfin,
} from "@/types/jellyfin.types";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import CreateUser from "@/components/createUser";

export const metadata: Metadata = {
  title: "JellyHub - Settings",
};

/**
 *  Server action to get the list of the jellyfin servers of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
async function jellyfinServerListAction(): Promise<void | jellyfinServer[]> {
  "use server";
  const auth = await getSession();

  if (!auth) return;

  const serverList = await prisma.accounts.findMany({
    where: {
      username: auth.username as string,
    },
    select: { jellydata: true },
  });

  const returnList: jellyfinServer[] = [];

  serverList[0].jellydata.forEach(
    (server: { server: string; username: string; token: string }) => {
      returnList.push({
        address: server.server,
        username: server.username,
        token: server.token,
        status: "Checking",
      });
    }
  );

  return returnList;
}

/**
 *  Server action to add a jellyfin server of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
async function jellyfinServerAddAction(
  data: jellyfinServerCredentials
): Promise<tokenJellyfin | boolean> {
  "use server";
  const auth = await getSession();

  if (!auth) return false;

  const creds = await getToken(data.address, data.username, data.password);

  if (creds.error || !creds.token) {
    return creds;
  }

  try {
    await prisma.accounts.update({
      where: {
        username: auth.username as string,
      },
      data: {
        jellydata: {
          create: {
            username: data.username,
            server: creds.server_url,
            token: creds.token,
          },
        },
      },
    });

    revalidatePath("/settings");
    return true;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError)
      return {
        server_url: data.address,
        error: err.code === "P2002" ? "Server already registered" : err.message,
      };
    else if (err instanceof Error)
      return {
        server_url: data.address,
        error: err.message,
      };
    return {
      server_url: data.address,
      error: "An Unknow Error Occured",
    };
  }
}

/**
 *  Server action to delete one or more jellyfin servers of the logged user.
 * @returns jellyfin server list of the account or nothing if not authenticated
 */
async function jellyfinServerDeleteAction(
  data: {
    address: string;
    username: string;
  }[]
): Promise<tokenJellyfin | boolean> {
  "use server";
  const auth = await getSession();

  if (!auth) return false;

  try {
    await prisma.accounts.update({
      where: {
        username: auth.username as string,
      },
      data: {
        jellydata: {
          deleteMany: {
            OR: data.map((server) => ({
              AND: {
                server: server.address,
                username: server.username,
              },
            })),
          },
        },
      },
    });
    revalidatePath("/settings");
    return true;
  } catch (err) {
    if (err instanceof Error)
      return {
        server_url: "none",
        error: err.message,
      };
    return {
      server_url: "none",
      error: "An Unknow Error Occured",
    };
  }
}

/**
 * Server action to reset the password of one user
 * @returns true or false depending on the success of the operation
 */
async function resetPasswdAction(
  password: string,
  user?: string
): Promise<boolean> {
  "use server";
  const auth = await getSession();

  if (!auth) return false;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (auth.admin && user) {
      await prisma.accounts.update({
        where: { username: user },
        data: { password: hashedPassword },
      });
    } else {
      await prisma.accounts.update({
        where: { username: auth.username as string },
        data: { password: hashedPassword },
      });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Server action to get the list of user's username
 * @returns the list of the user username
 */
async function getUserListAction(): Promise<void | { username: string }[]> {
  "use server";
  const auth = await getSession();

  if (!auth) return;

  if (!auth.admin) return;

  const list = await prisma.accounts.findMany({
    select: { username: true },
  });

  return list;
}

/**
 * Server action to create an user
 * @param username username of the user to create
 * @param password password of the user to create
 * @returns if the operation succeed else not with an error message
 */
async function createUserAction(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  "use server";
  try {
    const auth = await getSession();

    if (!auth) return { success: false, error: "Not authenticated" };

    if (!auth.admin) return { success: false, error: "Not authorized" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.accounts.create({
      data: {
        username: username,
        password: hashedPassword,
        admin: false,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError)
      return {
        success: false,
        error: err.code === "P2002" ? "User already exist" : err.message,
      };
    else if (err instanceof Error)
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
 * Server action to delete a user
 * @param username username of the user to delete
 * @returns if the operation succeeded with a success flag and optional error message
 */
async function deleteUserAction(
  username: string
): Promise<{ success: boolean; error?: string }> {
  "use server";
  try {
    const auth = await getSession();

    if (!auth) return { success: false, error: "Not authenticated" };

    if (!auth.admin) return { success: false, error: "Not authorized" };

    if (auth.username === username)
      return { success: false, error: "Cannot delete yourself" };

    await prisma.accounts.delete({
      where: {
        username: username,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        error: err.message,
      };
    }
    return {
      success: false,
      error: "An Unknown Error Occurred",
    };
  }
}

export default async function SettingsPage() {
  const data = await jellyfinServerListAction();
  const isAdmin = (await getSession())?.admin as boolean;
  const userList = (await getUserListAction()) ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <ServerTable
        columns={columns}
        baseData={data as jellyfinServer[]}
        addAction={jellyfinServerAddAction}
        deleteAction={jellyfinServerDeleteAction}
      />
      <div className="flex flex-col lg:flex-row gap-2">
        <ResetPasswd
          isAdmin={isAdmin}
          onSubmit={resetPasswdAction}
          onDelete={deleteUserAction}
          userList={userList}
        />
        {isAdmin && <CreateUser onSubmit={createUserAction} />}
      </div>
    </div>
  );
}

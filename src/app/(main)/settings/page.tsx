import {
  ServerTable,
  columns as serversTableColumns,
} from "@/components/settings/tables/serverTable";
import { Metadata } from "next";
import { getUser } from "@/server/utils";
import {
  getJellyfinServers,
  getUsersList,
} from "@/server/actions/settings.actions";
import {
  UserTable,
  columns as usersTableColumns,
} from "@/components/settings/tables/userTable";

export const metadata: Metadata = {
  title: "JellyHub - Settings",
};

export default async function SettingsPage() {
  const user = await getUser();
  const isAdmin = user.role === "admin";

  const servers = await getJellyfinServers();
  const users = await getUsersList();

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <ServerTable
        columns={serversTableColumns}
        serversData={servers.data || []}
      />
      {isAdmin && (
        <UserTable columns={usersTableColumns} usersData={users.data!} />
      )}
    </div>
  );
}

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
import { UserTable } from "@/components/settings/tables/userTable";
import { Suspense } from "react";
import LoadingTable from "@/components/settings/tables/loadingTable";
import ResetPasswd from "@/components/settings/resetPasswd";

export const metadata: Metadata = {
  title: "JellyHub - Settings",
};

async function ServersSection() {
  const servers = await getJellyfinServers();
  return (
    <ServerTable
      columns={serversTableColumns}
      serversData={servers.data || []}
    />
  );
}

async function UsersSection() {
  const users = await getUsersList();
  return <UserTable usersData={users.data!} />;
}

export default async function SettingsPage() {
  const user = await getUser();
  const isAdmin = user.role === "admin";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Suspense
        fallback={
          <LoadingTable
            inputPlaceholder="Search Servers"
            tableHeads={["Address", "Username", "Status"]}
          />
        }
      >
        <ServersSection />
      </Suspense>
      {isAdmin ? (
        <Suspense
          fallback={
            <LoadingTable
              inputPlaceholder="Search Users"
              tableHeads={["Username", "Role", "Updated At", "Created At"]}
            />
          }
        >
          <UsersSection />
        </Suspense>
      ) : (
        <ResetPasswd />
      )}
    </div>
  );
}

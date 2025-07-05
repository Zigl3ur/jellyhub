import ResetPasswd from "@/components/settings/resetPasswd";
import { ServerTable, columns } from "@/components/settings/serverTable";
import { Metadata } from "next";
import CreateUser from "@/components/settings/createUser";
import { getUser } from "@/server/utils";
import { getJellyfinServers } from "@/server/actions/settings.actions";

export const metadata: Metadata = {
  title: "JellyHub - Settings",
};

export default async function SettingsPage() {
  const user = await getUser();
  const isAdmin = user.role === "admin";

  const servers = await getJellyfinServers();

  return (
    <div className="flex flex-1 flex-col gap-8">
      <ServerTable columns={columns} baseData={servers.data || []} />
      <div className="flex flex-col lg:flex-row gap-2">
        <ResetPasswd isAdmin={isAdmin} />
        {isAdmin && <CreateUser />}
      </div>
    </div>
  );
}

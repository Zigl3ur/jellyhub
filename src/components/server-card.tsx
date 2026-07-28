import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical, Pen, RefreshCw, Trash2 } from "lucide-react";
import Skeleton from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";
import Button from "./ui/button";
import Badge from "./ui/badge";
import { JellyfinIcon } from "./ui/jellyfin-icon";
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "./ui/menu";
import type { getJellyData } from "@/functions/settings.functions";
import Link from "@/components/ui/link";
import { checkServerConn, getServerInfo } from "@/functions/jellyfin.functions";

interface ServerCardProps {
  server: Awaited<ReturnType<typeof getJellyData>>["data"][number];
}

export default function ServerCard({ server }: ServerCardProps) {
  const { data: serverData, isFetching: isFetchingServerData } = useQuery({
    queryFn: () => getServerInfo({ data: { url: server.serverUrl } }),
    queryKey: [server.serverUrl, "data"],
  });

  const { data: statusData, isFetching: isFetchingStatusData } = useQuery({
    queryFn: () =>
      checkServerConn({
        data: { url: server.serverUrl, token: server.serverToken },
      }),
    queryKey: [server.serverUrl, "state"],
    refetchInterval: 15_000,
  });

  return (
    <Card className="max-w-85 w-full">
      <CardHeader className="justify-between">
        <div className="flex items-center gap-2">
          <JellyfinIcon className="size-5.5 shrink-0" />
          {isFetchingServerData ? (
            <Skeleton className="h-5 w-45" />
          ) : (
            serverData?.ServerName
          )}
          {isFetchingStatusData ? (
            <RefreshCw className="size-3 shrink-0 animate-spin" />
          ) : statusData?.status === "up" ? (
            <div className="bg-success size-2 shrink-0 rounded-full" />
          ) : (
            <div className="bg-destructive size-2 shrink-0 rounded-full" />
          )}
        </div>
        <ServerActions />
      </CardHeader>
      <CardContent className="gap-2.5">
        <div className="flex items-center justify-between">
          Url
          <Link href={server.serverUrl} target="_blank" variant="link">
            {server.serverUrl.split("://")[1]}
          </Link>
        </div>

        <span className="h-px w-full bg-muted" />

        <div className="flex items-center justify-between">
          Username <span>{server.serverUsername}</span>
        </div>

        <span className="h-px w-full bg-muted" />

        <div className="flex items-center justify-between">
          Version
          {isFetchingServerData ? (
            <Skeleton className="w-20 h-5" />
          ) : (
            <Badge className="font-mono text-xs">{serverData?.Version}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ServerActions() {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="data-popup-open:bg-accent/50"
          >
            <EllipsisVertical />
          </Button>
        }
      />
      <MenuContent positionerProps={{ align: "start", sideOffset: 4 }}>
        <MenuGroup>
          <MenuGroupLabel>Actions</MenuGroupLabel>
          <MenuItem>
            <RefreshCw className="size-4" />
            Refresh Token
          </MenuItem>
          <MenuItem>
            <Pen className="size-4" /> Edit
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem variant="destructive-ghost">
          <Trash2 className="size-4" /> Delete Server
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

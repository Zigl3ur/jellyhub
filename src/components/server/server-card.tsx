import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical, Pen, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import Skeleton from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";
import Button from "../ui/button";
import Badge from "../ui/badge";
import { JellyfinIcon } from "../ui/jellyfin-icon";
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";
import RemoveServerDialog from "./remove-server-dialog";
import type { Server } from "@/types";
import { ExternalLink } from "@/components/ui/link";
import { checkServerConn, getServerInfo } from "@/functions/jellyfin.functions";

interface ServerCardProps {
  server: Server;
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
    <Card className="w-full">
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
        <ServerActions server={{ ...server, name: serverData?.ServerName }} />
      </CardHeader>
      <CardContent className="gap-2.5">
        <div className="flex items-center justify-between">
          Url
          <ExternalLink
            variant="link"
            href={server.serverUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {server.serverUrl.split("://")[1]}
          </ExternalLink>
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

interface ServerActionsProps {
  server: Server & { name?: string | null };
}

function ServerActions({ server }: ServerActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
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
              <Pen className="size-4" /> Edit
            </MenuItem>
            <MenuItem>
              <RefreshCw className="size-4" />
              Refresh Token
            </MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem
            variant="destructive-ghost"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" /> Delete Server
          </MenuItem>
        </MenuContent>
      </Menu>

      <RemoveServerDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        server={server}
        onSuccess={() => setDeleteOpen(false)}
      />
    </>
  );
}

import { useState } from "react";
import { Fingerprint, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "../ui/card";
import Badge from "../ui/badge";
import Button from "../ui/button";
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from "../ui/menu";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { ExternalLink } from "../ui/link";
import Skeleton from "../ui/skeleton";
import DeleteSsoDialog from "./delete-sso-dialog";
import type { ssoProvidersList } from "@/functions/sso.functions";

interface SsoProviderCardProps {
  provider: Awaited<ReturnType<typeof ssoProvidersList>>[number];
}

export function SsoProviderCard({ provider }: SsoProviderCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const issuerHost = provider.issuer.replace(/^https?:\/\//, "");

  return (
    <Card className="w-full">
      <CardHeader className="justify-between">
        <div className="flex items-center gap-2">
          <img className="size-5.5 shrink-0" src="/openid.webp" />

          <h6 className="line-clamp-1">{provider.providerId}</h6>
        </div>
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
              <MenuItem
                variant="destructive-ghost"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" /> Delete Provider
              </MenuItem>
            </MenuGroup>
          </MenuContent>
        </Menu>
      </CardHeader>
      <CardContent className="gap-2.5">
        <div className="flex items-center justify-between gap-1">
          Issuer
          <ExternalLink
            variant="default"
            className="text-sm"
            href={provider.issuer}
            target="_blank"
          >
            {issuerHost}
          </ExternalLink>
        </div>

        <span className="h-px w-full bg-muted" />

        <div className="flex items-center justify-between">
          Domain <span className="font-mono">{provider.domain}</span>
        </div>

        <span className="h-px w-full bg-muted" />

        <div className="flex items-center justify-between">
          Added
          <Badge className="font-mono text-xs">
            {provider.createdAt
              ? format(provider.createdAt, "MMM d, yyyy")
              : "N/A"}
          </Badge>
        </div>
      </CardContent>

      <DeleteSsoDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        provider={provider}
      />
    </Card>
  );
}

export function SsoProviderCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="justify-between items-center">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6" />
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-10 h-4 rounded" />
        </div>
        <Skeleton className="size-6" />
      </CardHeader>
      <CardContent className="gap-2.5">
        <div className="flex items-center justify-between">
          Issuer <Skeleton className="w-35 h-4" />
        </div>
        <span className="h-px w-full bg-muted" />
        <div className="flex items-center justify-between">
          Domain <Skeleton className="w-28 h-4" />
        </div>
        <span className="h-px w-full bg-muted" />
        <div className="flex items-center justify-between">
          Created <Skeleton className="w-24 h-4" />
        </div>
      </CardContent>
    </Card>
  );
}

import type { UserWithRole } from "better-auth/plugins";
import { Card, CardContent, CardHeader } from "../ui/card";
import Skeleton from "../ui/skeleton";
import Image from "../ui/image";
import { useState } from "react";
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../ui/menu";
import Button from "../ui/button";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import DeleteUserDialog from "./delete-user-dialog";

interface UserCardProps {
  actualUserId: string;
  user: UserWithRole;
}

export function UserCard({ actualUserId, user }: UserCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <Image src={user.image as string} className="aspect-square rounded-t" />
      </CardContent>
      <CardHeader className="justify-between items-center">
        {user.name}
        {actualUserId !== user.id && <UserActions user={user} />}
      </CardHeader>
    </Card>
  );
}

interface UserActionsProps {
  user: UserWithRole;
}

function UserActions({ user }: UserActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
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
            <MenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="size-4" />
              Edit User
            </MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem
            variant="destructive-ghost"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" /> Delete User
          </MenuItem>
        </MenuContent>
      </Menu>

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={user}
        onSuccess={() => setDeleteOpen(false)}
      />
    </>
  );
}

export function UserCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <Skeleton className="rounded-t aspect-square" />
      </CardContent>
      <CardHeader className="justify-between items-center">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="size-6" />
      </CardHeader>
    </Card>
  );
}

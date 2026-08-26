import AddUserDialog from "@/components/users/add-user-dialog";
import { UserCard, UserCardSkeleton } from "@/components/users/users-card";
import { usersListQueryOptions } from "@/queries/users";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_main/_home/settings/users/")({
  beforeLoad: ({ context }) => {
    if (context.session.user.role !== "admin") {
      throw redirect({ to: "/settings/profile" });
    }
  },
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(usersListQueryOptions);
  },
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Users - JellyHub" }] }),
});

function RouteComponent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-5xl font-serif">Users</h3>
        <AddUserDialog />
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
            <UsersContentSkeleton />
          </div>
        }
      >
        <UsersContent />
      </Suspense>
    </div>
  );
}

function UsersContent() {
  const { session } = Route.useRouteContext();
  const { data, isFetching } = useSuspenseQuery(usersListQueryOptions);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
      {data && data.total > 0 ? (
        data.users.map((u) => (
          <UserCard key={u.id} actualUserId={session.user.id} user={u} />
        ))
      ) : isFetching ? (
        <UserCardSkeleton />
      ) : null}
    </div>
  );
}

function UsersContentSkeleton() {
  return Array.from({ length: 8 }).map((_, a) => <UserCardSkeleton key={a} />);
}

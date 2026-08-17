import AddUserDialog from "@/components/users/add-user-dialog";
import { UserCard, UserCardSkeleton } from "@/components/users/users-card";
import { authClient } from "@/lib/auth-client";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

const usersListQuery = queryOptions({
  queryFn: async () => {
    return await authClient.admin.listUsers({
      query: {},
    });
  },
  queryKey: ["usersList"],
});

export const Route = createFileRoute("/_main/_home/settings/users/")({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(usersListQuery);
  },
  component: RouteComponent,
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
  const { data, isFetching } = useSuspenseQuery(usersListQuery);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
      {data.data && data.data.total > 0 ? (
        data.data.users.map((u) => (
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

import AddSsoDialog from "@/components/sso/add-sso-dialog";
import {
  SsoProviderCard,
  SsoProviderCardSkeleton,
} from "@/components/sso/sso-provider-card";
import { ssoProvidersList } from "@/functions/sso.functions";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { Suspense } from "react";

const ssoProvidersQuery = queryOptions({
  queryFn: ssoProvidersList,
  queryKey: ["ssoProviders"],
});

export const Route = createFileRoute("/_main/_home/settings/sso/")({
  beforeLoad: ({ context }) => {
    if (context.session.user.role !== "admin") {
      throw redirect({ to: "/settings/profile" });
    }
  },
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(ssoProvidersQuery);
  },
  component: RouteComponent,
  head: () => ({ meta: [{ title: "SSO - JellyHub" }] }),
});

function RouteComponent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-5xl font-serif">Single Sign-On</h3>
        <AddSsoDialog />
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2">
            <SsoProviderCardSkeleton />
          </div>
        }
      >
        <SsoContent />
      </Suspense>
    </div>
  );
}

function SsoContent() {
  const { data, isFetching } = useSuspenseQuery(ssoProvidersQuery);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
      {data.length > 0 ? (
        data.map((provider) => (
          <SsoProviderCard key={provider.id} provider={provider} />
        ))
      ) : isFetching ? (
        <SsoProviderCardSkeleton />
      ) : (
        <EmptySsoProviders />
      )}
    </div>
  );
}

function EmptySsoProviders() {
  return (
    <div className="bg-accent/45 col-span-full h-75 flex-col gap-4 flex items-center justify-center rounded border border-muted w-full">
      <div className="flex flex-col items-center gap-0.5">
        <div className="size-8 mb-2 flex items-center justify-center p-1.25 rounded bg-accent-foreground border border-muted">
          <KeyRound />
        </div>
        <h5 className="text-lg">No SSO Providers</h5>
        <p className="opacity-50">
          Add an OpenID provider to allow users to sign with it
        </p>
      </div>
      <AddSsoDialog />
    </div>
  );
}

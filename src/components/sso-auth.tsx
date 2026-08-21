import { ssoPublicProviders } from "@/functions/sso.functions";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "./ui/alert";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Button from "./ui/button";
import Skeleton from "./ui/skeleton";
import LoaderIcon from "./ui/loader-icon";

export default function SsoAuth() {
  const { data, isFetching, isError, error } = useQuery({
    queryFn: ssoPublicProviders,
    queryKey: ["SsoPublicProviders"],
  });

  if (isFetching)
    return (
      <>
        <div className="space-y-2">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-muted" />
          <span className="text-sm opacity-60 uppercase">or</span>
          <span className="h-px flex-1 bg-muted" />
        </div>
      </>
    );

  if (isError)
    return (
      <Alert
        type="destructive"
        title="Unable to retrive SSO providers"
        message={error.message}
      />
    );

  return (
    data &&
    data.length > 0 && (
      <>
        <div className="space-y-2">
          {data.map((provider) => (
            <SignInWithSsoButton
              key={provider.providerId}
              provider={provider}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-muted" />
          <span className="text-sm opacity-60 uppercase">or</span>
          <span className="h-px flex-1 bg-muted" />
        </div>
      </>
    )
  );
}

interface SsoProviderButtonProps {
  provider: Awaited<ReturnType<typeof ssoPublicProviders>>[number];
}

function SignInWithSsoButton({ provider }: SsoProviderButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSignIn = async () => {
    await authClient.signIn.sso({
      providerId: provider.providerId,
      callbackURL: "/",
      errorCallbackURL: "/login",
      fetchOptions: {
        onRequest: () => setIsPending(true),
        onResponse: () => setIsPending(false),
      },
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center text-sm"
      disabled={isPending}
      onClick={handleSignIn}
    >
      {isPending ? <LoaderIcon /> : `Continue with ${provider.providerId}`}
    </Button>
  );
}

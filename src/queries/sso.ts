import { ssoProvidersList } from "@/functions/sso.functions";
import { queryOptions } from "@tanstack/react-query";

export const ssoProvidersQueryOptions = queryOptions({
  queryFn: ssoProvidersList,
  queryKey: ["ssoProviders"],
  staleTime: 5 * 60 * 1000,
});

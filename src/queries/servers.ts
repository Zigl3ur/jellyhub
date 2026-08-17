import { getServersItems } from "@/functions/jellyfin.functions";
import type { ItemsOpts } from "@/types";
import { queryOptions } from "@tanstack/react-query";

export const itemsQueryOptions = (opts: ItemsOpts) =>
  queryOptions({
    queryKey: ["items", opts.types],
    queryFn: () => getServersItems({ data: { opts } }),
    staleTime: 60_000,
  });

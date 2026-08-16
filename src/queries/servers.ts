import { getServersItems } from "@/functions/jellyfin.functions";
import type { ItemTypes } from "@/types";
import { queryOptions } from "@tanstack/react-query";

export const itemsQueryOptions = (types: ItemTypes[]) =>
  queryOptions({
    queryKey: ["items", types],
    queryFn: () => getServersItems({ data: { opts: { types } } }),
    staleTime: 60_000,
  });

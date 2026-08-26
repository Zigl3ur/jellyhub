import { adminUsersList } from "@/functions/auth.functions";
import { queryOptions } from "@tanstack/react-query";

export const usersListQueryOptions = queryOptions({
  queryFn: adminUsersList,
  queryKey: ["usersList"],
  staleTime: 5 * 60 * 1000,
});

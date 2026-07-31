import { createServerFn } from "@tanstack/react-start";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api";
import type { ItemsOpts } from "@/types";
import {
  authJellyfinUser,
  checkJellyfinConn,
  getJellyfinApiClient,
  getLibraryItems,
} from "@/lib/api.jellyfin";

export const getServerInfo = createServerFn({ method: "GET" })
  .validator((data: { url: string }) => data)
  .handler(async ({ data }) => {
    const api = getJellyfinApiClient(data.url);

    const info = await getSystemApi(api).getPublicSystemInfo();

    return info.data;
  });

export const getServerToken = createServerFn({ method: "GET" })
  .validator(
    (data: { url: string; username: string; password: string }) => data,
  )
  .handler(async ({ data }) => {
    const api = getJellyfinApiClient(data.url);

    return await authJellyfinUser(api, data.username, data.password);
  });

export const checkServerConn = createServerFn({ method: "GET" })
  .validator((data: { url: string; token: string }) => data)
  .handler(async ({ data }) => {
    const api = getJellyfinApiClient(data.url, data.token);

    const status = await checkJellyfinConn(api);

    return { status: status ? "up" : "down" };
  });

export const getServerItems = createServerFn({ method: "GET" })
  .validator((data: { url: string; token: string; opts: ItemsOpts }) => data)
  .handler(async ({ data }) => {
    const api = getJellyfinApiClient(data.url, data.token);

    const items = await getLibraryItems(api, data.opts);

    if (items.status !== 200) throw new Error("Failed to fetch items");

    return items.data;
  });

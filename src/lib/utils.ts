import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createServerOnlyFn } from "@tanstack/react-start";
import type { ClassValue } from "clsx";
import type { itemJellyfin } from "@/types/jellyfin-api.types";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

/**
 * encrypt the given token
 * @param token the token to encrypt
 * @returns the encrypted token
 */
export const encrypt = createServerOnlyFn((value: string): string => {
  const ENCRYPTION_KEY = Buffer.from(process.env.SECRET_KEY as string, "hex");

  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
});

/**
 * decrypt the given data
 * @param encrypted the data to decrypt
 * @returns the decrypted data
 */
export const decrypt = createServerOnlyFn((raw: string): string => {
  const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

  const [iv, tag, encrypted] = raw.split(":").map((s) => Buffer.from(s, "hex"));
  const decipher = createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
});

/**
 * Function to get ticks to readable duration
 * @param ticks ticks to convert
 * @returns date from the given ticks
 */
export function TicksToDuration(ticks: number): string | undefined {
  if (ticks === undefined || ticks === 0) return undefined;

  const ticksPerSecond = 10000000;
  const seconds = ticks / ticksPerSecond;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours.toString().padStart(2, "0")}h${minutes
    .toString()
    .padStart(2, "0")}m`;
}

export function filterItems(items: Array<itemJellyfin>): Array<itemJellyfin> {
  const filteredItems = Object.values(
    items.reduce((acc: Record<string, itemJellyfin>, current) => {
      // format title to avoid dumb duplicates with spaces and Upper case
      const nameKey = current.item_name.toLowerCase().replaceAll(" ", "");

      if (acc[nameKey]) {
        const itemLoc = [
          ...acc[nameKey].item_location,
          ...current.item_location,
        ].filter(
          (item, index, self) =>
            self.findIndex((i) => i.server_url === item.server_url) === index,
        );
        // merge locations
        // prefer keeping the one with image if available
        if (current.item_image !== "/default.svg") {
          acc[nameKey] = {
            ...current,
            item_location: itemLoc,
          };
        } else {
          acc[nameKey].item_location = itemLoc;
        }
      } else {
        // add new item
        acc[nameKey] = { ...current };
      }

      return acc;
    }, {}),
  );

  // shuffle
  return filteredItems
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function debounce<T extends Array<unknown>>(
  callback: (...args: T) => void,
  delay: number,
) {
  let timeoutTimer: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeoutTimer);

    timeoutTimer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

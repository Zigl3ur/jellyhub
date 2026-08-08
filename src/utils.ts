import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { createServerOnlyFn } from "@tanstack/react-start";
import type { itemJellyfin } from "@/types/jellyfin-api.types";
import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export const encrypt = createServerOnlyFn((value: string): string => {
  const secretKey = Buffer.from(process.env.SECRET_KEY as string, "base64");

  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-gcm", secretKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
});

export const decrypt = createServerOnlyFn((raw: string): string => {
  const secretKey = Buffer.from(process.env.SECRET_KEY as string, "base64");

  const [iv, tag, encrypted] = raw.split(":").map((s) => Buffer.from(s, "hex"));
  const decipher = createDecipheriv("aes-256-gcm", secretKey, iv);
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
export function ticksToDuration(
  ticks: NonNullable<BaseItemDto["RunTimeTicks"]>,
  detailedDisplay: boolean = false,
): string {
  const ticksPerSecond = 10000000;
  const tickSeconds = ticks / ticksPerSecond;

  const hours = Math.floor(tickSeconds / 3600);
  const minutes = Math.floor((tickSeconds % 3600) / 60);
  const seconds = Math.floor(tickSeconds % 60);

  if (detailedDisplay) {
    return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds > 0 ? `${seconds}s` : ""}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

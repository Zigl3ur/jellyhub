import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "node:crypto";
import { itemJellyfin } from "@/types/jellyfin-api.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * encrypt the given token
 * @param token the token to encrypt
 * @returns the encrypted token
 */
export function encryptToken(token: string): string {
  const secretKey = process.env.SECRET_KEY as string;
  if (!secretKey) throw new Error("SECRET_KEY env var is not defined");

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * decrypt the given data
 * @param encrypted the data to decrypt
 * @returns the decrypted data
 */
export function decryptToken(encrypted: string): string {
  const secretKey = process.env.SECRET_KEY as string;
  if (!secretKey) throw new Error("SECRET_KEY env var is not defined");

  const [ivHex, encryptedText] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Function to get ticks to readable duration
 * @param ticks ticks to convert
 * @returns date from the given ticks
 */
export function TicksToDuration(ticks: number): string {
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
      // if already exist
      if (acc[current.item_name]) {
        // merge items locations
        acc[current.item_name].item_location = [
          ...acc[current.item_name].item_location,
          ...current.item_location,
        ];
      } else {
        // add it
        acc[current.item_name] = { ...current };
      }

      return acc;
    }, {})
  );

  // shuffle
  return filteredItems
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number
) {
  let timeoutTimer: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeoutTimer);

    timeoutTimer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

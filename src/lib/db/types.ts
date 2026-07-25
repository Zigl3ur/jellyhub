import { customType } from "drizzle-orm/sqlite-core";
import { decrypt, encrypt } from "@/utils";

export const encryptedText = customType<{ data: string; driverData: string }>({
  dataType() {
    return "text";
  },
  toDriver(value) {
    return encrypt(value);
  },
  fromDriver(value) {
    return decrypt(value);
  },
});

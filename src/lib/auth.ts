import { payloadType } from "@/types/auth.types";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

/**
 * Functio n to create a jwt token from a payload
 * @param payload payload for jwt
 * @returns JWT token
 */
export async function encrypt(payload: payloadType): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

/**
 * Funtion to decrypt a JWT
 * @param token JWT token to decrypt
 * @returns the jwt payload from the decrypted token
 */
export async function decrypt(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
/**
 *  Function to delete the session token of the user
 * @returns nothing
 */
export async function logout(): Promise<void> {
  // delete cookie session
  (await cookies()).set("session-token", "", { expires: new Date(0) });
  return;
}

/**
 *  Function to get the user session
 * @returns null or the jwt payload if session token valid
 */
export async function getSession(): Promise<null | JWTPayload> {
  const session = (await cookies()).get("session-token")?.value;
  if (!session) return null;
  return await decrypt(session);
}

// funct to refresh token ?

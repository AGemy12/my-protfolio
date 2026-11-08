import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// The dashboard has one user: whoever knows ADMIN_PASSWORD. A successful
// login stores a signed, expiring token in an httpOnly cookie. Every admin
// page, server action and API route checks it with isAdmin().

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const password = () => process.env.ADMIN_PASSWORD ?? "";
const secret = () => process.env.ADMIN_SECRET ?? "";

export const isAuthConfigured = () => password().length >= 8 && secret().length >= 32;

// The password is part of the key, so changing it signs everyone out.
const sign = (payload: string) =>
  createHmac("sha256", `${secret()}\0${password()}`).update(payload).digest("base64url");

const sameText = (a: string, b: string) => {
  // Hashing first gives equal-length buffers, as timingSafeEqual requires.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
};

export function checkPassword(input: string) {
  return isAuthConfigured() && sameText(input, password());
}

export async function startSession() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = String(expires);
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!isAuthConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !sameText(signature, sign(payload))) return false;
  return Number(payload) > Date.now() / 1000;
}

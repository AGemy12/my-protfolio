// Edge-safe session helpers (used by proxy.ts and server code). No DB access here:
// the proxy only checks the signature; lib/auth.ts also checks the token is still
// valid against the admin record (see `sessionVersion`).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "pf_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set and at least 32 characters long");
  }
  return new TextEncoder().encode(value);
}

/** `v` is the admin's sessionVersion when the token was issued. */
export type SessionPayload = { sub: string; email: string; v: number };

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ email: payload.email, v: payload.v })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.email !== "string") return null;
    // Tokens issued before versioning existed carry no `v`; they count as version 0.
    const v = typeof payload.v === "number" ? payload.v : 0;
    return { sub: payload.sub, email: payload.email, v };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE,
} as const;

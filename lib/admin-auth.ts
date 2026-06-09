import "server-only";

import crypto from "crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "get-text-admin-session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "tsaintcbse";
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ??
  crypto.createHash("sha256").update(`get-text-admin:${ADMIN_PASSWORD}`).digest("hex");
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sign(value: string) {
  return crypto.createHmac("sha256", ADMIN_SESSION_SECRET).update(value).digest("base64url");
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminPassword(candidate: string) {
  return constantTimeEqual(sha256(candidate), sha256(ADMIN_PASSWORD));
}

export function createAdminSessionValue() {
  const payload = {
    exp: Date.now() + SESSION_TTL_MS,
    nonce: crypto.randomBytes(16).toString("hex"),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionValue(value?: string) {
  if (!value) {
    return false;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  if (!constantTimeEqual(signature, sign(encodedPayload))) {
    return false;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      exp?: number;
    };

    return typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionValue(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

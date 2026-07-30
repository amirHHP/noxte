import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "noxte-admin-session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || "noxte-dev-secret-change-in-production";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const payload = JSON.stringify({
    exp: Date.now() + SESSION_TTL_MS,
    role: "admin",
  });
  const signature = createHmac("sha256", getAdminSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const separator = decoded.lastIndexOf("|");
    if (separator === -1) return false;

    const payload = decoded.slice(0, separator);
    const signature = decoded.slice(separator + 1);
    const expected = createHmac("sha256", getAdminSecret())
      .update(payload)
      .digest("hex");

    if (signature.length !== expected.length) return false;
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return false;
    }

    const data = JSON.parse(payload) as { exp: number; role: string };
    return data.role === "admin" && Date.now() < data.exp;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return !!token && verifySessionToken(token);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("UNAUTHORIZED");
  }
}

export { SESSION_COOKIE, SESSION_TTL_MS };

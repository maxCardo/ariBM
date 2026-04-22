import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_RSVP_COOKIE = "admin_rsvp";

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

export function createAdminRsvpToken(): string | null {
  const secret = getSecret();
  if (!secret) {
    return null;
  }
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  const payload = Buffer.from(JSON.stringify({ exp }), "utf8").toString(
    "base64url",
  );
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminRsvpToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }
  const secret = getSecret();
  if (!secret) {
    return false;
  }
  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }
  const [payload, sig] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const sigA = Buffer.from(sig, "utf8");
  const sigB = Buffer.from(expected, "utf8");
  if (sigA.length !== sigB.length || !timingSafeEqual(sigA, sigB)) {
    return false;
  }
  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { exp?: number };
    if (typeof data.exp !== "number" || Math.floor(Date.now() / 1000) > data.exp) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

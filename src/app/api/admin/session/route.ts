import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_RSVP_COOKIE,
  createAdminRsvpToken,
} from "@/lib/admin-pin-session";

function expectedPin(): string {
  return process.env.ADMIN_PIN ?? "0406";
}

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    console.error("[admin] ADMIN_SESSION_SECRET is not set");
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const pin =
    typeof body === "object" &&
    body !== null &&
    "pin" in body &&
    typeof (body as { pin: unknown }).pin === "string"
      ? (body as { pin: string }).pin.trim()
      : "";

  if (pin !== expectedPin()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const token = createAdminRsvpToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  const jar = await cookies();
  jar.set(ADMIN_RSVP_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ ok: true });
}

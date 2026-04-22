import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_RSVP_COOKIE } from "@/lib/admin-pin-session";

export async function POST() {
  const jar = await cookies();
  jar.delete({ name: ADMIN_RSVP_COOKIE, path: "/" });
  return NextResponse.json({ ok: true });
}

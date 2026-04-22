import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_RSVP_COOKIE,
  verifyAdminRsvpToken,
} from "@/lib/admin-pin-session";
import { labelRsvpEventSlugs } from "@/lib/rsvp-event-labels";
import { connectDb } from "@/lib/mongodb";
import { Rsvp } from "@/models/Rsvp";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(ADMIN_RSVP_COOKIE)?.value;

  if (!verifyAdminRsvpToken(token)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  await connectDb();
  const docs = await Rsvp.find()
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  const rows = docs.map((d) => ({
    id: String(d._id),
    guestName: d.guestName,
    email: d.email,
    attending: d.attending === "yes" ? "yes" : "no",
    guestCount: typeof d.guestCount === "number" ? d.guestCount : null,
    events: labelRsvpEventSlugs(d.events as string[]),
    shabbosHospitality:
      d.shabbosHospitality === "yes" || d.shabbosHospitality === "no"
        ? d.shabbosHospitality
        : null,
    notes:
      typeof d.notes === "string"
        ? d.notes
        : typeof d.dietary === "string"
          ? d.dietary
          : "",
    createdAt:
      d.createdAt instanceof Date
        ? d.createdAt.toISOString()
        : String(d.createdAt),
  }));

  return NextResponse.json({ ok: true, rows });
}

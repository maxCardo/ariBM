import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import { sendRsvpNotificationEmail } from "@/lib/send-rsvp-notification";
import { Rsvp } from "@/models/Rsvp";

const ALLOWED_EVENTS = new Set([
  "friday-night-dinner",
  "shabbat-day-lunch",
  "farewell-brunch",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const guestName =
      typeof body.guestName === "string" ? body.guestName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const attending = body.attending;
    const guestCount = Number(body.guestCount);
    const rawEvents = body.events;
    const eventsRaw =
      Array.isArray(rawEvents) && rawEvents.every((e) => typeof e === "string")
        ? (rawEvents as string[]).map((e) => e.trim()).filter(Boolean)
        : [];
    const events = [...new Set(eventsRaw)];
    const shabbosHospitality = body.shabbosHospitality;
    const notes =
      typeof body.notes === "string"
        ? body.notes.trim()
        : typeof body.dietary === "string"
          ? body.dietary.trim()
          : "";

    if (!guestName || guestName.length > 200) {
      return NextResponse.json(
        { ok: false, error: "invalid_guest_name" },
        { status: 400 },
      );
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 320) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 },
      );
    }
    if (attending !== "yes" && attending !== "no") {
      return NextResponse.json(
        { ok: false, error: "invalid_attending" },
        { status: 400 },
      );
    }
    if (notes.length > 4000) {
      return NextResponse.json(
        { ok: false, error: "invalid_notes" },
        { status: 400 },
      );
    }
    if (
      attending === "yes" &&
      (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 500)
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_guest_count" },
        { status: 400 },
      );
    }
    if (attending === "yes" && events.length === 0) {
      return NextResponse.json(
        { ok: false, error: "events_required" },
        { status: 400 },
      );
    }
    if (attending === "yes") {
      for (const id of events) {
        if (!ALLOWED_EVENTS.has(id)) {
          return NextResponse.json(
            { ok: false, error: "invalid_event" },
            { status: 400 },
          );
        }
      }
    }
    if (
      attending === "yes" &&
      shabbosHospitality !== "yes" &&
      shabbosHospitality !== "no"
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_hospitality" },
        { status: 400 },
      );
    }

    await connectDb();

    const rsvpToCreate: Record<string, unknown> = {
      guestName,
      email,
      attending,
      notes,
    };

    if (attending === "yes") {
      rsvpToCreate.guestCount = guestCount;
      rsvpToCreate.events = events;
      rsvpToCreate.shabbosHospitality = shabbosHospitality;
    }

    await Rsvp.create(rsvpToCreate);

    let emailSent = false;
    try {
      const shabbosHospitalityForEmail =
        attending === "yes" &&
        (shabbosHospitality === "yes" || shabbosHospitality === "no")
          ? shabbosHospitality
          : null;
      const result = await sendRsvpNotificationEmail({
        guestName,
        email,
        attending,
        guestCount: attending === "yes" ? guestCount : null,
        events: attending === "yes" ? events : [],
        shabbosHospitality: shabbosHospitalityForEmail,
        notes,
      });
      emailSent = result.sent;
    } catch (err) {
      console.error("[rsvp] notification email failed:", err);
    }

    return NextResponse.json({ ok: true, emailSent }, { status: 201 });
  } catch (err) {
    console.error("[rsvp] POST error:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}

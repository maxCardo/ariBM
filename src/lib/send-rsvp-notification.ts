import sgMail from "@sendgrid/mail";

const EVENT_LABELS: Record<string, string> = {
  "friday-night-dinner": "Friday Night Dinner",
  "shabbat-day-lunch": "Shabbat Day Lunch",
  "farewell-brunch": "Farewell Brunch",
};

export type RsvpEmailPayload = {
  guestName: string;
  email: string;
  attending: "yes" | "no";
  guestCount: number | null;
  events: string[];
  shabbosHospitality: "yes" | "no" | null;
  notes: string;
};

export async function sendRsvpNotificationEmail(
  payload: RsvpEmailPayload,
): Promise<{ sent: boolean }> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.RSVP_NOTIFY_EMAIL;

  if (!apiKey || !from || !to) {
    console.warn(
      "[rsvp] Missing SENDGRID_API_KEY, EMAIL_FROM, or RSVP_NOTIFY_EMAIL — email not sent.",
    );
    return { sent: false };
  }

  sgMail.setApiKey(apiKey);

  const eventsHuman = payload.events.map(
    (id) => EVENT_LABELS[id] ?? id,
  );

  const body = [
    "New RSVP on the Ari Bar Mitzvah site",
    "",
    `Name: ${payload.guestName}`,
    `Email: ${payload.email}`,
    `Attending: ${payload.attending === "yes" ? "Yes" : "No"}`,
    `Total guests: ${payload.guestCount ?? "(not attending)"}`,
    `Events: ${eventsHuman.length > 0 ? eventsHuman.join(", ") : "(none)"}`,
    `Shabbos hospitality: ${
      payload.shabbosHospitality === null
        ? "(not attending)"
        : payload.shabbosHospitality === "yes"
          ? "Yes"
          : "No"
    }`,
    `Notes: ${payload.notes || "(none)"}`,
    "",
    `Submitted at ${new Date().toISOString()}`,
  ].join("\n");

  await sgMail.send({
    to,
    from,
    subject: `RSVP: ${payload.guestName}`,
    text: body,
  });

  return { sent: true };
}

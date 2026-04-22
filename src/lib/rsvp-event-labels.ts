/** Slugs stored by `POST /api/rsvp` — keep in sync with `RsvpForm` / API allowlist. */
export const RSVP_EVENT_LABELS: Record<string, string> = {
  "friday-night-dinner": "Friday Night Dinner",
  "shabbat-day-lunch": "Shabbat Day Lunch",
  "farewell-brunch": "Farewell Brunch",
};

export function labelRsvpEventSlugs(slugs: string[]): string[] {
  return slugs.map((id) => RSVP_EVENT_LABELS[id] ?? id);
}

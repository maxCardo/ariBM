"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "submitting" | "submitted" | "error";

const RSVP_EVENTS = [
  { id: "friday-night-dinner", label: "Friday Night Dinner" },
  { id: "shabbat-day-lunch", label: "Shabbat Day Lunch" },
  { id: "farewell-brunch", label: "Farewell Brunch" },
] as const;

export function RsvpForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [attendingError, setAttendingError] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [eventError, setEventError] = useState<string | null>(null);
  const [shabbosHospitality, setShabbosHospitality] = useState<
    "yes" | "no" | null
  >(null);
  const [hospitalityError, setHospitalityError] = useState<string | null>(null);

  const toggleEvent = (id: string) => {
    setEventError(null);
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (attending === null) {
      setAttendingError("Please select whether you are attending.");
      return;
    }
    if (attending === "yes" && selectedEvents.size === 0) {
      setEventError("Please choose at least one event you plan to attend.");
      return;
    }
    if (attending === "yes" && shabbosHospitality === null) {
      setHospitalityError(
        "Please answer whether you need Shabbos hospitality.",
      );
      return;
    }

    const form = event.currentTarget;
    const fd = new FormData(form);

    const guestName = String(fd.get("guestName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const guestCount = Number(fd.get("guestCount"));
    const notes = String(fd.get("notes") ?? "").trim();

    const payload = {
      guestName,
      email,
      attending,
      guestCount: attending === "yes" ? guestCount : undefined,
      events: attending === "yes" ? [...selectedEvents] : [],
      shabbosHospitality: attending === "yes" ? shabbosHospitality : undefined,
      notes,
    };

    setStatus("submitting");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        const map: Record<string, string> = {
          invalid_guest_name: "Please enter a valid name.",
          invalid_email: "Please enter a valid email address.",
          invalid_attending: "Please choose whether you are attending.",
          invalid_guest_count: "Please enter a valid guest count.",
          events_required: "Please choose at least one event.",
          invalid_event: "One or more selected events were invalid.",
          invalid_hospitality: "Please answer the Shabbos hospitality question.",
          invalid_notes: "Please shorten your notes and try again.",
          server_error: "Something went wrong. Please try again later.",
        };
        setErrorMessage(
          map[data.error ?? ""] ?? "Could not save your RSVP. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("submitted");
      const submittedAttending = attending;
      setAttending(null);
      setAttendingError(null);
      setSelectedEvents(new Set());
      setShabbosHospitality(null);
      setEventError(null);
      setHospitalityError(null);
      form.reset();
      if (submittedAttending === "yes") {
        router.push("/thank-you");
        return;
      }
      if (submittedAttending === "no") {
        router.push("/sorry");
        return;
      }
    } catch {
      setErrorMessage(
        "Network error — check your connection and try again.",
      );
      setStatus("error");
    }
  };

  return (
    <section className="mx-auto w-full rounded-2xl bg-[#efefef]/50 p-5 shadow-lg backdrop-blur-[2px] ring-1 ring-[#f3b28a]">
      <h2 className="text-xl font-semibold text-[#006a78]">Weekend RSVP</h2>
      <p className="mt-1 text-sm text-[#006a78]">
        Let us know who&apos;s joining us. We&apos;ll follow up with event details.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-4 grid gap-3 md:grid-cols-2 md:gap-x-4 md:gap-y-3"
      >
        <label className="grid gap-1 text-sm">
          Full name
          <input
            required
            name="guestName"
            disabled={status === "submitting"}
            className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none disabled:opacity-60"
            placeholder="Taylor Smith"
          />
        </label>

        <label className="grid gap-1 text-sm md:col-start-2 md:row-start-1">
          Email
          <input
            required
            type="email"
            name="email"
            disabled={status === "submitting"}
            className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none disabled:opacity-60"
            placeholder="you@email.com"
          />
        </label>

        <div className="grid gap-2 md:col-span-2">
          <span className="text-sm text-[#006a78]">Will you be attending?</span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "yes" as const, label: "Yes" },
                { value: "no" as const, label: "No" },
              ] as const
            ).map(({ value, label }) => {
              const on = attending === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={on}
                  disabled={status === "submitting"}
                  onClick={() => {
                    setAttending(value);
                    setAttendingError(null);
                    if (value === "no") {
                      setSelectedEvents(new Set());
                      setShabbosHospitality(null);
                      setEventError(null);
                      setHospitalityError(null);
                    }
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006a78] focus-visible:ring-offset-2 disabled:opacity-60 ${
                    on
                      ? "border-[#f38a4a] bg-[#f38a4a] text-white shadow-sm"
                      : "border-[#86dbe4] bg-white text-[#006a78] hover:border-[#006a78]/50"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {attendingError ? (
            <p className="text-sm text-red-700" role="alert">
              {attendingError}
            </p>
          ) : null}
        </div>

        {attending === "yes" ? (
          <>
            <label className="grid gap-1 text-sm md:col-span-2">
              Total guests attending
              <input
                required
                type="number"
                min={1}
                name="guestCount"
                disabled={status === "submitting"}
                className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none disabled:opacity-60"
                placeholder="2"
              />
            </label>

            <div className="grid gap-2 md:col-span-2">
              <span className="text-sm text-[#006a78]">
                Which events will you attend?
              </span>
              <div className="flex flex-wrap gap-2">
                {RSVP_EVENTS.map((ev) => {
                  const on = selectedEvents.has(ev.id);
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      aria-pressed={on}
                      disabled={status === "submitting"}
                      onClick={() => toggleEvent(ev.id)}
                      className={`rounded-full border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006a78] focus-visible:ring-offset-2 disabled:opacity-60 ${
                        on
                          ? "border-[#f38a4a] bg-[#f38a4a] text-white shadow-sm"
                          : "border-[#86dbe4] bg-white text-[#006a78] hover:border-[#006a78]/50"
                      }`}
                    >
                      {ev.label}
                    </button>
                  );
                })}
              </div>
              {eventError ? (
                <p className="text-sm text-red-700" role="alert">
                  {eventError}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <span className="text-sm text-[#006a78]">
                Do you need Shabbos hospitality?
              </span>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "yes" as const, label: "Yes" },
                    { value: "no" as const, label: "No" },
                  ] as const
                ).map(({ value, label }) => {
                  const on = shabbosHospitality === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={on}
                      disabled={status === "submitting"}
                      onClick={() => {
                        setHospitalityError(null);
                        setShabbosHospitality(value);
                      }}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006a78] focus-visible:ring-offset-2 disabled:opacity-60 ${
                        on
                          ? "border-[#f38a4a] bg-[#f38a4a] text-white shadow-sm"
                          : "border-[#86dbe4] bg-white text-[#006a78] hover:border-[#006a78]/50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {hospitalityError ? (
                <p className="text-sm text-red-700" role="alert">
                  {hospitalityError}
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        <label className="grid gap-1 text-sm md:col-span-2">
          Notes
          <textarea
            name="notes"
            disabled={status === "submitting"}
            className="min-h-16 rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none disabled:opacity-60"
            placeholder={
              attending === "no"
                ? "If you'd like, share why you can't make it or leave us a note."
                : "Anything we should know (dietary, accessibility, timing, etc.)"
            }
          />
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-1 rounded-md bg-[#f38a4a] px-4 py-2 font-medium text-white transition hover:bg-[#df7636] disabled:opacity-60 md:col-span-2"
        >
          {status === "submitting" ? "Sending…" : "Send RSVP"}
        </button>
      </form>

      {status === "error" && errorMessage ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200">
          {errorMessage}
        </p>
      ) : null}

      {status === "submitted" && (
        <p className="mt-4 rounded-md bg-[#bfeef3] px-3 py-2 text-sm text-[#006a78]">
          Thank you! Your RSVP was recorded.
        </p>
      )}
    </section>
  );
}

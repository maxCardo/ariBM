"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "submitted";

export function RsvpForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitted");
    event.currentTarget.reset();
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
            className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none"
            placeholder="Taylor Smith"
          />
        </label>

        <label className="grid gap-1 text-sm md:col-start-2 md:row-start-1">
          Email
          <input
            required
            type="email"
            name="email"
            className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none"
            placeholder="you@email.com"
          />
        </label>

        <label className="grid gap-1 text-sm md:col-span-2">
          Total guests attending
          <input
            required
            type="number"
            min={1}
            name="guestCount"
            className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none"
            placeholder="2"
          />
        </label>

        <label className="grid gap-1 text-sm md:col-span-2">
          Dietary notes
          <textarea
            name="dietary"
            className="min-h-16 rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none"
            placeholder="Vegetarian, nut allergy, kosher style, etc."
          />
        </label>

        <label className="grid gap-1 text-sm md:col-span-2">
          Song request for the dance floor
          <input
            name="song"
            className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 focus:border-[#006a78] focus:outline-none"
            placeholder="Optional"
          />
        </label>

        <button
          type="submit"
          className="mt-1 rounded-md bg-[#f38a4a] px-4 py-2 font-medium text-white transition hover:bg-[#df7636] md:col-span-2"
        >
          Send RSVP
        </button>
      </form>

      {status === "submitted" && (
        <p className="mt-4 rounded-md bg-[#bfeef3] px-3 py-2 text-sm text-[#006a78]">
          Thank you! Your RSVP was recorded.
        </p>
      )}
    </section>
  );
}

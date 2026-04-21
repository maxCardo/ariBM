const events = [
  {
    day: "Friday",
    title: "Shabbat Dinner",
    time: "6:30 PM",
    note: "Welcome dinner with close family and friends.",
  },
  {
    day: "Saturday",
    title: "Bar Mitzvah Service",
    time: "10:00 AM",
    note: "Main ceremony followed by kiddush luncheon.",
  },
  {
    day: "Saturday",
    title: "Evening Celebration",
    time: "7:00 PM",
    note: "Dinner, dancing, and toasts.",
  },
  {
    day: "Sunday",
    title: "Farewell Brunch",
    time: "10:30 AM",
    note: "Casual sendoff before everyone heads home.",
  },
];

export default function WeekendPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold text-[#f38a4a]">Weekend Schedule</h1>
      <p className="text-[#006a78]">
        A quick look at the celebration lineup. We can add locations once they
        are finalized.
      </p>
      <section className="grid gap-3">
        {events.map((event) => (
          <article
            key={`${event.day}-${event.title}`}
            className="rounded-xl bg-[#efefef] p-4 shadow-sm ring-1 ring-[#f3b28a]"
          >
            <p className="text-xs font-semibold tracking-wide text-[#f38a4a]">
              {event.day}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#006a78]">
              {event.title}
            </h2>
            <p className="text-sm font-medium text-[#006a78]/80">{event.time}</p>
            <p className="mt-1 text-sm text-[#006a78]">{event.note}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

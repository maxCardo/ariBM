const mapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const events = [
  {
    day: "Friday",
    title: "Shabbat Dinner",
    time: "8:00 PM",
    note: "Welcome dinner with close family and friends.",
    location: "Location TBD",
    mapsQuery: "Squirrel Hill, Pittsburgh, PA 15217",
  },
  {
    day: "Saturday",
    title: "Shacharis",
    time: "9:00 AM",
    note: "Followed by kiddush.",
    location:
      "Shaare Torah Congregation, 2319 Murray Ave, Pittsburgh, PA 15217",
    mapsQuery:
      "Shaare Torah Congregation, 2319 Murray Ave, Pittsburgh, PA 15217",
  },
  {
    day: "Saturday",
    title: "Lunch",
    time: "1:00 PM (Approx)",
    location:
      "Shaare Torah Congregation, 2319 Murray Ave, Pittsburgh, PA 15217",
    mapsQuery:
      "Shaare Torah Congregation, 2319 Murray Ave, Pittsburgh, PA 15217",
  },
  {
    day: "Sunday",
    title: "Farewell Brunch",
    time: "10:00 AM",
    note: "Casual sendoff before everyone heads home.",
    location: "Poznanski home, 6352 Waldron St, Pittsburgh, PA 15217",
    mapsQuery: "6352 Waldron St, Pittsburgh, PA 15217",
  },
];

export default function WeekendPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold leading-tight text-[#f38a4a]">
          Weekend Schedule
        </h1>
        <p className="text-[#006a78]">
          A quick look at the celebration lineup, times, and where to go.
        </p>
      </div>
      <section className="grid w-full min-w-0 gap-3">
        {events.map((event) => (
          <article
            key={`${event.day}-${event.title}`}
            className="flex w-full min-w-0 flex-col gap-2 rounded-xl bg-[#efefef] p-4 shadow-sm ring-1 ring-[#f3b28a]"
          >
            <p className="text-xs font-semibold tracking-wide text-[#f38a4a]">
              {event.day}
            </p>
            <h2 className="text-lg font-semibold text-[#006a78]">{event.title}</h2>
            <p className="text-sm font-medium text-[#006a78]/80">{event.time}</p>
            {event.note ? (
              <p className="text-sm text-[#006a78]">{event.note}</p>
            ) : null}
            <p className="text-sm text-[#006a78]">
              <span className="font-medium">Where: </span>
              <a
                href={mapsSearchUrl(event.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                title="Open in Google Maps"
                className="font-medium text-[#006a78] underline decoration-[#f3b28a] underline-offset-[3px] transition hover:text-[#f38a4a] hover:decoration-[#f38a4a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006a78] focus-visible:ring-offset-2"
              >
                {event.location}
              </a>
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}

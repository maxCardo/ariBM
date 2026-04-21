import { RsvpForm } from "@/components/rsvp-form";

export default function Home() {
  return (
    <main
      className="relative flex min-h-[calc(100vh-92px)] flex-1 items-center justify-center bg-cover px-4 py-6"
      style={{
        backgroundImage: "url('/images/ari/ari-char-game.jpeg')",
        backgroundPosition: "center 80%",
      }}
    >
      <div className="absolute inset-0 bg-[#006a78]/35" />
      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-5">
        <section className="grid justify-items-center gap-3 text-center">
          <p className="w-fit rounded-full bg-[#e9f8fa] px-3 py-1 text-xs font-medium text-[#006a78]">
            Save the date: August 7th-9th
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Join us for Ari&apos;s Bar Mitzvah Weekend
          </h1>
          <p className="max-w-2xl text-base text-[#e8fbff]">
            We&apos;re celebrating with services, food, dancing, and lots of joy.
            Please RSVP below so we can plan the weekend.
          </p>
        </section>
        <RsvpForm />
      </section>
    </main>
  );
}

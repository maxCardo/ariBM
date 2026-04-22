import Image from "next/image";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-[calc(100vh-92px)] flex-1">
      <section className="relative w-full overflow-hidden bg-black">
        <div className="relative h-full min-h-[calc(100vh-92px)] w-full">
          <Image
            src="/images/ari/imaculate.JPG"
            alt=""
            fill
            sizes="100vw"
            className="scale-105 object-cover blur-xl"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/45" />
          <Image
            src="/images/ari/imaculate.JPG"
            alt="Imaculate"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
          <div className="absolute inset-x-0 top-4 flex justify-center px-4 text-center">
            <p className="rounded-lg bg-black/50 px-5 py-3 text-3xl font-semibold text-white md:text-5xl">
              Immaculate!! see yinz in Pittsburgh.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

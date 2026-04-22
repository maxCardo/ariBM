import Image from "next/image";

export default function SorryPage() {
  return (
    <main className="flex min-h-[calc(100vh-92px)] flex-1">
      <section className="relative w-full overflow-hidden bg-black">
        <div className="relative h-full min-h-[calc(100vh-92px)] w-full">
          <Image
            src="/images/ari/sorry.jpeg"
            alt=""
            fill
            sizes="100vw"
            className="scale-105 object-cover blur-xl"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/65" />
          <Image
            src="/images/ari/sorry.jpeg"
            alt="Sorry"
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
          <div className="absolute inset-x-0 top-4 flex justify-center px-4 text-center">
            <p className="rounded-lg bg-black/75 px-5 py-3 text-3xl font-semibold text-[#FFF4D6] md:text-5xl">
              We are sorry you could not make it but we hope to see you soon!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

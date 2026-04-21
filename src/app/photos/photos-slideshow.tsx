"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  src: string;
  caption: string;
};

type PhotosSlideshowProps = {
  slides: Slide[];
};

export function PhotosSlideshow({ slides }: PhotosSlideshowProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="m-6 rounded-2xl bg-[#efefef] p-6 ring-1 ring-[#f3b28a]">
        <p className="text-[#006a78]">
          Add JPG, JPEG, PNG, or WebP photos to `public/images/ari` to start
          the slideshow.
        </p>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="relative h-full min-h-[calc(100vh-92px)] w-full">
        <Image
          src={slides[activeSlide].src}
          alt=""
          fill
          sizes="100vw"
          className="scale-105 object-cover blur-xl"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/45" />
        <Image
          src={slides[activeSlide].src}
          alt={slides[activeSlide].caption}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-black/40 px-4 py-3 text-white">
        <p className="text-sm">{slides[activeSlide].caption}</p>
        <p className="text-xs text-white/85">
          {activeSlide + 1} / {slides.length}
        </p>
      </div>
    </section>
  );
}

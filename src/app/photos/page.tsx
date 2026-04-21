import { readdir } from "node:fs/promises";
import path from "node:path";
import { PhotosSlideshow } from "./photos-slideshow";

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function buildCaption(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getSlides() {
  const photosPath = path.join(process.cwd(), "public", "images", "ari");
  const files = await readdir(photosPath);

  return files
    .filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({
      src: `/images/ari/${encodeURIComponent(file)}`,
      caption: buildCaption(file),
    }));
}

export default async function PhotosPage() {
  const slides = await getSlides();

  return (
    <main className="flex min-h-[calc(100vh-92px)] flex-1">
      <PhotosSlideshow slides={slides} />
    </main>
  );
}

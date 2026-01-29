// src/lib/sanity/getImageUrl.ts
import { urlFor } from "./image";

// Use `any` because Sanity's types are tricky
type SanityImageSource = any;

export function getImageUrl(
  source: SanityImageSource | null | undefined,
  width: number,
  height: number
): string | null {
  // 1️⃣ Check if source exists
  if (!source) return null;

  // 2️⃣ Build the image URL safely
  const builder = urlFor(source);
  if (!builder) return null; // extra safety

  const imageUrl = builder.width(width).height(height).url();

  // 3️⃣ Explicitly check if the result is null
  if (!imageUrl) return null;

  return imageUrl;
}

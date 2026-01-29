// src/lib/sanity/getImageUrl.ts
import { urlFor } from "./image";

// Using 'any' because @sanity/image-url types can be tricky
type SanityImageSource = any;

export function getImageUrl(
  source: SanityImageSource | null | undefined,
  width: number,
  height: number
): string {
  // If source is missing, return a placeholder image
  if (!source) {
    return "/placeholder.png"; // Make sure this file exists in /public
  }

  const builder = urlFor(source);
  if (!builder) {
    return "/placeholder.png";
  }

  const imageUrl = builder.width(width).height(height).url();
  return imageUrl ?? "/placeholder.png";
}

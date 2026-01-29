// src/lib/sanity/getImageUrl.ts
import { urlFor } from "./image";

type SanityImageSource = any;

export function getImageUrl(
  source: SanityImageSource | null | undefined,
  width: number,
  height: number
): string {
  if (!source) {
    // Return a placeholder image URL if source is null
    return "/Blog2 body.png"; // <-- make sure you have this image in /public
  }

  const builder = urlFor(source);
  if (!builder) return "/placeholder.png";

  const imageUrl = builder.width(width).height(height).url();
  return imageUrl ?? "/placeholder.png";
}

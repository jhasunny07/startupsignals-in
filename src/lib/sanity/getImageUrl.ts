// src/lib/sanity/getImageUrl.ts
import { urlFor } from "./image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export function getImageUrl(
  source: SanityImageSource | null | undefined,
  width: number,
  height: number
): string {
  try {
    if (!source) {
      console.warn("getImageUrl: source is null, returning placeholder");
      return "/placeholder.png";
    }

    const imageUrl = urlFor(source).width(width).height(height).url();
    if (!imageUrl) {
      console.warn("getImageUrl: urlFor returned null, using placeholder");
      return "/placeholder.png";
    }

    return imageUrl;
  } catch (error) {
    console.error("getImageUrl: Error building image URL", error);
    return "/placeholder.png";
  }
}

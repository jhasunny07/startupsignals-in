// src/lib/sanity/image.ts
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { getSanityClient } from "./client";

export function urlFor(source: SanityImageSource | null | undefined) {
  const builder = imageUrlBuilder(getSanityClient());

  // If source is nullish, return a dummy builder that returns placeholder image
  if (!source) {
    return {
      width: () => ({ height: () => ({ url: () => "/placeholder.png" }) }),
      height: () => ({ width: () => ({ url: () => "/placeholder.png" }) }),
      url: () => "/placeholder.png",
    };
  }

  return builder.image(source);
}

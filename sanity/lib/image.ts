// sanity/lib/image.ts
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./client";

// Create builder using Sanity client
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource | null | undefined) {
  if (!source) {
    return null;
  }

  return builder.image(source);
}

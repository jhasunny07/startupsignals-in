// src/lib/sanity/image.ts
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { getSanityClient } from "./client";

const builder = imageUrlBuilder(getSanityClient());

export function urlFor(source: SanityImageSource | null | undefined) {
  try {
    if (!source) {
      console.warn("urlFor: source is null or undefined, returning placeholder");
      return {
        width: () => ({ height: () => ({ url: () => "/placeholder.png" }) }),
        height: () => ({ width: () => ({ url: () => "/placeholder.png" }) }),
        url: () => "/placeholder.png",
      };
    }

    const result = builder.image(source);
    if (!result) {
      console.warn("urlFor: builder.image returned null, returning placeholder");
      return {
        width: () => ({ height: () => ({ url: () => "/placeholder.png" }) }),
        height: () => ({ width: () => ({ url: () => "/placeholder.png" }) }),
        url: () => "/placeholder.png",
      };
    }

    return result;
  } catch (error) {
    console.error("urlFor: Exception while building image URL", error);
    return {
      width: () => ({ height: () => ({ url: () => "/placeholder.png" }) }),
      height: () => ({ width: () => ({ url: () => "/placeholder.png" }) }),
      url: () => "/placeholder.png",
    };
  }
}

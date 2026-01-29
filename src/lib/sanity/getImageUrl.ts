// src/lib/sanity/getImageUrl.ts
import { urlFor } from "./image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export function getImageUrl(
  source: SanityImageSource | null | undefined,
  width: number,
  height: number
): string {
  const builder = urlFor(source);
  try {
    return builder.width(width).height(height).url() ?? "/placeholder.png";
  } catch {
    return "/placeholder.png";
  }
}

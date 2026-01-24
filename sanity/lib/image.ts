import { createImageUrlBuilder } from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { dataset, projectId } from '../env';

// Initialize Sanity image builder
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource | null | undefined) => {
  if (!source) return null; // Safe fallback
  return builder.image(source);
};

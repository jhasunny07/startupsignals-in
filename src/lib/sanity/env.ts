// src/lib/sanity/env.ts
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
export const apiVersion = "2023-07-01"; // you can set the date you want
export const token = process.env.SANITY_API_TOKEN || "";

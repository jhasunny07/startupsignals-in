// src/lib/sanity/client.ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, token } from "./env"; // we will create this

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false, // set to false for fresh content
});

// Helper function to use in your pages
export const getSanityClient = () => client;

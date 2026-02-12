// src/sanity/lib/queries.ts
import groq from 'groq'

export const allPostsQuery = groq`
  *[_type == "post"] | order(date desc) {
    title,
    "slug": slug.current,
    date,
    description,
    "category": category->title,
    coverImage,
  }
`

export const postsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $categorySlug] | order(date desc) {
    title,
    "slug": slug.current,
    date,
    description,
    "category": category->title,
    coverImage,
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    date,
    description,
    "category": category->title,
    author,
    coverImage,
    body,
    _updatedAt
  }
`

export const latestPostsQuery = groq`
  *[_type == "post"] | order(date desc)[0...3] {
    title,
    "slug": slug.current,
    date,
    description,
    "category": category->title,
    coverImage,
  }
`

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    title,
    "slug": slug.current
  }
`

// ===== STARTUP NEWS =====
export const startupNewsQuery = groq`
  *[_type == "startupNews"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    // This converts the Portable Text array into a plain string for the grid
    "summary": pt::text(summary), 
    coverImage {
      asset->{
        _id,
        url
      }
    },
    publishedAt,
    "category": category->title
  }
`;
export const singleStartupNewsQuery = groq`
  *[_type == "startupNews" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    "authorName": author->name,
    "category": category->title,
    content[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->
      }
    }
  }
`;

// ===== UNICORN LIST =====
// Old query (ascending by rank)


// New query (descending by rank so latest unicorn is on top)
export const unicornListQuery = `
*[_type == "unicornStartup"] | order(rank desc) {
  _id,
  name,
  anchor,
  rank,
  valuation,
  currency,
  foundedYear,
  country,
  shortDescription,
  // This helps resolve image URLs inside the Portable Text array
  content[] {
    ...,
    _type == "image" => {
      ...,
      "url": asset->url
    }
  }
}
`;




/* ================================
   SHARK TANK INDIA – GROQ QUERIES
   ================================ */

/* 1. All Seasons (Hub page) - Updated to desc for latest first */
export const sharkTankSeasonsQuery = `
*[_type == "sharkTankSeason"]
| order(seasonNumber desc) {
  _id,
  title,
  "slug": slug.current,
  seasonNumber,
  year
}
`;

/* 2. Season Detail + Startups */
/* 2. Season Detail + Startups (Updated for Mobile Feed) */
export const sharkTankSeasonStartupsQuery = `
*[_type == "sharkTankStartup" && season->slug.current == $seasonSlug]
| order(companyName asc) {
  _id,
  companyName,
  "slug": slug.current,
  dealStatus,
  currentStatus,
  industry,
  pitchAmount,
  equityAsked,
  shortSummary,
  detailedJourney,
  fundingRaisedPostShow,
  valuation
}
`;

/* 3. Startup Detail Page */
export const sharkTankStartupDetailQuery = `
*[_type == "sharkTankStartup" && slug.current == $startupSlug][0] {
  companyName,
  "slug": slug.current,
  founders,
  industry,
  shortSummary,
  detailedJourney,
  season->{
    title,
    "slug": slug.current
  },
  episodeNumber,
  pitchAmount,
  equityAsked,
  dealStatus,
  currentStatus,
  fundingRaisedPostShow,
  lastUpdated,
  seoTitle,
  seoDescription
}
`;

/* 4. Filters – Deal / Status */
export const sharkTankFilteredStartupsQuery = `
*[_type == "sharkTankStartup"
  && season->slug.current == $seasonSlug
  && dealStatus == $dealStatus
] {
  companyName,
  "slug": slug.current,
  dealStatus,
  currentStatus
}
`;

;
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
export const startupNewsQuery = `
  *[_type == "startupNews"] | order(publishedAt desc) {
    title,
    slug,
    summary,
    coverImage,
    publishedAt
  }
`

export const singleStartupNewsQuery = `
  *[_type == "startupNews" && slug.current == $slug][0]
`

// ===== UNICORN LIST =====
// Old query (ascending by rank)


// New query (descending by rank so latest unicorn is on top)
export const unicornListQuery = `
*[_type == "unicornStartup"] | order(rank desc) {
  _id,
  name,
  rank,
  valuation,
  currency,
  foundedYear,
  country,
  description,
  "slug": slug.current
}
`



;
// src/app/blog/category/[slug]/page.tsx
export const dynamic = "force-dynamic";

import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { getSanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { postsByCategoryQuery } from "@/lib/sanity/queries";
import type { Metadata } from "next";

// --- 1. Dynamic Metadata for SEO ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categorySlug = slug?.toLowerCase()?.trim() ?? "";
  const categoryTitle = categorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "Category";

  return {
    title: `${categoryTitle} Articles`,
    description: `Explore all posts under ${categoryTitle.toLowerCase()}.`,
    openGraph: {
      title: `${categoryTitle} Articles`,
      description: `Explore all posts under ${categoryTitle.toLowerCase()}.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryTitle} Articles`,
      description: `Explore all posts under ${categoryTitle.toLowerCase()}.`,
    },
  };
}

// --- 2. Safe image helper ---
function getCoverImageUrl(coverImage: any): string {
  if (!coverImage) return "/images/default-post-cover.jpg";
  const builder = urlFor(coverImage);
  if (!builder) return "/images/default-post-cover.jpg";
  return builder.width(800).height(600).url() ?? "/images/default-post-cover.jpg";
}

// --- 3. Page Component ---
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categorySlug = slug?.toLowerCase()?.trim() ?? "";

  const client = getSanityClient();
  const posts = (await client.fetch(postsByCategoryQuery, { categorySlug })) || [];

  const categoryTitle = categorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "Category";

  return (
    <MainLayout>
      <main className="bg-gray-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {categoryTitle}
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Latest articles and insights in {categoryTitle.toLowerCase()}
            </p>
          </div>

          {/* No posts */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-medium text-gray-700">
                No posts found in "{categoryTitle}"
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Check back soon — new content coming!
              </p>
              <p className="mt-6 text-sm text-gray-500">
                (Debug: Slug used in query: "{categorySlug}")
              </p>
            </div>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <Link key={post.slug} href={`/blog/post/${post.slug}`} className="group block">
                  <article className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:-translate-y-2">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={getCoverImageUrl(post.coverImage)}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-8">
                      <h2 className="line-clamp-2 text-2xl font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p className="mt-4 line-clamp-3 text-gray-600 leading-relaxed">
                          {post.description}
                        </p>
                      )}
                      <div className="mt-6 flex items-center text-sm text-gray-500">
                        <time dateTime={post.date}>
                          {post.date
                            ? new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "No date"}
                        </time>
                        {post.category && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="font-medium text-indigo-600">{post.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}

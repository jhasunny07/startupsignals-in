// src/app/blog/[category]/page.tsx


export const dynamic = "force-dynamic";
export const revalidate = 0;

import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

import { client } from "../../../../sanity/lib/client";
import { postsByCategoryQuery } from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";

interface Post {
  title: string;
  slug: string;
  date?: string;
  description?: string;
  category?: string;
  coverImage?: any;
  _updatedAt?: string;
}

interface Props {
  params: { category: string };
}

/* -----------------------------------------
   SEO METADATA
------------------------------------------ */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params.category ?? "blog";
  const capitalized =
    category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${capitalized} | Startup Signals`,
    description: `Latest ${capitalized} related startup articles and insights.`,
  };
}

/* -----------------------------------------
   DATA FETCH (NO STATIC BUILD TRAP)
------------------------------------------ */
async function getPosts(category: string): Promise<Post[]> {
  if (!category) return [];
  const posts = await client.fetch(postsByCategoryQuery, {
    categorySlug: category,
  });
  return posts ?? [];
}

/* -----------------------------------------
   PAGE
------------------------------------------ */
export default async function CategoryPage({ params }: Props) {
  const category = params.category ?? "unknown";
  const posts = await getPosts(category);

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <header className="mb-14 text-center">
          <h1 className="text-4xl font-bold capitalize">
            {category} Posts
          </h1>
          <p className="mt-4 text-gray-600">
            Latest articles related to {category}
          </p>
        </header>

        {/* Empty State */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-6">
              No posts available in this category.
            </p>
            <Link
              href="/blog"
              className="text-indigo-600 hover:underline"
            >
              ← Back to Blog
            </Link>
          </div>
        ) : (
          /* Posts Grid */
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const imageBuilder = post.coverImage
                ? urlFor(post.coverImage)
                : null;

              const imageUrl =
                imageBuilder && imageBuilder.url()
                  ? `${imageBuilder.url()}?v=${post._updatedAt ?? ""}`
                  : "/images/default-post-cover.jpg";

              return (
                <article key={post.slug} className="group">
                  <Link href={`/blog/post/${post.slug}`}>
                    <div className="overflow-hidden rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all">
                      <div className="relative h-64">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>

                      <div className="p-6">
                        <span className="mb-3 inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm text-indigo-700">
                          {post.category ?? "General"}
                        </span>

                        <h2 className="mt-3 text-xl font-bold group-hover:text-indigo-600 transition">
                          {post.title}
                        </h2>

                        {post.description && (
                          <p className="mt-3 text-gray-600 line-clamp-3">
                            {post.description}
                          </p>
                        )}

                        {post.date && (
                          <time className="mt-4 block text-sm text-gray-500">
                            {new Date(post.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </time>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

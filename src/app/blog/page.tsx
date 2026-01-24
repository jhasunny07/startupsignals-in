// src/app/blog/[category]/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";

import { Metadata } from "next";
import { client } from "../../../sanity/lib/client";
import { urlFor } from "../../../sanity/lib/image";
import { postsByCategoryQuery } from "../../../sanity/lib/queries";

interface CategoryPageProps {
  params: { category: string };
}

interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category?: string;
  coverImage?: any;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = params.category ?? "unknown";
  const capitalized = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Unknown";

  return {
    title: `${capitalized} | Startup Blog`,
    description: `Latest insights, lessons, and strategies in ${capitalized.toLowerCase()} for founders and builders.`,
    openGraph: {
      title: `${capitalized} Insights`,
      description: `Explore articles on ${capitalized.toLowerCase()} in startups and growth.`,
    },
  };
}

// Fetch posts safely by category
async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  if (!categorySlug) return [];
  const posts = await client.fetch(postsByCategoryQuery, { categorySlug });
  return posts ?? [];
}

// Generate static paths for Next.js
export async function generateStaticParams() {
  const allPosts = await client.fetch(`*[_type=="post"]{ "categorySlug": category->slug.current }`);
  const categories = Array.from(new Set(allPosts.map((p: any) => p.categorySlug).filter(Boolean)));
  return categories.map((cat) => ({ category: cat }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category ?? "unknown";
  const posts = await getPostsByCategory(category);

  const capitalized = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Unknown";

  if (!posts || posts.length === 0) {
    return (
      <MainLayout>
        <div className="py-32 text-center">
          <h1 className="text-4xl font-bold">No posts in "{capitalized}" yet</h1>
          <Link href="/blog" className="mt-6 inline-block text-indigo-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">
            {capitalized} Insights
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 leading-relaxed">
            Practical advice, real-world lessons, and strategies for founders navigating {category.toLowerCase()}.
          </p>
        </header>

        {/* Posts Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const imageUrl = post.coverImage ? urlFor(post.coverImage)?.url() : "/images/default-post-cover.jpg";

            return (
              <article key={post.slug} className="group">
                <Link href={`/blog/post/${post.slug}`}>
                  <div className="overflow-hidden rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64">
                      <Image
                        src={imageUrl!}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-8">
                      <div className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
                        {post.category ?? "Uncategorized"}
                      </div>
                      <h2 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="mb-6 text-lg text-gray-600 line-clamp-3">{post.description}</p>
                      <time className="text-sm text-gray-500">
                        {post.date
                          ? new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Unknown date"}
                      </time>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* CTA / Explore All */}
        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-indigo-600 px-10 py-5 text-lg font-semibold text-white hover:bg-indigo-700 transition"
          >
            Explore All Topics →
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

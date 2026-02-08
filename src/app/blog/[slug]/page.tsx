// src/app/blog/[slug]/page.tsx
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { getSanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { postsByCategoryQuery } from "@/lib/sanity/queries";
import { ChevronLeft, Hash } from "lucide-react";

interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category?: string;
  coverImage?: any;
}

interface CategoryData {
  title: string;
  description?: string;
}

const categoryQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    title,
    description
  }
`;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;

  const client = getSanityClient();

  let posts: Post[] = [];
  let category: CategoryData | null = null;

  try {
    posts = await client.fetch(postsByCategoryQuery, { categorySlug });
    category = await client.fetch(categoryQuery, { slug: categorySlug });
  } catch (err) {
    console.error("Category page error:", err);
  }

  const displayTitle =
    category?.title ||
    categorySlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="relative border-b border-slate-200/80 bg-white/70 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
        <div className="relative max-w-[1400px] mx-auto px-6 py-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 mb-6"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            All Posts
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Hash className="h-5 w-5" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
              {displayTitle}
            </h1>
          </div>

          {category?.description ? (
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
              {category.description}
            </p>
          ) : (
            <p className="mt-6 text-lg text-slate-500 max-w-3xl">
              Latest insights in {displayTitle.toLowerCase()}.
            </p>
          )}
        </div>
      </header>

      {/* Posts */}
      <main className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        {posts.length === 0 ? (
          <div className="text-center py-32">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              No posts yet
            </h2>
            <p className="text-slate-600 max-w-md mx-auto mb-8">
              Check back soon or explore other topics.
            </p>
            <Link
              href="/blog"
              className="inline-flex px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
            >
              Back to All Posts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const imageUrl = post.coverImage
                ? (urlFor(post.coverImage)?.width(800).height(600).url() ??
                  null)
                : null;

              return (
                <article
                  key={post.slug}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <Link href={`/blog/post/${post.slug}`} className="block">
                    {imageUrl && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="p-7">
                      <div className="flex items-center gap-3 mb-4 text-xs font-black uppercase text-indigo-600">
                        <span>{post.category || "Post"}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <time>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })}
                        </time>
                      </div>
                      <h2 className="text-2xl font-extrabold mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-slate-600 text-base line-clamp-3">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export const dynamic = "force-dynamic";

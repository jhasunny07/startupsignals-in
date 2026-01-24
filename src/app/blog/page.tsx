// src/app/blog/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";

import { client } from "../../../sanity/lib/client";
import { allPostsQuery } from "../../../sanity/lib/queries";
import { urlFor } from "../../../sanity/lib/image";

interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
  coverImage?: any;
}

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await client.fetch(allPostsQuery);
    return posts ?? [];
  } catch (error) {
    console.error("[Sanity Fetch Error]", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h1 className="mb-12 text-5xl font-bold tracking-tight text-gray-900 text-center">
          Startup & Growth Insights
        </h1>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-xl">No posts published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Posts */}
            <div className="lg:col-span-2 space-y-12">
              {posts.map((post) => {
                // ✅ SAFE IMAGE RESOLUTION (THIS FIXES YOUR BUILD)
                const imageUrl =
                  post.coverImage
                    ? urlFor(post.coverImage)?.url()
                    : null;

                return (
                  <article key={post.slug} className="group">
                    <Link href={`/blog/post/${post.slug}`}>
                      <div className="overflow-hidden rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all">
                        <div className="relative h-64">
                          <Image
                            src={imageUrl ?? "/images/default-post-cover.jpg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="p-8">
                          <div className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
                            {post.category}
                          </div>

                          <h2 className="mb-4 text-3xl font-bold text-gray-900 group-hover:text-indigo-600">
                            {post.title}
                          </h2>

                          <p className="mb-6 text-lg text-gray-600 line-clamp-3">
                            {post.description}
                          </p>

                          <time className="text-sm text-gray-500">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            {/* Sidebar (unchanged) */}
            <aside className="space-y-10 lg:sticky lg:top-20">
              <div className="rounded-2xl border bg-white p-8 shadow-sm">
                <h3 className="mb-6 text-2xl font-bold">Categories</h3>
                <ul className="space-y-4">
                  <li><Link href="/blog/startups">Startups</Link></li>
                  <li><Link href="/blog/funding">Funding</Link></li>
                  <li><Link href="/blog/product">Product</Link></li>
                  <li><Link href="/blog/growth">Growth</Link></li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

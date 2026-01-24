// src/app/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
import Link from "next/link";
import { client } from "../../sanity/lib/client";
import { urlFor } from "../../sanity/lib/image";
import { latestPostsQuery } from "../../sanity/lib/queries";

interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
  coverImage: any | null;
}

async function getLatestPosts(): Promise<Post[]> {
  return client.fetch(latestPostsQuery);
}

export default async function Home() {
  const latestPosts = await getLatestPosts();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-24 sm:py-32">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Insights for <span className="text-indigo-600">Founders</span> & Builders
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-700">
            Honest stories, hard lessons, and tactical advice on startups, funding, product, and growth.
          </p>
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full bg-indigo-600 px-10 py-5 text-lg font-semibold text-white hover:bg-indigo-700"
            >
              Explore the Latest →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Insights
          </h2>

          {latestPosts.length === 0 ? (
            <p className="text-center text-gray-600">
              No posts yet — check back soon!
            </p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => {
                const imageUrl =
                  urlFor(post.coverImage)?.url() ??
                  "/images/default-post-cover.jpg";

                return (
                  <div
                    key={post.slug}
                    className="group overflow-hidden rounded-2xl border shadow-md hover:shadow-xl transition"
                  >
                    <div className="relative h-48">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="p-6">
                      <span className="inline-block mb-3 rounded-full bg-indigo-100 px-4 py-1 text-sm text-indigo-700">
                        {post.category}
                      </span>

                      <h3 className="text-xl font-semibold group-hover:text-indigo-600">
                        {post.title}
                      </h3>

                      <p className="mt-3 text-gray-600 line-clamp-3">
                        {post.description}
                      </p>

                      <Link
                        href={`/blog/post/${post.slug}`}
                        className="mt-4 inline-block text-indigo-600 font-medium hover:underline"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

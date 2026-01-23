// src/app/blog/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { allPostsQuery } from "@/sanity/lib/queries";

interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
  coverImage: any;
}

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await client.fetch(allPostsQuery);
    console.log('Sanity posts fetched:', posts.length); // log for Vercel
    return posts;
  } catch (error) {
    console.error('Sanity fetch error on /blog:', error);
    return []; // fallback – build won't crash
  }
}
export default async function BlogPage() {
  const posts = await getPosts();
  if (posts.length === 0) {
  console.log('No posts from Sanity – check env vars, query, or Studio');
}

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h1 className="mb-12 text-5xl font-bold tracking-tight text-gray-900 text-center">
          Startup & Growth Insights
        </h1>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-xl">No posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content - Posts List */}
            <div className="lg:col-span-2 space-y-12">
              {posts.map((post) => (
                <article key={post.slug} className="group">
                  <Link href={`/blog/post/${post.slug}`}>
                    <div className="overflow-hidden rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all duration-300">
                      <div className="relative h-64">
                        <Image
                          src={urlFor(post.coverImage).url() || "/images/default-post-cover.jpg"}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-8">
                        <div className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
                          {post.category}
                        </div>
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
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
              ))}
            </div>

            {/* Sidebar - unchanged */}
            <aside className="space-y-10 lg:sticky lg:top-20 lg:h-fit">
              <div className="rounded-2xl border bg-white p-8 shadow-sm">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Categories</h3>
                <ul className="space-y-4">
                  <li>
                    <Link href="/blog/startups" className="text-indigo-600 hover:underline">
                      Startups
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/funding" className="text-indigo-600 hover:underline">
                      Funding
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/product" className="text-indigo-600 hover:underline">
                      Product
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog/growth" className="text-indigo-600 hover:underline">
                      Growth
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border bg-gradient-to-br from-indigo-50 to-blue-50 p-8 shadow-sm text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">Stay Updated</h3>
                <p className="mb-6 text-gray-600">
                  Get new posts + exclusive startup tips in your inbox.
                </p>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full rounded-lg border-gray-300 px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition">
                    Subscribe →
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">About Sunny</h3>
                <p className="text-gray-600">
                  Founder building in public. Sharing real lessons on startups, funding, and growth hacks.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
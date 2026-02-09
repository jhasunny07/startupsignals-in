// src/app/blog/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { getSanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { allPostsQuery, allCategoriesQuery } from "@/lib/sanity/queries";
import {
  ArrowRight,
  Hash,
  Megaphone,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

interface Post {
  _id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  category?: any; // Kept flexible to handle string or object from Sanity
  coverImage?: any;
}

interface Category {
  title: string;
  slug: string;
}

export default async function BlogPage() {
  const client = getSanityClient();

  let posts: Post[] = [];
  let categories: Category[] = [];

  try {
    // Fetching data concurrently for better performance
    const [postsData, categoriesData] = await Promise.all([
      client.fetch(allPostsQuery),
      client.fetch(allCategoriesQuery),
    ]);
    posts = postsData || [];
    categories = categoriesData || [];
  } catch (e) {
    console.error("Sanity Fetch Error:", e);
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-slate-900">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-2">
            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.4em]">
              The Intelligent Builder
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              THE ARCHIVE<span className="text-slate-300">.</span>
            </h1>
          </div>
        </div>
      </header>

      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: DYNAMIC CATEGORIES */}
          <aside className="hidden lg:block lg:col-span-2 sticky top-28">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Hash className="h-3 w-3" /> Categories
            </h3>
            <nav className="flex flex-col gap-4">
              <Link
                href="/blog"
                className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors text-left border-l-2 border-transparent hover:border-indigo-600 pl-4"
              >
                All Posts
              </Link>
              {categories.map((cat, index) => (
                <Link
                  key={`sidebar-cat-${cat.slug || index}`}
                  href={`/blog/${cat.slug}`}
                  className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors text-left border-l-2 border-transparent hover:border-indigo-600 pl-4"
                >
                  {cat.title}
                </Link>
              ))}
            </nav>
          </aside>

          {/* MAIN FEED */}
          <main className="col-span-12 lg:col-span-7 space-y-12">
            {posts.map((post, index) => {
              const imageUrl = post.coverImage
                ? urlFor(post.coverImage)?.width(800).height(600).url()
                : null;

              // FIX: Handle category whether it is a string (title) or an object
              const categoryName =
                typeof post.category === "string"
                  ? post.category
                  : post.category?.title || "Intelligence";

              // FIX: Hydration safe date (avoiding new Date() on render)
              const displayYear = post.date ? post.date.split("-")[0] : "2026";

              return (
                <article
                  key={`post-feed-item-${post._id || post.slug || index}`}
                  className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500"
                >
                  <Link
                    href={`/blog/post/${post.slug}`}
                    className="grid grid-cols-1 md:grid-cols-12"
                  >
                    <div className="md:col-span-5 relative aspect-square md:aspect-auto overflow-hidden bg-slate-100">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          fill
                          alt={post.title}
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <div className="md:col-span-7 p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        <span>{categoryName}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-slate-400">{displayYear}</span>
                      </div>
                      <h2 className="text-2xl font-bold mb-4 group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter">
                        View Signal <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="col-span-12 lg:col-span-3 space-y-8 sticky top-28">
            {/* ADVERTISE */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mb-6">
                  <Megaphone className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-xl font-black mb-2 uppercase tracking-tight">
                  Partner with us
                </h4>
                <p className="text-slate-400 text-xs mb-6 font-medium leading-relaxed">
                  Put your product in front of 50,000+ founders and VC
                  decision-makers.
                </p>
                <Link
                  href="/advertise"
                  className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all w-full justify-center"
                >
                  Get Media Kit <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            </div>

            {/* TRENDING */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" /> Hot Topics
              </h3>
              <div className="space-y-6">
                {posts.slice(0, 3).map((p, i) => (
                  <Link
                    key={`trending-topic-${p._id || p.slug || i}`}
                    href={`/blog/post/${p.slug}`}
                    className="group block"
                  >
                    <span className="text-[10px] font-bold text-slate-300 uppercase block mb-1">
                      0{i + 1}
                    </span>
                    <h5 className="text-sm font-bold group-hover:text-indigo-600 transition-colors leading-tight">
                      {p.title}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

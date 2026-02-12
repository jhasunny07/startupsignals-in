// src/app/page.tsx
export const dynamic = "force-dynamic";

import { getSanityClient } from "@/lib/sanity/client";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronRight, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getHomeData() {
  const client = getSanityClient();
  const query = `{
    "categories": *[_type == "category"] { title, "slug": slug.current },
    "posts": *[_type == "post"] | order(date desc) [0...100] {
      _id,
      title,
      "slug": slug.current,
      description,
      "category": category->title,
      coverImage { asset->{ url } },
      date
    }
  }`;
  return await client.fetch(query);
}

export default async function Home() {
  const { categories, posts } = await getHomeData();

  if (!posts || posts.length === 0) {
    return (
      <div className="py-40 text-center font-bold text-slate-400 uppercase tracking-widest">
        Initializing Intelligence...
      </div>
    );
  }

  // 1. Identify the Hero Post (latest)
  const heroPost = posts[0];

  // 2. Filter categories to only include those that actually have posts
  const activeCategories = categories.filter((cat: any) =>
    posts.some(
      (p: any) => p.category?.toLowerCase() === cat.title?.toLowerCase(),
    ),
  );

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 ">
        <div className="container mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className="lg:col-span-7 space-y-6 md:space-y-8 order-2 lg:order-1 text-center lg:text-left">
              <div className="flex flex-col gap-4">
                <div className="flex justify-center lg:justify-start">
                  <Badge className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border-none shadow-lg shadow-indigo-100">
                    LATEST SIGNAL
                  </Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-4xl font-black text-slate-900 leading-[1.25] tracking-tighter">
                  {heroPost.title}
                </h1>
              </div>
              <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 line-clamp-3">
                {heroPost.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                <Link
                  href={`/blog/post/${heroPost.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                >
                  Read Full Signal <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative w-full aspect-square rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white bg-white rotate-1 lg:rotate-3">
                {heroPost.coverImage?.asset?.url && (
                  <Image
                    src={heroPost.coverImage.asset.url}
                    fill
                    className="object-cover"
                    alt={heroPost.title}
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC CATEGORY FEED */}
      <div className="container mx-auto px-5 md:px-6">
        {activeCategories.map((cat: any, idx: number) => {
          // Get ONLY posts belonging to this category
          const sectionPosts = posts.filter(
            (p: any) => p.category?.toLowerCase() === cat.title?.toLowerCase(),
          );

          // Skip rendering entirely if no posts found (extra safety)
          if (sectionPosts.length === 0) return null;

          const main = sectionPosts[0];
          const side = sectionPosts.slice(1, 4);

          return (
            <section
              key={`section-${cat.slug}`}
              className="py-10 border-b border-slate-100 last:border-0"
            >
              <div className="flex items-end justify-between mb-10 md:mb-14">
                <div className="space-y-2">
                  <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">
                    Channel
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                    {cat.title}
                  </h2>
                </div>
                <Link
                  href={`/blog/${cat.slug}`}
                  className="group text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-indigo-600 transition-all"
                >
                  View Channel{" "}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* MAIN FEATURE */}
                <div className="lg:col-span-7 group">
                  <Link
                    href={`/blog/post/${main.slug}`}
                    className="relative block overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl min-h-[450px]"
                  >
                    {main.coverImage?.asset?.url && (
                      <Image
                        src={main.coverImage.asset.url}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-40 transition-all duration-1000"
                        alt={main.title}
                      />
                    )}
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                      <div className="space-y-4 max-w-2xl">
                        <h3 className="text-3xl md:text-4xl font-black text-white leading-[1.1] tracking-tighter">
                          {main.title}
                        </h3>
                        <p className="text-white/70 text-base line-clamp-2 font-medium">
                          {main.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* SIDEBAR POSTS FOR THIS CATEGORY */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {side.map((post: any) => (
                    <Link
                      key={`side-${post.slug}`}
                      href={`/blog/post/${post.slug}`}
                      className="bg-white border border-slate-100 rounded-[2rem] p-5 hover:border-indigo-600 hover:shadow-xl transition-all group flex items-start gap-6"
                    >
                      <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                        {post.coverImage?.asset?.url && (
                          <Image
                            src={post.coverImage.asset.url}
                            fill
                            className="object-cover"
                            alt={post.title}
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-lg font-black leading-tight text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                          Read Signal <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                  {side.length === 0 && (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] p-10 text-slate-300 text-xs font-bold uppercase tracking-widest">
                      More signals coming soon
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

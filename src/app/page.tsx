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
    "posts": *[_type == "post"] | order(publishedAt desc) [0...40] {
      title,
      "slug": slug.current,
      description,
      "category": categories[0]->title,
      coverImage { asset->{ url } },
      publishedAt
    }
  }`;
  return await client.fetch(query);
}

export default async function Home() {
  const { categories, posts } = await getHomeData();

  if (!posts || posts.length === 0) {
    return (
      <div className="py-40 text-center font-bold text-slate-400">
        Content is loading...
      </div>
    );
  }

  const heroPost = posts[0];

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-slate-50 border-b border-slate-100 py-10 md:py-16">
        <div className="container mx-auto px-5 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="lg:col-span-7 space-y-5 md:space-y-6 order-2 lg:order-1 text-center lg:text-left">
              <Badge className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border-none">
                Top Intelligence
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight md:leading-[1.1] tracking-tighter line-clamp-3 break-words">
                {heroPost.title}
              </h1>
              <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 line-clamp-4 md:line-clamp-5">
                {heroPost.description}
              </p>
              <div className="pt-3 md:pt-4">
                <Link
                  href={`/blog/post/${heroPost.slug}`}
                  className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                >
                  Read Story <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] aspect-[4/3] sm:aspect-square rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border-8 md:border-[10px] border-white bg-white">
                {heroPost.coverImage?.asset?.url && (
                  <Image
                    src={heroPost.coverImage.asset.url}
                    fill
                    className="object-cover"
                    alt={heroPost.title || "Hero image"}
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SECTIONS */}
      <div className="container mx-auto px-5 md:px-6 ">
        {categories &&
          categories.slice(0, 5).map((cat: any, idx: number) => {
            let sectionPosts = posts.filter(
              (p: any) =>
                p.category?.toLowerCase() === cat.title?.toLowerCase(),
            );

            if (sectionPosts.length === 0) {
              const start = (idx + 1) % posts.length;
              sectionPosts = posts.slice(start, start + 4);
            }

            const main = sectionPosts[0];
            const side = sectionPosts.slice(1, 4);

            if (!main || !main.slug) return null;

            return (
              <section
                key={cat.slug || idx}
                className="py-12 md:py-16 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center justify-between mb-6 md:mb-10">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic">
                    {cat.title}
                  </h2>
                  <Link
                    href={`/blog/${cat.slug}`}
                    className="text-xs md:text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline transition-all"
                  >
                    View Channel <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                  {/* MAIN FEATURE CARD */}
                  <div className="lg:col-span-7 group">
                    <Link
                      href={`/blog/post/${main.slug}`}
                      className="relative block overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-slate-900 shadow-xl min-h-[320px] sm:min-h-[380px] md:min-h-[450px]"
                    >
                      {main.coverImage?.asset?.url && (
                        <Image
                          src={main.coverImage.asset.url}
                          fill
                          className="object-cover opacity-65 group-hover:opacity-45 transition-opacity duration-700"
                          alt={main.title || "Featured post"}
                        />
                      )}
                      <div className="absolute inset-0 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-end">
                        <div className="space-y-3 md:space-y-4 max-w-2xl">
                          <Badge className="bg-blue-600 text-white border-none text-[10px] md:text-xs px-2.5 py-1">
                            LATEST
                          </Badge>
                          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight md:leading-snug line-clamp-3 break-words overflow-hidden">
                            {main.title}
                          </h3>
                          <p className="text-white/85 text-sm sm:text-base line-clamp-2 md:line-clamp-3 font-medium overflow-hidden">
                            {main.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* SIDEBAR POSTS */}
                  <div className="lg:col-span-5 flex flex-col gap-5 md:gap-6">
                    {side.map((post: any) => {
                      if (!post || !post.slug) return null;
                      return (
                        <Link
                          key={post.slug}
                          href={`/blog/post/${post.slug}`}
                          className="bg-white border border-slate-100 rounded-2xl md:rounded-[2rem] p-4 sm:p-5 hover:border-blue-600 transition-all group shadow-sm flex flex-col sm:flex-row items-start gap-4 sm:gap-6 overflow-hidden"
                        >
                          {/* Thumbnail */}
                          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-slate-100 border border-slate-50 shadow-inner">
                            {post.coverImage?.asset?.url && (
                              <Image
                                src={post.coverImage.asset.url}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={post.title || "Post thumbnail"}
                              />
                            )}
                          </div>

                          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-tight">
                              <Calendar className="h-3.5 w-3.5 text-blue-600" />
                              {new Date(post.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </div>

                            <h4 className="text-base sm:text-lg font-black leading-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 break-words overflow-hidden">
                              {post.title}
                            </h4>

                            <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 font-medium overflow-hidden">
                              {post.description}
                            </p>

                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-blue-600 uppercase bg-blue-50/60 group-hover:bg-blue-600 group-hover:text-white px-3 py-1 rounded-md w-fit transition-all">
                              Quick Read <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
      </div>
    </div>
  );
}

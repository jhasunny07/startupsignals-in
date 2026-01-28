export const dynamic = "force-dynamic";


import MainLayout from "@/components/layout/MainLayout";
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
      <MainLayout>
        <div className="py-40 text-center font-bold text-slate-400">Content is loading...</div>
      </MainLayout>
    );
  }

  const heroPost = posts[0];

  return (
    <MainLayout>
      <div className="bg-white min-h-screen">
        
        {/* --- 1. REFINED HERO (Elegant & Balanced) --- */}
        <section className="bg-slate-50 border-b border-slate-100 py-12 md:py-2">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6 order-2 lg:order-1 text-center lg:text-left">
                <Badge className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none">
                  Top Intelligence
                </Badge>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                  {heroPost.title}
                </h1>
                <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {heroPost.description}
                </p>
                <div className="pt-4">
                  <Link href={`/blog/post/${heroPost.slug}`} className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
                    Read Story <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[500px] aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white bg-white">
                  {heroPost.coverImage?.asset?.url && (
                    <Image src={heroPost.coverImage.asset.url} fill className="object-cover" alt="" priority />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. CATEGORY SECTIONS --- */}
        <div className="container mx-auto px-6 py-12">
          {categories && categories.slice(0, 5).map((cat: any, idx: number) => {
            let sectionPosts = posts.filter((p: any) => p.category?.toLowerCase() === cat.title?.toLowerCase());
            
            if (sectionPosts.length === 0) {
                const start = (idx + 1) % posts.length;
                sectionPosts = posts.slice(start, start + 4);
            }

            const main = sectionPosts[0];
            const side = sectionPosts.slice(1, 4);

            if (!main || !main.slug) return null;

            return (
              <section key={cat.slug || idx} className="py-16 md:py-24 border-b border-slate-100 last:border-0">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{cat.title}</h2>
                  <Link href={`/blog/category/${cat.slug}`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline transition-all">
                    View Channel <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* MAIN OVERLAY CARD */}
                  <div className="lg:col-span-7 group">
                    <Link href={`/blog/post/${main.slug}`} className="relative block h-full min-h-[450px] overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-xl">
                      {main.coverImage?.asset?.url && (
                        <Image src={main.coverImage.asset.url} fill className="object-cover opacity-60 group-hover:opacity-40 transition-all duration-700" alt="" />
                      )}
                      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                        <div className="space-y-4 max-w-2xl">
                          <Badge className="bg-blue-600 text-white border-none text-[9px]">LATEST</Badge>
                          <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">{main.title}</h3>
                          <p className="text-white/80 text-sm md:text-base line-clamp-2 font-medium">{main.description}</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* SIDEBAR WITH DETAILED POSTS */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    {side.map((post: any) => {
                      if (!post || !post.slug) return null;
                      return (
                        <Link 
                          key={post.slug} 
                          href={`/blog/post/${post.slug}`} 
                          className="bg-white border border-slate-100 rounded-[2rem] p-5 hover:border-blue-600 transition-all group shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6"
                        >
                          {/* Sidebar Thumbnail */}
                          <div className="relative h-28 w-28 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-50 shadow-inner">
                            {post.coverImage?.asset?.url && (
                                <Image src={post.coverImage.asset.url} fill className="object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                               <Calendar className="h-3 w-3 text-blue-600" />
                               {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            
                            <h4 className="text-base font-black leading-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {post.title}
                            </h4>

                            <p className="text-slate-500 text-xs line-clamp-1 font-medium italic">
                              {post.description}
                            </p>

                            <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase bg-blue-50/50 group-hover:bg-blue-600 group-hover:text-white px-3 py-1.5 rounded-lg w-fit transition-all">
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
    </MainLayout>
  );
}
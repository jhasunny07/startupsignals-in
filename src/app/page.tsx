export const dynamic = "force-dynamic";
export const revalidate = 0;

import MainLayout from "@/components/layout/MainLayout";
import { getSanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Trophy, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  Zap,
  Globe
} from "lucide-react";

const HOME_PAGE_QUERY = `*[_type == "post"] | order(publishedAt desc) [0...20] {
  title,
  "slug": slug.current,
  description,
  "category": categories[0]->title,
  coverImage,
  "authorName": author->name,
  "authorImage": author->image
}`;

async function getHomeData() {
  const client = getSanityClient();
  return await client.fetch(HOME_PAGE_QUERY) || [];
}

export default async function Home() {
  const posts = await getHomeData();

  if (!posts.length) return <MainLayout><div className="h-screen flex items-center justify-center">Loading...</div></MainLayout>;

  const heroPost = posts[0];
  const trendingList = posts.slice(1, 5);
  const spotlightSection = posts.slice(5, 9);
  const feedPosts = posts.slice(9, 20);

  return (
    <MainLayout>
      <div className="bg-[#fcfcfc] min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
        
        {/* --- SECTION 1: THE COMMAND CENTER (Hero) --- */}
        <section className="pt-8 pb-20 px-4 md:px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Massive Hero Card */}
              <div className="lg:col-span-8 group relative">
                <Link href={`/blog/post/${heroPost.slug}`} className="block relative h-[600px] md:h-[700px] w-full overflow-hidden rounded-[3rem] bg-slate-900 shadow-2xl">
                  <Image
                    src={urlFor(heroPost.coverImage).url()}
                    alt={heroPost.title}
                    fill
                    className="object-cover opacity-70 transition-transform duration-1000 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                        Featured Signal
                      </span>
                      <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">{heroPost.category}</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tighter max-w-4xl">
                      {heroPost.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/80">
                      <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden relative">
                        {heroPost.authorImage && <Image src={urlFor(heroPost.authorImage).url()} fill alt="" />}
                      </div>
                      <span className="text-sm font-bold">{heroPost.authorName}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-sm font-medium">8 min read</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Trending Rail */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Live Intelligence
                  </h3>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                
                <div className="space-y-10 flex-1">
                  {trendingList.map((post: any, i: number) => (
                    <Link key={post.slug} href={`/blog/post/${post.slug}`} className="group flex gap-6 items-start">
                      <span className="text-3xl font-black text-slate-100 group-hover:text-indigo-600 transition-colors leading-none">0{i + 1}</span>
                      <div>
                        <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-all leading-tight mb-2 text-lg tracking-tight">
                          {post.title}
                        </h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link href="/blog" className="mt-10 pt-10 border-t border-slate-100 flex items-center justify-between group">
                  <span className="text-xs font-black uppercase tracking-widest">View Archive</span>
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: THE SPOTLIGHT (Success Stories style) --- */}
        <section className="py-24 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4 text-indigo-600">
                  <Trophy className="h-6 w-6" />
                  <span className="text-xs font-black uppercase tracking-[0.4em]">Proof of Concept</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase">Success <span className="text-slate-300">Stories.</span></h2>
              </div>
              <p className="max-w-xs text-slate-500 font-medium text-sm leading-relaxed italic">
                Deconstructing the strategy of the world's most aggressive builders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {spotlightSection.map((post: any) => (
                <Link key={post.slug} href={`/blog/post/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl ring-1 ring-slate-200">
                    <Image 
                      src={urlFor(post.coverImage).url()} 
                      fill 
                      alt="" 
                      className="object-cover transition-all duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                         <h4 className="font-bold text-white leading-tight mb-2">{post.title}</h4>
                         <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Explore</span>
                            <Zap className="h-3 w-3 text-indigo-300 fill-indigo-300" />
                         </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION 3: THE GLOBAL FEED (Dark Tier) --- */}
        <section className="mx-4 md:mx-8 mb-8 bg-slate-950 rounded-[4rem] py-24 px-4 md:px-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <Globe className="h-5 w-5 text-indigo-500" />
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Deep Feed Intelligence</h2>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {feedPosts.map((post: any) => (
                <Link key={post.slug} href={`/blog/post/${post.slug}`} className="group">
                  <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 border border-slate-800">
                    <Image src={urlFor(post.coverImage).url()} fill alt="" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">{post.category}</span>
                  <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors mb-4 tracking-tight leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-900 group-hover:border-indigo-500 transition-colors">
                     <Clock className="h-4 w-4 text-slate-600" />
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Analysis Protocol Complete</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
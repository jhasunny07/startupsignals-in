export const dynamic = "force-dynamic";
export const revalidate = 0;

import MainLayout from "@/components/layout/MainLayout";
import { getSanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Activity, 
  Plus, 
  ArrowUpRight,
  Search,
  LayoutGrid
} from "lucide-react";

const HOME_PAGE_QUERY = `*[_type == "post"] | order(publishedAt desc) [0...15] {
  title,
  "slug": slug.current,
  description,
  "category": categories[0]->title,
  coverImage {
    asset->{
      _id,
      url
    }
  },
  publishedAt,
  "authorName": author->name
}`;

export default async function Home() {
  const client = getSanityClient();
  const posts = await client.fetch(HOME_PAGE_QUERY) || [];

  if (!posts.length) return <MainLayout><div className="h-screen flex items-center justify-center">Initializing Signals...</div></MainLayout>;

  const mainFeature = posts[0];
  const sideFeatures = posts.slice(1, 4);
  const theFeed = posts.slice(4);

  return (
    <MainLayout>
      <div className="bg-[#0a0a0a] text-white min-h-screen">
        
        {/* --- 1. THE BENTO HERO GRID --- */}
        <section className="px-4 md:px-6 pt-6 pb-20">
          <div className="max-w-[1500px] mx-auto">
            
            {/* Top Navigation / Category Bar */}
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
               <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Global Feed</span>
                  <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:flex">
                     {["Strategy", "Capital", "Tech", "Success"].map(cat => (
                       <Link key={cat} href="#" className="hover:text-white transition-colors">{cat}</Link>
                     ))}
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <Search className="h-4 w-4 text-slate-500" />
                  <LayoutGrid className="h-4 w-4 text-slate-500" />
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Main Feature: 8 Columns */}
              <div className="lg:col-span-8 group">
                <Link href={`/blog/post/${mainFeature.slug}`} className="relative block h-[500px] md:h-[650px] overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
                  <Image
                    src={
  mainFeature.coverImage?.asset?.url
    ? mainFeature.coverImage.asset.url
    : "/placeholder.jpg"
}
                    alt={mainFeature.title}
                    fill
                    className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-8 md:p-16">
                    <span className="bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm mb-6 inline-block">
                      Primary Analysis
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-6 group-hover:text-indigo-400 transition-colors">
                      {mainFeature.title}
                    </h1>
                    <p className="max-w-xl text-slate-400 text-lg font-medium line-clamp-2">{mainFeature.description}</p>
                  </div>
                </Link>
              </div>

              {/* Side Stack: 4 Columns */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {sideFeatures.map((post: any) => (
                  <Link key={post.slug} href={`/blog/post/${post.slug}`} className="flex-1 bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:bg-white/10 transition-all group flex flex-col justify-between">
                    <div>
                      <span className="text-indigo-500 text-[9px] font-black uppercase tracking-widest mb-4 block">{post.category}</span>
                      <h3 className="text-xl font-bold leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(post.publishedAt).toLocaleDateString()}</span>
                       <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                          <ArrowUpRight className="h-4 w-4" />
                       </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. THE "STRATEGY VAULT" (Horizontal Scroll/List) --- */}
        <section className="bg-white text-black py-24 rounded-t-[4rem]">
          <div className="max-w-[1500px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
               <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-indigo-600 fill-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Vault</span>
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">Latest <span className="text-indigo-600">Signals.</span></h2>
               </div>
               <p className="max-w-xs text-sm font-medium text-slate-500 leading-relaxed">
                 Exclusive intelligence on market shifts, technical debt, and capital growth strategies.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {theFeed.map((post: any) => (
                 <Link key={post.slug} href={`/blog/post/${post.slug}`} className="group">
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-8 bg-slate-100">
                       <Image src={
  post.coverImage?.asset?.url
    ? post.coverImage.asset.url
    : "/placeholder.jpg"
} fill alt="" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                         {post.category}
                       </div>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 mb-6">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-black transition-colors">
                       <span>Read Report</span>
                       <div className="h-px flex-1 bg-slate-100" />
                       <Plus className="h-4 w-4" />
                    </div>
                 </Link>
               ))}
            </div>
          </div>
        </section>

        {/* --- 3. METRIC BAR (Social Proof/Stats) --- */}
        <section className="bg-white pb-20">
          <div className="max-w-[1500px] mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-20 border-y border-slate-100">
               {[
                 { label: "Active Signals", val: "2.4k", icon: Activity },
                 { label: "Verified Data", val: "99.9%", icon: Shield },
                 { label: "Growth Alpha", val: "+42%", icon: Zap },
                 { label: "Global Nodes", val: "18", icon: Globe },
               ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-center text-center">
                    <stat.icon className="h-6 w-6 text-indigo-600 mb-4" />
                    <span className="text-4xl font-black tracking-tighter mb-1">{stat.val}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

// Re-using Globe icon logic for the stat bar
function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  )
}
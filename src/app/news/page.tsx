import { client } from "@/lib/sanity/client";
import { startupNewsQuery } from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/getImageUrl";
import Link from "next/link";
import Image from "next/image";

export default async function NewsPage() {
  const news = await client.fetch(startupNewsQuery);
  const featured = news[0];
  const list = news.slice(1);

  return (
    <main className="bg-[#FAFAFA] min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 mb-16">
          News<span className="text-indigo-600">.</span>
        </h1>

        {/* FEATURED CARD */}
        {featured && (
          <Link
            href={`/news/${featured.slug}`}
            className="group relative block mb-20 overflow-hidden rounded-[3rem] bg-slate-900 min-h-[500px]"
          >
            <div className="absolute inset-0 opacity-60 group-hover:scale-105 transition-transform duration-1000">
              {featured.coverImage && (
                <Image
                  src={getImageUrl(featured.coverImage, 1600, 900)!}
                  fill
                  alt=""
                  className="object-cover"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-3xl">
              <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm mb-6 inline-block">
                Latest Analysis
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                {featured.title}
              </h2>
              {/* This is now a clean string thanks to pt::text() */}
              <p className="text-slate-300 text-lg line-clamp-2 font-medium">
                {featured.summary}
              </p>
            </div>
          </Link>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((n: any) => (
            <Link
              href={`/news/${n.slug}`}
              key={n.slug}
              className="group bg-white rounded-[2.5rem] border border-slate-100 p-4 hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6">
                {n.coverImage && (
                  <Image
                    src={getImageUrl(n.coverImage, 600, 450)!}
                    fill
                    alt=""
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
              </div>
              <div className="px-4 pb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 block">
                  {n.category || "Startup"}
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                  {n.title}
                </h3>
                {/* Clean string for card description */}
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                  {n.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

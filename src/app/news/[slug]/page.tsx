import { client } from "@/lib/sanity/client";
import { singleStartupNewsQuery } from "@/lib/sanity/queries";
import { getImageUrl } from "@/lib/sanity/getImageUrl";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Minus } from "lucide-react";

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await client.fetch(singleStartupNewsQuery, { slug });

  if (!news) notFound();
  const heroImageUrl = news.coverImage
    ? getImageUrl(news.coverImage, 1800, 1000)
    : null;

  return (
    <main className="bg-white min-h-screen pb-32">
      {/* 1. DISCRETE NAV */}
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center">
        <Link
          href="/news"
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          Back to Intel
        </Link>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          Startup Signals / 2026
        </div>
      </nav>

      {/* 2. THE HERO SECTION */}
      <header className="max-w-5xl mx-auto px-8 mb-20">
        <div className="flex items-center gap-2 mb-8 text-indigo-600">
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">
            {news.category || "Report"}
          </span>
        </div>

        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-black leading-[1.05] mb-12">
          {news.title}
        </h1>

        <div className="flex items-center gap-6 text-slate-400">
          <div className="text-[11px] font-bold uppercase tracking-widest text-black">
            {news.authorName || "Editorial"}
          </div>
          <Minus className="h-4 w-4 text-slate-200" />
          <div className="text-[11px] font-bold uppercase tracking-widest">
            {new Date(news.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </header>

      {/* 3. WIDE IMAGE */}
      <div className="max-w-[1400px] mx-auto px-8 mb-24">
        <div className="relative aspect-[21/9] bg-slate-100 overflow-hidden rounded-sm">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              fill
              alt=""
              className="object-cover"
              priority
            />
          )}
        </div>
      </div>

      {/* 4. THE READING EXPERIENCE */}
      <div className="max-w-5xl mx-auto px-8">
        {/* THE SUMMARY (The Lead) */}
        <section className="mb-20">
          <div className="prose prose-2xl prose-slate !max-w-none">
            <div className="font-sans  text-slate-800 leading-relaxed border-b border-slate-100 pb-16">
              <PortableText value={news.summary || []} />
            </div>
          </div>
        </section>

        {/* THE BODY */}
        <article>
          <div
            className="prose prose-lg md:prose-xl prose-slate !max-w-none 
            font-serif 
            prose-p:text-slate-700 prose-p:leading-[1.9] prose-p:mb-10
            prose-h2:font-sans prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-20 prose-h2:mb-10 prose-h2:text-black
            prose-strong:text-black prose-strong:font-bold
            prose-blockquote:border-l-0 prose-blockquote:pl-0 prose-blockquote:text-3xl prose-blockquote:text-indigo-600 prose-blockquote:font-bold prose-blockquote:tracking-tighter prose-blockquote:not-italic"
          >
            <PortableText
              value={news.content || []}
              components={{
                types: {
                  image: ({ value }) => (
                    <figure className="my-20 -mx-4 md:-mx-32 text-center">
                      <Image
                        src={getImageUrl(value, 1600, 900)!}
                        alt=""
                        width={1600}
                        height={900}
                        className="w-full bg-slate-50 shadow-2xl"
                      />
                      {value.caption && (
                        <figcaption className="mt-6 text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.3em]">
                          {value.caption}
                        </figcaption>
                      )}
                    </figure>
                  ),
                },
              }}
            />
          </div>
        </article>

        {/* 5. MINIMAL FOOTER */}
        <footer className="mt-40 pt-20 border-t border-slate-100 flex justify-between items-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            End of Brief
          </div>
          <Link
            href="/news"
            className="text-[10px] font-black uppercase tracking-[0.3em] text-black hover:text-indigo-600 transition-colors underline underline-offset-8"
          >
            Next Story
          </Link>
        </footer>
      </div>
    </main>
  );
}

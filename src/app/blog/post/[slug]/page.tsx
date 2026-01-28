export const dynamic = "force-dynamic";


import MainLayout from "@/components/layout/MainLayout";
import { getSanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { postBySlugQuery } from "@/lib/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import {
  ArrowLeft,
  Megaphone,
  ExternalLink,
  Clock,
  Share2,
  TrendingUp,
} from "lucide-react";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getSanityClient();
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) notFound();

const imageBuilder = urlFor(post.coverImage);
const imageUrl = imageBuilder ? imageBuilder.url() : null;

  return (
    <MainLayout>
      <main className="bg-[#f9fafb] min-h-screen pb-20 font-sans">
        {/* --- 1. HERO IMAGE --- */}
        <section className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden bg-slate-900">
          {imageUrl && (
            <Image
              src={imageUrl}
              fill
              alt={post.title}
              className="object-cover opacity-60"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="absolute top-10 left-10">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/80 hover:text-white transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Archive
            </Link>
          </div>
        </section>

        {/* --- 2. TITLE CARD --- */}
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="relative -mt-32 md:-mt-48 z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-md mb-6">
                  {post.category || "Intel"}
                </span>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] text-slate-900 mb-8">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-black text-slate-900">
                      {post.authorName || "Editorial"}
                    </p>
                  </div>

                  <div className="h-1 w-1 rounded-full bg-slate-200" />

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock className="h-4 w-4" /> 8 Min Read
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="hidden lg:block lg:col-span-4 pb-10">
                <div className="flex gap-4">
                  <button className="flex-1 bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                    <Share2 className="h-4 w-4" /> Share Signal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. CONTENT --- */}
        <section className="max-w-[1400px] mx-auto px-6 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="hidden lg:block lg:col-span-2 sticky top-28 h-fit">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                Summary
              </h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed italic border-l-2 border-indigo-500 pl-4">
                {post.description}
              </p>
            </aside>

            <article className="col-span-12 lg:col-span-7 prose prose-lg md:prose-xl prose-slate max-w-none">
              <PortableText value={post.body} />
            </article>

            <aside className="col-span-12 lg:col-span-3 space-y-8 sticky top-28 h-fit">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
                <Megaphone className="h-8 w-8 text-indigo-500 mb-6" />
                <h4 className="text-xl font-black mb-2 tracking-tight uppercase">
                  Partner With Us
                </h4>
                <p className="text-slate-400 text-[11px] mb-8">
                  Reach our high-growth audience of founders and builders.
                </p>
                <Link
                  href="/advertise"
                  className="flex items-center justify-center w-full py-4 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                  Get Media Kit <ExternalLink className="ml-2 h-3 w-3" />
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" /> Hot Topics
                </h4>
                {[1, 2, 3].map((i) => (
                  <h5
                    key={i}
                    className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    The future of capital allocation in 2026.
                  </h5>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}

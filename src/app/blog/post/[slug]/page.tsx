export const dynamic = "force-dynamic";

import { getImageUrl } from "@/lib/sanity/getImageUrl";
// import MainLayout from "@/components/layout/MainLayout";
import { getSanityClient } from "@/lib/sanity/client";
import { postBySlugQuery } from "@/lib/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Clock,
  Share2,
  Megaphone,
  ExternalLink,
  TrendingUp,
} from "lucide-react";

// ==================== METADATA ====================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const client = getSanityClient();
  let post;
  try {
    post = await client.fetch(postBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    return { title: "Error", description: "Failed to fetch post" };
  }

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
    };
  }

  const title = post.seoTitle || post.title || "Startup Signals";
  const description = post.seoDescription || post.description || "";
  let ogImageUrl: string = "/placeholder.png";

  try {
    if (post.coverImage) {
      ogImageUrl =
        getImageUrl(post.coverImage, 1200, 630) ?? "/placeholder.png";
    }
  } catch (error) {
    console.error("Metadata image error", error);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

// ==================== POST PAGE ====================
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const client = getSanityClient();
  let post;
  try {
    post = await client.fetch(postBySlugQuery, { slug: resolvedParams.slug });
  } catch (error) {
    console.error("Error fetching post:", error);
  }

  if (!post) {
    notFound();
  }

  const heroImageUrl = post.coverImage
    ? getImageUrl(post.coverImage, 1600, 900)
    : "/placeholder.png";

  return (
    // Added overflow-x-hidden to prevent horizontal scrolling
    <main className="bg-[#f9fafb] min-h-screen pb-20 font-sans overflow-x-hidden">
      {/* HERO */}
      <section className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden bg-slate-900">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            fill
            alt={post.title || "Post image"}
            className="object-cover opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute top-10 left-6 md:left-10">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/80 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Archive
          </Link>
        </div>
      </section>

      {/* TITLE CARD */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="relative -mt-32 md:-mt-48 z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Added responsive padding and word-break to title */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-md mb-6">
                {typeof post.category === "string"
                  ? post.category
                  : post.category?.title || "Intel"}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] text-slate-900 mb-8 break-words">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-8 border-t border-slate-50">
                <p className="text-sm font-black text-slate-900">
                  {typeof post.authorName === "string"
                    ? post.authorName
                    : post.authorName?.name || "Editorial"}
                </p>
                <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-200" />
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock className="h-4 w-4" /> 8 Min Read
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-4 pb-10">
              <button className="w-full bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50">
                <Share2 className="h-4 w-4" /> Share Signal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="hidden lg:block lg:col-span-2 sticky top-28">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
              Summary
            </h4>
            <p className="text-xs font-medium text-slate-500 italic border-l-2 border-indigo-500 pl-4">
              {post.description || "No summary available."}
            </p>
          </aside>

          {/* Added break-words and overflow-hidden to handle long text/images in PortableText */}
          <article className="col-span-12 lg:col-span-7 prose prose-slate prose-lg md:prose-xl max-w-none break-words overflow-hidden">
            <PortableText value={post.body ?? []} />
          </article>

          <aside className="col-span-12 lg:col-span-3 space-y-8 lg:sticky lg:top-28">
            <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl">
              <Megaphone className="h-8 w-8 text-indigo-500 mb-6" />
              <h4 className="text-xl font-black uppercase mb-2">
                Partner With Us
              </h4>
              <p className="text-slate-400 text-[11px] mb-8">
                Reach our high-growth audience of founders and builders.
              </p>
              <Link
                href="/advertise"
                className="flex items-center justify-center w-full py-4 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Get Media Kit <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" /> Hot Topics
              </h4>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

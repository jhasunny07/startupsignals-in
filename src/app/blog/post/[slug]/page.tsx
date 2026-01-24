// src/app/blog/post/[slug]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;


import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { client } from "../../../../../sanity/lib/client";
import { urlFor } from "../../../../../sanity/lib/image";
import { postBySlugQuery } from "../../../../../sanity/lib/queries";

interface Props {
  params: { slug: string };
}

interface Post {
  title: string;
  slug: string;
  date?: string;
  description?: string;
  category?: string;
  author?: string;
  coverImage?: any;
  body?: any[];
  _updatedAt?: string;
}

/* -----------------------------------------
   DATA FETCH
------------------------------------------ */
async function getPost(slug: string): Promise<Post | null> {
  if (!slug) return null;
  try {
    const post = await client.fetch(postBySlugQuery, { slug });
    return post ?? null;
  } catch (err) {
    console.error("[Sanity Error]", err);
    return null;
  }
}

/* -----------------------------------------
   SEO METADATA
------------------------------------------ */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  let ogImage: string | undefined;

  if (post.coverImage) {
    const builder = urlFor(post.coverImage);
    ogImage = builder ? builder.url() : undefined;
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: ogImage ? [ogImage] : undefined,
      type: "article",
      publishedTime: post.date,
    },
  };
}

/* -----------------------------------------
   PAGE
------------------------------------------ */
export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <MainLayout>
        <div className="py-32 text-center">
          <h1 className="text-4xl font-bold">Post not found</h1>
          <Link href="/blog" className="mt-6 inline-block text-indigo-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </MainLayout>
    );
  }

  // ✅ SAFE IMAGE HANDLING (NO TS ERROR)
  let imageUrl = "/images/default-post-cover.jpg";

  if (post.coverImage) {
    const builder = urlFor(post.coverImage);
    if (builder?.url()) {
      imageUrl = `${builder.url()}?v=${post._updatedAt ?? ""}`;
    }
  }

  return (
    <MainLayout>
      <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="relative mb-12 h-96 overflow-hidden rounded-2xl shadow-xl">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <header className="mb-12 text-center">
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
            {post.category ?? "General"}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight">
            {post.title}
          </h1>

          <div className="mt-4 flex justify-center gap-4 text-gray-600">
            {post.date && (
              <time>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {post.author && <span>• By {post.author}</span>}
          </div>
        </header>

        {/* SIMPLE BODY RENDER (SAFE) */}
        <div className="prose prose-lg mx-auto">
          {post.body?.map((block: any, i: number) =>
            block?.children?.map((c: any, j: number) => (
              <p key={`${i}-${j}`}>{c.text}</p>
            ))
          )}
        </div>

        <footer className="mt-16 border-t pt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-gray-100 px-8 py-4 text-lg hover:bg-gray-200 transition"
          >
            ← Back to Blog
          </Link>
        </footer>
      </article>
    </MainLayout>
  );
}

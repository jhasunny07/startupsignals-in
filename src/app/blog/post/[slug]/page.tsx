
export const dynamic = "force-dynamic";
export const revalidate = 0;



// src/app/blog/post/[slug]/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { postBySlugQuery } from "@/lib/sanity/queries";
import Image from "next/image";
import Link from "next/link";





interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category?: string;
  author?: string;
  coverImage?: any;
  body?: any[];
}

interface Props {
  params: { slug: string };
}

// Fetch single post
async function getPost(slug: string): Promise<Post | null> {
  if (!slug) return null;
  try {
    const post = await client.fetch(postBySlugQuery, { slug });
    return post ?? null;
  } catch (err) {
    console.error("[Sanity Fetch Error]", err);
    return null;
  }
}

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

  const imageUrl = post.coverImage ? urlFor(post.coverImage)?.url() : "/images/default-post-cover.jpg";

  return (
    <MainLayout>
      <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="relative mb-12 h-96 overflow-hidden rounded-2xl shadow-2xl">
          <Image src={imageUrl ?? "/images/default-post-cover.jpg"} alt={post.title} fill className="object-cover" priority />
        </div>

        <header className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-indigo-100 px-5 py-2 text-sm font-medium text-indigo-700">
            {post.category ?? "Uncategorized"}
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{post.title}</h1>
          <div className="flex items-center justify-center gap-6 text-gray-600">
            <time dateTime={post.date}>
              {post.date ? new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Unknown date"}
            </time>
            {post.author && <>
              <span>•</span>
              <span>By {post.author}</span>
            </>}
          </div>
        </header>

        <div
          className="prose prose-lg prose-indigo mx-auto max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:underline"
          dangerouslySetInnerHTML={{
            __html: post.body?.map(block => block?.children?.map((c: any) => c.text).join(" ")).join("\n") ?? ""
          }}
        />

        <footer className="mt-16 border-t pt-10 text-center">
          <Link href="/blog" className="inline-flex items-center rounded-full bg-gray-100 px-8 py-4 text-lg font-medium text-gray-700 hover:bg-gray-200 transition">
            ← Back to All Posts
          </Link>
        </footer>
      </article>
    </MainLayout>
  );
}

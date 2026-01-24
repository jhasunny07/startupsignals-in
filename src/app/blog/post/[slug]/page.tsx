// src/app/blog/post/[slug]/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
import { client } from "../../../../../sanity/lib/client";
import { urlFor } from "../../../../../sanity/lib/image";
import { postBySlugQuery } from "../../../../../sanity/lib/queries";

interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
  author: string;
  coverImage?: any;
  body?: any[];
}

interface Props {
  params: { slug: string };
}

// Fetch single post from Sanity
async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await client.fetch(postBySlugQuery, { slug });
    return post || null;
  } catch (error) {
    console.error("[Sanity Fetch Error]", error);
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
        </div>
      </MainLayout>
    );
  }

  const imageUrl = post.coverImage ? urlFor(post.coverImage)?.url() : "/images/default-post-cover.jpg";

  return (
    <MainLayout>
      <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {/* Cover Image */}
        <div className="relative mb-12 h-96 overflow-hidden rounded-2xl shadow-2xl">
          <Image src={imageUrl} alt={post.title} fill className="object-cover" />
        </div>

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-indigo-100 px-5 py-2 text-sm font-medium text-indigo-700">
            {post.category}
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-600">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
        </header>

        {/* Body */}
        <div className="prose prose-lg prose-indigo mx-auto max-w-none">
          {post.body?.map((block, i) => {
            // Render basic block content
            if (block._type === "block") {
              return <p key={i}>{block.children.map((child: any) => child.text).join("")}</p>;
            }
            if (block._type === "image") {
              return (
                <div key={i} className="my-8 relative h-96">
                  <Image src={urlFor(block).url()!} alt={post.title} fill className="object-cover rounded-xl" />
                </div>
              );
            }
            if (block._type === "code") {
              return (
                <pre key={i} className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{block.code}</code>
                </pre>
              );
            }
            if (block._type === "embed") {
              return (
                <div key={i} className="my-8">
                  <iframe
                    width="100%"
                    height="400"
                    src={block.url}
                    title="Embedded content"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </article>
    </MainLayout>
  );
}

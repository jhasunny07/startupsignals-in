export const dynamic = "force-dynamic";
export const revalidate = 0;

// src/app/blog/post/[slug]/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import { getSanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { postBySlugQuery } from "@/lib/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

// Safe image helper (same as category page)
function getCoverImageUrl(coverImage: any, width = 1920, height = 1080): string {
  if (!coverImage) return "/images/default-post-cover.jpg";
  const builder = urlFor(coverImage);
  if (!builder) return "/images/default-post-cover.jpg";
  return builder.width(width).height(height).url() ?? "/images/default-post-cover.jpg";
}

interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category?: string;
  author?: string;
  coverImage?: any;
  body?: any[]; // Portable Text blocks
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Post | null> {
  if (!slug) return null;
  try {
    const client = getSanityClient();
    const post = await client.fetch(postBySlugQuery, { slug });
    return post ?? null;
  } catch (err) {
    console.error("[Sanity Fetch Error]", err);
    return null;
  }
}

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = getCoverImageUrl(post.coverImage, 1920, 1080);

  const category = post.category ?? "Uncategorized";
  const author = post.author ?? "Anonymous";
  const date = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <MainLayout>
      <main className="bg-white min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover brightness-[0.85]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-5xl px-6 pb-16 lg:px-8">
              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-block rounded-full bg-indigo-600/90 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-md">
                  {category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-xl md:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              {/* Byline */}
              <div className="mt-8 flex items-center gap-6 text-lg text-gray-200">
                <div>
                  <p className="font-medium">{author}</p>
                  <time dateTime={post.date} className="text-gray-300">
                    {date}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
          {/* Lead */}
          {post.description && (
            <p className="mb-12 text-xl font-medium leading-relaxed text-gray-700 lg:text-2xl">
              {post.description}
            </p>
          )}

          {/* Rich body content with proper formatting */}
          <div
            className="prose prose-lg prose-indigo mx-auto max-w-none lg:prose-xl 
                     prose-headings:font-bold prose-headings:tracking-tight 
                     prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline 
                     prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 
                     prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
                     prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                     prose-p:mb-6 prose-ul:mb-6 prose-ol:mb-6"
          >
            <PortableText
              value={post.body}
              components={{
                marks: {
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  link: ({ value, children }) => {
                    const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
                    return (
                      <a
                        href={value?.href}
                        target={target}
                        rel={target === "_blank" ? "noopener noreferrer" : undefined}
                        className="text-indigo-600 hover:underline"
                      >
                        {children}
                      </a>
                    );
                  },
                },
                block: {
                  h3: ({ children }) => <h3 className="text-2xl font-bold mt-10 mb-6">{children}</h3>,
                  // You can add more custom blocks here if needed (h1, h2, blockquote, etc.)
                },
              }}
            />
          </div>

          {/* Back link */}
          <div className="mt-20 border-t pt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 rounded-full bg-gray-100 px-8 py-4 text-lg font-medium text-gray-700 transition hover:bg-gray-200"
            >
              ← Back to All Posts
            </Link>
          </div>
        </article>
      </main>
    </MainLayout>
  );
}
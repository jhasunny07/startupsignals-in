import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { client } from "../../../../../sanity/lib/client";
import { urlFor } from "../../../../../sanity/lib/image";
import { postBySlugQuery } from "../../../../../sanity/lib/queries";


interface PostPageProps {
  params: { slug: string };
}

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

// Generate metadata for SEO
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const slug = params.slug;
  const post: Post | null = await client.fetch(postBySlugQuery, { slug });
  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.coverImage ? [urlFor(post.coverImage)?.url()] : [],
      type: "article",
      publishedTime: post.date,
    },
  };
}

// Fetch single post safely
async function getPost(slug: string): Promise<Post | null> {
  if (!slug) return null;
  try {
    const post = await client.fetch(postBySlugQuery, { slug });
    return post ?? null;
  } catch (error) {
    console.error("[Sanity Fetch Error]", error);
    return null;
  }
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const allPosts: { slug: { current: string } }[] = await client.fetch(`*[_type=="post"]{ "slug": slug.current }`);
  return allPosts.map((p) => ({ slug: p.slug }));
}

// Post Page Component
export default async function PostPage({ params }: PostPageProps) {
  const slug = params.slug;
  const post = await getPost(slug);

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
  const capitalizedCategory = post.category
    ? post.category.charAt(0).toUpperCase() + post.category.slice(1)
    : "Uncategorized";

  return (
    <MainLayout>
      <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {/* Cover Image */}
        <div className="relative mb-12 h-96 overflow-hidden rounded-2xl shadow-2xl">
          <Image src={imageUrl!} alt={post.title} fill className="object-cover" priority />
        </div>

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-indigo-100 px-5 py-2 text-sm font-medium text-indigo-700">
            {capitalizedCategory}
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{post.title}</h1>
          <div className="flex items-center justify-center gap-6 text-gray-600">
            <time dateTime={post.date}>
              {post.date
                ? new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown date"}
            </time>
            <span>•</span>
            <span>By {post.author ?? "Anonymous"}</span>
          </div>
        </header>

        {/* Body */}
        <div
          className="prose prose-lg prose-indigo mx-auto max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.body ? post.body.map((b) => b?.children?.map((c: any) => c.text).join("")).join("\n") : "" }}
        />

        {/* Footer */}
        <footer className="mt-16 border-t pt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-gray-100 px-8 py-4 text-lg font-medium text-gray-700 hover:bg-gray-200 transition"
          >
            ← Back to All Posts
          </Link>
        </footer>
      </article>
    </MainLayout>
  );
}

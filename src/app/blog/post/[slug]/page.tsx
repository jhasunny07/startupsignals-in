// src/app/blog/[slug]/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

interface PostProps {
  params: Promise<{ slug: string }>;   // ← Add Promise here
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const resolvedParams = await params; 
    const { slug } = resolvedParams;
 const post = await getPostBySlug(slug);


  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
      publishedTime: post.date,
    },
  };
}

async function getPostBySlug(slug: string) {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  // ← Add these debug lines
  console.log("=== SINGLE POST DEBUG ===");
  console.log("Requested slug:", slug);
  console.log("Expected file path:", fullPath);
  console.log("File exists?", fs.existsSync(fullPath));
  if (fs.existsSync(postsDirectory)) {
    console.log("All files in posts dir:", fs.readdirSync(postsDirectory));
  } else {
    console.log("Posts directory does NOT exist!");
  }

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  // Rough reading time estimate (avg 200-250 words/min)
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 225);

  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description,
    category: data.category,
    author: data.author,
    coverImage: data.coverImage || "/images/default-post-cover.jpg",
    contentHtml,
    readingTime,
  };
}

async function getAllSlugs() {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ""));
}

// For static generation (better perf/SEO)
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: PostProps) {
  const resolvedParams = await params;                // ← Await here
  const { slug } = resolvedParams;

  const post = await getPostBySlug(slug);

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

  return (
    <MainLayout>
      <article className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative mb-12 h-96 overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

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
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{post.readingTime} min read</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg prose-indigo mx-auto max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-6 prose-code:bg-gray-100 prose-code:p-1 prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Footer / Back */}
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
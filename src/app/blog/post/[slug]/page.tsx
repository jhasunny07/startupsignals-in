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
  params: { slug: string };
}

// Generate metadata
export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
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

// Read post content from Markdown
async function getPostBySlug(slug: string) {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const contentHtml = (await remark().use(html).process(content)).toString();
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

// Generate all slugs for static rendering
async function getAllSlugs() {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  const files = fs.existsSync(postsDirectory) ? fs.readdirSync(postsDirectory) : [];
  return files.map((file) => file.replace(/\.md$/, ""));
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Post page component
export default async function PostPage({ params }: PostProps) {
  const post = await getPostBySlug(params.slug);
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
        <div className="relative mb-12 h-96 overflow-hidden rounded-2xl shadow-2xl">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>

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
            <span>{post.readingTime} min read</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
        </header>

        <div
          className="prose prose-lg prose-indigo mx-auto max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
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

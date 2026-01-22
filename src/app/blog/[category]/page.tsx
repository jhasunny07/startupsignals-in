// src/app/blog/[category]/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

interface CategoryProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { category } = resolvedParams;

  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${capitalized} | Startup Blog`,
    description: `Latest insights, lessons, and strategies in ${capitalized.toLowerCase()} for founders and builders.`,
    openGraph: {
      title: `${capitalized} Insights`,
      description: `Explore articles on ${capitalized.toLowerCase()} in startups and growth.`,
    },
  };
}

async function getPostsByCategory(category: string) {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      if (data.category?.toLowerCase() === category.toLowerCase()) {
        return {
          slug,
          title: data.title,
          date: data.date,
          description: data.description,
          category: data.category,
          coverImage: data.coverImage || "/images/default-post-cover.jpg",
        };
      }
      return null;
    })
    .filter(Boolean);

  return posts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function getAllCategories() {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  const fileNames = fs.readdirSync(postsDirectory);
  const categories = new Set<string>();

  fileNames.forEach((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    if (data.category) {
      categories.add(data.category.toLowerCase());
    }
  });

  return Array.from(categories);
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ category: cat }));
}

export default async function CategoryPage({ params }: CategoryProps) {
  const resolvedParams = await params;
  const { category } = resolvedParams;

  const posts = await getPostsByCategory(category);

  if (posts.length === 0) {
    return (
      <MainLayout>
        <div className="py-32 text-center">
          <h1 className="text-4xl font-bold">No posts in "{category}" yet</h1>
          <Link href="/blog" className="mt-6 inline-block text-indigo-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </MainLayout>
    );
  }

  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* SEO Landing Page Header */}
        <header className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">
            {capitalized} Insights
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 leading-relaxed">
            Practical advice, real-world lessons, and strategies for founders navigating the world of {category.toLowerCase()}. 
            From early-stage challenges to scaling tactics — dive into stories that help you build better and faster.
          </p>
        </header>

        {/* Posts Grid (reuse similar style from /blog) */}
       <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
  {posts.map((post: any) => (
    <article key={post.slug} className="group">
      <Link href={`/blog/post/${post.slug}`}>   {/* ← FIXED HERE */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all duration-300">
          <div className="relative h-64">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="p-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {post.title}
            </h2>
            <p className="mb-6 text-lg text-gray-600 line-clamp-3">{post.description}</p>
            <time className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </div>
        </div>
      </Link>
    </article>
  ))}
</div>

        {/* Internal Linking / CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-indigo-600 px-10 py-5 text-lg font-semibold text-white hover:bg-indigo-700 transition"
          >
            Explore All Topics →
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
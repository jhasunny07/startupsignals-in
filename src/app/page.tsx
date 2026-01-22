// src/app/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Post {
  slug: string;
  title: string;
  description: string;
  category: string;
  coverImage?: string;
  date: string;
}

async function getLatestPosts(limit = 3): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      description: data.description,
      category: data.category,
      coverImage: data.coverImage || "/images/default-post-cover.jpg",
      date: data.date,
    };
  });

  // Sort by date descending & take latest
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export default async function Home() {
  const latestPosts = await getLatestPosts(3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-24 sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(99,102,241,0.25)_1px,_transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Insights for <span className="text-indigo-600">Founders</span> & Builders
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-700 leading-relaxed">
            Honest stories, hard lessons, and tactical advice on startups, funding, product, and growth in 2026.
          </p>
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full bg-indigo-600 px-10 py-5 text-lg font-semibold text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition transform hover:scale-105"
            >
              Explore the Latest →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Insights – Dynamic Latest Posts */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-12 text-center">
            Featured Insights
          </h2>

          {latestPosts.length === 0 ? (
            <p className="text-center text-gray-600 text-xl">
              No posts yet — check back soon!
            </p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <div
                  key={post.slug}
                  className="group overflow-hidden rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={post.coverImage ?? "/images/default-post-cover.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-3 inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700">
                      {post.category}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {post.description}
                    </p>
                    <Link
                      href={`/blog/post/${post.slug}`}
                      className="mt-4 inline-block text-indigo-600 font-medium hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
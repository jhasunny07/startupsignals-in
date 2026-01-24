import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { client } from "../../../../sanity/lib/client";
import { postsByCategoryQuery } from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";

interface CategoryPageProps {
  params: { category: string };
}

export const revalidate = 10; // ISR

async function getPostsByCategory(categorySlug: string) {
  try {
    const posts = await client.fetch(postsByCategoryQuery, { categorySlug });
    return posts ?? [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const allPosts = await client.fetch(`*[_type=="post"]{ "categorySlug": category->slug.current }`);
  const categories = Array.from(new Set(allPosts.map((p: any) => p.categorySlug).filter(Boolean)));
  return categories.map((cat) => ({ category: cat }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category;
  const posts = await getPostsByCategory(category);

  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

  if (!posts || posts.length === 0) {
    return (
      <MainLayout>
        <div className="py-32 text-center">
          <h1 className="text-4xl font-bold">No posts in "{capitalized}" yet</h1>
          <Link href="/blog" className="mt-6 inline-block text-indigo-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">{capitalized} Insights</h1>
        </header>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => {
            const imageUrl = post.coverImage
              ? urlFor(post.coverImage)?.url() + `?v=${new Date(post._updatedAt).getTime()}`
              : "/images/default-post-cover.jpg";

            return (
              <article key={post.slug} className="group">
                <Link href={`/blog/post/${post.slug}`}>
                  <div className="overflow-hidden rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-8">
                      <div className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
                        {post.category}
                      </div>
                      <h2 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-indigo-600">
                        {post.title}
                      </h2>
                      <p className="mb-6 text-lg text-gray-600 line-clamp-3">{post.description}</p>
                      <time className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

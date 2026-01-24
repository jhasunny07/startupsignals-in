// src/app/blog/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { client } from "../../sanity/lib/client";
import { allPostsQuery } from "../../sanity/lib/queries";
import { urlFor } from "../../sanity/lib/image";

export const dynamic = "force-dynamic"; // ensures server fetch every request

interface Post {
  title: string;
  slug: string;
  date: string;
  description: string;
  category?: string;
  coverImage?: any;
}

export default async function BlogPage() {
  // fetch posts at request time
  const posts: Post[] = await client.fetch(allPostsQuery) || [];

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12">All Posts</h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts yet.</p>
        ) : (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const imageUrl = post.coverImage
                ? urlFor(post.coverImage)?.url()
                : "/images/default-post-cover.jpg";

              return (
                <Link key={post.slug} href={`/blog/post/${post.slug}`}>
                  <div className="overflow-hidden rounded-2xl border bg-white shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64">
                      <Image
                        src={imageUrl ?? "/images/default-post-cover.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold">{post.title}</h2>
                      <p className="text-gray-600 line-clamp-3">{post.description}</p>
                      <div className="text-sm text-gray-500 mt-2">
                        {post.category ?? "Uncategorized"} •{" "}
                        {post.date
                          ? new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Unknown date"}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

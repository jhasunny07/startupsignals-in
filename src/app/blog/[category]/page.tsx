export const dynamic = "force-dynamic";
export const revalidate = 0;

import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { client } from "../../../../sanity/lib/client";
import { postsByCategoryQuery } from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const posts = await client.fetch(postsByCategoryQuery, {
    categorySlug: params.category,
  });

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">
          {params.category}
        </h1>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => {
            const imageUrl = post.coverImage
              ? `${urlFor(post.coverImage).url()}?v=${post._updatedAt}`
              : "/images/default-post-cover.jpg";

            return (
              <Link key={post.slug} href={`/blog/post/${post.slug}`}>
                <div className="border rounded-xl overflow-hidden">
                  <div className="relative h-56">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold">{post.title}</h2>
                    <p className="text-gray-600">{post.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}

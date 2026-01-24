export const dynamic = "force-dynamic";
export const revalidate = 0;

import MainLayout from "@/components/layout/MainLayout";
import Image from "next/image";
import Link from "next/link";
import { client } from "../../../../../sanity/lib/client";
import { postBySlugQuery } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await client.fetch(postBySlugQuery, { slug: params.slug });

  if (!post) {
    return (
      <MainLayout>
        <div className="py-32 text-center">
          <h1 className="text-4xl font-bold">Post not found</h1>
        </div>
      </MainLayout>
    );
  }

  const imageUrl = post.coverImage
    ? `${urlFor(post.coverImage).url()}?v=${post._updatedAt}`
    : "/images/default-post-cover.jpg";

  return (
    <MainLayout>
      <article className="mx-auto max-w-4xl px-6 py-16">
        <div className="relative h-96 mb-10">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            unoptimized
            className="object-cover rounded-xl"
          />
        </div>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 mb-10">{post.description}</p>

        <div className="prose max-w-none">
          {post.body?.map((b: any, i: number) => (
            <p key={i}>{b.children?.map((c: any) => c.text).join("")}</p>
          ))}
        </div>

        <Link href="/blog" className="block mt-10 text-indigo-600">
          ← Back to blog
        </Link>
      </article>
    </MainLayout>
  );
}

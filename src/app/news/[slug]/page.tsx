import { client } from "@/lib/sanity/client";
import { singleStartupNewsQuery } from "@/lib/sanity/queries";

export default async function NewsDetail({ params }: any) {
  const news = await client.fetch(singleStartupNewsQuery, {
    slug: params.slug,
  });

  return (
    <article>
      <h1>{news.title}</h1>
      <p>{news.summary}</p>
    </article>
  );
}

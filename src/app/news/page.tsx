import { client } from "@/lib/sanity/client";
import { startupNewsQuery } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await client.fetch(startupNewsQuery);

  return (
    <main>
      <h1>Startup News</h1>

      {news.map((n: any) => (
        <article key={n.slug.current}>
          <h2>{n.title}</h2>
          <p>{n.summary}</p>
        </article>
      ))}
    </main>
  );
}

// \src\app\shark-tank-india\page.tsx
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { sharkTankSeasonsQuery } from "@/lib/sanity/queries";

export default async function SharkTankHome() {
  const seasons = await client.fetch(sharkTankSeasonsQuery);

  if (!seasons || seasons.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center font-serif text-gray-400">
        Initializing Database...
      </div>
    );
  }

  const latestSeason = seasons.sort(
    (a: any, b: any) => b.seasonNumber - a.seasonNumber,
  )[0];

  redirect(`/shark-tank-india/${latestSeason.slug}`);
}

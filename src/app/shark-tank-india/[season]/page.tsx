// src\app\shark-tank-india\[season]\page.tsx
import { redirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { sharkTankSeasonStartupsQuery } from "@/lib/sanity/queries";

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  const startups = await client.fetch(sharkTankSeasonStartupsQuery, {
    seasonSlug: season,
  });

  if (!startups || startups.length === 0) {
    return (
      <div className="p-20 text-center font-medium text-slate-400">
        Data for this season is being synthesized.
      </div>
    );
  }

  // Redirect to the first startup of that season automatically
  redirect(`/shark-tank-india/${season}/${startups[0].slug}`);
}

// src/app/shark-tank-india/layout.tsx
import { client } from "@/lib/sanity/client";
import { sharkTankSeasonsQuery } from "@/lib/sanity/queries";
import SeasonTabs from "./SeasonTabs";

export default async function SharkTankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch seasons (Remember: your query is now 'order(seasonNumber desc)')
  const seasons = await client.fetch(sharkTankSeasonsQuery);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* FIXED STICKY LOGIC:
          1. top-[64px] matches the height of your main site navbar.
          2. z-40 ensures it stays BELOW the main navbar (usually z-50) but ABOVE content.
          3. bg-white/90 + backdrop-blur keeps it from looking messy over text.
      */}
      <header className="sticky top-[64px] lg:top-[112px] z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-4 gap-8">
            {/* Minimalist Logo/Context */}
            <div className="hidden sm:flex items-center gap-3 shrink-0 border-l-2 border-indigo-500 pl-4">
              <div className="flex flex-col">
                <h1 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 leading-none">
                  Shark Tank India
                </h1>
                <span className="text-[9px] font-medium text-slate-400 uppercase mt-1">
                  Database
                </span>
              </div>
            </div>

            {/* Navigation Scroller - min-w-0 is vital for horizontal scroll */}
            <div className="flex-1 min-w-0">
              <SeasonTabs seasons={seasons} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {children}
      </main>
    </div>
  );
}

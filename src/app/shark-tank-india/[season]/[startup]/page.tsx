import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  sharkTankSeasonStartupsQuery,
  sharkTankStartupDetailQuery,
} from "@/lib/sanity/queries";
import { PortableText } from "@portabletext/react";
import { cn } from "@/lib/utils";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

export default async function StartupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ season: string; startup: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { season, startup } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const itemsPerPage = 5;

  const [startups, currentData] = await Promise.all([
    client.fetch(sharkTankSeasonStartupsQuery, { seasonSlug: season }),
    client.fetch(sharkTankStartupDetailQuery, { startupSlug: startup }),
  ]);

  if (!currentData)
    return <div className="p-20 text-center">Data not found.</div>;

  // Pagination for the Mobile Feed
  const totalPages = Math.ceil(startups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const mobileBatch = startups.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col lg:flex-row gap-12 py-10 relative">
      {/* --- DESKTOP SIDEBAR (List of Names) --- */}
      <aside className="w-80 shrink-0 hidden lg:block">
        <div className="sticky top-[190px] max-h-[calc(100vh-220px)] overflow-y-auto pr-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Season Roster
            </h3>
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {startups.length} Companies
            </span>
          </div>
          <div className="space-y-2">
            {startups.map((item: any) => (
              <Link
                key={item._id}
                href={`/shark-tank-india/${season}/${item.slug}`}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all",
                  item.slug === startup
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                    : "bg-white border-slate-100",
                )}
              >
                <span className="text-[14px] font-medium">
                  {item.companyName}
                </span>
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    item.dealStatus === "Deal"
                      ? "bg-emerald-400"
                      : "bg-slate-200",
                  )}
                />
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* --- MOBILE FULL FEED (Full Details for 5 Companies) --- */}
      <div className="lg:hidden flex-1 space-y-12 px-4">
        {mobileBatch.map((company: any) => (
          <article
            key={company._id}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex gap-2 mb-6">
              <Badge text={company.industry} variant="blue" />
              <Badge
                text={company.dealStatus}
                variant={company.dealStatus === "Deal" ? "green" : "gray"}
              />
            </div>

            <h2 className="text-4xl font-semibold text-slate-900 mb-6 tracking-tight">
              {company.companyName}
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <StatBox
                label="Investment"
                value={company.pitchAmount}
                icon={<TrendingUp className="h-3.5 w-3.5" />}
              />
              <StatBox
                label="Status"
                value={company.currentStatus}
                isHighlight
              />
            </div>

            <div className="space-y-6">
              <p className="text-slate-500 font-medium leading-relaxed border-l-2 border-indigo-500 pl-4 italic">
                {company.shortSummary || company.pitchSummary}
              </p>

              <div className="prose prose-sm prose-slate max-w-none text-slate-600 font-medium">
                <h4 className="text-slate-900 font-bold text-[10px] uppercase tracking-widest mb-4">
                  The Journey
                </h4>
                {company.detailedJourney ? (
                  <PortableText
                    value={company.detailedJourney}
                    components={portableTextComponents}
                  />
                ) : (
                  <p className="text-slate-400 italic">
                    Full analysis coming soon...
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}

        {/* Mobile Pagination Navigation */}
        <div className="flex items-center justify-between py-10 border-t border-slate-100">
          <Link
            href={`?page=${Math.max(1, currentPage - 1)}`}
            className={cn(
              "flex items-center gap-2 font-bold text-sm",
              currentPage === 1 && "opacity-20 pointer-events-none",
            )}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Link>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Page {currentPage} / {totalPages}
          </span>
          <Link
            href={`?page=${Math.min(totalPages, currentPage + 1)}`}
            className={cn(
              "flex items-center gap-2 font-bold text-sm",
              currentPage === totalPages && "opacity-20 pointer-events-none",
            )}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* --- DESKTOP MAIN CONTENT (Selected Company Only) --- */}
      <main className="hidden lg:block flex-1 min-w-0">
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge text={currentData.industry} variant="blue" />
            <Badge
              text={currentData.dealStatus}
              variant={currentData.dealStatus === "Deal" ? "green" : "gray"}
            />
          </div>
          <h1 className="text-6xl font-semibold text-slate-900 tracking-tight mb-8">
            {currentData.companyName}
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-3xl border-l-2 border-indigo-500 pl-6">
            {currentData.shortSummary || currentData.pitchSummary}
          </p>
        </header>

        <div className="grid grid-cols-4 gap-4 mb-16">
          <StatBox
            label="Investment Asked"
            value={currentData.pitchAmount}
            icon={<TrendingUp className="h-3.5 w-3.5" />}
          />
          <StatBox
            label="Current Status"
            value={currentData.currentStatus}
            isHighlight
          />
          <StatBox
            label="Equity Offered"
            value={currentData.equityOffered || "N/A"}
          />
          <StatBox label="Valuation" value={currentData.valuation || "N/A"} />
        </div>

        <article className="prose prose-slate max-w-none bg-white rounded-3xl p-12 border border-slate-100 shadow-sm relative overflow-hidden">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8 flex items-center gap-4">
            The Growth Journey <div className="h-px flex-1 bg-slate-100" />
          </h2>
          <div className="relative z-10 text-slate-600 leading-[1.7] font-medium text-[16px]">
            <PortableText
              value={currentData.detailedJourney}
              components={portableTextComponents}
            />
          </div>
        </article>
      </main>
    </div>
  );
}

/** * UI SUB-COMPONENTS - UNCHANGED
 */
const portableTextComponents = {
  block: {
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-slate-900 mt-10 mb-4">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => <p className="mb-5">{children}</p>,
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className="text-indigo-600 font-semibold underline underline-offset-4 decoration-1"
      >
        {children}
      </a>
    ),
  },
};

function Badge({
  text,
  variant,
}: {
  text: string;
  variant: "blue" | "green" | "gray";
}) {
  const styles = {
    blue: "bg-indigo-50 text-indigo-600 border-indigo-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    gray: "bg-slate-50 text-slate-500 border-slate-200",
  };
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border",
        styles[variant],
      )}
    >
      {text}
    </span>
  );
}

function StatBox({
  label,
  value,
  isHighlight,
  icon,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-white transition-all group">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-indigo-500">{icon}</span>}
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>
      <p
        className={cn(
          "text-lg font-semibold tracking-tight",
          isHighlight ? "text-indigo-600" : "text-slate-800",
        )}
      >
        {value}
      </p>
    </div>
  );
}

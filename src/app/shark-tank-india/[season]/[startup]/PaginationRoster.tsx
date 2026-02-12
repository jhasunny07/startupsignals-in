import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export default function PaginationRoster({
  startups,
  currentStartupSlug,
  season,
  currentPage,
}: any) {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(startups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBatch = startups.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {currentBatch.map((item: any) => {
          const isSelected = item.slug === currentStartupSlug;
          return (
            <Link
              key={item._id}
              href={`/shark-tank-india/${season}/${item.slug}?page=${currentPage}`}
              className={cn(
                "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
                isSelected
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200"
                  : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30",
              )}
            >
              <span className="text-sm font-medium truncate pr-2">
                {item.companyName}
              </span>
              {item.dealStatus === "Deal" ? (
                <CheckCircle2
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isSelected ? "text-emerald-400" : "text-emerald-500",
                  )}
                />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-1.5 mt-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <Link
            href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
            scroll={false}
            className={cn(
              "p-2 rounded-lg transition-all",
              currentPage === 1
                ? "opacity-20 pointer-events-none"
                : "hover:bg-slate-50 text-slate-900",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 leading-none mb-1">
              Page
            </span>
            <span className="text-xs font-bold text-slate-900">
              {currentPage} / {totalPages}
            </span>
          </div>
          <Link
            href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
            scroll={false}
            className={cn(
              "p-2 rounded-lg transition-all",
              currentPage === totalPages
                ? "opacity-20 pointer-events-none"
                : "hover:bg-slate-50 text-slate-900",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  );
}

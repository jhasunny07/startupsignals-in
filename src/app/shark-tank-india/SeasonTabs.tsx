// src/app/shark-tank-india/SeasonTabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function SeasonTabs({ seasons }: { seasons: any[] }) {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = scrollContainerRef.current?.querySelector(
      '[data-active="true"]',
    );
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [pathname]);

  return (
    <div className="w-full relative group">
      <nav
        ref={scrollContainerRef}
        className={cn(
          "flex items-center gap-4 overflow-x-auto pb-4  px-2",
          "scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent",
          // Custom scrollbar styling for Chrome/Safari
          "[&::-webkit-scrollbar]:h-[5px]",
          "[&::-webkit-scrollbar-thumb]:bg-slate-300",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "hover:[&::-webkit-scrollbar-thumb]:bg-indigo-400",
        )}
        style={{ scrollSnapType: "x mandatory" }}
      >
        {seasons.map((season: any) => {
          const isActive = pathname.startsWith(
            `/shark-tank-india/${season.slug}`,
          );

          return (
            <Link
              key={season._id}
              href={`/shark-tank-india/${season.slug}`}
              data-active={isActive}
              className={cn(
                "whitespace-nowrap flex-none px-6 py-2.5 rounded-2xl text-sm font-medium  transition-all duration-300 border-2",
                "scroll-snap-align-start",
                isActive
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200 scale-105"
                  : "bg-white border-slate-100 text-slate-400 hover:border-indigo-500 hover:text-indigo-600 shadow-sm",
              )}
            >
              {season.title}
            </Link>
          );
        })}
        {/* Extra spacer to prevent the last item from being cut off */}
        <div className="flex-none w-4 h-1 md:hidden" />
      </nav>
    </div>
  );
}

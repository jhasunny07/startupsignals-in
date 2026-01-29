"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/lib/sanity/client";
import { unicornListQuery } from "@/lib/sanity/queries";

export default function UnicornsPage() {
  const [unicorns, setUnicorns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await client.fetch(unicornListQuery);
      setUnicorns(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const formatValuation = (num: number, currency: string) => {
    const formatter = Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    });
    const symbol = currency === "INR" ? "₹" : "$";
    return `${symbol}${formatter.format(num)}`;
  };

  if (loading)
    return (
      <div className="p-10 text-center font-mono">Loading Unicorns...</div>
    );

  return (
    <div className="scroll-smooth">
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        {/* LEFT SIDEBAR - Sticky */}
        <aside className="hidden md:block w-72 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto border-r border-gray-100 py-10 pr-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
            Directory
          </h2>
          <nav className="flex flex-col gap-2">
            {unicorns.map((u: any, index: number) => {
              // Priority 1: slug.current, Priority 2: slug string, Priority 3: fallback
              const sectionId = u.slug?.current || u.slug || `u-${index}`;
              const rank = unicorns.length - index;

              return (
                <a
                  key={sectionId}
                  href={`#${sectionId}`}
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-all"
                >
                  <span className="text-xs font-mono text-slate-400 group-hover:text-blue-500">
                    {rank.toString().padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 truncate">
                    {u.name}
                  </span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 md:pl-16 py-10">
          <div className="max-w-3xl">
            <header className="mb-16">
              <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter italic">
                UNICORNS
              </h1>
              <p className="text-slate-500 text-lg border-l-4 border-blue-500 pl-4">
                Latest valuations and rankings of the world's most valuable
                startups.
              </p>
            </header>

            <div className="space-y-32 mb-20">
              {unicorns.map((u: any, index: number) => {
                const sectionId = u.slug?.current || u.slug || `u-${index}`;
                const rank = unicorns.length - index;

                return (
                  <section
                    key={sectionId}
                    id={sectionId}
                    className="scroll-mt-24" // Ensures title isn't hidden by navbar
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {rank}
                      </div>
                      <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                        {u.name}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                      <div className="bg-slate-900 p-4 rounded-2xl text-white">
                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Valuation
                        </span>
                        <span className="text-2xl font-black">
                          {formatValuation(u.valuation, u.currency)}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Founded
                        </span>
                        <span className="text-xl font-bold text-slate-700">
                          {u.foundedYear}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Location
                        </span>
                        <span className="text-xl font-bold text-slate-700">
                          {u.country}
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-slate">
                      <p className="text-slate-600 leading-relaxed text-lg italic">
                        "{u.description}"
                      </p>
                    </div>

                    <div className="mt-12 h-[1px] bg-gradient-to-r from-blue-500/20 to-transparent w-full" />
                  </section>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

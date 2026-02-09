"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/lib/sanity/client";
import { unicornListQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

export default function UnicornsPage() {
  const [unicorns, setUnicorns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(unicornListQuery);
        setUnicorns(data);
      } catch (error) {
        console.error("Sanity error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ptComponents = {
    marks: {
      link: ({ children, value }: any) => {
        // Check if the link is external
        const isExternal = (value?.href || "").startsWith("http");

        return (
          <a
            href={value.href}
            // Open in new tab if external, otherwise same tab
            target={isExternal ? "_blank" : undefined}
            // Essential security for target="_blank"
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-indigo-600 font-bold underline underline-offset-4 decoration-indigo-200 hover:text-indigo-800 hover:decoration-indigo-600 transition-all cursor-pointer"
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }: any) => {
        if (!value || !value.asset) return null;
        const imageUrl = urlFor(value)?.width(1000).url() ?? null;
        if (!imageUrl) return null;
        return (
          <div className="my-8 relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <Image
              src={imageUrl}
              alt="Startup detail"
              fill
              className="object-contain bg-slate-50"
            />
          </div>
        );
      },
    },
    block: {
      normal: ({ children }: any) => (
        <p className="mb-6 text-slate-600 leading-relaxed text-sm md:text-base break-words">
          {children}
        </p>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-xl font-black text-slate-900 mt-8 mb-4 uppercase tracking-tight">
          {children}
        </h3>
      ),
    },
  };
  const formatValuation = (num: number, currency: string) => {
    const symbol = currency === "INR" ? "₹" : "$";

    // SMART LOGIC:
    // If you typed 1.03, we multiply by 1 Billion.
    // If you typed 1030000000, we use it as is.
    const normalizedAmount = num < 100 ? num * 1_000_000_000 : num;

    const formatter = Intl.NumberFormat("en-US", {
      notation: "compact",
      // This ensures 1.03 Billion shows as "1.03B" instead of just "1B"
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });

    return `${symbol}${formatter.format(normalizedAmount)}`;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      {/* 📱 MOBILE PAGE NAV */}
      <div className="lg:hidden sticky top-[64px] z-40 w-full px-4 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {unicorns.map((u) => (
            <a
              key={u._id}
              href={`#${u.anchor}`}
              className="px-4 py-2 rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-600 whitespace-nowrap border border-slate-200"
            >
              #{u.rank} {u.name}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-8 ">
        <div className="flex flex-col lg:flex-row gap-16 items-start relative">
          {/* 💻 DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-[128px] h-[calc(100vh-160px)]">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm flex flex-col h-full overflow-hidden">
              <div className="mb-6 px-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 block mb-1">
                  Navigation
                </span>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Directory
                </h2>
              </div>

              <nav className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-2">
                {unicorns.map((u) => (
                  <a
                    key={u._id}
                    href={`#${u.anchor}`}
                    className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                  >
                    <span className="font-mono text-xs font-bold text-slate-300 group-hover:text-indigo-500 transition-colors">
                      {String(u.rank).padStart(2, "0")}
                    </span>
                    <span className="text-[13px] font-semibold text-slate-500 group-hover:text-slate-900 truncate">
                      {u.name}
                    </span>
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-medium px-2 text-center uppercase tracking-widest">
                {unicorns.length} Unicorns
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 min-w-0 w-full space-y-12">
            <header className="mb-12 hidden lg:block">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-indigo-600"></span>
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">
                  Intelligence Report
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Unicorn Archive Index<span className="text-indigo-600">.</span>
              </h1>
            </header>

            {unicorns.map((u) => (
              <section
                key={u._id}
                id={u.anchor}
                className="scroll-mt-40 lg:scroll-mt-36 group"
              >
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.005] transition-all duration-500">
                  {/* Card Header */}
                  <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-mono text-lg font-black shrink-0 shadow-lg group-hover:bg-indigo-600 transition-colors">
                        {u.rank}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase mb-3">
                          {u.name}
                        </h2>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {u.country}
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          Est. {u.foundedYear}
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 px-6 py-4 rounded-2xl border border-indigo-100/50 min-w-[140px]">
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                        Valuation
                      </p>
                      <p className="text-2xl font-black text-indigo-900 italic">
                        {formatValuation(u.valuation, u.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 md:p-10">
                    <div className="text-lg font-medium text-slate-700 leading-relaxed mb-8 border-l-4 border-indigo-600 pl-6 py-2 italic bg-slate-50/50 rounded-r-xl">
                      {u.shortDescription}
                    </div>
                    <article className="prose prose-slate prose-lg max-w-none prose-a:no-underline">
                      <PortableText
                        value={u.content}
                        components={ptComponents}
                      />
                    </article>
                  </div>
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

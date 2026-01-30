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
    types: {
      image: ({ value }: any) => {
        if (!value?.asset) return null;
        return (
          <div className="my-6 relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200">
            <Image
              src={urlFor(value).width(1000).url()}
              alt="Startup detail"
              fill
              className="object-cover"
            />
          </div>
        );
      },
    },
    block: {
      normal: ({ children }: any) => (
        <p className="mb-3 text-slate-600 leading-relaxed text-sm md:text-base">
          {children}
        </p>
      ),
    },
  };

  const formatValuation = (num: number, currency: string) => {
    const symbol = currency === "INR" ? "₹" : "$";
    const formatter = Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return `${symbol}${formatter.format(num)}`;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans pb-10">
      {/* 📱 MOBILE NAV - STICKY POSITIONING */}
      <div className="lg:hidden sticky top-[64px] z-40 w-full px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {unicorns.map((u) => (
            <a
              key={u._id}
              href={`#${u.anchor}`}
              className="px-4 py-2 rounded-xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 whitespace-nowrap flex-shrink-0 active:bg-indigo-600 active:text-white transition-all shadow-sm border border-transparent"
            >
              #{u.rank} {u.name}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* 💻 DESKTOP SIDEBAR - REFINED & COMPACT */}
          <aside className="hidden lg:block w-56 sticky top-28 h-[calc(100vh-160px)]">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col h-full">
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5 px-2">
                Directory
              </h2>
              <nav className="space-y-0.5 overflow-y-auto no-scrollbar flex-1 pr-1">
                {unicorns.map((u) => (
                  <a
                    key={u._id}
                    href={`#${u.anchor}`}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                  >
                    <span className="font-mono text-[9px] font-bold text-slate-300 group-hover:text-indigo-600">
                      {String(u.rank).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 truncate">
                      {u.name}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* MAIN STREAM */}
          <main className="flex-1 space-y-6 md:space-y-8">
            <header className="mb-8 hidden lg:block">
              <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">
                Database Registry
              </span>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                Archive Index<span className="text-slate-300">.</span>
              </h1>
            </header>

            {unicorns.map((u) => (
              <section
                key={u._id}
                id={u.anchor}
                className="scroll-mt-[100px] lg:scroll-mt-[120px]"
              >
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* CARD HEADER */}
                  <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-mono text-[11px] font-black shrink-0">
                        {u.rank}
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                          {u.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {u.country}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {u.foundedYear}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 min-w-[120px] text-left md:text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        Valuation
                      </p>
                      <p className="text-lg font-black text-slate-900 tracking-tighter">
                        {formatValuation(u.valuation, u.currency)}
                      </p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 md:p-8">
                    <div className="text-sm md:text-base font-bold text-slate-700 leading-relaxed mb-6 border-l-2 border-indigo-600 pl-5 py-1 italic">
                      {u.shortDescription}
                    </div>
                    <article className="prose prose-slate prose-sm max-w-none prose-p:text-slate-500">
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
      `}</style>
    </div>
  );
}

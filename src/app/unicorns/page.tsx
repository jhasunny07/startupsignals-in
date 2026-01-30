"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/lib/sanity/client";
import { unicornListQuery } from "@/lib/sanity/queries";
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
        if (!value?.url) return null;
        return (
          <div className="my-16 group/img relative overflow-hidden rounded-sm border border-slate-200">
            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover/img:opacity-100 transition-opacity z-10 pointer-events-none" />
            <Image
              src={value.url}
              alt="Unicorn detail"
              width={1200}
              height={600}
              className="w-full object-cover grayscale-[50%] hover:grayscale-0 scale-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
        );
      },
    },
    block: {
      normal: ({ children }: any) => (
        <p className="mb-6 text-slate-500 leading-relaxed text-sm md:text-lg max-w-3xl">
          {children}
        </p>
      ),
    },
  };

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
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-1 bg-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600 animate-loading-bar" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-tighter">
            Initializing Database...
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* BACKGROUND GRID DECOR */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          size: "40px 40px",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* TECHNICAL SIDEBAR */}
          <aside className="hidden lg:block w-64 sticky top-24 h-[calc(100vh-100px)] border-l border-slate-100">
            <div className="pl-6 py-10">
              <div className="flex items-center gap-2 mb-10">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400">
                  LIVE_INDEX_v1.0
                </span>
              </div>
              <nav className="space-y-4">
                {unicorns.map((u) => (
                  <a
                    key={u._id}
                    href={`#${u.anchor}`}
                    className="group flex flex-col"
                  >
                    <span className="font-mono text-[9px] text-slate-300 group-hover:text-blue-600 transition-colors">
                      00{u.rank}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-tight group-hover:pl-2 transition-all">
                      {u.name}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* MAIN STREAM */}
          <main className="flex-1 py-10 lg:py-20 border-l border-slate-100 lg:pl-16">
            <header className="mb-40">
              <h1 className="text-[12vw] lg:text-[150px] font-black leading-[0.8] tracking-tighter uppercase mb-6">
                Uni
                <br />
                corns
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between border-t border-slate-900 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Global Startup Intelligence Archive
                </p>
                <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
                  Tracking the evolution of capital and innovation through the
                  lens of billion-dollar valuations.
                </p>
              </div>
            </header>

            <div className="space-y-80">
              {unicorns.map((u) => (
                <section
                  key={u._id}
                  id={u.anchor}
                  className="relative scroll-mt-32"
                >
                  {/* BACKGROUND GHOST RANK */}
                  <div className="absolute -left-10 lg:-left-24 top-0 font-black text-[200px] leading-none text-slate-50 opacity-[0.05] pointer-events-none select-none">
                    {u.rank}
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-col gap-10">
                      {/* 1. THE DATA HEADER */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 font-mono text-[10px] text-blue-600 font-bold tracking-[0.3em]">
                          <span>RANKING_{u.rank}</span>
                          <span className="w-10 h-[1px] bg-blue-200" />
                          <span>LOC_{u.country.toUpperCase()}</span>
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                          {u.name}
                        </h2>
                      </div>

                      {/* 2. HYPER-COMPACT VITALS BAR */}
                      <div className="flex flex-wrap gap-4 border border-slate-100 p-2 rounded-sm bg-slate-50/50 backdrop-blur-sm w-fit">
                        <div className="px-6 py-3 bg-white border border-slate-200">
                          <p className="font-mono text-[9px] text-slate-400 uppercase mb-1">
                            Valuation
                          </p>
                          <p className="text-xl font-black tabular-nums">
                            {formatValuation(u.valuation, u.currency)}
                          </p>
                        </div>
                        <div className="px-6 py-3 bg-white border border-slate-200">
                          <p className="font-mono text-[9px] text-slate-400 uppercase mb-1">
                            Founding
                          </p>
                          <p className="text-xl font-black">
                            EST_{u.foundedYear}
                          </p>
                        </div>
                      </div>

                      {/* 3. CONTENT AREA */}
                      <div className="max-w-4xl">
                        <h3 className="text-xl md:text-3xl text-slate-800 font-medium tracking-tight mb-8 leading-snug">
                          {u.shortDescription}
                        </h3>

                        <div className="prose prose-slate prose-sm md:prose-base max-w-none">
                          <PortableText
                            value={u.content}
                            components={ptComponents}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        .animate-loading-bar {
          position: absolute;
          width: 50%;
          height: 100%;
          animation: loading 1.5s infinite ease-in-out;
        }
        html {
          scroll-behavior: smooth;
        }
        ::selection {
          background: #2563eb;
          color: white;
        }
      `}</style>
    </div>
  );
}

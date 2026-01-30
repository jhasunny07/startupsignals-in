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
          <div className="my-10 md:my-16 group/img relative overflow-hidden rounded-sm border border-white/10">
            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover/img:opacity-100 transition-opacity z-10 pointer-events-none" />
            <Image
              src={value.url}
              alt="Unicorn detail"
              width={1200}
              height={600}
              className="w-full h-auto object-cover grayscale-[50%] hover:grayscale-0 scale-100 hover:scale-105 transition-all duration-700 ease-in-out"
            />
          </div>
        );
      },
    },
    block: {
      normal: ({ children }: any) => (
        <p className="mb-6 text-slate-400 leading-relaxed text-sm md:text-base max-w-3xl">
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
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-[1px] bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500 animate-[loading_1.5s_infinite_ease-in-out]" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-blue-500">
            Syncing_Data...
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden">
      {/* FIXED BACKGROUND GRID - ERROR FIXED HERE */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #333 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* LEFT COLUMN: THE HUD (Sticky) */}
        <aside className="lg:w-[400px] lg:h-screen lg:sticky lg:top-0 p-6 md:p-12 flex flex-col justify-between border-r border-white/10 bg-black/40 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-3 mb-8 md:mb-12">
              <div className="w-2 h-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-blue-400 uppercase">
                Database_Terminal
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              UNI
              <br />
              <span className="text-blue-500">CORNS</span>
            </h1>

            <div className="space-y-6 text-xs md:text-sm text-slate-400 font-light max-w-xs">
              <p className="leading-relaxed">
                Global synchronization with startup archives. Tracking
                high-growth private equity entities.
              </p>

              <div className="pt-6 border-t border-white/10">
                <span className="block font-mono text-[9px] text-slate-500 mb-4 tracking-widest">
                  REGISTRY_INDEX
                </span>
                <nav className="flex flex-wrap gap-2 max-h-[40vh] overflow-y-auto no-scrollbar">
                  {unicorns.map((u) => (
                    <a
                      key={u._id}
                      href={`#${u.anchor}`}
                      className="px-2 py-1 bg-white/5 border border-white/5 text-[9px] font-mono text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all"
                    >
                      ID_{u.rank}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-between font-mono text-[9px] text-slate-600 pt-8 border-t border-white/10">
            <span>ST_01 // ARCHIVE</span>
            <span>2026_GEN_F</span>
          </div>
        </aside>

        {/* RIGHT COLUMN: THE STREAM */}
        <main className="flex-1 px-6 py-12 lg:p-20 lg:pl-24 space-y-32 md:space-y-48">
          {unicorns.map((u) => (
            <section
              key={u._id}
              id={u.anchor}
              className="relative group scroll-mt-24"
            >
              {/* LARGE BACKGROUND NUMBER - Adjusted for mobile */}
              <span className="absolute -left-4 lg:-left-20 -top-8 text-[100px] md:text-[180px] font-black text-white/[0.03] select-none pointer-events-none group-hover:text-blue-500/10 transition-all duration-700">
                {u.rank.toString().padStart(2, "0")}
              </span>

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-[1px] w-8 md:w-12 bg-blue-500" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-blue-400 uppercase">
                    {u.country} • {u.foundedYear}
                  </span>
                </div>

                <h2 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-8 break-words leading-none">
                  {u.name}
                </h2>

                {/* COMPACT VALUATION CARD */}
                <div className="flex flex-wrap items-stretch bg-white text-black w-fit mb-10 overflow-hidden">
                  <div className="px-4 py-2 border-r border-black/5">
                    <span className="block font-mono text-[8px] uppercase font-bold text-black/50 mb-0.5">
                      Market_Cap
                    </span>
                    <span className="text-xl md:text-2xl font-black tabular-nums">
                      {formatValuation(u.valuation, u.currency)}
                    </span>
                  </div>
                  <div className="px-4 py-2 flex items-center bg-slate-50 text-[10px] font-bold uppercase tracking-tight text-slate-500">
                    Private_Equity
                  </div>
                </div>

                <div className="max-w-2xl">
                  <h3 className="text-lg md:text-2xl text-slate-100 font-medium leading-tight mb-8">
                    {u.shortDescription}
                  </h3>

                  <div className="prose prose-invert prose-sm md:prose-base prose-slate max-w-none opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                    <PortableText value={u.content} components={ptComponents} />
                  </div>
                </div>
              </div>
            </section>
          ))}

          <footer className="py-20 border-t border-white/5 flex flex-col items-center gap-4 text-center">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-transparent" />
            <span className="font-mono text-[9px] text-slate-600 tracking-[0.5em] uppercase">
              End_of_Transmission
            </span>
          </footer>
        </main>
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html {
          scroll-behavior: smooth;
        }
        .break-words {
          overflow-wrap: break-word;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}

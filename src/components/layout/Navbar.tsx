'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Search, 
  Linkedin, 
  ChevronDown, 
  Trophy, 
  Zap, 
  History, 
  Star, 
  ArrowRight,
  TrendingUp,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

const featuredCategories = [
  { 
    title: "Success Stories", 
    slug: "success-stories", 
    description: "Deep dives into built empires.",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  { 
    title: "Startup News", 
    slug: "startup-news", 
    description: "Daily updates & tech trends.",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  { 
    title: "Startup Stories", 
    slug: "startup-stories", 
    description: "The raw founder journeys.",
    icon: History,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  { 
    title: "Best Brands", 
    slug: "best-brands", 
    description: "World-class strategy analysis.",
    icon: Star,
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
];

const trendingArticles = [
  { title: "The Rise of AI Agents", slug: "ai-agents-2026", tag: "Hot" },
  { title: "Fintech's New Wave", slug: "fintech-trends", tag: "New" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-xl border-b shadow-sm" : "bg-white border-b"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-8">
          
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2 shrink-0">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
              <div className="w-5 h-5 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Startup<span className="text-indigo-600">Signals</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative group w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
              <Input
                type="search"
                placeholder="Search startups..."
                className="w-full pl-10 pr-4 bg-slate-100/50 border-transparent rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-2">
            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMenu hoverable>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-4 hover:bg-slate-100 font-medium group">
                    Explore 
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                  </Button>
                </DropdownMenuTrigger>
                
                {/* MEGA DROPDOWN CONTENT */}
                <DropdownMenuContent align="end" className="w-[500px] p-0 shadow-2xl rounded-3xl border-slate-200/60 overflow-hidden">
                  <div className="flex">
                    {/* Left Side: Categories */}
                    <div className="flex-[1.2] p-4 bg-white">
                      <div className="flex items-center gap-2 px-2 pb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <TrendingUp className="h-3 w-3" /> Categories
                      </div>
                      <div className="grid gap-1">
                        {featuredCategories.map((cat) => (
                          <DropdownMenuItem key={cat.slug} asChild className="p-0 focus:bg-transparent">
                            <Link 
                              href={`/blog/${cat.slug}`} 
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item"
                            >
                              <div className={cn("mt-0.5 p-1.5 rounded-lg transition-colors", cat.bg, cat.color)}>
                                <cat.icon className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-900">{cat.title}</span>
                                <span className="text-[11px] text-slate-500 line-clamp-1">{cat.description}</span>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </div>

                    {/* Right Side: Trending (Highlighted) */}
                    <div className="flex-1 bg-slate-50/80 p-4 border-l border-slate-100">
                      <div className="flex items-center gap-2 px-2 pb-3 text-[10px] font-bold uppercase tracking-widest text-orange-600">
                        <Flame className="h-3 w-3 fill-orange-600" /> Hot Now
                      </div>
                      <div className="space-y-3">
                        {trendingArticles.map((article) => (
                          <Link 
                            key={article.slug}
                            href={`/blog/${article.slug}`}
                            className="block group/article px-2"
                          >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                                    {article.tag}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-800 group-hover/article:text-indigo-600 transition-colors leading-snug">
                              {article.title}
                            </p>
                          </Link>
                        ))}
                        <DropdownMenuSeparator className="bg-slate-200" />
                        <Link href="/blog" className="flex items-center gap-2 px-2 text-xs font-bold text-indigo-600 hover:gap-3 transition-all">
                          View All Posts <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-4 w-px bg-slate-200 mx-2" />

              <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-blue-50 hover:text-[#0A66C2]">
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5 fill-current" />
                </a>
              </Button>
            </nav>

            {/* Mobile Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[380px] p-0">
                 <div className="p-6 border-b">
                    <SheetTitle className="text-2xl font-black">Explore</SheetTitle>
                 </div>
                 <div className="p-4 space-y-6">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 pl-2">Top Categories</p>
                        {featuredCategories.map((cat) => (
                             <Link key={cat.slug} href={`/blog/${cat.slug}`} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50">
                                <div className={cn("p-2 rounded-xl", cat.bg, cat.color)}>
                                    <cat.icon className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-slate-900">{cat.title}</span>
                             </Link>
                        ))}
                    </div>
                 </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Active Indicator Bar */}
      <div className="hidden md:block bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 flex h-11 items-center gap-8">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/${cat.slug}`}
              className={cn(
                "text-[12px] font-bold uppercase tracking-wider transition-all relative py-3.5",
                pathname === `/blog/${cat.slug}` ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-900"
              )}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
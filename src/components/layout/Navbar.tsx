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
  DropdownMenuLabel,
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
  ArrowRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced categories with descriptions and icons
const featuredCategories = [
  { 
    title: "Success Stories", 
    slug: "success-stories", 
    description: "Deep dives into how founders built their empires.",
    icon: Trophy,
    color: "text-amber-500"
  },
  { 
    title: "Startup News", 
    slug: "startup-news", 
    description: "Daily updates on funding, M&A, and tech trends.",
    icon: Zap,
    color: "text-blue-500"
  },
  { 
    title: "Startup Stories", 
    slug: "startup-stories", 
    description: "The raw, unedited journey of early-stage startups.",
    icon: History,
    color: "text-emerald-500"
  },
  { 
    title: "Best Brands", 
    slug: "best-brands", 
    description: "Analysing the strategy behind world-class branding.",
    icon: Star,
    color: "text-purple-500"
  },
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
      isScrolled 
        ? "bg-white/80 backdrop-blur-xl border-b shadow-sm" 
        : "bg-white border-b"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-8">
          
          {/* Left: Logo */}
          <Link href="/" className="group flex items-center space-x-2 shrink-0">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <div className="w-5 h-5 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Startup<span className="text-indigo-600">Signals</span>
            </span>
          </Link>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <div className="relative group w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
              <Input
                type="search"
                placeholder="Search for startups, founders, or brands..."
                className="w-full pl-10 pr-4 bg-slate-100/50 border-transparent rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <nav className="hidden lg:flex items-center gap-2">
              {/* THE BEST DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-4 hover:bg-slate-100 font-medium transition-all group">
                    Explore 
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[380px] p-3 shadow-2xl rounded-2xl border-slate-200/60">
                  <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground px-3 py-2">
                    Discover Content
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="mx-2 mb-2" />
                  <div className="grid gap-1">
                    {featuredCategories.map((cat) => (
                      <DropdownMenuItem key={cat.slug} asChild className="p-0 focus:bg-transparent">
                        <Link 
                          href={`/blog/${cat.slug}`} 
                          className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                        >
                          <div className={cn("mt-1 p-2 rounded-lg bg-slate-50 group-hover/item:bg-white group-hover/item:shadow-sm transition-all", cat.color)}>
                            <cat.icon className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                              {cat.title}
                              <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                            </span>
                            <span className="text-xs text-slate-500 leading-relaxed underline-none">
                              {cat.description}
                            </span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-4 w-px bg-slate-200 mx-2" />

              <Button variant="ghost" size="icon" asChild className="rounded-full text-slate-600 hover:text-[#0A66C2] hover:bg-blue-50 transition-all">
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5 fill-current" />
                </a>
              </Button>
            </nav>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[350px] border-l-0">
                <SheetHeader className="text-left pb-6 border-b">
                  <SheetTitle className="text-2xl font-bold tracking-tight">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 py-8">
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Categories</p>
                    <div className="grid gap-2">
                      {featuredCategories.map((cat) => (
                        <Link 
                          key={cat.slug} 
                          href={`/blog/${cat.slug}`}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors"
                        >
                          <cat.icon className={cn("h-6 w-6", cat.color)} />
                          <span className="font-semibold text-slate-900">{cat.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Sub-bar (Active State Indicator) */}
      <div className="hidden md:block bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex h-12 items-center gap-8">
            {featuredCategories.map((cat) => {
              const isActive = pathname === `/blog/${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  href={`/blog/${cat.slug}`}
                  className={cn(
                    "text-[13px] font-medium transition-all relative py-3",
                    isActive 
                      ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {cat.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORY_UI_MAP } from "@/lib/constants/category-ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSanityClient } from "@/lib/sanity/client";
import { allCategoriesQuery } from "@/lib/sanity/queries";

/* -------------------- FEATURED NAV ITEMS -------------------- */
const featuredCategories = [
  {
    title: "Growth Stories",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-50",
    href: "/blog/growth-stories",
  },
  {
    title: "Startup News",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-50",
    href: "/news",
  },
  {
    title: "Startup Journey",
    icon: History,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    href: "/blog/startup-journey",
  },
  {
    title: "Top Brands",
    icon: Star,
    color: "text-purple-500",
    bg: "bg-purple-50",
    href: "/blog/top-brands",
  },
  {
    title: "Funding History",
    icon: TrendingUp,
    color: "text-rose-500",
    bg: "bg-rose-50",
    href: "/blog/funding-history",
  },
  {
    title: "Unicorn List",
    icon: Trophy,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    href: "/unicorns",
  },
];

/* -------------------- TRENDING -------------------- */
const trendingArticles = [
  { title: "The Rise of AI Agents", slug: "ai-agents-2026" },
  { title: "Fintech's New Wave", slug: "fintech-trends" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [allCategories, setAllCategories] = useState<
    { title: string; slug: string }[]
  >([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    async function fetchCategories() {
      const client = getSanityClient();
      const data = await client.fetch(allCategoriesQuery);
      setAllCategories(data);
    }

    fetchCategories();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b shadow-sm"
          : "bg-white border-b",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <div className="w-5 h-5 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-bold">
              Startup<span className="text-indigo-600">Signals</span>
            </span>
          </Link>

          {/* SEARCH */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search startups..."
                className="pl-10 rounded-full bg-slate-100/50"
              />
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  Explore
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-[500px] p-0 rounded-3xl overflow-hidden"
              >
                <div className="flex">
                  {/* LEFT: BLOG CATEGORIES */}
                  <div className="flex-[1.2] p-4 bg-white">
                    <div className="flex items-center gap-2 pb-3 text-[10px] font-bold uppercase text-slate-400">
                      <TrendingUp className="h-3 w-3" />
                      Categories
                    </div>

                    <div className="grid gap-1">
                      {allCategories.map((cat) => {
                        const ui = CATEGORY_UI_MAP[cat.slug];
                        const Icon = ui?.icon;

                        return (
                          <DropdownMenuItem
                            key={cat.slug}
                            asChild
                            className="p-0 focus:bg-transparent"
                          >
                            <Link
                              href={`/blog/${cat.slug}`}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50"
                            >
                              <div
                                className={cn(
                                  "p-2 rounded-lg",
                                  ui?.bg ?? "bg-slate-100",
                                  ui?.color ?? "text-slate-600",
                                )}
                              >
                                {Icon && <Icon className="h-4 w-4" />}
                              </div>
                              <span className="text-sm font-semibold">
                                {cat.title}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT: TRENDING */}
                  <div className="flex-1 p-4 bg-slate-50 border-l">
                    <div className="flex items-center gap-2 pb-3 text-[10px] font-bold uppercase text-orange-600">
                      <Flame className="h-3 w-3 fill-orange-600" />
                      Hot Now
                    </div>

                    <div className="space-y-3">
                      {trendingArticles.map((a) => (
                        <Link key={a.slug} href={`/blog/${a.slug}`}>
                          <p className="text-sm font-medium hover:text-indigo-600">
                            {a.title}
                          </p>
                        </Link>
                      ))}

                      <DropdownMenuSeparator />
                      <Link
                        href="/blog"
                        className="flex items-center gap-2 text-xs font-bold text-indigo-600"
                      >
                        View All Posts <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </nav>

          {/* MOBILE */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[85vw] sm:w-[400px]">
              <SheetTitle className="mb-4">
                Startup<span className="text-indigo-600">Signals</span>
              </SheetTitle>

              <Input placeholder="Search startups..." className="mb-6" />

              <div className="space-y-2">
                {featuredCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.title}
                      href={cat.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
                    >
                      <div className={cn("p-2 rounded-lg", cat.bg, cat.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold">{cat.title}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* FEATURED BAR */}
      <div className="hidden lg:block bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-3">
            {featuredCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = pathname === cat.href;

              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-slate-100 text-slate-700",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : cat.color,
                    )}
                  />
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

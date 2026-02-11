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
  Globe,
  X,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSanityClient } from "@/lib/sanity/client";
import { allCategoriesQuery } from "@/lib/sanity/queries";

/* -------------------- NAV ITEMS -------------------- */
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
    title: "Shark Tank Journey",
    icon: History,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    href: "/shark-tank-india",
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
    href: "/blog/funding",
  },
  {
    title: "Unicorn List",
    icon: Trophy,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    href: "/unicorns",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<
    { title: string; slug: string }[]
  >([]);

  // Check if Explore/Mega Menu categories are active
  const isExploreActive = allCategories.some((cat) =>
    pathname.includes(`/blog/${cat.slug}`),
  );

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

  const closeMenus = () => {
    setDesktopOpen(false);
    setMobileOpen(false);
  };

  return (
    <header
      suppressHydrationWarning
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b shadow-sm"
          : "bg-white border-b",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-8">
          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenus}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <div className="w-5 h-5 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-black tracking-tight">
              Startup<span className="text-indigo-600">Signals</span>
            </span>
          </Link>

          {/* SEARCH BAR (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search intelligence..."
                className="pl-10 rounded-full bg-slate-100/50 border-transparent focus:bg-white focus:border-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-4">
            <DropdownMenu open={desktopOpen} onOpenChange={setDesktopOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "gap-2 font-bold transition-all rounded-full px-5",
                    desktopOpen || isExploreActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:text-indigo-600",
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Explore
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 opacity-50 transition-transform",
                      desktopOpen && "rotate-180",
                    )}
                  />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="center"
                sideOffset={20}
                className="w-[95vw] max-w-[1200px] p-0 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border-slate-100 animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="flex flex-col md:flex-row min-h-[400px]">
                  <div className="w-full md:w-80 bg-slate-50 p-10 flex flex-col justify-between border-r border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                          Mega Menu
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                        Explore the Ecosystem.
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Access our full database of startup intelligence.
                      </p>
                    </div>
                    <Link
                      href="/blog"
                      onClick={closeMenus}
                      className="mt-8 flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-600 hover:shadow-md transition-all group"
                    >
                      <span className="font-bold text-slate-700">
                        Full Archive
                      </span>
                      <ArrowRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="flex-1 p-10 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-3">
                      {allCategories.map((cat) => {
                        const ui = CATEGORY_UI_MAP[cat.slug];
                        const Icon = ui?.icon;
                        const isCurrentCat = pathname.includes(cat.slug);

                        return (
                          <DropdownMenuItem
                            key={cat.slug}
                            asChild
                            className="p-0 focus:bg-transparent"
                          >
                            <Link
                              href={`/blog/${cat.slug}`}
                              onClick={closeMenus}
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl transition-all group border",
                                isCurrentCat
                                  ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100"
                                  : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-100",
                              )}
                            >
                              <div
                                className={cn(
                                  "p-3 rounded-xl transition-all",
                                  isCurrentCat
                                    ? "bg-white/20 text-white"
                                    : cn(
                                        ui?.bg ?? "bg-slate-100",
                                        ui?.color ?? "text-slate-600",
                                      ),
                                )}
                              >
                                {Icon ? (
                                  <Icon className="h-5 w-5" />
                                ) : (
                                  <Zap className="h-5 w-5" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  "font-bold text-[15px]",
                                  isCurrentCat
                                    ? "text-white"
                                    : "text-slate-700",
                                )}
                              >
                                {cat.title}
                              </span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              asChild
              onClick={closeMenus}
              className="rounded-full hover:bg-indigo-50 hover:text-indigo-600"
            >
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </nav>

          {/* 📱 MOBILE MENU */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl bg-slate-50 border border-slate-100"
              >
                <Menu className="h-6 w-6 text-slate-900" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:w-[420px] p-0 border-l-0"
            >
              <div className="flex flex-col h-full bg-white">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <SheetTitle asChild>
                    <div className="flex items-center gap-2">
                      <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <div className="w-4 h-4 bg-white rounded-sm" />
                      </div>
                      <span className="text-lg font-black tracking-tight">
                        Startup<span className="text-indigo-600">Signals</span>
                      </span>
                    </div>
                  </SheetTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMenus}
                    className="rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-8">
                  {/* Mobile Search */}
                  <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search startups..."
                      className="pl-10 h-12 rounded-2xl bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                    />
                  </div>

                  {/* FEATURED / UNICORN LIST SECTION */}
                  <div className="mb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6 pl-1">
                      Priority Access
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {featuredCategories.map((cat) => {
                        // FIX: Updated logic for mobile active state
                        const isActive = pathname.startsWith(cat.href);
                        return (
                          <Link
                            key={cat.title}
                            href={cat.href}
                            onClick={closeMenus}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-2xl border transition-all",
                              isActive
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                                : "bg-indigo-50/50 border-indigo-100 text-slate-700 hover:bg-indigo-50",
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "p-2 rounded-xl",
                                  isActive
                                    ? "bg-white/20"
                                    : "bg-white shadow-sm",
                                )}
                              >
                                <cat.icon
                                  className={cn(
                                    "h-5 w-5",
                                    isActive ? "text-white" : cat.color,
                                  )}
                                />
                              </div>
                              <span className="font-bold text-md">
                                {cat.title}
                              </span>
                            </div>
                            {cat.title === "Unicorn List" && !isActive && (
                              <span className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                Live
                              </span>
                            )}
                            <ArrowRight className="h-4 w-4 opacity-30" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* KNOWLEDGE ARCHIVES */}
                  <div className="mb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 pl-1">
                      Knowledge Archives
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                      {allCategories.map((cat) => {
                        const ui = CATEGORY_UI_MAP[cat.slug];
                        const Icon = ui?.icon;
                        const isActive = pathname.includes(cat.slug);

                        return (
                          <Link
                            key={cat.slug}
                            href={`/blog/${cat.slug}`}
                            onClick={closeMenus}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-2xl border transition-all",
                              isActive
                                ? "bg-slate-900 border-slate-900 text-white shadow-xl"
                                : "bg-white border-slate-100 text-slate-700 hover:border-indigo-100",
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "p-2 rounded-xl",
                                  isActive
                                    ? "bg-white/20"
                                    : (ui?.bg ?? "bg-slate-50"),
                                )}
                              >
                                {Icon ? (
                                  <Icon
                                    className={cn(
                                      "h-5 w-5",
                                      isActive
                                        ? "text-white"
                                        : (ui?.color ?? "text-slate-500"),
                                    )}
                                  />
                                ) : (
                                  <Zap className="h-5 w-5" />
                                )}
                              </div>
                              <span className="font-bold text-md">
                                {cat.title}
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-30" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* CONNECT SECTION */}
                  <div className="pt-8 border-t border-slate-100 mt-auto">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5 pl-1 text-center">
                      Let&apos;s Connect
                    </h3>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 h-14 rounded-2xl gap-2 border-slate-200"
                        asChild
                        onClick={closeMenus}
                      >
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-5 w-5 text-[#0077b5]" />
                          <span className="font-bold text-sm text-slate-800">
                            LinkedIn
                          </span>
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 h-14 rounded-2xl gap-2 border-slate-200"
                        asChild
                        onClick={closeMenus}
                      >
                        <Link href="/">
                          <Globe className="h-5 w-5 text-indigo-600" />
                          <span className="font-bold text-sm text-slate-800">
                            Home
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    © 2026 StartupSignals Intelligence
                    <br />
                    Global Research Hub
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* DESKTOP FEATURED BAR */}
      <div className="hidden lg:block bg-white border-t border-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-3">
            {featuredCategories.map((cat) => {
              // FIX: This ensures the active state works for nested pages (Seasons/Startups)
              const isActive =
                cat.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(cat.href);

              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  onClick={closeMenus}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all",
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "hover:bg-slate-50 text-slate-500 hover:text-slate-900",
                  )}
                >
                  <cat.icon
                    className={cn(
                      "h-3.5 w-3.5",
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

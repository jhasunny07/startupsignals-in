// src/components/layout/Navbar.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            Startup<span className="text-indigo-600">Blog</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex md:gap-x-10">
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Blog
            </Link>
            <Link href="/blog/startups">Startups</Link>
<Link href="/blog/funding">Funding</Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile menu button (placeholder — we'll add hamburger later if needed) */}
          <div className="md:hidden">
            <button className="text-gray-700">Menu</button>
          </div>
        </div>
      </div>
    </header>
  );
}
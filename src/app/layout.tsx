// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Startup Signals",
  description: "Insights on startups and growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.className, "antialiased bg-gray-50")}>
        {/* Wrapping children in MainLayout ensures Navbar/Footer show up */}
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

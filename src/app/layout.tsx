// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://startupsignals.com"), // <- Replace with your domain
  title: {
    default: "Startup Signals – Insights on Startups, Tech & Growth",
    template: "%s | Startup Signals",
  },
  description:
    "Actionable insights on startups, technology, funding, growth, and building products in public.",
  openGraph: {
    type: "website",
    siteName: "Startup Signals",
    title: "Startup Signals",
    description:
      "Insights on startups, tech, growth, and building in public.",
    url: "https://startupsignals.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Signals",
    description:
      "Insights on startups, tech, growth, and building in public.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.className, "antialiased bg-gray-50")}>
        {children}
      </body>
    </html>
  );
}

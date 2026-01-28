import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowUpRight, Radio } from "lucide-react";

// The official brand name
const BRAND_NAME = "STARTUPSIGNALS"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 pb-20">
          
          {/* 1. BRAND IDENTITY COLUMN */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="text-3xl font-black tracking-[calc(-0.05em)] flex items-center gap-2 uppercase italic">
              <span className="text-orange-600 tracking-tighter not-italic">⚡</span>
              {BRAND_NAME}<span className="text-orange-600 not-italic">.</span>
            </Link>
            <p className="text-slate-500 text-base leading-relaxed max-w-sm font-medium">
              We track the high-frequency movements of the startup ecosystem. 
              From seed rounds to scale-ups, we deliver the signals that matter 
              to founders and investors.
            </p>
            
            {/* Social Connection */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Facebook, href: "#" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-500"
                >
                  <social.Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. CATEGORIES COLUMN */}
          <div className="lg:col-span-2 space-y-6 lg:ml-auto">
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Channels</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-900">
              {["Market News", "Founder Intelligence", "Capital Flow", "Growth Hacks", "Tech Stack"].map((item) => (
                <li key={item}>
                  <Link href={`/category/${item.toLowerCase().replace(" ", "-")}`} className="hover:text-orange-600 transition-colors flex items-center gap-2 group">
                    {item}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. INFORMATION COLUMN */}
          <div className="lg:col-span-2 space-y-6 lg:ml-auto">
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Resource</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-900">
              {["About the Signal", "Contact Us", "Submit News", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(" ", "-")}`} className="hover:text-orange-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. NEWSLETTER COLUMN */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">Newsletter</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Don’t get lost in the noise. Get the top 1% of signals weekly.
            </p>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-1 focus-within:border-orange-600 transition-all">
              <input 
                type="email" 
                placeholder="you@company.com" 
                className="w-full bg-transparent px-4 py-3 text-sm font-bold outline-none"
              />
              <button className="w-full mt-1 bg-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600 transition-colors">
                Subscribe to Signal
              </button>
            </div>
          </div>

        </div>

        {/* --- DYNAMIC BOTTOM STRIP --- */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <div className="h-3 w-[2px] bg-orange-600" />
              <div className="h-4 w-[2px] bg-orange-600" />
              <div className="h-2 w-[2px] bg-slate-200" />
              <div className="h-5 w-[2px] bg-orange-600" />
            </div>
            Signal Strength: 98%
          </div>
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            © {currentYear} {BRAND_NAME}. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Built for Founders</span>
             <Radio className="h-4 w-4 text-orange-600 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
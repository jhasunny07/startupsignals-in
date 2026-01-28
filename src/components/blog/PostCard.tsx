// src/components/blog/PostCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function PostCard({ post }: { post: any }) {
  return (
    <Card className="border-none bg-transparent group cursor-pointer shadow-none">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] mb-6">
        <Image 
          src={post.coverImage?.asset?.url || "/placeholder.jpg"} 
          fill 
          alt="" 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
      <CardContent className="p-0">
        <div className="flex items-center gap-3 mb-3">
           <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{post.category}</span>
           <span className="w-1 h-1 rounded-full bg-slate-300" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">5 min read</span>
        </div>
        <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-indigo-600 transition-colors mb-3">
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
          {post.description}
        </p>
      </CardContent>
    </Card>
  );
}
import {
  TrendingUp,
  Flame,
  Rocket,
  DollarSign,
  Lightbulb,
  Cpu,
  Briefcase,
  BarChart,
  ShoppingBag,
  Trophy,
} from "lucide-react";

export const CATEGORY_UI_MAP: Record<
  string,
  {
    icon: any;
    color: string;
    bg: string;
  }
> = {
  finance: {
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  products: {
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  marketing: {
    icon: TrendingUp,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  "success-stories": {
    icon: Trophy,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  innovation: {
    icon: Lightbulb,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  "business-models": {
    icon: Briefcase,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  technology: {
    icon: Cpu,
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
  funding: {
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  growth: {
    icon: BarChart,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  startups: {
    icon: Rocket,
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

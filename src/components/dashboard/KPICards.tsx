import { DollarSign, TrendingUp, Users, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { KPI } from "@/store/useDashboardStore"; 

interface KPICardsProps {
  data: KPI;
}

export default function KPICards({ data }: KPICardsProps) {
  if (!data) return null;

  const cards = [
    {
      name: "Total Revenue",
      value: `$${data.total_gross_revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
      bg: "bg-cyan-500/10 border border-cyan-500/20",
    },
    {
      name: "ROAS",
      value: `${data.global_roas.toFixed(2)}x`,
      icon: TrendingUp,
      color: "text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]",
      bg: "bg-purple-500/10 border border-purple-500/20",
    },
    {
      name: "Ad Spend",
      value: `$${data.total_cost.toLocaleString()}`,
      icon: Users,
      color: "text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]",
      bg: "bg-pink-500/10 border border-pink-500/20",
    },
    {
      name: "ROI",
      value: `${data.global_roi_decimal.toLocaleString()}`, 
      icon: Percent,
      color: "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]",
      bg: "bg-emerald-500/10 border border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className="relative overflow-hidden rounded-xl glass-card px-4 pt-5 pb-12 shadow-lg transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] sm:px-6 sm:pt-6"
        >
          <dt>
            <div className={cn("absolute rounded-lg p-3 backdrop-blur-sm", card.bg)}>
              <card.icon className={cn("h-6 w-6", card.color)} aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-400">
              {card.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-1 sm:pb-7">
            <p className="text-2xl font-bold text-white tracking-wide">
              {card.value}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}
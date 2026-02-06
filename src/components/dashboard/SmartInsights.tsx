import { Influencer, KPI } from "@/store/useDashboardStore";
import { TrendingUp, TrendingDown, Zap, Target, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Platform } from "@/types";

interface SmartInsightsProps {
  influencers: Influencer[];
  kpi: Record<Platform | 'all', KPI | null>; 
}

export default function SmartInsights({ influencers, kpi }: SmartInsightsProps) {
  const tiktokRevenue = kpi?.tiktok?.total_gross_revenue || 0;
  const youtubeRevenue = kpi?.youtube?.total_gross_revenue || 0;
  
  const totalRevenue = (tiktokRevenue + youtubeRevenue) || 1; 

  const tiktokShare = (tiktokRevenue / totalRevenue) * 100;
  const youtubeShare = (youtubeRevenue / totalRevenue) * 100;

  const topInfluencer = [...influencers].sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))[0];
  const topInfluencerShare = topInfluencer ? ((topInfluencer.total_revenue || 0) / totalRevenue) * 100 : 0;

  const insights: any[] = [];

  influencers.forEach(inf => {
    if ((inf.roas || 0) > 4) { 
       insights.push({
         type: 'opportunity',
         icon: Target,
         color: 'text-emerald-400',
         bg: 'bg-emerald-500/10',
         border: 'border-emerald-500/20',
         title: 'High Efficiency',
         message: `${inf.account} is generating a high ROAS of ${inf.roas}x. Consider increasing ad spend.`
       });
    }
  });

  influencers.forEach(inf => {
    if ((inf.roas || 0) < 1.5) { 
      insights.push({
        type: 'warning',
        icon: TrendingDown,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        title: 'Performance Drop',
        message: `${inf.account} has a low ROAS of ${inf.roas}x. Review creatives.`
      });
    }
  });

  const displayInsights = insights.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <PieChart className="w-24 h-24 text-purple-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <span className="w-1 h-5 bg-purple-500 rounded-full mr-3 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
          Platform Split
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300 flex items-center"><Zap className="w-3 h-3 mr-1 text-red-500"/> YouTube</span>
              <span className="font-bold text-white">{youtubeShare.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-red-500 to-orange-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000"
                style={{ width: `${youtubeShare}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300 flex items-center"><Zap className="w-3 h-3 mr-1 text-cyan-500"/> TikTok</span>
              <span className="font-bold text-white">{tiktokShare.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000"
                style={{ width: `${tiktokShare}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-24 h-24 text-pink-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
          <span className="w-1 h-5 bg-pink-500 rounded-full mr-3 shadow-[0_0_10px_rgba(236,72,153,0.8)]"></span>
          Market Leader
        </h3>

        {topInfluencer ? (
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm">Top Performer</div>
              <div className="text-pink-400 font-bold text-sm bg-pink-500/10 px-2 py-1 rounded border border-pink-500/20">
                #{topInfluencerShare.toFixed(1)}% of Total Sales
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1 truncate">{topInfluencer.account}</div>
            <div className="text-sm text-gray-400 mb-6 capitalize">{topInfluencer.platform} Influencer</div>

            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-pink-500 to-rose-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.6)] relative overflow-hidden"
                style={{ width: `${topInfluencerShare}%` }}
              >
                 <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              This influencer generates a significant portion of your total revenue.
            </p>
          </div>
        ) : (
          <div className="text-gray-500">No data available</div>
        )}
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
         <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <span className="w-1 h-5 bg-cyan-400 rounded-full mr-3 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
          AI Recommendations
        </h3>
        
        <div className="space-y-3 max-h-50 overflow-y-auto pr-2 custom-scrollbar">
          {displayInsights.length > 0 ? (
            displayInsights.map((insight, idx) => (
              <div 
                key={idx}
                className={cn(
                  "p-3 rounded-lg border flex items-start space-x-3 transition-all hover:translate-x-1",
                  insight.bg,
                  insight.border
                )}
              >
                <insight.icon className={cn("w-5 h-5 shrink-0 mt-0.5", insight.color)} />
                <div>
                  <h4 className={cn("text-sm font-bold mb-0.5", insight.color)}>{insight.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{insight.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm text-center py-4">
              <p>No critical alerts.</p>
              <p className="text-xs mt-1 opacity-50">Campaigns are performing within normal ranges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
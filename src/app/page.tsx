'use client';

import { useState, useEffect } from "react";
import { Loader2, LayoutDashboard, AlertCircle, CalendarX } from "lucide-react"; 
import KPICards from "@/components/dashboard/KPICards";
import InfluencerTable from "@/components/dashboard/InfluencerTable";
import ScriptTable from "@/components/dashboard/ScriptTable";
import SmartInsights from "@/components/dashboard/SmartInsights";
import { DatePickerWithRange } from "@/components/dashboard/DateRangePicker";
import { useDashboardStore } from "@/store/useDashboardStore"; 
import { Platform } from "@/types";
import { cn } from "@/lib/utils";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";

export default function Dashboard() {
  const [platform, setPlatform] = useState<Platform | 'all'>('tiktok');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { 
    influencers: allInfluencers, 
    scripts, 
    kpiData, 
    isLoading, 
    fetchDashboardData 
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData(dateRange);
  }, [dateRange, fetchDashboardData]);

  const currentKPI = kpiData ? kpiData[platform] : null;

  return (
    <div className="space-y-8 min-h-screen">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500 neon-text">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Overview of your influencer marketing performance.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 backdrop-blur-md">
            {(['all', 'tiktok', 'youtube'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize",
                  platform === p
                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <DatePickerWithRange 
              date={dateRange}
              setDate={(range) => {
                setDateRange(range);
              }}
            />
            {dateRange && (
               <button 
                 onClick={() => setDateRange(undefined)}
                 className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                 title="Clear Date (All Time)"
               >
                 <CalendarX size={18} />
               </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[60vh] flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
            
            <div className="relative h-16 w-16 animate-spin rounded-full border-2 border-white/5 border-t-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]"></div>
            
            <div className="absolute inset-0 m-auto h-10 w-10 animate-[spin_1.5s_linear_infinite] rounded-full border-2 border-white/5 border-b-purple-500"></div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium text-transparent bg-clip-text bg-linear-to-r from-cyan-200 to-purple-200 animate-pulse">
              {dateRange ? 'Syncing live data...' : 'Fetching all-time history...'}
            </span>
          </div>
        </div>

      ) : !currentKPI ? (
        <div className="flex h-[50vh] flex-col items-center justify-center text-center">
          <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shadow-xl mb-4">
             <LayoutDashboard className="h-10 w-10 text-gray-500 opacity-50" />
          </div>
          <h3 className="text-lg font-semibold text-white">No Data Available</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            We couldn't find any performance metrics for <span className="capitalize text-cyan-400">{platform}</span> in this date range.
          </p>
        </div>

      ) : (
        <>
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-cyan-400 rounded-full mr-3 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
              Performance Overview 
              {!dateRange && <span className="ml-2 text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">(All Time)</span>}
            </h2>
            <KPICards data={currentKPI} />
          </section>

          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-yellow-400 rounded-full mr-3 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></span>
              AI Insights & Analysis
            </h2>
            <SmartInsights influencers={allInfluencers} kpi={kpiData} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-1 h-6 bg-purple-500 rounded-full mr-3 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                  Top Influencers
                </h2>
              </div>
              <InfluencerTable data={allInfluencers ?? []} />   
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-6 bg-pink-500 rounded-full mr-3 shadow-[0_0_10px_rgba(236,72,153,0.8)]"></span>
                Top Scripts
              </h2>
              <ScriptTable data={scripts ?? []} />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
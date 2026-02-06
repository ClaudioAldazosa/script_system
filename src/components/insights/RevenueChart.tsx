'use client';

import { DailyData } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { format, parseISO } from "date-fns";

interface RevenueChartProps {
  data: DailyData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Aggregate data by date if needed, but for now assuming data is already suitable or we filter it.
  // Actually the data might have multiple entries per date (one for tiktok, one for youtube).
  // We should aggregate them for the total chart.

  const aggregatedData = data.reduce((acc, curr) => {
    const existing = acc.find(d => d.date === curr.date);
    if (existing) {
      existing.revenue += curr.revenue;
      existing.spend += curr.spend;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as DailyData[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-[400px] w-full glass-card p-4 rounded-xl shadow-lg border border-white/10">
      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">Revenue vs Ad Spend Trend</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={aggregatedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.1} vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(str) => format(parseISO(str), 'MMM d')}
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickFormatter={(value) => `$${value/1000}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.8)', 
              backdropFilter: 'blur(8px)',
              borderColor: 'rgba(255,255,255,0.1)', 
              color: '#F3F4F6',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            itemStyle={{ color: '#F3F4F6' }}
            labelFormatter={(label) => format(parseISO(label), 'MMM d, yyyy')}
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            name="Revenue" 
            stroke="#22d3ee" 
            fill="url(#colorRevenue)" 
            strokeWidth={3}
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="spend" 
            name="Ad Spend" 
            stroke="#c084fc" 
            fill="url(#colorSpend)" 
            strokeWidth={3}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

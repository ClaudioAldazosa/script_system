'use client';

import { DailyData } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { format, parseISO } from "date-fns";

interface RevenueChartProps {
  data: DailyData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  
  // 1. AGREGACIÓN DE DATOS
  // Mapeamos los nombres raros de SQL (daily_revenue) a nombres limpios (revenue)
  // y sumamos si hay días repetidos.
  const aggregatedData = data.reduce((acc, curr) => {
    const existing = acc.find(d => d.graph_date === curr.graph_date);
    
    if (existing) {
      existing.revenue += curr.daily_revenue;
      existing.spend += curr.daily_ad_spend;
    } else {
      acc.push({ 
        graph_date: curr.graph_date,
        revenue: curr.daily_revenue,
        spend: curr.daily_ad_spend
      });
    }
    return acc;
  }, [] as any[]) // Usamos any[] temporalmente aquí para el acumulador interno mapeado
  .sort((a, b) => new Date(a.graph_date).getTime() - new Date(b.graph_date).getTime());

  return (
    <div className="h-[400px] w-full glass-card p-4 rounded-xl shadow-lg border border-white/10">
      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">
        Revenue vs Ad Spend Trend
      </h3>
      
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={aggregatedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
            dataKey="graph_date" // <--- CORREGIDO: Debe coincidir con tu dato (graph_date)
            tickFormatter={(str) => {
              try {
                return format(parseISO(str), 'MMM d');
              } catch {
                return str;
              }
            }}
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            minTickGap={30}
          />
          
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickFormatter={(value) => `$${value}`}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.9)', 
              backdropFilter: 'blur(8px)',
              borderColor: 'rgba(255,255,255,0.1)', 
              color: '#F3F4F6',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
            }}
            itemStyle={{ color: '#F3F4F6' }}
            labelFormatter={(label) => {
               try { return format(parseISO(label), 'MMM d, yyyy') } catch { return label }
            }}
            // SOLUCIÓN DEL ERROR TYPESCRIPT AQUÍ:
            // 1. Permitimos 'any' o 'number | string' en el argumento value.
            // 2. Usamos Number(value) para asegurar que sea numero antes de formatear.
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
          />
          
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Area 
            type="monotone" 
            dataKey="revenue" // Este nombre viene de tu aggregatedData
            name="Revenue" 
            stroke="#22d3ee" 
            fill="url(#colorRevenue)" 
            strokeWidth={3}
            animationDuration={1500}
          />
          
          <Area 
            type="monotone" 
            dataKey="spend" // Este nombre viene de tu aggregatedData
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
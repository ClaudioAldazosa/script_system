'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
  // Eliminamos TooltipProps de aquí para evitar el conflicto
} from 'recharts';
import { format } from 'date-fns';
import { useInsightsStore } from '@/store/useInsightsStore';
import { useEffect } from 'react';
import { Info, RefreshCw } from 'lucide-react';

interface ChartData {
  graph_date: string;
  daily_revenue: number;
  daily_ad_spend: number;
}

interface RevenueChartProps {
  data: ChartData[];
}

const currencyFormatter = (value: number) => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

/**
 * SOLUCIÓN DEL ERROR:
 * En lugar de usar el tipo genérico de Recharts que falla, definimos
 * manualmente lo que esperamos recibir.
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[]; // Usamos any[] aquí porque la estructura interna de Recharts es compleja
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border border-white/10 bg-black/80 p-4 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-gray-400 text-xs mb-2">
            {label ? format(new Date(label), 'EEEE, MMM d, yyyy') : ''}
        </p>
        <div className="space-y-1">
          <p className="text-sm font-bold text-cyan-400 flex items-center justify-between gap-4">
            <span>Revenue:</span>
            {/* payload[0].value es el valor del gráfico */}
            <span>{currencyFormatter(payload[0].value)}</span>
          </p>
          <p className="text-sm font-bold text-purple-400 flex items-center justify-between gap-4">
            <span>Ad Spend:</span>
            {/* payload[1].value es el segundo valor */}
            <span>{currencyFormatter(payload[1].value)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] w-full glass-card flex items-center justify-center text-gray-500">
        No data available for the selected period
      </div>
    );
  }

  return (
    <div className="h-[450px] w-full p-4 rounded-2xl glass-card border border-white/5 bg-black/20">
      <h3 className="text-lg font-medium text-white mb-6 ml-2">Revenue vs Ad Spend</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          
          <XAxis 
            dataKey="graph_date" 
            tickFormatter={(str) => {
                try {
                    return format(new Date(str), 'MMM d');
                } catch {
                    return str;
                }
            }}
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          
          <YAxis 
            tickFormatter={(value) => `$${value}`}
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" 
            dataKey="daily_revenue" 
            stroke="#22d3ee" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            name="Revenue"
            activeDot={{ r: 6, fill: "#22d3ee", stroke: "#fff" }}
          />
          
          <Area 
            type="monotone" 
            dataKey="daily_ad_spend" 
            stroke="#a855f7" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSpend)" 
            name="Ad Spend"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function InsightsPage() {
  // 3. Usamos el Hook del Store para obtener los datos y la función fetch
  const { dailyData, isLoading, error, fetchInsights } = useInsightsStore();

  // 4. useEffect dispara la carga de datos cuando entras a la página
  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  // Manejo de carga
  if (isLoading && dailyData.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
           <p className="text-gray-500 text-sm">Loading insights...</p>
        </div>
      </div>
    );
  }

  // Manejo de errores
  if (error) {
    return <div className="p-10 text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">
            Insights
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Performance analytics and attribution.
          </p>
        </div>
        
        <button 
            onClick={() => fetchInsights()}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-cyan-400"
        >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* 5. AQUÍ pasamos los datos del Store al Componente como 'props' */}
      <RevenueChart data={dailyData} />

      <div className="rounded-xl glass-card p-6 border border-blue-500/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-cyan-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-cyan-300">Attribution Logic</h3>
            <p className="mt-1 text-sm text-gray-400">
              Revenue is attributed to the most recent video posted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
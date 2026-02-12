import { useQuery } from "@tanstack/react-query";
import { DailyData } from "@/types";

async function fetchChartData(): Promise<DailyData[]> {
  try {
    const response = await fetch('/api/proxy/n8n/chart-data', { 
      method: 'POST', // <--- IMPORTANTE 
      headers: { 
        'Content-Type': 'application/json', 
      }, 
      body: JSON.stringify({ 
        // Aquí puedes enviar tus filtros en el futuro si quieres 
      }), 
    });

    if (!response.ok) {
      throw new Error(`Error fetching chart data: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error("Failed to fetch chart data:", error);
    return [];
  }
}

export function useInsightsData() {
  const { data: dailyData, isLoading } = useQuery({
    queryKey: ['daily-data'],
    queryFn: fetchChartData,
  });

  return {
    dailyData: dailyData ?? [],
    isLoading,
  };
}

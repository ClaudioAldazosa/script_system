import { useQuery } from "@tanstack/react-query";
import { fetchMockData, generateDailyData } from "@/lib/mock-data";

export function useInsightsData() {
  const { data: dailyData, isLoading } = useQuery({
    queryKey: ['daily-data'],
    queryFn: () => fetchMockData(generateDailyData(30)),
  });

  return {
    dailyData: dailyData ?? [],
    isLoading,
  };
}

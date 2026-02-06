import { useQuery } from "@tanstack/react-query";
import { 
  fetchMockData, 
  getFilteredInfluencers, 
  getFilteredScripts, 
  getFilteredKPI 
} from "@/lib/mock-data";
import { Platform } from "@/types";

export function useDashboardData(
  platform: Platform | 'all', 
  dateRange: { from: Date; to?: Date }
) {
  const queryTo = dateRange.to || dateRange.from;

  const { data: influencers, isLoading: isLoadingInfluencers } = useQuery({
    queryKey: ['influencers', dateRange.from, queryTo],
    queryFn: () => fetchMockData(getFilteredInfluencers(dateRange.from, queryTo)),
  });

  const { data: scripts, isLoading: isLoadingScripts } = useQuery({
    queryKey: ['scripts', dateRange.from, queryTo],
    queryFn: () => fetchMockData(getFilteredScripts(dateRange.from, queryTo)),
  });

  const { data: kpiData, isLoading: isLoadingKPI } = useQuery({
    queryKey: ['kpi', dateRange.from, queryTo],
    queryFn: () => fetchMockData(getFilteredKPI(dateRange.from, queryTo)),
  });

  // Filter logic
  const filteredInfluencers = influencers?.filter(inf => 
    platform === 'all' ? true : inf.platform === platform
  ) ?? [];

  // Recalculate KPI based on platform if 'all' or specific
  const currentKPI = kpiData ? kpiData[platform] : null;

  return {
    influencers: filteredInfluencers,
    scripts: scripts ?? [],
    kpi: currentKPI,
    allKPIs: kpiData,
    isLoading: isLoadingInfluencers || isLoadingScripts || isLoadingKPI,
  };
}

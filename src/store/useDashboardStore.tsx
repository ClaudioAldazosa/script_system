import { create } from 'zustand';
import { 
  fetchMockData, 
  getFilteredScripts 
} from "@/lib/mock-data";
import { Platform } from "@/types";

export interface Influencer {
  account: string;
  total_revenue: number;
  total_cost: number;
  avg_roi: number;
  roas: number;
  platform: Platform;
}

export interface KPI {
  total_gross_revenue: number;
  total_cost: number;
  global_roi_decimal: number;
  global_roas: number;
}

interface DashboardState {
  influencers: Influencer[];
  scripts: any[];
  kpiData: Record<Platform | 'all', KPI | null>; 
  isLoading: boolean;
  error: string | null;

  fetchDashboardData: (dateRange: { from: Date; to?: Date }) => Promise<void>;
}

const INITIAL_KPI_STATE = {
  tiktok: null,
  youtube: null,
  all: null
};

export const useDashboardStore = create<DashboardState>((set) => ({
  influencers: [],
  scripts: [],
  kpiData: INITIAL_KPI_STATE,
  isLoading: false,
  error: null,

  fetchDashboardData: async (dateRange) => {
    set({ isLoading: true, error: null });

    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dateRange),
      };

      const [tiktokKpiResponse, tiktokInfluencersResponse, scriptsData] = await Promise.all([
        fetch("https://n8n.aldazosa-n8n.xyz/webhook/tiktok/analytics", requestOptions),
        fetch("https://n8n.aldazosa-n8n.xyz/webhook/tiktok/best-performers", requestOptions),
        fetchMockData(getFilteredScripts(dateRange.from, dateRange.to || dateRange.from))
      ]);

      if (!tiktokKpiResponse.ok || !tiktokInfluencersResponse.ok) {
        throw new Error('Failed to fetch data from n8n webhooks');
      }

      const rawTiktokKpi = await tiktokKpiResponse.json();
      const rawTiktokInfluencers = await tiktokInfluencersResponse.json();

      const mappedInfluencers: Influencer[] = Array.isArray(rawTiktokInfluencers) 
        ? rawTiktokInfluencers.map((inf: any) => ({ ...inf, platform: 'tiktok' })) 
        : [];

      set((state) => ({
        kpiData: {
          ...state.kpiData,
          tiktok: rawTiktokKpi, 
          // TODO: Logic to aggregate 'all' - tiktok + youtube
          all: rawTiktokKpi // Temporary: mapping 'all' to tiktok
        },
        influencers: mappedInfluencers,
        scripts: scriptsData,
        isLoading: false,
      }));

    } catch (error) {
      console.error("Dashboard fetch error:", error);
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error', 
        isLoading: false 
      });
    }
  },
}));
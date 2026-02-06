export type Platform = 'tiktok' | 'youtube';

export interface Influencer {
  id: string;
  name: string;
  platform: Platform;
  totalRevenue: number;
  roas: number;
  roi: number;
  conversionRate: number;
  avatarUrl?: string;
  trend?: 'up' | 'down' | 'stable';
  productBreakdown?: { name: string; revenue: number }[];
}

export interface Script {
  id: string;
  name: string;
  revenue: number;
  roas: number;
  content: string; // For the editor
}

export interface KPI {
  revenue: number;
  roas: number;
  spend: number;
  conversions: number;
}

export interface DailyData {
  date: string;
  revenue: number;
  spend: number;
  roas: number;
  platform: Platform;
}

export interface AttributionData {
  videoId: string;
  videoTitle: string;
  publishDate: string;
  influencerName: string;
  revenue: number;
  spend: number;
  roas: number;
}

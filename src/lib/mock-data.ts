import { Influencer, KPI, Script, DailyData, Platform } from "@/types";
import { addDays, format, subDays, differenceInDays } from "date-fns";

const BASE_DAYS = 30;

export const MOCK_INFLUENCERS: Influencer[] = [
  { 
    id: '1', 
    name: 'Sarah Jenkins', 
    platform: 'tiktok', 
    totalRevenue: 15420, 
    roas: 3.2, 
    roi: 220,
    conversionRate: 0.045,
    trend: 'down',
    productBreakdown: [
      { name: 'Glow Serum', revenue: 12000 },
      { name: 'Face Mask', revenue: 3420 }
    ]
  },
  { 
    id: '2', 
    name: 'Tech Reviews Daily', 
    platform: 'youtube', 
    totalRevenue: 42100, 
    roas: 4.5, 
    roi: 350,
    conversionRate: 0.062,
    trend: 'up',
    productBreakdown: [
      { name: 'AI Tool Subscription', revenue: 38000 },
      { name: 'Keyboard', revenue: 4100 }
    ]
  },
  { 
    id: '3', 
    name: 'Mike Travels', 
    platform: 'tiktok', 
    totalRevenue: 8900, 
    roas: 2.1, 
    roi: 110,
    conversionRate: 0.028,
    trend: 'down',
    productBreakdown: [
      { name: 'Travel Bag', revenue: 4450 },
      { name: 'Power Bank', revenue: 4450 }
    ]
  },
  { 
    id: '4', 
    name: 'Beauty by Jessica', 
    platform: 'youtube', 
    totalRevenue: 28500, 
    roas: 3.8, 
    roi: 280,
    conversionRate: 0.051,
    trend: 'stable',
    productBreakdown: [
      { name: 'Lipstick Set', revenue: 25000 },
      { name: 'Eyeliner', revenue: 3500 }
    ]
  },
  { 
    id: '5', 
    name: 'Crypto King', 
    platform: 'tiktok', 
    totalRevenue: 5200, 
    roas: 1.5, 
    roi: 50,
    conversionRate: 0.012,
    trend: 'down',
    productBreakdown: [
      { name: 'Trading Course', revenue: 5200 }
    ]
  },
  { 
    id: '6', 
    name: 'Gaming Hub', 
    platform: 'youtube', 
    totalRevenue: 67000, 
    roas: 5.2, 
    roi: 420,
    conversionRate: 0.078,
    trend: 'up',
    productBreakdown: [
      { name: 'Gaming Mouse', revenue: 60000 },
      { name: 'Headset', revenue: 7000 }
    ]
  },
  { 
    id: '7', 
    name: 'Fitness 101', 
    platform: 'tiktok', 
    totalRevenue: 12300, 
    roas: 2.8, 
    roi: 180,
    conversionRate: 0.035,
    trend: 'stable',
    productBreakdown: [
      { name: 'Protein Powder', revenue: 10000 },
      { name: 'Shaker Bottle', revenue: 2300 }
    ]
  },
  { 
    id: '8', 
    name: 'Cooking with Sam', 
    platform: 'youtube', 
    totalRevenue: 31200, 
    roas: 4.1, 
    roi: 310,
    conversionRate: 0.055,
    trend: 'up',
    productBreakdown: [
      { name: 'Knife Set', revenue: 28000 },
      { name: 'Apron', revenue: 3200 }
    ]
  },
];

export const MOCK_SCRIPTS: Script[] = [
  { id: 's1', name: 'Hook - Problem/Solution A', revenue: 25000, roas: 4.2, content: "Do you struggle with X? Here is the solution..." },
  { id: 's2', name: 'Storytelling - Founder Journey', revenue: 18000, roas: 3.5, content: "I started this company because..." },
  { id: 's3', name: 'UGC Style - Testimonial', revenue: 12000, roas: 2.8, content: "I cant believe how good this is..." },
  { id: 's4', name: 'Educational - How To', revenue: 35000, roas: 5.1, content: "Here is how to use our product in 3 steps..." },
  { id: 's5', name: 'Direct Response - Sale', revenue: 45000, roas: 3.9, content: "50% off for the next 24 hours..." },
];

export const MOCK_KPI: Record<Platform | 'all', KPI> = {
  all: { revenue: 210620, roas: 3.8, spend: 55426, conversions: 4212 },
  tiktok: { revenue: 41820, roas: 2.5, spend: 16728, conversions: 1254 },
  youtube: { revenue: 168800, roas: 4.4, spend: 38363, conversions: 2958 },
};

// Helper to scale values based on date range
const getScaleFactor = (start: Date, end: Date) => {
  const days = Math.abs(differenceInDays(end, start)) + 1;
  // Add some randomness so it's not perfectly linear
  const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
  return (days / BASE_DAYS) * randomFactor;
};

export const getFilteredInfluencers = (start: Date, end: Date): Influencer[] => {
  const scale = getScaleFactor(start, end);
  return MOCK_INFLUENCERS.map(inf => {
    const newRoas = parseFloat((inf.roas * (0.9 + Math.random() * 0.2)).toFixed(2));
    return {
      ...inf,
      totalRevenue: Math.floor(inf.totalRevenue * scale),
      // ROAS and Conversion Rate might fluctuate slightly but not scale linearly with time
      roas: newRoas,
      roi: Math.round((newRoas - 1) * 100),
      conversionRate: parseFloat((inf.conversionRate * (0.9 + Math.random() * 0.2)).toFixed(3)),
      productBreakdown: inf.productBreakdown?.map(p => ({
        ...p,
        revenue: Math.floor(p.revenue * scale)
      }))
    };
  });
};

export const getFilteredScripts = (start: Date, end: Date): Script[] => {
  const scale = getScaleFactor(start, end);
  return MOCK_SCRIPTS.map(script => ({
    ...script,
    revenue: Math.floor(script.revenue * scale),
    roas: parseFloat((script.roas * (0.9 + Math.random() * 0.2)).toFixed(2)),
  }));
};

export const getFilteredKPI = (start: Date, end: Date): Record<Platform | 'all', KPI> => {
  const scale = getScaleFactor(start, end);
  const scaleKPI = (kpi: KPI): KPI => ({
    revenue: Math.floor(kpi.revenue * scale),
    spend: Math.floor(kpi.spend * scale),
    conversions: Math.floor(kpi.conversions * scale),
    roas: parseFloat((kpi.roas * (0.95 + Math.random() * 0.1)).toFixed(2)), // ROAS stays relatively stable
  });

  return {
    all: scaleKPI(MOCK_KPI.all),
    tiktok: scaleKPI(MOCK_KPI.tiktok),
    youtube: scaleKPI(MOCK_KPI.youtube),
  };
};

export const generateDailyData = (days: number = 30): DailyData[] => {
  const data: DailyData[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Randomize some data
    const tiktokSpend = Math.floor(Math.random() * 1000) + 500;
    const youtubeSpend = Math.floor(Math.random() * 2000) + 1000;
    
    const tiktokRev = tiktokSpend * (Math.random() * 2 + 1.5); // ROAS 1.5 - 3.5
    const youtubeRev = youtubeSpend * (Math.random() * 3 + 2.5); // ROAS 2.5 - 5.5

    data.push({
      date: dateStr,
      platform: 'tiktok',
      spend: tiktokSpend,
      revenue: Math.floor(tiktokRev),
      roas: parseFloat((tiktokRev / tiktokSpend).toFixed(2)),
    });

    data.push({
      date: dateStr,
      platform: 'youtube',
      spend: youtubeSpend,
      revenue: Math.floor(youtubeRev),
      roas: parseFloat((youtubeRev / youtubeSpend).toFixed(2)),
    });
  }
  return data;
};

// Simulate API delay
export const fetchMockData = async <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

import { Script } from "@/types";
import { differenceInDays } from "date-fns";

const BASE_DAYS = 30;

export const MOCK_SCRIPTS: Script[] = [
  { id: 's1', name: 'Hook - Problem/Solution A', revenue: 25000, roas: 4.2, content: "Do you struggle with X? Here is the solution..." },
  { id: 's2', name: 'Storytelling - Founder Journey', revenue: 18000, roas: 3.5, content: "I started this company because..." },
  { id: 's3', name: 'UGC Style - Testimonial', revenue: 12000, roas: 2.8, content: "I cant believe how good this is..." },
  { id: 's4', name: 'Educational - How To', revenue: 35000, roas: 5.1, content: "Here is how to use our product in 3 steps..." },
  { id: 's5', name: 'Direct Response - Sale', revenue: 45000, roas: 3.9, content: "50% off for the next 24 hours..." },
];

// Helper to scale values based on date range
const getScaleFactor = (start: Date, end: Date) => {
  const days = Math.abs(differenceInDays(end, start)) + 1;
  // Add some randomness so it's not perfectly linear
  const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
  return (days / BASE_DAYS) * randomFactor;
};

export const getFilteredScripts = (start: Date, end: Date): Script[] => {
  const scale = getScaleFactor(start, end);
  return MOCK_SCRIPTS.map(script => ({
    ...script,
    revenue: Math.floor(script.revenue * scale),
    roas: parseFloat((script.roas * (0.9 + Math.random() * 0.2)).toFixed(2)),
  }));
};

// Simulate API delay
export const fetchMockData = async <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};
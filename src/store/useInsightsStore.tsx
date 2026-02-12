import { create } from 'zustand';
// 1. IMPORTA el tipo desde tu archivo de tipos compartido
import { DailyData } from '@/types'; 

interface InsightsState {
  dailyData: DailyData[]; // Ahora usa la definición completa
  isLoading: boolean;
  error: string | null;
  fetchInsights: () => Promise<void>;
}

export const useInsightsStore = create<InsightsState>((set) => ({
  dailyData: [],
  isLoading: false,
  error: null,

  fetchInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('https://n8n.aldazosa-n8n.xyz/webhook/chart-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(response.statusText);
      
      const data = await response.json();
      
      // Ya no necesitas .sort() ni validaciones complejas
      // El backend garantiza el orden y los ceros.
      set({ dailyData: data, isLoading: false }); 
      
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
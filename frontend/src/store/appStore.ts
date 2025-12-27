import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  selectedCity: string | null;
  theme: 'light' | 'dark' | 'auto';
  recentCities: string[];
  setSelectedCity: (city: string | null) => void;
  addRecentCity: (city: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedCity: null,
      theme: 'auto',
      recentCities: [],
      setSelectedCity: (city) => set({ selectedCity: city }),
      addRecentCity: (city) =>
        set((state) => {
          const filtered = state.recentCities.filter((c) => c !== city);
          return { recentCities: [city, ...filtered].slice(0, 5) };
        }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'weather-app-storage',
    }
  )
);

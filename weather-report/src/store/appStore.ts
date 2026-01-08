import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  selectedCity: string | null;
  theme: 'light' | 'dark' | 'auto';
  recentCities: string[];
  unavailableCities: string[];
  setSelectedCity: (city: string | null) => void;
  addRecentCity: (city: string) => void;
  addUnavailableCity: (city: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedCity: null,
      theme: 'auto',
      recentCities: [],
      unavailableCities: [],
      setSelectedCity: (city) => set({ selectedCity: city }),
      addRecentCity: (city) =>
        set((state) => {
          const filtered = state.recentCities.filter((c) => c !== city);
          return { recentCities: [city, ...filtered].slice(0, 5) };
        }),
      addUnavailableCity: (city) =>
        set((state) => {
          if (state.unavailableCities.includes(city)) {
            return state;
          }
          return {
            unavailableCities: [...state.unavailableCities, city],
            // Remove from recent cities if it's there
            recentCities: state.recentCities.filter((c) => c !== city),
          };
        }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'weather-app-storage',
    }
  )
);

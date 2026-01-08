import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CityAvailability {
  status: 'preparing' | 'available';
  timestamp?: string; // When it became available
}

interface AppState {
  selectedCity: string | null;
  theme: 'light' | 'dark' | 'auto';
  recentCities: string[];
  unavailableCities: string[];
  cityAvailability: Record<string, CityAvailability>; // Track city preparation status
  setSelectedCity: (city: string | null) => void;
  addRecentCity: (city: string) => void;
  addUnavailableCity: (city: string) => void;
  markCityAsAvailable: (city: string, timestamp: string) => void;
  getCityStatus: (city: string) => CityAvailability | null;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedCity: null,
      theme: 'auto',
      recentCities: [],
      unavailableCities: [],
      cityAvailability: {},
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
            cityAvailability: {
              ...state.cityAvailability,
              [city]: { status: 'preparing' },
            },
            // Keep in recent cities so user can see it's being prepared
          };
        }),
      markCityAsAvailable: (city, timestamp) =>
        set((state) => {
          return {
            unavailableCities: state.unavailableCities.filter((c) => c !== city),
            cityAvailability: {
              ...state.cityAvailability,
              [city]: { status: 'available', timestamp },
            },
          };
        }),
      getCityStatus: (city) => {
        return get().cityAvailability[city] || null;
      },
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'weather-app-storage',
    }
  )
);

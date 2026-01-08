import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CityAvailability {
  status: 'preparing' | 'available';
  timestamp?: string; // When it became available
}

interface AppState {
  selectedCity: string | null;
  theme: 'light' | 'dark' | 'auto';
  unavailableCities: string[];
  cityAvailability: Record<string, CityAvailability>; // Track city preparation status
  setSelectedCity: (city: string | null) => void;
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
      unavailableCities: [],
      cityAvailability: {},
      setSelectedCity: (city) => set({ selectedCity: city }),
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

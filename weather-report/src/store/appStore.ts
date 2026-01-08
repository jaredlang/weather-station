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
  removeCity: (city: string) => void;
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
          if (state.unavailableCities.some((c) => c.toLowerCase() === city.toLowerCase())) {
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
            unavailableCities: state.unavailableCities.filter((c) => c.toLowerCase() !== city.toLowerCase()),
            cityAvailability: {
              ...state.cityAvailability,
              [city]: { status: 'available', timestamp },
            },
          };
        }),
      removeCity: (city) =>
        set((state) => {
          const newAvailability = { ...state.cityAvailability };
          // Case-insensitive deletion
          const keyToDelete = Object.keys(newAvailability).find(
            (k) => k.toLowerCase() === city.toLowerCase()
          );
          if (keyToDelete) {
            delete newAvailability[keyToDelete];
          }
          return {
            unavailableCities: state.unavailableCities.filter((c) => c.toLowerCase() !== city.toLowerCase()),
            cityAvailability: newAvailability,
            selectedCity: state.selectedCity?.toLowerCase() === city.toLowerCase() ? null : state.selectedCity,
          };
        }),
      getCityStatus: (city) => {
        const availability = get().cityAvailability;
        // Case-insensitive lookup
        const key = Object.keys(availability).find(
          (k) => k.toLowerCase() === city.toLowerCase()
        );
        return key ? availability[key] : null;
      },
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'weather-app-storage',
    }
  )
);

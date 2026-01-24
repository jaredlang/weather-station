import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CityAvailability {
  status: 'preparing' | 'available';
  timestamp?: string; // When it became available
}

export interface SubredditAvailability {
  status: 'preparing' | 'available';
  timestamp?: string; // When it became available
}

export type ActiveTab = 'weather' | 'news';

interface AppState {
  // Tab navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Weather state
  selectedCity: string | null;
  unavailableCities: string[];
  hiddenCities: string[]; // Cities user has explicitly hidden/deleted
  cityAvailability: Record<string, CityAvailability>; // Track city preparation status
  setSelectedCity: (city: string | null) => void;
  addUnavailableCity: (city: string) => void;
  markCityAsAvailable: (city: string, timestamp: string) => void;
  removeCity: (city: string) => void;
  getCityStatus: (city: string) => CityAvailability | null;

  // News state
  selectedSubreddit: string | null;
  unavailableSubreddits: string[];
  hiddenSubreddits: string[]; // Subreddits user has explicitly hidden/deleted
  subredditAvailability: Record<string, SubredditAvailability>; // Track subreddit preparation status
  setSelectedSubreddit: (subreddit: string | null) => void;
  addUnavailableSubreddit: (subreddit: string) => void;
  markSubredditAsAvailable: (subreddit: string, timestamp: string) => void;
  removeSubreddit: (subreddit: string) => void;
  getSubredditStatus: (subreddit: string) => SubredditAvailability | null;

  // Theme
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Tab navigation
      activeTab: 'weather',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Weather state
      selectedCity: null,
      unavailableCities: [],
      hiddenCities: [],
      cityAvailability: {},
      setSelectedCity: (city) => set({ selectedCity: city }),
      addUnavailableCity: (city) =>
        set((state) => {
          if (state.unavailableCities.some((c) => c.toLowerCase() === city.toLowerCase())) {
            return state;
          }
          return {
            unavailableCities: [...state.unavailableCities, city],
            hiddenCities: state.hiddenCities.filter((c) => c.toLowerCase() !== city.toLowerCase()),
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

          // Add to hiddenCities if not already there
          const isAlreadyHidden = state.hiddenCities.some(
            (c) => c.toLowerCase() === city.toLowerCase()
          );

          return {
            unavailableCities: state.unavailableCities.filter((c) => c.toLowerCase() !== city.toLowerCase()),
            hiddenCities: isAlreadyHidden ? state.hiddenCities : [...state.hiddenCities, city],
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

      // News state
      selectedSubreddit: null,
      unavailableSubreddits: [],
      hiddenSubreddits: [],
      subredditAvailability: {},
      setSelectedSubreddit: (subreddit) => set({ selectedSubreddit: subreddit }),
      addUnavailableSubreddit: (subreddit) =>
        set((state) => {
          if (state.unavailableSubreddits.some((s) => s.toLowerCase() === subreddit.toLowerCase())) {
            return state;
          }
          return {
            unavailableSubreddits: [...state.unavailableSubreddits, subreddit],
            hiddenSubreddits: state.hiddenSubreddits.filter((s) => s.toLowerCase() !== subreddit.toLowerCase()),
            subredditAvailability: {
              ...state.subredditAvailability,
              [subreddit]: { status: 'preparing' },
            },
          };
        }),
      markSubredditAsAvailable: (subreddit, timestamp) =>
        set((state) => {
          return {
            unavailableSubreddits: state.unavailableSubreddits.filter((s) => s.toLowerCase() !== subreddit.toLowerCase()),
            subredditAvailability: {
              ...state.subredditAvailability,
              [subreddit]: { status: 'available', timestamp },
            },
          };
        }),
      removeSubreddit: (subreddit) =>
        set((state) => {
          const newAvailability = { ...state.subredditAvailability };
          // Case-insensitive deletion
          const keyToDelete = Object.keys(newAvailability).find(
            (k) => k.toLowerCase() === subreddit.toLowerCase()
          );
          if (keyToDelete) {
            delete newAvailability[keyToDelete];
          }

          // Add to hiddenSubreddits if not already there
          const isAlreadyHidden = state.hiddenSubreddits.some(
            (s) => s.toLowerCase() === subreddit.toLowerCase()
          );

          return {
            unavailableSubreddits: state.unavailableSubreddits.filter((s) => s.toLowerCase() !== subreddit.toLowerCase()),
            hiddenSubreddits: isAlreadyHidden ? state.hiddenSubreddits : [...state.hiddenSubreddits, subreddit],
            subredditAvailability: newAvailability,
            selectedSubreddit: state.selectedSubreddit?.toLowerCase() === subreddit.toLowerCase() ? null : state.selectedSubreddit,
          };
        }),
      getSubredditStatus: (subreddit) => {
        const availability = get().subredditAvailability;
        // Case-insensitive lookup
        const key = Object.keys(availability).find(
          (k) => k.toLowerCase() === subreddit.toLowerCase()
        );
        return key ? availability[key] : null;
      },

      // Theme
      theme: 'auto',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'weather-app-storage',
    }
  )
);

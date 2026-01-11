import { useQueries } from '@tanstack/react-query';
import { getLatestForecast } from '@/api/weather.api';
import { queryKeys } from '@/api/queryKeys';
import { config } from '@/utils/config';
import { useAppStore } from '@/store/appStore';

export interface CityWeatherState {
  city: string;
  pictureUrl?: string;
  status: 'available' | 'preparing' | 'loading';
}

export const useMultiCityWeather = (cities: string[]): {
  data: CityWeatherState[];
  isLoading: boolean;
} => {
  const cityAvailability = useAppStore((state) => state.cityAvailability);

  // Helper to check if a city is marked as preparing (case-insensitive)
  const isCityPreparing = (city: string): boolean => {
    const key = Object.keys(cityAvailability).find(
      (k) => k.toLowerCase() === city.toLowerCase()
    );
    return key ? cityAvailability[key].status === 'preparing' : false;
  };

  const weatherQueries = useQueries({
    queries: cities.map((city) => ({
      queryKey: queryKeys.weather.city(city),
      queryFn: () => getLatestForecast(city),
      staleTime: config.cacheDuration,
      retry: false,
      // Don't query cities that are already marked as preparing
      enabled: !!city && !isCityPreparing(city),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  });

  const data: CityWeatherState[] = cities.map((city, index) => {
    const query = weatherQueries[index];

    if (isCityPreparing(city)) {
      return { city, status: 'preparing' };
    }

    if (query.isLoading) {
      return { city, status: 'loading' };
    }

    if (query.isError) {
      // 404 means forecast not found - city is being prepared
      return { city, status: 'preparing' };
    }

    if (query.data) {
      return {
        city,
        pictureUrl: query.data.forecast.picture_url,
        status: 'available',
      };
    }

    return { city, status: 'loading' };
  });

  const isLoading = weatherQueries.some((q) => q.isLoading);

  return { data, isLoading };
};

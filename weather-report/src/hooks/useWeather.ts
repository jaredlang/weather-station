import { useQuery } from '@tanstack/react-query';
import { getLatestForecast } from '@/api/weather.api';
import { queryKeys } from '@/api/queryKeys';
import { config } from '@/utils/config';

export const useWeather = (city: string | null, language?: string) => {
  return useQuery({
    queryKey: queryKeys.weather.city(city || '', language),
    queryFn: () => getLatestForecast(city!, language),
    enabled: !!city,
    staleTime: config.cacheDuration,
    retry: false, // No retry - backend starts preparing forecast on first request
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

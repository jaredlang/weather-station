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
    retry: 1,
    retryDelay: config.retryDelay,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

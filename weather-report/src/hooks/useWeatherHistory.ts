import { useQuery } from '@tanstack/react-query';
import { getForecastHistory } from '@/api/weather.api';
import { queryKeys } from '@/api/queryKeys';

export const useWeatherHistory = (
  city: string | null,
  limit: number = 10,
  includeExpired: boolean = false
) => {
  return useQuery({
    queryKey: queryKeys.weather.history(city || '', limit, includeExpired),
    queryFn: () => getForecastHistory(city!, limit, includeExpired),
    enabled: !!city,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

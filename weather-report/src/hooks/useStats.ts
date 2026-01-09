import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/api/stats.api';
import { queryKeys } from '@/api/queryKeys';

export const useStats = () => {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: getStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    refetchIntervalInBackground: true, // Continue polling even when tab is not focused
  });
};

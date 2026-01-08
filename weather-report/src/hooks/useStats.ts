import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/api/stats.api';
import { queryKeys } from '@/api/queryKeys';

export const useStats = () => {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: getStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/api/stats.api';
import { queryKeys } from '@/api/queryKeys';

export const useStats = () => {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

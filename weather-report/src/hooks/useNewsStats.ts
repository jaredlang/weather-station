import { useQuery } from '@tanstack/react-query';
import { getNewsStats } from '@/api/news.api';
import { queryKeys } from '@/api/queryKeys';

export const useNewsStats = () => {
  return useQuery({
    queryKey: queryKeys.newsStats,
    queryFn: getNewsStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    refetchIntervalInBackground: true, // Continue polling even when tab is not focused
  });
};

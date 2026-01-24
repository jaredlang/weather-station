import { useQuery } from '@tanstack/react-query';
import { getLatestNews } from '@/api/news.api';
import { queryKeys } from '@/api/queryKeys';
import { config } from '@/utils/config';

export const useNews = (
  subreddit: string | null,
  reportType?: string,
  language?: string
) => {
  return useQuery({
    queryKey: queryKeys.news.subreddit(subreddit || '', reportType, language),
    queryFn: () => getLatestNews(subreddit!, reportType, language),
    enabled: !!subreddit,
    staleTime: config.cacheDuration,
    retry: false, // No retry - backend starts preparing news on first request
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

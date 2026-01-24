import { useQueries } from '@tanstack/react-query';
import { getLatestNews } from '@/api/news.api';
import { queryKeys } from '@/api/queryKeys';
import { config } from '@/utils/config';
import { useAppStore } from '@/store/appStore';

export interface SubredditNewsState {
  subreddit: string;
  title?: string;
  imageUrl?: string;
  status: 'available' | 'preparing' | 'loading';
}

export const useMultiSubredditNews = (subreddits: string[]): {
  data: SubredditNewsState[];
  isLoading: boolean;
} => {
  const subredditAvailability = useAppStore((state) => state.subredditAvailability);

  // Helper to check if a subreddit is marked as preparing (case-insensitive)
  const isSubredditPreparing = (subreddit: string): boolean => {
    const key = Object.keys(subredditAvailability).find(
      (k) => k.toLowerCase() === subreddit.toLowerCase()
    );
    return key ? subredditAvailability[key].status === 'preparing' : false;
  };

  const newsQueries = useQueries({
    queries: subreddits.map((subreddit) => ({
      queryKey: queryKeys.news.subreddit(subreddit),
      queryFn: () => getLatestNews(subreddit),
      staleTime: config.cacheDuration,
      retry: false,
      // Don't query subreddits that are already marked as preparing
      enabled: !!subreddit && !isSubredditPreparing(subreddit),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  });

  const data: SubredditNewsState[] = subreddits.map((subreddit, index) => {
    const query = newsQueries[index];

    if (isSubredditPreparing(subreddit)) {
      return { subreddit, status: 'preparing' };
    }

    if (query.isLoading) {
      return { subreddit, status: 'loading' };
    }

    if (query.isError) {
      // 404 means news not found - subreddit is being prepared
      return { subreddit, status: 'preparing' };
    }

    if (query.data) {
      return {
        subreddit,
        title: query.data.news.title,
        imageUrl: query.data.news.image_url,
        status: 'available',
      };
    }

    return { subreddit, status: 'loading' };
  });

  const isLoading = newsQueries.some((q) => q.isLoading);

  return { data, isLoading };
};

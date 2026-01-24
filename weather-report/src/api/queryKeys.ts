export const queryKeys = {
  weather: {
    all: ['weather'] as const,
    city: (city: string, language?: string) =>
      ['weather', city, language] as const,
    history: (city: string, limit: number, includeExpired: boolean) =>
      ['weather', city, 'history', limit, includeExpired] as const,
  },
  news: {
    all: ['news'] as const,
    subreddit: (subreddit: string, reportType?: string, language?: string) =>
      ['news', subreddit, reportType, language] as const,
    history: (subreddit: string, limit: number, includeExpired: boolean) =>
      ['news', subreddit, 'history', limit, includeExpired] as const,
    byId: (id: string) => ['news', 'id', id] as const,
    search: (query: string) => ['news', 'search', query] as const,
  },
  stats: ['stats'] as const,
  newsStats: ['newsStats'] as const,
  health: ['health'] as const,
};

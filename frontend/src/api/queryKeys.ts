export const queryKeys = {
  weather: {
    all: ['weather'] as const,
    city: (city: string, language?: string) =>
      ['weather', city, language] as const,
    history: (city: string, limit: number, includeExpired: boolean) =>
      ['weather', city, 'history', limit, includeExpired] as const,
  },
  stats: ['stats'] as const,
  health: ['health'] as const,
};

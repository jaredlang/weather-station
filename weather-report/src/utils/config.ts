/**
 * Application configuration from environment variables
 */

/**
 * Parse seconds from environment variable and convert to milliseconds
 * @param value - Environment variable value in seconds
 * @param defaultSeconds - Default value in seconds
 * @returns Milliseconds value
 */
const parseSeconds = (value: string | undefined, defaultSeconds: number): number => {
  if (!value) return defaultSeconds * 1000;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultSeconds * 1000 : parsed * 1000;
};

/**
 * Build Weather API base URL from host and port environment variables
 */
const getApiBaseUrl = (): string => {
  // First try the full URL if provided
  if (import.meta.env.VITE_WEATHER_API_BASE_URL) {
    return import.meta.env.VITE_WEATHER_API_BASE_URL;
  }

  // Otherwise construct from host and port
  const apiHost = import.meta.env.VITE_WEATHER_API_HOST || 'localhost';
  const apiPort = import.meta.env.VITE_WEATHER_API_PORT || '8200';
  return `http://${apiHost}:${apiPort}`;
};

/**
 * Build News API base URL from host and port environment variables
 */
const getNewsApiBaseUrl = (): string => {
  // First try the full URL if provided
  if (import.meta.env.VITE_NEWS_API_BASE_URL) {
    return import.meta.env.VITE_NEWS_API_BASE_URL;
  }

  // Otherwise construct from host and port
  const apiHost = import.meta.env.VITE_NEWS_API_HOST || 'localhost';
  const apiPort = import.meta.env.VITE_NEWS_API_PORT || '8300';
  return `http://${apiHost}:${apiPort}`;
};

export const config = {
  /** Weather API base URL */
  apiBaseUrl: getApiBaseUrl(),

  /** News API base URL */
  newsApiBaseUrl: getNewsApiBaseUrl(),

  /** Default city to select */
  defaultCity: import.meta.env.VITE_DEFAULT_CITY || 'Seattle',

  /** Cache duration in milliseconds (how long data stays fresh) */
  cacheDuration: parseSeconds(
    import.meta.env.VITE_REPORT_CACHE_DURATION,
    120 // 2 minutes default (in seconds)
  ),

  /** Retry delay in milliseconds (how long to wait before retrying) */
  retryDelay: parseSeconds(
    import.meta.env.VITE_REPORT_RETRY_DELAY,
    120 // 2 minutes default (in seconds)
  ),
} as const;

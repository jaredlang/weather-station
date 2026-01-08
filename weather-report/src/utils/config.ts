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

export const config = {
  /** API base URL */
  apiBaseUrl: import.meta.env.VITE_API_SERVICE_BASE_URL || 'http://localhost:8000',

  /** Default city to select */
  defaultCity: import.meta.env.VITE_DEFAULT_CITY || 'Seattle',

  /** Cache duration in milliseconds (how long data stays fresh) */
  cacheDuration: parseSeconds(
    import.meta.env.VITE_FORECAST_CACHE_DURATION,
    120 // 2 minutes default (in seconds)
  ),

  /** Retry delay in milliseconds (how long to wait before retrying) */
  retryDelay: parseSeconds(
    import.meta.env.VITE_FORECAST_RETRY_DELAY,
    120 // 2 minutes default (in seconds)
  ),
} as const;

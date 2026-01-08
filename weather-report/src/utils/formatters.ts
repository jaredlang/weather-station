import { formatDistance } from 'date-fns';

/**
 * Calculates and formats the age of a forecast
 * @param forecastAt - ISO 8601 timestamp when forecast was made
 * @returns Human-readable age string (e.g., "5m ago", "2h ago")
 */
export const calculateForecastAge = (forecastAt: string): string => {
  const now = new Date();
  const forecast = new Date(forecastAt);
  const diffMs = now.getTime() - forecast.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return formatDistance(forecast, now, { addSuffix: true });
};

/**
 * Formats a duration in seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted time string (e.g., "03:45")
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formats bytes to human-readable size
 * @param bytes - Size in bytes
 * @returns Formatted size string (e.g., "1.5 MB")
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Formats a city name to Title Case (Camel Case)
 * @param city - City name in any case
 * @returns Formatted city name in Title Case (e.g., "New York", "San Francisco")
 */
export const formatCityName = (city: string): string => {
  if (!city) return '';

  return city
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats a timestamp to a short readable format
 * @param timestamp - ISO 8601 timestamp
 * @returns Short formatted timestamp (e.g., "2:30pm", "Jan 7")
 */
export const formatShortTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    // Show time if today
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes}${ampm}`;
  } else {
    // Show date if not today
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  }
};

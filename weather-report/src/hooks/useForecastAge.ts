import { useState, useEffect } from 'react';
import { calculateForecastAge } from '@/utils/formatters';
import { config } from '@/utils/config';

export const useForecastAge = (forecastAt: string) => {
  const [age, setAge] = useState(() => calculateForecastAge(forecastAt));

  useEffect(() => {
    // Update immediately
    setAge(calculateForecastAge(forecastAt));

    // Then update based on cache duration interval
    const interval = setInterval(() => {
      setAge(calculateForecastAge(forecastAt));
    }, config.cacheDuration);

    return () => clearInterval(interval);
  }, [forecastAt]);

  return age;
};

/**
 * Hook to check if forecast is fresh (less than 5 minutes old)
 */
export const useIsForecastFresh = (forecastAt: string): boolean => {
  const [isFresh, setIsFresh] = useState(() => {
    const now = new Date();
    const forecast = new Date(forecastAt);
    const diffMinutes = Math.floor((now.getTime() - forecast.getTime()) / 60000);
    return diffMinutes < 5;
  });

  useEffect(() => {
    const checkFreshness = () => {
      const now = new Date();
      const forecast = new Date(forecastAt);
      const diffMinutes = Math.floor((now.getTime() - forecast.getTime()) / 60000);
      setIsFresh(diffMinutes < 5);
    };

    // Check immediately
    checkFreshness();

    // Then check every minute to update freshness status
    const interval = setInterval(checkFreshness, 60000);

    return () => clearInterval(interval);
  }, [forecastAt]);

  return isFresh;
};

import { useState, useEffect } from 'react';
import { calculateForecastAge } from '@/utils/formatters';

export const useForecastAge = (forecastAt: string) => {
  const [age, setAge] = useState(() => calculateForecastAge(forecastAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(calculateForecastAge(forecastAt));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [forecastAt]);

  return age;
};

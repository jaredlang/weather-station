import { useEffect, useState } from 'react';
import { calculateForecastAge } from '@/utils/formatters';

interface NewsAgeBadgeProps {
  publishedAt: string;
}

export const NewsAgeBadge = ({ publishedAt }: NewsAgeBadgeProps) => {
  const [age, setAge] = useState(() => calculateForecastAge(publishedAt));

  useEffect(() => {
    // Update age every minute
    const interval = setInterval(() => {
      setAge(calculateForecastAge(publishedAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [publishedAt]);

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
      {age}
    </span>
  );
};

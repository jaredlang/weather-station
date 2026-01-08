import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useForecastAge, useIsForecastFresh } from '@/hooks/useForecastAge';

interface ForecastAgeBadgeProps {
  forecastAt: string;
}

export const ForecastAgeBadge = ({ forecastAt }: ForecastAgeBadgeProps) => {
  const age = useForecastAge(forecastAt);
  const isFresh = useIsForecastFresh(forecastAt);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-apple-blue/10 dark:bg-apple-darkblue/10 text-apple-blue dark:text-apple-darkblue font-medium text-xs"
    >
      {/* Pulse animation for fresh forecasts */}
      {isFresh && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-apple-blue/20 dark:bg-apple-darkblue/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-apple-blue/20 dark:bg-apple-darkblue/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </>
      )}

      {/* Content */}
      <ClockIcon className="h-3.5 w-3.5 relative z-10" />
      <span className="relative z-10">{age}</span>

      {/* Fresh indicator dot */}
      {isFresh && (
        <motion.div
          className="relative z-10 h-1.5 w-1.5 rounded-full bg-green-500"
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
};

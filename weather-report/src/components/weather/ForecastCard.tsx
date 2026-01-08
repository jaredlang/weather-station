import { motion } from 'framer-motion';
import type { ForecastData } from '@/api/types';
import { AudioPlayer } from './AudioPlayer';
import { TranscriptDisplay } from './TranscriptDisplay';
import { ForecastAgeBadge } from './ForecastAgeBadge';
import { formatBytes, formatCityName } from '@/utils/formatters';

interface ForecastCardProps {
  forecast: ForecastData;
  city: string;
}

export const ForecastCard = ({ forecast, city }: ForecastCardProps) => {
  const audioSize = forecast.metadata.sizes.audio_base64 || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-apple-dark dark:text-apple-light">
            {formatCityName(city)}
          </h2>
          <ForecastAgeBadge forecastAt={forecast.forecast_at} />
        </div>

        {/* Audio Player */}
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
          <AudioPlayer audioBase64={forecast.audio_base64} />
        </div>

        {/* Transcript */}
        <TranscriptDisplay text={forecast.text} />

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-xs text-apple-gray pt-4 border-t border-gray-200 dark:border-gray-700">
          {forecast.metadata.language && (
            <div>
              <span className="font-medium">Language:</span>{' '}
              {forecast.metadata.language.toUpperCase()}
            </div>
          )}
          {forecast.metadata.encoding && (
            <div>
              <span className="font-medium">Encoding:</span>{' '}
              {forecast.metadata.encoding}
            </div>
          )}
          {audioSize > 0 && (
            <div>
              <span className="font-medium">Audio Size:</span>{' '}
              {formatBytes(audioSize)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

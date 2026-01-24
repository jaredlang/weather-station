import { motion } from 'framer-motion';
import type { NewsData } from '@/api/types';
import { UrlAudioPlayer } from './UrlAudioPlayer';
import { ContentDisplay } from './ContentDisplay';
import { NewsAgeBadge } from './NewsAgeBadge';
import { formatBytes, formatSubredditName } from '@/utils/formatters';

interface NewsCardProps {
  news: NewsData;
  subreddit: string;
}

export const NewsCard = ({ news, subreddit }: NewsCardProps) => {
  const audioSize = news.metadata.sizes.audio || 0;

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
            {formatSubredditName(subreddit)}
          </h2>
          <NewsAgeBadge publishedAt={news.published_at} />
        </div>

        {/* Audio Player */}
        {news.audio_url && (
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6">
            <UrlAudioPlayer audioUrl={news.audio_url} />
          </div>
        )}

        {/* Content */}
        <ContentDisplay text={news.content} title="News Report" />

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-xs text-apple-gray pt-4 border-t border-gray-200 dark:border-gray-700">
          {news.source && (
            <div>
              <span className="font-medium">Source:</span> {news.source}
            </div>
          )}
          {news.metadata.language && (
            <div>
              <span className="font-medium">Language:</span>{' '}
              {news.metadata.language.toUpperCase()}
            </div>
          )}
          {news.metadata.encoding && (
            <div>
              <span className="font-medium">Encoding:</span>{' '}
              {news.metadata.encoding}
            </div>
          )}
          {audioSize > 0 && (
            <div>
              <span className="font-medium">Audio Size:</span>{' '}
              {formatBytes(audioSize)}
            </div>
          )}
          {news.tags && news.tags.length > 0 && (
            <div>
              <span className="font-medium">Tags:</span> {news.tags.join(', ')}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

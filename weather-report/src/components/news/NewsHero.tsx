import { useState } from 'react';
import { formatSubredditName } from '@/utils/formatters';

interface NewsHeroProps {
  subreddit: string;
  title?: string;
  imageUrl?: string;
}

export const NewsHero = ({ subreddit, imageUrl }: NewsHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasImage = !!imageUrl?.trim();

  return (
    <div className="relative min-h-[32vh] flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-rose-500 dark:from-orange-900 dark:via-red-900 dark:to-rose-900">
      {hasImage && (
        <>
          <img
            src={imageUrl}
            alt=""
            className="hidden"
            onLoad={() => setImageLoaded(true)}
          />
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </>
      )}
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="text-center relative z-10 px-4">
        <h1 className="text-6xl md:text-8xl font-thin tracking-tight text-white drop-shadow-lg">
          {formatSubredditName(subreddit)}
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-light text-white/90">
          Latest News Report
        </p>
      </div>
    </div>
  );
};

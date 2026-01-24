import { useState } from 'react';
import { formatSubredditName } from '@/utils/formatters';

interface NewsTileProps {
  subreddit: string;
  title?: string;
  imageUrl?: string;
  isPreparing: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export const NewsTile = ({
  subreddit,
  title,
  imageUrl,
  isPreparing,
  isLoading,
  onClick,
}: NewsTileProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasImage = !!imageUrl?.trim();

  return (
    <button
      onClick={onClick}
      className="relative aspect-[4/3] w-full rounded-xl overflow-hidden
                 bg-gradient-to-br from-orange-500 via-red-500 to-rose-500
                 dark:from-orange-900 dark:via-red-900 dark:to-rose-900
                 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-darkblue focus:ring-offset-2
                 shadow-lg hover:shadow-xl"
    >
      {hasImage && !isPreparing && !isLoading && (
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
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <h3 className="text-2xl md:text-3xl font-thin text-white drop-shadow-lg">
            {formatSubredditName(subreddit)}
          </h3>
          {title && !isPreparing && !isLoading && (
            <p className="mt-2 text-sm text-white/80 font-light line-clamp-2 max-w-[200px] mx-auto">
              {title}
            </p>
          )}
          {(isPreparing || isLoading) && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
              <span className="text-sm text-white/80 font-light">
                {isPreparing ? 'Preparing...' : 'Loading...'}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

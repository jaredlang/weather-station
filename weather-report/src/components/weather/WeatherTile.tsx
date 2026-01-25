import { useState } from 'react';
import { formatCityName } from '@/utils/formatters';

interface WeatherTileProps {
  city: string;
  pictureUrl?: string;
  isPreparing: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export const WeatherTile = ({
  city,
  pictureUrl,
  isPreparing,
  isLoading,
  onClick,
}: WeatherTileProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasImage = !!pictureUrl?.trim();

  return (
    <button
      onClick={onClick}
      disabled={isPreparing}
      className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden
                 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
                 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900
                 transition-transform duration-200
                 focus:outline-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-darkblue focus:ring-offset-2
                 shadow-lg ${
                   isPreparing
                     ? 'cursor-not-allowed opacity-80'
                     : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer hover:shadow-xl'
                 }`}
    >
      {hasImage && !isPreparing && !isLoading && (
        <>
          <img
            src={pictureUrl}
            alt=""
            className="hidden"
            onLoad={() => setImageLoaded(true)}
          />
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${pictureUrl})` }}
          />
        </>
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <h3 className="text-2xl md:text-3xl font-thin text-white drop-shadow-lg">
            {formatCityName(city)}
          </h3>
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

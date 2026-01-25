import { useState } from 'react';
import { formatCityName } from '@/utils/formatters';

interface WeatherHeroProps {
  city: string;
  picture_url?: string;
}

export const WeatherHero = ({ city, picture_url }: WeatherHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasImage = !!picture_url?.trim();

  return (
    <div className="relative min-h-[32vh] flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
      {hasImage && (
        <>
          <img
            src={picture_url}
            alt=""
            className="hidden"
            onLoad={() => setImageLoaded(true)}
          />
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${picture_url})` }}
          />
        </>
      )}
      <div className="text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-thin tracking-tight text-white drop-shadow-lg">
          {formatCityName(city)}
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-light text-white/90">
          Latest Weather Report
        </p>
      </div>
    </div>
  );
};

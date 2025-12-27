import { formatCityName } from '@/utils/formatters';

interface WeatherHeroProps {
  city: string;
}

export const WeatherHero = ({ city }: WeatherHeroProps) => {
  return (
    <div className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-thin tracking-tight text-white drop-shadow-lg">
          {formatCityName(city)}
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-light text-white/90">
          Latest Weather Forecast
        </p>
      </div>
    </div>
  );
};

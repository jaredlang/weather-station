import { motion } from 'framer-motion';
import { WeatherTile } from './WeatherTile';
import type { CityWeatherState } from '@/hooks/useMultiCityWeather';

interface WeatherTileGridProps {
  cities: CityWeatherState[];
  onCitySelect: (city: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export const WeatherTileGrid = ({
  cities,
  onCitySelect,
}: WeatherTileGridProps) => {
  if (cities.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-light text-apple-dark dark:text-apple-light">
            Welcome to WHUT Weather Service
          </h2>
          <p className="text-apple-gray">
            Search for a city to view the latest weather report
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cities.map((cityData) => (
          <motion.div key={cityData.city} variants={itemVariants}>
            <WeatherTile
              city={cityData.city}
              pictureUrl={cityData.pictureUrl}
              isPreparing={cityData.status === 'preparing'}
              isLoading={cityData.status === 'loading'}
              onClick={() => {
                // Don't allow selecting tiles that are still preparing
                if (cityData.status !== 'preparing') {
                  onCitySelect(cityData.city);
                }
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

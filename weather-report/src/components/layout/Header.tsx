import { CitySearch } from '@/components/city/CitySearch';
import { SunnyIcon } from '@/components/common/SunnyIcon';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SunnyIcon className="w-8 h-8 text-yellow-500" />
            <h1 className="text-xl font-semibold tracking-tight text-apple-dark dark:text-apple-light">
              WHUT Weather Station
            </h1>
          </div>
          <div className="flex-1 max-w-md">
            <CitySearch />
          </div>
        </div>
      </div>
    </header>
  );
};

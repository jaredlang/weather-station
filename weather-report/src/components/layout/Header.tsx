import { CitySearch } from '@/components/city/CitySearch';
import { SubredditSearch } from '@/components/news/SubredditSearch';
import { SunnyIcon } from '@/components/common/SunnyIcon';
import { TabNavigation } from './TabNavigation';
import { useAppStore } from '@/store/appStore';

export const Header = () => {
  const activeTab = useAppStore((state) => state.activeTab);
  const setSelectedSubreddit = useAppStore((state) => state.setSelectedSubreddit);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SunnyIcon className="w-8 h-8 text-yellow-500" />
            <h1 className="text-xl font-semibold tracking-tight text-apple-dark dark:text-apple-light hidden sm:block">
              WHUT News Services
            </h1>
          </div>
          <TabNavigation />
          <div className="flex-1 max-w-md flex justify-end">
            {activeTab === 'weather' ? (
              <CitySearch />
            ) : (
              <SubredditSearch onSelect={setSelectedSubreddit} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

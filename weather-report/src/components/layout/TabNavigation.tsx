import { CloudIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { useAppStore, type ActiveTab } from '@/store/appStore';

export const TabNavigation = () => {
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'weather', label: 'Weather', icon: CloudIcon },
    { id: 'news', label: 'News', icon: NewspaperIcon },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-white dark:bg-gray-700 text-apple-blue dark:text-apple-darkblue shadow-sm'
                  : 'text-apple-gray hover:text-apple-dark dark:hover:text-apple-light'
              }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

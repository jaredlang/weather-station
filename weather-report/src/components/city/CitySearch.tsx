import { useState, useMemo } from 'react';
import { Combobox, Transition, Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useStats } from '@/hooks/useStats';
import { useAppStore } from '@/store/appStore';
import { formatCityName, formatShortTimestamp } from '@/utils/formatters';
import Fuse from 'fuse.js';

export const CitySearch = () => {
  const { data: statsData } = useStats();
  const { selectedCity, setSelectedCity, addRecentCity, recentCities, unavailableCities, getCityStatus } =
    useAppStore();
  const [query, setQuery] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Include all cities from stats, plus unavailable cities that are being prepared
  const allCities =
    statsData?.statistics.city_breakdown.map((c) => c.city) || [];

  const availableCities = [
    ...allCities,
    ...unavailableCities.filter((city) => !allCities.includes(city)),
  ];

  // Configure fuzzy search with Fuse.js
  const fuse = useMemo(
    () =>
      new Fuse(availableCities, {
        threshold: 0.3, // Lower = more strict matching
        distance: 100,
        ignoreLocation: true,
        keys: [''], // Search the string directly
      }),
    [availableCities]
  );

  // Filter cities, excluding recent cities to avoid duplicates in dropdown
  const filteredCities = useMemo(() => {
    const cities = query === ''
      ? availableCities
      : fuse.search(query).map((result) => result.item);

    // Remove cities already in recent to avoid showing them twice
    return cities.filter((city) => !recentCities.includes(city));
  }, [query, availableCities, fuse, recentCities]);

  const handleSelect = (city: string | null) => {
    if (city) {
      setSelectedCity(city);
      addRecentCity(city);
      setQuery('');
      setIsMobileOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      // If user presses Enter with a custom city name
      const trimmedQuery = query.trim();
      // Check if the query matches an existing city (case-insensitive)
      const existingCity = availableCities.find(
        (city) => city.toLowerCase() === trimmedQuery.toLowerCase()
      );

      if (existingCity) {
        // Select the existing city
        handleSelect(existingCity);
      } else if (filteredCities.length === 0) {
        // No matches found, treat as a new custom city
        handleSelect(trimmedQuery);
      }
    }
  };

  const handleClear = () => {
    setSelectedCity(null);
    setQuery('');
  };

  const handleMobileOpen = () => {
    setIsMobileOpen(true);
  };

  const handleMobileClose = () => {
    setIsMobileOpen(false);
    setQuery('');
  };

  // Get status label for a city
  const getCityStatusLabel = (city: string): string | null => {
    const status = getCityStatus(city);
    if (!status) return null;

    if (status.status === 'preparing') {
      return 'Being Prepared';
    } else if (status.status === 'available' && status.timestamp) {
      return formatShortTimestamp(status.timestamp);
    }
    return null;
  };

  // Shared options rendering component
  const renderOptions = () => [
    recentCities.length > 0 && query === '' && (
      <div key="recent-header" className="px-4 py-2 text-xs font-semibold text-apple-gray uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
        Recent
      </div>
    ),
    query === '' &&
      recentCities.map((city) => {
        const statusLabel = getCityStatusLabel(city);
        return (
          <Combobox.Option
            key={`recent-${city}`}
            value={city}
            className={({ active }) =>
              `cursor-pointer select-none relative py-3 pl-10 pr-4 ${
                active ? 'bg-apple-blue/10 dark:bg-apple-darkblue/10' : ''
              }`
            }
          >
            {({ selected }) => (
              <>
                <div className="flex items-center justify-between">
                  <span
                    className={`block truncate ${
                      selected ? 'font-semibold' : 'font-normal'
                    }`}
                  >
                    {formatCityName(city)}
                  </span>
                  {statusLabel && (
                    <span className={`ml-2 text-xs ${
                      statusLabel === 'Being Prepared'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-apple-gray'
                    }`}>
                      {statusLabel}
                    </span>
                  )}
                </div>
                {selected && (
                  <CheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-blue dark:text-apple-darkblue" />
                )}
              </>
            )}
          </Combobox.Option>
        );
      }),
    filteredCities.length > 0 &&
      recentCities.length > 0 &&
      query === '' && (
        <div key="all-cities-header" className="px-4 py-2 text-xs font-semibold text-apple-gray uppercase tracking-wide border-t border-b border-gray-200 dark:border-gray-700">
          All Cities
        </div>
      ),
    filteredCities.length > 0 &&
      filteredCities.map((city) => {
        const statusLabel = getCityStatusLabel(city);
        return (
          <Combobox.Option
            key={city}
            value={city}
            className={({ active }) =>
              `cursor-pointer select-none relative py-3 pl-10 pr-4 ${
                active ? 'bg-apple-blue/10 dark:bg-apple-darkblue/10' : ''
              }`
            }
          >
            {({ selected }) => (
              <>
                <div className="flex items-center justify-between">
                  <span
                    className={`block truncate ${
                      selected ? 'font-semibold' : 'font-normal'
                    }`}
                  >
                    {formatCityName(city)}
                  </span>
                  {statusLabel && (
                    <span className={`ml-2 text-xs ${
                      statusLabel === 'Being Prepared'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-apple-gray'
                    }`}>
                      {statusLabel}
                    </span>
                  )}
                </div>
                {selected && (
                  <CheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-blue dark:text-apple-darkblue" />
                )}
              </>
            )}
          </Combobox.Option>
        );
      }),
    filteredCities.length === 0 && query !== '' && (
      <Combobox.Option
        key="add-custom-city"
        value={query.trim()}
        className={({ active }) =>
          `cursor-pointer select-none relative py-3 pl-4 pr-4 ${
            active ? 'bg-apple-blue/10 dark:bg-apple-darkblue/10' : ''
          }`
        }
      >
        <div className="flex items-center gap-2">
          <span className="text-apple-gray">Add:</span>
          <span className="font-semibold text-apple-dark dark:text-apple-light">
            {formatCityName(query.trim())}
          </span>
        </div>
      </Combobox.Option>
    ),
  ];

  return (
    <>
      {/* Desktop Version - Hidden on mobile */}
      <div className="hidden md:block">
        <Combobox value={selectedCity || ''} onChange={handleSelect}>
          <div className="relative">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray" />
              <Combobox.Input
                className="w-full pl-12 pr-12 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-darkblue text-apple-dark dark:text-apple-light placeholder:text-apple-gray"
                placeholder="Search for a city..."
                displayValue={(city: string) => formatCityName(city)}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {selectedCity && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray hover:text-apple-dark dark:hover:text-apple-light transition-colors"
                  aria-label="Clear city selection"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            <Transition
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <div>
                <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-lg z-10">
                  {renderOptions()}
                </Combobox.Options>
              </div>
            </Transition>
          </div>
        </Combobox>
      </div>

      {/* Mobile Version - Button that opens dialog */}
      <div className="md:hidden">
        <button
          onClick={handleMobileOpen}
          className="w-full flex items-center gap-3 pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700 text-left text-apple-dark dark:text-apple-light"
        >
          <MagnifyingGlassIcon className="absolute left-4 h-5 w-5 text-apple-gray" />
          <span className={selectedCity ? '' : 'text-apple-gray'}>
            {selectedCity ? formatCityName(selectedCity) : 'Search for a city...'}
          </span>
        </button>

        {/* Mobile Dialog */}
        <Transition show={isMobileOpen}>
          <Dialog onClose={handleMobileClose} className="relative z-50">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div>
                  <Dialog.Panel className="min-h-screen bg-apple-light dark:bg-black">
                    <div className="sticky top-0 bg-apple-light/95 dark:bg-black/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 px-4 py-4">
                      <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-semibold text-apple-dark dark:text-apple-light">
                          Select City
                        </Dialog.Title>
                        <button
                          onClick={handleMobileClose}
                          className="text-apple-gray hover:text-apple-dark dark:hover:text-apple-light transition-colors"
                          aria-label="Close"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      <Combobox value={selectedCity || ''} onChange={handleSelect}>
                        <div className="relative">
                          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray" />
                          <Combobox.Input
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-darkblue text-apple-dark dark:text-apple-light placeholder:text-apple-gray"
                            placeholder="Search for a city..."
                            displayValue={(city: string) => formatCityName(city)}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                          />
                        </div>

                        <Combobox.Options static className="mt-4 max-h-[calc(100vh-12rem)] overflow-auto">
                          {renderOptions()}
                        </Combobox.Options>
                      </Combobox>
                    </div>
                  </Dialog.Panel>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

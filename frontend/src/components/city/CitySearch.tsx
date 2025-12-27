import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useStats } from '@/hooks/useStats';
import { useAppStore } from '@/store/appStore';
import { formatCityName } from '@/utils/formatters';

export const CitySearch = () => {
  const { data: statsData } = useStats();
  const { selectedCity, setSelectedCity, addRecentCity, recentCities } =
    useAppStore();
  const [query, setQuery] = useState('');

  const availableCities =
    statsData?.statistics.city_breakdown.map((c) => c.city) || [];

  const filteredCities =
    query === ''
      ? availableCities
      : availableCities.filter((city) =>
          city.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (city: string | null) => {
    if (city) {
      setSelectedCity(city);
      addRecentCity(city);
      setQuery('');
    }
  };

  const handleClear = () => {
    setSelectedCity(null);
    setQuery('');
  };

  return (
    <Combobox value={selectedCity || ''} onChange={handleSelect}>
      <div className="relative">
        <div className="relative w-full">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray" />
          <Combobox.Input
            className="w-full pl-12 pr-12 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-darkblue text-apple-dark dark:text-apple-light placeholder:text-apple-gray"
            placeholder="Search for a city..."
            displayValue={(city: string) => formatCityName(city)}
            onChange={(e) => setQuery(e.target.value)}
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
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-lg z-10">
            {recentCities.length > 0 && query === '' && (
              <div className="px-4 py-2 text-xs font-semibold text-apple-gray uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                Recent
              </div>
            )}
            {query === '' &&
              recentCities.map((city) => (
                <Combobox.Option
                  key={`recent-${city}`}
                  value={city}
                  className={({ active }) =>
                    `cursor-pointer select-none relative py-3 pl-10 pr-4 ${
                      active
                        ? 'bg-apple-blue/10 dark:bg-apple-darkblue/10'
                        : ''
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-semibold' : 'font-normal'
                        }`}
                      >
                        {formatCityName(city)}
                      </span>
                      {selected && (
                        <CheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-blue dark:text-apple-darkblue" />
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}

            {filteredCities.length > 0 && (
              <>
                {recentCities.length > 0 && query === '' && (
                  <div className="px-4 py-2 text-xs font-semibold text-apple-gray uppercase tracking-wide border-t border-b border-gray-200 dark:border-gray-700">
                    All Cities
                  </div>
                )}
                {filteredCities.map((city) => (
                  <Combobox.Option
                    key={city}
                    value={city}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-3 pl-10 pr-4 ${
                        active
                          ? 'bg-apple-blue/10 dark:bg-apple-darkblue/10'
                          : ''
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-semibold' : 'font-normal'
                          }`}
                        >
                          {formatCityName(city)}
                        </span>
                        {selected && (
                          <CheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-blue dark:text-apple-darkblue" />
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </>
            )}

            {filteredCities.length === 0 && query !== '' && (
              <div className="py-3 px-4 text-apple-gray text-center">
                No cities found
              </div>
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

import { useState, useMemo, Fragment } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import Fuse from 'fuse.js';
import { useAppStore } from '@/store/appStore';
import { useNewsStats } from '@/hooks/useNewsStats';
import { formatSubredditName, formatShortTimestamp } from '@/utils/formatters';

interface SubredditSearchProps {
  onSelect: (subreddit: string | null) => void;
}

interface SubredditOption {
  name: string;
  status: 'available' | 'preparing';
  timestamp?: string;
}

export const SubredditSearch = ({ onSelect }: SubredditSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data: statsData } = useNewsStats();
  const selectedSubreddit = useAppStore((state) => state.selectedSubreddit);
  const subredditAvailability = useAppStore((state) => state.subredditAvailability);
  const unavailableSubreddits = useAppStore((state) => state.unavailableSubreddits);
  const hiddenSubreddits = useAppStore((state) => state.hiddenSubreddits);
  const removeSubreddit = useAppStore((state) => state.removeSubreddit);

  // Build list of all subreddits with their status
  const allSubreddits = useMemo((): SubredditOption[] => {
    const statsSubreddits = statsData?.statistics.categories_used
      ? Object.keys(statsData.statistics.categories_used)
      : [];

    // Add preparing subreddits that aren't in stats
    const preparingSubreddits = unavailableSubreddits.filter(
      (s) => !statsSubreddits.some((stat) => stat.toLowerCase() === s.toLowerCase())
    );

    const combined = [...preparingSubreddits, ...statsSubreddits];

    // Filter out hidden subreddits and map to options
    return combined
      .filter((s) => !hiddenSubreddits.some((hidden) => hidden.toLowerCase() === s.toLowerCase()))
      .map((name) => {
        const availabilityKey = Object.keys(subredditAvailability).find(
          (k) => k.toLowerCase() === name.toLowerCase()
        );
        const availability = availabilityKey ? subredditAvailability[availabilityKey] : null;

        return {
          name,
          status: availability?.status || 'available',
          timestamp: availability?.timestamp,
        };
      });
  }, [statsData, unavailableSubreddits, hiddenSubreddits, subredditAvailability]);

  // Fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(allSubreddits, {
        keys: ['name'],
        threshold: 0.4,
      }),
    [allSubreddits]
  );

  const filteredSubreddits = useMemo(() => {
    if (!query) return allSubreddits.slice(0, 10);
    return fuse.search(query).map((result) => result.item);
  }, [query, fuse, allSubreddits]);

  const handleSelect = (subreddit: SubredditOption | null) => {
    if (subreddit) {
      onSelect(subreddit.name);
      setQuery('');
      setIsOpen(false);
    }
  };

  const handleCustomSubmit = () => {
    if (query.trim()) {
      onSelect(query.trim());
      setQuery('');
      setIsOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent | React.PointerEvent, subreddit: string) => {
    e.stopPropagation();
    e.preventDefault();
    removeSubreddit(subreddit);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery('');
  };

  return (
    <>
      {/* Desktop combobox */}
      <div className="hidden md:block w-64">
        <Combobox value={null} onChange={handleSelect}>
          <div className="relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray" />
              <ComboboxInput
                className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-darkblue text-apple-dark dark:text-apple-light placeholder-apple-gray"
                placeholder="Search subreddit..."
                displayValue={() => selectedSubreddit ? formatSubredditName(selectedSubreddit) : query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim() && filteredSubreddits.length === 0) {
                    handleCustomSubmit();
                  }
                }}
              />
              {selectedSubreddit && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray hover:text-apple-dark dark:hover:text-apple-light transition-colors"
                  aria-label="Clear subreddit selection"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <ComboboxOptions className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5">
              {filteredSubreddits.map((subreddit) => (
                <ComboboxOption
                  key={subreddit.name}
                  value={subreddit}
                  className="group flex items-center justify-between px-4 py-2 cursor-pointer data-[focus]:bg-apple-blue/10 dark:data-[focus]:bg-apple-darkblue/10"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-apple-dark dark:text-apple-light">
                      {formatSubredditName(subreddit.name)}
                    </span>
                    {subreddit.status === 'preparing' && (
                      <span className="flex items-center gap-1 text-xs text-orange-500">
                        <ClockIcon className="w-3 h-3" />
                        Preparing
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {subreddit.timestamp && subreddit.status === 'available' && (
                      <span className="text-xs text-apple-gray">
                        {formatShortTimestamp(subreddit.timestamp)}
                      </span>
                    )}
                    <button
                      onPointerDown={(e) => handleDelete(e, subreddit.name)}
                      onMouseDown={(e) => handleDelete(e, subreddit.name)}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      className="p-1 text-apple-gray hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label={`Remove ${subreddit.name}`}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </ComboboxOption>
              ))}
              {query.trim() && filteredSubreddits.length === 0 && (
                <ComboboxButton
                  as="div"
                  onClick={handleCustomSubmit}
                  className="px-4 py-2 cursor-pointer hover:bg-apple-blue/10 dark:hover:bg-apple-darkblue/10 text-apple-dark dark:text-apple-light"
                >
                  Search for "{query}"
                </ComboboxButton>
              )}
            </ComboboxOptions>
          </div>
        </Combobox>
      </div>

      {/* Mobile dialog */}
      <div className="md:hidden">
        {selectedSubreddit ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <button
              onClick={() => setIsOpen(true)}
              className="text-apple-dark dark:text-apple-light text-sm font-medium"
            >
              {formatSubredditName(selectedSubreddit)}
            </button>
            <button
              onClick={handleClear}
              className="text-apple-gray hover:text-apple-dark dark:hover:text-apple-light transition-colors"
              aria-label="Clear subreddit selection"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Search subreddits"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-apple-gray" />
          </button>
        )}

        <Transition show={isOpen} as={Fragment}>
          <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full h-full bg-apple-light dark:bg-black">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-apple-gray" />
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCustomSubmit();
                            }
                          }}
                          placeholder="Search subreddit..."
                          className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-darkblue text-apple-dark dark:text-apple-light placeholder-apple-gray"
                          autoFocus
                        />
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <XMarkIcon className="h-6 w-6 text-apple-gray" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      {filteredSubreddits.map((subreddit) => (
                        <button
                          key={subreddit.name}
                          onClick={() => handleSelect(subreddit)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-apple-dark dark:text-apple-light">
                              {formatSubredditName(subreddit.name)}
                            </span>
                            {subreddit.status === 'preparing' && (
                              <span className="flex items-center gap-1 text-xs text-orange-500">
                                <ClockIcon className="w-3 h-3" />
                                Preparing
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onPointerDown={(e) => handleDelete(e, subreddit.name)}
                              onMouseDown={(e) => handleDelete(e, subreddit.name)}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              className="p-1 text-apple-gray hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                              aria-label={`Remove ${subreddit.name}`}
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </button>
                      ))}
                      {query.trim() && filteredSubreddits.length === 0 && (
                        <button
                          onClick={handleCustomSubmit}
                          className="w-full px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left text-apple-dark dark:text-apple-light"
                        >
                          Search for "{query}"
                        </button>
                      )}
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};

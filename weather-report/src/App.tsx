import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { ForecastCard } from '@/components/weather/ForecastCard';
import { WeatherTileGrid } from '@/components/weather/WeatherTileGrid';
import { NewsHero } from '@/components/news/NewsHero';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsTileGrid } from '@/components/news/NewsTileGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useWeather } from '@/hooks/useWeather';
import { useNews } from '@/hooks/useNews';
import { useStats } from '@/hooks/useStats';
import { useNewsStats } from '@/hooks/useNewsStats';
import { useMultiCityWeather } from '@/hooks/useMultiCityWeather';
import { useMultiSubredditNews } from '@/hooks/useMultiSubredditNews';
import { useAppStore } from '@/store/appStore';
import { config } from '@/utils/config';
import { queryKeys } from '@/api/queryKeys';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      retryDelay: config.retryDelay,
      staleTime: config.cacheDuration,
    },
  },
});

function WeatherContent() {
  const queryClient = useQueryClient();
  const selectedCity = useAppStore((state) => state.selectedCity);
  const setSelectedCity = useAppStore((state) => state.setSelectedCity);
  const addUnavailableCity = useAppStore((state) => state.addUnavailableCity);
  const markCityAsAvailable = useAppStore((state) => state.markCityAsAvailable);
  const cityAvailability = useAppStore((state) => state.cityAvailability);
  const unavailableCities = useAppStore((state) => state.unavailableCities);
  const hiddenCities = useAppStore((state) => state.hiddenCities);
  const { data, isLoading, isError, error } = useWeather(selectedCity);
  const { data: statsData } = useStats();

  // Build list of all cities for tile grid (from stats + preparing cities)
  const allCities = useMemo(() => {
    const statsCities = statsData?.statistics.city_breakdown.map((c) => c.city) || [];
    // Add unavailable cities that aren't already in stats
    const preparingCities = unavailableCities.filter(
      (city) => !statsCities.some((c) => c.toLowerCase() === city.toLowerCase())
    );
    // Filter out hidden cities, with preparing cities first
    return [...preparingCities, ...statsCities].filter(
      (city) => !hiddenCities.some((hidden) => hidden.toLowerCase() === city.toLowerCase())
    );
  }, [statsData, unavailableCities, hiddenCities]);

  // Fetch weather data for all cities (for tile grid)
  const { data: cityWeatherData } = useMultiCityWeather(allCities);

  // Monitor stats and update all preparing cities when they become available
  useEffect(() => {
    if (!statsData) return;

    // Check all cities with "preparing" status
    Object.entries(cityAvailability).forEach(([city, availability]) => {
      if (availability.status !== 'preparing') return;

      // Check if this city now has a forecast in the stats
      const cityStats = statsData.statistics.city_breakdown.find(
        (c) => c.city.toLowerCase() === city.toLowerCase()
      );

      if (cityStats?.latest_forecast) {
        // City is now available! Mark it and refetch the weather data if it's selected
        markCityAsAvailable(city, cityStats.latest_forecast);
        if (selectedCity?.toLowerCase() === city.toLowerCase()) {
          queryClient.invalidateQueries({ queryKey: queryKeys.weather.city(city) });
        }
      }
    });
  }, [statsData, cityAvailability, selectedCity, markCityAsAvailable, queryClient]);

  // Mark city as unavailable when 404 occurs
  useEffect(() => {
    if (isError && selectedCity) {
      const errorMessage = (error as Error)?.message?.toLowerCase() || '';
      const is404Error = errorMessage.includes('forecast not found');

      if (is404Error) {
        addUnavailableCity(selectedCity);
      }
    }
  }, [isError, error, selectedCity, addUnavailableCity]);

  // Mark city as available when forecast loads successfully
  useEffect(() => {
    if (data && selectedCity) {
      markCityAsAvailable(selectedCity, data.forecast.forecast_at);
    }
  }, [data, selectedCity, markCityAsAvailable]);

  if (!selectedCity) {
    return (
      <WeatherTileGrid
        cities={cityWeatherData}
        onCitySelect={setSelectedCity}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error as Error} />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <WeatherHero city={data.city} picture_url={data.forecast.picture_url} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ForecastCard forecast={data.forecast} city={data.city} />
      </div>
    </>
  );
}

function NewsContent() {
  const queryClient = useQueryClient();
  const selectedSubreddit = useAppStore((state) => state.selectedSubreddit);
  const setSelectedSubreddit = useAppStore((state) => state.setSelectedSubreddit);
  const addUnavailableSubreddit = useAppStore((state) => state.addUnavailableSubreddit);
  const markSubredditAsAvailable = useAppStore((state) => state.markSubredditAsAvailable);
  const subredditAvailability = useAppStore((state) => state.subredditAvailability);
  const unavailableSubreddits = useAppStore((state) => state.unavailableSubreddits);
  const hiddenSubreddits = useAppStore((state) => state.hiddenSubreddits);
  const { data, isLoading, isError, error } = useNews(selectedSubreddit);
  const { data: statsData } = useNewsStats();

  // Build list of all subreddits for tile grid (from stats + preparing subreddits)
  const allSubreddits = useMemo(() => {
    const statsSubreddits = statsData?.statistics.categories_used
      ? Object.keys(statsData.statistics.categories_used)
      : [];
    // Add unavailable subreddits that aren't already in stats
    const preparingSubreddits = unavailableSubreddits.filter(
      (subreddit) => !statsSubreddits.some((s) => s.toLowerCase() === subreddit.toLowerCase())
    );
    // Filter out hidden subreddits, with preparing subreddits first
    return [...preparingSubreddits, ...statsSubreddits].filter(
      (subreddit) => !hiddenSubreddits.some((hidden) => hidden.toLowerCase() === subreddit.toLowerCase())
    );
  }, [statsData, unavailableSubreddits, hiddenSubreddits]);

  // Fetch news data for all subreddits (for tile grid)
  const { data: subredditNewsData } = useMultiSubredditNews(allSubreddits);

  // Monitor stats and update all preparing subreddits when they become available
  useEffect(() => {
    if (!statsData) return;

    // Check all subreddits with "preparing" status
    Object.entries(subredditAvailability).forEach(([subreddit, availability]) => {
      if (availability.status !== 'preparing') return;

      // Check if this subreddit now has news in the stats
      const categoriesUsed = statsData.statistics.categories_used || {};
      const subredditKey = Object.keys(categoriesUsed).find(
        (k) => k.toLowerCase() === subreddit.toLowerCase()
      );

      if (subredditKey && categoriesUsed[subredditKey] > 0) {
        // Subreddit is now available! Mark it and refetch the news data if it's selected
        markSubredditAsAvailable(subreddit, new Date().toISOString());
        if (selectedSubreddit?.toLowerCase() === subreddit.toLowerCase()) {
          queryClient.invalidateQueries({ queryKey: queryKeys.news.subreddit(subreddit) });
        }
      }
    });
  }, [statsData, subredditAvailability, selectedSubreddit, markSubredditAsAvailable, queryClient]);

  // Mark subreddit as unavailable when 404 occurs
  useEffect(() => {
    if (isError && selectedSubreddit) {
      const errorMessage = (error as Error)?.message?.toLowerCase() || '';
      const is404Error = errorMessage.includes('news not found');

      if (is404Error) {
        addUnavailableSubreddit(selectedSubreddit);
      }
    }
  }, [isError, error, selectedSubreddit, addUnavailableSubreddit]);

  // Mark subreddit as available when news loads successfully
  useEffect(() => {
    if (data && selectedSubreddit) {
      markSubredditAsAvailable(selectedSubreddit, data.news.published_at);
    }
  }, [data, selectedSubreddit, markSubredditAsAvailable]);

  if (!selectedSubreddit) {
    return (
      <NewsTileGrid
        subreddits={subredditNewsData}
        onSubredditSelect={setSelectedSubreddit}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error as Error} />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <NewsHero
        subreddit={selectedSubreddit}
        title={data.news.title}
        imageUrl={data.news.image_url}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsCard news={data.news} subreddit={selectedSubreddit} />
      </div>
    </>
  );
}

function App() {
  const activeTab = useAppStore((state) => state.activeTab);

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => (
        <div className="min-h-screen flex items-center justify-center bg-apple-light dark:bg-black">
          <ErrorMessage error={error} />
        </div>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-apple-light dark:bg-black">
          <Header />
          <main>
            {activeTab === 'weather' ? <WeatherContent /> : <NewsContent />}
          </main>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

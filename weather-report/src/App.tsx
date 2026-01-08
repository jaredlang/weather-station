import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { ForecastCard } from '@/components/weather/ForecastCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useWeather } from '@/hooks/useWeather';
import { useAppStore } from '@/store/appStore';
import { config } from '@/utils/config';

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
  const selectedCity = useAppStore((state) => state.selectedCity);
  const addUnavailableCity = useAppStore((state) => state.addUnavailableCity);
  const { data, isLoading, isError, error, refetch } = useWeather(selectedCity);

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

  if (!selectedCity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-light text-apple-dark dark:text-apple-light">
            Welcome to Weather Station
          </h2>
          <p className="text-apple-gray">
            Search for a city to view the latest weather forecast
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error as Error} onRetry={() => refetch()} />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <WeatherHero city={data.city} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ForecastCard forecast={data.forecast} city={data.city} />
      </div>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div className="min-h-screen flex items-center justify-center bg-apple-light dark:bg-black">
          <ErrorMessage error={error} onRetry={resetErrorBoundary} />
        </div>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-apple-light dark:bg-black">
          <Header />
          <main>
            <WeatherContent />
          </main>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

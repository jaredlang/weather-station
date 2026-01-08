interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
}

export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => {
  // Check if this is a "forecast not found" error (404)
  const isForecastNotFound = error.message.toLowerCase().includes('forecast not found');

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`text-center ${isForecastNotFound ? 'text-apple-dark dark:text-apple-light' : 'text-red-500 dark:text-red-400'}`}>
        {isForecastNotFound ? (
          <>
            <p className="text-lg font-medium">My apologies</p>
            <p className="text-base text-apple-gray mt-2 max-w-md">
              The latest weather report is being prepared. Please check again in a few minutes.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">Something went wrong</p>
            <p className="text-sm text-apple-gray mt-2">{error.message}</p>
          </>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-apple-blue dark:bg-apple-darkblue text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

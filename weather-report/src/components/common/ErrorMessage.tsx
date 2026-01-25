import './ErrorMessage.css';

interface ErrorMessageProps {
  error: Error;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  // Check if this is a "not found" error (404) for forecast or news
  const isForecastNotFound = error.message.toLowerCase().includes('forecast not found');
  const isNewsNotFound = error.message.toLowerCase().includes('news not found');
  const isContentPreparing = isForecastNotFound || isNewsNotFound;

  const getPreparingMessage = () => {
    if (isForecastNotFound) {
      return 'We are preparing the weather report as requested.';
    }
    if (isNewsNotFound) {
      return 'We are preparing the news report as requested.';
    }
    return 'We are preparing your content.';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`error-message-container ${isContentPreparing ? 'forecast-not-found' : 'error'}`}>
        {isContentPreparing ? (
          <>
            <p className="text-lg font-medium">{getPreparingMessage()}</p>
            <p className="text-base text-apple-gray mt-2 max-w-md">
              Please check back in a few minutes.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">Something went wrong</p>
            <p className="text-sm text-apple-gray mt-2">{error.message}</p>
          </>
        )}
      </div>
    </div>
  );
};

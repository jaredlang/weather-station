import './ErrorMessage.css';

interface ErrorMessageProps {
  error: Error;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  // Check if this is a "forecast not found" error (404)
  const isForecastNotFound = error.message.toLowerCase().includes('forecast not found');

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`error-message-container ${isForecastNotFound ? 'forecast-not-found' : 'error'}`}>
        {isForecastNotFound ? (
          <>
            <p className="text-lg font-medium">We are preparing the forecast as requested.</p>
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

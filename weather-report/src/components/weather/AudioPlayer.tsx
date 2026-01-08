import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { formatDuration } from '@/utils/formatters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import './AudioPlayer.css';

interface AudioPlayerProps {
  audioBase64: string;
}

export const AudioPlayer = ({ audioBase64 }: AudioPlayerProps) => {
  const { isPlaying, currentTime, duration, isLoading, toggle, seek } =
    useAudioPlayer(audioBase64);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * duration);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* Play/Pause Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={toggle}
          className="w-16 h-16 rounded-full bg-apple-blue dark:bg-apple-darkblue text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <PauseIcon className="w-8 h-8" />
          ) : (
            <PlayIcon className="w-8 h-8 ml-1" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div
          className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <div
            className="audio-progress-fill"
            style={{ '--progress-width': `${(currentTime / duration) * 100}%` } as React.CSSProperties}
          />
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-xs text-apple-gray">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  );
};

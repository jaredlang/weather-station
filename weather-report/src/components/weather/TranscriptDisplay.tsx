interface TranscriptDisplayProps {
  text: string;
}

export const TranscriptDisplay = ({ text }: TranscriptDisplayProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-apple-gray uppercase tracking-wide">
        Forecast
      </h3>
      <div className="text-base md:text-lg leading-relaxed font-light text-apple-dark dark:text-apple-light">
        {text}
      </div>
    </div>
  );
};

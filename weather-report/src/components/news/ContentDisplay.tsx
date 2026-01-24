interface ContentDisplayProps {
  text: string;
  title?: string;
}

export const ContentDisplay = ({ text, title = 'Content' }: ContentDisplayProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-apple-gray uppercase tracking-wide">
        {title}
      </h3>
      <div className="text-base md:text-lg leading-relaxed font-light text-apple-dark dark:text-apple-light whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
};

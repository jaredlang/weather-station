import { motion } from 'framer-motion';
import { NewsTile } from './NewsTile';
import type { SubredditNewsState } from '@/hooks/useMultiSubredditNews';

interface NewsTileGridProps {
  subreddits: SubredditNewsState[];
  onSubredditSelect: (subreddit: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export const NewsTileGrid = ({
  subreddits,
  onSubredditSelect,
}: NewsTileGridProps) => {
  if (subreddits.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-light text-apple-dark dark:text-apple-light">
            Welcome to WHUT News Service
          </h2>
          <p className="text-apple-gray">
            Search for a subreddit to view the latest news report
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {subreddits.map((subredditData) => (
          <motion.div key={subredditData.subreddit} variants={itemVariants}>
            <NewsTile
              subreddit={subredditData.subreddit}
              title={subredditData.title}
              imageUrl={subredditData.imageUrl}
              isPreparing={subredditData.status === 'preparing'}
              isLoading={subredditData.status === 'loading'}
              onClick={() => {
                // Don't allow selecting tiles that are still preparing
                if (subredditData.status !== 'preparing') {
                  onSubredditSelect(subredditData.subreddit);
                }
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Rss } from 'lucide-react';

interface RssFeed {
  title: string;
  url: string;
}

interface RssFeedListProps {
  feeds: RssFeed[];
  onSubscribe: (feed: RssFeed) => void;
}

const RssFeedList: React.FC<RssFeedListProps> = ({ feeds, onSubscribe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Rss className="text-[#CC0000]" />
        <h2 className="text-xl font-bold">RSS フィード</h2>
      </div>
      <div className="space-y-3">
        {feeds.map((feed, index) => (
          <motion.div
            key={feed.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium">{feed.title}</span>
            <button
              onClick={() => onSubscribe(feed)}
              className="px-4 py-2 text-sm bg-[#CC0000] text-white rounded-full hover:bg-[#AA0000] transition-colors"
            >
              購読する
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

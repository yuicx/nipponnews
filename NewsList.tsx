import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../types';
import NewsCard from './NewsCard';

interface NewsListProps {
  newsItems: NewsItem[];
  title: string;
}

const NewsList: React.FC<NewsListProps> = ({ newsItems, title }) => {
  const displayItems = newsItems.slice(3);
  
  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl font-bold mb-6 border-l-4 border-[#CC0000] pl-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <NewsCard newsItem={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsList;
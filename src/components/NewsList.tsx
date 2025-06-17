import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../types';
import NewsCard from './NewsCard';
import { getUserSettings } from '../services/settingsService';

interface NewsListProps {
  newsItems: NewsItem[];
  title: string;
  showImages?: boolean;
  showSummary?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ 
  newsItems, 
  title, 
  showImages = true, 
  showSummary = true 
}) => {
  const settings = getUserSettings();
  const displayItems = newsItems.slice(3);
  const shouldReduceMotion = settings.preferences.reducedMotion;
  
  if (displayItems.length === 0) {
    return null;
  }

  const getGridClasses = () => {
    switch (settings.preferences.layout) {
      case 'compact':
        return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4';
      case 'magazine':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  return (
    <section className="mb-8">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl font-bold mb-6 border-l-4 border-[#CC0000] pl-3 dark:text-white"
          initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={shouldReduceMotion ? {} : { duration: 0.5 }}
        >
          {title}
        </motion.h2>
        
        <div className={`grid ${getGridClasses()}`}>
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { duration: 0.5, delay: index * 0.1 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            >
              <NewsCard 
                newsItem={item} 
                showImages={showImages}
                showSummary={showSummary}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsList;

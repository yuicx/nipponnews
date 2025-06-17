import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../types';
import NewsCard from './NewsCard';
import { getUserSettings } from '../services/settingsService';

interface FeaturedNewsProps {
  newsItems: NewsItem[];
  showImages?: boolean;
  showSummary?: boolean;
}

const FeaturedNews: React.FC<FeaturedNewsProps> = ({ 
  newsItems, 
  showImages = true, 
  showSummary = true 
}) => {
  const settings = getUserSettings();
  const mainFeatured = newsItems.length > 0 ? newsItems[0] : null;
  const secondaryFeatured = newsItems.slice(1, 3);
  
  if (!mainFeatured) {
    return null;
  }

  const shouldReduceMotion = settings.preferences.reducedMotion;

  return (
    <section className="mb-8">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl font-bold mb-6 border-l-4 border-[#CC0000] pl-3 dark:text-white"
          initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={shouldReduceMotion ? {} : { duration: 0.5 }}
        >
          注目ニュース
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? {} : { duration: 0.5 }}
          >
            {mainFeatured && (
              <NewsCard 
                newsItem={mainFeatured} 
                featured={true} 
                showImages={showImages}
                showSummary={showSummary}
              />
            )}
          </motion.div>
          
          <div className="grid grid-cols-1 gap-6">
            {secondaryFeatured.map((item, index) => (
              <motion.div
                key={item.id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.5, delay: index * 0.2 }}
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
      </div>
    </section>
  );
};

export default FeaturedNews;

import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../types';
import NewsCard from './NewsCard';

interface FeaturedNewsProps {
  newsItems: NewsItem[];
}

const FeaturedNews: React.FC<FeaturedNewsProps> = ({ newsItems }) => {
  const mainFeatured = newsItems.length > 0 ? newsItems[0] : null;
  const secondaryFeatured = newsItems.slice(1, 3);
  
  if (!mainFeatured) {
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
          注目ニュース
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {mainFeatured && <NewsCard newsItem={mainFeatured} featured={true} />}
          </motion.div>
          
          <div className="grid grid-cols-1 gap-6">
            {secondaryFeatured.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <NewsCard newsItem={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;
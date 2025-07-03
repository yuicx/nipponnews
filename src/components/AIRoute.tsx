import React from 'react';
import { useEffect, useState } from 'react';
import AINewsChat from './AINewsChat';
import { NewsItem } from '../types';
import { fetchAllNews } from '../services/rssService';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

const AIRoute: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadNews = async () => {
    setIsLoading(true);
    setError(false);
    
    try {
      const news = await fetchAllNews();
      setNewsItems(news);
    } catch (err) {
      console.error('Failed to fetch news for AI chat:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={loadNews} />;
  }

  return <AINewsChat newsItems={newsItems} />;
};

export default AIRoute;

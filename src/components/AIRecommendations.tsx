import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, Clock } from 'lucide-react';
import { NewsItem } from '../types';
import NewsCard from './NewsCard';
import { geminiService } from '../services/geminiService';
import { getUserSettings } from '../services/settingsService';

interface AIRecommendationsProps {
  newsItems: NewsItem[];
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ newsItems }) => {
  const [recommendations, setRecommendations] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const settings = getUserSettings();

  useEffect(() => {
    if (settings.ai.enableRecommendations && settings.ai.geminiApiKey && newsItems.length > 0) {
      generateRecommendations();
    }
  }, [newsItems, settings.ai.enableRecommendations, settings.ai.geminiApiKey]);

  const generateRecommendations = async () => {
    if (!geminiService.isConfigured()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      geminiService.setConfig({
        apiKey: settings.ai.geminiApiKey,
        model: settings.ai.model
      });

      const recommendedTitles = await geminiService.getPersonalizedRecommendations(
        newsItems,
        settings.ai.interests,
        6
      );

      const recommendedNews = newsItems.filter(item =>
        recommendedTitles.some(title => 
          item.title.includes(title) || title.includes(item.title.substring(0, 20))
        )
      ).slice(0, 6);

      // Calculate relevance scores for sorting
      const newsWithScores = await Promise.all(
        recommendedNews.map(async (item) => {
          const score = await geminiService.calculateRelevanceScore(
            item.title,
            item.contentSnippet || '',
            settings.ai.interests
          );
          return { ...item, relevanceScore: score };
        })
      );

      const sortedRecommendations = newsWithScores
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 6);

      setRecommendations(sortedRecommendations);
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('AI推薦の生成に失敗しました。APIキーを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!settings.ai.enableRecommendations || !settings.ai.geminiApiKey) {
    return null;
  }

  if (error) {
    return (
      <section className="mb-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Brain size={20} />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-500" size={24} />
              <h2 className="text-2xl font-bold border-l-4 border-purple-500 pl-3 dark:text-white">
                AI おすすめニュース
              </h2>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Brain size={16} />
              <span>Gemini AI</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 mb-2">
                  <TrendingUp size={18} />
                  <span className="font-medium">パーソナライズされた推薦</span>
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  あなたの興味（{settings.ai.interests.topics.concat(settings.ai.interests.keywords).join(', ')}）に基づいて選ばれたニュースです
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles size={12} />
                        AI推薦
                      </div>
                    </div>
                    <NewsCard 
                      newsItem={item} 
                      showImages={settings.preferences.showImages}
                      showSummary={settings.preferences.showSummary}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <Brain size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                推薦を準備中
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                あなたの興味に基づいたニュースを分析しています...
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AIRecommendations;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { NewsItem } from '../types';
import { geminiService } from '../services/geminiService';
import { getUserSettings } from '../services/settingsService';

interface AISummaryProps {
  newsItem: NewsItem;
}

const AISummary: React.FC<AISummaryProps> = ({ newsItem }) => {
  const [summary, setSummary] = useState<string>('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const settings = getUserSettings();

  const generateSummary = async () => {
    if (!geminiService.isConfigured() || !settings.ai.enableSummary) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      geminiService.setConfig({
        apiKey: settings.ai.geminiApiKey,
        model: settings.ai.model
      });

      const [summaryText, points] = await Promise.all([
        geminiService.summarizeNews(newsItem.title, newsItem.contentSnippet || ''),
        geminiService.extractKeyPoints(newsItem.title, newsItem.contentSnippet || '')
      ]);

      setSummary(summaryText);
      setKeyPoints(points);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('要約の生成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isExpanded && !summary && !isLoading) {
      generateSummary();
    }
  }, [isExpanded, newsItem.id]);

  if (!settings.ai.enableSummary || !settings.ai.geminiApiKey) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
      >
        <Sparkles size={16} />
        <span>AI要約を表示</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span>AI要約を生成中...</span>
                </div>
              ) : error ? (
                <div className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              ) : summary ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 mb-2">
                      <Brain size={16} />
                      <span className="font-medium text-sm">AI要約</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  {keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2 text-sm">
                        重要なポイント
                      </h4>
                      <ul className="space-y-1">
                        {keyPoints.map((point, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-400 text-sm flex items-start gap-2">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Gemini AIによる要約</span>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AISummary;

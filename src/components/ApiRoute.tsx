import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Zap, 
  Globe, 
  Search,
  Activity,
  ExternalLink,
  Copy,
  Check,
  Shield
} from 'lucide-react';
import ApiDocumentation from './ApiDocumentation';
import { nipponNewsApi } from '../services/apiService';

const ApiRoute: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('search');
  const [demoData, setDemoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(id);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const runDemo = async (type: string) => {
    setIsLoading(true);
    setActiveDemo(type);
    
    try {
      let result;
      switch (type) {
        case 'search':
          result = await nipponNewsApi.searchNews({ q: 'AI', limit: 5 });
          break;
        default:
          result = await nipponNewsApi.getHealthStatus();
      }
      setDemoData(result);
    } catch (error) {
      console.error('Demo error:', error);
      setDemoData({ success: false, error: 'デモの実行に失敗しました' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDemo('search');
  }, []);

  const baseUrl = 'https://nipponnews.vercel.app';

  const demoButtons = [
    { 
      id: 'search', 
      label: 'ニュース検索', 
      icon: Search, 
      url: `${baseUrl}/api/news/search?q=AI&limit=5`,
      description: 'キーワードでニュースを検索'
    },
    { 
      id: 'health', 
      label: 'ヘルスチェック', 
      icon: Activity, 
      url: `${baseUrl}/api/health`,
      description: 'API健康状態を確認'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center">
                <Code size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-2">
                  ニッポンニュース API
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  ニュース検索とAPI監視のための軽量API
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                <Search size={16} className="text-blue-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">高速検索</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                <Globe size={16} className="text-green-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">完全無料</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md">
                <Shield size={16} className="text-purple-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">安全・軽量</span>
              </div>
            </div>
          </motion.div>

          {/* Live Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              🚀 ライブデモ
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              実際のAPIレスポンスをリアルタイムで確認できます
            </p>

            {/* Demo Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              {demoButtons.map((button) => (
                <div key={button.id} className="relative group">
                  <button
                    onClick={() => runDemo(button.id)}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                      activeDemo === button.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <button.icon 
                      size={32} 
                      className={`mx-auto mb-3 ${
                        activeDemo === button.id ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                      }`} 
                    />
                    <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {button.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {button.description}
                    </div>
                  </button>
                  
                  {/* URL Copy Button */}
                  <button
                    onClick={() => copyToClipboard(button.url, button.id)}
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 rounded-lg shadow-md"
                    title="URLをコピー"
                  >
                    {copiedUrl === button.id ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              ))}
            </div>

            {/* API URL Display */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">API URL:</span>
                <button
                  onClick={() => copyToClipboard(demoButtons.find(b => b.id === activeDemo)?.url || '', 'current-url')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  title="URLをコピー"
                >
                  {copiedUrl === 'current-url' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm break-all">
                {demoButtons.find(b => b.id === activeDemo)?.url}
              </div>
            </div>

            {/* Response Display */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                <span className="text-green-400 font-medium">API Response</span>
                <div className="flex items-center gap-2">
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                  )}
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(demoData, null, 2), 'response')}
                    className="text-gray-400 hover:text-gray-200"
                    title="レスポンスをコピー"
                  >
                    {copiedUrl === 'response' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <pre className="text-green-400 text-sm">
                  <code>
                    {isLoading 
                      ? '// データを取得中...\n{\n  "loading": true\n}'
                      : JSON.stringify(demoData, null, 2)
                    }
                  </code>
                </pre>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <a
                href={demoButtons.find(b => b.id === activeDemo)?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ExternalLink size={18} />
                ブラウザで開く
              </a>
              <button
                onClick={() => runDemo(activeDemo)}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Activity size={18} />
                再実行
              </button>
            </div>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-12"
          >
            <div className="flex items-start gap-3">
              <Shield size={24} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                  重要な注意事項
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
                  このAPIは既存のニュースデータを検索する機能とAPI監視機能のみを提供します。
                  ニュースデータ自体は各メディアの著作権で保護されており、商用利用の際は各ソースの利用規約をご確認ください。
                  また、このAPIは教育・研究目的での使用を想定しています。
                </p>
              </div>
            </div>
          </motion.div>

          {/* Documentation */}
          <ApiDocumentation />
        </div>
      </div>
    </div>
  );
};

export default ApiRoute;

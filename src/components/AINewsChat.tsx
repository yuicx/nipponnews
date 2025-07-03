import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MessageCircle, 
  Loader2, 
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
  Clock,
  Globe
} from 'lucide-react';
import { NewsItem } from '../types';
import { geminiService } from '../services/geminiService';
import { getUserSettings } from '../services/settingsService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  newsContext?: NewsItem[];
  suggestions?: string[];
}

interface AINewsChatProps {
  newsItems: NewsItem[];
}

const AINewsChat: React.FC<AINewsChatProps> = ({ newsItems }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const settings = getUserSettings();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `こんにちは！私はニュースAIアシスタントです。🤖\n\n現在のニュースについて何でもお聞きください。例えば：\n\n• 今日の重要なニュースは？\n• 特定のトピックについて詳しく教えて\n• ニュースの背景や影響について説明して\n• 複数のニュースを比較・分析して`,
        timestamp: new Date(),
        suggestions: [
          '今日の主要ニュースを要約して',
          '経済ニュースの影響を分析して',
          '国際情勢について教えて',
          'スポーツニュースのハイライトは？'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const generateAIResponse = async (userMessage: string, context: NewsItem[]): Promise<string> => {
    if (!geminiService.isConfigured()) {
      return 'AI機能を使用するには、設定でGemini APIキーを設定してください。';
    }

    const newsContext = context.slice(0, 10).map(item => 
      `【${item.source}】${item.title}\n概要: ${item.contentSnippet || '詳細なし'}\n発行日: ${item.pubDate}`
    ).join('\n\n');

    const prompt = `
あなたは日本のニュース専門AIアシスタントです。以下の最新ニュース情報を参考に、ユーザーの質問に詳しく、分かりやすく日本語で回答してください。

現在のニュース情報:
${newsContext}

ユーザーの質問: ${userMessage}

回答の際は以下を心がけてください：
- 正確で客観的な情報を提供する
- 複数の視点から分析する
- 背景情報や影響についても説明する
- 分かりやすい日本語で回答する
- 必要に応じて具体例を挙げる

回答:`;

    try {
      const response = await geminiService['makeRequest'](prompt);
      return response || 'すみません、回答を生成できませんでした。';
    } catch (error) {
      console.error('AI response error:', error);
      return 'AI応答の生成中にエラーが発生しました。しばらく後にもう一度お試しください。';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage, newsItems);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        newsContext: newsItems.slice(0, 5),
        suggestions: generateSuggestions(inputMessage)
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'すみません、回答の生成中にエラーが発生しました。もう一度お試しください。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = (userMessage: string): string[] => {
    const suggestions = [
      'この件についてもっと詳しく教えて',
      '他の関連ニュースはある？',
      'この影響はどのくらい続く？',
      '過去の類似事例と比較して'
    ];
    return suggestions;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const clearChat = () => {
    setMessages([]);
    // Re-initialize with welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `チャットをリセットしました。🔄\n\n現在のニュースについて何でもお聞きください！`,
      timestamp: new Date(),
      suggestions: [
        '今日の主要ニュースを要約して',
        '経済ニュースの影響を分析して',
        '国際情勢について教えて',
        'スポーツニュースのハイライトは？'
      ]
    };
    setMessages([welcomeMessage]);
  };

  if (!settings.ai.geminiApiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                AI機能を有効にする
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                ニュースAIチャット機能を使用するには、設定でGemini APIキーを設定してください。
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                設定に移動
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-6 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    ニュースAIアシスタント
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    最新ニュースについて何でもお聞きください
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Globe size={14} />
                  <span>{newsItems.length}件のニュース</span>
                </div>
                <button
                  onClick={clearChat}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="チャットをクリア"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Chat Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Messages */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot size={20} className="text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : ''}`}>
                      <div
                        className={`rounded-2xl p-4 ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white'
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </div>
                        
                        {message.type === 'ai' && (
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Clock size={12} />
                              <span>{message.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(message.content, message.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                              title="コピー"
                            >
                              {copiedMessageId === message.id ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">💡 こんな質問もできます：</p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related News */}
                      {message.newsContext && message.newsContext.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={14} className="text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">関連ニュース</span>
                          </div>
                          <div className="space-y-2">
                            {message.newsContext.slice(0, 3).map((news, index) => (
                              <div key={index} className="text-sm">
                                <a
                                  href={`/?article=${encodeURIComponent(news.link)}`}
                                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink size={12} />
                                  {news.title}
                                </a>
                                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                  {news.source} • {new Date(news.pubDate).toLocaleDateString('ja-JP')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {message.type === 'user' && (
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Loader2 size={16} className="animate-spin" />
                      <span>AIが回答を生成中...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="ニュースについて質問してください..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <MessageCircle size={18} className="text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  送信
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AINewsChat;

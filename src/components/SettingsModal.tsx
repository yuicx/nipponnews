import React, { useState, useEffect } from 'react';
import { X, Bell, Settings as SettingsIcon, Moon, Sun, Layout, Type, Smartphone, Shield, Eye, Volume2, VolumeX, Vibrate, Clock, Globe, RefreshCw, Image, FileText, Hash, Contrast, Zap, Brain, Sparkles, Key, Plus, Trash2 } from 'lucide-react';
import { getUserSettings, saveUserSettings, UserSettings } from '../services/settingsService';
import { checkNotificationPermission } from '../services/notificationService';
import { appIcons, getSelectedIcon, setSelectedIcon } from '../services/pwaService';
import { feedCategories } from '../services/rssService';
import { geminiService } from '../services/geminiService';
import IconSelector from './IconSelector';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<UserSettings>(getUserSettings());
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences' | 'privacy' | 'pwa' | 'ai'>('notifications');
  const [keyword, setKeyword] = useState('');
  const [selectedIconId, setSelectedIconId] = useState(getSelectedIcon().id);
  const [newTopic, setNewTopic] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getUserSettings());
      setSelectedIconId(getSelectedIcon().id);
    }
  }, [isOpen]);

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
    
    // Update Gemini service configuration
    if (newSettings.ai.geminiApiKey) {
      geminiService.setConfig({
        apiKey: newSettings.ai.geminiApiKey,
        model: newSettings.ai.model
      });
    }
  };

  const handleNotificationToggle = async () => {
    if (!settings.notifications.enabled) {
      const permitted = await checkNotificationPermission();
      if (!permitted) {
        return;
      }
    }

    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        enabled: !settings.notifications.enabled
      }
    };
    updateSettings(newSettings);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const categories = settings.notifications.categories;
    const newCategories = categories.includes(categoryId)
      ? categories.filter(id => id !== categoryId)
      : [...categories, categoryId];

    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        categories: newCategories
      }
    };
    updateSettings(newSettings);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        keywords: [...settings.notifications.keywords, keyword.trim()]
      }
    };
    updateSettings(newSettings);
    setKeyword('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        keywords: settings.notifications.keywords.filter(k => k !== keyword)
      }
    };
    updateSettings(newSettings);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    };
    updateSettings(newSettings);
  };

  const handleNotificationSettingChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    };
    updateSettings(newSettings);
  };

  const handleQuietHoursChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        quietHours: {
          ...settings.notifications.quietHours,
          [key]: value
        }
      }
    };
    updateSettings(newSettings);
  };

  const handlePrivacyChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value
      }
    };
    updateSettings(newSettings);
  };

  const handleAISettingChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      ai: {
        ...settings.ai,
        [key]: value
      }
    };
    updateSettings(newSettings);
  };

  const handleInterestChange = (type: 'topics' | 'keywords' | 'categories', items: string[]) => {
    const newSettings = {
      ...settings,
      ai: {
        ...settings.ai,
        interests: {
          ...settings.ai.interests,
          [type]: items
        }
      }
    };
    updateSettings(newSettings);
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    
    const updatedTopics = [...settings.ai.interests.topics, newTopic.trim()];
    handleInterestChange('topics', updatedTopics);
    setNewTopic('');
  };

  const handleAddInterestKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    
    const updatedKeywords = [...settings.ai.interests.keywords, newKeyword.trim()];
    handleInterestChange('keywords', updatedKeywords);
    setNewKeyword('');
  };

  const handleRemoveTopic = (topic: string) => {
    const updatedTopics = settings.ai.interests.topics.filter(t => t !== topic);
    handleInterestChange('topics', updatedTopics);
  };

  const handleRemoveInterestKeyword = (keyword: string) => {
    const updatedKeywords = settings.ai.interests.keywords.filter(k => k !== keyword);
    handleInterestChange('keywords', updatedKeywords);
  };

  const handleIconSelect = (iconId: string) => {
    setSelectedIconId(iconId);
    setSelectedIcon(iconId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">設定</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'text-[#CC0000] border-b-2 border-[#CC0000] bg-red-50 dark:bg-red-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <span className="flex items-center justify-center gap-2">
              <Bell size={18} />
              通知設定
            </span>
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'text-[#CC0000] border-b-2 border-[#CC0000] bg-red-50 dark:bg-red-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            <span className="flex items-center justify-center gap-2">
              <SettingsIcon size={18} />
              表示設定
            </span>
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors whitespace-nowrap ${
              activeTab === 'ai'
                ? 'text-[#CC0000] border-b-2 border-[#CC0000] bg-red-50 dark:bg-red-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('ai')}
          >
            <span className="flex items-center justify-center gap-2">
              <Brain size={18} />
              AI設定
            </span>
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'text-[#CC0000] border-b-2 border-[#CC0000] bg-red-50 dark:bg-red-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('privacy')}
          >
            <span className="flex items-center justify-center gap-2">
              <Shield size={18} />
              プライバシー
            </span>
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'text-[#CC0000] border-b-2 border-[#CC0000] bg-red-50 dark:bg-red-900/20'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('pwa')}
          >
            <span className="flex items-center justify-center gap-2">
              <Smartphone size={18} />
              アプリ設定
            </span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] bg-white dark:bg-gray-800">
          {activeTab === 'notifications' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">通知を有効にする</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">最新のニュースをお知らせします</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifications.enabled}
                    onChange={handleNotificationToggle}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {settings.notifications.sound ? <Volume2 size={18} className="text-gray-600 dark:text-gray-300" /> : <VolumeX size={18} className="text-gray-600 dark:text-gray-300" />}
                    <span className="text-gray-800 dark:text-white">通知音</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.notifications.sound}
                      onChange={(e) => handleNotificationSettingChange('sound', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Vibrate size={18} className="text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-800 dark:text-white">バイブレーション</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.notifications.vibration}
                      onChange={(e) => handleNotificationSettingChange('vibration', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">通知頻度</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'instant', label: '即座に', icon: Zap },
                    { value: 'hourly', label: '1時間毎', icon: Clock },
                    { value: 'daily', label: '1日1回', icon: Clock }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleNotificationSettingChange('frequency', value)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                        settings.notifications.frequency === value
                          ? 'border-[#CC0000] text-[#CC0000] bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">サイレント時間</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.notifications.quietHours.enabled}
                      onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                  </label>
                </div>
                {settings.notifications.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">開始時刻</label>
                      <input
                        type="time"
                        value={settings.notifications.quietHours.start}
                        onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">終了時刻</label>
                      <input
                        type="time"
                        value={settings.notifications.quietHours.end}
                        onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">通知を受け取るカテゴリー</h3>
                <div className="grid grid-cols-2 gap-2">
                  {feedCategories.map(category => (
                    <label key={category.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.notifications.categories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="rounded border-gray-300 text-[#CC0000] focus:ring-[#CC0000]"
                      />
                      <span className="text-gray-800 dark:text-gray-300">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">キーワード通知</h3>
                <form onSubmit={handleAddKeyword} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="キーワードを入力"
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="bg-[#CC0000] text-white px-4 py-2 rounded-lg hover:bg-[#CC0000]/90 transition-colors"
                  >
                    追加
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {settings.notifications.keywords.map((k: string) => (
                    <span
                      key={k}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {k}
                      <button
                        onClick={() => handleRemoveKeyword(k)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'ai' ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 mb-2">
                  <Sparkles size={20} />
                  <h3 className="text-lg font-medium">AI機能について</h3>
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                  Google Gemini AIを使用してニュースの要約と個人化された推薦を提供します。
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">APIキーの取得方法：</h4>
                  <ol className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>1. <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">Google AI Studio</a> にアクセス</li>
                    <li>2. Googleアカウントでログイン</li>
                    <li>3. 「Create API Key」をクリック</li>
                    <li>4. 生成されたAPIキーをコピーして下記に入力</li>
                  </ol>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Key size={16} className="inline mr-1" />
                  Gemini API キー
                </label>
                <div className="relative">
                  <input
                    type={apiKeyVisible ? 'text' : 'password'}
                    value={settings.ai.geminiApiKey}
                    onChange={(e) => handleAISettingChange('geminiApiKey', e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  APIキーはブラウザにのみ保存され、外部に送信されません
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AIモデル</label>
                <select
                  value={settings.ai.model}
                  onChange={(e) => handleAISettingChange('model', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (推奨)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">AI要約機能</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">記事の要約と重要ポイントを表示</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.ai.enableSummary}
                      onChange={(e) => handleAISettingChange('enableSummary', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">AI推薦機能</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">興味に基づいたニュース推薦</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.ai.enableRecommendations}
                      onChange={(e) => handleAISettingChange('enableRecommendations', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              </div>

              {(settings.ai.enableSummary || settings.ai.enableRecommendations) && (
                <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">興味・関心の設定</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        興味のあるトピック
                      </label>
                      <form onSubmit={handleAddTopic} className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="例: テクノロジー、スポーツ、政治"
                          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          type="submit"
                          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1"
                        >
                          <Plus size={16} />
                          追加
                        </button>
                      </form>
                      <div className="flex flex-wrap gap-2">
                        {settings.ai.interests.topics.map((topic) => (
                          <span
                            key={topic}
                            className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                          >
                            {topic}
                            <button
                              onClick={() => handleRemoveTopic(topic)}
                              className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200"
                            >
                              <Trash2 size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        キーワード
                      </label>
                      <form onSubmit={handleAddInterestKeyword} className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="例: AI、環境問題、経済"
                          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          type="submit"
                          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1"
                        >
                          <Plus size={16} />
                          追加
                        </button>
                      </form>
                      <div className="flex flex-wrap gap-2">
                        {settings.ai.interests.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                          >
                            {keyword}
                            <button
                              onClick={() => handleRemoveInterestKeyword(keyword)}
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                            >
                              <Trash2 size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        関心のあるカテゴリー
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {feedCategories.map(category => (
                          <label key={category.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={settings.ai.interests.categories.includes(category.id)}
                              onChange={(e) => {
                                const categories = settings.ai.interests.categories;
                                const newCategories = e.target.checked
                                  ? [...categories, category.id]
                                  : categories.filter(id => id !== category.id);
                                handleInterestChange('categories', newCategories);
                              }}
                              className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                            />
                            <span className="text-gray-800 dark:text-gray-300">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'preferences' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">外観</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">テーマ</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreferenceChange('darkMode', false)}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                          !settings.preferences.darkMode
                            ? 'border-[#CC0000] text-[#CC0000] bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <Sun size={18} />
                        ライト
                      </button>
                      <button
                        onClick={() => handlePreferenceChange('darkMode', true)}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                          settings.preferences.darkMode
                            ? 'border-[#CC0000] text-[#CC0000] bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <Moon size={18} />
                        ダーク
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">文字サイズ</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'small', label: '小', size: 14 },
                        { value: 'medium', label: '中', size: 18 },
                        { value: 'large', label: '大', size: 22 }
                      ].map(({ value, label, size }) => (
                        <button
                          key={value}
                          onClick={() => handlePreferenceChange('fontSize', value)}
                          className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                            settings.preferences.fontSize === value
                              ? 'border-[#CC0000] text-[#CC0000] bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                          }`}
                        >
                          <Type size={size} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">レイアウト</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'compact', label: 'コンパクト', icon: Layout },
                    { value: 'comfortable', label: 'ゆったり', icon: Layout },
                    { value: 'magazine', label: '雑誌風', icon: Layout }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handlePreferenceChange('layout', value)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                        settings.preferences.layout === value
                          ? 'border-[#CC0000] text-[#CC0000] bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">表示オプション</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image size={18} className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-800 dark:text-white">画像を表示</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.preferences.showImages}
                        onChange={(e) => handlePreferenceChange('showImages', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-800 dark:text-white">要約を表示</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.preferences.showSummary}
                        onChange={(e) => handlePreferenceChange('showSummary', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={18} className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-800 dark:text-white">自動更新</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.preferences.autoRefresh}
                        onChange={(e) => handlePreferenceChange('autoRefresh', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye size={18} className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-800 dark:text-white">読みやすさモード</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.preferences.readingMode}
                        onChange={(e) => handlePreferenceChange('readingMode', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Contrast size={18} className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-800 dark:text-white">高コントラスト</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.preferences.highContrast}
                        onChange={(e) => handlePreferenceChange('highContrast', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={18} className="text-gray-600 dark:text-gray-300" />
                      <span className="text-gray-800 dark:text-white">アニメーション軽減</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.preferences.reducedMotion}
                        onChange={(e) => handlePreferenceChange('reducedMotion', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">コンテンツ設定</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Hash size={16} className="inline mr-1" />
                      ページあたりの記事数
                    </label>
                    <select
                      value={settings.preferences.articlesPerPage}
                      onChange={(e) => handlePreferenceChange('articlesPerPage', parseInt(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] dark:bg-gray-700 dark:text-white"
                    >
                      <option value={10}>10記事</option>
                      <option value={20}>20記事</option>
                      <option value={30}>30記事</option>
                      <option value={50}>50記事</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Globe size={16} className="inline mr-1" />
                      言語
                    </label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] dark:bg-gray-700 dark:text-white"
                    >
                      <option value="ja">日本語</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>

              {settings.preferences.autoRefresh && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <RefreshCw size={16} className="inline mr-1" />
                    更新間隔
                  </label>
                  <select
                    value={settings.preferences.refreshInterval}
                    onChange={(e) => handlePreferenceChange('refreshInterval', parseInt(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000] dark:bg-gray-700 dark:text-white"
                  >
                    <option value={60000}>1分</option>
                    <option value={300000}>5分</option>
                    <option value={600000}>10分</option>
                    <option value={1800000}>30分</option>
                    <option value={3600000}>1時間</option>
                  </select>
                </div>
              )}
            </div>
          ) : activeTab === 'privacy' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">プライバシー設定</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">分析データの収集</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">アプリの改善のため、匿名の使用データを収集します</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.privacy.analytics}
                        onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Cookieの使用</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">設定の保存とサイト機能の向上のためCookieを使用します</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.privacy.cookies}
                        onChange={(e) => handlePrivacyChange('cookies', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">パーソナライズ広告</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">興味に基づいた広告の表示を許可します</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.privacy.personalizedAds}
                        onChange={(e) => handlePrivacyChange('personalizedAds', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">データ収集</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">サービス向上のため、読書履歴などのデータを収集します</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.privacy.dataCollection}
                        onChange={(e) => handlePrivacyChange('dataCollection', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#CC0000]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#CC0000]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">データ管理</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <h4 className="font-medium text-gray-800 dark:text-white">データのエクスポート</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">保存された設定とデータをダウンロードします</p>
                  </button>
                  <button className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <h4 className="font-medium text-gray-800 dark:text-white">キャッシュのクリア</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">保存されたニュースデータを削除します</p>
                  </button>
                  <button className="w-full text-left p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    <h4 className="font-medium text-red-600 dark:text-red-400">すべてのデータを削除</h4>
                    <p className="text-sm text-red-500 dark:text-red-400">設定、履歴、保存データをすべて削除します</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <IconSelector
                icons={appIcons}
                selectedIconId={selectedIconId}
                onIconSelect={handleIconSelect}
              />
              
              <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">PWA について</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">プログレッシブウェブアプリ (PWA)</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• ホーム画面に追加してアプリのように使用できます</li>
                    <li>• オフラインでも一部の機能が利用可能です</li>
                    <li>• プッシュ通知でニュースをお知らせします</li>
                    <li>• 高速で軽量なアプリ体験を提供します</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

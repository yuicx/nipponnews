import React, { useState, useEffect } from 'react';
import { X, Bell, Settings as SettingsIcon, Moon, Sun, Layout, Type } from 'lucide-react';
import { getUserSettings, saveUserSettings, checkNotificationPermission } from '../services/notificationService';
import { feedCategories } from '../services/rssService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(getUserSettings());
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSettings(getUserSettings());
    }
  }, [isOpen]);

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
    setSettings(newSettings);
    saveUserSettings(newSettings);
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
    setSettings(newSettings);
    saveUserSettings(newSettings);
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
    setSettings(newSettings);
    saveUserSettings(newSettings);
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
    setSettings(newSettings);
    saveUserSettings(newSettings);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    };
    setSettings(newSettings);
    saveUserSettings(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">設定</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'text-[#CC0000] border-b-2 border-[#CC0000]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <span className="flex items-center justify-center gap-2">
              <Bell size={18} />
              通知設定
            </span>
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'text-[#CC0000] border-b-2 border-[#CC0000]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            <span className="flex items-center justify-center gap-2">
              <SettingsIcon size={18} />
              表示設定
            </span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'notifications' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">通知を有効にする</h3>
                  <p className="text-sm text-gray-500">最新のニュースをお知らせします</p>
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

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">通知を受け取るカテゴリー</h3>
                <div className="space-y-2">
                  {feedCategories.map(category => (
                    <label key={category.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.notifications.categories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="rounded border-gray-300 text-[#CC0000] focus:ring-[#CC0000]"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">キーワード通知</h3>
                <form onSubmit={handleAddKeyword} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="キーワードを入力"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#CC0000]"
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
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {k}
                      <button
                        onClick={() => handleRemoveKeyword(k)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">テーマ</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => handlePreferenceChange('darkMode', false)}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border ${
                      !settings.preferences.darkMode
                        ? 'border-[#CC0000] text-[#CC0000]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <Sun size={18} />
                    ライト
                  </button>
                  <button
                    onClick={() => handlePreferenceChange('darkMode', true)}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border ${
                      settings.preferences.darkMode
                        ? 'border-[#CC0000] text-[#CC0000]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <Moon size={18} />
                    ダーク
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">文字サイズ</h3>
                <div className="flex gap-4">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => handlePreferenceChange('fontSize', size)}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border ${
                        settings.preferences.fontSize === size
                          ? 'border-[#CC0000] text-[#CC0000]'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      <Type size={size === 'small' ? 14 : size === 'medium' ? 18 : 22} />
                      {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">レイアウト</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => handlePreferenceChange('layout', 'compact')}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border ${
                      settings.preferences.layout === 'compact'
                        ? 'border-[#CC0000] text-[#CC0000]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <Layout size={18} />
                    コンパクト
                  </button>
                  <button
                    onClick={() => handlePreferenceChange('layout', 'comfortable')}
                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border ${
                      settings.preferences.layout === 'comfortable'
                        ? 'border-[#CC0000] text-[#CC0000]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <Layout size={18} />
                    ゆったり
                  </button>
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

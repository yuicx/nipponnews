import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  Palette, 
  Shield, 
  Brain,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Save,
  Settings
} from 'lucide-react';
import { getUserSettings, saveUserSettings, UserSettings } from '../services/settingsService';
import { appIcons, getSelectedIcon, setSelectedIcon } from '../services/pwaService';
import IconSelector from './IconSelector';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('preferences');
  const [settings, setSettings] = useState<UserSettings>(getUserSettings());
  const [showApiKey, setShowApiKey] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedIcon, setSelectedIconState] = useState(getSelectedIcon().id);

  useEffect(() => {
    if (isOpen) {
      setSettings(getUserSettings());
      setSelectedIconState(getSelectedIcon().id);
    }
  }, [isOpen]);

  const handleSave = () => {
    saveUserSettings(settings);
    setSelectedIcon(selectedIcon);
    onClose();
  };

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const addTopic = () => {
    if (newTopic.trim()) {
      updateSettings('ai.interests.topics', [...settings.ai.interests.topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const removeTopic = (index: number) => {
    const newTopics = settings.ai.interests.topics.filter((_, i) => i !== index);
    updateSettings('ai.interests.topics', newTopics);
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      updateSettings('ai.interests.keywords', [...settings.ai.interests.keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = settings.ai.interests.keywords.filter((_, i) => i !== index);
    updateSettings('ai.interests.keywords', newKeywords);
  };

  const tabs = [
    { id: 'preferences', name: '表示設定', icon: Palette },
    { id: 'notifications', name: '通知設定', icon: Bell },
    { id: 'ai', name: 'AI設定', icon: Brain },
    { id: 'privacy', name: 'プライバシー', icon: Shield },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Settings className="text-[#CC0000]" size={24} />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">設定</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex">
              <div className="w-64 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-[#CC0000] text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">表示設定</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">ダークモード</span>
                            <input
                              type="checkbox"
                              checked={settings.preferences.darkMode}
                              onChange={(e) => updateSettings('preferences.darkMode', e.target.checked)}
                              className="toggle"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">画像を表示</span>
                            <input
                              type="checkbox"
                              checked={settings.preferences.showImages}
                              onChange={(e) => updateSettings('preferences.showImages', e.target.checked)}
                              className="toggle"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">要約を表示</span>
                            <input
                              type="checkbox"
                              checked={settings.preferences.showSummary}
                              onChange={(e) => updateSettings('preferences.showSummary', e.target.checked)}
                              className="toggle"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">自動更新</span>
                            <input
                              type="checkbox"
                              checked={settings.preferences.autoRefresh}
                              onChange={(e) => updateSettings('preferences.autoRefresh', e.target.checked)}
                              className="toggle"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">高コントラスト</span>
                            <input
                              type="checkbox"
                              checked={settings.preferences.highContrast}
                              onChange={(e) => updateSettings('preferences.highContrast', e.target.checked)}
                              className="toggle"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">アニメーション削減</span>
                            <input
                              type="checkbox"
                              checked={settings.preferences.reducedMotion}
                              onChange={(e) => updateSettings('preferences.reducedMotion', e.target.checked)}
                              className="toggle"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">フォントサイズ</label>
                          <select
                            value={settings.preferences.fontSize}
                            onChange={(e) => updateSettings('preferences.fontSize', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          >
                            <option value="small">小</option>
                            <option value="medium">中</option>
                            <option value="large">大</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">レイアウト</label>
                          <select
                            value={settings.preferences.layout}
                            onChange={(e) => updateSettings('preferences.layout', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          >
                            <option value="compact">コンパクト</option>
                            <option value="comfortable">快適</option>
                            <option value="magazine">雑誌風</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            記事表示数: {settings.preferences.articlesPerPage}
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="50"
                            step="5"
                            value={settings.preferences.articlesPerPage}
                            onChange={(e) => updateSettings('preferences.articlesPerPage', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <IconSelector
                      icons={appIcons}
                      selectedIconId={selectedIcon}
                      onIconSelect={setSelectedIconState}
                    />
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">通知設定</h3>
                      
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">通知を有効にする</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.enabled}
                            onChange={(e) => updateSettings('notifications.enabled', e.target.checked)}
                            className="toggle"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">サウンド</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.sound}
                            onChange={(e) => updateSettings('notifications.sound', e.target.checked)}
                            className="toggle"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">バイブレーション</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications.vibration}
                            onChange={(e) => updateSettings('notifications.vibration', e.target.checked)}
                            className="toggle"
                          />
                        </label>

                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">通知頻度</label>
                          <select
                            value={settings.notifications.frequency}
                            onChange={(e) => updateSettings('notifications.frequency', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          >
                            <option value="instant">即座</option>
                            <option value="hourly">1時間ごと</option>
                            <option value="daily">1日1回</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">AI設定</h3>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                          🤖 Gemini API の設定方法
                        </h4>
                        <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>1. <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Google AI Studio</a> にアクセス</li>
                          <li>2. Googleアカウントでログイン</li>
                          <li>3. 「Create API Key」をクリック</li>
                          <li>4. 生成されたAPIキーを下記に入力</li>
                        </ol>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            Gemini API キー
                          </label>
                          <div className="relative">
                            <input
                              type={showApiKey ? 'text' : 'password'}
                              value={settings.ai.geminiApiKey}
                              onChange={(e) => updateSettings('ai.geminiApiKey', e.target.value)}
                              placeholder="AIzaSy..."
                              className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-2">AIモデル</label>
                          <select
                            value={settings.ai.model}
                            onChange={(e) => updateSettings('ai.model', e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          >
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash (推奨)</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                            <option value="gemini-pro">Gemini Pro</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">AI要約機能</span>
                            <input
                              type="checkbox"
                              checked={settings.ai.enableSummary}
                              onChange={(e) => updateSettings('ai.enableSummary', e.target.checked)}
                              className="toggle"
                            />
                          </label>

                          <label className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">AI推薦機能</span>
                            <input
                              type="checkbox"
                              checked={settings.ai.enableRecommendations}
                              onChange={(e) => updateSettings('ai.enableRecommendations', e.target.checked)}
                              className="toggle"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-800 dark:text-white mb-4">興味・関心の設定</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">興味のあるトピック</label>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="例: テクノロジー、スポーツ、政治"
                                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                              />
                              <button
                                onClick={addTopic}
                                className="px-4 py-2 bg-[#CC0000] text-white rounded-lg hover:bg-[#AA0000] transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {settings.ai.interests.topics.map((topic, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                >
                                  {topic}
                                  <button
                                    onClick={() => removeTopic(index)}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">キーワード</label>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                placeholder="例: AI、環境問題、経済"
                                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                              />
                              <button
                                onClick={addKeyword}
                                className="px-4 py-2 bg-[#CC0000] text-white rounded-lg hover:bg-[#AA0000] transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {settings.ai.interests.keywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                                >
                                  {keyword}
                                  <button
                                    onClick={() => removeKeyword(index)}
                                    className="text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">プライバシー設定</h3>
                      
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">分析データの収集</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">アプリの改善のための匿名データ</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.privacy.analytics}
                            onChange={(e) => updateSettings('privacy.analytics', e.target.checked)}
                            className="toggle"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">Cookieの使用</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">設定の保存とサイト機能の向上</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.privacy.cookies}
                            onChange={(e) => updateSettings('privacy.cookies', e.target.checked)}
                            className="toggle"
                          />
                        </label>

                        <label className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-700 dark:text-gray-300">データ収集</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">サービス向上のためのデータ収集</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.privacy.dataCollection}
                            onChange={(e) => updateSettings('privacy.dataCollection', e.target.checked)}
                            className="toggle"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-[#CC0000] text-white rounded-lg hover:bg-[#AA0000] transition-colors"
              >
                <Save size={16} />
                保存
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;

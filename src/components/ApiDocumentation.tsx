import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Copy, 
  Check, 
  ExternalLink, 
  Book, 
  Zap, 
  Globe, 
  Search,
  Activity,
  Shield
} from 'lucide-react';

const ApiDocumentation: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const baseUrl = 'https://nipponnews.vercel.app';

  const endpoints = [
    {
      method: 'GET',
      path: '/api/news/search',
      description: 'ニュース記事を検索',
      params: [
        { name: 'q', type: 'string', description: '検索クエリ (必須)' },
        { name: 'limit', type: 'number', description: '取得件数 (デフォルト: 20)' },
        { name: 'page', type: 'number', description: 'ページ番号 (デフォルト: 1)' },
        { name: 'category', type: 'string', description: 'カテゴリでフィルタ' }
      ],
      example: `${baseUrl}/api/news/search?q=AI&limit=5`
    },
    {
      method: 'GET',
      path: '/api/health',
      description: 'API健康状態チェック',
      params: [],
      example: `${baseUrl}/api/health`
    }
  ];

  const codeExamples = {
    javascript: `// JavaScript/Node.js での使用例

// ニュース検索
async function searchNews(query, limit = 10) {
  try {
    const response = await fetch(\`${baseUrl}/api/news/search?q=\${encodeURIComponent(query)}&limit=\${limit}\`);
    const data = await response.json();
    
    if (data.success) {
      console.log(\`検索結果: \${data.data.total}件\`);
      console.log(\`検索時間: \${data.data.searchTime}ms\`);
      
      data.data.articles.forEach(article => {
        console.log(\`[\${article.source}] \${article.title}\`);
      });
      
      return data.data.articles;
    } else {
      console.error('検索エラー:', data.error);
      return [];
    }
  } catch (error) {
    console.error('APIエラー:', error);
    return [];
  }
}

// API健康状態チェック
async function checkApiHealth() {
  try {
    const response = await fetch('${baseUrl}/api/health');
    const data = await response.json();
    
    console.log('API状態:', data.data.status);
    console.log('稼働時間:', data.data.uptime + 'ms');
    
    return data.data.status === 'healthy';
  } catch (error) {
    console.error('ヘルスチェックエラー:', error);
    return false;
  }
}

// 使用例
searchNews('AI技術').then(articles => {
  console.log('取得した記事:', articles.length);
});`,

    python: `# Python での使用例
import requests
import urllib.parse

def search_news(query, limit=10, category=None):
    """ニュースを検索する"""
    url = '${baseUrl}/api/news/search'
    params = {
        'q': query,
        'limit': limit
    }
    
    if category:
        params['category'] = category
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['success']:
            print(f"検索結果: {data['data']['total']}件")
            print(f"検索時間: {data['data']['searchTime']}ms")
            
            for article in data['data']['articles']:
                print(f"[{article['source']}] {article['title']}")
            
            return data['data']['articles']
        else:
            print(f"検索エラー: {data['error']}")
            return []
            
    except Exception as e:
        print(f"APIエラー: {e}")
        return []

def check_api_health():
    """API健康状態をチェック"""
    try:
        response = requests.get('${baseUrl}/api/health')
        data = response.json()
        
        print(f"API状態: {data['data']['status']}")
        print(f"稼働時間: {data['data']['uptime']}ms")
        
        return data['data']['status'] == 'healthy'
        
    except Exception as e:
        print(f"ヘルスチェックエラー: {e}")
        return False

# 使用例
articles = search_news('AI技術', limit=5)
print(f"取得した記事: {len(articles)}件")

# API健康状態チェック
is_healthy = check_api_health()
print(f"API正常: {is_healthy}")`,

    curl: `# cURL での使用例

# ニュース検索
curl "${baseUrl}/api/news/search?q=AI&limit=10"

# カテゴリ指定検索
curl "${baseUrl}/api/news/search?q=経済&category=business&limit=5"

# API健康状態チェック
curl "${baseUrl}/api/health"

# 詳細な検索（ページネーション）
curl "${baseUrl}/api/news/search?q=スポーツ&limit=20&page=2"`
  };

  const responseExample = {
    success: true,
    data: {
      articles: [
        {
          id: "12345",
          title: "AI技術の最新動向について",
          url: "https://example.com/news/12345",
          publishedAt: "2024-01-15T10:30:00Z",
          summary: "人工知能技術の最新の発展について詳しく解説...",
          source: "Tech News",
          category: "IT"
        }
      ],
      total: 150,
      page: 1,
      limit: 20,
      hasMore: true,
      query: "AI",
      searchTime: 45
    },
    timestamp: "2024-01-15T10:30:00Z",
    version: "1.0.0"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Code size={32} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                ニッポンニュース API
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              ニュース検索とAPI監視のための軽量API
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Zap size={16} className="text-yellow-500" />
                <span>高速検索</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe size={16} className="text-blue-500" />
                <span>無料</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={16} className="text-green-500" />
                <span>安全</span>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'overview', label: '概要', icon: Book },
              { id: 'endpoints', label: 'エンドポイント', icon: Globe },
              { id: 'examples', label: 'コード例', icon: Code },
              { id: 'response', label: 'レスポンス', icon: Activity }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {activeTab === 'overview' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">API概要</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-3">
                      🔍 検索機能
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• キーワードによるニュース検索</li>
                      <li>• カテゴリ別フィルタリング</li>
                      <li>• ページネーション対応</li>
                      <li>• 高速レスポンス（平均50ms以下）</li>
                      <li>• 検索時間の計測機能</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-3">
                      ⚡ 監視機能
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• API健康状態のリアルタイム監視</li>
                      <li>• 稼働時間の追跡</li>
                      <li>• エンドポイント一覧の提供</li>
                      <li>• バージョン情報の表示</li>
                      <li>• 自動ヘルスチェック</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-300 mb-3">
                    ⚠️ 重要な注意事項
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    このAPIは既存のニュースデータを検索する機能のみを提供します。
                    ニュースデータ自体は各メディアの著作権で保護されており、
                    商用利用の際は各ソースの利用規約をご確認ください。
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                    🔗 ベースURL
                  </h3>
                  <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono">
                    {baseUrl}/api
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'endpoints' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">エンドポイント一覧</h2>
                
                <div className="space-y-6">
                  {endpoints.map((endpoint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {endpoint.method}
                        </span>
                        <code className="text-lg font-mono text-gray-800 dark:text-white">
                          {endpoint.path}
                        </code>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {endpoint.description}
                      </p>

                      {endpoint.params.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-bold text-gray-800 dark:text-white mb-2">パラメータ:</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                  <th className="text-left py-2 text-gray-600 dark:text-gray-300">名前</th>
                                  <th className="text-left py-2 text-gray-600 dark:text-gray-300">型</th>
                                  <th className="text-left py-2 text-gray-600 dark:text-gray-300">説明</th>
                                </tr>
                              </thead>
                              <tbody>
                                {endpoint.params.map((param, i) => (
                                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="py-2 font-mono text-blue-600 dark:text-blue-400">{param.name}</td>
                                    <td className="py-2 text-gray-500 dark:text-gray-400">{param.type}</td>
                                    <td className="py-2 text-gray-600 dark:text-gray-300">{param.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">例:</span>
                          <button
                            onClick={() => copyToClipboard(endpoint.example, `endpoint-${index}`)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            {copiedCode === `endpoint-${index}` ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                        <code className="text-sm text-blue-600 dark:text-blue-400 break-all">
                          {endpoint.example}
                        </code>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">コード例</h2>
                
                <div className="space-y-6">
                  {Object.entries(codeExamples).map(([language, code]) => (
                    <div key={language} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {language === 'javascript' ? 'JavaScript' : language === 'python' ? 'Python' : 'cURL'}
                        </span>
                        <button
                          onClick={() => copyToClipboard(code, language)}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {copiedCode === language ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <pre className="bg-gray-900 text-green-400 p-4 overflow-x-auto text-sm">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'response' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">レスポンス形式</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">標準レスポンス</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    すべてのAPIエンドポイントは以下の形式でレスポンスを返します：
                  </p>
                </div>

                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                    <span className="text-green-400 font-medium">JSON Response</span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(responseExample, null, 2), 'response')}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      {copiedCode === 'response' ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <pre className="text-green-400 p-4 overflow-x-auto text-sm">
                    <code>{JSON.stringify(responseExample, null, 2)}</code>
                  </pre>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">成功レスポンス</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• <code>success: true</code></li>
                      <li>• <code>data</code>: 要求されたデータ</li>
                      <li>• <code>timestamp</code>: レスポンス時刻</li>
                      <li>• <code>version</code>: APIバージョン</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <h4 className="font-bold text-red-700 dark:text-red-300 mb-2">エラーレスポンス</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• <code>success: false</code></li>
                      <li>• <code>error</code>: エラーメッセージ</li>
                      <li>• <code>timestamp</code>: レスポンス時刻</li>
                      <li>• <code>version</code>: APIバージョン</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              🔍 今すぐ検索してみよう！
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              認証不要で今すぐニュース検索APIを使い始めることができます
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`${baseUrl}/api/news/search?q=AI&limit=5`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Search size={18} />
                検索APIを試す
              </a>
              <a
                href={`${baseUrl}/api/health`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Activity size={18} />
                ヘルスチェック
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;

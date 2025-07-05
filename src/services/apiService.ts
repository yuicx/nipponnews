export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  version: string;
}

export interface SearchResult {
  articles: {
    id: string;
    title: string;
    url: string;
    publishedAt: string;
    summary?: string;
    source: string;
    category: string;
  }[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  query: string;
  searchTime: number;
}

export interface HealthStatus {
  status: string;
  uptime: number;
  version: string;
  endpoints: string[];
  lastUpdated: string;
}

const API_VERSION = '1.0.0';

class NipponNewsApiService {
  private createResponse<T>(data: T, success: boolean = true, error?: string): ApiResponse<T> {
    return {
      success,
      data: success ? data : undefined,
      error: error,
      timestamp: new Date().toISOString(),
      version: API_VERSION
    };
  }

  private extractTags(text: string): string[] {
    const commonTags = [
      '政治', '経済', 'スポーツ', 'エンタメ', 'IT', '科学', '国際', '社会',
      '新型コロナ', 'AI', '株価', '円安', '選挙', 'オリンピック', '地震',
      '台風', '気候変動', 'DX', 'NFT', '仮想通貨', 'メタバース'
    ];

    return commonTags.filter(tag => 
      text.toLowerCase().includes(tag.toLowerCase())
    ).slice(0, 5);
  }

  // GET /api/news/search - ニュース検索
  async searchNews(params: {
    q: string;
    limit?: number;
    page?: number;
    category?: string;
  }): Promise<ApiResponse<SearchResult>> {
    try {
      const { q, limit = 20, page = 1, category } = params;
      
      if (!q || q.trim().length === 0) {
        return this.createResponse(null, false, '検索クエリが必要です');
      }

      const startTime = Date.now();
      const { searchNews } = await import('./rssService');
      
      let searchResults = await searchNews(q);

      // Filter by category if specified
      if (category && category !== 'all') {
        const { feedCategories } = await import('./rssService');
        const categoryInfo = feedCategories.find(cat => cat.id === category);
        if (categoryInfo) {
          searchResults = searchResults.filter(item => 
            item.source === categoryInfo.source
          );
        }
      }

      const searchTime = Date.now() - startTime;

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = searchResults.slice(startIndex, endIndex);

      const apiItems = paginatedResults.map(item => ({
        id: item.id,
        title: item.title,
        url: item.link,
        publishedAt: item.pubDate,
        summary: item.contentSnippet,
        source: item.source,
        category: category || 'すべて'
      }));

      const response: SearchResult = {
        articles: apiItems,
        total: searchResults.length,
        page,
        limit,
        hasMore: endIndex < searchResults.length,
        query: q,
        searchTime
      };

      return this.createResponse(response);
    } catch (error) {
      return this.createResponse(null, false, `検索エラー: ${error}`);
    }
  }

  // GET /api/health - API健康状態チェック
  async getHealthStatus(): Promise<ApiResponse<HealthStatus>> {
    try {
      // Test search functionality
      const testSearch = await this.searchNews({ q: 'test', limit: 1 });
      const isSearchWorking = testSearch.success;

      const healthData: HealthStatus = {
        status: isSearchWorking ? 'healthy' : 'degraded',
        uptime: performance.now(),
        version: API_VERSION,
        endpoints: [
          'GET /api/news/search',
          'GET /api/health'
        ],
        lastUpdated: new Date().toISOString()
      };

      return this.createResponse(healthData);
    } catch (error) {
      const healthData: HealthStatus = {
        status: 'unhealthy',
        uptime: performance.now(),
        version: API_VERSION,
        endpoints: [
          'GET /api/news/search',
          'GET /api/health'
        ],
        lastUpdated: new Date().toISOString()
      };

      return this.createResponse(healthData, false, `ヘルスチェックエラー: ${error}`);
    }
  }
}

export const nipponNewsApi = new NipponNewsApiService();

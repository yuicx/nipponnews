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
  performance: {
    averageResponseTime: number;
    totalRequests: number;
    successRate: number;
  };
}

const API_VERSION = '1.0.0';

class NipponNewsApiService {
  private startTime = Date.now();
  private requestCount = 0;
  private successCount = 0;
  private totalResponseTime = 0;

  private createResponse<T>(data: T, success: boolean = true, error?: string): ApiResponse<T> {
    this.requestCount++;
    if (success) this.successCount++;
    
    return {
      success,
      data: success ? data : undefined,
      error: error,
      timestamp: new Date().toISOString(),
      version: API_VERSION
    };
  }

  private recordResponseTime(time: number) {
    this.totalResponseTime += time;
  }

  // GET /api/news/search - ニュース検索
  async searchNews(params: {
    q: string;
    limit?: number;
    page?: number;
    category?: string;
  }): Promise<ApiResponse<SearchResult>> {
    const startTime = Date.now();
    
    try {
      const { q, limit = 20, page = 1, category } = params;
      
      if (!q || q.trim().length === 0) {
        return this.createResponse(null, false, '検索クエリが必要です');
      }

      // Dynamic import to avoid issues in Vercel environment
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
      this.recordResponseTime(searchTime);

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
      const responseTime = Date.now() - startTime;
      this.recordResponseTime(responseTime);
      return this.createResponse(null, false, `検索エラー: ${error}`);
    }
  }

  // GET /api/health - API健康状態チェック
  async getHealthStatus(): Promise<ApiResponse<HealthStatus>> {
    const startTime = Date.now();
    
    try {
      // Test search functionality with a simple query
      const testSearch = await this.searchNews({ q: 'ニュース', limit: 1 });
      const isSearchWorking = testSearch.success;

      const uptime = Date.now() - this.startTime;
      const averageResponseTime = this.requestCount > 0 ? this.totalResponseTime / this.requestCount : 0;
      const successRate = this.requestCount > 0 ? (this.successCount / this.requestCount) * 100 : 100;

      const healthData: HealthStatus = {
        status: isSearchWorking ? 'healthy' : 'degraded',
        uptime,
        version: API_VERSION,
        endpoints: [
          'GET /api/news/search',
          'GET /api/health'
        ],
        lastUpdated: new Date().toISOString(),
        performance: {
          averageResponseTime: Math.round(averageResponseTime),
          totalRequests: this.requestCount,
          successRate: Math.round(successRate * 100) / 100
        }
      };

      const responseTime = Date.now() - startTime;
      this.recordResponseTime(responseTime);

      return this.createResponse(healthData);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.recordResponseTime(responseTime);
      
      const healthData: HealthStatus = {
        status: 'unhealthy',
        uptime: Date.now() - this.startTime,
        version: API_VERSION,
        endpoints: [
          'GET /api/news/search',
          'GET /api/health'
        ],
        lastUpdated: new Date().toISOString(),
        performance: {
          averageResponseTime: Math.round(this.totalResponseTime / Math.max(this.requestCount, 1)),
          totalRequests: this.requestCount,
          successRate: Math.round((this.successCount / Math.max(this.requestCount, 1)) * 10000) / 100
        }
      };

      return this.createResponse(healthData, false, `ヘルスチェックエラー: ${error}`);
    }
  }
}

export const nipponNewsApi = new NipponNewsApiService();

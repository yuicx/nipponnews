import type { VercelRequest, VercelResponse } from '@vercel/node';
import { nipponNewsApi } from '../../src/services/apiService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }

  try {
    const { q, limit, page, category } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: '検索クエリ(q)が必要です',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    }

    const searchParams = {
      q: q as string,
      limit: limit ? parseInt(limit as string) : 20,
      page: page ? parseInt(page as string) : 1,
      category: category as string
    };

    const result = await nipponNewsApi.searchNews(searchParams);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
}

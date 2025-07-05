import type { VercelRequest, VercelResponse } from '@vercel/node';
import { nipponNewsApi } from '../src/services/apiService';

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
    const result = await nipponNewsApi.getHealthStatus();
    res.status(200).json(result);
  } catch (error) {
    console.error('Health API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
}

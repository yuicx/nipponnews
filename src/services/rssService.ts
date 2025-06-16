import { NewsItem } from '../types';
import { generateId } from '../utils/stringUtils';

// Updated RSS feeds with the specified URLs
export const feedCategories = [
  { 
    id: 'top', 
    name: 'トップ', 
    url: 'https://news.livedoor.com/topics/rss/top.xml',
    source: 'Livedoor News'
  },
  { 
    id: 'domestic', 
    name: '国内', 
    url: 'https://news.livedoor.com/topics/rss/dom.xml',
    source: 'Livedoor News'
  },
  { 
    id: 'world', 
    name: '国際', 
    url: 'https://news.livedoor.com/topics/rss/int.xml',
    source: 'Livedoor News'
  },
  { 
    id: 'business', 
    name: '経済', 
    url: 'http://www3.nhk.or.jp/rss/news/cat1.xml',
    source: 'NHK News'
  },
  { 
    id: 'entertainment', 
    name: 'エンタメ', 
    url: 'https://www.nhk.or.jp/rss/news/cat2.xml',
    source: 'NHK News'
  },
  { 
    id: 'sports', 
    name: 'スポーツ', 
    url: 'https://www3.nhk.or.jp/rss/news/cat7.xml',
    source: 'NHK News'
  },
  { 
    id: 'it', 
    name: 'IT', 
    url: 'https://news.yahoo.co.jp/rss/topics/it.xml',
    source: 'Yahoo News'
  },
  { 
    id: 'science', 
    name: '科学', 
    url: 'https://news.yahoo.co.jp/rss/topics/science.xml',
    source: 'Yahoo News'
  }
];

// Simple RSS parser without external dependencies
const parseRSSFeed = async (xmlText: string): Promise<any[]> => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const items = xmlDoc.querySelectorAll('item');
  const parsedItems: any[] = [];
  
  items.forEach(item => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    
    parsedItems.push({
      title,
      link,
      pubDate,
      content: description,
      contentSnippet: description.replace(/<[^>]*>/g, '').substring(0, 200)
    });
  });
  
  return parsedItems;
};

export const fetchRssFeed = async (url: string, source: string): Promise<NewsItem[]> => {
  try {
    // Use a more reliable CORS proxy
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const items = await parseRSSFeed(data.contents);
    
    return items.map(item => ({
      id: generateId(),
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      content: item.content || '',
      contentSnippet: item.contentSnippet || '',
      imageUrl: extractImageUrl(item.content || ''),
      source
    }));
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    // Return mock data if RSS fails
    return getMockNews(source);
  }
};

const extractImageUrl = (content: string): string => {
  const defaultImage = 'https://photo-ten-iota.vercel.app/NipponNewsImage.png';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : defaultImage;
};

// Mock news data as fallback
const getMockNews = (source: string): NewsItem[] => {
  const mockNews = [
    {
      id: generateId(),
      title: '最新ニュースを準備中です',
      link: '#',
      pubDate: new Date().toISOString(),
      content: 'ニュースフィードの準備中です。しばらくお待ちください。',
      contentSnippet: 'ニュースフィードの準備中です。しばらくお待ちください。',
      imageUrl: 'https://photo-ten-iota.vercel.app/NipponNewsImage.png',
      source
    },
    {
      id: generateId(),
      title: 'システムメンテナンス情報',
      link: '#',
      pubDate: new Date(Date.now() - 3600000).toISOString(),
      content: 'より良いサービス提供のため、システムの改善を行っています。',
      contentSnippet: 'より良いサービス提供のため、システムの改善を行っています。',
      imageUrl: 'https://photo-ten-iota.vercel.app/NipponNewsImage.png',
      source
    },
    {
      id: generateId(),
      title: 'ニュース配信について',
      link: '#',
      pubDate: new Date(Date.now() - 7200000).toISOString(),
      content: '複数のニュースソースから最新情報をお届けしています。',
      contentSnippet: '複数のニュースソースから最新情報をお届けしています。',
      imageUrl: 'https://photo-ten-iota.vercel.app/NipponNewsImage.png',
      source
    }
  ];
  
  return mockNews;
};

export const fetchNewsByCategory = async (categoryId: string): Promise<NewsItem[]> => {
  const category = feedCategories.find(cat => cat.id === categoryId);
  if (!category) return [];
  return fetchRssFeed(category.url, category.source);
};

export const fetchAllNews = async (): Promise<NewsItem[]> => {
  const allPromises = feedCategories.map(category => 
    fetchRssFeed(category.url, category.source)
  );
  
  try {
    const results = await Promise.allSettled(allPromises);
    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<NewsItem[]> => result.status === 'fulfilled')
      .map(result => result.value);
    
    return successfulResults
      .flat()
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  } catch (error) {
    console.error('Error fetching all news:', error);
    return getMockNews('総合');
  }
};

export const searchNews = async (query: string): Promise<NewsItem[]> => {
  const allNews = await fetchAllNews();
  const searchTerms = query.toLowerCase().split(' ');
  
  return allNews.filter(news => 
    searchTerms.every(term => 
      news.title.toLowerCase().includes(term) || 
      (news.contentSnippet && news.contentSnippet.toLowerCase().includes(term))
    )
  );
};

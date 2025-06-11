import Parser from 'rss-parser';
import { NewsItem } from '../types';
import { generateId } from '../utils/stringUtils';

const parser = new Parser();

export const feedCategories = [
  { 
    id: 'top', 
    name: 'トップ', 
    url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
    source: 'Yahoo News'
  },
  { 
    id: 'domestic', 
    name: '国内', 
    url: 'https://news.yahoo.co.jp/rss/topics/domestic.xml',
    source: 'Yahoo News'
  },
  { 
    id: 'world', 
    name: '国際', 
    url: 'https://news.yahoo.co.jp/rss/topics/world.xml',
    source: 'Yahoo News'
  },
  { 
    id: 'business', 
    name: '経済', 
    url: 'https://news.yahoo.co.jp/rss/topics/business.xml',
    source: 'Yahoo News'
  },
  { 
    id: 'entertainment', 
    name: 'エンタメ', 
    url: 'https://news.yahoo.co.jp/rss/topics/entertainment.xml',
    source: 'Yahoo News'
  },
  { 
    id: 'sports', 
    name: 'スポーツ', 
    url: 'https://news.yahoo.co.jp/rss/topics/sports.xml',
    source: 'Yahoo News'
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

export const fetchRssFeed = async (url: string, source: string): Promise<NewsItem[]> => {
  try {
    const feed = await parser.parseURL(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    
    return feed.items.map(item => ({
      id: generateId(),
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      content: item.content || '',
      contentSnippet: item.contentSnippet || '',
      imageUrl: extractImageUrl(item.content || ''),
      source
    }));
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
};

const extractImageUrl = (content: string): string => {
  const defaultImage = 'https://photo-ten-iota.vercel.app/NipponNewsImage.png';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : defaultImage;
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
    const results = await Promise.all(allPromises);
    return results
      .flat()
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  } catch (error) {
    console.error('Error fetching all news:', error);
    return [];
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
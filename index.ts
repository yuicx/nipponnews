export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  categories?: string[];
  isoDate?: string;
  imageUrl?: string;
  source: string;
}

export interface FeedCategory {
  id: string;
  name: string;
  url: string;
  source: string;
}

export interface SearchParams {
  query: string;
}

export interface UserSettings {
  notifications: {
    enabled: boolean;
    categories: string[];
    keywords: string[];
    frequency: 'instant' | 'hourly' | 'daily';
  };
  preferences: {
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    layout: 'compact' | 'comfortable';
  };
  savedArticles: string[];
}
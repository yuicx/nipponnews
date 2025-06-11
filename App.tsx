import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FeaturedNews from './components/FeaturedNews';
import NewsList from './components/NewsList';
import Footer from './components/Footer';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import SearchResults from './components/SearchResults';
import { fetchNewsByCategory, fetchAllNews, searchNews } from './services/rssService';
import { NewsItem } from './types';

function App() {
  const [activeCategory, setActiveCategory] = useState('top');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  
  // Check for article query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const articleUrl = params.get('article');
    
    if (articleUrl) {
      // Decode the URL and redirect
      try {
        const decodedUrl = decodeURIComponent(articleUrl);
        window.location.href = decodedUrl;
      } catch (err) {
        console.error('Failed to decode article URL:', err);
      }
    }
  }, []);
  
  // Function to fetch news based on active category
  const loadNews = async () => {
    setIsLoading(true);
    setError(false);
    
    try {
      let newsData: NewsItem[];
      
      if (activeCategory === 'all') {
        newsData = await fetchAllNews();
      } else {
        newsData = await fetchNewsByCategory(activeCategory);
      }
      
      setNews(newsData);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchQuery('');
      setSearchResults([]);
      return;
    }
    
    setSearchQuery(query);
    setIsLoading(true);
    
    try {
      const results = await searchNews(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear search results
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Load news when component mounts or category changes
  useEffect(() => {
    // Clear search when changing categories
    clearSearch();
    loadNews();
  }, [activeCategory]);
  
  // Get the correct title based on active category
  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'top':
        return '主要ニュース';
      case 'sports':
        return 'スポーツニュース';
      case 'abema':
        return 'エンタメニュース';
      default:
        return 'すべてのニュース';
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        setActiveCategory={setActiveCategory} 
        activeCategory={activeCategory}
        onSearch={handleSearch}
      />
      
      <main className="flex-grow py-4">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState onRetry={loadNews} />
        ) : (
          <>
            {searchQuery ? (
              <SearchResults 
                results={searchResults} 
                query={searchQuery}
                onClearSearch={clearSearch}
              />
            ) : (
              <>
                <FeaturedNews newsItems={news} />
                <NewsList 
                  newsItems={news} 
                  title={getCategoryTitle()}
                />
              </>
            )}
          </>
        )}
      </main>
      
      <Footer setActiveCategory={setActiveCategory} />
    </div>
  );
}

export default App;
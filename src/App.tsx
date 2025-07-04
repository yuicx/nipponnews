import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FeaturedNews from './components/FeaturedNews';
import NewsList from './components/NewsList';
import Footer from './components/Footer';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import SearchResults from './components/SearchResults';
import PWAInstallButton from './components/PWAInstallButton';
import AIRecommendations from './components/AIRecommendations';
import AIRoute from './components/AIRoute';
import EarthquakeAlert from './components/EarthquakeAlert';
import { fetchNewsByCategory, fetchAllNews, searchNews } from './services/rssService';
import { initializePWA } from './services/pwaService';
import { initializeSettings, getUserSettings } from './services/settingsService';
import { geminiService } from './services/geminiService';
import { earthquakeService } from './services/earthquakeService';
import { NewsItem } from './types';

function App() {
  const [activeCategory, setActiveCategory] = useState('top');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [settings, setSettings] = useState(getUserSettings());
  const [currentRoute, setCurrentRoute] = useState('home');
  
  // Initialize PWA and settings on mount
  useEffect(() => {
    initializePWA();
    initializeSettings();
    
    // Initialize Gemini service if API key is available
    const currentSettings = getUserSettings();
    if (currentSettings.ai.geminiApiKey) {
      geminiService.setConfig({
        apiKey: currentSettings.ai.geminiApiKey,
        model: currentSettings.ai.model
      });
    }
    
    // Listen for settings changes
    const handleStorageChange = () => {
      const newSettings = getUserSettings();
      setSettings(newSettings);
      
      // Update Gemini service configuration
      if (newSettings.ai.geminiApiKey) {
        geminiService.setConfig({
          apiKey: newSettings.ai.geminiApiKey,
          model: newSettings.ai.model
        });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      // Clean up earthquake service
      earthquakeService.stopMonitoring();
    };
  }, []);

  // Handle routing
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path === '/ai') {
        setCurrentRoute('ai');
      } else {
        setCurrentRoute('home');
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);
  
  // Auto-refresh functionality
  useEffect(() => {
    if (!settings.preferences.autoRefresh || currentRoute !== 'home') return;
    
    const interval = setInterval(() => {
      if (!searchQuery) {
        loadNews();
      }
    }, settings.preferences.refreshInterval);
    
    return () => clearInterval(interval);
  }, [settings.preferences.autoRefresh, settings.preferences.refreshInterval, searchQuery, activeCategory, currentRoute]);
  
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
      
      // Apply articles per page limit
      const limitedNews = newsData.slice(0, settings.preferences.articlesPerPage);
      setNews(limitedNews);
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
      const limitedResults = results.slice(0, settings.preferences.articlesPerPage);
      setSearchResults(limitedResults);
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
    if (currentRoute === 'home') {
      // Clear search when changing categories
      clearSearch();
      loadNews();
    }
  }, [activeCategory, settings.preferences.articlesPerPage, currentRoute]);
  
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
  
  // Apply layout classes based on settings
  const getLayoutClasses = () => {
    const baseClasses = 'flex flex-col min-h-screen';
    const layoutClasses = {
      compact: 'compact-layout',
      comfortable: 'comfortable-layout',
      magazine: 'magazine-layout'
    };
    
    return `${baseClasses} ${layoutClasses[settings.preferences.layout]} ${
      settings.preferences.darkMode ? 'dark' : ''
    } ${settings.preferences.highContrast ? 'high-contrast' : ''} ${
      settings.preferences.reducedMotion ? 'reduce-motion' : ''
    } ${settings.preferences.readingMode ? 'reading-mode' : ''}`;
  };

  // Handle navigation
  const handleNavigation = (route: string) => {
    if (route === 'ai') {
      window.history.pushState({}, '', '/ai');
      setCurrentRoute('ai');
    } else {
      window.history.pushState({}, '', '/');
      setCurrentRoute('home');
    }
  };

  // Render AI route
  if (currentRoute === 'ai') {
    return (
      <div className={getLayoutClasses()}>
        <EarthquakeAlert />
        <Header 
          setActiveCategory={setActiveCategory} 
          activeCategory={activeCategory}
          onSearch={handleSearch}
          onNavigate={handleNavigation}
          currentRoute={currentRoute}
        />
        <AIRoute />
        <PWAInstallButton />
      </div>
    );
  }
  
  return (
    <div className={getLayoutClasses()}>
      <EarthquakeAlert />
      <Header 
        setActiveCategory={setActiveCategory} 
        activeCategory={activeCategory}
        onSearch={handleSearch}
        onNavigate={handleNavigation}
        currentRoute={currentRoute}
      />
      
      <main className="flex-grow py-4 bg-gray-50 dark:bg-gray-900">
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
                <AIRecommendations newsItems={news} />
                <FeaturedNews 
                  newsItems={news} 
                  showImages={settings.preferences.showImages}
                  showSummary={settings.preferences.showSummary}
                />
                <NewsList 
                  newsItems={news} 
                  title={getCategoryTitle()}
                  showImages={settings.preferences.showImages}
                  showSummary={settings.preferences.showSummary}
                />
              </>
            )}
          </>
        )}
      </main>
      
      <Footer setActiveCategory={setActiveCategory} />
      <PWAInstallButton />
    </div>
  );
}

export default App;

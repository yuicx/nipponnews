import React, { useState } from 'react';
import { Search, Menu, X, Settings, Bot, Home, Code } from 'lucide-react';
import { feedCategories } from '../services/rssService';
import SettingsModal from './SettingsModal';

interface HeaderProps {
  setActiveCategory: (categoryId: string) => void;
  activeCategory: string;
  onSearch: (query: string) => void;
  onNavigate?: (route: string) => void;
  currentRoute?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  setActiveCategory, 
  activeCategory, 
  onSearch, 
  onNavigate,
  currentRoute = 'home'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('home')}
              className="flex items-center hover:opacity-75 transition-opacity"
            >
              <img 
                src="https://photo-ten-iota.vercel.app/nippon%20news.png" 
                alt="日本ニュース"
                className="h-7 md:h-9 w-auto"
              />
            </button>
          </div>
          
          {currentRoute === 'home' && (
            <form 
              onSubmit={handleSearch}
              className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1 flex-1 max-w-md mx-4"
            >
              <input
                type="text"
                placeholder="検索..."
                className="bg-transparent border-none outline-none flex-1 py-1 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-1">
                <Search size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </form>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigation(currentRoute === 'api' ? 'home' : 'api')}
              className={`p-2 rounded-md transition-colors ${
                currentRoute === 'api'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              title={currentRoute === 'api' ? 'ホームに戻る' : 'API'}
            >
              {currentRoute === 'api' ? <Home size={20} /> : <Code size={20} />}
            </button>
            <button
              onClick={() => handleNavigation(currentRoute === 'ai' ? 'home' : 'ai')}
              className={`p-2 rounded-md transition-colors ${
                currentRoute === 'ai'
                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              title={currentRoute === 'ai' ? 'ホームに戻る' : 'AIチャット'}
            >
              {currentRoute === 'ai' ? <Home size={20} /> : <Bot size={20} />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings size={20} />
            </button>
            <button 
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {currentRoute === 'home' && (
          <nav className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className={`container mx-auto ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
              <ul className="flex flex-col md:flex-row whitespace-nowrap">
                {feedCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => {
                        setActiveCategory(category.id);
                        setIsMenuOpen(false);
                      }}
                      className={`px-4 py-3 font-medium transition-colors duration-200 text-sm ${
                        activeCategory === category.id
                          ? 'text-[#CC0000] border-b-2 border-[#CC0000]'
                          : 'text-gray-700 hover:text-[#CC0000] dark:text-gray-300 dark:hover:text-[#CC0000]'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
        
        {currentRoute === 'home' && (
          <div className={`container mx-auto px-4 py-2 ${isMenuOpen ? 'block md:hidden' : 'hidden'}`}>
            <form 
              onSubmit={handleSearch}
              className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1"
            >
              <input
                type="text"
                placeholder="検索..."
                className="bg-transparent border-none outline-none flex-1 py-1 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-1">
                <Search size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigation(currentRoute === 'api' ? 'home' : 'api')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentRoute === 'api'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {currentRoute === 'api' ? <Home size={20} /> : <Code size={20} />}
                  <span>{currentRoute === 'api' ? 'ホーム' : 'API'}</span>
                </button>
                <button
                  onClick={() => handleNavigation(currentRoute === 'ai' ? 'home' : 'ai')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentRoute === 'ai'
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {currentRoute === 'ai' ? <Home size={20} /> : <Bot size={20} />}
                  <span>{currentRoute === 'ai' ? 'ホーム' : 'AIチャット'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Header;

import React, { useState } from 'react';
import { Search, Menu, X, Settings } from 'lucide-react';
import { feedCategories } from '../services/rssService';
import SettingsModal from './SettingsModal';

interface HeaderProps {
  setActiveCategory: (categoryId: string) => void;
  activeCategory: string;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setActiveCategory, activeCategory, onSearch }) => {
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

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img 
                src="https://photo-ten-iota.vercel.app/nippon%20news.png" 
                alt="日本ニュース"
                className="h-10 w-auto"
              />
            </a>
          </div>
          
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1 flex-1 max-w-md mx-4"
          >
            <input
              type="text"
              placeholder="検索..."
              className="bg-transparent border-none outline-none flex-1 py-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="p-1">
              <Search size={18} className="text-gray-500" />
            </button>
          </form>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} />
            </button>
            <button 
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        <nav className="border-b border-gray-200 overflow-x-auto">
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
                        : 'text-gray-700 hover:text-[#CC0000]'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        <div className={`container mx-auto px-4 py-2 ${isMenuOpen ? 'block md:hidden' : 'hidden'}`}>
          <form 
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-full px-4 py-1"
          >
            <input
              type="text"
              placeholder="検索..."
              className="bg-transparent border-none outline-none flex-1 py-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="p-1">
              <Search size={18} className="text-gray-500" />
            </button>
          </form>
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Header;
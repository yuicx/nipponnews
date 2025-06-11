import React from 'react';
import { feedCategories } from '../services/rssService';
import { Rss } from 'lucide-react';

interface FooterProps {
  setActiveCategory: (categoryId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setActiveCategory }) => {
  const currentYear = new Date().getFullYear();
  
  const handleRssSubscribe = (url: string) => {
    window.open(url, '_blank');
  };
  
  return (
    <footer className="bg-[#003366] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="https://photo-ten-iota.vercel.app/nippon%20news.png" 
                alt="日本ニュース"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 text-sm">
              複数のニュースソースから最新のニュースをお届けします。
              いつでもどこでも、最新の情報をチェックできます。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">カテゴリー</h3>
            <ul className="space-y-2">
              {feedCategories.map(category => (
                <li key={category.id}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">RSS フィード</h3>
            <ul className="space-y-2">
              {feedCategories.map(category => (
                <li key={category.id}>
                  <button
                    onClick={() => handleRssSubscribe(category.url)}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <Rss size={14} />
                    {category.name}のRSS
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} 日本ニュース. All rights reserved.</p>
          <p className="mt-1">
            このサイトは教育目的で作成されています。ニュースコンテンツは各ソースからRSSフィードを通じて取得されています。
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
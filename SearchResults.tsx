import React from 'react';
import { NewsItem } from '../types';
import NewsCard from './NewsCard';
import { Search } from 'lucide-react';

interface SearchResultsProps {
  results: NewsItem[];
  query: string;
  onClearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  query,
  onClearSearch
}) => {
  if (!query) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold border-l-4 border-[#CC0000] pl-3">
            「{query}」の検索結果
          </h2>
          <button 
            onClick={onClearSearch}
            className="text-sm text-gray-600 hover:text-[#CC0000] transition-colors duration-200"
          >
            × 検索をクリア
          </button>
        </div>
        
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(item => (
              <NewsCard key={item.id} newsItem={item} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              検索結果がありません
            </h3>
            <p className="text-gray-600">
              「{query}」に一致するニュースは見つかりませんでした。<br />
              別のキーワードで検索してみてください。
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;
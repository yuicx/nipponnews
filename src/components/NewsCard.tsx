import React from 'react';
import { NewsItem } from '../types';
import { getRelativeTime } from '../utils/dateUtils';
import { ExternalLink, Share2, Twitter, Globe } from 'lucide-react';

interface NewsCardProps {
  newsItem: NewsItem;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ newsItem, featured = false }) => {
  const handleShare = (platform: 'twitter' | 'bluesky') => {
    const text = `${newsItem.title}\n`;
    const url = newsItem.link;
    
    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank'
      );
    } else if (platform === 'bluesky') {
      window.open(
        `https://bsky.app/intent/compose?text=${encodeURIComponent(text + url)}`,
        '_blank'
      );
    }
  };

  const articleUrl = `${window.location.origin}?article=${encodeURIComponent(newsItem.link)}`;
  
  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
        <div className="relative h-[400px] overflow-hidden">
          <img 
            src={newsItem.imageUrl} 
            alt={newsItem.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mb-4">
                <span className="inline-block bg-[#CC0000] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {newsItem.source}
                </span>
                <a href={articleUrl} className="block group-hover:opacity-75 transition-opacity">
                  <h3 className="text-2xl font-bold text-white leading-tight mb-2">
                    {newsItem.title}
                  </h3>
                  {newsItem.contentSnippet && (
                    <p className="text-white/80 text-sm line-clamp-2 mb-3">
                      {newsItem.contentSnippet}
                    </p>
                  )}
                </a>
              </div>
              <div className="flex items-center justify-between border-t border-white/20 pt-4">
                <span className="text-white/60 text-sm">{getRelativeTime(newsItem.pubDate)}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    title="Twitterで共有"
                  >
                    <Twitter size={18} />
                  </button>
                  <button
                    onClick={() => handleShare('bluesky')}
                    className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    title="Blueskyで共有"
                  >
                    <Globe size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full">
      <div className="flex flex-col h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={newsItem.imageUrl} 
            alt={newsItem.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-block bg-[#CC0000] text-white text-xs font-semibold px-3 py-1 rounded-full">
              {newsItem.source}
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-grow p-5">
          <a 
            href={articleUrl}
            className="block group-hover:opacity-75 transition-opacity"
          >
            <h3 className="text-lg font-bold text-gray-800 leading-tight mb-3 line-clamp-2 min-h-[3.5rem]">
              {newsItem.title}
            </h3>
          </a>
          
          {newsItem.contentSnippet && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {newsItem.contentSnippet}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <ExternalLink size={14} />
              {getRelativeTime(newsItem.pubDate)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare('twitter')}
                className="text-gray-400 hover:text-[#1DA1F2] transition-colors p-2 hover:bg-gray-50 rounded-full"
                title="Twitterで共有"
              >
                <Twitter size={16} />
              </button>
              <button
                onClick={() => handleShare('bluesky')}
                className="text-gray-400 hover:text-[#0085FF] transition-colors p-2 hover:bg-gray-50 rounded-full"
                title="Blueskyで共有"
              >
                <Globe size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;

import React from 'react';
import { NewsItem } from '../types';
import { getRelativeTime } from '../utils/dateUtils';
import { ExternalLink, Share2 } from 'lucide-react';
import { getUserSettings } from '../services/settingsService';
import AISummary from './AISummary';

interface NewsCardProps {
  newsItem: NewsItem;
  featured?: boolean;
  showImages?: boolean;
  showSummary?: boolean;
}

// Custom SVG Icons
const TwitterIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" className={className}>
    <path d="M50.063 10.438a20.6 20.6 0 0 1-5.91 1.62 10.3 10.3 0 0 0 4.523-5.687 20.7 20.7 0 0 1-6.531 2.492 10.26 10.26 0 0 0-7.504-3.246c-5.68 0-10.286 4.602-10.286 10.281 0 .805.094 1.59.27 2.344-8.547-.43-16.121-4.523-21.195-10.746a10.24 10.24 0 0 0-1.39 5.172c0 3.566 1.812 6.715 4.573 8.562a10.3 10.3 0 0 1-4.66-1.289v.13c0 4.984 3.547 9.136 8.246 10.085a10.3 10.3 0 0 1-4.644.172c1.312 4.082 5.11 7.063 9.605 7.145A20.6 20.6 0 0 1 2.39 41.87q-1.247 0-2.449-.144a29.05 29.05 0 0 0 15.762 4.62c18.914 0 29.258-15.667 29.258-29.253 0-.446-.012-.895-.027-1.332a20.9 20.9 0 0 0 5.129-5.324" fill="currentColor"/>
  </svg>
);

const BlueskyIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 600 530" className={className}>
    <path d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.15 217.613 9.997 86.535 9.997 68.825c0-88.687 77.742-60.816 125.72-24.795z" fill="currentColor"/>
  </svg>
);

const TaittsuuIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 500 500" className={className}>
    <path d="M122.349 49.492C123.485 49.486 124.622 49.479 125.792 49.473C129.596 49.458 133.399 49.470 137.203 49.482C139.932 49.479 142.661 49.470 145.389 49.461C152.029 49.443 158.668 49.447 165.308 49.459C170.705 49.468 176.101 49.469 181.498 49.465C182.267 49.464 183.035 49.464 183.827 49.463C185.388 49.462 186.950 49.459 188.511 49.456C203.148 49.445 217.784 49.458 232.420 49.480C244.974 49.498 257.528 49.495 270.082 49.476C284.666 49.455 299.251 49.447 313.835 49.459C315.391 49.460 316.946 49.461 318.502 49.462C319.267 49.463 320.032 49.464 320.821 49.465C326.210 49.468 331.599 49.462 336.988 49.453C343.558 49.441 350.127 49.444 356.697 49.465C360.048 49.476 363.398 49.478 366.749 49.467C370.383 49.456 374.017 49.470 377.651 49.490C378.708 49.481 379.764 49.473 380.853 49.463C387.100 49.530 391.035 50.070 396 54C401.240 60.263 400.560 67.148 400.501 75C400.505 76.434 400.511 77.869 400.518 79.303C400.533 83.236 400.523 87.169 400.508 91.102C400.497 95.347 400.509 99.592 400.518 103.837C400.532 112.150 400.525 120.463 400.510 128.776C400.493 138.460 400.496 148.144 400.500 157.828C400.506 175.111 400.491 192.394 400.466 209.676C400.442 226.439 400.435 243.202 400.446 259.965C400.457 278.222 400.459 296.479 400.445 314.736C400.443 316.684 400.442 318.632 400.440 320.580C400.440 321.539 400.439 322.497 400.438 323.485C400.433 330.231 400.435 336.978 400.439 343.724C400.444 351.951 400.438 360.178 400.418 368.405C400.408 372.600 400.403 376.796 400.411 380.991C400.418 384.836 400.411 388.681 400.393 392.526C400.389 393.913 400.390 395.300 400.397 396.687C400.462 411.773 396.762 424.747 386.226 435.915C377.577 444.078 366.459 450.015 354.358 450.209C352.985 450.233 352.985 450.233 351.585 450.258C347.409 450.302 343.233 450.343 339.056 450.366C336.859 450.383 334.661 450.410 332.464 450.448C329.283 450.503 326.103 450.525 322.922 450.540C321.948 450.562 320.973 450.585 319.969 450.608C313.637 450.589 308.605 449.628 304 445C299.943 439.190 299.427 434.863 299.501 427.873C299.493 426.366 299.493 426.366 299.485 424.828C299.472 421.468 299.487 418.110 299.502 414.750C299.498 412.338 299.492 409.927 299.485 407.515C299.473 402.325 299.473 397.136 299.483 391.946C299.498 384.434 299.488 376.922 299.472 369.410C299.445 357.210 299.434 345.009 299.435 332.809C299.435 331.714 299.435 331.714 299.436 330.598C299.436 327.642 299.436 324.685 299.437 321.729C299.437 313.593 299.436 305.457 299.433 297.321C299.433 296.593 299.433 295.865 299.432 295.114C299.428 282.959 299.412 270.805 299.388 258.650C299.374 251.159 299.371 243.668 299.383 236.176C299.391 230.435 299.384 224.693 299.372 218.951C299.370 216.599 299.372 214.246 299.380 211.894C299.391 208.680 299.383 205.467 299.371 202.254C299.379 201.325 299.387 200.396 299.395 199.439C299.338 192.435 298.224 186.860 293.812 181.187C285.957 175.078 277.601 175.554 268.062 175.601C266.613 175.599 265.164 175.596 263.715 175.593C260.689 175.588 257.663 175.595 254.637 175.609C250.777 175.626 246.918 175.616 243.058 175.598C240.069 175.587 237.080 175.591 234.091 175.598C232.668 175.600 231.246 175.598 229.824 175.591C217.185 175.528 217.185 175.528 206.187 181.187C201.366 187.386 200.557 193.550 200.621 201.133C200.614 202.462 200.614 202.462 200.607 203.818C200.596 206.769 200.605 209.719 200.615 212.670C200.611 214.793 200.605 216.916 200.599 219.039C200.587 223.602 200.585 228.165 200.589 232.728C200.596 239.948 200.580 247.168 200.561 254.388C200.523 269.717 200.510 285.046 200.500 300.375C200.489 316.918 200.474 333.461 200.429 350.004C200.411 357.177 200.407 364.349 200.414 371.522C200.415 375.990 200.405 380.458 200.391 384.926C200.387 386.992 200.388 389.059 200.395 391.125C200.403 393.955 200.393 396.784 200.379 399.613C200.389 400.828 200.389 400.828 200.400 402.067C200.274 414.774 194.886 426.720 186.226 435.915C177.577 444.078 166.459 450.015 154.358 450.209C152.985 450.233 152.985 450.233 151.585 450.258C147.409 450.302 143.233 450.343 139.056 450.366C136.859 450.383 134.661 450.410 132.464 450.448C129.283 450.503 126.103 450.525 122.922 450.540C121.948 450.562 120.973 450.585 119.969 450.608C113.637 450.589 108.605 449.628 104 445C98.768 438.289 99.439 431.015 99.491 422.893C99.487 421.337 99.480 419.781 99.472 418.225C99.456 413.956 99.464 409.687 99.476 405.418C99.485 400.811 99.471 396.204 99.461 391.598C99.443 382.576 99.447 373.554 99.458 364.532C99.467 357.200 99.468 349.868 99.464 342.536C99.463 341.493 99.463 340.450 99.462 339.375C99.461 337.255 99.460 335.135 99.459 333.016C99.447 313.139 99.460 293.262 99.482 273.385C99.500 256.328 99.497 239.272 99.478 222.215C99.457 202.410 99.448 182.605 99.460 162.800C99.461 160.688 99.462 158.576 99.464 156.464C99.464 155.425 99.465 154.386 99.465 153.316C99.469 145.992 99.463 138.669 99.454 131.345C99.443 122.421 99.446 113.496 99.467 104.572C99.478 100.018 99.482 95.465 99.469 90.911C99.457 86.742 99.463 82.574 99.485 78.405C99.489 76.897 99.487 75.389 99.477 73.881C99.391 59.374 99.391 59.374 104 54C109.837 49.382 115.093 49.431 122.349 49.492Z" fill="#666666"/>
    <path d="M122.349 49.492C123.485 49.486 124.622 49.479 125.792 49.473C129.596 49.458 133.399 49.470 137.203 49.482C139.932 49.479 142.661 49.470 145.389 49.461C152.029 49.443 158.668 49.447 165.308 49.459C170.705 49.468 176.101 49.469 181.498 49.465C182.267 49.464 183.035 49.464 183.827 49.463C185.388 49.462 186.950 49.459 188.511 49.456C203.148 49.445 217.784 49.458 232.420 49.480C244.974 49.498 257.528 49.495 270.082 49.476C284.666 49.455 299.251 49.447 313.835 49.459C315.391 49.460 316.946 49.461 318.502 49.462C319.267 49.463 320.032 49.464 320.821 49.465C326.210 49.468 331.599 49.462 336.988 49.453C343.558 49.441 350.127 49.444 356.697 49.465C360.048 49.476 363.398 49.478 366.749 49.467C370.383 49.456 374.017 49.470 377.651 49.490C378.708 49.481 379.764 49.473 380.853 49.463C387.100 49.530 391.035 50.070 396 54C400 61 400 61 400 100C301 100 202 100 100 100C100 61 100 61 104 54C109.837 49.382 115.093 49.431 122.349 49.492Z" fill="#999999"/>
    <path d="M230.349 100.492C230.689 100.822 231.029 101.152 231.349 101.492C228.709 104.132 226.069 106.772 223.349 109.492C223.349 106.492 223.349 106.492 225.787 103.867C226.632 103.083 227.478 102.299 228.349 101.492C228.679 101.162 229.009 100.832 229.349 100.492Z" fill="#979797"/>
  </svg>
);

const NewsCard: React.FC<NewsCardProps> = ({ 
  newsItem, 
  featured = false, 
  showImages = true, 
  showSummary = true 
}) => {
  const settings = getUserSettings();
  const shouldShowImages = showImages && settings.preferences.showImages;
  const shouldShowSummary = showSummary && settings.preferences.showSummary;

  const handleShare = (platform: 'twitter' | 'bluesky' | 'taittsuu') => {
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
    } else if (platform === 'taittsuu') {
      window.open(
        `https://taittsuu.com/share?text=${encodeURIComponent(text + url)}`,
        '_blank'
      );
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://photo-ten-iota.vercel.app/NipponNewsImage.png';
  };

  const articleUrl = `${window.location.origin}?article=${encodeURIComponent(newsItem.link)}`;
  
  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
        {shouldShowImages && (
          <div className="relative h-[400px] overflow-hidden">
            <img 
              src={newsItem.imageUrl} 
              alt={newsItem.title}
              onError={handleImageError}
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
                    {shouldShowSummary && newsItem.contentSnippet && (
                      <p className="text-white/80 text-sm line-clamp-2 mb-3">
                        {newsItem.contentSnippet}
                      </p>
                    )}
                  </a>
                </div>
                <div className="flex items-center justify-between border-t border-white/20 pt-4">
                  <span className="text-white/60 text-sm">{getRelativeTime(newsItem.pubDate)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="text-white/60 hover:text-[#1DA1F2] transition-colors p-2 hover:bg-white/10 rounded-full group/btn"
                      title="Twitterで共有"
                    >
                      <TwitterIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleShare('bluesky')}
                      className="text-white/60 hover:text-[#0085FF] transition-colors p-2 hover:bg-white/10 rounded-full group/btn"
                      title="Blueskyで共有"
                    >
                      <BlueskyIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleShare('taittsuu')}
                      className="text-white/60 hover:text-[#FF6B35] transition-colors p-2 hover:bg-white/10 rounded-full group/btn"
                      title="タイッツーで共有"
                    >
                      <TaittsuuIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!shouldShowImages && (
          <div className="p-6">
            <span className="inline-block bg-[#CC0000] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {newsItem.source}
            </span>
            <a href={articleUrl} className="block group-hover:opacity-75 transition-opacity">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white leading-tight mb-2">
                {newsItem.title}
              </h3>
              {shouldShowSummary && newsItem.contentSnippet && (
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                  {newsItem.contentSnippet}
                </p>
              )}
            </a>
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">{getRelativeTime(newsItem.pubDate)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="text-gray-400 hover:text-[#1DA1F2] transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full group/btn"
                  title="Twitterで共有"
                >
                  <TwitterIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => handleShare('bluesky')}
                  className="text-gray-400 hover:text-[#0085FF] transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full group/btn"
                  title="Blueskyで共有"
                >
                  <BlueskyIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => handleShare('taittsuu')}
                  className="text-gray-400 hover:text-[#FF6B35] transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full group/btn"
                  title="タイッツーで共有"
                >
                  <TaittsuuIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            <AISummary newsItem={newsItem} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 h-full">
      <div className="flex flex-col h-full">
        {shouldShowImages && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={newsItem.imageUrl} 
              alt={newsItem.title}
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-3 left-3">
              <span className="inline-block bg-[#CC0000] text-white text-xs font-semibold px-3 py-1 rounded-full">
                {newsItem.source}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col flex-grow p-5">
          {!shouldShowImages && (
            <span className="inline-block bg-[#CC0000] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 self-start">
              {newsItem.source}
            </span>
          )}
          
          <a 
            href={articleUrl}
            className="block group-hover:opacity-75 transition-opacity"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight mb-3 line-clamp-2 min-h-[3.5rem]">
              {newsItem.title}
            </h3>
          </a>
          
          {shouldShowSummary && newsItem.contentSnippet && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {newsItem.contentSnippet}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
              <ExternalLink size={14} />
              {getRelativeTime(newsItem.pubDate)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleShare('twitter')}
                className="text-gray-400 hover:text-[#1DA1F2] transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full group/btn"
                title="Twitterで共有"
              >
                <TwitterIcon size={16} className="group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => handleShare('bluesky')}
                className="text-gray-400 hover:text-[#0085FF] transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full group/btn"
                title="Blueskyで共有"
              >
                <BlueskyIcon size={16} className="group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => handleShare('taittsuu')}
                className="text-gray-400 hover:text-[#FF6B35] transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full group/btn"
                title="タイッツーで共有"
              >
                <TaittsuuIcon size={16} className="group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
          
          <AISummary newsItem={newsItem} />
        </div>
      </div>
    </div>
  );
};

export default NewsCard;

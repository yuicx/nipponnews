export interface UserSettings {
  notifications: {
    enabled: boolean;
    categories: string[];
    keywords: string[];
    frequency: 'instant' | 'hourly' | 'daily';
    sound: boolean;
    vibration: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  preferences: {
    darkMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    layout: 'compact' | 'comfortable' | 'magazine';
    language: 'ja' | 'en';
    autoRefresh: boolean;
    refreshInterval: number;
    showImages: boolean;
    showSummary: boolean;
    articlesPerPage: number;
    readingMode: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  privacy: {
    analytics: boolean;
    cookies: boolean;
    personalizedAds: boolean;
    dataCollection: boolean;
  };
  savedArticles: string[];
}

const USER_SETTINGS_KEY = 'user-settings';

export const getDefaultSettings = (): UserSettings => ({
  notifications: {
    enabled: false,
    categories: [],
    keywords: [],
    frequency: 'instant',
    sound: true,
    vibration: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  },
  preferences: {
    darkMode: false,
    fontSize: 'medium',
    layout: 'comfortable',
    language: 'ja',
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
    showImages: true,
    showSummary: true,
    articlesPerPage: 20,
    readingMode: false,
    highContrast: false,
    reducedMotion: false
  },
  privacy: {
    analytics: true,
    cookies: true,
    personalizedAds: false,
    dataCollection: true
  },
  savedArticles: []
});

export const getUserSettings = (): UserSettings => {
  const settings = localStorage.getItem(USER_SETTINGS_KEY);
  if (settings) {
    try {
      const parsed = JSON.parse(settings);
      // Merge with defaults to ensure all properties exist
      return { ...getDefaultSettings(), ...parsed };
    } catch (error) {
      console.error('Error parsing user settings:', error);
      return getDefaultSettings();
    }
  }
  return getDefaultSettings();
};

export const saveUserSettings = (settings: UserSettings): void => {
  localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
  applySettings(settings);
};

export const applySettings = (settings: UserSettings): void => {
  const root = document.documentElement;
  const body = document.body;
  
  // Clear all existing classes first
  root.classList.remove('dark', 'text-small', 'text-medium', 'text-large', 'high-contrast', 'reduce-motion', 'reading-mode');
  body.classList.remove('dark', 'text-small', 'text-medium', 'text-large', 'high-contrast', 'reduce-motion', 'reading-mode');
  
  // Apply dark mode
  if (settings.preferences.darkMode) {
    root.classList.add('dark');
    body.classList.add('dark');
  }
  
  // Apply font size
  root.classList.add(`text-${settings.preferences.fontSize}`);
  body.classList.add(`text-${settings.preferences.fontSize}`);
  
  // Apply high contrast
  if (settings.preferences.highContrast) {
    root.classList.add('high-contrast');
    body.classList.add('high-contrast');
  }
  
  // Apply reduced motion
  if (settings.preferences.reducedMotion) {
    root.classList.add('reduce-motion');
    body.classList.add('reduce-motion');
  }
  
  // Apply reading mode
  if (settings.preferences.readingMode) {
    root.classList.add('reading-mode');
    body.classList.add('reading-mode');
  }
  
  // Force a repaint to ensure styles are applied
  setTimeout(() => {
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }, 0);
};

// Initialize settings on app load
export const initializeSettings = (): void => {
  const settings = getUserSettings();
  applySettings(settings);
};

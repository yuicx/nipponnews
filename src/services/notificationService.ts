const NOTIFICATION_PERMISSION_KEY = 'notification-permission-status';
const USER_SETTINGS_KEY = 'user-settings';

export const checkNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  let permission = Notification.permission;

  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  localStorage.setItem(NOTIFICATION_PERMISSION_KEY, permission);
  return permission === 'granted';
};

export const sendNotification = (title: string, options: NotificationOptions) => {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
};

export const getUserSettings = () => {
  const settings = localStorage.getItem(USER_SETTINGS_KEY);
  if (settings) {
    return JSON.parse(settings);
  }
  return {
    notifications: {
      enabled: false,
      categories: [],
      keywords: [],
      frequency: 'instant'
    },
    preferences: {
      darkMode: false,
      fontSize: 'medium',
      layout: 'comfortable'
    },
    savedArticles: []
  };
};

export const saveUserSettings = (settings: any) => {
  localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
};

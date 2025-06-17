import { getUserSettings, UserSettings } from './settingsService';

const NOTIFICATION_PERMISSION_KEY = 'notification-permission-status';

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

  const settings = getUserSettings();
  
  // Check if notifications are enabled
  if (!settings.notifications.enabled) {
    return;
  }

  // Check quiet hours
  if (settings.notifications.quietHours.enabled) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = parseTime(settings.notifications.quietHours.start);
    const endTime = parseTime(settings.notifications.quietHours.end);
    
    if (isInQuietHours(currentTime, startTime, endTime)) {
      return;
    }
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      ...options,
      silent: !settings.notifications.sound
    });

    // Handle vibration if supported
    if (settings.notifications.vibration && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    return notification;
  }
};

const parseTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const isInQuietHours = (currentTime: number, startTime: number, endTime: number): boolean => {
  if (startTime <= endTime) {
    return currentTime >= startTime && currentTime <= endTime;
  } else {
    // Quiet hours span midnight
    return currentTime >= startTime || currentTime <= endTime;
  }
};

export { getUserSettings as getUserSettings, saveUserSettings as saveUserSettings } from './settingsService';

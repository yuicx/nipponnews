import dayjs from 'dayjs';
import 'dayjs/locale/ja';

// Configure dayjs to use Japanese locale
dayjs.locale('ja');

export const formatDate = (date: string): string => {
  const dateObj = dayjs(date);
  
  // If date is today, just show time
  if (dateObj.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
    return `今日 ${dateObj.format('HH:mm')}`;
  }
  
  // If date is yesterday, show "昨日" and time
  if (dateObj.format('YYYY-MM-DD') === dayjs().subtract(1, 'day').format('YYYY-MM-DD')) {
    return `昨日 ${dateObj.format('HH:mm')}`;
  }
  
  // Otherwise show full date
  return dateObj.format('YYYY/MM/DD HH:mm');
};

export const getRelativeTime = (date: string): string => {
  const dateObj = dayjs(date);
  const now = dayjs();
  
  const diffMinutes = now.diff(dateObj, 'minute');
  const diffHours = now.diff(dateObj, 'hour');
  const diffDays = now.diff(dateObj, 'day');
  
  if (diffMinutes < 60) {
    return `${diffMinutes}分前`;
  } else if (diffHours < 24) {
    return `${diffHours}時間前`;
  } else {
    return `${diffDays}日前`;
  }
};

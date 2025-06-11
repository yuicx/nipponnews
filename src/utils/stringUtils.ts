export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const extractImageFromContent = (content: string): string | undefined => {
  const imgRegex = /<img.*?src="(.*?)".*?>/;
  const match = content?.match(imgRegex);
  return match ? match[1] : undefined;
};

export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

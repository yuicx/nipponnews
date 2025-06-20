export interface GeminiConfig {
  apiKey: string;
  model: string;
}

export interface UserInterests {
  topics: string[];
  keywords: string[];
  categories: string[];
}

export interface SummarizedNews {
  id: string;
  originalTitle: string;
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

class GeminiService {
  private config: GeminiConfig | null = null;

  setConfig(config: GeminiConfig) {
    this.config = config;
  }

  getConfig(): GeminiConfig | null {
    return this.config;
  }

  isConfigured(): boolean {
    return this.config !== null && this.config.apiKey.length > 0;
  }

  private async makeRequest(prompt: string): Promise<string> {
    if (!this.config) {
      throw new Error('Gemini API not configured');
    }

    const url = `${GEMINI_API_BASE}/${this.config.model}:generateContent?key=${this.config.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async summarizeNews(title: string, content: string): Promise<string> {
    const prompt = `
以下のニュース記事を日本語で簡潔に要約してください。重要なポイントを3つ以内にまとめ、読みやすい形で提供してください。

タイトル: ${title}
内容: ${content}

要約:`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error('Error summarizing news:', error);
      return '要約の生成に失敗しました。';
    }
  }

  async extractKeyPoints(title: string, content: string): Promise<string[]> {
    const prompt = `
以下のニュース記事から重要なポイントを3-5個抽出し、箇条書きで日本語で提供してください。各ポイントは簡潔で分かりやすくしてください。

タイトル: ${title}
内容: ${content}

重要なポイント:`;

    try {
      const response = await this.makeRequest(prompt);
      return response.split('\n')
        .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(point => point.length > 0)
        .slice(0, 5);
    } catch (error) {
      console.error('Error extracting key points:', error);
      return [];
    }
  }

  async analyzeSentiment(title: string, content: string): Promise<'positive' | 'negative' | 'neutral'> {
    const prompt = `
以下のニュース記事の感情を分析し、「positive」「negative」「neutral」のいずれかで回答してください。

タイトル: ${title}
内容: ${content}

感情分析結果:`;

    try {
      const response = await this.makeRequest(prompt);
      const sentiment = response.toLowerCase().trim();
      
      if (sentiment.includes('positive')) return 'positive';
      if (sentiment.includes('negative')) return 'negative';
      return 'neutral';
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 'neutral';
    }
  }

  async calculateRelevanceScore(
    newsTitle: string, 
    newsContent: string, 
    userInterests: UserInterests
  ): Promise<number> {
    const interestsText = [
      ...userInterests.topics,
      ...userInterests.keywords,
      ...userInterests.categories
    ].join(', ');

    const prompt = `
ユーザーの興味: ${interestsText}

以下のニュース記事がユーザーの興味にどの程度関連しているかを0-100のスコアで評価してください。数字のみで回答してください。

タイトル: ${newsTitle}
内容: ${newsContent}

関連度スコア:`;

    try {
      const response = await this.makeRequest(prompt);
      const score = parseInt(response.match(/\d+/)?.[0] || '0');
      return Math.min(Math.max(score, 0), 100);
    } catch (error) {
      console.error('Error calculating relevance score:', error);
      return 0;
    }
  }

  async getPersonalizedRecommendations(
    newsItems: any[],
    userInterests: UserInterests,
    limit: number = 5
  ): Promise<string[]> {
    const newsText = newsItems.slice(0, 10).map(item => 
      `${item.title}: ${item.contentSnippet || ''}`
    ).join('\n\n');

    const interestsText = [
      ...userInterests.topics,
      ...userInterests.keywords,
      ...userInterests.categories
    ].join(', ');

    const prompt = `
ユーザーの興味: ${interestsText}

以下のニュース記事の中から、ユーザーの興味に最も関連する記事を${limit}つ選んで、そのタイトルのみを箇条書きで日本語で提供してください。

ニュース記事:
${newsText}

おすすめ記事:`;

    try {
      const response = await this.makeRequest(prompt);
      return response.split('\n')
        .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(title => title.length > 0)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();

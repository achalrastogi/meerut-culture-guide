export interface CulturalTopic {
  id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
  relatedTopics: string[];
}

export interface CulturalCategory {
  id: string;
  name: string;
  description: string;
  topicCount: number;
}

export interface CulturalInsight {
  id: string;
  query: string;
  topic: CulturalTopic;
  context: string;
  relatedTopics: CulturalTopic[];
  timestamp: string;
}

export interface SearchState {
  query: string;
  isLoading: boolean;
  response: CulturalResponse | null;
  error: string | null;
  llmConfig: LLMConfig;
}

export interface CulturalResponse {
  answer: string;
  confidence: 'high' | 'medium' | 'low' | 'none';
  sources: string[];
  processingMethod: 'gemini' | 'openai';
  responseTime?: number;
}

export interface LLMConfig {
  provider: 'gemini' | 'openai';
  apiKey?: string;
}
// types/CulturalTypes.ts

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface PopularTopic {
  title: string;
  queries: number;
}

export interface LLMConfig {
  provider: 'gemini' | 'openai';
  apiKey?: string;
  model?: string;
}

export interface CulturalResponse {
  answer: string;
  sources: string[];
  confidence: 'high' | 'medium' | 'low' | 'none';
  processingMethod: string;
  responseTime?: number;
  relatedTopics?: string[];
}

export interface SearchState {
  query: string;
  isLoading: boolean;
  response: CulturalResponse | null;
  error: string | null;
  llmConfig: LLMConfig;
}

export interface CulturalKnowledge {
  festivals: Festival[];
  traditions: Tradition[];
  industries: Industry[];
  historicalContext: HistoricalEvent[];
  localCustoms: LocalCustom[];
  foodCulture: FoodItem[];
  religiousHarmony: ReligiousAspect[];
}

export interface Festival {
  name: string;
  description: string;
  significance: string;
  timing: string;
  traditions: string[];
  historicalOrigin: string;
  modernRelevance: string;
}

export interface Tradition {
  name: string;
  description: string;
  significance: string;
}

export interface Industry {
  name: string;
  description: string;
  historicalBackground: string;
  culturalSignificance: string;
  modernStatus: string;
  keyPlayers?: string[];
}

export interface HistoricalEvent {
  name: string;
  year: number;
  description: string;
  significance: string;
}

export interface LocalCustom {
  name: string;
  description: string;
  significance: string;
}

export interface FoodItem {
  name: string;
  description: string;
  culturalSignificance: string;
}

export interface ReligiousAspect {
  name: string;
  description: string;
  significance: string;
}
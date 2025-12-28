import { CulturalResponse, LLMConfig } from '../types/CulturalTypes';
import { OpenAIService } from './openAIService';
import { GeminiService } from './geminiService';

class CulturalKnowledgeService {
  private knowledgeBase: string = '';
  private isLoaded: boolean = false;
  private openAIService: OpenAIService | null = null;
  private geminiService: GeminiService | null = null;

  async loadKnowledgeBase(): Promise<void> {
    if (this.isLoaded) return;

    // Try multiple possible paths for the knowledge base
    const possiblePaths = [
      // For GitHub Pages with base path
      './product.md',
      'product.md',
      '/product.md'
    ];

    let lastError: Error | null = null;

    for (const path of possiblePaths) {
      try {
        console.log(`Attempting to load knowledge base from: ${path}`);
        const response = await fetch(path);
        
        if (response.ok) {
          this.knowledgeBase = await response.text();
          this.isLoaded = true;
          console.log(`Cultural knowledge base loaded successfully from: ${path}`);
          return;
        } else {
          console.warn(`Failed to load from ${path}: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.warn(`Error loading from ${path}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    // If all paths failed, throw the last error
    throw new Error(`Failed to load cultural knowledge base from any path. Last error: ${lastError?.message}`);
  }

  setLLMConfig(config: LLMConfig): void {
    // Reset services
    this.openAIService = null;
    this.geminiService = null;

    if (config.provider === 'openai' && config.apiKey) {
      this.openAIService = new OpenAIService(config.apiKey);
      if (this.isLoaded) {
        this.openAIService.setKnowledgeBase(this.knowledgeBase);
      }
    } else if (config.provider === 'gemini' && config.apiKey) {
      this.geminiService = new GeminiService(config.apiKey);
      if (this.isLoaded) {
        this.geminiService.setKnowledgeBase(this.knowledgeBase);
      }
    }
  }

  async testConnection(config: LLMConfig): Promise<boolean> {
    if (config.provider === 'openai' && this.openAIService) {
      return await this.openAIService.testApiKey();
    } else if (config.provider === 'gemini' && this.geminiService) {
      return await this.geminiService.testApiKey();
    }
    return false;
  }

  // Clean response to remove unwanted formatting
  private cleanResponse(response: CulturalResponse): CulturalResponse {
    let cleanedAnswer = response.answer;

    // Remove section references like (SECTION X: TOURIST PLACES...)
    cleanedAnswer = cleanedAnswer.replace(/\(SECTION [IVX\d]+:[^)]+\)/gi, '');
    cleanedAnswer = cleanedAnswer.replace(/\[SECTION [IVX\d]+:[^\]]+\]/gi, '');
    
    // Remove reference markers like [1], [2], etc.
    cleanedAnswer = cleanedAnswer.replace(/\[\d+\]/g, '');
    
    // Clean up multiple spaces
    cleanedAnswer = cleanedAnswer.replace(/\s+/g, ' ');
    
    // Clean up spacing around punctuation
    cleanedAnswer = cleanedAnswer.replace(/\s+([.,!?;:])/g, '$1');
    
    // Fix spacing after bullet points
    cleanedAnswer = cleanedAnswer.replace(/([*-])\s+/g, '$1 ');
    
    // Trim and remove trailing incomplete sentences if response was cut off
    cleanedAnswer = cleanedAnswer.trim();
    
    // If response ends with an incomplete word (no period, question mark, etc.), 
    // try to find the last complete sentence
    if (!cleanedAnswer.match(/[.!?]$/)) {
      const lastSentenceMatch = cleanedAnswer.match(/(.*[.!?])/);
      if (lastSentenceMatch) {
        cleanedAnswer = lastSentenceMatch[1].trim();
      }
    }

    return {
      ...response,
      answer: cleanedAnswer
    };
  }

  async processQuery(query: string, config: LLMConfig): Promise<CulturalResponse> {
    if (!this.isLoaded) {
      await this.loadKnowledgeBase();
      
      // Set knowledge base for the appropriate service
      this.setLLMConfig(config);
    }

    const trimmedQuery = query.trim();
    
    // Handle empty or very short queries
    if (trimmedQuery.length < 2) {
      return {
        answer: "Please ask me a specific question about Meerut's culture, history, festivals, food, or traditions.",
        confidence: 'none',
        sources: [],
        processingMethod: config.provider
      };
    }

    // Ensure we have an API key for the selected provider
    if (!config.apiKey) {
      return {
        answer: `Please configure your ${config.provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API key in the settings to use this service.`,
        confidence: 'none',
        sources: [],
        processingMethod: config.provider
      };
    }

    // Route to appropriate processing method
    let response: CulturalResponse;
    
    if (config.provider === 'openai' && this.openAIService) {
      response = await this.openAIService.processQuery(trimmedQuery);
    } else if (config.provider === 'gemini' && this.geminiService) {
      response = await this.geminiService.processQuery(trimmedQuery);
    } else {
      throw new Error(`${config.provider} service not configured properly`);
    }

    // Clean the response before returning
    return this.cleanResponse(response);
  }
}

export const culturalKnowledgeService = new CulturalKnowledgeService();
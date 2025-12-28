import { CulturalResponse } from '../types/CulturalTypes';

export class OpenAIService {
  private apiKey: string;
  private knowledgeBase: string = '';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  setKnowledgeBase(knowledgeBase: string): void {
    this.knowledgeBase = knowledgeBase;
  }

  async processQuery(query: string): Promise<CulturalResponse> {
    const startTime = Date.now();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a cultural guide for Meerut city. You must ONLY use the information provided in the knowledge base below. If the user asks about something not mentioned in the knowledge base, respond with "I don't have information about that topic in my knowledge base."

IMPORTANT RULES:
1. Only answer based on the provided knowledge base
2. Do not use any external knowledge about Meerut
3. If information is not in the knowledge base, say "I don't have information about that topic"
4. Be conversational and helpful when you do have the information
5. Always cite which section of the knowledge base you're referencing
6. You MUST NOT use general knowledge, assumptions, or external facts.
7. You MUST NOT guess or infer missing details.

If a user asks something that is NOT explicitly mentioned in product.md:
- Respond clearly and politely that the information is not available in the local guide.

Tone Guidelines:
- Be factual, neutral, and concise.
- Do not exaggerate or market the city.
- Do not add opinions beyond what is stated in the document.

Failure to follow these rules is considered an incorrect response.

KNOWLEDGE BASE:
${this.knowledgeBase}

Remember: ONLY use information from the knowledge base above. Do not add any external knowledge about Meerut.`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 500,
          temperature: 0.3, // Lower temperature for more consistent responses
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check your API key.');
        } else if (response.status === 429) {
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      }

      const data = await response.json();
      const answer = data.choices[0]?.message?.content || 'No response generated.';
      
      const responseTime = Date.now() - startTime;
      
      // Extract sources from the answer (simple heuristic)
      const sources = this.extractSources(answer);
      
      // Assess confidence based on response content
      const confidence = this.assessConfidence(answer);

      return {
        answer: answer.trim(),
        confidence,
        sources,
        processingMethod: 'openai',
        responseTime
      };

    } catch (error) {
      console.error('OpenAI API error:', error);
      
      if (error instanceof Error) {
        throw new Error(`OpenAI processing failed: ${error.message}`);
      } else {
        throw new Error('OpenAI processing failed: Unknown error');
      }
    }
  }

  private extractSources(answer: string): string[] {
    const sources: string[] = [];
    
    // Look for common patterns that indicate sources
    const knowledgeBaseSections = this.knowledgeBase.split('\n')
      .filter(line => line.startsWith('#'))
      .map(line => line.replace(/#+\s*/, ''));
    
    // Check if any section titles are mentioned in the answer
    for (const section of knowledgeBaseSections) {
      if (answer.toLowerCase().includes(section.toLowerCase())) {
        sources.push(section);
      }
    }
    
    // If no specific sections found, return general source
    if (sources.length === 0) {
      sources.push('Meerut Cultural Knowledge Base');
    }
    
    return [...new Set(sources)]; // Remove duplicates
  }

  private assessConfidence(answer: string): 'high' | 'medium' | 'low' | 'none' {
    const lowerAnswer = answer.toLowerCase();
    
    // If the response indicates no information available
    if (lowerAnswer.includes("don't have information") || 
        lowerAnswer.includes("not mentioned") ||
        lowerAnswer.includes("no information")) {
      return 'none';
    }
    
    // If the response is very short or vague
    if (answer.length < 100) {
      return 'low';
    }
    
    // If the response contains specific details and examples
    if (answer.length > 300 && 
        (lowerAnswer.includes('specifically') || 
         lowerAnswer.includes('example') || 
         lowerAnswer.includes('details'))) {
      return 'high';
    }
    
    // Default to medium confidence
    return 'medium';
  }

  // Test API key validity
  async testApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('API key test failed:', error);
      return false;
    }
  }
}
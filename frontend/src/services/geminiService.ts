import { CulturalResponse } from '../types/CulturalTypes';

export class GeminiService {
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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a cultural guide for Meerut city. You must ONLY use the information provided in the knowledge base below. If the user asks about something not mentioned in the knowledge base, respond with "I don't have information about that topic in my knowledge base."

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

KNOWLEDGE BASE FOR MEERUT:
${this.knowledgeBase}

USER QUESTION: ${query}

Remember: If the information is not in the knowledge base above, you must honestly say you don't have that information. Do not make up or assume anything.`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(`Gemini API error: ${errorData.error?.message || 'Bad request'}`);
        } else if (response.status === 403) {
          throw new Error('Invalid Gemini API key or quota exceeded. Please check your API key.');
        } else if (response.status === 429) {
          throw new Error('Gemini API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`Gemini API error: ${response.status}`);
        }
      }

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      
      const responseTime = Date.now() - startTime;
      
      // Extract sources from the answer
      const sources = this.extractSources(answer);
      
      // Assess confidence based on response content
      const confidence = this.assessConfidence(answer);

      return {
        answer: answer.trim(),
        confidence,
        sources,
        processingMethod: 'gemini',
        responseTime
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      
      if (error instanceof Error) {
        throw new Error(`Gemini processing failed: ${error.message}`);
      } else {
        throw new Error('Gemini processing failed: Unknown error');
      }
    }
  }

  private extractSources(answer: string): string[] {
    const sources: string[] = [];
    
    // Look for section references in the answer
    const sectionMatches = answer.match(/section \d+/gi) || [];
    sectionMatches.forEach(match => {
      sources.push(`Knowledge Base ${match}`);
    });
    
    // Look for common patterns that indicate sources
    const knowledgeBaseSections = this.knowledgeBase.split('\n')
      .filter(line => line.includes('SECTION') || line.startsWith('#'))
      .map(line => line.replace(/[=#]+\s*/, '').replace(/SECTION \d+:\s*/, ''))
      .filter(line => line.trim().length > 0);
    
    // Check if any section titles are mentioned in the answer
    for (const section of knowledgeBaseSections.slice(0, 10)) { // Limit to first 10 sections
      if (answer.toLowerCase().includes(section.toLowerCase().substring(0, 20))) {
        sources.push(section);
      }
    }
    
    // If no specific sections found, return general source
    if (sources.length === 0) {
      sources.push('Meerut Local Guide');
    }
    
    return [...new Set(sources)].slice(0, 3); // Remove duplicates and limit to 3
  }

  private assessConfidence(answer: string): 'high' | 'medium' | 'low' | 'none' {
    const lowerAnswer = answer.toLowerCase();
    
    // If the response indicates no information available
    if (lowerAnswer.includes("don't have information") || 
        lowerAnswer.includes("not mentioned") ||
        lowerAnswer.includes("no information") ||
        lowerAnswer.includes("not in my") ||
        lowerAnswer.includes("not available")) {
      return 'none';
    }
    
    // If the response is very short or vague
    if (answer.length < 80) {
      return 'low';
    }
    
    // If the response contains specific details and examples
    if (answer.length > 250 && 
        (lowerAnswer.includes('specifically') || 
         lowerAnswer.includes('example') || 
         lowerAnswer.includes('details') ||
         lowerAnswer.includes('according to'))) {
      return 'high';
    }
    
    // Default to medium confidence
    return 'medium';
  }

  // Test API key validity
  async testApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, this is a test.'
            }]
          }]
        }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Gemini API key test failed:', error);
      return false;
    }
  }
}
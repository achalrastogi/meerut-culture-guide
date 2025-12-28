import React, { useState, useCallback } from 'react';
import { LLMConfig } from '../types/CulturalTypes';

interface SearchInterfaceProps {
  onQuerySubmit: (query: string) => void;
  isLoading: boolean;
  llmConfig: LLMConfig;
  onSettingsClick: () => void;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onQuerySubmit,
  isLoading,
  llmConfig,
  onSettingsClick
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onQuerySubmit(query.trim());
    }
  }, [query, onQuerySubmit]);

  const exampleQueries = [
    "Tell me about Nauchandi Mela",
    "What are Meerut's famous foods?",
    "History of 1857 rebellion in Meerut",
    "Is halwa paratha famous in Meerut?",
    "What industries is Meerut known for?",
    "Tell me about Meerut's festivals"
  ];

  const getProcessingMethodDisplay = () => {
    if (llmConfig.provider === 'openai') {
      return '🧠 OpenAI GPT';
    }
    return '🔧 Rule-Based';
  };

  return (
    <div className="search-interface">
      <div className="search-header">
        <div className="header-top">
          <h1>🏛️ Meerut Culture Guide</h1>
          <button 
            onClick={onSettingsClick}
            className="settings-button"
            title="LLM Settings"
          >
            ⚙️
          </button>
        </div>
        <p>Ask me anything about Meerut's rich cultural heritage</p>
        <div className="processing-method">
          <span>Processing with: {getProcessingMethodDisplay()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about Meerut's culture, festivals, food, history..."
            className="search-input"
            disabled={isLoading}
            maxLength={500}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? '🤔 Thinking...' : '💬 Ask'}
          </button>
        </div>
      </form>

      <div className="example-queries">
        <h3>Try these example questions:</h3>
        <div className="example-buttons">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="example-button"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;
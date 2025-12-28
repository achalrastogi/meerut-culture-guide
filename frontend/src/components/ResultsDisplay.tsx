import React from 'react';
import { CulturalResponse } from '../types/CulturalTypes';

interface ResultsDisplayProps {
  response: CulturalResponse | null;
  isLoading: boolean;
  error: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  response,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="results-display loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Processing your question using cultural knowledge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-display error">
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <p className="error-suggestion">
            Please try asking a different question about Meerut's culture.
          </p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="results-display welcome">
        <div className="welcome-message">
          <h2>🙏 Welcome to Meerut Culture Guide</h2>
          <p>I'm your AI guide to Meerut's rich cultural heritage. Ask me anything about:</p>
          
          <div className="cultural-highlights">
            <div className="highlight-grid">
              <div className="highlight-card">
                <h4>🎭 Festivals & Celebrations</h4>
                <p>Nauchandi Mela, Dussehra, Ganga Aarti, and religious celebrations</p>
              </div>
              <div className="highlight-card">
                <h4>🏛️ Historical Heritage</h4>
                <p>1857 Rebellion, Vedic period, Buddhist heritage, ancient origins</p>
              </div>
              <div className="highlight-card">
                <h4>🍽️ Food & Cuisine</h4>
                <p>Gazak, Revri, Halwa Paratha, street food, and culinary traditions</p>
              </div>
              <div className="highlight-card">
                <h4>🏭 Industries & Crafts</h4>
                <p>Sports goods, brass work, textiles, and traditional craftsmanship</p>
              </div>
              <div className="highlight-card">
                <h4>🤝 Social Customs</h4>
                <p>Religious harmony, wedding traditions, hospitality, and community life</p>
              </div>
              <div className="highlight-card">
                <h4>🎓 Modern Culture</h4>
                <p>Educational institutions, youth culture, and contemporary developments</p>
              </div>
            </div>
          </div>
          
          <p className="guide-note">
            💡 I use only authentic information from Meerut's cultural knowledge base. 
            If I don't know something, I'll tell you honestly!
          </p>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'low': return '#FF5722';
      default: return '#9E9E9E';
    }
  };

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'High confidence - Found detailed information';
      case 'medium': return 'Medium confidence - Found relevant information';
      case 'low': return 'Low confidence - Limited information available';
      default: return 'No relevant information found';
    }
  };

  const formatAnswer = (answer: string) => {
    return answer.split('\n').map((paragraph, index) => {
      if (paragraph.trim()) {
        return <p key={index}>{paragraph}</p>;
      }
      return null;
    });
  };

  return (
    <div className="results-display">
      <div className="response-header">
        <h2>🤖 Cultural Guide Response</h2>
        <div className="response-meta">
          <div className="confidence-indicator">
            <span 
              className="confidence-badge"
              style={{ backgroundColor: getConfidenceColor(response.confidence) }}
            >
              {getConfidenceText(response.confidence)}
            </span>
          </div>
          <div className="processing-info">
            <span className="processing-method">
              {response.processingMethod === 'openai' ? '🧠 OpenAI GPT' : '🔧 Rule-Based'}
            </span>
            {response.responseTime && (
              <span className="response-time">
                ⚡ {response.responseTime}ms
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="response-content">
        <div className="answer-text">
          {formatAnswer(response.answer)}
        </div>
        
        {response.sources.length > 0 && (
          <div className="sources">
            <h4>📚 Sources from Cultural Knowledge Base:</h4>
            <ul>
              {response.sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="response-footer">
        <small>
          ℹ️ This response is generated from Meerut's cultural knowledge base. 
          Ask another question to learn more!
        </small>
      </div>
    </div>
  );
};

export default ResultsDisplay;
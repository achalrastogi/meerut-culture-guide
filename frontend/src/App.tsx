import React, { useState, useCallback } from 'react';
import SearchInterface from './components/SearchInterface';
import ResultsDisplay from './components/ResultsDisplay';
import LLMSettings from './components/LLMSettings';
import { culturalKnowledgeService } from './services/culturalKnowledgeService';
import { SearchState } from './types/CulturalTypes';
import './App.css';

const App: React.FC = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isLoading: false,
    response: null,
    error: null,
    llmConfig: {
      provider: 'gemini' // Default to Gemini
    }
  });

  const [showSettings, setShowSettings] = useState(false);

  const handleQuerySubmit = useCallback(async (query: string) => {
    setSearchState(prev => ({
      ...prev,
      query,
      isLoading: true,
      error: null,
      response: null
    }));

    try {
      const response = await culturalKnowledgeService.processQuery(query, searchState.llmConfig);
      
      setSearchState(prev => ({
        ...prev,
        response,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setSearchState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  }, [searchState.llmConfig]);

  const handleConfigChange = useCallback((newConfig: typeof searchState.llmConfig) => {
    setSearchState(prev => ({
      ...prev,
      llmConfig: newConfig
    }));
    
    // Update the service configuration
    culturalKnowledgeService.setLLMConfig(newConfig);
  }, []);

  const handleTestConnection = useCallback(async (): Promise<boolean> => {
    return await culturalKnowledgeService.testConnection(searchState.llmConfig);
  }, [searchState.llmConfig]);

  const clearError = useCallback(() => {
    setSearchState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <SearchInterface
            onQuerySubmit={handleQuerySubmit}
            isLoading={searchState.isLoading}
            llmConfig={searchState.llmConfig}
            onSettingsClick={() => setShowSettings(true)}
          />
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {searchState.error && (
            <div className="error-banner">
              <span>{searchState.error}</span>
              <button onClick={clearError} className="error-close">×</button>
            </div>
          )}
          
          <ResultsDisplay
            response={searchState.response}
            isLoading={searchState.isLoading}
            error={searchState.error}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            🏛️ Meerut Culture Guide - Your AI companion for exploring Meerut's heritage
          </p>
          <p>
            <small>
              Choose between Google Gemini (recommended, free tier) or OpenAI GPT (advanced, requires API key) • 
              All answers sourced from cultural knowledge base
            </small>
          </p>
        </div>
      </footer>

      <LLMSettings
        config={searchState.llmConfig}
        onConfigChange={handleConfigChange}
        onTestConnection={handleTestConnection}
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default App;
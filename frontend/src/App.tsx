import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Send, MapPin, Loader2, TrendingUp, Sparkles, ChevronRight, Menu, X, Settings, BookOpen } from 'lucide-react';
import { culturalKnowledgeService } from './services/culturalKnowledgeService';
import { SearchState, Category, PopularTopic } from './types/CulturalTypes';
import LLMSettings from './components/LLMSettings';
import './App.css';

const App: React.FC = () => {
  // Load saved config from localStorage
  const loadSavedConfig = (): SearchState['llmConfig'] => {
    try {
      const saved = localStorage.getItem('meerut-llm-config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load saved config:', error);
    }
    return { provider: 'gemini' };
  };

  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    isLoading: false,
    response: null,
    error: null,
    llmConfig: loadSavedConfig()
  });

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, content: string, timestamp: Date}>>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    { id: 'festivals', name: 'Festivals & Celebrations', icon: '🎉', color: 'bg-purple-100 text-purple-700' },
    { id: 'food', name: 'Food & Cuisine', icon: '🍽️', color: 'bg-orange-100 text-orange-700' },
    { id: 'history', name: 'Historical Context', icon: '📜', color: 'bg-blue-100 text-blue-700' },
    { id: 'industries', name: 'Industries & Crafts', icon: '🏭', color: 'bg-green-100 text-green-700' },
    { id: 'religious', name: 'Religious Harmony', icon: '🕉️', color: 'bg-pink-100 text-pink-700' },
    { id: 'customs', name: 'Local Customs', icon: '🎭', color: 'bg-indigo-100 text-indigo-700' },
  ];

  const exampleQuestions = [
    "Tell me about Nauchandi Mela",
    "What are Meerut's famous food items?",
    "History of 1857 rebellion in Meerut",
    "Is home paradise famous in Meerut?",
    "What industries is Meerut known for?",
    "Tell me about Meerut's festivals"
  ];

  const popularTopics: PopularTopic[] = [
    { title: "Nauchandi Mela", queries: 145 },
    { title: "Sports Goods Industry", queries: 98 },
    { title: "Gazak & Revri", queries: 87 },
    { title: "1857 Rebellion", queries: 76 },
    { title: "Brass Instruments", queries: 65 }
  ];

  const formatMessageContent = (content: string) => {
    // Split by lines
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: JSX.Element[] = [];
    
    const flushList = (idx: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${idx}`} style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };
    
    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      
      // Handle numbered lists (1., 2., 3., etc.)
      if (/^\d+\./.test(trimmedLine)) {
        if (!inList) {
          inList = true;
        }
        const text = trimmedLine.replace(/^\d+\.\s*/, '');
        // Handle bold text within list items
        if (text.includes('**')) {
          const parts = text.split('**');
          listItems.push(
            <li key={idx} style={{ marginBottom: '0.75rem', lineHeight: '1.6' }}>
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </li>
          );
        } else {
          listItems.push(
            <li key={idx} style={{ marginBottom: '0.75rem', lineHeight: '1.6' }}>
              {text}
            </li>
          );
        }
      }
      // Handle bullet points (* or -)
      else if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
        if (!inList) {
          inList = true;
        }
        const text = trimmedLine.replace(/^[\*\-]\s*/, '');
        // Handle bold text within list items
        if (text.includes('**')) {
          const parts = text.split('**');
          listItems.push(
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </li>
          );
        } else {
          listItems.push(
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              {text}
            </li>
          );
        }
      }
      // Regular text - flush any pending list first
      else if (trimmedLine) {
        flushList(idx);
        
        // Handle bold text with **
        if (trimmedLine.includes('**')) {
          const parts = trimmedLine.split('**');
          elements.push(
            <p key={idx} style={{ marginBottom: '0.75rem', lineHeight: '1.6' }}>
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </p>
          );
        } else {
          elements.push(
            <p key={idx} style={{ marginBottom: '0.75rem', lineHeight: '1.6' }}>
              {trimmedLine}
            </p>
          );
        }
      }
      // Empty line - flush list
      else {
        flushList(idx);
      }
    });
    
    // Flush any remaining list items
    flushList(lines.length);
    
    return <div>{elements}</div>;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize service with saved config on mount
  useEffect(() => {
    if (searchState.llmConfig.apiKey) {
      culturalKnowledgeService.setLLMConfig(searchState.llmConfig);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || searchState.isLoading) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    setSearchState(prev => ({
      ...prev,
      query: input,
      isLoading: true,
      error: null
    }));

    try {
      const response = await culturalKnowledgeService.processQuery(input, searchState.llmConfig);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      setSearchState(prev => ({
        ...prev,
        response,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      const errorMsg = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      
      setSearchState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  }, [input, searchState.isLoading, searchState.llmConfig]);

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    const categoryQuestions: Record<string, string> = {
      festivals: "Tell me about festivals and celebrations in Meerut",
      food: "What are the famous food items and cuisine of Meerut?",
      history: "Tell me about Meerut's historical significance",
      industries: "What industries and crafts is Meerut known for?",
      religious: "Tell me about religious harmony in Meerut",
      customs: "What are the local customs and traditions of Meerut?"
    };
    setInput(categoryQuestions[category.id] || '');
  };

  const handleConfigChange = useCallback((newConfig: typeof searchState.llmConfig) => {
    // Save to localStorage
    try {
      localStorage.setItem('meerut-llm-config', JSON.stringify(newConfig));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
    
    setSearchState(prev => ({
      ...prev,
      llmConfig: newConfig
    }));
    culturalKnowledgeService.setLLMConfig(newConfig);
  }, []);

  const handleTestConnection = useCallback(async (): Promise<boolean> => {
    return await culturalKnowledgeService.testConnection(searchState.llmConfig);
  }, [searchState.llmConfig]);

  return (
    <div className="enhanced-app">
      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <MapPin className="sidebar-icon" />
            <h2>Explore Meerut</h2>
          </div>
          <p className="sidebar-subtitle">Browse by category</p>
        </div>

        <div className="sidebar-content">
          {/* Categories */}
          <div className="sidebar-section">
            <h3 className="section-title">Categories</h3>
            <div className="category-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`category-item ${selectedCategory?.id === category.id ? 'category-active' : ''}`}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <ChevronRight className="category-arrow" />
                </button>
              ))}
            </div>
          </div>

          {/* Popular Topics */}
          <div className="sidebar-section">
            <h3 className="section-title">
              <TrendingUp className="section-icon" />
              Popular Topics
            </h3>
            <div className="popular-list">
              {popularTopics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(`Tell me about ${topic.title}`)}
                  className="popular-item"
                >
                  <span className="popular-title">{topic.title}</span>
                  <span className="popular-count">{topic.queries}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="header-content">
            <div className="header-left">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="toggle-sidebar"
              >
                {showSidebar ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="header-info">
                <div className="header-brand">
                  <Sparkles className="brand-icon" />
                  <h1>Meerut Culture Guide</h1>
                </div>
                <p className="header-tagline">Ask me anything about Meerut's rich cultural heritage</p>
              </div>
            </div>
            <div className="header-right">
              <button
                onClick={() => setShowSettings(true)}
                className="settings-btn"
                title="LLM Settings"
              >
                <Settings size={20} />
              </button>
              <div className="header-credits">
                <div className="credit-label">Powered with ❤️</div>
                <div className="credit-name">by Kiro Meerut</div>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="chat-area">
          <div className="chat-container">
            {messages.length === 0 ? (
              <div className="welcome-screen">
                <div className="welcome-icon">
                  <BookOpen size={48} />
                </div>
                <h2 className="welcome-title">Welcome to Meerut Culture Guide</h2>
                <p className="welcome-text">Explore the rich cultural heritage of Meerut city</p>
                
                <div className="example-section">
                  <h3 className="example-title">Try these example questions:</h3>
                  <div className="example-grid">
                    {exampleQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExampleClick(q)}
                        className="example-btn"
                        disabled={searchState.isLoading}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
                  >
                    <div className="message-content">
                      <div className="message-text">
                        {msg.role === 'assistant' ? formatMessageContent(msg.content) : msg.content}
                      </div>
                      {msg.role === 'assistant' && (
                        <div className="message-footer">
                          <BookOpen size={12} />
                          <span>Source: Meerut Cultural Knowledge Base</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {searchState.isLoading && (
                  <div className="message message-assistant">
                    <div className="message-content">
                      <Loader2 className="loading-spinner" size={20} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
              placeholder="Ask about festivals, food, history, industries..."
              className="chat-input"
              disabled={searchState.isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={searchState.isLoading || !input.trim()}
              className="send-btn"
            >
              <span>Ask</span>
              <Send size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* LLM Settings Modal */}
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
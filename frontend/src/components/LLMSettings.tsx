import React, { useState, useCallback } from 'react';
import { LLMConfig } from '../types/CulturalTypes';

interface LLMSettingsProps {
  config: LLMConfig;
  onConfigChange: (config: LLMConfig) => void;
  onTestConnection?: () => Promise<boolean>;
  isVisible: boolean;
  onClose: () => void;
}

const LLMSettings: React.FC<LLMSettingsProps> = ({
  config,
  onConfigChange,
  onTestConnection,
  isVisible,
  onClose
}) => {
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleProviderChange = useCallback((provider: 'gemini' | 'openai') => {
    const newConfig: LLMConfig = {
      provider,
      apiKey: apiKey
    };
    onConfigChange(newConfig);
  }, [apiKey, onConfigChange]);

  const handleApiKeyChange = useCallback((newApiKey: string) => {
    setApiKey(newApiKey);
    onConfigChange({
      provider: config.provider,
      apiKey: newApiKey
    });
  }, [config.provider, onConfigChange]);

  const handleTestConnection = useCallback(async () => {
    if (!onTestConnection || !apiKey) return;

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const isValid = await onTestConnection();
      setConnectionStatus(isValid ? 'success' : 'error');
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  }, [onTestConnection, apiKey]);

  if (!isVisible) return null;

  return (
    <div className="llm-settings-overlay">
      <div className="llm-settings-modal">
        <div className="settings-header">
          <h3>🤖 LLM Settings</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="settings-content">
          <div className="provider-selection">
            <h4>Choose AI Provider:</h4>
            
            <div className="provider-option">
              <label className="provider-label">
                <input
                  type="radio"
                  name="provider"
                  value="gemini"
                  checked={config.provider === 'gemini'}
                  onChange={() => handleProviderChange('gemini')}
                />
                <div className="provider-info">
                  <strong>💎 Google Gemini (Recommended)</strong>
                  <p>Advanced AI with excellent cultural understanding and free tier available.</p>
                  <div className="provider-features">
                    <span className="feature">🆓 Free tier available</span>
                    <span className="feature">🧠 Advanced reasoning</span>
                    <span className="feature">🌍 Cultural awareness</span>
                    <span className="feature">⚡ Fast responses</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="provider-option">
              <label className="provider-label">
                <input
                  type="radio"
                  name="provider"
                  value="openai"
                  checked={config.provider === 'openai'}
                  onChange={() => handleProviderChange('openai')}
                />
                <div className="provider-info">
                  <strong>🧠 OpenAI GPT (Alternative)</strong>
                  <p>Industry-leading language model with human-like responses.</p>
                  <div className="provider-features">
                    <span className="feature">🔑 Requires API key</span>
                    <span className="feature">💰 Usage costs apply</span>
                    <span className="feature">🌐 Internet required</span>
                    <span className="feature">🎯 Nuanced answers</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="api-config">
            <h4>{config.provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} Configuration:</h4>
            
            <div className="api-key-section">
              <label htmlFor="api-key">API Key:</label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={config.provider === 'gemini' ? 'AIza...' : 'sk-...'}
                className="api-key-input"
              />
              
              <button
                onClick={handleTestConnection}
                disabled={!apiKey || isTestingConnection}
                className="test-connection-button"
              >
                {isTestingConnection ? '🔄 Testing...' : '🧪 Test Connection'}
              </button>
            </div>

            {connectionStatus === 'success' && (
              <div className="connection-status success">
                ✅ API key is valid and working!
              </div>
            )}

            {connectionStatus === 'error' && (
              <div className="connection-status error">
                ❌ API key test failed. Please check your key.
              </div>
            )}

            <div className="api-key-help">
              {config.provider === 'gemini' ? (
                <>
                  <p><strong>How to get a Google Gemini API key:</strong></p>
                  <ol>
                    <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy and paste the key above</li>
                  </ol>
                  <p><small>💡 Gemini offers a generous free tier perfect for personal use!</small></p>
                </>
              ) : (
                <>
                  <p><strong>How to get an OpenAI API key:</strong></p>
                  <ol>
                    <li>Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com/api-keys</a></li>
                    <li>Sign in or create an account</li>
                    <li>Click "Create new secret key"</li>
                    <li>Copy and paste the key above</li>
                  </ol>
                </>
              )}
              <p><small>⚠️ Your API key is stored locally and never sent to our servers.</small></p>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={onClose} className="save-button">
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default LLMSettings;
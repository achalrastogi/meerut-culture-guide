# 🏛️ Meerut Culture Guide

A frontend-only cultural knowledge platform that uses an LLM-based approach to help users understand Meerut city's rich cultural heritage, traditions, and local customs. The application serves as a cultural bridge, providing insights about Meerut's unique blend of ancient traditions and modern development.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Development

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Application: http://localhost:3000

## 🏗️ Architecture

### Frontend-Only Application
- **Port:** 3000
- **Framework:** React 18 with TypeScript
- **Knowledge Base:** Static product.md file loaded from public directory
- **LLM Approach:** Client-side natural language processing
- **Build Tool:** Vite
- **No Backend Required:** All processing happens in the browser

## 🎯 Features

- **Natural Language Queries:** Ask questions about Meerut's culture in plain English
- **AI-Powered Responses:** Choose between Google Gemini or OpenAI GPT for intelligent responses
- **Knowledge Base Driven:** All answers sourced from the cultural knowledge base
- **Honest Responses:** Says "I don't know" when information isn't in the knowledge base
- **Confidence Indicators:** Shows confidence level for each response
- **Responsive Design:** Works on desktop, tablet, and mobile devices
- **No External Dependencies:** Completely self-contained application

## 📚 Cultural Knowledge Areas

The application can answer questions about:

- **Historical Heritage:** 1857 Rebellion, Vedic period, Buddhist heritage
- **Festivals:** Nauchandi Mela, Dussehra, Ganga Aarti
- **Local Industries:** Sports goods manufacturing, brass work, textiles
- **Food Culture:** Gazak, Revri, Halwa Paratha, street food
- **Social Customs:** Religious harmony, wedding traditions, hospitality
- **Modern Culture:** Educational institutions, youth culture, contemporary developments

## 🛠️ Development Commands

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Code quality
npm run lint            # Lint code
npm run type-check      # TypeScript validation
```

## 📁 Project Structure

```
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── services/   # LLM-based knowledge service
│   │   ├── types/      # TypeScript types
│   │   └── App.tsx     # Main app component
│   ├── public/
│   │   └── product.md  # Cultural knowledge base
│   └── package.json
├── product.md          # Original knowledge base
└── README.md           # This file
```

## 🧠 **Dual LLM Approach**

The application offers **two AI-powered processing methods** that users can choose from:

### 💎 **Google Gemini (Recommended)**
- 🆓 **Free tier available** - Generous free usage limits
- 🧠 **Advanced reasoning** - Excellent cultural understanding
- 🌍 **Cultural awareness** - Better context for regional topics
- ⚡ **Fast responses** - Quick API response times
- 🔑 **Requires API key** - Users provide their own Google Gemini API key

**How it works:** Uses Google's Gemini Pro model with the entire product.md as context, with strict instructions to only use that information.

### 🧠 **OpenAI GPT (Alternative)**
- 🎯 **Industry-leading** - Most advanced language model
- 💰 **Usage costs apply** - Based on OpenAI's pricing
- 🌐 **Internet required** - Makes API calls to OpenAI
- 🔑 **Requires API key** - Users provide their own OpenAI API key
- 🛡️ **Knowledge-constrained** - Only uses product.md content

**How it works:** Sends the entire product.md as context to OpenAI GPT with strict instructions to only use that information.

## 🎛️ **Switching Between Methods**

Users can easily switch between AI providers:
1. Click the ⚙️ settings button in the top-right
2. Choose between "Google Gemini" (recommended) or "OpenAI GPT"
3. Enter your API key for the selected provider
4. Test the connection to verify it works
5. Save settings and start asking questions

Both methods will:
- ✅ Only use information from product.md
- ✅ Say "I don't know" when information isn't available
- ✅ Provide source attribution
- ✅ Show confidence levels
- ✅ Give natural, conversational responses

## 🔑 **Getting API Keys**

### Google Gemini (Recommended - Free Tier Available)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and use in the application

### OpenAI (Alternative)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy and use in the application

## 🎨 Example Queries

Try asking these questions:

- "Tell me about Nauchandi Mela"
- "What are Meerut's famous foods?"
- "Is halwa paratha famous in Meerut?"
- "History of 1857 rebellion in Meerut"
- "What industries is Meerut known for?"
- "Tell me about Meerut's festivals"

## 🚀 Deployment

### GitHub Pages (Recommended)

This application is configured for automatic deployment to GitHub Pages:

1. **Fork or clone this repository**
2. **Enable GitHub Pages in repository settings:**
   - Go to Settings → Pages
   - Source: "GitHub Actions"
3. **Push to main branch** - deployment happens automatically
4. **Access your deployed app** at: `https://yourusername.github.io/meerut-culture-guide/`

The GitHub Actions workflow will:
- ✅ Install dependencies
- ✅ Build the application
- ✅ Deploy to GitHub Pages
- ✅ Handle all configuration automatically

### Manual Deployment

For other static hosting providers:

```bash
cd frontend
npm run build
```

Deploy the `frontend/dist` directory to any static web server:
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload `dist` contents to S3 bucket
- **Any web server**: Copy `dist` contents to web root

### Local Development

```bash
cd frontend
npm install
npm run dev
```

Application runs at http://localhost:3000

## 🎯 Key Benefits

- **No Backend Required:** Simple deployment as static files
- **Privacy Friendly:** All processing happens locally in the browser
- **Fast Responses:** No network calls after initial load
- **Reliable:** No external API dependencies
- **Honest:** Clearly states when information isn't available
- **Educational:** Provides confidence levels and sources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Cultural information sourced from historical records and local traditions
- Built with modern web technologies for optimal performance
- Designed to preserve and share Meerut's rich cultural heritage
- Uses LLM-inspired techniques for natural language understanding
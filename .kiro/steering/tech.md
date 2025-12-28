# Technology Stack & Build System

## Architecture

Frontend-only web application with React and TypeScript, using AI-powered natural language processing (Google Gemini & OpenAI GPT).

## Frontend Stack

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Custom CSS** with Grid/Flexbox for responsive design
- **Lucide React** for modern icon components
- **AI Integration**: Google Gemini API & OpenAI GPT API
- **Static File Loading** for knowledge base access
- **LocalStorage** for API key persistence

## AI/LLM Approach

- **Primary**: Google Gemini 2.5 Flash (free tier available, recommended)
- **Alternative**: OpenAI GPT (requires paid API key)
- **Knowledge Base**: Static product.md file loaded from public directory
- **Context Injection**: Entire knowledge base sent to AI with strict instructions
- **Response Formatting**: Markdown-style formatting (lists, bold text, paragraphs)
- **Honest Responses**: AI instructed to say "I don't know" when information unavailable

## Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.294.0",
  "axios": "^1.6.2"
}
```

## Development Tools

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking
- **Vite** for development server and building

## Common Commands

```bash
# Navigate to frontend directory
cd frontend

# Development
npm install          # Install dependencies
npm run dev         # Start development server (port 3000)
npm run build       # Production build
npm run preview     # Preview production build
npm test            # Run test suite

# Code Quality
npm run lint        # Lint code
npm run type-check  # TypeScript validation
```

## API Configuration

### Google Gemini
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Model**: `gemini-2.5-flash`
- **Free Tier**: 15 requests/minute, 1,500 requests/day
- **API Key Format**: 39 characters starting with "AIza"

### OpenAI
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: `gpt-3.5-turbo`
- **Pricing**: Pay per token
- **API Key Format**: Starts with "sk-"

## Storage & Persistence

- **LocalStorage Key**: `meerut-llm-config`
- **Stored Data**: Provider selection (gemini/openai) and API key
- **Privacy**: Keys stored only in user's browser, never on servers

## Performance Requirements

- **Response Time**: 2-5 seconds (depends on AI API)
- **Knowledge Loading**: Instant (static file from CDN)
- **Caching**: Browser-based caching of knowledge base
- **Build Size**: ~165KB (gzipped)

## Configuration

- **No Backend Required**: Static file deployment
- **Environment Variables**: Build-time configuration only
- **TypeScript**: Strict mode enabled
- **Responsive Design**: Mobile-first approach
- **Base Path**: Configurable for GitHub Pages (`/meerut-culture-guide/`)

## Deployment

### GitHub Pages (Automatic)
- **Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: Push to main branch
- **Build Time**: ~2-3 minutes
- **URL**: `https://username.github.io/meerut-culture-guide/`

### Manual Deployment
- **Build Output**: `frontend/dist/`
- **Static Hosting**: Any static web server (Netlify, Vercel, AWS S3, etc.)
- **CDN Ready**: Optimized for content delivery networks

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Requirements**: ES6+ support, LocalStorage API, Fetch API
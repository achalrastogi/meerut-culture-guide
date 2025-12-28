# Project Structure & Organization

## Frontend-Only Application Layout

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── .kiro/                      # Kiro configuration and specs
│   ├── specs/                  # Project specifications
│   │   └── meerut-culture-guide/
│   │       ├── requirements.md # Feature requirements
│   │       ├── design.md       # Design document
│   │       └── tasks.md        # Implementation tasks
│   └── steering/               # Steering documents
│       ├── product.md          # Product overview
│       ├── tech.md             # Technology stack
│       └── structure.md        # This file
├── frontend/                   # React application (main application)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── LLMSettings.tsx # AI provider settings modal
│   │   │   ├── SearchInterface.tsx # (Legacy - not used)
│   │   │   └── ResultsDisplay.tsx  # (Legacy - not used)
│   │   ├── services/           # AI/LLM services
│   │   │   ├── culturalKnowledgeService.ts # Main service orchestrator
│   │   │   ├── geminiService.ts            # Google Gemini integration
│   │   │   └── openAIService.ts            # OpenAI GPT integration
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── CulturalTypes.ts # All type definitions
│   │   ├── App.tsx             # Main application component (chat UI)
│   │   ├── App.css             # Application styles
│   │   └── main.tsx            # Application entry point
│   ├── public/                 # Static assets
│   │   └── product.md          # Cultural knowledge base (source of truth)
│   ├── package.json            # Dependencies and scripts
│   ├── tsconfig.json           # TypeScript configuration
│   └── vite.config.ts          # Vite build configuration
├── product.md                  # Original cultural knowledge base (reference)
├── README.md                   # Project documentation
├── DEPLOYMENT.md               # Deployment guide
├── FIXES.md                    # Recent fixes documentation
├── FORMATTING-EXAMPLE.md       # Message formatting examples
├── GEMINI-API-KEY-TROUBLESHOOTING.md # API key troubleshooting
└── .gitignore                  # Git ignore rules
```

## Key Conventions

### File Naming
- **Components**: PascalCase (e.g., `LLMSettings.tsx`)
- **Services**: camelCase (e.g., `culturalKnowledgeService.ts`)
- **Types**: PascalCase with descriptive names (e.g., `CulturalTypes.ts`)
- **Tests**: Same name as file with `.test.ts` suffix

### Component Organization
- One component per file
- Export default for main component
- Named exports for related types/interfaces
- Co-locate component-specific styles and tests

### Data Flow
- **Frontend**: App.tsx → culturalKnowledgeService → geminiService/openAIService → AI API
- **Knowledge Loading**: Static file loading from public directory (product.md)
- **Processing**: AI-powered natural language processing via external APIs
- **Storage**: LocalStorage for API key persistence

## Application Architecture

### Main Components

1. **App.tsx** - Main chat interface
   - Chat message display
   - Input handling
   - Category sidebar
   - Popular topics
   - Settings modal integration
   - Message formatting (lists, bold text)

2. **LLMSettings.tsx** - AI provider configuration
   - Provider selection (Gemini/OpenAI)
   - API key input
   - Connection testing
   - LocalStorage persistence

3. **culturalKnowledgeService.ts** - Service orchestrator
   - Knowledge base loading (product.md)
   - Service initialization
   - Query routing to appropriate AI service
   - Fallback path handling for GitHub Pages

4. **geminiService.ts** - Google Gemini integration
   - API communication
   - Prompt engineering
   - Response parsing
   - Confidence assessment

5. **openAIService.ts** - OpenAI GPT integration
   - API communication
   - Prompt engineering
   - Response parsing
   - Confidence assessment

### AI/LLM Processing Flow

```
User Query
    ↓
App.tsx (handleSubmit)
    ↓
culturalKnowledgeService.processQuery()
    ↓
Load product.md (if not loaded)
    ↓
Route to geminiService or openAIService
    ↓
Send query + full knowledge base to AI API
    ↓
AI processes and generates response
    ↓
Parse response, assess confidence
    ↓
Return formatted response
    ↓
App.tsx formats message (lists, bold)
    ↓
Display in chat UI
```

### Message Formatting

The `formatMessageContent()` function in App.tsx handles:
- **Numbered lists**: Lines starting with `1.`, `2.`, `3.` → `<ol><li>`
- **Bullet lists**: Lines starting with `*` or `-` → `<ul><li>`
- **Bold text**: Text wrapped in `**` → `<strong>`
- **Paragraphs**: Regular text with proper spacing

### LocalStorage Schema

```typescript
// Key: 'meerut-llm-config'
{
  provider: 'gemini' | 'openai',
  apiKey: string
}
```

## Configuration Management

### Build Configuration
- **Development**: Base path `/`
- **Production**: Base path `/meerut-culture-guide/` (GitHub Pages)
- **Environment**: Detected via `process.env.NODE_ENV`

### Vite Configuration
```typescript
base: process.env.NODE_ENV === 'production' 
  ? '/meerut-culture-guide/' 
  : '/'
```

### TypeScript Configuration
- Strict mode enabled
- ES2020 target
- Module: ESNext
- JSX: react-jsx

## Deployment Architecture

### GitHub Pages Workflow
1. Push to main branch
2. GitHub Actions triggers
3. Install dependencies (`npm ci`)
4. Build application (`npm run build`)
5. Upload artifacts to GitHub Pages
6. Deploy to `https://username.github.io/meerut-culture-guide/`

### Static File Structure (Deployed)
```
dist/
├── index.html              # Main HTML file
├── product.md              # Knowledge base
└── assets/
    ├── index-[hash].js     # Application JavaScript
    └── index-[hash].css    # Application styles
```

## Best Practices

### Code Organization
- Keep components focused and single-purpose
- Extract reusable logic into services
- Use TypeScript for type safety
- Follow React hooks best practices

### AI Integration
- Always include full knowledge base in prompts
- Instruct AI to say "I don't know" for unavailable info
- Set appropriate temperature (0.3 for factual responses)
- Handle API errors gracefully

### Performance
- Lazy load knowledge base on first query
- Cache knowledge base in memory
- Use localStorage for settings persistence
- Minimize bundle size

### Security
- Never commit API keys to repository
- Store keys only in browser localStorage
- Keys sent only to official AI APIs
- No server-side storage of user data
# Technology Stack & Build System

## Architecture

Frontend-only web application with React and TypeScript, using LLM-based natural language processing.

## Frontend Stack

- **React** with TypeScript for type safety
- **Vite** for fast development and building
- **Custom CSS** with Grid/Flexbox for responsive design
- **LLM-Based Processing** for natural language understanding
- **Static File Loading** for knowledge base access
- **Jest + React Testing Library** for testing

## LLM Approach

- **Knowledge Base**: Static product.md file loaded from public directory
- **Context Extraction**: Relevance scoring and section identification
- **Response Generation**: Natural language synthesis from context
- **Confidence Assessment**: Evaluation of answer quality
- **Honest Responses**: Clear indication when information unavailable

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
npm run dev         # Start development server
npm run build       # Production build
npm run preview     # Preview production build
npm test            # Run test suite

# Code Quality
npm run lint        # Lint code
npm run type-check  # TypeScript validation
```

## Performance Requirements

- **Response Time**: Instant responses (no network calls after load)
- **Knowledge Processing**: Client-side LLM-like processing
- **Caching**: Browser-based caching of knowledge base
- **No External Dependencies**: Completely self-contained

## Configuration

- **No Backend Required**: Static file deployment
- **Environment Variables**: Build-time configuration only
- **TypeScript**: Strict mode enabled
- **Responsive Design**: Mobile-first approach

## Deployment

- **Static Hosting**: Can be deployed to any static web server
- **No Server Requirements**: Pure client-side application
- **Build Output**: Standard HTML/CSS/JS files
- **CDN Ready**: Optimized for content delivery networks
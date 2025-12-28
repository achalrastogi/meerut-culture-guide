# Project Structure & Organization

## Frontend-Only Application Layout

```
├── .kiro/                    # Kiro configuration and specs
│   ├── specs/               # Project specifications
│   └── steering/            # Steering documents
├── frontend/                # React application (main application)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── services/       # LLM-based knowledge service
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   │   └── product.md      # Cultural knowledge base
│   ├── package.json        # Dependencies and scripts
│   └── tsconfig.json       # TypeScript configuration
├── product.md              # Original cultural knowledge base
└── README.md              # Project documentation
```

## Key Conventions

### File Naming
- **Components**: PascalCase (e.g., `SearchInterface.tsx`)
- **Services**: camelCase (e.g., `culturalKnowledgeService.ts`)
- **Types**: PascalCase with descriptive names (e.g., `CulturalResponse.ts`)
- **Tests**: Same name as file with `.test.ts` suffix

### Component Organization
- One component per file
- Export default for main component
- Named exports for related types/interfaces
- Co-locate component-specific styles and tests

### Data Flow
- **Frontend**: Components → LLM Service → Knowledge Base
- **Knowledge Loading**: Static file loading from public directory
- **Processing**: Client-side natural language processing
- **No External APIs**: All processing happens in the browser

## Application Architecture

### LLM-Based Processing
- Knowledge base loaded from static file
- Context extraction using relevance scoring
- Natural language response generation
- Confidence assessment for answers
- Honest responses when information unavailable

### Frontend Structure
- **Components**: UI components for search and display
- **Services**: LLM-based cultural knowledge processing
- **Types**: TypeScript interfaces for type safety
- **Styling**: Custom CSS with responsive design

## Configuration Management

- Environment variables for build configuration
- TypeScript strict mode enabled
- ESLint and Prettier configurations
- Vite for fast development and building
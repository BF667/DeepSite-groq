# DeepSite Pro - AI-Powered Fullstack Web Builder

An advanced AI-powered web application builder that generates complete fullstack applications using multiple AI providers. Built on top of the original DeepSite-groq project with significant enhancements.

## Features

### Multi-Provider AI Support
- **Groq** (Primary): GPT-OSS 120B, Llama 4 Maverick/Scout, Compound Beta, Kimi K2, Qwen3
- **OpenAI**: GPT-4.1, GPT-4o, GPT-5.1
- **DeepSeek**: V3.2 Chat, V3.2 Reasoner
- **Kimi (Moonshot)**: K2, K2 Thinking

### Generation Modes
1. **Frontend Mode**: Single HTML file with embedded CSS/JS
2. **Fullstack Mode**: Complete applications with backend + frontend
3. **Design Clone Mode**: Recreate website designs from URLs

### Latest AI Models (2025)
- Groq Compound Beta - AI system with web search and code execution
- GPT-OSS 120B - OpenAI's flagship open-weight model
- Llama 4 Maverick/Scout - Latest Meta models with MoE architecture
- Kimi K2 - 1T parameter MoE model (32B activated) with 256K context
- DeepSeek V3.2 - Advanced reasoning capabilities
- Qwen3 32B - Alibaba's latest model

### Design Cloning
- Clone any website's design with a single URL
- AI analyzes layout, colors, typography, and styling
- Generates pixel-perfect recreations

### File Management
- Multi-file project support for fullstack applications
- Built-in file manager for navigating generated files
- Download individual files or entire projects

## Quick Start

### Prerequisites
- Node.js 18+
- At least one AI provider API key

### Local Installation

```bash
# Clone the repository
git clone https://github.com/BF667/DeepSite-groq.git
cd DeepSite-groq

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your API keys

# Build and run
npm run build
npm start
```

### Development Mode

```bash
npm run dev
```

## Hugging Face Spaces Deployment

Deploy DeepSite Pro to Hugging Face Spaces with Docker SDK for free hosting.

### Step 1: Create a New Space

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Choose a name for your Space
4. Select **Docker** as the SDK
5. Choose your visibility (Public/Private)

### Step 2: Configure Secrets

Go to **Settings → Repository secrets** and add your API keys:

| Secret Name | Required | Description |
|-------------|----------|-------------|
| `GROQ_API_KEY` | Yes (or other provider) | Your Groq API key |
| `OPENAI_API_KEY` | Optional | Your OpenAI API key |
| `DEEPSEEK_API_KEY` | Optional | Your DeepSeek API key |
| `KIMI_API_KEY` | Optional | Your Kimi/Moonshot API key |

> **Important**: Secrets are private and cannot be read after setting. They are available as environment variables at runtime.

### Step 3: Upload Files

Upload all project files to your Space repository, or use Git:

```bash
# Clone your Space
git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
cd YOUR_SPACE_NAME

# Copy DeepSite Pro files
cp -r /path/to/DeepSite-groq/* .

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

### Step 4: Wait for Build

The Space will automatically build using the Dockerfile. Check the "Logs" tab for build progress.

### How Secrets Work in HF Spaces

- Secrets are stored securely in Hugging Face
- They are injected as environment variables at runtime
- No `.env` file is needed in production
- Secrets are NOT copied when someone duplicates your Space
- Variables (non-sensitive) ARE copied when duplicating

### Troubleshooting HF Deployment

**Build fails**: Check the Logs tab for errors. Common issues:
- Missing `package-lock.json`: Run `npm install` locally to generate it
- Permission errors: Dockerfile uses non-root user

**No models available**: Verify secrets are set correctly in Space Settings

**Port issues**: The app automatically uses port 7860 (HF default)

## Configuration

Create a `.env` file with your API keys:

```env
# Required: At least one provider
GROQ_API_KEY=your_groq_api_key

# Optional: Additional providers
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
KIMI_API_KEY=your_kimi_api_key

# Server port (default: 5173)
APP_PORT=5173
```

### Getting API Keys

| Provider | URL | Notes |
|----------|-----|-------|
| Groq | [console.groq.com](https://console.groq.com) | Free tier available |
| OpenAI | [platform.openai.com](https://platform.openai.com) | Pay-as-you-go |
| DeepSeek | [platform.deepseek.com](https://platform.deepseek.com) | Competitive pricing |
| Kimi | [platform.moonshot.ai](https://platform.moonshot.ai) | 256K context window |

## API Endpoints

### `GET /api/models`
Returns all available AI models across configured providers.

### `POST /api/ask-ai`
Main generation endpoint.

```json
{
  "prompt": "Create a todo app",
  "mode": "frontend|fullstack|designClone",
  "modelKey": "groq/gpt-oss-120b",
  "html": "optional current HTML",
  "previousPrompt": "optional context",
  "designUrl": "optional URL for cloning"
}
```

### `POST /api/fetch-design`
Fetches website HTML for design cloning.

```json
{
  "url": "https://example.com"
}
```

### `GET /api/health`
Health check with available providers.

## Available Models

### Groq Provider
| Model | ID | Context | Description |
|-------|-----|---------|-------------|
| Compound Beta | groq/compound | 131K | AI system with web search |
| GPT-OSS 120B | openai/gpt-oss-120b | 131K | Flagship open-weight model |
| Llama 4 Maverick | meta-llama/llama-4-maverick-17b-128e-instruct | 131K | 128 experts MoE |
| Llama 4 Scout | meta-llama/llama-4-scout-17b-16e-instruct | 131K | 16 experts MoE |
| Kimi K2 | moonshotai/kimi-k2-instruct-0905 | 262K | 1T params, 32B activated |
| Qwen3 32B | qwen/qwen3-32b | 131K | Alibaba's latest |

### OpenAI Provider
| Model | ID | Context |
|-------|-----|---------|
| GPT-4.1 | gpt-4.1 | 128K |
| GPT-4.1 Mini | gpt-4.1-mini | 128K |
| GPT-4o | gpt-4o | 128K |

### DeepSeek Provider
| Model | ID | Context |
|-------|-----|---------|
| V3.2 Chat | deepseek-chat | 64K |
| V3.2 Reasoner | deepseek-reasoner | 64K |

## Usage Examples

### Frontend Generation
```
Prompt: "Create a modern landing page for a SaaS product with hero section, features, and pricing"
Mode: Frontend
```

### Fullstack Application
```
Prompt: "Build a task management app with user authentication, database storage, and REST API"
Mode: Fullstack
```

### Design Cloning
```
URL: https://stripe.com
Prompt: "Clone the hero section and navigation"
Mode: Design Clone
```

## Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS, Monaco Editor
- **Backend**: Node.js, Express
- **AI**: Groq SDK, OpenAI-compatible APIs
- **Build**: Vite

## Project Structure

```
DeepSite-groq/
├── server.js              # Express server
├── services/
│   ├── ai-service.js      # Multi-provider AI service
│   ├── providers.js       # Provider/model configurations
│   └── groq.js            # Legacy compatibility layer
├── src/
│   ├── components/
│   │   ├── App.tsx        # Main application
│   │   ├── ask-ai/        # AI input component
│   │   ├── model-selector/# Model selection dropdown
│   │   ├── mode-selector/ # Mode selection (frontend/fullstack/clone)
│   │   ├── design-cloner/ # Design cloning modal
│   │   ├── file-manager/  # Multi-file project viewer
│   │   ├── header/        # Application header
│   │   ├── preview/       # Live preview iframe
│   │   └── tabs/          # File tabs
│   └── types/
│       └── models.ts      # TypeScript types
└── utils/
    └── consts.ts          # Constants and default HTML
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Credits

- Original [DeepSite-groq](https://github.com/BF667/DeepSite-groq) by BF667
- Powered by [Groq](https://groq.com) for ultra-fast AI inference
- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)

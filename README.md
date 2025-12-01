# DeepSite V3 Enhanced - AI-Powered Fullstack Web Builder

An advanced AI-powered web application builder that generates complete fullstack applications with auto-deploy, Hugging Face integration, and enhanced V3 UI/UX features. Built on top of the original DeepSite-groq project with significant enhancements.

## 🚀 What's New in V3.0 Enhanced

### ✨ Enhanced UI/UX
- **Fresh New Look**: Completely restructured UI/UX with gradient backgrounds and modern design
- **Enhanced Mode**: Smart improvement system with toggle on/off capability
- **Auto-Everything**: Auto-save progress & auto-deploy functionality
- **Visual Indicators**: Animated status indicators and progress feedback
- **Improved Layout**: Better responsive design with backdrop blur effects

### 🛠️ New Features
- **Auto-Deploy System**: One-click deployment with multiple platform support
- **Hugging Face Integration**: Push directly to Hugging Face Spaces
- **Enhanced Mode**: Smart AI enhancement capabilities
- **Project Management**: Improved file management with visual status
- **Deployment Status**: Real-time deployment tracking

### 🔧 Fixed Issues
- Removed DeepSite Gallery (as requested)
- Enhanced error handling and user feedback
- Improved performance and stability
- Better mobile responsiveness

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
4. **Enhanced Mode**: Smart improvements to existing projects

### Deployment Options
- **Auto-Deploy**: One-click deployment with cloud hosting
- **Hugging Face Spaces**: Direct integration with HF Spaces
- **Vercel/Netlify**: Coming in V3.1

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

Deploy DeepSite V3 Enhanced to Hugging Face Spaces with Docker SDK for free hosting.

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

### Step 3: Auto-Deploy Feature

The new V3 version includes an auto-deploy button in the header:
1. Click the 🚀 button in the header
2. Choose your deployment method (Hugging Face Spaces, Vercel, Netlify)
3. Follow the guided deployment process

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
  "mode": "frontend|fullstack|designClone|enhance",
  "modelKey": "groq/gpt-oss-120b",
  "html": "optional current HTML",
  "previousPrompt": "optional context",
  "designUrl": "optional URL for cloning"
}
```

### `POST /api/fetch-design`
Fetches website HTML for design cloning.

### `POST /api/push-to-hf`
Push project to Hugging Face Spaces.

### `POST /api/auto-deploy`
Auto-deploy project to hosting platform.

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

### Enhanced Mode
```
Prompt: "Make this website more modern with better animations and responsive design"
Mode: Frontend + Enhance: ON
```

### Auto-Deployment
1. Click the 🚀 button in the header
2. Select deployment method (Hugging Face Spaces recommended)
3. Follow the guided deployment process

## Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS, Monaco Editor
- **Backend**: Node.js, Express
- **AI**: Groq SDK, OpenAI-compatible APIs
- **Build**: Vite
- **Deployment**: Hugging Face Spaces integration

## Project Structure

```
DeepSite-groq/
├── server.js                     # Express server
├── services/
│   ├── ai-service.js            # Multi-provider AI service
│   ├── providers.js             # Provider/model configurations
│   └── groq.js                  # Legacy compatibility layer
├── src/
│   ├── components/
│   │   ├── App.tsx              # Main application
│   │   ├── header/              # Enhanced header with deployment
│   │   ├── ask-ai/              # AI input with enhance mode
│   │   ├── model-selector/      # Model selection dropdown
│   │   ├── mode-selector/       # Mode selection (including enhance)
│   │   ├── design-cloner/       # Design cloning modal
│   │   ├── file-manager/        # Multi-file project viewer
│   │   ├── preview/             # Live preview (gallery removed)
│   │   ├── deployment/          # New deployment components
│   │   └── tabs/                # File tabs
│   └── types/
│       └── models.ts            # TypeScript types
└── utils/
    └── consts.ts                # Constants and default HTML
```

## What's Fixed in V3.0 Enhanced

✅ **Removed DeepSite Gallery** - Clean interface without gallery clutter
✅ **Enhanced UI/UX** - Modern gradient design with better visual feedback
✅ **Auto-Deploy Integration** - One-click deployment to multiple platforms
✅ **Hugging Face Support** - Direct integration with HF Spaces
✅ **Enhanced Mode** - Smart AI enhancement capabilities
✅ **Better Performance** - Improved loading and rendering speed
✅ **Enhanced Error Handling** - Better user feedback and error management
✅ **Mobile Responsiveness** - Improved mobile experience

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Credits

- Original [DeepSite-groq](https://github.com/BF667/DeepSite-groq) by BF667
- Inspired by [DeepSite V3](https://huggingface.co/spaces/enzostvs/deepsite) by enzostvs
- Powered by [Groq](https://groq.com) for ultra-fast AI inference
- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)

## Changelog

### V3.0.0 Enhanced (2025-01-01)
- ✨ Added auto-deploy functionality
- ✨ Added Hugging Face Spaces integration
- ✨ Implemented Enhanced Mode for smart improvements
- 🎨 Redesigned UI with modern gradient backgrounds
- 🛠️ Removed DeepSite Gallery as requested
- 🚀 Added deployment modal with multiple platform support
- 📱 Enhanced mobile responsiveness
- 🔧 Improved error handling and user feedback
- ⚡ Optimized performance and loading speed
- 🎯 Added visual status indicators and animations
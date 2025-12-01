/**
 * AI Provider Configuration
 * Supports multiple AI providers: Groq, OpenAI, DeepSeek, Kimi K2
 */

// Groq Models - Latest 2025 models
export const GROQ_MODELS = {
  // Featured Compound Systems
  "compound-beta": {
    id: "groq/compound",
    name: "Groq Compound (Beta)",
    contextWindow: 131072,
    description: "AI system with web search and code execution",
    category: "compound"
  },
  "compound-mini": {
    id: "groq/compound-mini",
    name: "Groq Compound Mini",
    contextWindow: 131072,
    description: "Lightweight compound system",
    category: "compound"
  },
  // GPT OSS Models
  "gpt-oss-120b": {
    id: "openai/gpt-oss-120b",
    name: "GPT-OSS 120B",
    contextWindow: 131072,
    description: "OpenAI's flagship open-weight model with 120B parameters",
    category: "gpt-oss"
  },
  "gpt-oss-20b": {
    id: "openai/gpt-oss-20b",
    name: "GPT-OSS 20B",
    contextWindow: 131072,
    description: "Efficient GPT-OSS model",
    category: "gpt-oss"
  },
  // Llama 4 Models
  "llama-4-maverick": {
    id: "meta-llama/llama-4-maverick-17b-128e-instruct",
    name: "Llama 4 Maverick 17B",
    contextWindow: 131072,
    description: "Latest Llama 4 with 128 experts MoE",
    category: "llama"
  },
  "llama-4-scout": {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout 17B",
    contextWindow: 131072,
    description: "Llama 4 Scout with 16 experts MoE",
    category: "llama"
  },
  // Llama 3 Models
  "llama-3.3-70b": {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B Versatile",
    contextWindow: 131072,
    description: "Versatile Llama 3.3 model",
    category: "llama"
  },
  "llama-3.1-8b": {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    contextWindow: 131072,
    description: "Fast Llama 3.1 model",
    category: "llama"
  },
  // Kimi K2 on Groq
  "kimi-k2": {
    id: "moonshotai/kimi-k2-instruct-0905",
    name: "Kimi K2 (via Groq)",
    contextWindow: 262144,
    description: "Moonshot AI's Kimi K2 with 1T parameters MoE",
    category: "external"
  },
  // Qwen Models
  "qwen3-32b": {
    id: "qwen/qwen3-32b",
    name: "Qwen3 32B",
    contextWindow: 131072,
    description: "Alibaba's Qwen3 model",
    category: "qwen"
  }
};

// OpenAI Models
export const OPENAI_MODELS = {
  "gpt-4.1": {
    id: "gpt-4.1",
    name: "GPT-4.1",
    contextWindow: 128000,
    description: "Latest GPT-4.1 flagship model"
  },
  "gpt-4.1-mini": {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    contextWindow: 128000,
    description: "Fast and efficient GPT-4.1"
  },
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o",
    contextWindow: 128000,
    description: "Multimodal GPT-4 Omni"
  },
  "gpt-5.1": {
    id: "gpt-5.1",
    name: "GPT-5.1",
    contextWindow: 256000,
    description: "Best model for coding and agentic tasks"
  }
};

// DeepSeek Models
export const DEEPSEEK_MODELS = {
  "deepseek-chat": {
    id: "deepseek-chat",
    name: "DeepSeek V3.2 Chat",
    contextWindow: 64000,
    description: "DeepSeek-V3.2 non-thinking mode"
  },
  "deepseek-reasoner": {
    id: "deepseek-reasoner",
    name: "DeepSeek V3.2 Reasoner",
    contextWindow: 64000,
    description: "DeepSeek-V3.2 thinking mode with reasoning"
  }
};

// Kimi K2 Models (via Moonshot AI API)
export const KIMI_MODELS = {
  "kimi-k2": {
    id: "kimi-k2-0711",
    name: "Kimi K2",
    contextWindow: 262144,
    description: "1T parameter MoE model, 32B activated"
  },
  "kimi-k2-thinking": {
    id: "kimi-k2-thinking",
    name: "Kimi K2 Thinking",
    contextWindow: 262144,
    description: "K2 with extended reasoning capabilities"
  },
  "kimi-latest": {
    id: "kimi-latest",
    name: "Kimi Latest",
    contextWindow: 262144,
    description: "Latest Kimi model with image understanding"
  }
};

// Provider configurations
export const PROVIDERS = {
  groq: {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    models: GROQ_MODELS,
    envKey: "GROQ_API_KEY"
  },
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    models: OPENAI_MODELS,
    envKey: "OPENAI_API_KEY"
  },
  deepseek: {
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    models: DEEPSEEK_MODELS,
    envKey: "DEEPSEEK_API_KEY"
  },
  kimi: {
    name: "Kimi (Moonshot)",
    baseUrl: "https://api.moonshot.cn/v1",
    models: KIMI_MODELS,
    envKey: "KIMI_API_KEY"
  }
};

// Get all available models across all providers
export const getAllModels = () => {
  const allModels = [];
  
  for (const [providerId, provider] of Object.entries(PROVIDERS)) {
    for (const [modelKey, model] of Object.entries(provider.models)) {
      allModels.push({
        key: `${providerId}/${modelKey}`,
        provider: providerId,
        providerName: provider.name,
        ...model
      });
    }
  }
  
  return allModels;
};

// Get model by key
export const getModelByKey = (key) => {
  const [providerId, modelKey] = key.split('/');
  const provider = PROVIDERS[providerId];
  if (!provider) return null;
  
  const model = provider.models[modelKey];
  if (!model) return null;
  
  return {
    provider: providerId,
    providerName: provider.name,
    baseUrl: provider.baseUrl,
    envKey: provider.envKey,
    ...model
  };
};

/**
 * Unified AI Service
 * Supports multiple providers: Groq, OpenAI, DeepSeek, Kimi K2
 * 
 * Environment variables can be loaded from:
 * - .env file (local development)
 * - Hugging Face Spaces Secrets (production deployment)
 * - System environment variables
 */

import Groq from "groq-sdk";
import { PROVIDERS, getModelByKey, getAllModels } from './providers.js';

// Note: dotenv is loaded in server.js before this module is imported
// For Hugging Face Spaces, secrets are available as process.env directly

// Initialize provider clients
const clients = {};

// Initialize Groq client
if (process.env.GROQ_API_KEY) {
  clients.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// System prompts for different modes
const SYSTEM_PROMPTS = {
  // Frontend-only HTML generation
  frontend: `You are an expert frontend developer. Generate a single, complete HTML file with embedded CSS and JavaScript.

REQUIREMENTS:
- ONLY output HTML, CSS, and JavaScript in a SINGLE HTML file
- Use TailwindCSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- For icons, use a CDN library (Heroicons, Lucide, or Font Awesome)
- Make the design modern, responsive, and beautiful
- Include proper meta tags and viewport settings
- Output starts with <!DOCTYPE html> and ends with </html>
- NO explanations, ONLY the HTML code`,

  // Fullstack application generation
  fullstack: `You are an expert fullstack developer. Generate a complete web application with both frontend and backend.

OUTPUT FORMAT - Use code blocks with filenames:
\`\`\`html:index.html
<!-- Frontend HTML code -->
\`\`\`

\`\`\`css:styles.css
/* Optional separate CSS */
\`\`\`

\`\`\`javascript:app.js
// Frontend JavaScript
\`\`\`

\`\`\`javascript:server.js
// Backend Node.js/Express code
\`\`\`

\`\`\`json:package.json
{
  "name": "app",
  "dependencies": {}
}
\`\`\`

REQUIREMENTS:
- Generate complete, working code for both frontend and backend
- Use modern practices: ES modules, async/await, proper error handling
- Backend: Node.js with Express, include all necessary routes
- Frontend: Modern HTML5, TailwindCSS, vanilla JS or specify framework
- Include package.json with all dependencies
- Add helpful comments explaining key functionality
- Make it production-ready with proper security practices`,

  // Design cloning mode
  designClone: `You are an expert at recreating web designs. Analyze the provided website design and recreate it as a pixel-perfect HTML/CSS implementation.

REQUIREMENTS:
- Match the layout, colors, typography, and spacing exactly
- Use TailwindCSS for styling where possible
- Include all visual elements, buttons, forms, etc.
- Make it responsive if the original is responsive
- Use placeholder images from picsum.photos or similar
- Output a single complete HTML file
- NO explanations, ONLY the HTML code`
};

/**
 * Create a generic API client for providers without SDK
 */
const createGenericClient = (provider) => {
  const config = PROVIDERS[provider];
  const apiKey = process.env[config.envKey];
  
  if (!apiKey) {
    return null;
  }

  return {
    async createChatCompletion({ messages, model, stream = true, temperature = 0.7, maxTokens = 8192 }) {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: stream,
          temperature: temperature,
          max_tokens: maxTokens
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
      }

      return response;
    }
  };
};

/**
 * Parse multifile response into separate files
 */
export const parseMultiFileResponse = (content) => {
  const files = [];
  const codeBlockRegex = /```(\w+):([^\n]+)\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    files.push({
      language: match[1],
      filename: match[2].trim(),
      content: match[3].trim()
    });
  }
  
  // If no multi-file format found, try to extract single HTML
  if (files.length === 0) {
    const htmlMatch = content.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    if (htmlMatch) {
      files.push({
        language: 'html',
        filename: 'index.html',
        content: htmlMatch[0]
      });
    }
  }
  
  return files;
};

/**
 * Create chat messages for the request
 */
const createChatMessages = (prompt, mode, previousPrompt, html, designUrl) => {
  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.frontend;
  
  const messages = [
    { role: "system", content: systemPrompt }
  ];

  // Add design URL context if in clone mode
  if (mode === 'designClone' && designUrl) {
    messages.push({
      role: "user",
      content: `Clone this website design: ${designUrl}\n\nAdditional instructions: ${prompt}`
    });
    return messages;
  }

  // Add conversation context
  if (previousPrompt) {
    messages.push({ role: "user", content: previousPrompt });
  }

  if (html && html.trim()) {
    messages.push({
      role: "assistant",
      content: `Current code:\n\`\`\`html\n${html}\n\`\`\``
    });
  }

  messages.push({ role: "user", content: prompt });

  return messages;
};

/**
 * Handle streaming response
 */
const handleGroqStream = async (res, stream, mode) => {
  let completeResponse = "";
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        // Send as SSE
        res.write(`data: ${JSON.stringify({ content, mode })}\n\n`);
        completeResponse += content;

        // Check for completion based on mode
        if (mode === 'frontend' && completeResponse.includes("</html>")) {
          // Allow a bit more content after </html> in case of trailing whitespace
          continue;
        }
      }
    }
    
    // Send completion signal
    res.write(`data: ${JSON.stringify({ done: true, fullContent: completeResponse, mode })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Stream error:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

/**
 * Handle generic streaming response (for non-Groq providers)
 */
const handleGenericStream = async (res, response, mode) => {
  let completeResponse = "";
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            res.write(`data: ${JSON.stringify({ content, mode })}\n\n`);
            completeResponse += content;
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }

    res.write(`data: ${JSON.stringify({ done: true, fullContent: completeResponse, mode })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Stream error:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

/**
 * Main function to create chat completion
 */
export const createChatCompletion = async ({
  prompt,
  previousPrompt,
  html,
  mode = 'frontend',
  modelKey = 'groq/gpt-oss-120b',
  designUrl,
  res
}) => {
  const modelInfo = getModelByKey(modelKey);
  
  if (!modelInfo) {
    throw new Error(`Unknown model: ${modelKey}`);
  }

  const messages = createChatMessages(prompt, mode, previousPrompt, html, designUrl);

  // Use Groq SDK for Groq provider
  if (modelInfo.provider === 'groq') {
    if (!clients.groq) {
      throw new Error('Groq API key not configured');
    }

    const streamOptions = {
      messages: messages,
      model: modelInfo.id,
      temperature: 0.7,
      max_completion_tokens: 16384,
      stream: true
    };

    // Add tools for compound models
    if (modelInfo.category === 'compound') {
      streamOptions.tools = [
        { type: "browser_search" },
        { type: "code_interpreter" }
      ];
    }

    // Add reasoning for GPT-OSS models
    if (modelInfo.category === 'gpt-oss') {
      streamOptions.reasoning_effort = "medium";
    }

    const stream = await clients.groq.chat.completions.create(streamOptions);
    await handleGroqStream(res, stream, mode);
    return;
  }

  // Use generic client for other providers
  const client = createGenericClient(modelInfo.provider);
  if (!client) {
    throw new Error(`${modelInfo.providerName} API key not configured`);
  }

  const response = await client.createChatCompletion({
    messages: messages,
    model: modelInfo.id,
    stream: true,
    temperature: 0.7,
    maxTokens: 16384
  });

  await handleGenericStream(res, response, mode);
};

/**
 * Fetch website content for design cloning
 */
export const fetchWebsiteForCloning = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }
    
    const html = await response.text();
    return html;
  } catch (error) {
    console.error('Error fetching website:', error);
    throw error;
  }
};

/**
 * Get available models
 */
export const getAvailableModels = () => {
  const available = [];
  const allModels = getAllModels();
  
  for (const model of allModels) {
    const provider = PROVIDERS[model.provider];
    const hasApiKey = !!process.env[provider.envKey];
    
    available.push({
      ...model,
      available: hasApiKey
    });
  }
  
  return available;
};

// Legacy export for backward compatibility
export { createChatCompletion as generateHTML };

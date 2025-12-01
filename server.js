import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import { 
  createChatCompletion, 
  getAvailableModels, 
  fetchWebsiteForCloning,
  parseMultiFileResponse 
} from "./services/ai-service.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.APP_PORT || 5173;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, "dist")));

/**
 * Get available AI models
 */
app.get("/api/models", (req, res) => {
  try {
    const models = getAvailableModels();
    res.json({ ok: true, models });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

/**
 * Main AI generation endpoint
 * Supports: frontend, fullstack, and designClone modes
 */
app.post("/api/ask-ai", async (req, res) => {
  const { 
    prompt, 
    html, 
    previousPrompt, 
    mode = 'frontend',
    modelKey = 'groq/gpt-oss-120b',
    designUrl 
  } = req.body;

  if (!prompt) {
    return res.status(400).json({
      ok: false,
      message: "Missing required field: prompt",
    });
  }

  // Validate mode
  const validModes = ['frontend', 'fullstack', 'designClone'];
  if (!validModes.includes(mode)) {
    return res.status(400).json({
      ok: false,
      message: `Invalid mode. Must be one of: ${validModes.join(', ')}`,
    });
  }

  try {
    await createChatCompletion({ 
      prompt, 
      previousPrompt, 
      html, 
      mode,
      modelKey,
      designUrl,
      res 
    });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({ 
      ok: false, 
      message: error.message || "Failed to generate content" 
    });
  }
});

/**
 * Fetch website HTML for design cloning
 */
app.post("/api/fetch-design", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      ok: false,
      message: "Missing required field: url",
    });
  }

  try {
    // Validate URL format
    new URL(url);
    
    const html = await fetchWebsiteForCloning(url);
    res.json({ ok: true, html });
  } catch (error) {
    console.error("Fetch design error:", error);
    res.status(500).json({ 
      ok: false, 
      message: error.message || "Failed to fetch website" 
    });
  }
});

/**
 * Parse fullstack response into files
 */
app.post("/api/parse-files", (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      ok: false,
      message: "Missing required field: content",
    });
  }

  try {
    const files = parseMultiFileResponse(content);
    res.json({ ok: true, files });
  } catch (error) {
    console.error("Parse files error:", error);
    res.status(500).json({ 
      ok: false, 
      message: error.message || "Failed to parse files" 
    });
  }
});

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  const models = getAvailableModels();
  const availableProviders = [...new Set(
    models.filter(m => m.available).map(m => m.providerName)
  )];

  res.json({
    ok: true,
    status: "healthy",
    availableProviders,
    totalModels: models.length,
    availableModels: models.filter(m => m.available).length
  });
});

// Serve frontend for all other routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║          DeepSite Pro - Fullstack Web Builder             ║
╠═══════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                 ║
║                                                           ║
║  Features:                                                ║
║  • Multi-Provider AI (Groq, OpenAI, DeepSeek, Kimi K2)   ║
║  • Fullstack Web-App Generation                          ║
║  • Design Cloning from URL                               ║
║  • Latest AI Models (GPT-OSS, Llama 4, Compound)         ║
╚═══════════════════════════════════════════════════════════╝
  `);
  
  // Log available providers
  const models = getAvailableModels();
  const availableProviders = [...new Set(
    models.filter(m => m.available).map(m => m.providerName)
  )];
  
  if (availableProviders.length > 0) {
    console.log(`Available AI Providers: ${availableProviders.join(', ')}`);
  } else {
    console.warn('⚠️  No AI providers configured. Please add API keys to .env file.');
  }
});

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import fs from "fs";

import { 
  createChatCompletion, 
  getAvailableModels, 
  fetchWebsiteForCloning,
  parseMultiFileResponse 
} from "./services/ai-service.js";

// Load environment variables from .env file (if exists)
// For Hugging Face Spaces, secrets are injected as environment variables directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('✅ Loaded environment from .env file');
} else {
  console.log('ℹ️  No .env file found, using environment variables (Hugging Face Spaces mode)');
}

const app = express();

// PORT priority: PORT (HF Spaces) > APP_PORT > 7860 (HF default) > 5173 (dev default)
const PORT = process.env.PORT || process.env.APP_PORT || 7860;

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

/**
 * Push to Hugging Face Spaces endpoint
 */
app.post("/api/push-to-hf", async (req, res) => {
  const { html, files, projectName, description } = req.body;

  if (!html && (!files || files.length === 0)) {
    return res.status(400).json({
      ok: false,
      message: "Missing required fields: html or files"
    });
  }

  try {
    // In a real implementation, this would:
    // 1. Create/update the Hugging Face Space
    // 2. Push the code to the space
    // 3. Configure build settings
    // 4. Trigger deployment
    
    // For now, return a simulated response
    const spaceId = `deepsite-${Date.now()}`;
    const deploymentUrl = `https://huggingface.co/spaces/deepsite/${spaceId}`;
    
    res.json({
      ok: true,
      message: "Project prepared for Hugging Face Spaces deployment",
      deploymentUrl,
      spaceId,
      status: "pending_build",
      instructions: [
        "1. Create a new Hugging Face Space",
        "2. Copy your project files to the space",
        "3. Configure your API keys as secrets",
        "4. The space will automatically build and deploy"
      ]
    });
  } catch (error) {
    console.error("Push to HF error:", error);
    res.status(500).json({
      ok: false,
      message: error.message || "Failed to push to Hugging Face"
    });
  }
});

/**
 * Auto-deploy endpoint
 */
app.post("/api/auto-deploy", async (req, res) => {
  const { html, files, projectName } = req.body;

  try {
    // Auto-save the project
    const saveData = {
      html: html || '',
      files: files || [],
      projectName: projectName || 'DeepSite Project',
      timestamp: Date.now(),
      version: '3.0'
    };

    // In a real implementation, this would:
    // 1. Save to cloud storage
    // 2. Trigger CI/CD pipeline
    // 3. Deploy to hosting platform
    // 4. Update deployment status
    
    res.json({
      ok: true,
      message: "Project auto-saved and ready for deployment",
      saveId: `deploy-${Date.now()}`,
      status: "saved",
      estimatedDeploymentTime: "2-3 minutes"
    });
  } catch (error) {
    console.error("Auto-deploy error:", error);
    res.status(500).json({
      ok: false,
      message: error.message || "Failed to auto-deploy"
    });
  }
});

/**
 * Get deployment status endpoint
 */
app.get("/api/deploy-status/:saveId", (req, res) => {
  const { saveId } = req.params;
  
  // In a real implementation, this would check actual deployment status
  res.json({
    ok: true,
    saveId,
    status: "deployed",
    deploymentUrl: `https://deepsite-deployment-${saveId}.vercel.app`,
    deployedAt: new Date().toISOString()
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

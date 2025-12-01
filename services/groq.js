/**
 * Legacy Groq Service - Backward Compatibility Layer
 * This file maintains backward compatibility with the original API.
 * All functionality has been moved to ai-service.js
 */

import { createChatCompletion, parseMultiFileResponse } from './ai-service.js';

/**
 * Legacy createChatCompletion function
 * Wraps the new multi-provider service for backward compatibility
 */
export { createChatCompletion };

/**
 * Legacy generateHTML function
 * Maps to the new createChatCompletion with frontend mode
 */
export const generateHTML = async ({ prompt, previousPrompt, html, res }) => {
  return createChatCompletion({
    prompt,
    previousPrompt,
    html,
    mode: 'frontend',
    modelKey: 'groq/gpt-oss-120b',
    res
  });
};

/**
 * Legacy processPrompt function
 */
export const processPrompt = async (req, res) => {
  try {
    const { prompt, previousPrompt, html, mode, modelKey } = req.body;
    
    await createChatCompletion({
      prompt,
      previousPrompt,
      html,
      mode: mode || 'frontend',
      modelKey: modelKey || 'groq/gpt-oss-120b',
      res
    });
  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Failed to process prompt" });
  }
};

export { parseMultiFileResponse };

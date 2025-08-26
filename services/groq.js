import Groq from "groq-sdk";
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// System prompt information
const SYSTEM_PROMPT = `ONLY USE HTML, CSS AND JAVASCRIPT. If you want to use ICON make sure to import the library first. Try to create the best UI possible by using only HTML, CSS and JAVASCRIPT. Use as much as you can TailwindCSS for the CSS, if you can't do something with TailwindCSS, then use custom CSS (make sure to import <script src="https://cdn.tailwindcss.com"></script> in the head). Also, try to elaborate as much as you can, to create something unique. ALWAYS GIVE THE RESPONSE INTO A SINGLE HTML FILE otherwise you can build full backend frontend typescript website if user want! If the user asks for a full-stack website, provide the necessary files (e.g., HTML, CSS, JavaScript, and backend code) in separate code blocks.`;

/**
 * Create chat messages array
 * @param {string} prompt - User prompt
 * @param {string} previousPrompt - Previous prompt (optional)
 * @param {string} html - Current HTML code (optional)
 * @returns {Array} Messages array
 */
const createChatMessages = (prompt, previousPrompt, html) => {
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    }
  ];

  if (previousPrompt) {
    messages.push({
      role: "user",
      content: previousPrompt,
    });
  }

  if (html) {
    messages.push({
      role: "assistant",
      content: `The current code is: ${html}.`,
    });
  }

  messages.push({
    role: "user",
    content: prompt,
  });

  return messages;
};

/**
 * Handle stream response
 * @param {Response} res - Express response object
 * @param {AsyncGenerator} stream - Groq stream response
 * @returns {Promise<void>}
 */
const handleStream = async (res, stream) => {
  let completeResponse = "";
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(content);
        completeResponse += content;

        if (completeResponse.includes("</html>")) {
          break;
        }
      }
    }
    res.end();
  } catch (error) {
    console.error("Stream error:", error);
    res.status(500).end("Error processing stream");
  }
};

/**
 * Generate HTML based on prompt
 * @param {string} prompt - User prompt
 * @param {string} previousPrompt - Previous prompt (optional)
 * @param {string} html - Current HTML code (optional)
 * @returns {AsyncGenerator} Stream response
 */
export const generateHTML = async (prompt, previousPrompt, html) => {
  try {
    const messages = createChatMessages(prompt, previousPrompt, html);
    
    const stream = await groq.chat.completions.create({
      messages: messages,
      "model": "openai/gpt-oss-20b",
      "temperature": 1,
      "max_completion_tokens": 8192,
      "top_p": 1,
      "stream": true,
      "reasoning_effort": "medium",
      "stop": null,
      "tools": [
        {
          "type": "browser_search"
        },
        {
          "type": "code_interpreter"
        }
      ]
    });
    
    return stream;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

// Example usage
export const processPrompt = async (req, res) => {
  try {
    const { prompt, previousPrompt, html } = req.body;
    const stream = await generateHTML(prompt, previousPrompt, html);
    await handleStream(res, stream);
  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: "Failed to process prompt" });
  }
};

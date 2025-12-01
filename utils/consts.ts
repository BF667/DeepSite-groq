export const defaultHTML = `<!DOCTYPE html>
<html>
  <head>
    <title>DeepSite Pro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="utf-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100dvh;
        font-family: "Inter", "Arial", sans-serif;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
        margin: 0;
        padding: 20px;
      }
      .container {
        text-align: center;
        max-width: 600px;
      }
      .arrow {
        position: absolute;
        bottom: 32px;
        left: 20px;
        width: 80px;
        transform: rotate(30deg);
        opacity: 0.7;
      }
      h1 {
        font-size: clamp(2rem, 5vw, 3.5rem);
        color: white;
        margin-bottom: 1rem;
        font-weight: 700;
      }
      h1 span {
        background: linear-gradient(135deg, #ec4899, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .subtitle {
        color: #94a3b8;
        font-size: 1.1rem;
        margin-bottom: 2rem;
      }
      .features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
      }
      .feature {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        color: #e2e8f0;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .feature-icon {
        width: 16px;
        height: 16px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>
        Build <span>Fullstack Apps</span><br />with AI
      </h1>
      <p class="subtitle">
        Describe what you want to build. I'll generate the complete code.
      </p>
      <div class="features">
        <div class="feature">
          <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Groq + GPT-OSS
        </div>
        <div class="feature">
          <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
          </svg>
          Kimi K2
        </div>
        <div class="feature">
          <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4l4 4"/>
          </svg>
          DeepSeek V3
        </div>
        <div class="feature">
          <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2"/>
          </svg>
          Clone Designs
        </div>
        <div class="feature">
          <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0l-4-4m4 4l-4 4"/>
          </svg>
          Fullstack Ready
        </div>
      </div>
    </div>
    <img src="https://enzostvs-deepsite.hf.space/arrow.svg" class="arrow" />
    <script></script>
  </body>
</html>
`;

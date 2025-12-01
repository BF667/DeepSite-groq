# Dockerfile for Hugging Face Spaces Deployment
# Optimized for HF Spaces with Docker SDK

# Use an official Node.js runtime as the base image
FROM node:22-slim

# Set up non-root user for security (HF Spaces requirement)
USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Create non-root user
RUN useradd -m -u 1000 appuser

# Copy package files first for better caching
COPY --chown=appuser:appuser package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY --chown=appuser:appuser . .

# Build the application
RUN npm run build

# Switch to non-root user
USER appuser

# Hugging Face Spaces uses port 7860 by default
# The app will use PORT env variable if set, otherwise defaults to 7860
ENV PORT=7860
ENV NODE_ENV=production

# Expose the port
EXPOSE 7860

# Health check for HF Spaces
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 7860) + '/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "server.js"]
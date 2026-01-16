# Backend Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY src ./src
COPY schema.sql .
COPY .env .

# Expose API port
EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD ["node", "src/api/server.js"]

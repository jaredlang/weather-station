# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_WEATHER_API_BASE_URL
ARG VITE_NEWS_API_BASE_URL
ARG VITE_DEFAULT_CITY=New York
ARG VITE_REPORT_CACHE_DURATION=600
ARG VITE_REPORT_RETRY_DELAY=120

# Create .env file
RUN echo "VITE_WEATHER_API_BASE_URL=${VITE_WEATHER_API_BASE_URL}" > .env.production && \
    echo "VITE_NEWS_API_BASE_URL=${VITE_NEWS_API_BASE_URL}" >> .env.production && \
    echo "VITE_DEFAULT_CITY=${VITE_DEFAULT_CITY}" >> .env.production && \
    echo "VITE_REPORT_CACHE_DURATION=${VITE_REPORT_CACHE_DURATION}" >> .env.production && \
    echo "VITE_REPORT_RETRY_DELAY=${VITE_REPORT_RETRY_DELAY}" >> .env.production

# Build application
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create custom nginx config for SPA routing
RUN echo 'server { \
    listen 8080; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Gzip compression \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    \
    # SPA routing - serve index.html for all routes \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
}' > /etc/nginx/conf.d/default.conf

# Expose port 8080 (required by Cloud Run)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

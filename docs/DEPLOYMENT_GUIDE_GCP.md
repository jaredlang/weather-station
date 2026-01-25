# Google Cloud Platform Deployment Guide
## Weather Station React Application

This guide provides multiple cost-effective and scalable deployment options for the Weather Station React application on Google Cloud Platform (GCP).

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Deployment Options Comparison](#deployment-options-comparison)
3. [Option 1: Cloud Storage + Cloud CDN (Recommended - Most Cost-Effective)](#option-1-cloud-storage--cloud-cdn-recommended)
4. [Option 2: Cloud Run (Serverless Container)](#option-2-cloud-run-serverless-container)
5. [Option 3: Firebase Hosting (Fastest Setup)](#option-3-firebase-hosting-fastest-setup)
6. [Option 4: App Engine Standard (Managed Platform)](#option-4-app-engine-standard)
7. [Backend API Deployment](#backend-api-deployment)
8. [Cost Estimates](#cost-estimates)
9. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
10. [Monitoring and Logging](#monitoring-and-logging)

---

## Project Overview

**Application Type:** React 19 + TypeScript SPA (Single Page Application)
**Build Tool:** Vite 7.2.4
**Output:** Static files (HTML, CSS, JavaScript, assets)
**Build Command:** `npm run build`
**Output Directory:** `weather-report/dist/`
**Node Version Required:** v18 or higher

**Key Requirements:**
- Environment variables configuration (API base URL)
- Backend API connectivity (Weather Forecast API)
- CDN for global performance
- HTTPS support
- Domain mapping capability

---

## Deployment Options Comparison

| Option | Cost (Monthly) | Scalability | Setup Time | Best For | Auto-scaling |
|--------|---------------|-------------|------------|----------|--------------|
| **Cloud Storage + CDN** | $1-5 | Unlimited | 30 min | Production, high traffic | Yes (automatic) |
| **Cloud Run** | $0-10 | High | 45 min | Dynamic needs, preview envs | Yes (0 to N) |
| **Firebase Hosting** | $0-5 | High | 15 min | Quick deployment, prototypes | Yes (automatic) |
| **App Engine** | $15-50 | Medium-High | 45 min | Traditional hosting | Yes (configurable) |

**Recommendation:** For a static React SPA, **Cloud Storage + Cloud CDN** offers the best cost-performance ratio with unlimited scalability.

---

## Option 1: Cloud Storage + Cloud CDN (Recommended)

This option serves your static files from Cloud Storage with global CDN distribution. Best for production workloads.

### Architecture
```
User Request → Cloud CDN (Global Edge) → Cloud Load Balancer → Cloud Storage Bucket
                                                               ↓
                                                         Static Files (dist/)
```

### Cost Estimate
- Storage: ~$0.20/month for 1GB
- Cloud CDN: ~$0.08-0.12 per GB transferred
- Load Balancer: ~$18/month (can be shared)
- **Total: $1-5/month** for low-medium traffic

### Prerequisites
```bash
# Install Google Cloud SDK
# Download from: https://cloud.google.com/sdk/docs/install

# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 1: Build the Application

```bash
cd weather-report

# Install dependencies
npm install

# Create production environment file
cat > .env.production << EOF
VITE_FORECAST_API_BASE_URL=https://your-api-domain.com
VITE_DEFAULT_CITY=Seattle
VITE_REPORT_CACHE_DURATION=600
VITE_REPORT_RETRY_DELAY=120
EOF

# Build for production
npm run build

# Verify build output
ls -la dist/
```

### Step 2: Create Cloud Storage Bucket

```bash
# Set variables
PROJECT_ID="your-project-id"
BUCKET_NAME="whut-weather-station"
REGION="us-central1"  # Choose based on your users' location

# Create bucket
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME/

# Set bucket for website hosting
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME/

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME/
```

### Step 3: Upload Built Files

```bash
# Upload all files from dist directory
gsutil -m rsync -r -d dist/ gs://$BUCKET_NAME/

# Set cache control for static assets (1 year)
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" \
  gs://$BUCKET_NAME/assets/**

# Set cache control for HTML (no cache)
gsutil setmeta -h "Cache-Control:no-cache, no-store, must-revalidate" \
  gs://$BUCKET_NAME/index.html
```

### Step 4: Set Up Cloud CDN and Load Balancer

```bash
# Reserve static IP address
gcloud compute addresses create weather-station-ip \
    --ip-version=IPV4 \
    --global

# Get the reserved IP
gcloud compute addresses describe weather-station-ip --global

# Create backend bucket
gcloud compute backend-buckets create weather-station-backend \
    --gcs-bucket-name=$BUCKET_NAME \
    --enable-cdn

# Configure CDN cache
gcloud compute backend-buckets update weather-station-backend \
    --cache-mode=CACHE_ALL_STATIC \
    --default-ttl=3600 \
    --max-ttl=86400 \
    --client-ttl=3600

# Create URL map
gcloud compute url-maps create weather-station-lb \
    --default-backend-bucket=weather-station-backend

# Create SSL certificate (managed)
gcloud compute ssl-certificates create weather-station-cert \
    --domains=your-domain.com,www.your-domain.com \
    --global

# Create HTTPS proxy
gcloud compute target-https-proxies create weather-station-https-proxy \
    --url-map=weather-station-lb \
    --ssl-certificates=weather-station-cert

# Create forwarding rule
gcloud compute forwarding-rules create weather-station-https-rule \
    --address=weather-station-ip \
    --target-https-proxy=weather-station-https-proxy \
    --global \
    --ports=443

# Optional: HTTP to HTTPS redirect
gcloud compute url-maps import weather-station-lb \
    --global \
    --source=/dev/stdin <<EOF
name: weather-station-lb
defaultService: https://www.googleapis.com/compute/v1/projects/$PROJECT_ID/global/backendBuckets/weather-station-backend
hostRules:
- hosts:
  - '*'
  pathMatcher: path-matcher-1
pathMatchers:
- name: path-matcher-1
  defaultService: https://www.googleapis.com/compute/v1/projects/$PROJECT_ID/global/backendBuckets/weather-station-backend
EOF
```

### Step 5: Configure DNS

Point your domain to the reserved IP address:

```
A    your-domain.com         → [RESERVED_IP]
A    www.your-domain.com     → [RESERVED_IP]
```

### Step 6: SPA Routing Configuration

For proper SPA routing (React Router), add a custom error page that redirects to index.html:

```bash
# Create 404.html that redirects to index.html
cat > dist/404.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/index.html'">
</head>
</html>
EOF

# Upload to bucket
gsutil cp dist/404.html gs://$BUCKET_NAME/

# Update bucket website configuration
gsutil web set -m index.html -e 404.html gs://$BUCKET_NAME/
```

Add this to your [index.html](weather-report/index.html) head section:

```html
<script>
  (function(){
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect !== location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
</script>
```

### Deployment Script

Create [deploy-gcs.sh](weather-report/deploy-gcs.sh):

```bash
#!/bin/bash
set -e

# Configuration
BUCKET_NAME="weather-station-frontend"
BUILD_DIR="dist"

echo "Building application..."
npm run build

echo "Uploading to Cloud Storage..."
gsutil -m rsync -r -d $BUILD_DIR/ gs://$BUCKET_NAME/

echo "Setting cache headers..."
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" \
  gs://$BUCKET_NAME/assets/**

gsutil setmeta -h "Cache-Control:no-cache, no-store, must-revalidate" \
  gs://$BUCKET_NAME/index.html

echo "Invalidating CDN cache..."
gcloud compute url-maps invalidate-cdn-cache weather-station-lb \
    --path "/*" \
    --global

echo "Deployment complete!"
```

Make executable and run:
```bash
chmod +x deploy-gcs.sh
./deploy-gcs.sh
```

---

## Option 2: Cloud Run (Serverless Container)

Best for: Preview environments, A/B testing, or if you need server-side logic later.

### Cost Estimate
- Free tier: 2 million requests/month
- Beyond free: ~$0.40 per million requests
- **Total: $0-10/month** for typical usage

### Prerequisites
Enable required APIs:
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Step 1: Create Dockerfile

Create [Dockerfile](weather-report/Dockerfile):

```dockerfile
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
ARG VITE_FORECAST_API_BASE_URL
ARG VITE_NEWS_API_BASE_URL
ARG VITE_DEFAULT_CITY=Seattle
ARG VITE_REPORT_CACHE_DURATION=600
ARG VITE_REPORT_RETRY_DELAY=120

# Create .env file
RUN echo "VITE_FORECAST_API_BASE_URL=${VITE_FORECAST_API_BASE_URL}" > .env.production && \
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
```

### Step 2: Create .dockerignore

Create [.dockerignore](weather-report/.dockerignore):

```
node_modules
dist
.git
.env.local
.env.development
*.log
coverage
.vscode
.idea
```

### Step 3: Deploy to Cloud Run

```bash
cd weather-report

# Set variables
PROJECT_ID="your-project-id"
REGION="us-central1"
SERVICE_NAME="weather-station"
API_URL="https://your-weather-api-domain.com"
NEWS_API_URL="https://your-news-api-domain.com"

# Build and deploy in one command
gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 256Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "VITE_FORECAST_API_BASE_URL=$API_URL,VITE_NEWS_API_BASE_URL=$NEWS_API_URL" \
    --set-build-env-vars "VITE_FORECAST_API_BASE_URL=$API_URL,VITE_NEWS_API_BASE_URL=$NEWS_API_URL"

# Get the service URL
gcloud run services describe $SERVICE_NAME \
    --region $REGION \
    --format 'value(status.url)'
```

### Step 4: Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
    --service $SERVICE_NAME \
    --domain your-domain.com \
    --region $REGION

# Follow instructions to configure DNS
```

### Deployment Script

Create [deploy-cloudrun.sh](weather-report/deploy-cloudrun.sh):

```bash
#!/bin/bash
set -e

SERVICE_NAME="weather-station"
REGION="us-central1"
API_URL="https://your-weather-api-domain.com"
NEWS_API_URL="https://your-news-api-domain.com"

echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 256Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "VITE_FORECAST_API_BASE_URL=$API_URL,VITE_NEWS_API_BASE_URL=$NEWS_API_URL" \
    --set-build-env-vars "VITE_FORECAST_API_BASE_URL=$API_URL,VITE_NEWS_API_BASE_URL=$NEWS_API_URL"

echo "Deployment complete!"
gcloud run services describe $SERVICE_NAME \
    --region $REGION \
    --format 'value(status.url)'
```

---

## Option 3: Firebase Hosting (Fastest Setup)

Best for: Quick deployments, prototypes, preview URLs.

### Cost Estimate
- Free tier: 10GB storage, 360MB/day transfer
- Beyond free: $0.026/GB storage, $0.15/GB transfer
- **Total: $0-5/month** for typical usage

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### Step 2: Initialize Firebase Project

```bash
cd weather-report

# Initialize Firebase
firebase init hosting

# Choose these options:
# - Use existing project or create new
# - Public directory: dist
# - Configure as SPA: Yes
# - Set up automatic builds: No
# - Overwrite index.html: No
```

This creates [firebase.json](weather-report/firebase.json):

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(html|json)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### Step 3: Configure Environment Variables

Create [.env.production](weather-report/.env.production):

```bash
VITE_FORECAST_API_BASE_URL=https://your-weather-api-domain.com
VITE_NEWS_API_BASE_URL=https://your-news-api-domain.com
VITE_DEFAULT_CITY=Seattle
VITE_REPORT_CACHE_DURATION=600
VITE_REPORT_RETRY_DELAY=120
```

### Step 4: Deploy

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Get your site URL (will be shown after deployment)
# Format: https://your-project-id.web.app
```

### Step 5: Custom Domain (Optional)

```bash
# Add custom domain via console or CLI
firebase hosting:channel:deploy live --only hosting

# Then configure via Firebase Console:
# Hosting → Add custom domain → Follow DNS instructions
```

### Deployment Script

Create [deploy-firebase.sh](weather-report/deploy-firebase.sh):

```bash
#!/bin/bash
set -e

echo "Building application..."
npm run build

echo "Deploying to Firebase..."
firebase deploy --only hosting

echo "Deployment complete!"
```

---

## Option 4: App Engine Standard

Best for: Traditional hosting needs, gradual migration from VMs.

### Cost Estimate
- Free tier: 28 instance hours/day
- Beyond free: ~$0.05-0.10 per instance hour
- **Total: $15-50/month** depending on traffic

### Step 1: Create app.yaml

Create [app.yaml](weather-report/app.yaml):

```yaml
runtime: nodejs18
service: default

env_variables:
  VITE_FORECAST_API_BASE_URL: "https://your-api-domain.com"
  VITE_DEFAULT_CITY: "Seattle"

handlers:
# Serve static files from dist directory
- url: /assets
  static_dir: dist/assets
  secure: always
  expiration: "1y"
  http_headers:
    Cache-Control: "public, max-age=31536000, immutable"

- url: /(.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))$
  static_files: dist/\1
  upload: dist/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$
  secure: always
  expiration: "1y"
  http_headers:
    Cache-Control: "public, max-age=31536000, immutable"

# Serve index.html for all other routes (SPA routing)
- url: /.*
  static_files: dist/index.html
  upload: dist/index.html
  secure: always
  http_headers:
    Cache-Control: "no-cache, no-store, must-revalidate"

automatic_scaling:
  min_instances: 0
  max_instances: 10
  target_cpu_utilization: 0.65
```

### Step 2: Create package.json for App Engine

Update [package.json](weather-report/package.json) scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "gcp-build": "npm run build"
  }
}
```

### Step 3: Deploy

```bash
cd weather-report

# Deploy to App Engine
gcloud app deploy app.yaml

# View your app
gcloud app browse
```

### Step 4: Custom Domain

```bash
# Map custom domain
gcloud app domain-mappings create your-domain.com

# Follow instructions to configure DNS
```

---

## Backend API Deployment

Your React app requires a backend Weather Forecast API. Here are options:

### Option A: Cloud Run (Recommended for Python FastAPI)

```bash
# Assuming your backend is in a separate directory
cd ../weather-api  # or wherever your backend is

# Deploy backend API
# Note: Update --port if your backend uses a different port (default: 8000)
gcloud run deploy weather-api \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8000 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 1 \
    --max-instances 10

# Get the API URL
gcloud run services describe weather-api \
    --region us-central1 \
    --format 'value(status.url)'

# Use this URL in your frontend VITE_FORECAST_API_BASE_URL
# Or configure VITE_FORECAST_API_HOST and VITE_FORECAST_API_PORT for local development
```

### Option B: Cloud Functions (for simple APIs)

```bash
# Deploy individual endpoints as functions
gcloud functions deploy weatherFunction \
    --runtime python311 \
    --trigger-http \
    --allow-unauthenticated \
    --region us-central1
```

### Option C: GKE Autopilot (for complex microservices)

```bash
# Create Autopilot cluster
gcloud container clusters create-auto weather-cluster \
    --region us-central1

# Deploy with Kubernetes manifests
kubectl apply -f k8s/
```

### CORS Configuration

Ensure your backend APIs (Weather and News) allow requests from your frontend domain:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-domain.com",
        "https://weather-station-frontend.web.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Cost Estimates

### Low Traffic (1,000 users/day, 10GB transfer/month)

| Option | Monthly Cost |
|--------|-------------|
| Cloud Storage + CDN | $2-3 |
| Cloud Run | $0 (free tier) |
| Firebase Hosting | $0 (free tier) |
| App Engine | $15-20 |

### Medium Traffic (10,000 users/day, 100GB transfer/month)

| Option | Monthly Cost |
|--------|-------------|
| Cloud Storage + CDN | $5-10 |
| Cloud Run | $3-5 |
| Firebase Hosting | $15-20 |
| App Engine | $40-60 |

### High Traffic (100,000 users/day, 1TB transfer/month)

| Option | Monthly Cost |
|--------|-------------|
| Cloud Storage + CDN | $80-120 |
| Cloud Run | $30-50 |
| Firebase Hosting | $150-200 |
| App Engine | $400-600 |

**Note:** Costs include frontend only. Backend API costs are separate.

---

## CI/CD Pipeline Setup

### Cloud Build Configuration

Create [cloudbuild.yaml](weather-report/cloudbuild.yaml):

```yaml
steps:
  # Install dependencies
  - name: 'node:18'
    entrypoint: npm
    args: ['ci']
    dir: 'weather-report'

  # Run linting
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'lint']
    dir: 'weather-report'

  # Build application
  - name: 'node:18'
    entrypoint: npm
    args: ['run', 'build']
    dir: 'weather-report'
    env:
      - 'VITE_FORECAST_API_BASE_URL=${_API_URL}'
      - 'VITE_NEWS_API_BASE_URL=${_NEWS_API_URL}'
      - 'VITE_DEFAULT_CITY=${_DEFAULT_CITY}'

  # Deploy to Cloud Storage
  - name: 'gcr.io/cloud-builders/gsutil'
    args:
      - '-m'
      - 'rsync'
      - '-r'
      - '-d'
      - 'weather-report/dist/'
      - 'gs://${_BUCKET_NAME}/'

  # Set cache headers for assets
  - name: 'gcr.io/cloud-builders/gsutil'
    args:
      - '-m'
      - 'setmeta'
      - '-h'
      - 'Cache-Control:public, max-age=31536000, immutable'
      - 'gs://${_BUCKET_NAME}/assets/**'

  # Set cache headers for HTML
  - name: 'gcr.io/cloud-builders/gsutil'
    args:
      - 'setmeta'
      - '-h'
      - 'Cache-Control:no-cache, no-store, must-revalidate'
      - 'gs://${_BUCKET_NAME}/index.html'

  # Invalidate CDN cache
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'compute'
      - 'url-maps'
      - 'invalidate-cdn-cache'
      - 'weather-station-lb'
      - '--path'
      - '/*'
      - '--global'

substitutions:
  _BUCKET_NAME: 'weather-station-frontend'
  _API_URL: 'https://your-weather-api-domain.com'
  _NEWS_API_URL: 'https://your-news-api-domain.com'
  _DEFAULT_CITY: 'Seattle'

timeout: 600s

options:
  logging: CLOUD_LOGGING_ONLY
```

### Set Up Build Triggers

```bash
# Connect GitHub repository
gcloud builds triggers create github \
    --repo-name=weather-station \
    --repo-owner=your-username \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml \
    --substitutions=_BUCKET_NAME="weather-station-frontend",_API_URL="https://your-weather-api.com",_NEWS_API_URL="https://your-news-api.com"

# Or for Cloud Run deployment
gcloud builds triggers create github \
    --repo-name=weather-station \
    --repo-owner=your-username \
    --branch-pattern="^main$" \
    --build-config=weather-report/cloudbuild-run.yaml
```

### GitHub Actions Alternative

Create [.github/workflows/deploy.yml](weather-report/.github/workflows/deploy.yml):

```yaml
name: Deploy to GCP

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  BUCKET_NAME: weather-station-frontend

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: weather-report/package-lock.json

      - name: Install dependencies
        working-directory: weather-report
        run: npm ci

      - name: Build
        working-directory: weather-report
        env:
          VITE_FORECAST_API_BASE_URL: ${{ secrets.API_URL }}
          VITE_NEWS_API_BASE_URL: ${{ secrets.NEWS_API_URL }}
          VITE_DEFAULT_CITY: Seattle
        run: npm run build

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Upload to Cloud Storage
        working-directory: weather-report
        run: |
          gsutil -m rsync -r -d dist/ gs://${{ env.BUCKET_NAME }}/
          gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" gs://${{ env.BUCKET_NAME }}/assets/**
          gsutil setmeta -h "Cache-Control:no-cache, no-store, must-revalidate" gs://${{ env.BUCKET_NAME }}/index.html

      - name: Invalidate CDN cache
        run: |
          gcloud compute url-maps invalidate-cdn-cache weather-station-lb \
            --path "/*" \
            --global
```

---

## Monitoring and Logging

### Enable Cloud Monitoring

```bash
# Enable APIs
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com

# Create uptime check
gcloud monitoring uptime-checks create https://your-domain.com \
    --display-name="Weather Station Frontend" \
    --check-interval=300s
```

### Set Up Alerts

```bash
# CPU usage alert for Cloud Run
gcloud alpha monitoring policies create \
    --notification-channels=YOUR_CHANNEL_ID \
    --display-name="High CPU Usage" \
    --condition-display-name="CPU > 80%" \
    --condition-threshold-value=0.8 \
    --condition-threshold-duration=300s
```

### View Logs

```bash
# Cloud Storage access logs
gcloud logging read "resource.type=gcs_bucket" --limit 50

# Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# CDN logs
gcloud logging read "resource.type=http_load_balancer" --limit 50
```

### Performance Monitoring

Add to your [index.html](weather-report/index.html):

```html
<!-- Google Analytics (optional) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Security Best Practices

### 1. Content Security Policy

Add to [index.html](weather-report/index.html):

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' 'unsafe-eval';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://your-weather-api-domain.com https://your-news-api-domain.com;">
```

### 2. Environment Variables Security

Never commit `.env.production` with real credentials:

```bash
# Add to .gitignore
echo ".env.production" >> .gitignore
echo ".env.local" >> .gitignore
```

### 3. API Authentication (if needed)

If your API requires authentication, use Cloud Secret Manager:

```bash
# Create secret
echo -n "your-api-key" | gcloud secrets create weather-api-key --data-file=-

# Grant access to Cloud Run service account
gcloud secrets add-iam-policy-binding weather-api-key \
    --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### 4. DDoS Protection

Cloud CDN provides automatic DDoS protection. For additional protection:

```bash
# Enable Cloud Armor
gcloud compute security-policies create weather-station-policy \
    --description "DDoS protection"

# Add rate limiting rule
gcloud compute security-policies rules create 1000 \
    --security-policy weather-station-policy \
    --expression "true" \
    --action "rate-based-ban" \
    --rate-limit-threshold-count 1000 \
    --rate-limit-threshold-interval-sec 60 \
    --ban-duration-sec 600
```

---

## Summary & Recommendations

### For Your Weather Station App:

**Best Choice: Cloud Storage + Cloud CDN**
- ✅ Most cost-effective ($1-5/month)
- ✅ Unlimited scalability
- ✅ Global CDN performance
- ✅ Simple deployment
- ✅ No server management

**Alternative: Firebase Hosting**
- ✅ Fastest setup (15 minutes)
- ✅ Free tier is generous
- ✅ Built-in preview channels
- ✅ Great for prototyping

### Next Steps:

1. Choose your deployment option
2. Set up GCP project and billing
3. Deploy backend API first (Cloud Run recommended)
4. Deploy frontend with backend API URL
5. Configure custom domain
6. Set up CI/CD pipeline
7. Configure monitoring and alerts

### Quick Start Commands:

```bash
# 1. Build locally
cd weather-report
npm install
npm run build

# 2. Deploy to Cloud Storage (recommended)
gsutil mb gs://weather-station-frontend
gsutil -m rsync -r dist/ gs://weather-station-frontend/
gsutil web set -m index.html -e index.html gs://weather-station-frontend/
gsutil iam ch allUsers:objectViewer gs://weather-station-frontend/

# 3. Access your site
echo "https://storage.googleapis.com/weather-station-frontend/index.html"
```

---

## Support & Resources

- [GCP Documentation](https://cloud.google.com/docs)
- [Cloud Storage Static Hosting](https://cloud.google.com/storage/docs/hosting-static-website)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

**Last Updated:** 2026-01-24
**Version:** 1.1.0

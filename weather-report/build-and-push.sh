#!/bin/bash
set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="weather-station"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
API_URL="https://weather-forecast-api-951067725786.us-central1.run.app"

echo "Building Docker image with API URL: $API_URL"
echo "Project ID: $PROJECT_ID"
echo "Image: $IMAGE_NAME"

# Build the image with build arguments
docker build \
    --build-arg VITE_FORECAST_API_BASE_URL="$API_URL" \
    --build-arg VITE_DEFAULT_CITY="New York" \
    --build-arg VITE_FORECAST_CACHE_DURATION=600 \
    --build-arg VITE_FORECAST_RETRY_DELAY=120 \
    -t "$IMAGE_NAME:latest" \
    .

echo "Pushing image to Google Container Registry..."
docker push "$IMAGE_NAME:latest"

echo "Build and push complete!"
echo "Image: $IMAGE_NAME:latest"
echo ""
echo "Now run ./deploy-cloudrun.sh to deploy this image to Cloud Run"

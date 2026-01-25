#!/bin/bash
set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="weather-station"
TAG="${TAG:-latest}"
IMAGE_PATH="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${TAG}"

WEATHER_API_URL="https://weather-forecast-api-951067725786.us-central1.run.app"
NEWS_API_URL="https://news-report-api-951067725786.us-central1.run.app"

echo "================================================"
echo "Building Docker image"
echo "================================================"
echo "Weather API URL: $WEATHER_API_URL"
echo "News API URL: $NEWS_API_URL"
echo "Project ID: ${PROJECT_ID}"
echo "Service Name: ${SERVICE_NAME}"
echo "Tag: ${TAG}"
echo "Image Path: ${IMAGE_PATH}"
echo "================================================"

# Build the image with build arguments
docker build \
    --build-arg VITE_WEATHER_API_BASE_URL="$WEATHER_API_URL" \
    --build-arg VITE_NEWS_API_BASE_URL="$NEWS_API_URL" \
    --build-arg VITE_DEFAULT_CITY="New York" \
    --build-arg VITE_REPORT_CACHE_DURATION=600 \
    --build-arg VITE_REPORT_RETRY_DELAY=120 \
    -t "$IMAGE_PATH" \
    .

echo "Pushing image to Google Container Registry..."
docker push "$IMAGE_PATH"

echo "================================================"
echo "Build and push completed successfully!"
echo "Image: ${IMAGE_PATH}"
echo "================================================"
echo ""
echo "Now run ./deploy-cloudrun.sh to deploy this image to Cloud Run"

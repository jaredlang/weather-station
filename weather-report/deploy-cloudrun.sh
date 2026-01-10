#!/bin/bash
set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="weather-station"
TAG="${TAG:-latest}"

PORT="${PORT:-8080}"
MEMORY="${MEMORY:-512Mi}"
CPU="${CPU:-1}"
MAX_INSTANCES="${MAX_INSTANCES:-10}"
MIN_INSTANCES="${MIN_INSTANCES:-0}"
TIMEOUT="${TIMEOUT:-300}"

# Construct full image path
IMAGE_PATH="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${TAG}"

echo "Deploying pre-built image to Cloud Run..."
echo "Image: $IMAGE_PATH"

echo "================================================"
echo "Deploying to Cloud Run"
echo "================================================"
echo "Project ID: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Service Name: ${SERVICE_NAME}"
echo "Image: ${IMAGE_PATH}"
echo "Port: ${PORT}"
echo "Memory: ${MEMORY}"
echo "CPU: ${CPU}"
echo "Max Instances: ${MAX_INSTANCES}"
echo "Min Instances: ${MIN_INSTANCES}"
echo "Timeout: ${TIMEOUT}s"
echo "================================================"

gcloud run deploy $SERVICE_NAME \
    --image "$IMAGE_PATH" \
    --platform=managed \
    --project="${PROJECT_ID}" \
    --region="${REGION}" \
    --port="${PORT}" \
    --memory="${MEMORY}" \
    --cpu="${CPU}" \
    --max-instances="${MAX_INSTANCES}" \
    --min-instances="${MIN_INSTANCES}" \
    --timeout="${TIMEOUT}" \
    --allow-unauthenticated 

echo "================================================"
echo "Deployment completed successfully!"
echo "================================================"

echo "Service URL:"
gcloud run services describe $SERVICE_NAME \
    --region $REGION \
    --format 'value(status.url)'

echo "================================================"

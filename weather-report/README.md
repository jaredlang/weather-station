# Weather Station

A modern, minimalist weather reporting website built with React, TypeScript, and Tailwind CSS.

## Features

- 🎵 **Audio Playback** - Play weather forecast audio with custom controls
- 📝 **Transcript Display** - Read the forecast text alongside audio
- 🔍 **City Search** - Search and select from available cities
- ⏱️ **Real-time Age** - See how fresh the forecast is with live updates
- 🎨 **Minimalist Design** - Apple Weather-inspired clean aesthetic
- 📱 **Mobile-First** - Responsive design optimized for all devices
- 🌙 **Dark Mode** - Automatic dark mode support

## Quick Start

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Prerequisites

- Node.js (v18 or higher)
- Weather API backend running (default: `http://localhost:8200`, configurable via environment variables)

## Project Structure

```
weather-station/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── api/       # API client and endpoints
│   │   ├── components/# React components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── store/     # State management
│   │   └── utils/     # Utility functions
│   └── package.json
└── weather-forecast-openapi.json  # API specification
```

## Technologies

- **React 18** + **TypeScript** - Type-safe UI development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Modern CSS framework
- **TanStack Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations
- **Headless UI** - Accessible component primitives

## API Integration

The frontend consumes the Weather Forecast API:

- `GET /weather/{city}` - Latest forecast with audio
- `GET /weather/{city}/history` - Forecast history
- `GET /stats/` - Storage statistics
- `GET /health/` - Service health check

## Development

```bash
cd frontend

# Development
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

Create `frontend/.env.local`:

```
# Backend Forecast API Configuration
# For local development: use VITE_FORECAST_API_HOST and VITE_FORECAST_API_PORT
VITE_FORECAST_API_HOST=localhost
VITE_FORECAST_API_PORT=8200

# For production: use VITE_FORECAST_API_BASE_URL with your deployed backend URL
# VITE_FORECAST_API_BASE_URL=https://your-backend-api.cloud.run.app

# Application Settings
VITE_DEFAULT_CITY=Seattle

# Cache configuration (in seconds)
VITE_FORECAST_CACHE_DURATION=600

# Retry configuration (in seconds)
VITE_FORECAST_RETRY_DELAY=120
```

**Note**: If you need to change the backend port, simply update `VITE_FORECAST_API_PORT` in your `.env.local` file. All proxy configurations and API calls will automatically use the new port.

## License

MIT

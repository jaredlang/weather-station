# Weather Station

A modern, minimalist weather and news reporting website built with React, TypeScript, and Tailwind CSS.

## Features

### Weather

- 🎵 **Audio Playback** - Play weather forecast audio with custom controls
- 📝 **Transcript Display** - Read the forecast text alongside audio
- 🔍 **City Search** - Search and select from available cities
- ⏱️ **Real-time Age** - See how fresh the forecast is with live updates

### News

- 📰 **Subreddit News** - Browse news summaries from various subreddits
- 🔍 **Subreddit Search** - Search and select from available subreddits
- 🖼️ **News Images** - Visual news presentation with hero images

### General

- 🎨 **Minimalist Design** - Apple Weather-inspired clean aesthetic
- 📱 **Mobile-First** - Responsive design optimized for all devices
- 🌙 **Dark Mode** - Automatic dark mode support
- 🗂️ **Tab Navigation** - Switch between Weather and News views

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

```text
weather-report/
├── src/
│   ├── api/           # API clients and endpoints
│   ├── components/
│   │   ├── common/    # Shared components
│   │   ├── layout/    # Header, navigation
│   │   ├── weather/   # Weather-specific components
│   │   └── news/      # News-specific components
│   ├── hooks/         # Custom React hooks
│   ├── store/         # Zustand state management
│   └── utils/         # Utility functions
└── package.json
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

The frontend consumes two APIs:

### Weather Forecast API (default port 8200)

- `GET /weather/{city}` - Latest forecast with audio
- `GET /weather/{city}/history` - Forecast history
- `GET /stats/` - Storage statistics
- `GET /health/` - Service health check

### News API (default port 8300)

- `GET /news/{subreddit}` - Latest news summary for a subreddit
- `GET /news/{subreddit}/history` - News history
- `GET /stats/` - News statistics
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

Create `.env.local`:

```env
# Backend Forecast API Configuration
# For local development: use VITE_FORECAST_API_HOST and VITE_FORECAST_API_PORT
VITE_FORECAST_API_HOST=localhost
VITE_FORECAST_API_PORT=8200

# For production: use VITE_FORECAST_API_BASE_URL with your deployed backend URL
# VITE_FORECAST_API_BASE_URL=https://your-weather-api.cloud.run.app

# Backend News API Configuration
# For local development: use VITE_NEWS_API_HOST and VITE_NEWS_API_PORT
VITE_NEWS_API_HOST=localhost
VITE_NEWS_API_PORT=8300

# For production: use VITE_NEWS_API_BASE_URL with your deployed backend URL
# VITE_NEWS_API_BASE_URL=https://your-news-api.cloud.run.app

# Application Settings
VITE_DEFAULT_CITY=Seattle

# Cache configuration (in seconds)
VITE_FORECAST_CACHE_DURATION=600

# Retry configuration (in seconds)
VITE_FORECAST_RETRY_DELAY=120
```

**Note**: If you need to change the backend ports, simply update `VITE_FORECAST_API_PORT` or `VITE_NEWS_API_PORT` in your `.env.local` file. All API calls will automatically use the new ports.

## License

MIT

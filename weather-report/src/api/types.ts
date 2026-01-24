// Generated TypeScript types from OpenAPI specification

export interface WeatherResponse {
  status: string;
  city: string;
  forecast: ForecastData;
}

export interface ForecastData {
  text: string;
  audio_base64: string;
  picture_url?: string;
  forecast_at: string;
  expires_at: string;
  age_seconds: number;
  metadata: ForecastMetadata;
}

export interface ForecastMetadata {
  encoding: string;
  language: string | null;
  locale: string | null;
  sizes: Record<string, number>;
}

export interface HistoryResponse {
  status: string;
  city: string;
  count: number;
  forecasts: HistoricalForecast[];
}

export interface HistoricalForecast {
  forecast_id: string;
  forecast_at: string;
  expires_at: string;
  expired: boolean;
  encoding: string;
  language: string | null;
  locale: string | null;
  sizes: Record<string, number>;
  created_at: string;
}

export interface StatsResponse {
  status: string;
  statistics: StorageStatistics;
}

export interface StorageStatistics {
  total_forecasts: number;
  total_text_bytes: number;
  total_audio_bytes: number;
  encodings_used: Record<string, number>;
  languages_used: Record<string, number>;
  city_breakdown: CityStatistics[];
}

export interface CityStatistics {
  city: string;
  forecast_count: number;
  total_text_bytes: number;
  total_audio_bytes: number;
  latest_forecast: string | null;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  database: DatabaseHealth;
  api_version: string;
}

export interface DatabaseHealth {
  connected: boolean;
  instance: string | null;
  database: string | null;
  version: string | null;
  forecasts_table_exists: boolean | null;
  error: string | null;
}

export interface ErrorResponse {
  status: string;
  message: string;
  detail?: Record<string, unknown> | null;
}

export interface WeatherNotFoundResponse {
  status: string;
  message: string;
}

// News API Types
export interface NewsResponse {
  status: string;
  subreddit?: string;
  report_type?: string;
  news: NewsData;
}

export interface NewsListResponse {
  status: string;
  subreddit?: string;
  report_type?: string;
  count: number;
  news: NewsSummary[];
}

export interface NewsData {
  id: string;
  title?: string;
  content: string;
  summary?: string;
  source?: string;
  category?: string;
  published_at: string;
  created_at: string;
  expires_at?: string;
  is_expired: boolean;
  age_seconds: number;
  audio_url?: string;
  audio_format?: string;
  audio_size_bytes?: number;
  audio_duration_seconds?: number;
  image_url?: string;
  image_format?: string;
  image_size_bytes?: number;
  tags: string[];
  metadata: NewsMetadata;
  record_metadata?: Record<string, unknown>;
}

export interface NewsMetadata {
  encoding: string;
  language?: string;
  locale?: string;
  sizes: {
    text?: number;
    summary?: number;
    audio?: number;
    image?: number;
  };
}

export interface NewsSummary {
  id: string;
  title?: string;
  source?: string;
  category?: string;
  published_at: string;
  created_at: string;
  expires_at?: string;
  is_expired: boolean;
  text_language?: string;
  text_size_bytes: number;
  has_audio: boolean;
  has_image: boolean;
  audio_duration_seconds?: number;
  tags: string[];
}

export interface NewsStatsResponse {
  status: string;
  statistics: NewsStatistics;
}

export interface NewsStatistics {
  total_reports: number;
  total_text_bytes: number;
  total_summary_bytes: number;
  total_audio_bytes: number;
  total_image_bytes: number;
  reports_with_audio: number;
  reports_with_images: number;
  expired_reports: number;
  categories_used: Record<string, number>;
  sources_used: Record<string, number>;
  languages_used: Record<string, number>;
}

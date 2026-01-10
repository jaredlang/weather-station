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

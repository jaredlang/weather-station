import apiClient from './client';
import type { WeatherResponse, HistoryResponse } from './types';

export const getLatestForecast = async (
  city: string,
  language?: string
): Promise<WeatherResponse> => {
  const params = language ? { language } : {};
  const response = await apiClient.get<WeatherResponse>(`/weather/${city}`, {
    params,
  });
  return response.data;
};

export const getForecastHistory = async (
  city: string,
  limit: number = 10,
  includeExpired: boolean = false
): Promise<HistoryResponse> => {
  const response = await apiClient.get<HistoryResponse>(
    `/weather/${city}/history`,
    {
      params: {
        limit,
        include_expired: includeExpired,
      },
    }
  );
  return response.data;
};

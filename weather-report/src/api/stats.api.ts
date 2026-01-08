import apiClient from './client';
import type { StatsResponse, HealthResponse } from './types';

export const getStats = async (): Promise<StatsResponse> => {
  const response = await apiClient.get<StatsResponse>('/stats/');
  return response.data;
};

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/health/');
  return response.data;
};

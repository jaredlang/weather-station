import newsApiClient from './newsClient';
import type { NewsResponse, NewsListResponse, NewsStatsResponse, NewsData } from './types';

export const getLatestNews = async (
  subreddit: string,
  reportType?: string,
  language?: string
): Promise<NewsResponse> => {
  const params: Record<string, string> = {};
  if (reportType) params.report_type = reportType;
  if (language) params.language = language;

  const response = await newsApiClient.get<NewsResponse>(`/news/${subreddit}`, {
    params,
  });
  return response.data;
};

export const getNewsHistory = async (
  subreddit: string,
  limit: number = 10,
  includeExpired: boolean = false,
  reportType?: string,
  language?: string
): Promise<NewsListResponse> => {
  const params: Record<string, string | number | boolean> = {
    limit,
    include_expired: includeExpired,
  };
  if (reportType) params.report_type = reportType;
  if (language) params.language = language;

  const response = await newsApiClient.get<NewsListResponse>(
    `/news/${subreddit}/history`,
    { params }
  );
  return response.data;
};

export const getNewsById = async (newsId: string): Promise<NewsData> => {
  const response = await newsApiClient.get<{ status: string; news: NewsData }>(
    `/news/id/${newsId}`
  );
  return response.data.news;
};

export const searchNews = async (
  query: string,
  category?: string,
  language?: string,
  limit: number = 10
): Promise<NewsListResponse> => {
  const params: Record<string, string | number> = { query, limit };
  if (category) params.category = category;
  if (language) params.language = language;

  const response = await newsApiClient.get<NewsListResponse>('/news/search', {
    params,
  });
  return response.data;
};

export const getNewsStats = async (): Promise<NewsStatsResponse> => {
  const response = await newsApiClient.get<NewsStatsResponse>('/stats');
  return response.data;
};

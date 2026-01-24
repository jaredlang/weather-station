import axios from 'axios';
import { config } from '@/utils/config';

const newsApiClient = axios.create({
  baseURL: config.newsApiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
newsApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // API responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 404:
          throw new Error(data.message || 'News not found');
        case 503:
          throw new Error('Service temporarily unavailable');
        case 422:
          throw new Error('Invalid request parameters');
        default:
          throw new Error('An unexpected error occurred');
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('Network error - please check your connection');
    } else {
      throw new Error(error.message);
    }
  }
);

export default newsApiClient;

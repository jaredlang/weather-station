import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // API responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 404:
          throw new Error(data.message || 'Forecast not found');
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

export default apiClient;

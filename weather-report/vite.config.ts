import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiHost = env.VITE_FORECAST_API_HOST || 'localhost'
  const apiPort = env.VITE_FORECAST_API_PORT || '8000'
  const apiTarget = `http://${apiHost}:${apiPort}`

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: true,
    },
    server: {
      port: 3000,
      proxy: {
        '/weather': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/stats': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/health': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})

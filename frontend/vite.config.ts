import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-oxc'
import path from "path"
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api/v1": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
      },
    },
    cors: {
      origin: true,
      credentials: true
    }
  },
})

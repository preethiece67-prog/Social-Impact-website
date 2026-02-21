import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose to all network interfaces for Docker
    port: 5173,      // Required port for docker-compose
    strictPort: true, // Fail if port is in use
    watch: {
      usePolling: true, // Required for HMR in Windows/WSL/Docker
      interval: 100
    }
  }
})

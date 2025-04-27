import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://media.services.pbs.org', // The target API
  //       changeOrigin: true, // This will modify the origin of the request to match the target
  //       rewrite: (path) => path.replace(/^\/api/, ''), // This removes '/api' from the URL
  //     },
  //   },
  // },
})

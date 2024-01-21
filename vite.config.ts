import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'node:url'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    cors: true,
    origin: '*',
  },
})

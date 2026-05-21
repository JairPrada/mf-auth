import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'remoteEntry',
    },
    rollupOptions: {},
  },
  server: { port: 3002 },
  preview: {
    port: 3002,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
})

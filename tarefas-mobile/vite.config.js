import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'pages': resolve(__dirname, 'src/pages'),
      'stores': resolve(__dirname, 'src/stores'),
      'components': resolve(__dirname, 'src/components')
    }
  },
  build: {
    outDir: 'www',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
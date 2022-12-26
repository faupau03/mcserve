import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'


// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      supported: { bigint: true }
    }
  },
  plugins: [vue(),nodePolyfills()]
})

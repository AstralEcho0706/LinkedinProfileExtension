import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.json' assert { type: 'json' };
import packageJson from './package.json';
manifest.version = packageJson.version;

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['webextension-polyfill'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [vue(), crx({ manifest })],
  server: {
    // Fix for HMR based on https://github.com/crxjs/chrome-extension-tools/issues/746
    strictPort: true,
    port: 5175,
    hmr: {
      clientPort: 5175,
    },
  },
});

// vite.config.js
import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5175,
    open: true,
  },
  optimizeDeps: {
    include: ["lottie-web"],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'BMTicketingWidget',
      fileName: 'bm-ticketing-widget',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'bm-ticketing-widget.css';
          }
          return assetInfo.name;
        },
      },
      onwarn(warning, warn) {
        if (warning.code === 'EVAL' && warning.id.includes('lottie-web')) {
          return;
        }
        warn(warning);
      },
    },
    cssCodeSplit: false,
  },
  publicDir: 'public',
});
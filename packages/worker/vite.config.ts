import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        worker: resolve(__dirname, 'src/worker.ts'),
      },
      name: 'PivotUIWorker',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['@webgpu/types'],
    },
  },
  test: {
    environment: 'jsdom',
  },
});
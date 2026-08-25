import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: path.resolve(__dirname, 'storefront'),
  build: {
    outDir: path.resolve(__dirname, 'storefront/dist'),
    emptyOutDir: true,
  },
});

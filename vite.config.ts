import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      // ESLint plugin options
      include: ['src/**/*.{ts,tsx}'], // Lint TypeScript and TSX files in src
      exclude: ['node_modules/**', 'dist/**'], // Exclude unnecessary directories
      cache: true, // Cache linting results for performance
      fix: true, // Automatically fix linting errors (e.g., add missing semicolons)
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    hmr: {
      overlay: false, // Keep overlay enabled but customizable
      // Optional: Customize overlay behavior
      clientPort: 5173, // Default Vite port, adjust if needed
    },
    watch: {
      // Ensure Vite watches for changes in TypeScript files
      include: ['src/**/*.{ts,tsx}'],
    },
  },
});
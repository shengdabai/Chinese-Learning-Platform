import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths({ projects: ['./tsconfig.app.json'] })],
  test: {
    // Recognize the real dependency path behind the iCloud-safe node_modules symlink.
    deps: { moduleDirectories: ['node_modules', 'node_modules.nosync'] },
    environment: 'jsdom',
    globals: true,
    include: ['src/__tests__/**/*.test.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/__tests__/**', 'src/vite-env.d.ts'],
    },
  },
});

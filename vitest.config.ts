import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // jsdom@29 + vitest@4 interop edge cases: vitest-dev/vitest#9279
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/__tests__/**', 'src/index.ts'],
    },
  },
});

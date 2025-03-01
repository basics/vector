import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: process.env.BASE_URL || '/',
  test: {
    // environment: 'jsdom',
    include: ['test/*.js'],
    testTimeout: 60_000,
    hookTimeout: 140_000
  }
});

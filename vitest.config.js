import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.js'],
    coverage: {
      include: ['lib/**/*.js'],
    },
  },
});

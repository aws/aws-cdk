import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/test/**/*.(test).ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text'],
    },
  },
});

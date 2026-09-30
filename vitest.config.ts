import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      LLM_API_KEY: 'test-key',
      LLM_MODEL: 'gpt-4o-mini',
      PORT: '4001',
    },
  },
});

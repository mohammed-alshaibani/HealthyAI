import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  LLM_API_KEY: z.string().min(1),
  LLM_MODEL: z.string().default('gpt-4o-mini'),
  LLM_BASE_URL: z.string().optional(),
  PORT: z.coerce.number().default(4000),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);

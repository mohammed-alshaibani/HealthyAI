import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './lib/env';
import { chatRouter } from './chat/chat.controller';
import { errorHandler } from './middleware/error-handler';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '50kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', chatRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`HealTrip API running on port ${env.PORT}`);
});

export { app };

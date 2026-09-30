import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { chatRouter } from './chat/chat.controller';
import { errorHandler } from './middleware/error-handler';

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '50kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', chatRouter);

app.use(errorHandler);

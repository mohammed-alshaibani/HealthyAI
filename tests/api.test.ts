import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../apps/api/src/server';

describe('Chat API', () => {
  it('should return 400 for invalid request body', async () => {
    const res = await request(app).post('/api/chat').send({ wrongField: 'test' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should intercept emergency safely', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: 'I am having a heart attack' }],
      });
    
    expect(res.status).toBe(200);
    expect(res.body.message.role).toBe('assistant');
    expect(res.body.message.content).toContain('emergency services');
  });
});

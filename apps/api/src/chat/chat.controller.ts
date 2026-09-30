import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { checkSafety } from '../safety/safety.service';
import { runAgent, toolRegistry } from '../agent/agent';
import OpenAI from 'openai';
import { env } from '../lib/env';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
});

const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  messages: z.array(messageSchema).min(1).max(50),
});

export const chatRouter = Router();

chatRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const input = chatRequestSchema.parse(req.body);

    // Last message must be from the user
    const lastMessage = input.messages[input.messages.length - 1];
    if (lastMessage.role !== 'user') {
      res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Last message must be from the user.',
        },
      });
      return;
    }

    const conversationId =
      input.conversationId || crypto.randomUUID();

    // Deterministic safety check runs before the LLM
    const safety = checkSafety(lastMessage.content);
    if (safety.isEmergency) {
      res.json({
        conversationId,
        message: { role: 'assistant', content: safety.response! },
      });
      return;
    }

    // Run the AI agent
    const openai = new OpenAI({ 
      apiKey: env.LLM_API_KEY,
      baseURL: env.LLM_BASE_URL 
    });
    const result = await runAgent(input.messages, openai, toolRegistry);

    res.json({
      conversationId,
      message: { role: 'assistant', content: result.message },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request format.',
        },
      });
      return;
    }

    // Log but don't expose details
    console.error(
      '[chat]',
      error instanceof Error ? error.message : 'Unknown error',
    );

    res.status(500).json({
      error: {
        code: 'LLM_UNAVAILABLE',
        message:
          'The assistant is temporarily unavailable. Please try again.',
      },
    });
  }
});

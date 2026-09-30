import { Request, Response, NextFunction, Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { env } from '../lib/env';
import { ChatService } from './chat.service';
import { AgentOrchestrator } from '../agent/agent';
import { OpenAIAdapter } from '../llm/openai-adapter';
import { toolRegistry } from '../agent/tools';
import { ValidationError } from '../shared/errors';
import { MAX_MESSAGES_PER_REQUEST, MAX_MESSAGE_LENGTH } from '../shared/constants';
import { validateRequest } from '../shared/middleware/validate-request';

// Zod schema for validating the incoming chat request
const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system', 'tool']),
      content: z.string().max(MAX_MESSAGE_LENGTH).nullable(),
      tool_calls: z.any().optional(),
      tool_call_id: z.string().optional(),
    })
  ).min(1).max(MAX_MESSAGES_PER_REQUEST),
  conversationId: z.string().optional(),
  language: z.enum(['ar', 'en']).optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
}).strict();

// Application-level dependency composition (Singleton)
const llmProvider = new OpenAIAdapter(env.LLM_API_KEY, env.LLM_MODEL, env.LLM_BASE_URL);
const agentOrchestrator = new AgentOrchestrator(llmProvider, toolRegistry);
const chatService = new ChatService(agentOrchestrator);

export async function handleChat(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Input is pre-validated by Zod middleware
    const { messages, conversationId, location, language } = req.body;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== 'user') {
      throw new ValidationError('The last message must be from the user');
    }

    const currentConversationId = conversationId || randomUUID();

    // 2. Delegate to Service
    const { message, resolvedLocation } = await chatService.handleMessage({ messages, location, language });

    // 3. Return Response
    res.json({
      message,
      conversationId: currentConversationId,
      resolvedLocation,
    });

  } catch (error) {
    // Pass to error handler middleware
    next(error);
  }
}

export const chatRouter = Router();
chatRouter.post('/', validateRequest(chatRequestSchema), handleChat);


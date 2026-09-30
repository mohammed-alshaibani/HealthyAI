import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { env } from '../lib/env';
import { ChatService } from './chat.service';
import { AgentOrchestrator } from '../agent/agent';
import { OpenAIAdapter } from '../llm/openai-adapter';
import { searchDoctors } from '../doctors/doctors.service';
import { searchHospitals } from '../hospitals/hospitals.service';
import { ValidationError } from '../shared/errors';
import { MAX_MESSAGES_PER_REQUEST, MAX_MESSAGE_LENGTH } from '../shared/constants';

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
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
}).strict();

// Application-level dependency composition (Singleton)
const llmProvider = new OpenAIAdapter(env.LLM_API_KEY, env.LLM_MODEL, env.LLM_BASE_URL);
const toolRegistry = {
  search_doctors: async (rawArgs: string) => JSON.stringify(await searchDoctors(JSON.parse(rawArgs))),
  search_hospitals: async (rawArgs: string) => JSON.stringify(await searchHospitals(JSON.parse(rawArgs))),
};
const agentOrchestrator = new AgentOrchestrator(llmProvider, toolRegistry);
const chatService = new ChatService(agentOrchestrator);

export async function handleChat(req: Request, res: Response) {
  try {
    // 1. Validate Input
    const parseResult = chatRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError('Invalid request payload', parseResult.error.format());
    }

    const { messages, conversationId, location } = parseResult.data;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== 'user') {
      throw new ValidationError('The last message must be from the user');
    }

    const currentConversationId = conversationId || randomUUID();

    // 2. Delegate to Service
    const assistantMessage = await chatService.handleMessage({ messages, location });

    // 3. Return Response
    res.json({
      message: assistantMessage,
      conversationId: currentConversationId
    });

  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({
        error: { code: error.code, message: error.message, details: error.details }
      });
    }
    
    // Fallback to error handler middleware which will handle generic AppError/Error
    throw error;
  }
}

export const chatRouter = Router();
chatRouter.post('/', handleChat);


import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { env } from '../lib/env';
import { SYSTEM_PROMPT } from './prompts';
import { AGENT_TOOLS } from './tools';
import {
  searchDoctors,
  searchDoctorsSchema,
} from '../doctors/doctors.service';
import {
  searchHospitals,
  searchHospitalsSchema,
} from '../hospitals/hospitals.service';

const MAX_HISTORY_MESSAGES = 20;

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentResult {
  message: string;
}

export type ToolExecutor = (rawArgs: string) => Promise<string>;

export const toolRegistry: Record<string, ToolExecutor> = {
  search_doctors: async (rawArgs: string) => {
    try {
      const args = JSON.parse(rawArgs);
      const validated = searchDoctorsSchema.parse(args);
      const results = await searchDoctors(validated);
      return JSON.stringify({ results, count: results.length });
    } catch {
      return JSON.stringify({
        error:
          'Tool execution failed. Provider information is temporarily unavailable.',
      });
    }
  },
  search_hospitals: async (rawArgs: string) => {
    try {
      const args = JSON.parse(rawArgs);
      const validated = searchHospitalsSchema.parse(args);
      const results = await searchHospitals(validated);
      return JSON.stringify({ results, count: results.length });
    } catch {
      return JSON.stringify({
        error:
          'Tool execution failed. Provider information is temporarily unavailable.',
      });
    }
  },
};

export async function runAgent(
  messages: Message[],
  openai: OpenAI,
  registry: Record<string, ToolExecutor>
): Promise<AgentResult> {

  // Bound conversation history to avoid sending too much context
  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

  const chatMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...recentMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const response = await openai.chat.completions.create({
    model: env.LLM_MODEL,
    messages: chatMessages,
    tools: AGENT_TOOLS,
    temperature: 0.3,
  });

  const choice = response.choices[0];
  if (!choice?.message) {
    throw new Error('No response from LLM');
  }

  // If the model wants to call tools, execute them and get a grounded response
  if (
    choice.finish_reason === 'tool_calls' &&
    choice.message.tool_calls?.length
  ) {
    const toolResultMessages: ChatCompletionMessageParam[] = [];

    for (const toolCall of choice.message.tool_calls) {
      const executor = registry[toolCall.function.name];
      let result: string;
      if (executor) {
        result = await executor(toolCall.function.arguments);
      } else {
        result = JSON.stringify({ error: `Unknown tool: ${toolCall.function.name}` });
      }
      toolResultMessages.push({
        role: 'tool' as const,
        tool_call_id: toolCall.id,
        content: result,
      });
    }

    // Second LLM call with tool results to generate the final grounded response
    const followUp = await openai.chat.completions.create({
      model: env.LLM_MODEL,
      messages: [
        ...chatMessages,
        choice.message, // assistant message that requested tools
        ...toolResultMessages,
      ],
      temperature: 0.3,
    });

    const finalChoice = followUp.choices[0];
    if (!finalChoice?.message?.content) {
      throw new Error('No response from LLM after tool execution');
    }

    return { message: finalChoice.message.content };
  }

  // Direct response (no tool call needed)
  if (!choice.message.content) {
    throw new Error('Empty response from LLM');
  }

  return { message: choice.message.content };
}

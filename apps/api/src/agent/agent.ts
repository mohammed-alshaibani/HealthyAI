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

/** Validate and execute a single tool call, returning a JSON string for the LLM */
async function executeTool(name: string, rawArgs: string): Promise<string> {
  try {
    const args = JSON.parse(rawArgs);

    switch (name) {
      case 'search_doctors': {
        const validated = searchDoctorsSchema.parse(args);
        const results = await searchDoctors(validated);
        return JSON.stringify({ results, count: results.length });
      }
      case 'search_hospitals': {
        const validated = searchHospitalsSchema.parse(args);
        const results = await searchHospitals(validated);
        return JSON.stringify({ results, count: results.length });
      }
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch {
    // Return structured error so the agent can tell the user rather than hallucinate
    return JSON.stringify({
      error:
        'Tool execution failed. Provider information is temporarily unavailable.',
    });
  }
}

export async function runAgent(messages: Message[]): Promise<AgentResult> {
  const openai = new OpenAI({ apiKey: env.LLM_API_KEY });

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
      const result = await executeTool(
        toolCall.function.name,
        toolCall.function.arguments,
      );
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

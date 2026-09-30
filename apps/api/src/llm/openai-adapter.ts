import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
  ToolDefinition,
} from './llm-provider';

/**
 * OpenAI-compatible adapter — the ONLY file in the project that imports the
 * OpenAI SDK. Swap this adapter to switch LLM providers (Anthropic, Gemini,
 * Azure OpenAI, local models, etc.) without touching business or agent logic.
 */
export class OpenAIAdapter implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string, baseURL?: string) {
    this.client = new OpenAI({ apiKey, baseURL });
    this.model = model;
  }

  async complete(
    messages: LLMMessage[],
    tools?: ToolDefinition[],
  ): Promise<LLMResponse> {
    const openaiMessages = messages.map((m) => this.toOpenAIMessage(m));

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: openaiMessages,
      ...(tools?.length ? { tools: tools as never[] } : {}),
      temperature: 0.3,
    });

    const choice = response.choices[0];
    if (!choice?.message) {
      throw new Error('No response from LLM');
    }

    return {
      content: choice.message.content,
      toolCalls: (choice.message.tool_calls ?? []).map((tc) => ({
        id: tc.id,
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments,
        },
      })),
      finishReason: choice.finish_reason ?? 'stop',
    };
  }

  // ---- internal mapping ----

  private toOpenAIMessage(msg: LLMMessage): ChatCompletionMessageParam {
    if (msg.role === 'tool') {
      return {
        role: 'tool',
        tool_call_id: msg.tool_call_id!,
        content: msg.content ?? '',
      };
    }

    if (msg.role === 'assistant' && msg.tool_calls?.length) {
      return {
        role: 'assistant',
        content: msg.content,
        tool_calls: msg.tool_calls.map((tc) => ({
          id: tc.id,
          type: 'function' as const,
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        })),
      };
    }

    return {
      role: msg.role,
      content: msg.content ?? '',
    } as ChatCompletionMessageParam;
  }
}

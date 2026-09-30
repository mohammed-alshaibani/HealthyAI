import { AGENT_TOOLS, createToolRegistry } from './tools';
import { SYSTEM_PROMPT, GROUNDING_REMINDER } from './prompts';
import { LLMError } from '../shared/errors';
import type { LLMProvider, LLMMessage } from '../llm/llm-provider';

export type ToolExecutor = (rawArgs: string) => Promise<string>;

const MAX_ITERATIONS = 5;

export class AgentOrchestrator {
  constructor(
    private llm: LLMProvider,
    private defaultToolRegistry: Record<string, ToolExecutor>
  ) {}

  /**
   * Run a multi-pass tool-calling agent loop.
   */
  async run(
    messages: LLMMessage[],
    locationContextText?: string,
    userLocation?: { lat: number; lng: number }
  ): Promise<LLMMessage> {
    try {
      const activeToolRegistry: Record<string, ToolExecutor> = userLocation
        ? createToolRegistry(userLocation)
        : this.defaultToolRegistry;

      const systemPromptContent = locationContextText
        ? `${SYSTEM_PROMPT}\n\n${locationContextText}`
        : SYSTEM_PROMPT;

      const agentMessages: LLMMessage[] = [
        { role: 'system', content: systemPromptContent },
        ...messages,
      ];

      let iterations = 0;

      while (iterations < MAX_ITERATIONS) {
        iterations++;

        if (iterations > 1) {
          agentMessages.push({
            role: 'user',
            content: `[System Reminder] ${GROUNDING_REMINDER}`,
          });
        }

        const response = await this.llm.complete(agentMessages, AGENT_TOOLS);

        if (response.toolCalls.length === 0) {
          return {
            role: 'assistant',
            content: response.content,
          };
        }

        agentMessages.push({
          role: 'assistant',
          content: response.content,
          tool_calls: response.toolCalls,
        });

        for (const tc of response.toolCalls) {
          const executor = activeToolRegistry[tc.function.name];
          let toolResultText = '';

          if (!executor) {
            toolResultText = JSON.stringify({ error: `Unknown tool: ${tc.function.name}` });
          } else {
            try {
              toolResultText = await executor(tc.function.arguments);
            } catch (error) {
              console.error(`[Agent] Tool ${tc.function.name} failed:`, error);
              toolResultText = JSON.stringify({
                error: `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
              });
            }
          }

          agentMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: toolResultText,
          });
        }
      }

      return {
        role: 'assistant',
        content: "I apologize, but I need to stop processing this request as it's taking too long.",
      };
    } catch (error) {
      if (error instanceof LLMError) throw error;
      throw new LLMError(error instanceof Error ? error.message : 'Unknown LLM error');
    }
  }
}

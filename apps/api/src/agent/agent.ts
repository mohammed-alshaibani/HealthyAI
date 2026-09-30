import { AGENT_TOOLS } from './tools';
import { SYSTEM_PROMPT, GROUNDING_REMINDER } from './prompts';
import { LLMError, ToolError } from '../shared/errors';
import type { LLMProvider, LLMMessage } from '../llm/llm-provider';

export type ToolExecutor = (rawArgs: string) => Promise<string>;

const MAX_ITERATIONS = 5;

export class AgentOrchestrator {
  constructor(
    private llm: LLMProvider,
    private toolRegistry: Record<string, ToolExecutor>
  ) {}

  /**
   * Run a multi-pass tool-calling agent loop.
   */
  async run(messages: LLMMessage[]): Promise<LLMMessage> {
    try {
      // 1. Prepare messages with System Prompt
      const agentMessages: LLMMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ];

      let iterations = 0;

      while (iterations < MAX_ITERATIONS) {
        iterations++;

        // 2. LLM Call
        // Inject grounding reminder if this is after tool calls (iterations > 1)
        if (iterations > 1) {
           agentMessages.push({
             role: 'user',
             content: `[System Reminder] ${GROUNDING_REMINDER}`
           });
        }
        
        const response = await this.llm.complete(agentMessages, AGENT_TOOLS);

        // 3. Check for tool calls
        if (response.toolCalls.length === 0) {
          return {
            role: 'assistant',
            content: response.content,
          };
        }

        // 4. Append assistant's tool call request to history
        agentMessages.push({
          role: 'assistant',
          content: response.content,
          tool_calls: response.toolCalls,
        });

        // 5. Execute tools
        for (const tc of response.toolCalls) {
          const executor = this.toolRegistry[tc.function.name];
          let toolResultText = '';

          if (!executor) {
            toolResultText = JSON.stringify({ error: `Unknown tool: ${tc.function.name}` });
          } else {
            try {
              toolResultText = await executor(tc.function.arguments);
            } catch (error) {
              console.error(`[Agent] Tool ${tc.function.name} failed:`, error);
              toolResultText = JSON.stringify({ error: `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
            }
          }

          agentMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: toolResultText,
          });
        }
      }

      // If we exit the loop, we hit the max iterations limit.
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

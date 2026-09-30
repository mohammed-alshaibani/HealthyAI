// ---------------------------------------------------------------------------
// LLM Provider — vendor-agnostic interface for chat completion with tools.
// Only the adapter (e.g. OpenAIAdapter) imports the concrete SDK.
// ---------------------------------------------------------------------------

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: LLMToolCall[];
  tool_call_id?: string;
}

export interface LLMToolCall {
  id: string;
  function: { name: string; arguments: string };
}

export interface LLMResponse {
  content: string | null;
  toolCalls: LLMToolCall[];
  finishReason: string;
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface LLMProvider {
  complete(
    messages: LLMMessage[],
    tools?: ToolDefinition[],
  ): Promise<LLMResponse>;
}

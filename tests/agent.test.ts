import { describe, it, expect, vi } from 'vitest';
import { AgentOrchestrator } from '../apps/api/src/agent/agent';
import type { LLMProvider } from '../apps/api/src/llm/llm-provider';

describe('AI Agent DI and Tool Registry', () => {
  it('should inject tool registry and execute a tool correctly', async () => {
    const mockProvider: LLMProvider = {
      complete: vi.fn()
        .mockResolvedValueOnce({
          content: null,
          toolCalls: [{ id: 'call_123', function: { name: 'mock_tool', arguments: '{"test":"data"}' } }],
          finishReason: 'tool_calls'
        })
        .mockResolvedValueOnce({
          content: 'Mocked final response',
          toolCalls: [],
          finishReason: 'stop'
        })
    };

    const mockTool = vi.fn().mockResolvedValue(JSON.stringify({ success: true }));
    const mockRegistry = { mock_tool: mockTool };

    const orchestrator = new AgentOrchestrator(mockProvider, mockRegistry);
    const result = await orchestrator.run([{ role: 'user', content: 'test' }]);
    
    expect(mockTool).toHaveBeenCalledWith('{"test":"data"}');
    expect(result.content).toBe('Mocked final response');
    
    expect(mockProvider.complete).toHaveBeenCalledTimes(2);
  });
  
  it('should handle unknown tools gracefully', async () => {
    const mockProvider: LLMProvider = {
      complete: vi.fn()
        .mockResolvedValueOnce({
          content: null,
          toolCalls: [{ id: 'call_456', function: { name: 'unknown_tool', arguments: '{}' } }],
          finishReason: 'tool_calls'
        })
        .mockResolvedValueOnce({
          content: 'Handled unknown tool',
          toolCalls: [],
          finishReason: 'stop'
        })
    };

    const orchestrator = new AgentOrchestrator(mockProvider, {});
    const result = await orchestrator.run([{ role: 'user', content: 'test' }]);
    
    expect(result.content).toBe('Handled unknown tool');
    
    const secondCallArgs = (mockProvider.complete as any).mock.calls[1][0];
    const toolResultMessage = secondCallArgs.find((m: any) => m.role === 'tool');
    expect(toolResultMessage.content).toContain('Unknown tool: unknown_tool');
  });
});

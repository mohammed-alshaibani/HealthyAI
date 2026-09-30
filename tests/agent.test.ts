import { describe, it, expect, vi } from 'vitest';
import { runAgent } from '../apps/api/src/agent/agent';

describe('AI Agent DI and Tool Registry', () => {
  it('should inject tool registry and execute a tool correctly', async () => {
    const mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn()
            .mockResolvedValueOnce({
              choices: [{
                message: {
                  content: null,
                  tool_calls: [{
                    id: 'call_123',
                    function: { name: 'mock_tool', arguments: '{"test":"data"}' }
                  }]
                },
                finish_reason: 'tool_calls'
              }]
            })
            .mockResolvedValueOnce({
              choices: [{
                message: { content: 'Mocked final response' }
              }]
            })
        }
      }
    } as any;

    const mockTool = vi.fn().mockResolvedValue(JSON.stringify({ success: true }));
    const mockRegistry = {
      mock_tool: mockTool
    };

    const result = await runAgent([{ role: 'user', content: 'test' }], mockOpenAI, mockRegistry);
    
    expect(mockTool).toHaveBeenCalledWith('{"test":"data"}');
    expect(result.message).toBe('Mocked final response');
    
    // Ensure 2 completion calls were made (1 for tool call, 1 for final response)
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(2);
  });
  
  it('should handle unknown tools gracefully', async () => {
    const mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn()
            .mockResolvedValueOnce({
              choices: [{
                message: {
                  content: null,
                  tool_calls: [{
                    id: 'call_456',
                    function: { name: 'unknown_tool', arguments: '{}' }
                  }]
                },
                finish_reason: 'tool_calls'
              }]
            })
            .mockResolvedValueOnce({
              choices: [{
                message: { content: 'Handled unknown tool' }
              }]
            })
        }
      }
    } as any;

    const result = await runAgent([{ role: 'user', content: 'test' }], mockOpenAI, {});
    
    expect(result.message).toBe('Handled unknown tool');
    
    const secondCallArgs = mockOpenAI.chat.completions.create.mock.calls[1][0];
    const toolResultMessage = secondCallArgs.messages.find((m: any) => m.role === 'tool');
    expect(toolResultMessage.content).toContain('Unknown tool: unknown_tool');
  });
});

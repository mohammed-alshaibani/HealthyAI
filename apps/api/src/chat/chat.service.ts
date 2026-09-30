import { checkSafety } from '../safety/safety.service';
import { AgentOrchestrator } from '../agent/agent';
import { MAX_HISTORY_MESSAGES } from '../shared/constants';
import { ContextBuilder } from '../agent/prompts';
import type { LLMMessage } from '../llm/llm-provider';

export interface ChatRequestPayload {
  messages: LLMMessage[];
  location?: { lat: number; lng: number };
  language?: 'ar' | 'en';
}

export class ChatService {
  constructor(private agentOrchestrator: AgentOrchestrator) {}

  async handleMessage(payload: ChatRequestPayload): Promise<LLMMessage> {
    const { messages, location, language } = payload;
    const lastMessage = messages[messages.length - 1];

    // 1. Deterministic Safety Check
    if (lastMessage.content) {
      const safetyCheck = checkSafety(lastMessage.content);
      if (safetyCheck.isEmergency && safetyCheck.response) {
        return { role: 'assistant', content: safetyCheck.response };
      }
    }

    // 2. Truncate history
    let activeMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    // 3. Inject location context if provided
    if (location && lastMessage.content) {
      activeMessages = await ContextBuilder.injectLocationContext(activeMessages, location);
    }

    if (language) {
      const languageInstruction = language === 'ar' 
        ? '[System: The user interface language is ARABIC. You MUST respond entirely in Arabic. Do not use English.]'
        : '[System: The user interface language is ENGLISH. You MUST respond entirely in English. Do not use Arabic.]';
      
      const lastMsg = activeMessages[activeMessages.length - 1];
      activeMessages[activeMessages.length - 1] = {
        ...lastMsg,
        content: `${languageInstruction}\n\n${lastMsg.content}`
      };
    }

    // 4. Run Agent
    return await this.agentOrchestrator.run(activeMessages);
  }
}

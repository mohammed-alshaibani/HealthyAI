import { checkSafety } from '../safety/safety.service';
import { AgentOrchestrator } from '../agent/agent';
import { MAX_HISTORY_MESSAGES } from '../shared/constants';
import { buildLocationGroundingBlock } from '../agent/prompts';
import type { LLMMessage } from '../llm/llm-provider';
import type { ResolvedGeoLocation } from '../shared/geo';

export interface ChatRequestPayload {
  messages: LLMMessage[];
  location?: { lat: number; lng: number };
  language?: 'ar' | 'en';
}

export interface ChatServiceResponse {
  message: LLMMessage;
  resolvedLocation?: ResolvedGeoLocation;
}

export class ChatService {
  constructor(private agentOrchestrator: AgentOrchestrator) {}

  async handleMessage(payload: ChatRequestPayload): Promise<ChatServiceResponse> {
    const { messages, location, language } = payload;
    const lastMessage = messages[messages.length - 1];

    // 1. Deterministic Safety Check
    if (lastMessage.content) {
      const safetyCheck = checkSafety(lastMessage.content);
      if (safetyCheck.isEmergency && safetyCheck.response) {
        return { message: { role: 'assistant', content: safetyCheck.response } };
      }
    }

    // 2. Truncate history
    const activeMessages = [...messages.slice(-MAX_HISTORY_MESSAGES)];

    // 3. Inject location context if provided
    let locationContextText: string | undefined;
    let resolvedLocation: ResolvedGeoLocation | undefined;
    if (location) {
      try {
        const geoResult = await buildLocationGroundingBlock(location.lat, location.lng);
        locationContextText = geoResult.locationContextText;
        resolvedLocation = geoResult.geo;
      } catch (err) {
        console.error('[ChatService] Failed to build location grounding block:', err);
      }
    }

    if (language) {
      const languageInstruction =
        language === 'ar'
          ? '[System: The user interface language is ARABIC. You MUST respond entirely in Arabic. Do not use English.]'
          : '[System: The user interface language is ENGLISH. You MUST respond entirely in English. Do not use Arabic.]';

      const lastMsg = activeMessages[activeMessages.length - 1];
      activeMessages[activeMessages.length - 1] = {
        ...lastMsg,
        content: `${languageInstruction}\n\n${lastMsg.content}`,
      };
    }

    // 4. Run Agent with location context and active location
    const message = await this.agentOrchestrator.run(activeMessages, locationContextText, location);
    return { message, resolvedLocation };
  }
}

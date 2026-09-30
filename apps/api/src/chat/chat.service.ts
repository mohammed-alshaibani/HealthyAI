import { checkSafety } from '../safety/safety.service';
import { AgentOrchestrator } from '../agent/agent';
import { getAllHospitalsForLocation } from '../hospitals/hospitals.service';
import { getDistanceKm } from '../shared/geo';
import { MAX_HISTORY_MESSAGES, MAX_NEARBY_HOSPITALS } from '../shared/constants';
import { buildLocationContextMessage } from '../agent/prompts';
import type { LLMMessage } from '../llm/llm-provider';

export interface ChatRequestPayload {
  messages: LLMMessage[];
  location?: { lat: number; lng: number };
}

export class ChatService {
  constructor(private agentOrchestrator: AgentOrchestrator) {}

  async handleMessage(payload: ChatRequestPayload): Promise<LLMMessage> {
    const { messages, location } = payload;
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
      activeMessages = await this.injectLocationContext(activeMessages, location);
    }

    // 4. Run Agent
    return await this.agentOrchestrator.run(activeMessages);
  }

  private async injectLocationContext(messages: LLMMessage[], location: { lat: number; lng: number }): Promise<LLMMessage[]> {
    try {
      // Find all hospitals and sort by distance using the dedicated service
      const allHospitals = await getAllHospitalsForLocation();

      const nearby = allHospitals
        .filter(h => h.lat !== null && h.lng !== null)
        .map(h => ({
          ...h,
          distance: getDistanceKm(location.lat, location.lng, h.lat as number, h.lng as number)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, MAX_NEARBY_HOSPITALS);

      if (nearby.length > 0) {
        const locationContextText = buildLocationContextMessage(location.lat, location.lng, nearby);
        
        // Prepend context to the last user message
        const lastMsg = messages[messages.length - 1];
        const updatedMessages = [...messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMsg,
          content: `${locationContextText}\n\n${lastMsg.content}`
        };
        return updatedMessages;
      }
    } catch (error) {
      console.error('[ChatService] Failed to inject location context:', error);
      // Non-fatal error, just return original messages
    }
    
    return messages;
  }
}

import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { checkSafety } from '../safety/safety.service';
import { runAgent, toolRegistry } from '../agent/agent';
import { hospitals, doctors } from '../lib/saudi-healthcare-data';
import OpenAI from 'openai';
import { env } from '../lib/env';

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(4000),
});

const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  messages: z.array(messageSchema).min(1).max(50),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

export const chatRouter = Router();

chatRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const input = chatRequestSchema.parse(req.body);

    // Last message must be from the user
    const lastMessage = input.messages[input.messages.length - 1];
    if (lastMessage.role !== 'user') {
      res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Last message must be from the user.',
        },
      });
      return;
    }

    const conversationId =
      input.conversationId || crypto.randomUUID();

    // Deterministic safety check runs before the LLM
    const safety = checkSafety(lastMessage.content);
    if (safety.isEmergency) {
      res.json({
        conversationId,
        message: { role: 'assistant', content: safety.response! },
      });
      return;
    }

    // Run the AI agent
    const openai = new OpenAI({ 
      apiKey: env.LLM_API_KEY,
      baseURL: env.LLM_BASE_URL 
    });

    let agentMessages = [...input.messages];

    // If location is provided, inject context about nearby hospitals
    if (input.location) {
      const nearestHospitals = hospitals
        .map(h => ({
          ...h,
          distance: getDistance(input.location!.lat, input.location!.lng, h.lat, h.lng)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3); // top 3

      const nearestContext = nearestHospitals.map(h => {
        const hDocs = doctors.filter(d => d.hospitalId === h.id).map(d => `${d.name} (${d.specialty})`).join(', ');
        return `- ${h.name} (${h.nameAr}) | Distance: ${h.distance.toFixed(1)} km | District: ${h.district} | Doctors: ${hDocs || 'None listed'} | Contact: ${h.address} | Google Maps: ${h.mapsUrl || `https://maps.google.com/?q=${h.lat},${h.lng}`}`;
      }).join('\n');

      const systemContext = `
[SYSTEM CONTEXT: USER LOCATION PROVIDED]
The user has shared their GPS location. Here are the nearest medical centers to the user right now:
${nearestContext}

When the user asks for the nearest center or doctor, ALWAYS prioritize these results. 
Present them nicely formatted, include the distance (e.g. "X.X km away"), the city and district, and provide a direct Google Maps link. 
Do not hallucinate links, use the ones provided above.`;

      // Prepend to messages array as a system/user hint (since some APIs don't allow multiple system prompts easily, we add it to the first user message)
      if (agentMessages.length > 0 && agentMessages[0].role === 'user') {
        agentMessages[0] = {
          ...agentMessages[0],
          content: `${systemContext}\n\n${agentMessages[0].content}`
        };
      }
    }

    const result = await runAgent(agentMessages, openai, toolRegistry);

    res.json({
      conversationId,
      message: { role: 'assistant', content: result.message },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request format.',
        },
      });
      return;
    }

    // Log but don't expose details
    console.error(
      '[chat]',
      error instanceof Error ? error.message : 'Unknown error',
    );

    res.status(500).json({
      error: {
        code: 'LLM_UNAVAILABLE',
        message:
          'The assistant is temporarily unavailable. Please try again.',
      },
    });
  }
});

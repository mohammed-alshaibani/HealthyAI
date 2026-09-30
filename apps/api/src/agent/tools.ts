import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ToolDefinition } from '../llm/llm-provider';
import { searchDoctors } from '../doctors/doctors.service';
import { searchHospitals } from '../hospitals/hospitals.service';

export const searchDoctorsSchema = z
  .object({
    specialty: z.string().describe('Medical specialty (e.g. Cardiology, Dermatology, Orthopedics, Pediatrics, Neurology, General Surgery, Oncology)').optional(),
    city: z.string().describe('City name (e.g. Riyadh, Jeddah, Dammam). Optional if user location is active.').optional(),
    language: z.string().describe('Preferred language of the doctor (e.g. Arabic, English)').optional(),
    name: z.string().describe('Specific name of the doctor (e.g. Dr. Ahmed)').optional(),
  })
  .strict();

export const searchHospitalsSchema = z
  .object({
    city: z.string().describe('City name (e.g. Riyadh, Jeddah, Dammam). Optional if user location is active.').optional(),
    specialty: z.string().describe('Medical specialty/department (e.g. Cardiology, Dermatology, Orthopedics, Pediatrics, Neurology, General Surgery, Oncology)').optional(),
    name: z.string().describe('Specific name of the hospital').optional(),
  })
  .strict();

export const AGENT_TOOLS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'search_doctors',
      description: 'Search for doctors by specialty, city, and/or language. Use when the user wants to find a specific type of doctor or medical specialist.',
      parameters: zodToJsonSchema(searchDoctorsSchema, { target: 'jsonSchema7' }) as Record<string, unknown>,
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_hospitals',
      description: 'Search for hospitals by city and/or specialty department. Use when the user wants to find hospitals or medical facilities.',
      parameters: zodToJsonSchema(searchHospitalsSchema, { target: 'jsonSchema7' }) as Record<string, unknown>,
    },
  },
];

export function createToolRegistry(userLocation?: { lat: number; lng: number }) {
  return {
    search_doctors: async (rawArgs: string) => {
      const parsed = searchDoctorsSchema.parse(JSON.parse(rawArgs));
      const input = {
        ...parsed,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
      };
      return JSON.stringify(await searchDoctors(input));
    },
    search_hospitals: async (rawArgs: string) => {
      const parsed = searchHospitalsSchema.parse(JSON.parse(rawArgs));
      const input = {
        ...parsed,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
      };
      return JSON.stringify(await searchHospitals(input));
    },
  };
}

export const toolRegistry = createToolRegistry();

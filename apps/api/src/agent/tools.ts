import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ToolDefinition } from '../llm/llm-provider';
import { searchDoctorsSchema } from '../doctors/doctors.service';
import { searchHospitalsSchema } from '../hospitals/hospitals.service';

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

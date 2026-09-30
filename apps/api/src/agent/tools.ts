import type { ChatCompletionTool } from 'openai/resources/chat/completions';

export const AGENT_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_doctors',
      description:
        'Search for doctors by specialty, city, and/or language. Use when the user wants to find a specific type of doctor or medical specialist.',
      parameters: {
        type: 'object',
        properties: {
          specialty: {
            type: 'string',
            description:
              'Medical specialty (e.g. Cardiology, Dermatology, Orthopedics, Pediatrics, Neurology, General Surgery, Oncology)',
          },
          city: {
            type: 'string',
            description: 'City name (e.g. Riyadh, Jeddah, Dammam)',
          },
          language: {
            type: 'string',
            description:
              'Preferred language of the doctor (e.g. Arabic, English)',
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_hospitals',
      description:
        'Search for hospitals by city and/or specialty department. Use when the user wants to find hospitals or medical facilities.',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'City name (e.g. Riyadh, Jeddah, Dammam)',
          },
          specialty: {
            type: 'string',
            description:
              'Medical specialty/department (e.g. Cardiology, Dermatology, Orthopedics, Pediatrics, Neurology, General Surgery, Oncology)',
          },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
];

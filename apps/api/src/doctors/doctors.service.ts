import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const searchDoctorsSchema = z
  .object({
    specialty: z.string().describe('Medical specialty (e.g. Cardiology, Dermatology, Orthopedics, Pediatrics, Neurology, General Surgery, Oncology)').optional(),
    city: z.string().describe('City name (e.g. Riyadh, Jeddah, Dammam)').optional(),
    language: z.string().describe('Preferred language of the doctor (e.g. Arabic, English)').optional(),
    name: z.string().describe('Specific name of the doctor (e.g. Dr. Ahmed)').optional(),
  })
  .strict();

export type SearchDoctorsInput = z.infer<typeof searchDoctorsSchema>;

import { buildNameSearchFilter, buildContainsFilter, normalizeArrayFilter, DEFAULT_SEARCH_LIMIT } from '../shared/db-utils';

export async function searchDoctors(input: SearchDoctorsInput) {
  const where: Record<string, unknown> = {};

  if (input.name) {
    Object.assign(where, buildNameSearchFilter(input.name));
  }

  if (input.specialty) {
    where.specialty = buildContainsFilter(input.specialty);
  }

  if (input.city) {
    where.city = buildContainsFilter(input.city);
  }

  if (input.language) {
    where.languages = normalizeArrayFilter(input.language);
  }

  return prisma.doctor.findMany({
    where,
    include: { hospital: { select: { name: true, nameAr: true } } },
    take: DEFAULT_SEARCH_LIMIT,
  });
}

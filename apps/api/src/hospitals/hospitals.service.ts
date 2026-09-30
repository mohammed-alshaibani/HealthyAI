import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const searchHospitalsSchema = z
  .object({
    city: z.string().describe('City name (e.g. Riyadh, Jeddah, Dammam)').optional(),
    specialty: z.string().describe('Medical specialty/department (e.g. Cardiology, Dermatology, Orthopedics, Pediatrics, Neurology, General Surgery, Oncology)').optional(),
    name: z.string().describe('Specific name of the hospital').optional(),
  })
  .strict();

export type SearchHospitalsInput = z.infer<typeof searchHospitalsSchema>;

import { buildNameSearchFilter, buildContainsFilter, normalizeArrayFilter, DEFAULT_SEARCH_LIMIT } from '../shared/db-utils';

export async function searchHospitals(input: SearchHospitalsInput) {
  const where: Record<string, unknown> = {};

  if (input.name) {
    Object.assign(where, buildNameSearchFilter(input.name));
  }

  if (input.city) {
    where.city = buildContainsFilter(input.city);
  }

  if (input.specialty) {
    where.specialties = normalizeArrayFilter(input.specialty);
  }

  return prisma.hospital.findMany({
    where,
    include: {
      doctors: {
        select: { id: true, name: true, nameAr: true, specialty: true },
      },
    },
    take: DEFAULT_SEARCH_LIMIT,
  });
}

export async function getAllHospitalsForLocation() {
  return prisma.hospital.findMany({
    select: { name: true, nameAr: true, city: true, lat: true, lng: true }
  });
}

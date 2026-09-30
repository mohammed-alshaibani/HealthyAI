export interface SearchHospitalsInput {
  city?: string;
  specialty?: string;
  name?: string;
}

import { prisma } from '../lib/prisma';
import { buildNameSearchFilter, buildContainsFilter, normalizeArrayFilter, normalizeSpecialty, DEFAULT_SEARCH_LIMIT } from '../shared/db-utils';

export async function searchHospitals(input: SearchHospitalsInput) {
  const where: Record<string, unknown> = {};

  if (input.name) {
    Object.assign(where, buildNameSearchFilter(input.name));
  }

  if (input.city) {
    where.city = buildContainsFilter(input.city);
  }

  if (input.specialty) {
    where.specialties = normalizeArrayFilter(normalizeSpecialty(input.specialty));
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

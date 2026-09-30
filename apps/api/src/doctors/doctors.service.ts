export interface SearchDoctorsInput {
  specialty?: string;
  city?: string;
  language?: string;
  name?: string;
}

import { prisma } from '../lib/prisma';
import { buildNameSearchFilter, buildContainsFilter, normalizeArrayFilter, normalizeSpecialty, DEFAULT_SEARCH_LIMIT } from '../shared/db-utils';

export async function searchDoctors(input: SearchDoctorsInput) {
  const where: Record<string, unknown> = {};

  if (input.name) {
    Object.assign(where, buildNameSearchFilter(input.name));
  }

  if (input.specialty) {
    where.specialty = buildContainsFilter(normalizeSpecialty(input.specialty));
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

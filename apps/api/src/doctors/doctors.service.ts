import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const searchDoctorsSchema = z
  .object({
    specialty: z.string().optional(),
    city: z.string().optional(),
    language: z.string().optional(),
  })
  .strict();

export type SearchDoctorsInput = z.infer<typeof searchDoctorsSchema>;

export async function searchDoctors(input: SearchDoctorsInput) {
  const where: Record<string, unknown> = {};

  if (input.specialty) {
    where.specialty = { contains: input.specialty, mode: 'insensitive' };
  }

  if (input.city) {
    where.city = { contains: input.city, mode: 'insensitive' };
  }

  // Normalize language to title case for array matching
  if (input.language) {
    const normalized =
      input.language.charAt(0).toUpperCase() +
      input.language.slice(1).toLowerCase();
    where.languages = { has: normalized };
  }

  return prisma.doctor.findMany({
    where,
    include: { hospital: { select: { name: true, nameAr: true } } },
    take: 10,
  });
}

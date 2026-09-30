import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const searchHospitalsSchema = z
  .object({
    city: z.string().optional(),
    specialty: z.string().optional(),
  })
  .strict();

export type SearchHospitalsInput = z.infer<typeof searchHospitalsSchema>;

export async function searchHospitals(input: SearchHospitalsInput) {
  const where: Record<string, unknown> = {};

  if (input.city) {
    where.city = { contains: input.city, mode: 'insensitive' };
  }

  // Normalize specialty to title case for array matching
  if (input.specialty) {
    const normalized =
      input.specialty.charAt(0).toUpperCase() +
      input.specialty.slice(1).toLowerCase();
    where.specialties = { has: normalized };
  }

  return prisma.hospital.findMany({
    where,
    include: {
      doctors: {
        select: { id: true, name: true, nameAr: true, specialty: true },
      },
    },
    take: 10,
  });
}

import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const providersRouter = Router();

const providerSubmissionSchema = z.object({
  hospitalName: z.string().min(2),
  doctorName: z.string().min(2),
  specialty: z.string().min(2),
  city: z.string().min(2),
  languages: z.array(z.string()).optional().default(['English', 'Arabic']),
  contactInfo: z.string().optional(),
});

providersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const input = providerSubmissionSchema.parse(req.body);

    // Mock provider submission - create hospital and doctor
    // In a real app, this might go to an approval queue
    const hospital = await prisma.hospital.create({
      data: {
        name: input.hospitalName,
        nameAr: input.hospitalName, // Fallback for prototype
        city: input.city,
        address: input.contactInfo || 'Pending Address',
        specialties: [input.specialty],
      },
    });

    const doctor = await prisma.doctor.create({
      data: {
        name: input.doctorName,
        nameAr: input.doctorName, // Fallback for prototype
        specialty: input.specialty,
        city: input.city,
        languages: input.languages,
        hospitalId: hospital.id,
      },
    });

    res.status(201).json({ success: true, message: 'Provider submitted successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: error.errors } });
      return;
    }
    console.error('[providers]', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to submit provider' } });
  }
});

providersRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { city, specialty, language } = req.query;
    const where: any = {};
    if (city) where.city = { contains: city as string, mode: 'insensitive' };
    if (specialty) where.specialty = { contains: specialty as string, mode: 'insensitive' };
    if (language) where.languages = { has: language as string };

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        hospital: {
          select: { name: true, nameAr: true, address: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ doctors });
  } catch (error) {
    console.error('[providers get]', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch providers' } });
  }
});

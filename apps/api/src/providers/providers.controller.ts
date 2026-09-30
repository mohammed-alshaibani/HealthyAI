import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { providerService } from './providers.service';
import { validateRequest } from '../shared/middleware/validate-request';

const NAME_REGEX = /^[a-zA-Z\u0600-\u06FF\s\-]{4,}$/;
const DOC_NAME_REGEX = /^([a-zA-Z\u0600-\u06FF\.]+\s+)+[a-zA-Z\u0600-\u06FF]+$/;
const CONTACT_REGEX = /^(((\+9665|05)[0-9]{8})|(9200[0-9]{5})|([^\s@]+@[^\s@]+\.[^\s@]+))$/;

const registerProviderSchema = z.object({
  hospitalName: z.string().regex(NAME_REGEX),
  doctorName: z.string().regex(DOC_NAME_REGEX),
  specialty: z.string(),
  city: z.string(),
  address: z.string().optional(),
  contactInfo: z.string().regex(CONTACT_REGEX)
}).strict();

export async function registerProvider(req: Request, res: Response, next: NextFunction) {
  try {
    // req.body is pre-validated by Zod middleware
    await providerService.registerProvider(req.body);
    
    res.status(201).json({ success: true, message: 'Provider registered successfully' });
  } catch (error) {
    throw error;
  }
}

export async function getProviders(req: Request, res: Response, next: NextFunction) {
  try {
    const { city, specialty, search } = req.query;
    
    const filters = {
      city: typeof city === 'string' ? city : undefined,
      specialty: typeof specialty === 'string' ? specialty : undefined,
      search: typeof search === 'string' ? search : undefined,
    };

    const doctors = await providerService.getProviders(filters);

    // Map to DTO format
    const doctorsDTO = doctors.map(doc => ({
      id: doc.id,
      name: doc.name,
      nameAr: doc.nameAr,
      specialty: doc.specialty,
      city: doc.city,
      languages: doc.languages,
      hospital: {
        name: doc.hospital.name,
        nameAr: doc.hospital.nameAr,
        address: doc.hospital.address || '',
        lat: doc.hospital.lat,
        lng: doc.hospital.lng,
        mapsUrl: `https://maps.google.com/?q=${doc.hospital.lat},${doc.hospital.lng}`
      }
    }));

    res.json({ doctors: doctorsDTO });
  } catch (error) {
    next(error);
  }
}

export const providersRouter = express.Router();
providersRouter.post('/', validateRequest(registerProviderSchema), registerProvider);
providersRouter.get('/', getProviders);

import { Router } from 'express';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { hospitals, doctors, addHospital, addDoctor } from '../lib/saudi-healthcare-data';
import { randomUUID } from 'crypto';

export const providersRouter = Router();

// 1. Hospital Name: min 4 chars, valid letters (Arabic/English)
const nameRegex = /^[a-zA-Z\u0600-\u06FF\s\-]+$/;
// 2. Doctor Name: min 4 chars, at least two words (or title + name)
const doctorNameRegex = /^([a-zA-Z\u0600-\u06FF\.]+\s+)+[a-zA-Z\u0600-\u06FF]+$/;
// 5. Contact: Saudi phone (05... or +9665... or 9200...) or Email
const contactRegex = /^(((\+9665|05)[0-9]{8})|(9200[0-9]{5})|([^\s@]+@[^\s@]+\.[^\s@]+))$/;

const providerSubmissionSchema = z.object({
  hospitalName: z.string().min(4, "Hospital name must be at least 4 characters").regex(nameRegex, "Hospital name must contain only Arabic/English letters"),
  doctorName: z.string().min(4, "Doctor name must be at least 4 characters").regex(doctorNameRegex, "Please enter a valid full name (e.g., Dr. Ahmed)"),
  specialty: z.enum(['Cardiology', 'Orthopedics', 'Dentistry', 'Pediatrics', 'Ophthalmology', 'Dermatology', 'Neurology', 'Internal Medicine', 'OB-GYN'], {
    errorMap: () => ({ message: "Please select a valid specialty" })
  }),
  city: z.enum(['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Makkah', 'Madinah', 'Abha'], {
    errorMap: () => ({ message: "Please select a valid Saudi city" })
  }),
  district: z.string().optional(),
  contactInfo: z.string().regex(contactRegex, "Please enter a valid Saudi phone number (05XXXXXXXX) or email address"),
});

providersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const input = providerSubmissionSchema.parse(req.body);

    const hospitalId = `h-new-${randomUUID()}`;
    addHospital({
      id: hospitalId,
      name: input.hospitalName,
      nameAr: input.hospitalName,
      city: input.city,
      district: input.district || '',
      districtAr: input.district || '',
      address: `${input.district ? input.district + ', ' : ''}${input.city}`,
      lat: 24.0, // Default for user submitted if no GPS
      lng: 45.0,
      mapsUrl: ''
    });

    addDoctor({
      id: `d-new-${randomUUID()}`,
      name: input.doctorName,
      nameAr: input.doctorName,
      specialty: input.specialty,
      city: input.city,
      languages: ['English', 'Arabic'],
      contactInfo: input.contactInfo,
      hospitalId: hospitalId
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
    const { city, specialty, language, search } = req.query;
    
    let filteredDoctors = doctors;

    if (city) {
      filteredDoctors = filteredDoctors.filter(d => d.city.toLowerCase() === (city as string).toLowerCase());
    }
    if (specialty) {
      filteredDoctors = filteredDoctors.filter(d => d.specialty.toLowerCase() === (specialty as string).toLowerCase());
    }
    if (language) {
      filteredDoctors = filteredDoctors.filter(d => d.languages.some(l => l.toLowerCase() === (language as string).toLowerCase()));
    }
    if (search) {
      const s = (search as string).toLowerCase();
      filteredDoctors = filteredDoctors.filter(d => {
        const h = hospitals.find(h => h.id === d.hospitalId);
        return d.name.toLowerCase().includes(s) || 
               (d.nameAr && d.nameAr.includes(s)) ||
               (h && h.name.toLowerCase().includes(s)) ||
               (h && h.nameAr && h.nameAr.includes(s)) ||
               (h && h.district && h.district.toLowerCase().includes(s)) ||
               (h && h.districtAr && h.districtAr.includes(s));
      });
    }

    // Map hospital data
    const result = filteredDoctors.map(doc => {
      const h = hospitals.find(h => h.id === doc.hospitalId)!;
      return {
        ...doc,
        hospital: {
          name: h.name,
          nameAr: h.nameAr,
          district: h.district,
          districtAr: h.districtAr,
          address: h.address,
          lat: h.lat,
          lng: h.lng,
          mapsUrl: h.mapsUrl
        }
      };
    });

    res.json({ doctors: result });
  } catch (error) {
    console.error('[providers get]', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch providers' } });
  }
});

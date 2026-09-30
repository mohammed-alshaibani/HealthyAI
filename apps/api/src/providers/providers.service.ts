import { prisma } from '../lib/prisma';
import { DatabaseError } from '../shared/errors';

export interface ProviderRegistrationDTO {
  hospitalName: string;
  doctorName: string;
  specialty: string;
  city: string;
  address?: string;
  contactInfo: string;
}

export class ProviderService {
  /**
   * Registers a new provider (hospital + doctor).
   * Checks for existing hospitals by name and city before creating a new one.
   */
  async registerProvider(data: ProviderRegistrationDTO) {
    try {
      // 1. Check if hospital already exists
      let hospital = await prisma.hospital.findFirst({
        where: {
          name: { equals: data.hospitalName, mode: 'insensitive' },
          city: { equals: data.city, mode: 'insensitive' }
        }
      });

      // 2. Create hospital if it doesn't exist
      if (!hospital) {
        hospital = await prisma.hospital.create({
          data: {
            name: data.hospitalName,
            nameAr: data.hospitalName,
            city: data.city,
            address: data.address || '',
            lat: null,
            lng: null,
            specialties: [data.specialty],
          }
        });
      } else {
        // Update specialties if new
        if (!hospital.specialties.includes(data.specialty)) {
          await prisma.hospital.update({
            where: { id: hospital.id },
            data: { specialties: { push: data.specialty } }
          });
        }
      }

      // 3. Check if doctor already exists at this hospital
      let doctor = await prisma.doctor.findFirst({
        where: {
          name: { equals: data.doctorName, mode: 'insensitive' },
          hospitalId: hospital.id,
          specialty: data.specialty
        }
      });

      // 4. Create doctor if they don't exist
      if (!doctor) {
        doctor = await prisma.doctor.create({
          data: {
            name: data.doctorName,
            nameAr: data.doctorName,
            specialty: data.specialty,
            city: data.city,
            languages: ['Arabic', 'English'], // Default
            hospitalId: hospital.id
          }
        });
      }

      return { hospital, doctor };
    } catch (error) {
      console.error('[ProviderService] Failed to register:', error);
      throw new DatabaseError('Failed to register provider in database');
    }
  }

  /**
   * Fetches doctors with optional filtering.
   */
  async getProviders(filters: { city?: string; specialty?: string; search?: string }) {
    try {
      const { city, specialty, search } = filters;
      
      const doctors = await prisma.doctor.findMany({
        where: {
          ...(city && { city: { equals: city, mode: 'insensitive' } }),
          ...(specialty && { specialty: { equals: specialty, mode: 'insensitive' } }),
          ...(search && {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { nameAr: { contains: search, mode: 'insensitive' } },
              { hospital: { name: { contains: search, mode: 'insensitive' } } },
              { hospital: { address: { contains: search, mode: 'insensitive' } } }
            ]
          })
        },
        include: { hospital: true },
        take: 50
      });
      
      return doctors;
    } catch (error) {
      console.error('[ProviderService] Failed to fetch providers:', error);
      throw new DatabaseError('Failed to fetch providers');
    }
  }
}

export const providerService = new ProviderService();

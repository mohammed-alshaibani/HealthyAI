import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchDoctors } from '../apps/api/src/doctors/doctors.service';
import { searchHospitals } from '../apps/api/src/hospitals/hospitals.service';
import { prisma } from '../apps/api/src/lib/prisma';

vi.mock('../apps/api/src/lib/prisma', () => ({
  prisma: {
    doctor: {
      findMany: vi.fn(),
    },
    hospital: {
      findMany: vi.fn(),
    },
  },
}));

describe('Database Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchDoctors', () => {
    it('should query doctors by specialty case-insensitively', async () => {
      const mockData = [{ id: '1', specialty: 'Cardiology', hospital: { name: 'Test' } }];
      vi.mocked(prisma.doctor.findMany).mockResolvedValue(mockData as any);

      const results = await searchDoctors({ specialty: 'cardiology' });
      
      expect(prisma.doctor.findMany).toHaveBeenCalledWith({
        where: { specialty: { contains: 'cardiology', mode: 'insensitive' } },
        include: { hospital: { select: { name: true, nameAr: true } } },
        take: 10,
      });
      expect(results).toEqual(mockData);
    });

    it('should return empty array and not hallucinate for unknown providers', async () => {
      vi.mocked(prisma.doctor.findMany).mockResolvedValue([]);

      const results = await searchDoctors({ specialty: 'Quantum Healing' });
      
      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(0);
    });
  });

  describe('searchHospitals', () => {
    it('should query hospitals by city', async () => {
      const mockData = [{ id: '1', city: 'Riyadh', doctors: [] }];
      vi.mocked(prisma.hospital.findMany).mockResolvedValue(mockData as any);

      const results = await searchHospitals({ city: 'Riyadh' });
      
      expect(prisma.hospital.findMany).toHaveBeenCalledWith({
        where: { city: { contains: 'Riyadh', mode: 'insensitive' } },
        include: { doctors: { select: { id: true, name: true, nameAr: true, specialty: true } } },
        take: 10,
      });
      expect(results).toEqual(mockData);
    });

    it('should return empty array for non-existent hospital cities', async () => {
      vi.mocked(prisma.hospital.findMany).mockResolvedValue([]);

      const results = await searchHospitals({ city: 'Atlantis' });
      
      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(0);
    });
  });
});

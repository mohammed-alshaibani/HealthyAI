import { prisma } from '../lib/prisma';
import { buildNameSearchFilter, buildContainsFilter, normalizeArrayFilter, normalizeSpecialty, DEFAULT_SEARCH_LIMIT } from '../shared/db-utils';
import { getDistanceKm, getNearestCity } from '../shared/geo';
import { FALLBACK_HOSPITALS, FALLBACK_DOCTORS } from '../shared/fallback-data';

export interface SearchHospitalsInput {
  city?: string;
  specialty?: string;
  name?: string;
  lat?: number;
  lng?: number;
}

export async function searchHospitals(input: SearchHospitalsInput) {
  const searchCity = input.city || (input.lat !== undefined && input.lng !== undefined ? getNearestCity(input.lat, input.lng) : undefined);

  let hospitals: any[] = [];
  try {
    const where: Record<string, unknown> = {};

    if (input.name) {
      Object.assign(where, buildNameSearchFilter(input.name));
    }

    if (searchCity) {
      where.city = buildContainsFilter(searchCity);
    }

    if (input.specialty) {
      where.specialties = normalizeArrayFilter(normalizeSpecialty(input.specialty));
    }

    hospitals = await prisma.hospital.findMany({
      where,
      include: {
        doctors: {
          select: { id: true, name: true, nameAr: true, specialty: true },
        },
      },
      take: DEFAULT_SEARCH_LIMIT,
    });
  } catch {
    console.warn('[searchHospitals] DB unavailable, using fallback dataset');
    hospitals = [...FALLBACK_HOSPITALS].map(h => ({
      ...h,
      doctors: FALLBACK_DOCTORS.filter(d => d.hospitalId === h.id)
    }));
    if (input.name) {
      hospitals = hospitals.filter(h => h.name.toLowerCase().includes(input.name!.toLowerCase()) || h.nameAr.includes(input.name!));
    }
    if (searchCity) {
      hospitals = hospitals.filter(h => h.city.toLowerCase() === searchCity.toLowerCase());
    }
    if (input.specialty) {
      const spec = normalizeSpecialty(input.specialty).toLowerCase();
      hospitals = hospitals.filter(h => h.specialties.some((s: string) => s.toLowerCase().includes(spec)));
    }
    hospitals = hospitals.slice(0, DEFAULT_SEARCH_LIMIT);
  }

  if (input.lat !== undefined && input.lng !== undefined) {
    const userLat = input.lat;
    const userLng = input.lng;
    return hospitals
      .map((h) => {
        const distanceKm =
          h.lat != null && h.lng != null
            ? Number(getDistanceKm(userLat, userLng, h.lat, h.lng).toFixed(1))
            : undefined;
        return {
          id: h.id,
          name: h.name,
          nameAr: h.nameAr,
          city: h.city,
          address: h.address,
          specialties: h.specialties,
          doctors: h.doctors,
          distanceKm,
        };
      })
      .sort((a, b) => {
        if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
          return a.distanceKm - b.distanceKm;
        }
        return 0;
      });
  }

  return hospitals;
}

export async function getAllHospitalsForLocation() {
  try {
    return await prisma.hospital.findMany({
      select: {
        id: true,
        name: true,
        nameAr: true,
        city: true,
        address: true,
        specialties: true,
        lat: true,
        lng: true,
      },
    });
  } catch {
    console.warn('[getAllHospitalsForLocation] DB unavailable, using fallback dataset');
    return FALLBACK_HOSPITALS;
  }
}

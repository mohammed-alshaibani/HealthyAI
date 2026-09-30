import { prisma } from '../lib/prisma';
import { buildNameSearchFilter, buildContainsFilter, normalizeArrayFilter, normalizeSpecialty, DEFAULT_SEARCH_LIMIT } from '../shared/db-utils';
import { getDistanceKm, getNearestCity } from '../shared/geo';
import { FALLBACK_DOCTORS } from '../shared/fallback-data';

export interface SearchDoctorsInput {
  specialty?: string;
  city?: string;
  language?: string;
  name?: string;
  lat?: number;
  lng?: number;
}

export async function searchDoctors(input: SearchDoctorsInput) {
  const searchCity = input.city || (input.lat !== undefined && input.lng !== undefined ? getNearestCity(input.lat, input.lng) : undefined);

  let doctors: any[] = [];
  try {
    const where: Record<string, unknown> = {};

    if (input.name) {
      Object.assign(where, buildNameSearchFilter(input.name));
    }

    if (input.specialty) {
      where.specialty = buildContainsFilter(normalizeSpecialty(input.specialty));
    }

    if (searchCity) {
      where.city = buildContainsFilter(searchCity);
    }

    if (input.language) {
      where.languages = normalizeArrayFilter(input.language);
    }

    doctors = await prisma.doctor.findMany({
      where,
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            address: true,
            city: true,
            lat: true,
            lng: true,
          },
        },
      },
      take: DEFAULT_SEARCH_LIMIT,
    });
  } catch {
    console.warn('[searchDoctors] DB unavailable, using fallback dataset');
    doctors = [...FALLBACK_DOCTORS];
    if (input.name) {
      doctors = doctors.filter(d => d.name.toLowerCase().includes(input.name!.toLowerCase()) || d.nameAr.includes(input.name!));
    }
    if (input.specialty) {
      const spec = normalizeSpecialty(input.specialty).toLowerCase();
      doctors = doctors.filter(d => d.specialty.toLowerCase().includes(spec));
    }
    if (searchCity) {
      doctors = doctors.filter(d => d.city.toLowerCase() === searchCity.toLowerCase());
    }
    if (input.language) {
      doctors = doctors.filter(d => d.languages.some((l: string) => l.toLowerCase() === input.language!.toLowerCase()));
    }
    doctors = doctors.slice(0, DEFAULT_SEARCH_LIMIT);
  }

  if (input.lat !== undefined && input.lng !== undefined) {
    const userLat = input.lat;
    const userLng = input.lng;
    return doctors
      .map((doc) => {
        const docLat = doc.hospital?.lat;
        const docLng = doc.hospital?.lng;
        const distanceKm =
          docLat != null && docLng != null
            ? Number(getDistanceKm(userLat, userLng, docLat, docLng).toFixed(1))
            : undefined;
        return {
          id: doc.id,
          name: doc.name,
          nameAr: doc.nameAr,
          specialty: doc.specialty,
          city: doc.city,
          languages: doc.languages,
          hospital: doc.hospital
            ? {
                name: doc.hospital.name,
                nameAr: doc.hospital.nameAr,
                address: doc.hospital.address,
                city: doc.hospital.city,
              }
            : null,
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

  return doctors;
}

export async function getAllDoctorsForLocation() {
  try {
    return await prisma.doctor.findMany({
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            address: true,
            city: true,
            lat: true,
            lng: true,
          },
        },
      },
    });
  } catch {
    console.warn('[getAllDoctorsForLocation] DB unavailable, using fallback dataset');
    return FALLBACK_DOCTORS;
  }
}

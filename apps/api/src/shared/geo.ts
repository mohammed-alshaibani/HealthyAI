/** Haversine formula — returns distance in kilometres. */
export function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const SAUDI_CITIES = [
  { name: 'Riyadh', nameAr: 'الرياض', lat: 24.7136, lng: 46.6753 },
  { name: 'Jeddah', nameAr: 'جدة', lat: 21.5433, lng: 39.1728 },
  { name: 'Dammam', nameAr: 'الدمام', lat: 26.4207, lng: 50.0888 },
  { name: 'Khobar', nameAr: 'الخبر', lat: 26.2172, lng: 50.1971 },
  { name: 'Makkah', nameAr: 'مكة', lat: 21.3891, lng: 39.8579 },
  { name: 'Madinah', nameAr: 'المدينة المنورة', lat: 24.4672, lng: 39.6112 },
  { name: 'Abha', nameAr: 'أبها', lat: 18.2164, lng: 42.5053 }
];

export function getNearestCity(lat: number, lng: number): string {
  let minDistance = Infinity;
  let nearestCity = 'Riyadh'; // default
  for (const city of SAUDI_CITIES) {
    const d = getDistanceKm(lat, lng, city.lat, city.lng);
    if (d < minDistance) {
      minDistance = d;
      nearestCity = city.name;
    }
  }
  return nearestCity;
}

export interface ResolvedGeoLocation {
  cityEn: string;
  cityAr: string;
  districtEn: string;
  districtAr: string;
}

const SAUDI_DISTRICTS = [
  { nameEn: 'Diriyah', nameAr: 'الدرعية', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.7562, lng: 46.5394 },
  { nameEn: 'Al Nakheel', nameAr: 'حي النخيل', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.7469, lng: 46.6358 },
  { nameEn: 'Al Sahafa', nameAr: 'حي الصحافة', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.7963, lng: 46.6327 },
  { nameEn: 'Al Rabie', nameAr: 'حي الربيع', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.8058, lng: 46.6578 },
  { nameEn: 'Al Malqa', nameAr: 'حي الملقا', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.8100, lng: 46.6100 },
  { nameEn: 'Al Olaya', nameAr: 'حي العليا', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.6900, lng: 46.6850 },
  { nameEn: 'Al Sulimaniyah', nameAr: 'حي السليمانية', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.6894, lng: 46.7042 },
  { nameEn: 'Al Rahmaniyah', nameAr: 'حي الرحمانية', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.7069, lng: 46.6631 },
  { nameEn: 'Al Mathar', nameAr: 'حي المعذر', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.6705, lng: 46.6787 },
  { nameEn: 'Al Rayyan', nameAr: 'حي الريان', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.7145, lng: 46.7728 },
  { nameEn: 'Al Gharnatah', nameAr: 'حي غرناطة', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.7831, lng: 46.7380 },
  { nameEn: 'Al Suwaidi', nameAr: 'حي السويدي', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.5824, lng: 46.6714 },
  { nameEn: 'Namar', nameAr: 'حي نمار', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.5683, lng: 46.6872 },
  { nameEn: 'Al Rawdah', nameAr: 'حي الروضة', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.7400, lng: 46.7800 },
  { nameEn: 'Al Narjis', nameAr: 'حي النرجس', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.8400, lng: 46.6400 },
  { nameEn: 'Al Yasmin', nameAr: 'حي الياسمين', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.8200, lng: 46.6300 },
  { nameEn: 'Al Aqiq', nameAr: 'حي العقيق', cityEn: 'Riyadh', cityAr: 'الرياض', lat: 24.7750, lng: 46.6350 },
  // Jeddah
  { nameEn: 'Al Hamra', nameAr: 'حي الحمراء', cityEn: 'Jeddah', cityAr: 'جدة', lat: 21.5200, lng: 39.1600 },
  { nameEn: 'Al Andalus', nameAr: 'حي الأندلس', cityEn: 'Jeddah', cityAr: 'جدة', lat: 21.5262, lng: 39.1706 },
  { nameEn: 'Al Jamiah', nameAr: 'حي الجامعة', cityEn: 'Jeddah', cityAr: 'جدة', lat: 21.4988, lng: 39.2274 },
  // Dammam
  { nameEn: 'Al Muraikabat', nameAr: 'حي المريكات', cityEn: 'Dammam', cityAr: 'الدمام', lat: 26.3541, lng: 50.1872 },
];

export function getNearestDistrictFallback(lat: number, lng: number): ResolvedGeoLocation {
  let minDistance = Infinity;
  let matched = SAUDI_DISTRICTS[0];

  for (const item of SAUDI_DISTRICTS) {
    const d = getDistanceKm(lat, lng, item.lat, item.lng);
    if (d < minDistance) {
      minDistance = d;
      matched = item;
    }
  }

  return {
    cityEn: matched.cityEn,
    cityAr: matched.cityAr,
    districtEn: matched.nameEn,
    districtAr: matched.nameAr,
  };
}

export async function reverseGeocode(lat: number, lng: number): Promise<ResolvedGeoLocation> {
  const fallback = getNearestDistrictFallback(lat, lng);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ar`, {
      headers: {
        'User-Agent': 'HealthyAI-App/1.0 (contact@healthyai.sa)',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as any;
      const addr = data.address || {};
      const rawDistrict = addr.suburb || addr.neighbourhood || addr.quarter || addr.town || addr.city_district || addr.village || addr.county;
      const rawCity = addr.city || addr.town || addr.state || addr.municipality;

      if (rawDistrict) {
        return {
          cityEn: fallback.cityEn,
          cityAr: rawCity || fallback.cityAr,
          districtEn: fallback.districtEn,
          districtAr: rawDistrict.startsWith('حي') ? rawDistrict : `حي ${rawDistrict}`,
        };
      }
    }
  } catch {
    // Return fallback on network error or timeout
  }

  return fallback;
}

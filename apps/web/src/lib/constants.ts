export const SPECIALTIES = [
  'Cardiology', 'Orthopedics', 'Dentistry', 'Pediatrics',
  'Ophthalmology', 'Dermatology', 'Neurology', 'General Surgery',
  'Oncology', 'Internal Medicine', 'OB-GYN',
] as const;

export const SPECIALTIES_AR: Record<string, string> = {
  'Cardiology': 'طب القلب',
  'Orthopedics': 'جراحة العظام',
  'Dentistry': 'طب الأسنان',
  'Pediatrics': 'طب الأطفال',
  'Ophthalmology': 'طب العيون',
  'Dermatology': 'الجلدية',
  'Neurology': 'المخ والأعصاب',
  'Internal Medicine': 'الباطنية',
  'OB-GYN': 'النساء والولادة',
  'General Surgery': 'الجراحة العامة',
  'Oncology': 'الأورام',
};

export const CITIES = [
  'Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Makkah', 'Madinah', 'Abha',
] as const;

export const CITIES_AR: Record<string, string> = {
  'Riyadh': 'الرياض', 'Jeddah': 'جدة', 'Dammam': 'الدمام', 'Khobar': 'الخبر',
  'Makkah': 'مكة المكرمة', 'Madinah': 'المدينة المنورة', 'Abha': 'أبها'
};

/** Haversine formula — returns distance in kilometres. */
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}

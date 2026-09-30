export const DEFAULT_SEARCH_LIMIT = 10;

export function buildNameSearchFilter(name: string) {
  return {
    OR: [
      { name: { contains: name, mode: 'insensitive' } },
      { nameAr: { contains: name, mode: 'insensitive' } },
    ],
  };
}

export function buildContainsFilter(value: string) {
  return { contains: value, mode: 'insensitive' };
}

export function normalizeArrayFilter(value: string) {
  const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  return { has: normalized };
}

export function normalizeSpecialty(specialty: string): string {
  if (!specialty) return specialty;
  
  const normalized = specialty.toLowerCase().trim();
  
  const mapping: Record<string, string> = {
    'نساء وولادة': 'OB-GYN',
    'نسائية وتوليد': 'OB-GYN',
    'نساء وتوليد': 'OB-GYN',
    'امراض نساء': 'OB-GYN',
    'ob/gyn': 'OB-GYN',
    'obstetrics and gynecology': 'OB-GYN',
    'gynecology': 'OB-GYN',
    'obstetrics': 'OB-GYN',
    'طب القلب': 'Cardiology',
    'قلب': 'Cardiology',
    'جراحة العظام': 'Orthopedics',
    'عظام': 'Orthopedics',
    'طب الأسنان': 'Dentistry',
    'اسنان': 'Dentistry',
    'أسنان': 'Dentistry',
    'طب الأطفال': 'Pediatrics',
    'اطفال': 'Pediatrics',
    'أطفال': 'Pediatrics',
    'طب العيون': 'Ophthalmology',
    'عيون': 'Ophthalmology',
    'الجلدية': 'Dermatology',
    'جلدية': 'Dermatology',
    'المخ والأعصاب': 'Neurology',
    'مخ واعصاب': 'Neurology',
    'الباطنية': 'Internal Medicine',
    'باطنية': 'Internal Medicine',
    'الجراحة العامة': 'General Surgery',
    'جراحة عامة': 'General Surgery',
    'الأورام': 'Oncology',
    'اورام': 'Oncology'
  };

  return mapping[normalized] || specialty;
}

export type HospitalInfo = {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  district: string;
  districtAr: string;
  address: string;
  lat: number;
  lng: number;
  mapsUrl: string;
};

export type DoctorInfo = {
  id: string;
  name: string;
  nameAr: string;
  specialty: string;
  city: string;
  languages: string[];
  contactInfo: string;
  hospitalId: string;
};

export const hospitals: HospitalInfo[] = [
  // Riyadh
  {
    id: 'h-1',
    name: 'Dr. Sulaiman Al Habib Hospital - Al Takhassusi & Al Olaya',
    nameAr: 'مستشفى د. سليمان الحبيب - التخصصي والعليا',
    city: 'Riyadh',
    district: 'Al Olaya',
    districtAr: 'العليا',
    address: 'King Fahd Road, Al Olaya, Riyadh',
    lat: 24.6972,
    lng: 46.6836,
    mapsUrl: 'https://maps.google.com/?q=24.6972,46.6836'
  },
  {
    id: 'h-2',
    name: 'King Faisal Specialist Hospital & Research Centre',
    nameAr: 'مستشفى الملك فيصل التخصصي - المعذر',
    city: 'Riyadh',
    district: 'Al Mathar Ash Shamali',
    districtAr: 'المعذر الشمالي',
    address: 'Al Mathar Ash Shamali, Riyadh 11564',
    lat: 24.6726,
    lng: 46.6784,
    mapsUrl: 'https://maps.google.com/?q=24.6726,46.6784'
  },
  {
    id: 'h-3',
    name: 'Mouwasat Hospital - Riyadh',
    nameAr: 'مستشفى المواساة - غرناطة',
    city: 'Riyadh',
    district: 'Granada',
    districtAr: 'غرناطة',
    address: 'Granada, Riyadh',
    lat: 24.8016,
    lng: 46.7329,
    mapsUrl: 'https://maps.google.com/?q=24.8016,46.7329'
  },
  {
    id: 'h-4',
    name: 'Saudi German Hospital - Riyadh',
    nameAr: 'المستشفى السعودي الألماني - الصحافة',
    city: 'Riyadh',
    district: 'Al Sahafah',
    districtAr: 'الصحافة',
    address: 'King Fahd Road, Al Sahafah, Riyadh',
    lat: 24.8080,
    lng: 46.6190,
    mapsUrl: 'https://maps.google.com/?q=24.8080,46.6190'
  },
  // Jeddah
  {
    id: 'h-5',
    name: 'International Medical Center - IMC',
    nameAr: 'المركز الطبي الدولي - حائل',
    city: 'Jeddah',
    district: 'Al Hail',
    districtAr: 'حائل',
    address: 'Hail Street, Ruwais, Jeddah',
    lat: 21.5230,
    lng: 39.1760,
    mapsUrl: 'https://maps.google.com/?q=21.5230,39.1760'
  },
  {
    id: 'h-6',
    name: 'Dr. Soliman Fakeeh Hospital',
    nameAr: 'مستشفى د. سليمان فقيه - الحمراء',
    city: 'Jeddah',
    district: 'Al Hamra',
    districtAr: 'الحمراء',
    address: 'Palestine Street, Al Hamra, Jeddah',
    lat: 21.5262,
    lng: 39.1706,
    mapsUrl: 'https://maps.google.com/?q=21.5262,39.1706'
  },
  {
    id: 'h-7',
    name: 'Dr. Sulaiman Al Habib Hospital - Al Faihaa',
    nameAr: 'مستشفى د. سليمان الحبيب - الفيحاء',
    city: 'Jeddah',
    district: 'Al Faihaa',
    districtAr: 'الفيحاء',
    address: 'King Abdullah Road, Al Faihaa, Jeddah',
    lat: 21.4988,
    lng: 39.2274,
    mapsUrl: 'https://maps.google.com/?q=21.4988,39.2274'
  },
  // Dammam & Khobar
  {
    id: 'h-8',
    name: 'Almana General Hospital',
    nameAr: 'مستشفى المانع العام',
    city: 'Khobar',
    district: 'Al Khobar Al Shamalia',
    districtAr: 'الخبر الشمالية',
    address: 'King Abdulaziz St, Khobar',
    lat: 26.2941,
    lng: 50.2079,
    mapsUrl: 'https://maps.google.com/?q=26.2941,50.2079'
  },
  {
    id: 'h-9',
    name: 'Dr. Sulaiman Al Habib Hospital - Al Khobar',
    nameAr: 'مستشفى د. سليمان الحبيب - الخبر',
    city: 'Khobar',
    district: 'Al Rakkah',
    districtAr: 'الراكة',
    address: 'King Fahd Road, Al Rakkah, Khobar',
    lat: 26.3541,
    lng: 50.1872,
    mapsUrl: 'https://maps.google.com/?q=26.3541,50.1872'
  },
  // Makkah & Madinah
  {
    id: 'h-10',
    name: 'Saudi German Hospital - Makkah',
    nameAr: 'المستشفى السعودي الألماني - مكة المكرمة',
    city: 'Makkah',
    district: 'Al Shoqiyah',
    districtAr: 'الشوقية',
    address: 'Al Shoqiyah, Makkah',
    lat: 21.3702,
    lng: 39.7997,
    mapsUrl: 'https://maps.google.com/?q=21.3702,39.7997'
  },
  {
    id: 'h-11',
    name: 'Saudi German Hospital - Madinah',
    nameAr: 'المستشفى السعودي الألماني - المدينة المنورة',
    city: 'Madinah',
    district: 'Al Jumuah',
    districtAr: 'الجمعة',
    address: 'Prince Naif Road, Madinah',
    lat: 24.4754,
    lng: 39.5855,
    mapsUrl: 'https://maps.google.com/?q=24.4754,39.5855'
  }
];

export const doctors: DoctorInfo[] = [
  // Riyadh Doctors
  {
    id: 'd-1',
    name: 'Dr. Fahad Al-Mutairi',
    nameAr: 'د. فهد المطيري',
    specialty: 'Cardiology',
    city: 'Riyadh',
    languages: ['English', 'Arabic'],
    contactInfo: '0501234567',
    hospitalId: 'h-1'
  },
  {
    id: 'd-2',
    name: 'Dr. Noura Al-Saud',
    nameAr: 'د. نورة آل سعود',
    specialty: 'Orthopedics',
    city: 'Riyadh',
    languages: ['English', 'Arabic'],
    contactInfo: '920012345',
    hospitalId: 'h-1'
  },
  {
    id: 'd-3',
    name: 'Dr. Mohammed Al-Rajhi',
    nameAr: 'د. محمد الراجحي',
    specialty: 'Oncology',
    city: 'Riyadh',
    languages: ['English', 'Arabic'],
    contactInfo: '0559876543',
    hospitalId: 'h-2'
  },
  {
    id: 'd-4',
    name: 'Dr. Sarah Al-Shehri',
    nameAr: 'د. سارة الشهري',
    specialty: 'Dentistry',
    city: 'Riyadh',
    languages: ['English', 'Arabic'],
    contactInfo: '920054321',
    hospitalId: 'h-3'
  },
  {
    id: 'd-5',
    name: 'Dr. Abdullah Al-Otaibi',
    nameAr: 'د. عبدالله العتيبي',
    specialty: 'Neurology',
    city: 'Riyadh',
    languages: ['English', 'Arabic'],
    contactInfo: '0541112233',
    hospitalId: 'h-4'
  },
  // Jeddah Doctors
  {
    id: 'd-6',
    name: 'Dr. Reem Al-Ghamdi',
    nameAr: 'د. ريم الغامدي',
    specialty: 'Pediatrics',
    city: 'Jeddah',
    languages: ['English', 'Arabic'],
    contactInfo: '0562223344',
    hospitalId: 'h-5'
  },
  {
    id: 'd-7',
    name: 'Dr. Khalid Al-Johani',
    nameAr: 'د. خالد الجهني',
    specialty: 'Cardiology',
    city: 'Jeddah',
    languages: ['English', 'Arabic'],
    contactInfo: '920099887',
    hospitalId: 'h-6'
  },
  {
    id: 'd-8',
    name: 'Dr. Amal Fakeeh',
    nameAr: 'د. أمل فقيه',
    specialty: 'Dermatology',
    city: 'Jeddah',
    languages: ['English', 'Arabic', 'French'],
    contactInfo: '0503334455',
    hospitalId: 'h-6'
  },
  {
    id: 'd-9',
    name: 'Dr. Omar Bakhsh',
    nameAr: 'د. عمر بخش',
    specialty: 'Ophthalmology',
    city: 'Jeddah',
    languages: ['English', 'Arabic'],
    contactInfo: '920044556',
    hospitalId: 'h-7'
  },
  // Khobar/Dammam Doctors
  {
    id: 'd-10',
    name: 'Dr. Hassan Al-Dossari',
    nameAr: 'د. حسن الدوسري',
    specialty: 'Internal Medicine',
    city: 'Khobar',
    languages: ['English', 'Arabic'],
    contactInfo: '0555556677',
    hospitalId: 'h-8'
  },
  {
    id: 'd-11',
    name: 'Dr. Laila Al-Qahtani',
    nameAr: 'د. ليلى القحطاني',
    specialty: 'OB-GYN',
    city: 'Khobar',
    languages: ['English', 'Arabic'],
    contactInfo: '920066778',
    hospitalId: 'h-9'
  },
  // Makkah & Madinah Doctors
  {
    id: 'd-12',
    name: 'Dr. Sultan Al-Harbi',
    nameAr: 'د. سلطان الحربي',
    specialty: 'Orthopedics',
    city: 'Makkah',
    languages: ['English', 'Arabic'],
    contactInfo: '0567778899',
    hospitalId: 'h-10'
  },
  {
    id: 'd-13',
    name: 'Dr. Yasser Al-Hazmi',
    nameAr: 'د. ياسر الحازمي',
    specialty: 'Cardiology',
    city: 'Madinah',
    languages: ['English', 'Arabic'],
    contactInfo: '920077889',
    hospitalId: 'h-11'
  }
];

// Helper to push new entries at runtime
export function addHospital(hospital: HospitalInfo) {
  hospitals.push(hospital);
}

export function addDoctor(doctor: DoctorInfo) {
  doctors.push(doctor);
}

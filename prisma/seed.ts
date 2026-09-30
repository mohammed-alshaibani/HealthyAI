import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.doctor.deleteMany();
  await prisma.hospital.deleteMany();

  // North & North-West Riyadh / Diriyah
  const diriyah = await prisma.hospital.create({
    data: {
      name: 'Diriyah Hospital',
      nameAr: 'مستشفى الدرعية',
      city: 'Riyadh',
      specialties: ['General Surgery', 'Pediatrics', 'Orthopedics', 'Ophthalmology'],
      address: 'Diriyah, Riyadh 13711',
      lat: 24.7562,
      lng: 46.5394,
    },
  });

  const dallahNakheel = await prisma.hospital.create({
    data: {
      name: 'Dallah Hospital Al Nakheel',
      nameAr: 'مستشفى دله - النخيل',
      city: 'Riyadh',
      specialties: ['Cardiology', 'Orthopedics', 'Ophthalmology', 'Pediatrics'],
      address: 'Al Nakheel, Riyadh 12382',
      lat: 24.7469,
      lng: 46.6358,
    },
  });

  const habibSahafa = await prisma.hospital.create({
    data: {
      name: 'Dr. Sulaiman Al Habib Hospital Al Sahafa',
      nameAr: 'مستشفى د. سليمان الحبيب - الصحافة',
      city: 'Riyadh',
      specialties: ['Cardiology', 'Dermatology', 'Orthopedics', 'Neurology', 'Ophthalmology'],
      address: 'Al Sahafa, Riyadh 13321',
      lat: 24.7963,
      lng: 46.6327,
    },
  });

  const kingdomHosp = await prisma.hospital.create({
    data: {
      name: 'Kingdom Hospital',
      nameAr: 'مستشفى المملكة',
      city: 'Riyadh',
      specialties: ['Pediatrics', 'Ophthalmology', 'General Surgery', 'Cardiology'],
      address: 'Al Rabie, Riyadh 13316',
      lat: 24.8058,
      lng: 46.6578,
    },
  });

  const saudiGerman = await prisma.hospital.create({
    data: {
      name: 'Saudi German Hospital',
      nameAr: 'المستشفى السعودي الألماني',
      city: 'Riyadh',
      specialties: ['Orthopedics', 'Oncology', 'Neurology', 'Cardiology'],
      address: 'Al Sahafa, Riyadh 13321',
      lat: 24.7891,
      lng: 46.6186,
    },
  });

  // Central & West Riyadh
  const habibTakhassusi = await prisma.hospital.create({
    data: {
      name: 'Dr. Sulaiman Al Habib Al Takhassusi',
      nameAr: 'مستشفى د. سليمان الحبيب - التخصصي',
      city: 'Riyadh',
      specialties: ['Cardiology', 'Orthopedics', 'Dermatology', 'Ophthalmology'],
      address: 'Al Rahmaniyah, Riyadh 12344',
      lat: 24.7069,
      lng: 46.6631,
    },
  });

  const kfsh = await prisma.hospital.create({
    data: {
      name: 'King Faisal Specialist Hospital',
      nameAr: 'مستشفى الملك فيصل التخصصي',
      city: 'Riyadh',
      specialties: ['Oncology', 'Cardiology', 'Neurology', 'Orthopedics'],
      address: 'Al Mathar Ash Shamali, Riyadh 11564',
      lat: 24.6705,
      lng: 46.6787,
    },
  });

  const kfmc = await prisma.hospital.create({
    data: {
      name: 'King Fahad Medical City',
      nameAr: 'مدينة الملك فهد الطبية',
      city: 'Riyadh',
      specialties: ['Neurology', 'Orthopedics', 'Pediatrics', 'Oncology'],
      address: 'As Sulimaniyah, Riyadh 12231',
      lat: 24.6894,
      lng: 46.7042,
    },
  });

  // East & South Riyadh
  const habibRayyan = await prisma.hospital.create({
    data: {
      name: 'Dr. Sulaiman Al Habib Al Rayyan',
      nameAr: 'مستشفى د. سليمان الحبيب - الريان',
      city: 'Riyadh',
      specialties: ['Cardiology', 'Orthopedics', 'Pediatrics', 'General Surgery'],
      address: 'Al Rayyan, Riyadh 14212',
      lat: 24.7145,
      lng: 46.7728,
    },
  });

  const mouwasat = await prisma.hospital.create({
    data: {
      name: 'Mouwasat Hospital',
      nameAr: 'مستشفى المواساة',
      city: 'Riyadh',
      specialties: ['Orthopedics', 'Ophthalmology', 'Neurology', 'Cardiology'],
      address: 'Al Gharnatah, Riyadh 13241',
      lat: 24.7831,
      lng: 46.7380,
    },
  });

  const habibSuwaidi = await prisma.hospital.create({
    data: {
      name: 'Dr. Sulaiman Al Habib Al Suwaidi',
      nameAr: 'مستشفى د. سليمان الحبيب - السويدي',
      city: 'Riyadh',
      specialties: ['Pediatrics', 'Orthopedics', 'General Surgery', 'Cardiology'],
      address: 'Al Suwaidi, Riyadh 12791',
      lat: 24.5824,
      lng: 46.6714,
    },
  });

  const dallahNamar = await prisma.hospital.create({
    data: {
      name: 'Dallah Hospital Namar',
      nameAr: 'مستشفى دله - نمار',
      city: 'Riyadh',
      specialties: ['General Surgery', 'Orthopedics', 'Pediatrics', 'Dermatology'],
      address: 'Namar, Riyadh 14923',
      lat: 24.5683,
      lng: 46.6872,
    },
  });

  // Jeddah & Dammam
  const kauh = await prisma.hospital.create({
    data: {
      name: 'King Abdulaziz University Hospital',
      nameAr: 'مستشفى جامعة الملك عبدالعزيز',
      city: 'Jeddah',
      specialties: ['Cardiology', 'Dermatology', 'General Surgery', 'Ophthalmology'],
      address: 'Al Jamiah, Jeddah 21589',
      lat: 21.4988,
      lng: 39.2274,
    },
  });

  const kfghj = await prisma.hospital.create({
    data: {
      name: 'King Fahad General Hospital',
      nameAr: 'مستشفى الملك فهد العام',
      city: 'Jeddah',
      specialties: ['Orthopedics', 'Neurology', 'General Surgery'],
      address: 'Al Andalus, Jeddah 23325',
      lat: 21.5262,
      lng: 39.1706,
    },
  });

  const kfshd = await prisma.hospital.create({
    data: {
      name: 'King Fahad Specialist Hospital',
      nameAr: 'مستشفى الملك فهد التخصصي',
      city: 'Dammam',
      specialties: ['Cardiology', 'Oncology', 'Orthopedics', 'Pediatrics'],
      address: 'Al Muraikabat, Dammam 32253',
      lat: 26.3541,
      lng: 50.1872,
    },
  });

  await prisma.doctor.createMany({
    data: [
      // Diriyah Hospital Doctors
      {
        name: 'Dr. Saud Al-Diriyyah',
        nameAr: 'د. سعود الدرعية',
        specialty: 'Ophthalmology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: diriyah.id,
      },
      {
        name: 'Dr. Bandar Al-Otaibi',
        nameAr: 'د. بندر العتيبي',
        specialty: 'Orthopedics',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: diriyah.id,
      },

      // Dallah Nakheel Doctors
      {
        name: 'Dr. Tariq Al-Mansoor',
        nameAr: 'د. طارق المنصور',
        specialty: 'Ophthalmology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: dallahNakheel.id,
      },
      {
        name: 'Dr. Khaled Al-Ghamdi',
        nameAr: 'د. خالد الغامدي',
        specialty: 'Orthopedics',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: dallahNakheel.id,
      },

      // Habib Sahafa Doctors
      {
        name: 'Dr. Nora Al-Subaie',
        nameAr: 'د. نورة السبيعي',
        specialty: 'Ophthalmology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: habibSahafa.id,
      },
      {
        name: 'Dr. Abdullah Al-Shehri',
        nameAr: 'د. عبدالله الشهري',
        specialty: 'Dermatology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: habibSahafa.id,
      },

      // Kingdom Hospital Doctors
      {
        name: 'Dr. Reem Al-Kahlil',
        nameAr: 'د. ريم الخليل',
        specialty: 'Ophthalmology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: kingdomHosp.id,
      },
      {
        name: 'Dr. Sultan Al-Onazi',
        nameAr: 'د. سلطان العنزي',
        specialty: 'Pediatrics',
        city: 'Riyadh',
        languages: ['Arabic'],
        hospitalId: kingdomHosp.id,
      },

      // Saudi German Doctors
      {
        name: 'Dr. Majed Al-Zahrani',
        nameAr: 'د. ماجد الزهراني',
        specialty: 'Orthopedics',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: saudiGerman.id,
      },

      // Habib Takhassusi Doctors
      {
        name: 'Dr. Faisal Al-Shammari',
        nameAr: 'د. فيصل الشمري',
        specialty: 'Ophthalmology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: habibTakhassusi.id,
      },
      {
        name: 'Dr. Ahmed Al-Rashidi',
        nameAr: 'د. أحمد الرشيدي',
        specialty: 'Cardiology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: kfsh.id,
      },

      // KFMC Doctors
      {
        name: 'Dr. Mohammed Al-Qahtani',
        nameAr: 'د. محمد القحطاني',
        specialty: 'Orthopedics',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: kfmc.id,
      },

      // Habib Rayyan Doctors
      {
        name: 'Dr. Hisham Al-Dossari',
        nameAr: 'د. هشام الدوسري',
        specialty: 'Orthopedics',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: habibRayyan.id,
      },

      // Mouwasat Doctors
      {
        name: 'Dr. Wafa Al-Harbi',
        nameAr: 'د. وفاء الحربي',
        specialty: 'Ophthalmology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: mouwasat.id,
      },

      // Habib Suwaidi Doctors
      {
        name: 'Dr. Ibrahim Al-Saud',
        nameAr: 'د. إبراهيم السعود',
        specialty: 'General Surgery',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: habibSuwaidi.id,
      },

      // Dallah Namar Doctors
      {
        name: 'Dr. Yasser Al-Mutairi',
        nameAr: 'د. ياسر المطيري',
        specialty: 'Orthopedics',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: dallahNamar.id,
      },

      // Jeddah Doctors
      {
        name: 'Dr. Amal Al-Shehri',
        nameAr: 'د. أمل الشهري',
        specialty: 'Ophthalmology',
        city: 'Jeddah',
        languages: ['Arabic', 'English'],
        hospitalId: kauh.id,
      },
      {
        name: 'Dr. Khalid Al-Mutairi',
        nameAr: 'د. خالد المطيري',
        specialty: 'Cardiology',
        city: 'Jeddah',
        languages: ['Arabic'],
        hospitalId: kauh.id,
      },
      {
        name: 'Dr. Noura Al-Shammari',
        nameAr: 'د. نورة الشمري',
        specialty: 'General Surgery',
        city: 'Jeddah',
        languages: ['Arabic', 'English'],
        hospitalId: kfghj.id,
      },

      // Dammam Doctors
      {
        name: 'Dr. Ali Al-Ghamdi',
        nameAr: 'د. علي الغامدي',
        specialty: 'Orthopedics',
        city: 'Dammam',
        languages: ['Arabic', 'English'],
        hospitalId: kfshd.id,
      },
    ],
  });

  const count = await prisma.doctor.count();
  const hospCount = await prisma.hospital.count();
  console.log(`Successfully seeded ${count} doctors across ${hospCount} hospitals`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

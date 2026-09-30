import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.doctor.deleteMany();
  await prisma.hospital.deleteMany();

  const kfsh = await prisma.hospital.create({
    data: {
      name: 'King Faisal Specialist Hospital',
      nameAr: 'مستشفى الملك فيصل التخصصي',
      city: 'Riyadh',
      specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
      address: 'Al Mathar Ash Shamali, Riyadh 11564',
      lat: 24.6726,
      lng: 46.6784,
    },
  });

  const kamc = await prisma.hospital.create({
    data: {
      name: 'King Abdulaziz Medical City',
      nameAr: 'مدينة الملك عبدالعزيز الطبية',
      city: 'Riyadh',
      specialties: ['Cardiology', 'General Surgery', 'Pediatrics', 'Dermatology'],
      address: 'Al Rimayah, Riyadh 14611',
      lat: 24.7500,
      lng: 46.8500,
    },
  });

  const kfmc = await prisma.hospital.create({
    data: {
      name: 'King Fahad Medical City',
      nameAr: 'مدينة الملك فهد الطبية',
      city: 'Riyadh',
      specialties: ['Neurology', 'Orthopedics', 'Pediatrics', 'Oncology'],
      address: 'As Sulimaniyah, Riyadh 12231',
      lat: 24.6972,
      lng: 46.6836,
    },
  });

  const kauh = await prisma.hospital.create({
    data: {
      name: 'King Abdulaziz University Hospital',
      nameAr: 'مستشفى جامعة الملك عبدالعزيز',
      city: 'Jeddah',
      specialties: ['Cardiology', 'Dermatology', 'General Surgery', 'Pediatrics'],
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
      {
        name: 'Dr. Ahmed Al-Rashidi',
        nameAr: 'د. أحمد الرشيدي',
        specialty: 'Cardiology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: kfsh.id,
      },
      {
        name: 'Dr. Yousef Al-Ahmad',
        nameAr: 'د. يوسف الأحمد',
        specialty: 'Cardiology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: kfsh.id,
      },
      {
        name: 'Dr. Fatima Hassan',
        nameAr: 'د. فاطمة حسن',
        specialty: 'Dermatology',
        city: 'Riyadh',
        languages: ['Arabic'],
        hospitalId: kamc.id,
      },
      {
        name: 'Dr. Sarah Al-Dosari',
        nameAr: 'د. سارة الدوسري',
        specialty: 'Pediatrics',
        city: 'Riyadh',
        languages: ['Arabic'],
        hospitalId: kamc.id,
      },
      {
        name: 'Dr. Ibrahim Al-Saud',
        nameAr: 'د. إبراهيم السعود',
        specialty: 'General Surgery',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: kamc.id,
      },
      {
        name: 'Dr. Mohammed Al-Qahtani',
        nameAr: 'د. محمد القحطاني',
        specialty: 'Orthopedics',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: kfmc.id,
      },
      {
        name: 'Dr. Omar Al-Turki',
        nameAr: 'د. عمر التركي',
        specialty: 'Neurology',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: kfmc.id,
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
        name: 'Dr. Maha Al-Zahrani',
        nameAr: 'د. مها الزهراني',
        specialty: 'Dermatology',
        city: 'Jeddah',
        languages: ['Arabic', 'English'],
        hospitalId: kauh.id,
      },
      {
        name: 'Dr. Hana Al-Harbi',
        nameAr: 'د. هناء الحربي',
        specialty: 'Pediatrics',
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
      {
        name: 'Dr. Ali Al-Ghamdi',
        nameAr: 'د. علي الغامدي',
        specialty: 'Orthopedics',
        city: 'Dammam',
        languages: ['Arabic', 'English'],
        hospitalId: kfshd.id,
      },
      {
        name: 'Dr. Layla Al-Otaibi',
        nameAr: 'د. ليلى العتيبي',
        specialty: 'Oncology',
        city: 'Dammam',
        languages: ['Arabic'],
        hospitalId: kfshd.id,
      },
      {
        name: 'Dr. Tariq Al-Hussain',
        nameAr: 'د. طارق الحسين',
        specialty: 'Dentistry',
        city: 'Riyadh',
        languages: ['Arabic', 'English'],
        hospitalId: kfsh.id,
      },
      {
        name: 'Dr. Amal Al-Shehri',
        nameAr: 'د. أمل الشهري',
        specialty: 'Ophthalmology',
        city: 'Jeddah',
        languages: ['Arabic', 'English'],
        hospitalId: kauh.id,
      },
      {
        name: 'Dr. Faisal Al-Faisal',
        nameAr: 'د. فيصل الفيصل',
        specialty: 'Dentistry',
        city: 'Dammam',
        languages: ['Arabic', 'Hindi'],
        hospitalId: kfshd.id,
      }
    ],
  });

  const count = await prisma.doctor.count();
  console.log(`Seeded ${count} doctors across 6 hospitals`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

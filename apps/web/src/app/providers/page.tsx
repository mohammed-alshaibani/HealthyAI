'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeartPulse, ChevronLeft, ChevronRight, Search, MapPin, Building2, Globe2 } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';

type Doctor = {
  id: string;
  name: string;
  nameAr: string | null;
  specialty: string;
  city: string;
  languages: string[];
  hospital: {
    name: string;
    nameAr: string | null;
    address: string;
  };
};

export default function ProvidersPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [language, setLanguage] = useState('');

  const isAr = lang === 'ar';

  const t = {
    en: {
      title: 'Healthcare Providers',
      subtitle: 'Browse our trusted network of doctors and hospitals across Saudi Arabia.',
      home: 'Home',
      search: 'Search Providers',
      filters: {
        city: 'All Cities',
        specialty: 'All Specialties',
        language: 'All Languages'
      },
      doctor: 'Dr.',
      noResults: 'No providers found matching your criteria.'
    },
    ar: {
      title: 'مقدمو الرعاية الصحية',
      subtitle: 'تصفح شبكتنا الموثوقة من الأطباء والمستشفيات في جميع أنحاء المملكة.',
      home: 'الرئيسية',
      search: 'البحث عن الأطباء',
      filters: {
        city: 'جميع المدن',
        specialty: 'جميع التخصصات',
        language: 'جميع اللغات'
      },
      doctor: 'د.',
      noResults: 'لم يتم العثور على مقدمي خدمة يطابقون بحثك.'
    }
  }[lang];

  useEffect(() => {
    fetchProviders();
  }, [city, specialty, language]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (specialty) params.append('specialty', specialty);
      if (language) params.append('language', language);

      const res = await fetch(`http://localhost:4000/api/providers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error('Failed to fetch providers', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#0D9488]/20 selection:text-[#162836]" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center shadow-inner">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-[#162836] text-xl tracking-tight hidden sm:block">HealTrip AI</h1>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#0D9488] transition-colors">
              {isAr ? <ChevronRight className="w-4 h-4 ml-1" /> : <ChevronLeft className="w-4 h-4 mr-1" />}
              {t.home}
            </Link>
            <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="text-sm font-bold text-[#162836] hover:text-[#0D9488] transition-colors px-2 py-1 rounded-lg hover:bg-slate-100">
              {isAr ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-4xl font-bold text-[#162836] mb-4 leading-tight">{t.title}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 rtl:left-auto rtl:right-4" />
            <input 
              type="text" 
              placeholder={t.filters.specialty} 
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-12 focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 rtl:left-auto rtl:right-4" />
            <select 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-12 appearance-none focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all cursor-pointer"
            >
              <option value="">{t.filters.city}</option>
              <option value="Riyadh">Riyadh (الرياض)</option>
              <option value="Jeddah">Jeddah (جدة)</option>
              <option value="Dammam">Dammam (الدمام)</option>
            </select>
          </div>
          <div className="flex-1 relative">
            <Globe2 className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 rtl:left-auto rtl:right-4" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-12 appearance-none focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all cursor-pointer"
            >
              <option value="">{t.filters.language}</option>
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#0D9488]/20 border-t-[#0D9488] rounded-full animate-spin"></div>
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {doctors.map(doc => (
              <div key={doc.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#0D9488]/50 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-[#162836] mb-1">
                      {t.doctor} {isAr ? (doc.nameAr || doc.name) : doc.name}
                    </h3>
                    <p className="text-[#0D9488] font-semibold text-sm">{doc.specialty}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                    <HeartPulse className="w-6 h-6 text-[#0D9488]" />
                  </div>
                </div>
                
                <div className="space-y-3 mt-6 pt-6 border-t border-slate-100 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{isAr ? (doc.hospital.nameAr || doc.hospital.name) : doc.hospital.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{doc.city}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe2 className="w-4 h-4 text-slate-400" />
                    <span>{doc.languages.join(' • ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">{t.noResults}</p>
          </div>
        )}
      </main>
    </div>
  );
}

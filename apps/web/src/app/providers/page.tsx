'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { HeartPulse, ChevronLeft, ChevronRight, Search, MapPin, Building2,  Navigation, MessageSquare, PlusCircle, CheckCircle2 } from 'lucide-react';
import { SPECIALTIES, SPECIALTIES_AR, CITIES, CITIES_AR, getDistanceKm } from '../../lib/constants';

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
    district: string;
    districtAr: string;
    address: string;
    lat: number;
    lng: number;
    mapsUrl: string;
  };
  distanceKm?: number;
};

export default function ProvidersHub({ initialTab = 'directory' }: { initialTab?: 'directory' | 'register' }) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [activeTab, setActiveTab] = useState<'directory' | 'register'>(initialTab);
  const isAr = lang === 'ar';

  // --- Directory State ---
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [gpsActive, setGpsActive] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // --- Form State ---
  const [formData, setFormData] = useState({
    hospitalName: '',
    doctorName: '',
    specialty: '',
    city: '',
    district: '',
    contactInfo: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const t = {
    en: {
      title: 'Healthcare Providers Hub',
      subtitle: 'Find the nearest doctors or register your medical facility.',
      tabs: { dir: 'Provider Directory', reg: 'Add Your Facility' },
      search: 'Search hospitals, doctors or districts...',
      filters: { city: 'All Cities', specialty: 'All Specialties' },
      nearest: 'Nearest to Me',
      noResults: 'No providers found matching your criteria.',
      doctorLabel: 'Dr.',
      km: 'km away',
      chat: 'Chat with AI',
      maps: 'Directions',
      home: 'Home',
      form: {
        hospital: 'Hospital or Clinic Name',
        doctor: 'Doctor Name',
        specialty: 'Specialty',
        city: 'City',
        district: 'District (Optional)',
        contact: 'Contact Email / Phone',
        submit: 'Submit Details',
        submitting: 'Submitting...',
        success: 'Registration Received!',
        successDesc: 'Your provider details have been added to the directory.',
        another: 'Add Another'
      },
      errors: {
        hospital: 'Please enter a valid hospital name (letters only, min 4 chars)',
        doctor: 'Please enter a valid full name (e.g., Dr. Ahmed)',
        specialty: 'Please select a valid specialty',
        city: 'Please select a valid city',
        contact: 'Please enter a valid Saudi phone number (05XXXXXXXX) or email address',
        submit: 'Failed to submit. Please check your inputs and try again.'
      }
    },
    ar: {
      title: 'مركز مقدمي الرعاية الصحية',
      subtitle: 'ابحث عن أقرب الأطباء أو قم بتسجيل منشأتك الطبية.',
      tabs: { dir: 'دليل الأطباء', reg: 'تسجيل منشأة' },
      search: 'ابحث عن مستشفى، طبيب أو حي...',
      filters: { city: 'جميع المدن', specialty: 'جميع التخصصات' },
      nearest: 'الأقرب لموقعي',
      noResults: 'لم يتم العثور على مقدمي خدمة يطابقون بحثك.',
      doctorLabel: 'د.',
      km: 'كم',
      chat: 'تحدث مع الذكاء الاصطناعي',
      maps: 'الاتجاهات',
      home: 'الرئيسية',
      form: {
        hospital: 'اسم المستشفى أو العيادة',
        doctor: 'اسم الطبيب',
        specialty: 'التخصص',
        city: 'المدينة',
        district: 'الحي (اختياري)',
        contact: 'البريد الإلكتروني / الهاتف',
        submit: 'إرسال البيانات',
        submitting: 'جاري الإرسال...',
        success: 'تم استلام التسجيل!',
        successDesc: 'تمت إضافة بياناتك إلى الدليل بنجاح.',
        another: 'إضافة منشأة أخرى'
      },
      errors: {
        hospital: 'يرجى إدخال اسم مستشفى صحيح (حروف فقط، ٤ أحرف على الأقل)',
        doctor: 'يرجى إدخال اسم كامل صحيح (مثال: د. أحمد)',
        specialty: 'يرجى اختيار تخصص',
        city: 'يرجى اختيار مدينة',
        contact: 'يرجى إدخال رقم جوال سعودي صحيح (05XXXXXXXX) أو بريد إلكتروني صالح',
        submit: 'فشل الإرسال. يرجى مراجعة المدخلات والمحاولة مرة أخرى.'
      }
    }
  }[lang];

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (specialty) params.append('specialty', specialty);
      if (search) params.append('search', search);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${API_URL}/providers?${params}`);
      if (res.ok) {
        const data = await res.json();
        let fetchedDocs: Doctor[] = data.doctors || [];
        
        if (userLocation) {
          fetchedDocs = fetchedDocs.map(d => ({
            ...d,
            distanceKm: getDistanceKm(userLocation.lat, userLocation.lng, d.hospital.lat, d.hospital.lng)
          })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
        }
        setDoctors(fetchedDocs);
      }
    } catch (error) {
      console.error('Failed to fetch providers', error);
    } finally {
      setLoading(false);
    }
  }, [city, specialty, search, userLocation]);

  useEffect(() => {
    // eslint-disable-next-line
    if (activeTab === 'directory') fetchProviders();
  }, [fetchProviders, activeTab]);

  const handleLocateMe = () => {
    if (gpsActive) {
      setGpsActive(false);
      setUserLocation(null);
      return;
    }
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsActive(true);
        },
        () => {
          alert(isAr ? 'تعذر الوصول إلى الموقع' : 'Could not access location');
          setLoading(false);
        }
      );
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s\-]{4,}$/;
    const docRegex = /^([a-zA-Z\u0600-\u06FF\.]+\s+)+[a-zA-Z\u0600-\u06FF]+$/;
    const contactRegex = /^(((\+9665|05)[0-9]{8})|(9200[0-9]{5})|([^\s@]+@[^\s@]+\.[^\s@]+))$/;

    if (!nameRegex.test(formData.hospitalName)) errs.hospitalName = t.errors.hospital;
    if (!docRegex.test(formData.doctorName) || formData.doctorName.length < 4) errs.doctorName = t.errors.doctor;
    if (!(SPECIALTIES as readonly string[]).includes(formData.specialty)) errs.specialty = t.errors.specialty;
    if (!(CITIES as readonly string[]).includes(formData.city)) errs.city = t.errors.city;
    if (!contactRegex.test(formData.contactInfo)) errs.contactInfo = t.errors.contact;

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormStatus('submitting');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${API_URL}/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setFormStatus('success');
      setFormData({ hospitalName: '', doctorName: '', specialty: '', city: '', district: '', contactInfo: '' });
      setFieldErrors({});
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 min-h-[4rem] sm:min-h-[5rem] py-3 flex flex-wrap gap-4 items-center justify-between">
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

        {/* Dual Tabs */}
        <div className="flex justify-center mb-8 px-4 sm:px-0">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-2 relative z-10 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('directory')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'directory' ? 'bg-[#162836] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="whitespace-normal text-center">{t.tabs.dir}</span>
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'register' ? 'bg-[#0D9488] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="whitespace-normal text-center">{t.tabs.reg}</span>
            </button>
          </div>
        </div>

        {/* Directory Tab */}
        {activeTab === 'directory' && (
          <div className="animate-in fade-in duration-500">
            {/* Filter Bar */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row gap-4 relative z-20">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 rtl:left-auto rtl:right-4" />
                <input 
                  type="text" 
                  placeholder={t.search} 
                  value={search}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-12 focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all text-sm font-semibold"
                />
              </div>
              <div className="w-full lg:w-48 relative shrink-0">
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 appearance-none focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all cursor-pointer text-sm font-semibold"
                >
                  <option value="">{t.filters.city}</option>
                  {CITIES.map(c => <option key={c} value={c}>{isAr ? CITIES_AR[c] : c}</option>)}
                </select>
              </div>
              <div className="w-full lg:w-56 relative shrink-0">
                <select 
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 appearance-none focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all cursor-pointer text-sm font-semibold"
                >
                  <option value="">{t.filters.specialty}</option>
                  {SPECIALTIES.map(s => <option key={s} value={s}>{isAr ? SPECIALTIES_AR[s] : s}</option>)}
                </select>
              </div>
              <button 
                onClick={handleLocateMe}
                className={`w-full lg:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold transition-all flex justify-center items-center gap-2 border-2 shrink-0 ${gpsActive ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-white text-slate-600 border-slate-200 hover:border-[#162836]'}`}
              >
                <Navigation className={`w-4 h-4 ${gpsActive ? 'text-sky-500 fill-sky-500' : ''}`} />
                {t.nearest}
              </button>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#0D9488]/20 border-t-[#0D9488] rounded-full animate-spin"></div>
              </div>
            ) : doctors.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map(doc => (
                  <div key={doc.id} className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#0D9488]/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col group relative overflow-hidden">
                    {/* Distance Badge */}
                    {doc.distanceKm !== undefined && (
                      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-100 flex items-center gap-1.5 shadow-sm">
                        <Navigation className="w-3 h-3 fill-sky-500" />
                        {doc.distanceKm.toFixed(1)} {t.km}
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="pr-12 rtl:pr-0 rtl:pl-12">
                        <h3 className="font-bold text-lg text-[#162836] mb-1">
                          {t.doctorLabel} {isAr ? (doc.nameAr || doc.name) : doc.name}
                        </h3>
                        <span className="inline-flex bg-teal-50 text-teal-700 text-xs font-bold px-2 py-1 rounded border border-teal-100">{isAr ? SPECIALTIES_AR[doc.specialty] : doc.specialty}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4 mb-6 text-sm text-slate-600 flex-1">
                      <div className="flex items-start gap-3">
                        <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="font-medium">{isAr ? (doc.hospital.nameAr || doc.hospital.name) : doc.hospital.name}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="font-medium">
                          {isAr ? CITIES_AR[doc.city] : doc.city}
                          {doc.hospital.district && ` - ${isAr ? (doc.hospital.districtAr || doc.hospital.district) : doc.hospital.district}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <Link href={`/chat?q=${isAr ? 'احجز لي موعد مع ' : 'Book an appointment with '} ${doc.name}`} className="flex-1 bg-slate-50 hover:bg-[#162836] text-[#162836] hover:text-white border border-slate-200 hover:border-[#162836] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {t.chat}
                      </Link>
                      <a href={doc.hospital.mapsUrl || `https://maps.google.com/?q=${doc.hospital.lat},${doc.hospital.lng}`} target="_blank" rel="noreferrer" className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4 text-[#0D9488]" />
                        {t.maps}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg">{t.noResults}</p>
              </div>
            )}
          </div>
        )}

        {/* Register Tab */}
        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10 overflow-hidden relative animate-in fade-in duration-500">
            {formStatus === 'success' ? (
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-8 rounded-2xl flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white shadow-md shadow-[#10B981]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-[#166534] text-xl mb-2">{t.form.success}</h3>
                  <p className="text-[#15803D] font-medium">{t.form.successDesc}</p>
                </div>
                <button onClick={() => setFormStatus('idle')} className="mt-6 px-8 py-3 bg-white border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white rounded-xl font-bold transition-all shadow-sm">
                  {t.form.another}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5 relative z-10" noValidate>
                {/* Hospital */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#162836]">{t.form.hospital}</label>
                  <input type="text" value={formData.hospitalName} onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} className={`w-full px-5 py-3.5 rounded-xl border ${fieldErrors.hospitalName ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20' : 'border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488]'} outline-none transition-all text-sm font-semibold`} />
                  {fieldErrors.hospitalName && <p className="text-rose-500 text-xs font-bold mt-1">{fieldErrors.hospitalName}</p>}
                </div>

                {/* Doctor */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#162836]">{t.form.doctor}</label>
                  <input type="text" value={formData.doctorName} onChange={(e) => setFormData({...formData, doctorName: e.target.value})} className={`w-full px-5 py-3.5 rounded-xl border ${fieldErrors.doctorName ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20' : 'border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488]'} outline-none transition-all text-sm font-semibold`} />
                  {fieldErrors.doctorName && <p className="text-rose-500 text-xs font-bold mt-1">{fieldErrors.doctorName}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Specialty */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#162836]">{t.form.specialty}</label>
                    <select value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} className={`w-full px-5 py-3.5 rounded-xl border appearance-none ${fieldErrors.specialty ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20' : 'border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488]'} outline-none transition-all text-sm font-semibold cursor-pointer`}>
                      <option value="">{t.filters.specialty}</option>
                      {SPECIALTIES.map(s => <option key={s} value={s}>{isAr ? SPECIALTIES_AR[s] : s}</option>)}
                    </select>
                    {fieldErrors.specialty && <p className="text-rose-500 text-xs font-bold mt-1">{fieldErrors.specialty}</p>}
                  </div>
                  {/* Contact */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#162836]">{t.form.contact}</label>
                    <input type="text" value={formData.contactInfo} onChange={(e) => setFormData({...formData, contactInfo: e.target.value})} className={`w-full px-5 py-3.5 rounded-xl border ${fieldErrors.contactInfo ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20' : 'border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488]'} outline-none transition-all text-sm font-semibold`} dir="ltr" />
                    {fieldErrors.contactInfo && <p className="text-rose-500 text-xs font-bold mt-1">{fieldErrors.contactInfo}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#162836]">{t.form.city}</label>
                    <select value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className={`w-full px-5 py-3.5 rounded-xl border appearance-none ${fieldErrors.city ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-500/20' : 'border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488]'} outline-none transition-all text-sm font-semibold cursor-pointer`}>
                      <option value="">{t.filters.city}</option>
                      {CITIES.map(c => <option key={c} value={c}>{isAr ? CITIES_AR[c] : c}</option>)}
                    </select>
                    {fieldErrors.city && <p className="text-rose-500 text-xs font-bold mt-1">{fieldErrors.city}</p>}
                  </div>
                  {/* District */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#162836]">{t.form.district}</label>
                    <input type="text" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488] outline-none transition-all text-sm font-semibold" />
                  </div>
                </div>

                {formStatus === 'error' && (
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100 flex items-center gap-2">
                    {t.errors.submit}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className="w-full mt-8 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? t.form.submitting : t.form.submit}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

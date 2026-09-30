'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, HeartPulse, ChevronRight, CheckCircle2, ChevronLeft } from 'lucide-react';

export default function ProviderPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isAr = lang === 'ar';

  const [formData, setFormData] = useState({
    hospitalName: '',
    doctorName: '',
    specialty: '',
    city: '',
    contactInfo: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const t = {
    en: {
      title: 'Join HealTrip AI',
      subtitle: 'Submit your healthcare facility and specialists to join our trusted medical network.',
      home: 'Back to Home',
      labels: {
        hospital: 'Hospital or Clinic Name',
        doctor: 'Doctor Name',
        specialty: 'Specialty',
        city: 'City',
        contact: 'Contact Email / Phone'
      },
      placeholders: {
        hospital: 'e.g. King Faisal Specialist Hospital',
        doctor: 'e.g. Dr. Ahmed',
        specialty: 'e.g. Cardiology',
        city: 'e.g. Riyadh',
        contact: 'contact@hospital.com'
      },
      submit: 'Submit Details',
      submitting: 'Submitting...',
      successTitle: 'Registration Received',
      successDesc: 'Thank you for joining HealTrip AI. Your provider details have been securely added to our directory.',
      submitAnother: 'Submit Another',
      error: 'Failed to submit. Please check your connection and try again.'
    },
    ar: {
      title: 'انضم إلى HealTrip AI',
      subtitle: 'سجل منشأتك الصحية وأطبائك للانضمام إلى شبكتنا الطبية الموثوقة.',
      home: 'العودة للرئيسية',
      labels: {
        hospital: 'اسم المستشفى أو العيادة',
        doctor: 'اسم الطبيب',
        specialty: 'التخصص',
        city: 'المدينة',
        contact: 'البريد الإلكتروني / الهاتف'
      },
      placeholders: {
        hospital: 'مثال: مستشفى الملك فيصل التخصصي',
        doctor: 'مثال: د. أحمد',
        specialty: 'مثال: طب القلب',
        city: 'مثال: الرياض',
        contact: 'contact@hospital.com'
      },
      submit: 'إرسال البيانات',
      submitting: 'جاري الإرسال...',
      successTitle: 'تم استلام التسجيل',
      successDesc: 'شكراً لانضمامك إلى HealTrip AI. تمت إضافة بياناتك بأمان إلى دليلنا الطبي.',
      submitAnother: 'إرسال المزيد',
      error: 'فشل الإرسال. يرجى التحقق من اتصالك والمحاولة مرة أخرى.'
    }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('http://localhost:4000/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setStatus('success');
      setFormData({ hospitalName: '', doctorName: '', specialty: '', city: '', contactInfo: '' });
    } catch {
      setStatus('error');
    }
  };

  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#0D9488]/20 selection:text-[#162836]" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Floating Glassmorphism Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
        <header className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm shadow-[#162836]/5 rounded-3xl h-16 sm:h-20 flex items-center justify-between px-6 pointer-events-auto transition-all duration-300">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center shadow-inner">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-[#162836] text-xl tracking-tight leading-none hidden sm:block">HealTrip AI</h1>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#0D9488] transition-colors">
              {isAr ? <ChevronRight className="w-4 h-4 ml-1" /> : <ChevronLeft className="w-4 h-4 mr-1" />}
              {t.home}
            </Link>
            <button onClick={toggleLang} className="text-sm font-bold text-[#162836] hover:text-[#0D9488] transition-colors px-2 py-1 rounded-lg hover:bg-slate-100">
              {isAr ? 'English' : 'العربية'}
            </button>
          </div>
        </header>
      </div>

      {/* Main Form Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-12 overflow-hidden relative">
          
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0D9488]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="mb-10 text-center relative z-10">
            <div className="w-16 h-16 bg-[#162836] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#162836] mb-3 leading-[1.35]">{t.title}</h2>
            <p className="text-slate-600 font-normal max-w-lg mx-auto leading-relaxed">{t.subtitle}</p>
          </div>

          {status === 'success' ? (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-8 rounded-2xl flex flex-col items-center text-center space-y-4 relative z-10 animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white shadow-md shadow-[#10B981]/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-[#166534] text-xl mb-2 leading-[1.35]">{t.successTitle}</h3>
                <p className="text-[#15803D] font-normal leading-relaxed max-w-sm">{t.successDesc}</p>
              </div>
              <button onClick={() => setStatus('idle')} className="mt-6 px-8 py-3 bg-white border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white rounded-xl font-bold transition-all shadow-sm">
                {t.submitAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label htmlFor="hospitalName" className="block text-sm font-bold text-[#162836]">{t.labels.hospital}</label>
                <input required id="hospitalName" type="text" value={formData.hospitalName} onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488] outline-none transition-all text-[#162836] placeholder:text-slate-400 font-medium" placeholder={t.placeholders.hospital} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="doctorName" className="block text-sm font-bold text-[#162836]">{t.labels.doctor}</label>
                  <input required id="doctorName" type="text" value={formData.doctorName} onChange={(e) => setFormData({...formData, doctorName: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488] outline-none transition-all text-[#162836] placeholder:text-slate-400 font-medium" placeholder={t.placeholders.doctor} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="specialty" className="block text-sm font-bold text-[#162836]">{t.labels.specialty}</label>
                  <input required id="specialty" type="text" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488] outline-none transition-all text-[#162836] placeholder:text-slate-400 font-medium" placeholder={t.placeholders.specialty} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-bold text-[#162836]">{t.labels.city}</label>
                  <input required id="city" type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488] outline-none transition-all text-[#162836] placeholder:text-slate-400 font-medium" placeholder={t.placeholders.city} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactInfo" className="block text-sm font-bold text-[#162836]">{t.labels.contact}</label>
                  <input id="contactInfo" type="text" value={formData.contactInfo} onChange={(e) => setFormData({...formData, contactInfo: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-[#F8FAFC] focus:bg-white focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488] outline-none transition-all text-[#162836] placeholder:text-slate-400 font-medium" placeholder={t.placeholders.contact} />
                </div>
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-50 text-[#E31E24] rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {t.error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full mt-6 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {status === 'submitting' ? t.submitting : t.submit}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

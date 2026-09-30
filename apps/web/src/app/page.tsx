'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, HeartPulse, Stethoscope, Building2, ChevronRight, Activity, Clock, BadgeCheck, 
  Search, ArrowRight, ArrowLeft, Star, Users, MapPin, CheckCircle2, Eye, Bone, Heart
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  Specialty icons mapping for quick-filter pills                    */
/* ------------------------------------------------------------------ */
const SPECIALTY_ICONS: Record<string, React.ElementType> = {
  Cardiology: Heart, 'طب القلب': Heart,
  Orthopedics: Bone, 'جراحة العظام': Bone,
  Dentistry: Stethoscope, 'طب الأسنان': Stethoscope,
  Pediatrics: Users, 'طب الأطفال': Users,
  Ophthalmology: Eye, 'طب العيون': Eye,
};

export default function LandingPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const isAr = lang === 'ar';

  /* ---------- scroll listener for sticky header ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const t = {
    en: {
      badge: '🇸🇦 AI-Powered Healthcare in Saudi Arabia',
      headlines: [
        'Pioneers in Smart Healthcare',
        'Your Smart Path to Top Doctors',
        'Instant & Trusted Medical Triage'
      ],
      subheadline: 'Describe your symptoms, and HealTrip AI will instantly match you with verified doctors and hospitals across Saudi Arabia.',
      startFree: 'Start AI Assistant',
      providerCTA: 'For Healthcare Providers',
      specialtiesTitle: 'Specialties',
      citiesTitle: 'Cities',
      specialties: ['Cardiology', 'Orthopedics', 'Dentistry', 'Pediatrics', 'Ophthalmology'],
      cities: ['Riyadh', 'Jeddah', 'Dammam', 'Makkah'],
      servicesTitle: 'Our AI-Powered Services',
      services: [
        { title: 'Smart Patient Triage', desc: 'AI-guided conversation that helps you determine the appropriate next step for your health.', icon: Activity },
        { title: 'Verified Medical Directory', desc: 'Search available doctors and hospitals using our approved and trusted database.', icon: Search },
        { title: 'Healthcare Provider Portal', desc: 'Allow hospitals and healthcare providers to securely submit their information.', icon: Building2 }
      ],
      trustStrip: [
        { title: 'CBAHI-Aligned Principles' },
        { title: 'JCI Design Standards' },
        { title: 'Saudi MOH-Aligned' },
        { title: 'Secure & Private AI' }
      ],
      stats: [
        { value: '+4,500', label: 'Verified Doctors' },
        { value: '+60', label: 'Partner Hospitals' },
        { value: '+27', label: 'Medical Specialties' },
        { value: '24/7', label: 'AI Assistance' }
      ],
      excellenceTitle: 'Centers of Excellence',
      excellence: [
        { title: 'Cardiology', image: '/images/center_cardiology_1790783875483.jpg', desc: 'World-class heart care and diagnostics.' },
        { title: 'Orthopedics', image: '/images/center_orthopedics_1790783885824.jpg', desc: 'Advanced joint replacement and sports medicine.' },
        { title: 'Ophthalmology', image: '/images/center_ophthalmology_1790783896962.jpg', desc: 'Pioneering eye surgeries and vision correction.' }
      ],
      footer: {
        desc: 'HealTrip AI provides medical directory assistance and AI guidance. Designed around quality healthcare principles. Not a substitute for emergency care.',
        copyright: '© 2026 HealTrip AI. All rights reserved.',
        links: {
          navigation: 'Navigation',
          specialties: 'Specialties',
          providers: 'For Providers'
        }
      }
    },
    ar: {
      badge: '🇸🇦 رعاية صحية مدعومة بالذكاء الاصطناعي في السعودية',
      headlines: [
        'رواد الرعاية الصحية المتميزة',
        'مسارك الذكي لأفضل الأطباء',
        'توجيه طبي فوري وموثوق'
      ],
      subheadline: 'صف أعراضك، وسيقوم HealTrip AI بمطابقتك فوراً مع أفضل الأطباء والمستشفيات المعتمدة في جميع أنحاء المملكة.',
      startFree: 'ابدأ المساعد الذكي',
      providerCTA: 'لمنشآت الرعاية الصحية',
      specialtiesTitle: 'التخصصات',
      citiesTitle: 'المدن',
      specialties: ['طب القلب', 'جراحة العظام', 'طب الأسنان', 'طب الأطفال', 'طب العيون'],
      cities: ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة'],
      servicesTitle: 'خدماتنا المدعومة بالذكاء الاصطناعي',
      services: [
        { title: 'التوجيه الذكي للمرضى', desc: 'محادثة مدعومة بالذكاء الاصطناعي تساعدك في تحديد الخطوة المناسبة لصحتك.', icon: Activity },
        { title: 'دليل طبي معتمد', desc: 'ابحث عن الأطباء والمستشفيات المتاحة باستخدام قاعدة بياناتنا المعتمدة والموثوقة.', icon: Search },
        { title: 'بوابة مقدمي الخدمة', desc: 'تتيح للمستشفيات ومقدمي الرعاية الصحية إرسال معلوماتهم بشكل آمن.', icon: Building2 }
      ],
      trustStrip: [
        { title: 'مبادئ متوافقة مع سباهي' },
        { title: 'معايير تصميم JCI' },
        { title: 'متوافق مع وزارة الصحة' },
        { title: 'ذكاء اصطناعي آمن وخاص' }
      ],
      stats: [
        { value: '+4,500', label: 'طبيب معتمد' },
        { value: '+60', label: 'مستشفى شريك' },
        { value: '+27', label: 'تخصص طبي' },
        { value: '24/7', label: 'مساعدة ذكية' }
      ],
      excellenceTitle: 'مراكز التميز',
      excellence: [
        { title: 'طب القلب', image: '/images/center_cardiology_1790783875483.jpg', desc: 'رعاية وتشخيص أمراض القلب بمستوى عالمي.' },
        { title: 'جراحة العظام', image: '/images/center_orthopedics_1790783885824.jpg', desc: 'استبدال المفاصل المتقدم والطب الرياضي.' },
        { title: 'طب العيون', image: '/images/center_ophthalmology_1790783896962.jpg', desc: 'جراحات العيون الرائدة وتصحيح النظر.' }
      ],
      footer: {
        desc: 'يوفر HealTrip AI التوجيه الطبي الذكي والمساعدة في البحث. مصمم وفقاً لمبادئ الجودة الصحية. ليس بديلاً للرعاية الطارئة.',
        copyright: '© 2026 HealTrip AI. جميع الحقوق محفوظة.',
        links: {
          navigation: 'الروابط',
          specialties: 'التخصصات',
          providers: 'لمقدمي الخدمة'
        }
      }
    }
  }[lang];

  /* ------------------------------------------------------------------ */
  /*  Typewriter effect — language-isolated, fixed-box, no layout shift */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    let currentText = '';
    let isDeleting = false;
    let loopNum = 0;
    let typingSpeed = 100;
    let timer: NodeJS.Timeout;

    // Instantly reset on lang change
    setDisplayedText('');
    setHeadlineIndex(0);

    const handleType = () => {
      const i = loopNum % t.headlines.length;
      const fullText = t.headlines[i];

      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
        typingSpeed = 40;
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
        typingSpeed = 80;
      }

      setDisplayedText(currentText);
      setHeadlineIndex(i);

      if (!isDeleting && currentText === fullText) {
        typingSpeed = 2500;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        loopNum++;
        typingSpeed = 400;
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, 600);
    return () => clearTimeout(timer);
  }, [lang]); // Only depend on lang — t.headlines is derived from lang

  const toggleLang = () => {
    setLang(l => l === 'en' ? 'ar' : 'en');
  };

  const DirectionalArrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#0D9488]/20 selection:text-[#162836]" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* ============================================================ */}
      {/*  FLOATING GLASSMORPHISM HEADER                                */}
      {/* ============================================================ */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 pointer-events-none">
        <header className={`
          max-w-6xl mx-auto backdrop-blur-xl border shadow-sm rounded-3xl
          flex items-center justify-between px-6 pointer-events-auto
          transition-all duration-500 ease-out
          ${scrolled 
            ? 'bg-white/90 border-slate-200/60 shadow-slate-900/8 h-14 sm:h-16' 
            : 'bg-white/70 border-white/40 shadow-[#162836]/5 h-16 sm:h-20'}
        `}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center shadow-inner">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-[#162836] text-xl tracking-tight leading-none">HealTrip AI</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#162836]">
              <Link href="/" className="hover:text-[#0D9488] transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
              <Link href="#excellence" className="hover:text-[#0D9488] transition-colors">{isAr ? 'مراكز التميز' : 'Centers of Excellence'}</Link>
              <Link href="/providers" className="hover:text-[#0D9488] transition-colors">{isAr ? 'الأطباء' : 'Providers'}</Link>
              <Link href="/register" className="hover:text-[#0D9488] transition-colors">{isAr ? 'تسجيل منشأة' : 'Register'}</Link>
            </nav>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleLang}
                className="text-sm font-bold text-[#162836] hover:text-[#0D9488] transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                {isAr ? 'English' : 'العربية'}
              </button>
              <Link href="/chat" className="hidden sm:flex px-5 py-2.5 rounded-xl bg-[#162836] hover:bg-[#1E3A52] hover:shadow-md hover:-translate-y-0.5 text-white text-sm font-bold transition-all duration-200">
                {t.startFree}
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* ============================================================ */}
      {/*  HERO SECTION                                                 */}
      {/* ============================================================ */}
      <main className="bg-white pt-32 pb-16 md:pt-40 md:pb-24 rounded-b-[3rem] shadow-sm relative z-10 overflow-hidden">
        {/* Subtle background gradient wash */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-50 via-sky-50/50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none -translate-y-1/3 translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center relative">
          
          {/* Text Side (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-start text-start">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 mb-8 text-xs sm:text-sm font-semibold text-[#162836]">
              <BadgeCheck className="w-4 h-4 text-[#0D9488]" />
              {t.badge}
            </div>
            
            {/* ===== TYPEWRITER — FIXED-HEIGHT BOX, ZERO LAYOUT SHIFT ===== */}
            <div className="w-full mb-6" style={{ minHeight: '4.5rem' }}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#162836] leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis">
                {displayedText}
                {/* Cursor — fixed-width, opacity animation, never pushes characters */}
                <span 
                  className="inline-block align-middle animate-cursor-blink" 
                  style={{ width: '3px', height: '0.85em', backgroundColor: '#E31E24', marginInlineStart: '4px', borderRadius: '2px' }}
                  aria-hidden="true"
                />
              </h2>
            </div>
            
            {/* Subtitle — 100% static, never moves */}
            <p className="text-lg md:text-xl text-slate-600 max-w-xl mb-10 leading-relaxed font-normal">
              {t.subheadline}
            </p>

            {/* CTAs — 100% static */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link href="/chat" className="px-8 py-4 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] hover:shadow-lg hover:shadow-[#0D9488]/20 hover:-translate-y-1 text-white text-base font-bold transition-all duration-200 flex items-center gap-2">
                {t.startFree}
                <DirectionalArrow className="w-5 h-5" />
              </Link>
              <Link href="/providers" className="px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#162836] text-[#162836] hover:bg-slate-50 hover:-translate-y-1 text-base font-bold transition-all duration-200">
                {isAr ? 'تصفح الأطباء' : 'Browse Providers'}
              </Link>
              <Link href="/register" className="px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#162836] text-[#162836] hover:bg-slate-50 hover:-translate-y-1 text-base font-bold transition-all duration-200">
                {t.providerCTA}
              </Link>
            </div>

            {/* ===== QUICK FILTERS — Interactive Specialty & City Pills ===== */}
            <div className="w-full bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="mb-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.specialtiesTitle}</span>
                <div className="flex flex-wrap gap-2 mt-3">
                  {t.specialties.map((spec) => {
                    const IconComp = SPECIALTY_ICONS[spec] || Stethoscope;
                    return (
                      <Link 
                        key={spec} 
                        href={`/chat?q=${isAr ? 'أريد طبيب' : 'Find a'} ${spec}`} 
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-[#162836] text-sm font-semibold shadow-xs hover:border-[#0D9488] hover:bg-teal-50/60 hover:text-[#0D9488] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                      >
                        <IconComp className="w-4 h-4 opacity-60" />
                        {spec}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.citiesTitle}</span>
                <div className="flex flex-wrap gap-2 mt-3">
                  {t.cities.map((city) => (
                    <Link 
                      key={city} 
                      href={`/chat?q=${isAr ? 'مستشفيات في' : 'Hospitals in'} ${city}`} 
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-[#162836] text-sm font-semibold shadow-xs hover:border-[#0284C7] hover:bg-sky-50/60 hover:text-[#0284C7] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    >
                      <MapPin className="w-4 h-4 opacity-60" />
                      {city}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== DOCTOR IMAGE SIDE (5 cols) — Layered Architectural Composition ===== */}
          <div className="md:col-span-5 relative">
            {/* Gradient aura behind the card */}
            <div className="absolute inset-0 -inset-x-8 -inset-y-8 bg-gradient-to-tr from-teal-500/15 via-sky-500/10 to-rose-500/10 blur-2xl rounded-full pointer-events-none" />
            
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-100 ring-4 ring-white shadow-2xl group">
              <Image 
                src="/images/doctor_hero_portrait_1790783865132.jpg" 
                alt="Doctor Portrait" 
                fill 
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                priority
              />
              {/* Subtle colour overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0284C7]/15 to-transparent mix-blend-multiply opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
            </div>
            
            {/* Floating Badge — Verified Doctors (gentle float, glassmorphic) */}
            <div className="absolute top-10 -left-6 rtl:-left-auto rtl:-right-6 backdrop-blur-md bg-white/90 border border-white/60 shadow-lg p-4 rounded-2xl flex items-center gap-3 animate-gentle-float">
              <div className="w-11 h-11 bg-[#10B981]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              </div>
              <p className="text-[#162836] font-bold text-sm">{isAr ? 'أطباء معتمدون' : 'Verified Doctors'}</p>
            </div>

            {/* Floating Badge — 24/7 AI */}
            <div className="absolute bottom-10 -right-6 rtl:-right-auto rtl:-left-6 backdrop-blur-md bg-white/90 border border-white/60 shadow-lg p-4 rounded-2xl flex items-center gap-3 animate-gentle-float" style={{ animationDelay: '1.5s' }}>
              <div className="w-11 h-11 bg-[#0D9488]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-[#0D9488]" />
              </div>
              <p className="text-[#162836] font-bold text-sm">{isAr ? 'مساعدة ذكية ٢٤/٧' : '24/7 AI Assistance'}</p>
            </div>
          </div>

        </div>
      </main>

      {/* ============================================================ */}
      {/*  SERVICES SECTION — Ice-gray background, premium hover       */}
      {/* ============================================================ */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-[#162836] tracking-tight leading-[1.35]">{t.servicesTitle}</h2>
            <div className="w-16 h-1.5 rounded-full bg-[#E31E24] mx-auto mt-6" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.services.map((svc, idx) => (
              <div 
                key={idx} 
                className={`
                  animate-fade-up stagger-${idx + 1}
                  group bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm
                  hover:shadow-[0_20px_40px_-15px_rgba(13,148,136,0.15)] hover:border-teal-500/40
                  hover:-translate-y-2 transition-all duration-300
                `}
              >
                <div className="w-16 h-16 bg-[#F8FAFC] group-hover:bg-[#0D9488] rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300">
                  <svc.icon className="w-8 h-8 text-[#0D9488] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#162836] mb-4 leading-[1.35]">{svc.title}</h3>
                <p className="text-slate-600 font-normal leading-relaxed mb-8">{svc.desc}</p>
                <Link href={idx === 2 ? "/register" : "/chat"} className="inline-flex items-center font-bold text-[#0D9488] group-hover:text-[#162836] transition-colors">
                  {idx === 2 ? (isAr ? 'التسجيل' : 'Register') : (isAr ? 'البدء' : 'Start')}
                  {isAr 
                    ? <ArrowLeft className="w-5 h-5 ms-2 transition-transform duration-200 group-hover:-translate-x-1.5 rtl:group-hover:translate-x-1.5" /> 
                    : <ArrowRight className="w-5 h-5 ms-2 transition-transform duration-200 group-hover:translate-x-1.5" />
                  }
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TRUST & QUALITY STRIP                                       */}
      {/* ============================================================ */}
      <section className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8">
          {t.trustStrip.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 font-semibold text-sm text-slate-600 tracking-wide hover:text-[#0D9488] transition-colors cursor-default">
              <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
              {item.title}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STATISTICS SECTION — Deep navy, tabular-nums                */}
      {/* ============================================================ */}
      <section className="bg-[#162836] py-24 relative overflow-hidden rounded-[3rem] mx-4 sm:mx-8 my-12 shadow-2xl">
        {/* Abstract orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0D9488]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0284C7]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {t.stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`
                animate-fade-up stagger-${idx + 1}
                bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center 
                hover:bg-white/10 hover:-translate-y-1 transition-all duration-300
              `}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-3 tabular-nums">{stat.value}</div>
              <div className="text-[#0D9488] font-semibold text-sm tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CENTERS OF EXCELLENCE                                       */}
      {/* ============================================================ */}
      <section id="excellence" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-[#162836] tracking-tight leading-[1.35]">{t.excellenceTitle}</h2>
            <div className="w-16 h-1.5 rounded-full bg-[#E31E24] mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.excellence.map((center, idx) => (
              <Link 
                key={idx} 
                href={`/chat?q=${isAr ? 'ابحث عن أطباء' : 'Find'} ${center.title} ${isAr ? '' : 'doctors'}`} 
                className={`
                  animate-fade-up stagger-${idx + 1}
                  group relative rounded-[2rem] overflow-hidden aspect-[4/3] bg-slate-100 shadow-md 
                  hover:shadow-[0_20px_40px_-15px_rgba(22,40,54,0.2)] hover:border-teal-500/40
                  transition-all duration-500 hover:-translate-y-2 block
                `}
              >
                <Image src={center.image} alt={center.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#162836]/90 via-[#162836]/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start justify-end h-full">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-[1.35]">{center.title}</h3>
                    <p className="text-slate-200 font-normal opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4">
                      {center.desc}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0D9488] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                    <DirectionalArrow className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MODERN GLASSMORPHISM FOOTER                                  */}
      {/* ============================================================ */}
      <footer className="bg-[#162836] pt-20 pb-8 mt-auto rounded-t-[3rem] text-slate-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
        {/* Subtle glare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2 bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6 text-white">
                <div className="w-12 h-12 bg-[#0D9488] rounded-xl flex items-center justify-center shadow-inner">
                  <HeartPulse className="w-7 h-7 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight">HealTrip AI</span>
              </div>
              <p className="text-slate-400 font-normal leading-relaxed max-w-md text-lg">
                {t.footer.desc}
              </p>
            </div>
            <div className="pt-4">
              <h4 className="text-white font-bold mb-6 text-lg">{t.footer.links.navigation}</h4>
              <ul className="space-y-4 font-semibold text-slate-400">
                <li><Link href="/" className="hover:text-[#0D9488] transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link></li>
                <li><Link href="/chat" className="hover:text-[#0D9488] transition-colors">{isAr ? 'المساعد الذكي' : 'AI Assistant'}</Link></li>
              </ul>
            </div>
            <div className="pt-4">
              <h4 className="text-white font-bold mb-6 text-lg">{t.footer.links.providers}</h4>
              <ul className="space-y-4 font-semibold text-slate-400">
                <li><Link href="/register" className="hover:text-[#0D9488] transition-colors">{isAr ? 'تسجيل منشأة' : 'Register Facility'}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-semibold text-slate-500">
            <div>{t.footer.copyright}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

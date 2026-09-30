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
    // eslint-disable-next-line
    setDisplayedText('');
    // eslint-disable-next-line
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
            ? 'bg-white/90 border-slate-200/60 shadow-slate-900/8 min-h-[3.5rem] sm:min-h-[4rem] py-2' 
            : 'bg-white/70 border-white/40 shadow-[#162836]/5 min-h-[4rem] sm:min-h-[5rem] py-3'}
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
      <main className="w-full bg-white pt-32 pb-16 md:pt-40 md:pb-24 rounded-none relative z-10 overflow-hidden">
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
            
            {/* ===== TYPEWRITER — MIN-HEIGHT BOX, NO CLIPPING ===== */}
            <div className="w-full mb-6 min-h-[4rem] sm:min-h-[4.5rem] lg:min-h-[5.5rem] flex items-center">
              <h2 className="text-4xl lg:text-[52px] font-heading font-extrabold text-[#162836] tracking-tight leading-[1.35] py-2">
                {displayedText}
                {/* Cursor — fixed-width, opacity animation, never pushes characters */}
                <span 
                  className="inline-block align-middle animate-cursor-blink" 
                  style={{ width: '3px', height: '0.85em', backgroundColor: '#0D9488', marginInlineStart: '4px', borderRadius: '2px' }}
                  aria-hidden="true"
                />
              </h2>
            </div>
            
            {/* Subtitle — 100% static, never moves */}
            <p className="text-base font-medium text-slate-600 max-w-xl mb-10 leading-relaxed">
              {t.subheadline}
            </p>

            {/* CTAs — 100% static */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link href="/chat" className="px-8 py-4 rounded-2xl bg-[#E31E24] hover:bg-[#C81A20] hover:shadow-[0_10px_20px_-10px_rgba(227,30,36,0.5)] hover:-translate-y-1 text-white text-base font-bold transition-all duration-300 flex items-center gap-2">
                {t.startFree}
                <DirectionalArrow className="w-5 h-5" />
              </Link>
              <Link href="/providers" className="px-8 py-4 rounded-2xl bg-white border border-slate-200 hover:border-[#162836] hover:shadow-[0_10px_20px_-10px_rgba(22,40,54,0.1)] text-[#162836] hover:-translate-y-1 text-base font-bold transition-all duration-300">
                {isAr ? 'تصفح الأطباء' : 'Browse Providers'}
              </Link>
            </div>

            {/* ===== QUICK FILTERS — Interactive Specialty & City Pills ===== */}
            <div className="w-full mt-2">
              <div className="mb-6">
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
              <div className="mt-8">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2 inline-block">{t.citiesTitle}</span>
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
            {/* Geometric Backdrop */}
            <div className="absolute -top-6 -right-6 rtl:-right-auto rtl:-left-6 w-32 h-32 bg-[#E31E24] rounded-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 rtl:-left-auto rtl:-right-6 w-40 h-40 bg-[#0284C7]/10 rounded-3xl pointer-events-none" />

            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-xl group">
              <Image 
                src="/images/doctor_hero_portrait_1790783865132.jpg" 
                alt="Doctor Portrait" 
                fill 
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating Badge — Verified Doctors */}
            <div className="absolute top-8 -right-5 rtl:-right-5 rtl:-left-auto w-max max-w-[200px] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2.5 animate-gentle-float">
              <ShieldCheck className="w-5 h-5 text-[#10B981] flex-shrink-0" />
              <p className="text-[#162836] font-bold text-sm leading-tight">{isAr ? 'أطباء معتمدون' : 'Verified Doctors'}</p>
            </div>

            {/* Floating Badge — 24/7 AI */}
            <div className="absolute bottom-8 -left-5 rtl:-left-5 rtl:-right-auto w-max max-w-[200px] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2.5 animate-gentle-float" style={{ animationDelay: '1.5s' }}>
              <Activity className="w-5 h-5 text-[#0D9488] flex-shrink-0" />
              <p className="text-[#162836] font-bold text-sm leading-tight">{isAr ? 'مساعدة ذكية' : '24/7 AI'}</p>
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
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#162836] tracking-tight leading-[1.35]">{t.servicesTitle}</h2>
            <p className="text-slate-500 text-lg font-medium mt-3">{isAr ? 'تم تصميمها لراحتك ورعايتك' : 'Designed for your comfort and care'}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.services.map((svc, idx) => (
              <div 
                key={idx} 
                className={`
                  animate-fade-up stagger-${idx + 1}
                  bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-600/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group
                `}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-sm mb-6 ${idx === 0 ? 'bg-[#10B981]' : idx === 1 ? 'bg-[#0284C7]' : 'bg-[#162836]'}`}>
                    <svc.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-heading font-extrabold text-[#162836] mb-2.5">{svc.title}</h3>
                  <p className="text-slate-600 font-medium text-[15px] leading-relaxed mb-6">{svc.desc}</p>
                </div>
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
      <section className="w-full bg-[#162836] py-20 text-white rounded-none relative overflow-hidden mt-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0D9488]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 text-start">
            <h2 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-snug mb-4">
              {isAr ? 'المجموعة الأعلى موثوقية في الرعاية الصحية الذكية' : 'The Most Trusted Group in Smart Healthcare'}
            </h2>
            <p className="text-slate-300 font-medium leading-relaxed mb-8">
              {isAr ? 'نلتزم بتقديم أعلى مستويات الرعاية المتميزة، لنكون الخيار الأول لصحتك وصحة عائلتك.' : 'We are committed to delivering the highest standards of premium care, making us the first choice for your health.'}
            </p>
            <Link href="/register" className="inline-block bg-white text-[#162836] hover:bg-slate-100 font-bold px-7 py-3.5 rounded-lg transition-colors shadow-sm">
              {isAr ? 'انضم إلى شبكتنا' : 'Join Our Network'}
            </Link>
          </div>
          
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.stats.map((stat, idx) => {
              const StatIcon = [Stethoscope, Building2, Activity, Clock][idx] || HeartPulse;
              return (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-md flex items-center justify-between">
                  <div>
                    <div className="text-3xl lg:text-4xl font-heading font-extrabold text-[#162836] tabular-nums">{stat.value}</div>
                    <div className="text-sm font-bold text-slate-600 mt-1">{stat.label}</div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-teal-50 text-[#0D9488] flex items-center justify-center flex-shrink-0">
                    <StatIcon className="w-6 h-6" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CENTERS OF EXCELLENCE                                       */}
      {/* ============================================================ */}
      <section id="excellence" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#162836] tracking-tight leading-[1.35]">{t.excellenceTitle}</h2>
            <p className="text-slate-500 text-lg font-medium mt-3">{isAr ? 'رعاية متخصصة بمعايير عالمية' : 'Specialized care with global standards'}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.excellence.map((center, idx) => (
              <Link 
                key={idx} 
                href={`/chat?q=${isAr ? 'ابحث عن أطباء' : 'Find'} ${center.title} ${isAr ? '' : 'doctors'}`} 
                className={`
                  animate-fade-up stagger-${idx + 1}
                  group relative rounded-2xl h-[340px] overflow-hidden bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 block cursor-pointer
                `}
              >
                <Image src={center.image} alt={center.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#162836]/95 via-[#162836]/35 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-6 inset-x-6 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-heading font-extrabold text-white">{center.title}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 rtl:group-hover:translate-x-0 rtl:-translate-x-2">
                    <DirectionalArrow className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CORPORATE FOOTER                                             */}
      {/* ============================================================ */}
      <footer className="w-full bg-[#F4F6F8] border-t border-slate-200/90 text-[#162836] pt-14 pb-8 mt-auto rounded-none">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#162836] rounded-xl flex items-center justify-center">
                  <HeartPulse className="w-7 h-7 text-white" />
                </div>
                <span className="font-heading font-extrabold text-2xl tracking-tight text-[#162836]">HealTrip AI</span>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed max-w-md">
                {t.footer.desc}
              </p>
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-[#162836] mb-6 text-lg">{t.footer.links.navigation}</h4>
              <ul className="space-y-4 font-medium text-slate-600">
                <li><Link href="/" className="hover:text-[#0D9488] transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link></li>
                <li><Link href="/chat" className="hover:text-[#0D9488] transition-colors">{isAr ? 'المساعد الذكي' : 'AI Assistant'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-[#162836] mb-6 text-lg">{t.footer.links.providers}</h4>
              <ul className="space-y-4 font-medium text-slate-600">
                <li><Link href="/register" className="hover:text-[#0D9488] transition-colors">{isAr ? 'تسجيل منشأة' : 'Register Facility'}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200/80 mt-10 pt-6 text-sm font-medium text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>{t.footer.copyright}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

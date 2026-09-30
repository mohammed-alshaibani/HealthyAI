'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Message } from '../lib/api';
import { sendMessage } from '../lib/api';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { LanguageToggle } from './LanguageToggle';
import { HeartPulse, ChevronLeft, ChevronRight, RotateCcw, Navigation } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const TEXTS = {
  en: {
    title: 'HealTrip AI',
    status: 'Online',
    placeholder: 'Type your symptoms or search for a doctor...',
    prompts: [
      "Find a cardiologist in Riyadh",
      "Hospitals accepting insurance in Jeddah",
      "I have knee pain, which specialist should I see?"
    ],
    clear: 'Clear Chat',
    home: 'Back to Home',
    locate: 'Locate Me',
    locationActive: '📍 Location Active'
  },
  ar: {
    title: 'رحلة الشفاء الذكي',
    status: 'متصل الآن',
    placeholder: 'اكتب أعراضك أو ابحث عن طبيب...',
    prompts: [
      "ابحث عن طبيب قلب في الرياض",
      "مستشفيات تقبل التأمين في جدة",
      "أعاني من ألم في الركبة، أي تخصص يجب أن أزور؟"
    ],
    clear: 'مسح المحادثة',
    home: 'العودة للرئيسية',
    locate: 'تحديد موقعي',
    locationActive: '📍 تم تحديد موقعك'
  },
};

export function ChatWindow() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [resolvedLocation, setResolvedLocation] = useState<{cityEn: string, cityAr: string, districtEn: string, districtAr: string} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  
  const t = TEXTS[lang];
  const isAr = lang === 'ar';

  const handleSend = async (content: string) => {
    // Auto-locate if asking for nearest but location not set
    let activeLocation = location;
    const isAskingForNearest = /(near|nearest|closest|أقرب|قريب)/i.test(content);
    
    if (isAskingForNearest && !activeLocation && 'geolocation' in navigator) {
      try {
        setIsLocating(true);
        activeLocation = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            reject,
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        });
        setLocation(activeLocation);
      } catch {
        // Continue without location
      } finally {
        setIsLocating(false);
      }
    }

    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(newMessages, conversationId, activeLocation || undefined, lang);
      setMessages([...newMessages, response.message]);
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }
      if (response.resolvedLocation) {
        setResolvedLocation(response.resolvedLocation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (q && messages.length === 0) {
      // eslint-disable-next-line
      handleSend(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleClear = () => {
    setMessages([]);
    setConversationId(undefined);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans transition-colors duration-200 py-6 px-4 md:py-10" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
        
        {/* Chat Header Bar */}
        <header className="flex-none bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#0D9488] transition-colors" title={t.home}>
              {isAr ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-[#0D9488] rounded-xl flex items-center justify-center shadow-inner">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="font-extrabold text-[#162836] text-lg tracking-tight leading-tight">{t.title}</h1>
                <p className="text-xs text-[#0D9488] font-bold mt-1.5">{t.status}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => {
                if (location) {
                  setLocation(null);
                  setResolvedLocation(null);
                  return;
                }
                if ('geolocation' in navigator) {
                  setIsLocating(true);
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                      setIsLocating(false);
                    },
                    () => {
                      alert(isAr ? 'تعذر الوصول إلى الموقع' : 'Could not access location');
                      setIsLocating(false);
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                  );
                }
              }} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors ${location ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
              title={t.locate}
            >
              <Navigation className={`w-4 h-4 ${location ? 'fill-emerald-500 text-emerald-600' : isLocating ? 'animate-pulse' : ''}`} />
              {location ? (
                resolvedLocation ? (
                  isAr ? `📍 موقعك: ${resolvedLocation.cityAr} - ${resolvedLocation.districtAr}` : `📍 Location: ${resolvedLocation.cityEn} - ${resolvedLocation.districtEn}`
                ) : t.locationActive
              ) : t.locate}
            </button>
            <button onClick={handleClear} disabled={messages.length === 0} className="p-2.5 rounded-xl text-slate-400 hover:text-[#0D9488] hover:bg-red-50 transition-colors disabled:opacity-50" title={t.clear}>
              <RotateCcw className="w-5 h-5" />
            </button>
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 text-sm font-medium text-center border-b border-red-100 flex items-center justify-center gap-2">
            {error}
          </div>
        )}

        <MessageList messages={messages} isLoading={isLoading} />
        
        {/* Quick Prompts & Input */}
        <div className="flex-none bg-white border-t border-slate-100 p-4 pb-6">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {t.prompts.map((prompt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-5 py-2.5 text-sm font-bold text-[#0D9488] bg-[#0D9488]/10 hover:bg-[#0D9488] hover:text-white rounded-xl transition-all text-start leading-snug"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <ChatInput onSend={handleSend} isLoading={isLoading} placeholder={t.placeholder} />
        </div>
      </div>
    </div>
  );
}

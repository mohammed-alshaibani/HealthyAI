'use client';

import { useState } from 'react';
import type { Message } from '../lib/api';
import { sendMessage } from '../lib/api';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { LanguageToggle } from './LanguageToggle';

const TEXTS = {
  en: {
    title: 'HealTrip AI',
    subtitle: 'Find doctors and hospitals in Saudi Arabia',
    placeholder: 'e.g. Find a cardiologist in Riyadh...',
  },
  ar: {
    title: 'رحلة الشفاء الذكي',
    subtitle: 'ابحث عن الأطباء والمستشفيات في المملكة العربية السعودية',
    placeholder: 'مثال: ابحث عن طبيب قلب في الرياض...',
  },
};

export function ChatWindow() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const t = TEXTS[lang];

  const handleSend = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(newMessages, conversationId);
      
      setMessages([...newMessages, response.message]);
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Revert optimistic update on error, or keep it and show error below
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-200"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <header className="flex-none bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path fillRule="evenodd" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">{t.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.subtitle}</p>
          </div>
        </div>
        <LanguageToggle lang={lang} setLang={setLang} />
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 text-sm font-medium text-center border-b border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} placeholder={t.placeholder} />
    </div>
  );
}

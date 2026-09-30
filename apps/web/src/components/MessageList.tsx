import { useEffect, useRef } from 'react';
import type { Message } from '../lib/api';
import { MessageBubble } from './MessageBubble';
import { HeartPulse } from 'lucide-react';

type Props = {
  messages: Message[];
  isLoading: boolean;
};

export function MessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 space-y-4 pt-10 pb-20">
            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center shadow-sm">
              <HeartPulse className="w-8 h-8" />
            </div>
            <p className="text-center max-w-sm text-balance">
              Start a conversation to find doctors and hospitals near you.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)
        )}

        {isLoading && (
          <div className="flex w-full gap-3 justify-start mb-6">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mt-1 shadow-sm">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl rounded-tl-sm rtl:rounded-tr-sm rtl:rounded-tl-3xl px-5 py-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}

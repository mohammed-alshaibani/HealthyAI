import type { Message } from '../lib/api';
import { HeartPulse } from 'lucide-react';

type Props = {
  message: Message;
};

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F8FAFC] border border-slate-200 flex items-center justify-center mt-1 shadow-sm">
          <HeartPulse className="w-4 h-4 text-[#0D9488]" />
        </div>
      )}
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 whitespace-pre-wrap leading-relaxed shadow-sm text-sm sm:text-base font-medium ${
          isUser
            ? 'bg-[#0D9488] text-white rounded-3xl rounded-tr-sm rtl:rounded-tl-sm rtl:rounded-tr-3xl'
            : 'bg-[#F8FAFC] text-[#162836] border border-slate-200 rounded-3xl rounded-tl-sm rtl:rounded-tr-sm rtl:rounded-tl-3xl'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

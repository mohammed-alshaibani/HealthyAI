import type { Message } from '../lib/api';

type Props = {
  message: Message;
};

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm rtl:rounded-tl-sm rtl:rounded-tr-2xl'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-sm rtl:rounded-tr-sm rtl:rounded-tl-2xl'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

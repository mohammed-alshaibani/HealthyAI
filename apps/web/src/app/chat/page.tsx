import { ChatWindow } from '@/components/ChatWindow';
import { Suspense } from 'react';

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <ChatWindow />
    </Suspense>
  );
}

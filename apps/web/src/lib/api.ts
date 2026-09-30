export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatResponse = {
  conversationId: string;
  message: Message;
};

export type ChatError = {
  error: {
    code: string;
    message: string;
  };
};

export async function sendMessage(
  messages: Message[],
  conversationId?: string,
  location?: { lat: number, lng: number },
  language?: 'ar' | 'en'
): Promise<ChatResponse> {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      conversationId,
      location,
      language,
    }),
  });

  if (!res.ok) {
    const errorData = (await res.json()) as ChatError;
    throw new Error(errorData.error?.message || 'Failed to send message');
  }

  return res.json();
}

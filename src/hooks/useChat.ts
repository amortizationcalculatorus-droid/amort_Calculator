import { useState, useRef, useEffect, useCallback } from 'react';
import { streamChat } from '@/lib/chatStream';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 **Hi! I'm AmortIQ AI** — your personal financial intelligence assistant.\n\nI can help you with:\n- 🏠 **Mortgage & loan calculations**\n- 💡 **Payment optimization strategies**\n- 📊 **Understanding amortization**\n- 💰 **Personal finance guidance**\n- 🧭 **Navigating this platform**\n\nWhat would you like to explore?`,
  timestamp: new Date(),
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setError(null);

    const abortController = new AbortController();
    abortRef.current = abortController;

    // Build API messages (exclude welcome)
    const apiMessages = [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    let assistantContent = '';
    const assistantId = `assistant-${Date.now()}`;

    await streamChat({
      messages: apiMessages,
      signal: abortController.signal,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.id === assistantId) {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [
            ...prev,
            { id: assistantId, role: 'assistant', content: assistantContent, timestamp: new Date() },
          ];
        });
      },
      onDone: () => {
        setIsStreaming(false);
        abortRef.current = null;
      },
      onError: (errMsg) => {
        setError(errMsg);
        setIsStreaming(false);
        abortRef.current = null;
      },
    });
  }, [messages, isStreaming]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setIsStreaming(false);
    setError(null);
  }, []);

  return { messages, isStreaming, error, sendMessage, stopStreaming, clearChat };
}

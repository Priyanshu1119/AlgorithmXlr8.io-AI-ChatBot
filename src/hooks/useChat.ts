import { useState, useCallback } from 'react';
import type { Message } from '../types';
import { sendMessage } from '../services/groqApi';

export function useChat(apiKey: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      // 1. Instantly append user message to UI state safely
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        // 2. FIXED: Construct payload by reading current messages state array 
        // inline + adding the new user message instantly.
        let freshHistory: Message[] = [];
        setMessages((prev) => {
          freshHistory = [...prev]; 
          return prev;
        });

        // If freshHistory wasn't captured correctly by the side effect, fall back safely
        const payload = freshHistory.length > 0 ? freshHistory : [...messages, userMsg];

        const reply = await sendMessage(payload, apiKey);
        
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        };
        
        // 3. Securely append AI reply using functional updater logic
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, apiKey] // Keep dependencies accurate
  );

  const clearMessages = () => setMessages([]);

  return { messages, isLoading, error, send, clearMessages };
}
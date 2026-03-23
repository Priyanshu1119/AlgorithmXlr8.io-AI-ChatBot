import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import ChatInput from './components/ChatInput';
import EmptyState from './components/EmptyState';
import ApiKeyModal from './components/ApiKeyModal';
import { useChat } from './hooks/useChat';
import { useTheme } from './context/ThemeContext';

const API_KEY_STORAGE = 'algorithmxlr8_groq_key';
const ENV_KEY = import.meta.env.VITE_GROQ_API_KEY ?? '';

export default function App() {
  const { theme, toggle } = useTheme();
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(API_KEY_STORAGE) ?? ENV_KEY);
  const [showApiModal, setShowApiModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, error, send, clearMessages } = useChat(apiKey);

  const isLoggedIn = !!apiKey;
  const isEmpty = messages.length === 0 && !isLoading;
  const isDark = theme === 'dark';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleApiKeySave = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE, key);
    setApiKey(key);
    setShowApiModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
    clearMessages();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {showApiModal && <ApiKeyModal onSave={handleApiKeySave} />}

      <Sidebar
        onNewChat={clearMessages}
        onSettings={() => setShowApiModal(true)}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative' }}>

        {/* Theme toggle — top right corner */}
        <div style={{ position: 'absolute', top: 12, right: 14, display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}>
          {!isEmpty && (
            <button
              onClick={clearMessages}
              style={{
                padding: '5px 12px', borderRadius: 7,
                border: '1px solid var(--border-2)', background: 'transparent',
                color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)'; }}
            >
              New chat
            </button>
          )}
          <button
            onClick={toggle}
            title={isDark ? 'Light mode' : 'Dark mode'}
            style={{
              width: 32, height: 32, borderRadius: 7, border: '1px solid var(--border-2)',
              background: 'transparent', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-3)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)'; }}
          >
            {isDark ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7a5 5 0 100 10A5 5 0 0012 7zm0-5a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm0 17a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zm9-9h1a1 1 0 010 2h-1a1 1 0 010-2H3a1 1 0 010-2h1zm14.95 6.24l.71.71a1 1 0 01-1.41 1.41l-.71-.71a1 1 0 011.41-1.41zM5.76 5.76l-.71-.71A1 1 0 116.47 3.64l.71.71A1 1 0 015.76 5.76zm12.72 0a1 1 0 010-1.41l.71-.71a1 1 0 011.41 1.41l-.71.71a1 1 0 01-1.41 0zM5.05 18.95a1 1 0 010-1.41l.71-.71a1 1 0 011.41 1.41l-.71.71a1 1 0 01-1.41 0z"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {isEmpty ? (
            <EmptyState onPrompt={send} onLogin={() => setShowApiModal(true)} isLoggedIn={isLoggedIn} />
          ) : (
            <div style={{ paddingBottom: 20, paddingTop: 16 }}>
              {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
              {isLoading && <TypingIndicator />}
              {error && (
                <div style={{ maxWidth: 720, margin: '12px auto', padding: '0 24px' }}>
                  <div style={{
                    padding: '11px 16px', borderRadius: 10, fontSize: 13,
                    background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)',
                    color: '#f87171',
                  }}>
                    {error}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {!isEmpty && <ChatInput onSend={send} isLoading={isLoading} />}
      </div>
    </div>
  );
}

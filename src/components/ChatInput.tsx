import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';

interface Props {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: Props) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  // Safely recalculates scroll height configurations inline
  const adjustHeight = (reset = false) => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    if (!reset) {
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 180)}px`;
    }
  };

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue('');
    // Safely sync wrapper dimensions to standard row bounds after clear
    setTimeout(() => adjustHeight(true), 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // e.nativeEvent.isComposing prevents submission during active character generation
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const canSend = !!value.trim() && !isLoading;

  return (
    <div style={{ padding: '8px 24px 16px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div
          className={focused ? 'input-focused' : ''}
          style={{
            background: 'var(--bg-3)',
            border: '1px solid',
            borderColor: focused ? 'var(--blue)' : 'var(--border)',
            borderRadius: 16,
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            boxShadow: focused ? '0 0 0 2px var(--blue-dark)' : '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ padding: '14px 18px 6px' }}>
            <textarea
              ref={ref}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ask about DSA or System Design..."
              rows={1}
              style={{
                width: '100%', background: 'none', border: 'none', outline: 'none',
                color: 'var(--text)', fontSize: 14, resize: 'none',
                lineHeight: 1.65, maxHeight: 180, display: 'block',
              }}
            />
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 12px 10px',
          }}>
            <button style={{
              width: 28, height: 28, borderRadius: 7,
              border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-4)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s', flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text-3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-4)'; }}
              title="Attach"
              type="button"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 11, color: 'var(--text-4)', fontWeight: 500,
                padding: '3px 9px', borderRadius: 6,
                border: '1px solid var(--border)',
                letterSpacing: '0.03em',
              }}>llama-3.3-70b</span>

              <button
                onClick={handleSend}
                disabled={!canSend}
                type="button"
                style={{
                  width: 32, height: 32, borderRadius: 9, border: 'none', flexShrink: 0,
                  background: canSend ? 'var(--blue-dark)' : 'var(--bg-4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: canSend ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  boxShadow: canSend ? '0 0 10px rgba(37,99,235,0.35)' : 'none',
                }}
                onMouseEnter={e => { if (canSend) e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {isLoading ? (
                  <div style={{
                    width: 12, height: 12, border: '2px solid transparent',
                    borderTop: `2px solid ${canSend ? '#fff' : 'var(--text-4)'}`,
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                  }} />
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={canSend ? '#fff' : 'var(--text-4)'}>
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-4)', marginTop: 8, letterSpacing: '0.01em' }}>
          DSA &amp; System Design only · Shift+Enter for new line
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';

interface Props {
  onPrompt: (text: string) => void;
  onLogin: () => void;
  isLoggedIn: boolean;
}

const CHIPS = [
  'System Design HLD',
  'DSA & Algorithms',
  'LeetCode Problems',
  'Design Patterns',
];

export default function EmptyState({ onPrompt, onLogin, isLoggedIn }: Props) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  // Helper function to safely manage input layout sizing runs
  const adjustHeight = (reset = false) => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    if (!reset) {
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 140)}px`;
    }
  };

  const handleSend = () => {
    if (!value.trim()) return;
    if (!isLoggedIn) { onLogin(); return; }
    
    onPrompt(value.trim());
    setValue('');
    // Safely sync textarea layout dimensions to standard row footprint
    setTimeout(() => adjustHeight(true), 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // e.nativeEvent.isComposing guarantees system IME input selection blocks submission
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleChip = (label: string) => {
    if (!isLoggedIn) { onLogin(); return; }
    onPrompt(label);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100%', padding: '40px 24px',
      boxSizing: 'border-box', overflowY: 'auto',
    }}>

      {/* Logo centered above greeting */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, #1e2a4a, #1a3a6e)',
          border: '1px solid #2563eb44',
          marginBottom: 14,
          boxShadow: '0 0 24px rgba(37,99,235,0.2)',
        }}>
          <div style={{ position: 'relative', width: 30, height: 30, overflow: 'hidden' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#60a5fa" className="logo-lightning">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="bolt-shine" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Algorithm<span style={{ color: 'var(--blue)' }}>Xlr8.ai</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
            Built by Engineers, For Engineers
          </div>
        </div>
      </div>

      {/* Greeting */}
      <h1 style={{
        fontSize: 40, fontWeight: 600, color: 'var(--text)',
        letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: 32,
        textAlign: 'center',
      }}>
        Hey Engineers,
      </h1>

      {/* Input */}
      <div style={{ width: '100%', maxWidth: 660, marginBottom: 14 }}>
        <div
          className={focused ? 'input-focused' : ''}
          style={{
            background: 'var(--bg-3)',
            border: '1px solid',
            borderColor: focused ? 'var(--blue)' : 'var(--border)',
            borderRadius: 18,
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            boxShadow: focused ? '0 0 0 2px var(--blue-dark)' : '0 2px 12px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ padding: '18px 20px 10px' }}>
            <textarea
              ref={ref}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="How can I help you today?"
              rows={2}
              style={{
                width: '100%', background: 'none', border: 'none',
                outline: 'none', color: 'var(--text)', fontSize: 15,
                resize: 'none', lineHeight: 1.65, maxHeight: 140, display: 'block',
              }}
            />
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 14px 14px',
          }}>
            <button style={{
              width: 30, height: 30, borderRadius: 8,
              border: '1px solid var(--border-2)',
              background: 'transparent', color: 'var(--text-4)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text-3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-4)'; }}
              title="Attach"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
                disabled={!value.trim()}
                type="button"
                style={{
                  width: 34, height: 34, borderRadius: 10, border: 'none',
                  background: value.trim() ? 'var(--blue-dark)' : 'var(--bg-4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: value.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  boxShadow: value.trim() ? '0 0 12px rgba(37,99,235,0.4)' : 'none',
                }}
                onMouseEnter={e => { if (value.trim()) e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={value.trim() ? '#fff' : 'var(--text-4)'}>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 660 }}>
        {CHIPS.map(label => (
          <button key={label} onClick={() => handleChip(label)} type="button"
            style={{
              padding: '8px 16px', borderRadius: 99,
              border: '1px solid var(--border-2)',
              background: 'var(--bg-3)',
              color: 'var(--text-3)', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-4)';
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.borderColor = 'var(--text-4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-3)';
              e.currentTarget.style.color = 'var(--text-3)';
              e.currentTarget.style.borderColor = 'var(--border-2)';
            }}
          >
            {label}
          </button>
        ))}
      </div>

    </div>
  );
}
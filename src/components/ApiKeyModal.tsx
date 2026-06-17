import { useState, FormEvent } from 'react';

interface Props {
  onSave: (key: string) => void;
}

export default function ApiKeyModal({ onSave }: Props) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevents page reload
    
    let trimmed = key.trim();

    // Auto-fix common prefix duplication bugs (like ggsk_)
    if (trimmed.startsWith('ggsk_')) {
      trimmed = trimmed.substring(1);
    }

    // Comprehensive format verification
    if (!trimmed.startsWith('gsk_') || trimmed.length < 25) {
      setError('Enter a valid Groq API key starting with gsk_');
      return;
    }

    onSave(trimmed);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
    }}>
      {/* Changed layout container wrapper to an semantic HTML Form element */}
      <form onSubmit={handleSubmit} style={{
        width: '100%', maxWidth: 400,
        background: 'var(--bg-2)', border: '1px solid var(--border-2)',
        borderRadius: 18, padding: 32,
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--blue)" className="logo-lightning" style={{ flexShrink: 0 }}>
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em', margin: 0 }}>
              Algorithm<span style={{ color: 'var(--blue)' }}>Xlr8.ai</span>
            </h1>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>DSA & System Design AI</p>
        </div>

        {/* Capabilities */}
        <div style={{
          background: 'var(--bg)', borderRadius: 12,
          border: '1px solid var(--border)', padding: '14px 16px', marginBottom: 24,
        }}>
          {['Data Structures & Algorithms', 'System Design HLD & LLD',
            'Big O Complexity Analysis', 'Design Patterns & SOLID',
            'LeetCode Problem Walkthroughs'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', fontSize: 13, color: 'var(--text-2)' }}>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0 }} />
              {item}
            </div>
          ))}
        </div>

        {/* Input */}
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Groq API Key
        </label>
        <input
          type="password"
          value={key}
          onChange={e => { setKey(e.target.value); setError(''); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="gsk_••••••••••••••••••••"
          style={{
            width: '100%', padding: '11px 14px',
            background: 'var(--bg)',
            // Cleaned up border logic interpolation for smoother transitions
            border: '1px solid',
            borderColor: error ? '#dc2626' : focused ? 'var(--blue-dark)' : 'var(--border-2)',
            borderRadius: 10, outline: 'none',
            color: 'var(--text)', fontSize: 14, transition: 'border-color 0.15s ease', marginBottom: 6,
          }}
        />
        {error && <p style={{ fontSize: 12, color: '#dc2626', marginBottom: 8 }}>{error}</p>}

        <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', fontSize: 12, color: 'var(--blue)', marginBottom: 20, textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          Get your free API key at console.groq.com →
        </a>

        {/* Changed button to native submit type */}
        <button type="submit"
          style={{
            width: '100%', padding: '12px', borderRadius: 11,
            border: 'none', background: 'var(--blue-dark)', color: '#fff',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Continue
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-4)', marginTop: 14 }}>
          Stored locally · Never shared
        </p>
      </form>
    </div>
  );
}
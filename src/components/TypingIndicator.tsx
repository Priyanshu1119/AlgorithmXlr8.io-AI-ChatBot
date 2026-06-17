import { useEffect } from 'react';

export default function TypingIndicator() {
  // Inject the typing bounce keyframes safely to ensure zero dependencies on external CSS files
  useEffect(() => {
    const id = 'xlr8-typing-indicator-styles';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.innerHTML = `
      @keyframes xlr8Bounce {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50% { transform: translateY(-4px); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const dotStyle = (delay: string): React.CSSProperties => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--text-4)',
    animation: 'xlr8Bounce 1.4s infinite ease-in-out',
    animationDelay: delay,
    display: 'inline-block',
  });

  return (
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        
        {/* Avatar Container */}
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: 'var(--bg-3)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--blue)"
            style={{ filter: 'drop-shadow(0 0 4px #3b82f6aa)' }}>
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Indicator Animation Wave */}
        <div style={{ flex: 1, paddingTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-4)', marginBottom: 12, letterSpacing: '0.02em' }}>
            AlgorithmXlr8
          </div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 10 }}>
            {/* FIXED: Added explicit stagger sequences using non-blocking transform matrix delays */}
            <div style={dotStyle('0s')} />
            <div style={dotStyle('0.2s')} />
            <div style={dotStyle('0.4s')} />
          </div>
        </div>

      </div>
    </div>
  );
}
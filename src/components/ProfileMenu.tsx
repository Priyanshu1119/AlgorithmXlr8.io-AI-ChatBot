import { useState, useEffect, useRef, KeyboardEvent } from 'react';

interface Props {
  onSettings: () => void;
  onLogout: () => void;
}

export default function ProfileMenu({ onSettings, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // FIXED: Ensure the target node is genuinely mounted in the document DOM tree before checking containment
      if (ref.current && target && document.body.contains(target) && !ref.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // FIXED: Handle standard accessibility keyboard escaping natively
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const menuItem = (onClick: () => void, children: React.ReactNode, danger = false) => (
    <button 
      onClick={onClick}
      type="button"
      role="menuitem"
      tabIndex={open ? 0 : -1} // FIXED: Prevent hidden background elements from catching tab highlights
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', border: 'none', background: 'transparent',
        color: danger ? '#dc2626' : 'var(--text-2)', fontSize: 13,
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
      }}
      onMouseEnter={e => { 
        e.currentTarget.style.background = danger ? 'rgba(220,38,38,0.08)' : 'var(--bg-4)'; 
        if (!danger) e.currentTarget.style.color = 'var(--text)'; 
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.background = 'transparent'; 
        e.currentTarget.style.color = danger ? '#dc2626' : 'var(--text-2)'; 
      }}
    >
      {children}
    </button>
  );

  return (
    <div ref={ref} onKeyDown={handleKeyDown} style={{ position: 'relative' }}>
      <button 
        onClick={() => setOpen(v => !v)}
        type="button"
        aria-haspopup="true"
        aria-expanded={open} // FIXED: Expose the structural interaction framework safely to standard screen readers
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 10, border: 'none',
          background: open ? 'var(--bg-4)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-4)')}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#fff',
        }}>U</div>
        
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>My Profile</div>
          <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 1 }}>Free Plan</div>
        </div>
        
        <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--text-4)"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div 
          role="menu"
          aria-label="Profile options"
          style={{
            position: 'absolute', bottom: '100%', left: 8, right: 8, marginBottom: 6,
            background: 'var(--bg-2)', border: '1px solid var(--border-2)',
            borderRadius: 12, boxShadow: 'var(--shadow)', overflow: 'hidden', zIndex: 100,
          }}
        >
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#fff',
              }}>U</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>User</div>
                <div style={{ fontSize: 11, color: 'var(--text-4)' }}>Free Plan · Groq API</div>
              </div>
            </div>
          </div>

          {menuItem(() => { onSettings(); setOpen(false); },
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>Settings</>
          )}

          {menuItem(() => { window.open('https://console.groq.com', '_blank'); setOpen(false); },
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>Pricing & Plans</>
          )}

          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

          {menuItem(() => { onLogout(); setOpen(false); },
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>Logout</>, true
          )}
        </div>
      )}
    </div>
  );
}
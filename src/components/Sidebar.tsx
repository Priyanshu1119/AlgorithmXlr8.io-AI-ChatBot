import { useState, useEffect, useRef, KeyboardEvent } from 'react';

interface Props {
  onNewChat: () => void;
  onSettings: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
}

function SideBtn({
  title, onClick, active, children,
}: { title: string; onClick?: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button 
      title={title} 
      onClick={onClick}
      type="button" // FIXED: Prevent form submit side-effects
      style={{
        width: 38, height: 38, borderRadius: 10, border: 'none',
        background: active ? 'var(--bg-4)' : 'transparent',
        color: active ? 'var(--text)' : 'var(--text-4)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text-2)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.background = active ? 'var(--bg-4)' : 'transparent';
        e.currentTarget.style.color = active ? 'var(--text)' : 'var(--text-4)';
      }}
    >
      {children}
    </button>
  );
}

function ProfileDropup({ onSettings, onLogout }: { onSettings: () => void; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // FIXED: Added validity verification routine to ensure target node is currently alive in the active document frame
      if (ref.current && target && document.body.contains(target) && !ref.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={ref} onKeyDown={handleKeyDown} style={{ position: 'relative' }}>
      {open && (
        <div 
          role="menu"
          aria-label="Profile navigation options"
          style={{
            position: 'absolute', bottom: '100%', left: 4, marginBottom: 10,
            width: 200, background: 'var(--bg-3)', border: '1px solid var(--border-2)',
            borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            overflow: 'hidden', zIndex: 200,
          }}
        >
          {/* User row */}
          <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>My Profile</div>
            <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 1 }}>Free Plan</div>
          </div>

          {[
            { label: 'Settings', fn: onSettings }, 
            { label: 'Pricing & Plans', fn: () => {} }
          ].map(item => (
            <button 
              key={item.label} 
              onClick={() => { item.fn(); setOpen(false); }}
              type="button"
              role="menuitem"
              tabIndex={open ? 0 : -1}
              style={{
                width: '100%', padding: '9px 14px', border: 'none', background: 'transparent',
                color: 'var(--text-2)', fontSize: 13, cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-4)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >{item.label}</button>
          ))}

          <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />

          <button 
            onClick={() => { onLogout(); setOpen(false); }}
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            style={{
              width: '100%', padding: '9px 14px', border: 'none', background: 'transparent',
              color: '#f87171', fontSize: 13, cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >Logout</button>
        </div>
      )}

      <button 
        onClick={() => setOpen(v => !v)} 
        title="Profile"
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          width: 34, height: 34, borderRadius: '50%', border: '2px solid transparent',
          background: 'linear-gradient(135deg, #1d4ed8, #60a5fa)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
          transition: 'box-shadow 0.15s, transform 0.1s active',
          boxShadow: open ? '0 0 0 3px var(--blue-bg)' : 'none',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 3px var(--blue-bg)')}
        onMouseLeave={e => { if (!open) e.currentTarget.style.boxShadow = 'none'; }}
      >U</button>
    </div>
  );
}

export default function Sidebar({ onNewChat, onSettings, onLogout, isLoggedIn }: Props) {
  return (
    <aside style={{
      width: 54, flexShrink: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '12px 0',
      height: '100%', background: 'var(--bg-2)',
      borderRight: '1px solid var(--border)',
      gap: 4,
      boxSizing: 'border-box' // FIXED: Avoid container expansion from padding increments
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 24, height: 24, overflow: 'hidden' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#60a5fa" className="logo-lightning">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div className="bolt-shine" />
        </div>
      </div>

      {/* New chat */}
      <SideBtn title="New chat" onClick={onNewChat}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </SideBtn>

      {/* Search */}
      <SideBtn title="Search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </SideBtn>

      {/* History */}
      <SideBtn title="History">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
        </svg>
      </SideBtn>

      <div style={{ flex: 1 }} />

      {/* Bottom: profile or login */}
      {isLoggedIn ? (
        <ProfileDropup onSettings={onSettings} onLogout={onLogout} />
      ) : (
        <SideBtn title="Login" onClick={onSettings}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </SideBtn>
      )}
    </aside>
  );
}
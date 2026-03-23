export default function TypingIndicator() {
  return (
    <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
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
        <div style={{ flex: 1, paddingTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-4)', marginBottom: 12, letterSpacing: '0.02em' }}>
            AlgorithmXlr8
          </div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <div className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-4)' }} />
            <div className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-4)' }} />
            <div className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-4)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

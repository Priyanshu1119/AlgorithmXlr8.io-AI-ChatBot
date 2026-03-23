import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message } from '../types';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className="fade-up" style={{
      padding: '18px 24px',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', gap: 14, alignItems: 'flex-start' }}>

        {/* Avatar */}
        {isUser ? (
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', marginTop: 2,
            letterSpacing: '0.02em',
          }}>
            U
          </div>
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: 'var(--bg-3)', border: '1px solid var(--border-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 2,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#3b82f6"
              style={{ filter: 'drop-shadow(0 0 3px #3b82f6aa)' }}>
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--text-3)',
            marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {isUser ? 'You' : 'AlgorithmXlr8'}
          </div>

          {isUser ? (
            <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {message.content}
            </div>
          ) : (
            <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75 }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <div style={{ margin: '14px 0', borderRadius: 10, overflow: 'hidden', border: '1px solid #1f1f1f' }}>
                        <div style={{
                          padding: '6px 14px', background: '#0a0a0a',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          borderBottom: '1px solid #1f1f1f',
                        }}>
                          <span style={{ fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.08em' }}>
                            {match[1].toUpperCase()}
                          </span>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus as any}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, borderRadius: 0, fontSize: 13, background: '#0d0d0d', padding: '16px' }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code style={{
                        background: 'var(--bg-4)', color: '#60a5fa',
                        padding: '2px 6px', borderRadius: 5,
                        fontSize: 12.5, fontFamily: 'monospace',
                        border: '1px solid var(--border-2)',
                      }}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => <h1 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text)', margin: '20px 0 8px', letterSpacing: '-0.03em' }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '16px 0 6px', letterSpacing: '-0.02em' }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', margin: '12px 0 4px', letterSpacing: '-0.01em' }}>{children}</h3>,
                  strong: ({ children }) => <strong style={{ fontWeight: 600, color: 'var(--text)' }}>{children}</strong>,
                  p: ({ children }) => <p style={{ marginBottom: 10, color: 'var(--text-2)', lineHeight: 1.75 }}>{children}</p>,
                  ul: ({ children }) => <ul style={{ paddingLeft: 20, marginBottom: 10, color: 'var(--text-2)' }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ paddingLeft: 20, marginBottom: 10, color: 'var(--text-2)' }}>{children}</ol>,
                  li: ({ children }) => <li style={{ marginBottom: 3, lineHeight: 1.7 }}>{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote style={{
                      borderLeft: '3px solid var(--blue-dark)', paddingLeft: 14,
                      margin: '12px 0', color: 'var(--text-3)', fontStyle: 'italic',
                    }}>
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div style={{ overflowX: 'auto', margin: '14px 0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th style={{
                      padding: '7px 14px', textAlign: 'left', fontWeight: 600,
                      background: 'var(--bg-3)', color: 'var(--text-3)', fontSize: 11,
                      borderBottom: '1px solid var(--border-2)', letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>{children}</th>
                  ),
                  td: ({ children }) => (
                    <td style={{
                      padding: '8px 14px', borderBottom: '1px solid var(--border)', color: 'var(--text-2)',
                    }}>{children}</td>
                  ),
                  hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

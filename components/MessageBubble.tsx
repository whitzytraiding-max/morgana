'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CatAvatar from './CatAvatar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
            borderRadius: '18px 18px 4px 18px',
            padding: '11px 16px',
            maxWidth: '75%',
            color: '#ede9fe',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            wordBreak: 'break-word',
            boxShadow: '0 2px 12px rgba(109, 40, 217, 0.3)',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-start' }}>
      <CatAvatar size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.7rem',
            color: '#7c5cbf',
            marginBottom: '6px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>✦</span> Morgana
        </div>
        <div
          className="prose-morgana"
          style={{
            color: '#ccc8e8',
            fontSize: '0.95rem',
            lineHeight: '1.7',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                return isInline ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    style={oneDark as any}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      background: '#12102a',
                      border: '1px solid #2a2050',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      margin: '0.75rem 0',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

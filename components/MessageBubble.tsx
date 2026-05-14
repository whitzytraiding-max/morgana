'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div
          style={{
            background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
            borderRadius: '18px 18px 4px 18px',
            padding: '10px 16px',
            maxWidth: '75%',
            color: '#fff',
            fontSize: '0.95rem',
            lineHeight: '1.55',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div style={{ maxWidth: '85%' }}>
        <div
          style={{
            fontSize: '0.7rem',
            color: '#7c5cbf',
            marginBottom: '4px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Morgana
        </div>
        <div
          className="prose-morgana"
          style={{
            color: '#d4d4e8',
            fontSize: '0.95rem',
            lineHeight: '1.65',
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
                      background: '#1a1a2e',
                      border: '1px solid #2a2a3a',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
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
